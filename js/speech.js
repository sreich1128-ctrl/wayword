// Device text-to-speech: best-voice picking, speed, and play / pause / resume.
// Buttons opt in with data-say="<phrase key>"; their label tracks the playback state.
import { store } from './store.js';

export const SPEEDS = [
  { id: 'normal', label: '1×', rate: 0.95 },
  { id: 'slow', label: '¾×', rate: 0.72 },
  { id: 'slower', label: '½×', rate: 0.5 },
];

// Apple's novelty/"Eloquence" voices sound the most robotic, so rank them last.
const ROBOTIC = /^(Eddy|Flo|Grandma|Grandpa|Reed|Rocko|Sandy|Shelley|Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox)\b/i;

const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
let voices = [];
const listeners = new Set();

function loadVoices() {
  voices = supported ? speechSynthesis.getVoices() : [];
  listeners.forEach((fn) => fn());
}
if (supported) {
  loadVoices();
  speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}
export const onVoices = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };

function score(v, bcp47, regions = []) {
  const lang = v.lang.replace('_', '-');
  let s = 0;
  if (regions.some((r) => lang.toLowerCase() === r.toLowerCase())) s += 8;
  if (lang.toLowerCase() === bcp47.toLowerCase()) s += 4;
  if (/premium|enhanced|neural|natural|siri/i.test(v.name)) s += 6;
  if (/google/i.test(v.name)) s += 3;
  if (v.localService) s += 1; // works offline
  if (ROBOTIC.test(v.name)) s -= 10;
  return s;
}

// Voices for this language, best-sounding first.
export function voicesFor(bcp47, regions = []) {
  const base = bcp47.split('-')[0].toLowerCase();
  return voices
    .filter((v) => v.lang.replace('_', '-').toLowerCase().split('-')[0] === base)
    .sort((a, b) => score(b, bcp47, regions) - score(a, bcp47, regions));
}

export const inRegions = (v, regions = []) => regions.some((r) => v.lang.replace('_', '-').toLowerCase() === r.toLowerCase());

function chosenVoice(code, bcp47, regions) {
  const list = voicesFor(bcp47, regions);
  const saved = (store.prefs().voices || {})[code];
  return list.find((v) => v.voiceURI === saved) || list[0] || null;
}

export const speed = () => SPEEDS.find((s) => s.id === store.prefs().speed) || SPEEDS[0];

export function cycleSpeed() {
  const i = SPEEDS.indexOf(speed());
  store.setPref('speed', SPEEDS[(i + 1) % SPEEDS.length].id);
  syncButtons();
}

/* ---------- playback ---------- */

let current = { key: null, status: 'idle' }; // status: idle | playing | paused

function setStatus(key, status) {
  current = { key, status };
  syncButtons();
}

function start(key, text, code, bcp47, regions) {
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/_{2,}/g, ' … '));
  u.lang = bcp47;
  u.voice = chosenVoice(code, bcp47, regions);
  u.rate = speed().rate;
  u.onstart = () => setStatus(key, 'playing');
  u.onend = u.onerror = () => { if (current.key === key && current.status !== 'paused') setStatus(null, 'idle'); };
  
  setStatus(key, 'playing');
  speechSynthesis.speak(u);
}

// Tap once to play, again to pause, again to resume. A different phrase interrupts.
export function toggle(key, text, code, bcp47, regions) {
  if (!supported || !text) return;
  if (current.key === key && current.status === 'playing') {
    speechSynthesis.pause();
    setStatus(key, 'paused');
  } else if (current.key === key && current.status === 'paused') {
    // Some Android browsers treat pause as stop; restart the phrase in that case.
    if (speechSynthesis.paused && speechSynthesis.speaking) {
      speechSynthesis.resume();
      setStatus(key, 'playing');
    } else start(key, text, code, bcp47, regions);
  } else {
    start(key, text, code, bcp47, regions);
  }
}

export function stop() {
  if (!supported) return;
  speechSynthesis.cancel();
  setStatus(null, 'idle');
}

export function preview(code, bcp47, voiceURI, text, regions) {
  if (!supported) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = bcp47;
  u.voice = voicesFor(bcp47, regions).find((v) => v.voiceURI === voiceURI) || null;
  u.rate = speed().rate;
  speechSynthesis.speak(u);
}

const LABEL = { idle: 'Listen', playing: 'Pause', paused: 'Resume' };

export function syncButtons(root = document) {
  root.querySelectorAll('[data-say]').forEach((b) => {
    const st = b.dataset.say === current.key ? current.status : 'idle';
    b.dataset.state = st;
    b.setAttribute('aria-label', LABEL[st]);
    const span = b.querySelector('span');
    if (span) span.textContent = LABEL[st];
  });
  root.querySelectorAll('[data-action="speed"]').forEach((b) => {
    b.textContent = speed().label;
    b.setAttribute('aria-label', `Speech speed ${speed().label}`);
  });
}

export const speechSupported = supported;
