// "Say it" practice: records your voice for playback and, where the browser can,
// transcribes it so you can see which words came through.
//
// Three capture modes, because phones differ:
//   record    - MediaRecorder only: you hear yourself back, with a live level meter (default on iPhone/iPad)
//   recognize - speech recognition only: shows which words came through, no playback
//   both      - both at once (default elsewhere; works on desktop Chrome and most Android)
// The Mic check screen tests the device and saves the mode that actually works.

import { store } from './store.js';

const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
export const canRecord = typeof navigator !== 'undefined' && !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
export const canRecognize = !!SR;
export const isAppleMobile = typeof navigator !== 'undefined'
  && (/iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

export function micMode() {
  const saved = store.prefs().micMode;
  const ok = (m) => (m === 'record' && canRecord) || (m === 'recognize' && canRecognize) || (m === 'both' && canRecord && canRecognize);
  if (saved && ok(saved)) return saved;
  if (isAppleMobile && canRecord) return 'record';
  if (canRecord && canRecognize) return 'both';
  return canRecord ? 'record' : canRecognize ? 'recognize' : 'none';
}
export const setMicMode = (m) => store.setPref('micMode', m);

// iOS: let playback ignore the silent switch, and switch to record mode only while recording.
export function setAudioSession(type) {
  try { if (navigator.audioSession) navigator.audioSession.type = type; } catch { /* unsupported */ }
}

function pickMime() {
  for (const t of ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm', 'audio/ogg']) {
    if (window.MediaRecorder?.isTypeSupported?.(t)) return t;
  }
  return '';
}

// Starts listening. Call it straight from a tap (phones require that).
// Returns { stop(), done }. done resolves to a report:
//   { mode, url, ms, mime, peak, transcript, recError, srError }
// onLevel(0..1) fires ~30x/second while recording; onInterim(text) as words arrive.
export function capture({ asrLang, mode = micMode(), maxMs = 10000, onLevel, onInterim } = {}) {
  const useRec = (mode === 'record' || mode === 'both') && canRecord;
  const useSR = (mode === 'recognize' || mode === 'both') && canRecognize;
  const report = { mode, url: null, ms: 0, mime: '', peak: 0, transcript: '', recError: null, srError: null };

  let recorder = null;
  let stream = null;
  let rec = null;
  let ctx = null;
  let raf = 0;
  let started = 0;
  let stopping = false;
  let finished = false;
  let recDone = !useRec;
  let srDone = !useSR;
  let resolveDone;
  const done = new Promise((r) => { resolveDone = r; });
  const chunks = [];

  const finish = () => {
    if (finished) return;
    finished = true;
    clearTimeout(maxTimer);
    cancelAnimationFrame(raf);
    try { ctx?.close(); } catch { /* ignore */ }
    stream?.getTracks().forEach((t) => t.stop());
    setAudioSession('playback');
    report.transcript = report.transcript.trim();
    resolveDone(report);
  };
  const maybeFinish = () => { if (recDone && srDone) finish(); };

  const stop = () => {
    if (stopping) return;
    stopping = true;
    try { if (recorder && recorder.state !== 'inactive') recorder.stop(); else recDone = true; } catch { recDone = true; }
    try { rec?.stop(); } catch { srDone = true; }
    // Don't keep the person waiting on a slow recognizer: give it a second, then move on.
    setTimeout(() => { srDone = true; maybeFinish(); }, 1200);
    setTimeout(() => { recDone = true; srDone = true; finish(); }, 3000);
    maybeFinish();
  };
  const maxTimer = setTimeout(stop, maxMs);

  if (useRec) {
    setAudioSession('play-and-record');
    // Create the audio context inside the tap so iOS lets it run.
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { ctx = null; }
    navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } }).then((s) => {
      stream = s;
      // Stopped while the permission prompt / mic was still opening: release it right away,
      // or the mic stays on and the next try finds it busy.
      if (stopping || finished) { s.getTracks().forEach((t) => t.stop()); recDone = true; maybeFinish(); return; }
      const mime = pickMime();
      report.mime = mime;
      recorder = new MediaRecorder(s, mime ? { mimeType: mime } : undefined);
      recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
      recorder.onstop = () => {
        report.ms = Date.now() - started;
        if (chunks.length) report.url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || mime || 'audio/webm' }));
        else if (!report.recError) report.recError = 'empty';
        recDone = true;
        maybeFinish();
      };
      recorder.onerror = (e) => { report.recError = e.error?.name || 'recorder-error'; };
      recorder.start(250); // small slices, so a quick stop still has audio
      started = Date.now();

      if (ctx) {
        ctx.resume?.();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 512;
        ctx.createMediaStreamSource(s).connect(analyser);
        const buf = new Uint8Array(analyser.fftSize);
        let heardVoice = false;
        let quietSince = 0;
        const tick = () => {
          analyser.getByteTimeDomainData(buf);
          let sum = 0;
          for (const v of buf) { const x = (v - 128) / 128; sum += x * x; }
          const level = Math.min(1, Math.sqrt(sum / buf.length) * 4);
          report.peak = Math.max(report.peak, level);
          onLevel?.(level);
          // Hands-free: once you’ve spoken, ~1.2s of quiet ends the take.
          if (level > 0.12) { heardVoice = true; quietSince = 0; }
          else if (heardVoice && level < 0.04) {
            quietSince ||= Date.now();
            if (Date.now() - quietSince > 1200) stop();
          }
          if (!finished) raf = requestAnimationFrame(tick);
        };
        tick();
      }
    }).catch((e) => {
      report.recError = e.name || 'mic-failed';
      recDone = true;
      maybeFinish();
    });
  }

  if (useSR) {
    try {
      rec = new SR();
      rec.lang = asrLang;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.continuous = false;
      rec.onresult = (e) => {
        let text = '';
        for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + ' ';
        report.transcript = text;
        onInterim?.(text.trim());
      };
      rec.onerror = (e) => { report.srError = e.error || 'error'; };
      rec.onend = () => {
        srDone = true;
        // The recognizer decides you've finished: end the take (only if it heard words,
        // so a recognizer error doesn't cut the recording short).
        if (!useRec) stop();
        else if (report.transcript.trim()) setTimeout(stop, 400);
        maybeFinish();
      };
      rec.start();
    } catch (e) {
      report.srError = e.name || 'start-failed';
      srDone = true;
    }
  }

  if (!useRec && !useSR) { report.recError = 'unsupported'; finish(); }
  return { stop, done };
}

