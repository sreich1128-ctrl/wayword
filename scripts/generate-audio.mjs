// Generates natural-voice audio for every phrase, once, and stores it with the app.
// Output: content/audio/<lang>/<voice slot>/<concept id>.mp3 + content/audio/<lang>/manifest.json
// The app plays these when present and falls back to the phone's voice for anything missing.
//
// Two engines (set up whichever you have; keys live in .env.local or Wayword.keys.info.local, both git-ignored):
//
//   ElevenLabs (default):  ELEVENLABS_API_KEY=...
//     node scripts/generate-audio.mjs --list-voices          # your voices, with accent/gender, to pick from
//     node scripts/generate-audio.mjs --dry-run              # what would be generated + character count
//     node scripts/generate-audio.mjs --lang=pt-PT           # one language
//     node scripts/generate-audio.mjs                        # every language in content/audio-voices.json
//   Voices and skipped languages are set in content/audio-voices.json -> "elevenlabs".
//
//   Azure:  AZURE_SPEECH_KEY=...  AZURE_SPEECH_REGION=westeurope
//     node scripts/generate-audio.mjs --engine=azure [--lang=..] [--dry-run]
//
// Existing files are skipped unless --force. The text sent is the dataset's target text, with two
// spoken-only tweaks: "___" becomes a short pause, and "word/ending" alternatives are read as the
// first form (or both forms with a pause when they're whole words, e.g. ближайший/ближайшая).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function env() {
  const out = { ...process.env };
  // Keys can live in .env.local or Wayword.keys.info.local (both git- and Vercel-ignored).
  const f = ['.env.local', 'Wayword.keys.info.local'].map((n) => join(root, n)).find((p) => existsSync(p));
  if (f) {
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return out;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Spoken form of the target text (display text is never changed).
// style 'ssml' (Azure) uses <break/> tags; 'plain' (ElevenLabs) uses "…" for the pauses.
export function spokenText(target, style = 'ssml') {
  const PAUSE = style === 'ssml' ? '<break time="450ms"/>' : ' … ';
  const e = style === 'ssml' ? esc : (s) => s;
  const tokens = target.split(/(\s+)/).map((tok) => {
    if (tok.trim() === '/') return PAUSE; // "amuzantă / amuzant": read both, with a pause
    if (!tok.includes('/') || /^\s+$/.test(tok)) return e(tok);
    const m = tok.match(/^([^\p{L}\p{M}]*)(.+?)([^\p{L}\p{M}]*)$/u);
    const [, pre, core, post] = m || ['', '', tok, ''];
    const [a, ...rest] = core.split('/');
    const b = rest.join('/');
    if (!a || !b) return e(tok.replace('/', ' '));
    const ending = b.length <= 3 && b.length < a.length;
    return ending ? e(pre + a + post) : `${e(pre + a)}${PAUSE}${e(b + post)}`;
  });
  return tokens.join('').replace(/_{2,}/g, PAUSE).replace(/\s+/g, ' ').trim();
}
export const spokenSsml = (t) => spokenText(t, 'ssml');

/* ---------- Azure ---------- */

async function azureSynth({ key, region, locale, voice, text }) {
  const ssml = `<speak version="1.0" xml:lang="${locale}"><voice name="${voice}"><prosody rate="-6%">${text}</prosody></voice></speak>`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: { 'Ocp-Apim-Subscription-Key': key, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'wayword-audio' },
      body: ssml,
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status === 401 || res.status === 403) throw new Error(`Azure rejected the key (${res.status}). Check AZURE_SPEECH_KEY / AZURE_SPEECH_REGION in .env.local.`);
    if (res.status === 429 || res.status >= 500) { await sleep(1500 * attempt); continue; }
    throw new Error(`Azure error ${res.status}: ${await res.text()}`);
  }
  throw new Error('Azure kept rate-limiting; try again in a minute.');
}

/* ---------- ElevenLabs ---------- */

async function elevenVoices(key) {
  const res = await fetch('https://api.elevenlabs.io/v1/voices', { headers: { 'xi-api-key': key } });
  if (res.status === 401) throw new Error('ElevenLabs rejected the key. Check ELEVENLABS_API_KEY in .env.local.');
  if (!res.ok) throw new Error(`ElevenLabs error ${res.status}: ${await res.text()}`);
  return (await res.json()).voices || [];
}

