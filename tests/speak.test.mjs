// Mic timing: "Speak now" should come as soon as the recording is live, and a pre-opened (warm)
// mic should make that near-instant. Fakes a slow mic and a slow speech recognizer.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const MIC_MS = 300; // how long the fake mic takes to open
globalThis.window = globalThis;
globalThis.localStorage = { getItem: () => null, setItem() {} };
globalThis.requestAnimationFrame = () => 0;
globalThis.cancelAnimationFrame = () => {};
window.webkitSpeechRecognition = class { start() { setTimeout(() => this.onaudiostart?.(), 1000); } stop() { this.onend?.(); } };
window.MediaRecorder = class { constructor() { this.state = 'inactive'; } start() { this.state = 'recording'; } stop() { this.state = 'inactive'; this.onstop?.(); } static isTypeSupported() { return true; } };
const stream = () => ({ active: true, getTracks: () => [{ stop() {} }] });
Object.defineProperty(globalThis, 'navigator', {
  value: {
    userAgent: 'x', platform: 'x', maxTouchPoints: 0,
    permissions: { query: async () => ({ state: 'granted' }) },
    mediaDevices: { getUserMedia: () => new Promise((r) => setTimeout(() => r(stream()), MIC_MS)) },
  },
});
const mic = await import('../js/speak.js');

const readyAfter = (opts) => new Promise((resolve) => {
  const t0 = Date.now();
  const c = mic.capture({ asrLang: 'fr-FR', mode: 'both', onReady: () => { resolve(Date.now() - t0); c.stop(); }, ...opts });
});

test('Speak now comes when the recording is live, not after the slow speech check', async () => {
  const ms = await readyAfter();
  assert.ok(ms >= MIC_MS && ms < MIC_MS + 300, `ready after ${ms} ms`);
});

test('a pre-opened mic makes the tap record almost at once', async () => {
  await mic.prewarm();
  const ms = await readyAfter();
  assert.ok(ms < 150, `ready after ${ms} ms with a warm mic`);
});
