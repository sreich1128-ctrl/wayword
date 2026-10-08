// Generates natural-voice audio for every phrase, once, with Microsoft Azure neural text-to-speech.
// Output: content/audio/<lang>/{f,m}/<concept id>.mp3 + content/audio/<lang>/manifest.json
//
// Setup (once): put your key in .env.local (git-ignored, never committed):
//   AZURE_SPEECH_KEY=...
//   AZURE_SPEECH_REGION=westeurope
// Run:
//   node scripts/generate-audio.mjs --dry-run            # what would be generated, character count
//   node scripts/generate-audio.mjs --lang=pt-PT         # one language
//   node scripts/generate-audio.mjs                      # all languages (skips files that exist)
//   node scripts/generate-audio.mjs --lang=pt-PT --force # regenerate
//
// The phrase text sent is exactly the dataset's target text, with two spoken-only tweaks:
// "___" becomes a short pause, and "word/ending" alternatives are read as the first form
// (or both forms with a pause when they're whole words, e.g. ближайший/ближайшая).
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

function env() {
  const out = { ...process.env };
  const f = join(root, '.env.local');
  if (existsSync(f)) {
    for (const line of readFileSync(f, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
      if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return out;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const PAUSE = '<break time="450ms"/>';

// Spoken form of the target text (display text is never changed).
export function spokenSsml(target) {
  const tokens = target.split(/(\s+)/).map((tok) => {
    if (tok.trim() === '/') return PAUSE; // "amuzantă / amuzant": read both, with a pause
    if (!tok.includes('/') || /^\s+$/.test(tok)) return esc(tok);
    const m = tok.match(/^([^\p{L}\p{M}]*)(.+?)([^\p{L}\p{M}]*)$/u);
    const [, pre, core, post] = m || ['', '', tok, ''];
    const [a, ...rest] = core.split('/');
    const b = rest.join('/');
    if (!a || !b) return esc(tok.replace('/', ' '));
    const ending = b.length <= 3 && b.length < a.length;
    return ending ? esc(pre + a + post) : `${esc(pre + a)}${PAUSE}${esc(b + post)}`;
  });
  return tokens.join('').replace(/\s\/\s/g, PAUSE).replace(/_{2,}/g, PAUSE);
}

async function synth({ key, region, locale, voice, text }) {
  const ssml = `<speak version="1.0" xml:lang="${locale}"><voice name="${voice}"><prosody rate="-6%">${text}</prosody></voice></speak>`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'wayword-audio',
      },
      body: ssml,
    });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    if (res.status === 401 || res.status === 403) throw new Error(`Azure rejected the key (${res.status}). Check AZURE_SPEECH_KEY and AZURE_SPEECH_REGION in .env.local.`);
    if (res.status === 429 || res.status >= 500) { await new Promise((r) => setTimeout(r, 1500 * attempt)); continue; }
    throw new Error(`Azure error ${res.status}: ${await res.text()}`);
  }
  throw new Error('Azure kept rate-limiting; try again in a minute.');
}

async function main() {
  const voices = read('content/audio-voices.json');
  const langs = read('content/languages.json').map((l) => l.code).filter((c) => !args.lang || c === args.lang);
  if (!langs.length) throw new Error(`Unknown --lang=${args.lang}`);
  const { AZURE_SPEECH_KEY: key, AZURE_SPEECH_REGION: region } = env();
  if (!args['dry-run'] && (!key || !region)) throw new Error('Missing AZURE_SPEECH_KEY / AZURE_SPEECH_REGION (see the top of this file).');

  let chars = 0; let made = 0; let skipped = 0;
  for (const code of langs) {
    const cfg = voices[code];
    if (!cfg) { console.log(`- ${code}: no voices configured, skipped`); continue; }
    const entries = read(`content/lang/${code}.json`).entries;
    const dir = join(root, 'content/audio', code);
    const files = {};
    for (const [vid, [voice]] of [['f', cfg.female], ['m', cfg.male]]) {
      mkdirSync(join(dir, vid), { recursive: true });
      for (const e of entries) {
        const rel = `${vid}/${e.id}.mp3`;
        const out = join(dir, rel);
        const text = spokenSsml(e.target);
        chars += e.target.length;
        if (existsSync(out) && !args.force) { skipped++; (files[e.id] ||= {})[vid] = rel; continue; }
        if (args['dry-run']) continue;
        writeFileSync(out, await synth({ key, region, locale: cfg.locale, voice, text }));
        (files[e.id] ||= {})[vid] = rel;
        made++;
        process.stdout.write('.');
      }
    }
    if (!args['dry-run']) {
      writeFileSync(join(dir, 'manifest.json'), JSON.stringify({
        source: 'Azure neural voices',
        generated: new Date().toISOString().slice(0, 10),
        note: cfg.note || '',
        voices: [
          { id: 'f', name: cfg.female[1], gender: 'female', engine: cfg.female[0] },
          { id: 'm', name: cfg.male[1], gender: 'male', engine: cfg.male[0] },
        ],
        files,
      }, null, 2));
      console.log(`\n✓ ${code}: ${Object.keys(files).length} phrases`);
    }
  }
  console.log(`${args['dry-run'] ? 'Would send' : 'Sent'} ~${chars} characters · generated ${made} · already there ${skipped}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main().catch((err) => { console.error('✗', err.message); process.exit(1); });