// Plain-English reason for a failed capture, or '' if it worked.
export function explain(r) {
  const blocked = ['NotAllowedError', 'SecurityError'];
  if (blocked.includes(r.recError) || (!r.url && ['not-allowed', 'service-not-allowed'].includes(r.srError))) {
    return 'Microphone access is blocked. On iPhone: Settings → Safari → Microphone → Allow (or tap “aA” in the address bar → Website Settings → Microphone).';
  }
  if (r.recError === 'NotReadableError' || r.recError === 'NotFoundError') return 'Another app is using the microphone, or none was found. Close calls or voice memos and try again.';
  if (!r.url && r.recError === 'empty') return 'The microphone sent no sound. Close other apps that might be using it, then try again (or restart Safari).';
  if (r.url && r.peak < 0.03) return 'The recording is almost silent. Check that nothing is covering the mic, then speak a little louder.';
  const sr = {
    'audio-capture': 'the speech check couldn’t get the microphone. Run the Mic check to find the setting that works on this phone.',
    'not-allowed': 'the speech check isn’t allowed. On iPhone it needs Settings → General → Keyboard → Enable Dictation.',
    'service-not-allowed': 'the speech check isn’t allowed. On iPhone it needs Settings → General → Keyboard → Enable Dictation.',
    network: 'the speech check needs an internet connection.',
    'language-not-supported': 'this phone can’t check speech in this language.',
  }[r.srError];
  if (sr) return r.url ? `Recorded you, but ${sr}` : sr.charAt(0).toUpperCase() + sr.slice(1);
  return '';
}

