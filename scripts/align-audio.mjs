// Word timings for the recorded audio, for karaoke and tap-to-hear (js/karaoke.js).
// Sends each recording and its text to ElevenLabs forced alignment once, and saves the start/end of
// every written word to content/audio/<lang>/timings.json. The app never calls ElevenLabs.
// Phrases already in timings.json are skipped, so reruns only pay for new recordings.
//
//   node scripts/align-audio.mjs --lang=pt-PT --limit=3     # a trial: the first 3 not yet done
//   node scripts/align-audio.mjs --lang=pt-PT               # everything not yet done
//   node scripts/align-audio.mjs --lang=pt-PT --only=hello,thank_you --force
//
// Key: ELEVENLABS_API_KEY in .env.local or Wayword.keys.info.local (git-ignored; never printed).
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spokenText } from './generate-audio.mjs';
import { displayWords, timesFromChars } from '../js/karaoke.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(process.argv.slice(2).map((a) => a.replace(/^--/, '').split('=')).map(([k, v]) => [k, v ?? true]));
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function apiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY;
  const f = ['.env.local', 'Wayword.keys.info.local'].map((n) => join(root, n)).find((p) => existsSync(p));
  const m = f && readFileSync(f, 'utf8').match(/^\s*ELEVENLABS_API_KEY\s*=\s*["']?(.*?)["']?\s*$/m);
  if (!m) throw new Error('No ELEVENLABS_API_KEY found');
  return m[1];
}

// The written text of every recorded id: dataset phrases, drafts, and Swap it sentences.
function textsFor(code) {
  const out = new Map();
  for (const e of read(`content/lang/${code}.json`).entries) if (e.target) out.set(e.id, e.target);
  const addedPath = join(root, 'content/added', `${code}.json`);
  if (existsSync(addedPath)) {
    const a = JSON.parse(readFileSync(addedPath, 'utf8'));
    for (const e of a.entries || []) if (!out.has(e.id)) out.set(e.id, e.target);
    for (const [pid, list] of Object.entries(a.examples || {})) for (const x of list) out.set(`${pid}~${x.word}`, x.target);
  }
  return out;
}

async function align(key, file, text) {
  const form = new FormData();
  form.append('file', new Blob([readFileSync(file)], { type: 'audio/mpeg' }), 'audio.mp3');
  form.append('text', text);
  for (let attempt = 1; attempt <= 3; attempt++) {
    const res = await fetch('https://api.elevenlabs.io/v1/forced-alignment', { method: 'POST', headers: { 'xi-api-key': key }, body: form });
    if (res.ok) return res.json();
    const body = await res.text();
    if (res.status === 401 || res.status === 402 || res.status === 422) throw new Error(`ElevenLabs ${res.status}: ${body.slice(0, 200)}`);
    await sleep(1500 * attempt);
  }
  throw new Error('ElevenLabs kept failing');
}

async function main() {
  const code = args.lang || 'pt-PT';
  const dir = join(root, 'content/audio', code);
  const manifest = read(`content/audio/${code}/manifest.json`);
  const outPath = join(dir, 'timings.json');
  const saved = existsSync(outPath) ? JSON.parse(readFileSync(outPath, 'utf8')) : { note: '', voices: {} };
  const texts = textsFor(code);
  const only = args.only ? new Set(String(args.only).split(',')) : null;
  const key = apiKey();
  let done = 0; let skipped = 0; let seconds = 0;
  const failed = [];

  for (const [id, byVoice] of Object.entries(manifest.files)) {
    if (only && !only.has(id)) continue;
    for (const [voice, rel] of Object.entries(byVoice)) {
      const have = saved.voices[voice] ||= {};
      if (have[id] && !args.force) { skipped++; continue; }
      if (args.limit && done >= Number(args.limit)) continue;
      const target = texts.get(id);
      if (!target) { failed.push(`${id}: no text`); continue; }
      const words = displayWords(target);
      const spoken = words.map((w) => spokenText(w, 'plain').replace(/\s*…\s*/g, ' ').trim());
      const r = await align(key, join(dir, rel), spoken.join(' '));
      const times = timesFromChars(spoken, r.characters);
      if (!times) { failed.push(`${id}: characters didn't line up`); continue; }
      have[id] = times;
      seconds += times.at(-1)[1];
      done++;
      console.log(`${id}  ${words.map((w, i) => `${w} ${times[i][0].toFixed(2)}–${times[i][1].toFixed(2)}`).join(' · ')}  (loss ${r.loss?.toFixed(3)})`);
      await sleep(250);
    }
  }
  saved.note = 'Start/end seconds of each written word in each recording (scripts/align-audio.mjs, ElevenLabs forced alignment). Words: js/karaoke.js displayWords.';
  saved.generated = new Date().toISOString().slice(0, 10);
  writeFileSync(outPath, JSON.stringify(saved) + '\n');
  console.log(`aligned ${done} (~${seconds.toFixed(0)} s of speech) · already done ${skipped}${failed.length ? ` · failed ${failed.length}:\n  ${failed.join('\n  ')}` : ''}`);
}

main().catch((err) => { console.error('✗', err.message); process.exit(1); });