async function elevenSynth({ key, voiceId, model, text }) {
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_64`, {
      method: 'POST',
      headers: { 'xi-api-key': key, 'Content-Type': 'application/json', Accept: 'audio/mpeg' },
      body: JSON.stringify({ text, model_id: model, voice_settings: { stability: 0.6, similarity_boost: 0.75, speed: 0.95 } }),
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    const body = await res.text();
    if (res.status === 401) throw new Error('ElevenLabs rejected the key. Check ELEVENLABS_API_KEY in .env.local.');
    if (/quota|credits|limit/i.test(body) && res.status !== 429) throw new Error(`ElevenLabs: out of characters for this month. ${body.slice(0, 200)}`);
    if (res.status === 429 || res.status >= 500) { await sleep(2000 * attempt); continue; }
    throw new Error(`ElevenLabs error ${res.status}: ${body.slice(0, 300)}`);
  }
  throw new Error('ElevenLabs kept rate-limiting; try again in a minute.');
}

/* ---------- main ---------- */

function writeManifest(code, voice, files, source, note) {
  const dir = join(root, 'content/audio', code);
  const path = join(dir, 'manifest.json');
  const old = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { voices: [], files: {} };
  const voices = [...old.voices.filter((v) => v.id !== voice.id), voice];
  const merged = { ...old.files };
  for (const [id, byVoice] of Object.entries(files)) merged[id] = { ...(merged[id] || {}), ...byVoice };
  writeFileSync(path, JSON.stringify({ source, generated: new Date().toISOString().slice(0, 10), note: note || old.note || '', voices, files: merged }, null, 2));
}

async function main() {
  const engine = args.engine || 'elevenlabs';
  const cfg = read('content/audio-voices.json');
  const e = env();

  if (args['list-voices']) {
    if (!e.ELEVENLABS_API_KEY) throw new Error('Missing ELEVENLABS_API_KEY in .env.local.');
    for (const v of await elevenVoices(e.ELEVENLABS_API_KEY)) {
      const l = v.labels || {};
      console.log(`${v.name.padEnd(28)} ${[l.gender, l.accent, l.language, l.age, l.description].filter(Boolean).join(' · ')}  [${v.voice_id}]`);
    }
    return;
  }

  const all = read('content/languages.json').map((l) => l.code);
  const el = cfg.elevenlabs || {};
  const langs = all
    .filter((c) => !args.lang || c === args.lang)
    .filter((c) => engine !== 'elevenlabs' || args.lang || !(el.skip || []).includes(c));
  if (!langs.length) throw new Error(`Nothing to do for --lang=${args.lang}`);

  let resolve = null;
  if (engine === 'elevenlabs' && !args['dry-run']) {
    if (!e.ELEVENLABS_API_KEY) throw new Error('Missing ELEVENLABS_API_KEY in .env.local.');
    const mine = await elevenVoices(e.ELEVENLABS_API_KEY);
    resolve = (name) => {
      const v = mine.find((x) => x.name.toLowerCase() === String(name).toLowerCase()) || mine.find((x) => x.voice_id === name);
      if (!v) throw new Error(`Voice "${name}" isn't in your ElevenLabs account. Run --list-voices, or add it from the Voice Library first.`);
      return v;
    };
  }
  if (engine === 'azure' && !args['dry-run'] && (!e.AZURE_SPEECH_KEY || !e.AZURE_SPEECH_REGION)) throw new Error('Missing AZURE_SPEECH_KEY / AZURE_SPEECH_REGION in .env.local.');

  let chars = 0; let made = 0; let skipped = 0;
  for (const code of langs) {
    const entries = read(`content/lang/${code}.json`).entries;
    const jobs = [];
    if (engine === 'elevenlabs') {
      const pick = (el.voices || {})[code] || (el.voices || {})['*'];
      if (!pick) { console.log(`- ${code}: no ElevenLabs voice set in content/audio-voices.json, skipped`); continue; }
      const v = resolve ? resolve(pick.name) : { name: pick.name, voice_id: '(dry run)', labels: {} };
      const gender = pick.gender || v.labels?.gender || '';
      jobs.push({ slot: pick.slot || (gender === 'male' ? 'm' : 'f'), name: pick.label || v.name, gender, engineId: `elevenlabs:${v.voice_id}`,
        synth: (text) => elevenSynth({ key: e.ELEVENLABS_API_KEY, voiceId: v.voice_id, model: el.model || 'eleven_multilingual_v2', text }),
        style: 'plain', source: 'ElevenLabs', note: pick.note || cfg[code]?.note });
    } else {
      const c = cfg[code];
      if (!c) { console.log(`- ${code}: no Azure voices configured, skipped`); continue; }
      for (const [slot, [voice, name], gender] of [['f', c.female, 'female'], ['m', c.male, 'male']]) {
        jobs.push({ slot, name, gender, engineId: `azure:${voice}`, style: 'ssml', source: 'Azure neural voices', note: c.note,
          synth: (text) => azureSynth({ key: e.AZURE_SPEECH_KEY, region: e.AZURE_SPEECH_REGION, locale: c.locale, voice, text }) });
      }
    }
    for (const job of jobs) {
      const files = {};
      mkdirSync(join(root, 'content/audio', code, job.slot), { recursive: true });
      for (const entry of entries) {
        const rel = `${job.slot}/${entry.id}.mp3`;
        const out = join(root, 'content/audio', code, rel);
        const text = spokenText(entry.target, job.style);
        if (existsSync(out) && !args.force) { skipped++; files[entry.id] = { [job.slot]: rel }; continue; }
        chars += text.length;
        if (args['dry-run']) continue;
        writeFileSync(out, await job.synth(text));
        files[entry.id] = { [job.slot]: rel };
        made++;
        process.stdout.write('.');
      }
      if (!args['dry-run']) {
        writeManifest(code, { id: job.slot, name: job.name, gender: job.gender, engine: job.engineId }, files, job.source, job.note);
        console.log(`\n✓ ${code} · ${job.name}: ${Object.keys(files).length} phrases`);
      } else console.log(`- ${code} · ${job.name}: ${entries.length} phrases`);
    }
  }
  console.log(`${args['dry-run'] ? 'Would use' : 'Used'} ~${chars} characters · generated ${made} · already there ${skipped}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((err) => { console.error('✗', err.message); process.exit(1); });