/* ---------- comparing what was heard with the phrase ---------- */

function normalize(s) {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')            // Latin accents
    .replace(/[֑-ׇ]/g, '')            // Hebrew vowel points
    .replace(/[ً-ٰٟـ]/g, '') // Arabic vowel marks, tatweel
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/ё/g, 'е').replace(/Ё/g, 'Е')
    .toLowerCase()
    .replace(/[\p{P}\p{S}]/gu, ' ')
    .trim();
}

function similarity(a, b) {
  if (a === b) return 1;
  const m = a.length; const n = b.length;
  if (!m || !n) return 0;
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return 1 - d[m][n] / Math.max(m, n);
}

// Languages written without spaces (Japanese): match character by character, using the
// longest common subsequence, against the written form or its kana reading, whichever fits better.
function compareChars(target, heard, alt) {
  // NFKC keeps が as one character (NFD would split off the voicing mark); katakana folds to hiragana.
  const strip = (x) => x.normalize('NFKC').toLowerCase()
    .replace(/[\u30a1-\u30f6]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60))
    .replace(/[\p{P}\p{S}\s]/gu, '');
  const h = [...strip(heard)];
  const lcsMarks = (t) => {
    const n = t.length; const m = h.length;
    const d = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) d[i][j] = t[i] === h[j] ? d[i + 1][j + 1] + 1 : Math.max(d[i + 1][j], d[i][j + 1]);
    const hit = new Array(n).fill(false);
    for (let i = 0, j = 0; i < n && j < m;) { if (t[i] === h[j]) { hit[i] = true; i++; j++; } else if (d[i + 1][j] >= d[i][j + 1]) i++; else j++; }
    return { hit, score: n ? d[0][0] / n : 0 };
  };
  const t = [...target.replace(/_{2,}/g, '\u0000')];
  const keep = t.map((ch) => ch !== '\u0000' && strip(ch) !== '');
  const main = lcsMarks(t.filter((_, i) => keep[i]).map((ch) => strip(ch)));
  let k = 0;
  const words = t.map((ch, i) => {
    if (ch === '\u0000') return { raw: '___', status: 'slot' };
    if (!keep[i]) return { raw: ch, status: 'skip' };
    return { raw: ch, status: main.hit[k++] ? 'hit' : 'miss' };
  });
  const altScore = alt ? lcsMarks([...strip(alt.replace(/_{2,}/g, ''))]).score : 0;
  // If the kana reading matched better (recognizer wrote kana), colour by that score instead.
  if (altScore > main.score && altScore >= 0.8) {
    words.forEach((w) => { if (w.status === 'miss') w.status = altScore >= 0.95 ? 'hit' : 'close'; });
  }
  return { words, score: Math.max(main.score, altScore) };
}

// Splits the phrase into words and marks each one: hit, close, miss, or slot (a ___ blank).
export function compare(target, heard, { charMode = false, alt = '' } = {}) {
  if (charMode) return compareChars(target, heard, alt);
  const heardWords = normalize(heard).split(/\s+/).filter(Boolean);
  const words = target.split(/\s+/).filter(Boolean).map((raw) => {
    if (/_{2,}/.test(raw)) return { raw, status: 'slot' };
    const w = normalize(raw);
    if (!w) return { raw, status: 'skip' };
    const best = heardWords.reduce((mx, h) => Math.max(mx, similarity(w, h)), 0);
    return { raw, status: best >= 0.75 ? 'hit' : best >= 0.5 ? 'close' : 'miss' };
  });
  const scored = words.filter((w) => ['hit', 'close', 'miss'].includes(w.status));
  const score = scored.length ? scored.reduce((s, w) => s + (w.status === 'hit' ? 1 : w.status === 'close' ? 0.5 : 0), 0) / scored.length : 0;
  return { words, score };
}
