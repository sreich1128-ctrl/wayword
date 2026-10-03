// Device text-to-speech: voice choice, speed, play / pause / resume / replay / loop.
// Anything can subscribe() to playback changes (the mini player and Listen buttons do).
import { store } from './store.js';
import { voiceGender } from './voices.js';

export const SPEEDS = [
  { id: 'x050', label: '0.5×', rate: 0.5 },
  { id: 'x075', label: '0.75×', rate: 0.72 },
  { id: 'x100', label: '1×', rate: 0.95 },
  { id: 'x125', label: '1.25×', rate: 1.2 },
  { id: 'x150', label: '1.5×', rate: 1.45 },
];
const LEGACY = { normal: 'x100', slow: 'x075', slower: 'x050' };

// Apple's novelty/"Eloquence" voices sound the most robotic, so rank them last.
const ROBOTIC = /^(Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley|Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox)\b/i;

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
let voices = [];
const voiceListeners = new Set();

function loadVoices() {
  voices = speechSupported ? speechSynthesis.getVoices() : [];
  voiceListeners.forEach((fn) => fn());
}
if (speechSupported) {
  loadVoices();
  speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}
export const onVoices = (fn) => { voiceListeners.add(fn); return () => voiceListeners.delete(fn); };

const norm = (l) => l.replace('_', '-').toLowerCase();

function score(v, bcp47, regions = []) {
  const lang = norm(v.lang);
  let s = 0;
  if (regions.some((r) => lang === r.toLowerCase())) s += 8;
  if (lang === bcp47.toLowerCase()) s += 4;
  if (/premium|enhanced|neural|natural|siri/i.test(v.name)) s += 6;
  if (/google/i.test(v.name)) s += 3;
  if (v.localService) s += 1; // works offline
  if (ROBOTIC.test(v.name)) s -= 10;
  return s;
}

export const inRegions = (v, regions = []) => regions.some((r) => norm(v.lang) === r.toLowerCase());

// Voices for a language, best-sounding first, each tagged with a gender when known.
export function voicesFor(lang) {
  const base = lang.bcp47.split('-')[0].toLowerCase();
  return voices
    .filter((v) => norm(v.lang).split('-')[0] === base)
    .sort((a, b) => score(b, lang.bcp47, lang.regions) - score(a, lang.bcp47, lang.regions))
    .map((v) => ({ voice: v, gender: voiceGender(v.name), levantine: inRegions(v, lang.regions), novelty: ROBOTIC.test(v.name) }))
    .filter((x, _, all) => !x.novelty || all.every((y) => y.novelty)); // hide novelty voices unless they're all there is
}

export function chosenVoice(lang) {
  const list = voicesFor(lang);
  const saved = (store.prefs().voices || {})[lang.code];
  return (list.find((x) => x.voice.voiceURI === saved) || list[0] || {}).voice || null;
}

export function setVoice(lang, voiceURI) {
  store.setPref('voices', { ...(store.prefs().voices || {}), [lang.code]: voiceURI });
  if (state.item) replay();
}

export const speed = () => {
  const id = LEGACY[store.prefs().speed] || store.prefs().speed;
  return SPEEDS.find((s) => s.id === id) || SPEEDS[2];
};

export function setSpeed(id) {
  store.setPref('speed', id);
  emit();
  if (state.status === 'playing') replay(); // speech engines can't change rate mid-phrase
}

export function stepSpeed(dir) {
  const i = SPEEDS.indexOf(speed());
  const next = SPEEDS[Math.max(0, Math.min(SPEEDS.length - 1, i + dir))];
  if (next !== speed()) setSpeed(next.id);
}

/* ---------- playback ---------- */

// item: { key, text, lang: { code, bcp47, regions } }
const state = { item: null, status: 'idle', loop: false };
const listeners = new Set();
let loopTimer = null;
let utterId = 0;

export const getState = () => state;
export const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
function emit() { listeners.forEach((fn) => fn(state)); }

function set(status) { state.status = status; emit(); }

function start(item, onDone) {
  clearTimeout(loopTimer);
  speechSynthesis.cancel();
  const id = ++utterId;
  const u = new SpeechSynthesisUtterance(item.text.replace(/_{2,}/g, ' … '));
  u.lang = item.lang.bcp47;
  u.voice = chosenVoice(item.lang);
  u.rate = speed().rate;
  u.onend = () => {
    if (id !== utterId || state.status === 'paused') return;
    if (onDone) { onDone(); return; }
    if (state.loop) {
      set('gap');
      loopTimer = setTimeout(() => { if (state.loop && state.item === item) start(item); }, 1600);
    } else set('done');
  };
  u.onerror = () => { if (id === utterId) set('done'); };
  state.item = item;
  set('playing');
  speechSynthesis.speak(u);
}

// Tap once to play, again to pause, again to resume. A different phrase interrupts.
export function toggle(item) {
  if (!speechSupported || !item.text) return;
  const same = state.item && state.item.key === item.key;
  if (same && state.status === 'playing') pause();
  else if (same && state.status === 'paused') resume();
  else start(item);
}

export function play(item, onDone) { if (speechSupported && item.text) start(item, onDone); }

export function pause() {
  if (state.status === 'gap') { clearTimeout(loopTimer); set('paused'); return; }
  speechSynthesis.pause();
  set('paused');
}

export function resume() {
  // Some browsers treat pause as stop; replay the phrase in that case.
  if (speechSynthesis.paused && speechSynthesis.speaking) { speechSynthesis.resume(); set('playing'); }
  else replay();
}

export function replay() { if (state.item) start(state.item); }

export function setLoop(on) {
  state.loop = on;
  emit();
  if (on && state.item && (state.status === 'done' || state.status === 'idle')) start(state.item);
}

export function stop() {
  clearTimeout(loopTimer);
  utterId++;
  if (speechSupported) speechSynthesis.cancel();
  state.item = null;
  state.loop = false;
  set('idle');
}
