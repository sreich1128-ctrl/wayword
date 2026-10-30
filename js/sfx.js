// Little sounds and buzzes that make answers feel answered. Made with Web Audio (no files, no
// downloads). Muted with More → Sounds. Call only from a tap: phones only allow audio after one.
import { store } from './store.js';

let ctx = null;
const on = () => store.prefs().sfx !== false;

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume?.();
  return ctx;
}

// One soft note: sine with a quick attack and a gentle fade.
function note(freq, start, dur = 0.14, gain = 0.12, type = 'sine') {
  const a = audio();
  if (!a) return;
  const t = a.currentTime + start;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

// Only after a real tap (browsers refuse otherwise); iPhones don't vibrate for web apps at all.
const buzz = (pattern) => { try { if (navigator.userActivation?.hasBeenActive !== false) navigator.vibrate?.(pattern); } catch { /* not supported */ } };

export const sfx = {
  enabled: on,
  set(onOff) { store.setPref('sfx', !!onOff); },
  // A light tick for placing a tile or a chip.
  tap() { if (!on()) return; note(660, 0, 0.05, 0.05, 'triangle'); },
  // Right: a quick rising pair.
  right() { if (!on()) return; note(784, 0, 0.12); note(1175, 0.09, 0.2); buzz(12); },
  // Not quite: one low, soft note (never harsh).
  wrong() { if (!on()) return; note(220, 0, 0.22, 0.1, 'triangle'); buzz([25, 40, 25]); },
  // Combo milestone: three bright notes.
  combo() { if (!on()) return; [988, 1319, 1568].forEach((f, i) => note(f, i * 0.07, 0.16, 0.09)); },
  // Session finished: a small arpeggio.
  done() { if (!on()) return; [523, 659, 784, 1047].forEach((f, i) => note(f, i * 0.1, 0.28, 0.1)); buzz([15, 60, 15]); },
};
