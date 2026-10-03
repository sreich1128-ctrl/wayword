// "Say it" practice: records your voice for playback and, where the browser can,
// transcribes it so you can see which words came through.

const SR = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
export const canRecord = typeof navigator !== 'undefined' && !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
export const canRecognize = !!SR;

function pickMime() {
  for (const t of ['audio/mp4', 'audio/webm;codecs=opus', 'audio/webm']) {
    if (window.MediaRecorder?.isTypeSupported?.(t)) return t;
  }
  return '';
}

// Starts listening. Returns { stop(), done } where done resolves to
// { url, transcript, error }. Stops by itself after maxMs, or shortly after
// the recognizer decides you've finished speaking.
export function capture({ asrLang, maxMs = 9000, onInterim } = {}) {
  let recorder = null;
  let stream = null;
  let rec = null;
  let transcript = '';
  let finished = false;
  let resolveDone;
  const done = new Promise((r) => { resolveDone = r; });
  const chunks = [];
  let recDone = !SR;
  let micDone = !canRecord;
  let url = null;
  let error = null;

  const maybeFinish = () => {
    if (finished || !recDone || !micDone) return;
    finished = true;
    clearTimeout(timer);
    resolveDone({ url, transcript: transcript.trim(), error });
  };

  const stop = () => {
    try { if (recorder && recorder.state !== 'inactive') recorder.stop(); else micDone = true; } catch { micDone = true; }
    try { rec?.stop(); } catch { recDone = true; }
    setTimeout(() => { recDone = true; micDone = true; maybeFinish(); }, 2500); // safety net
    maybeFinish();
  };
  const timer = setTimeout(stop, maxMs);

  if (canRecord) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((s) => {
      stream = s;
      const mime = pickMime();
      recorder = new MediaRecorder(s, mime ? { mimeType: mime } : undefined);
      recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (chunks.length) url = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType || mime || 'audio/webm' }));
        micDone = true;
        maybeFinish();
      };
      recorder.start();
      if (finished) recorder.stop();
    }).catch((e) => {
      error = e.name === 'NotAllowedError' ? 'mic-blocked' : 'mic-failed';
      micDone = true;
      maybeFinish();
    });
  }

  if (SR) {
    try {
      rec = new SR();
      rec.lang = asrLang;
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.continuous = false;
      rec.onresult = (e) => {
        let text = '';
        for (let i = 0; i < e.results.length; i++) text += e.results[i][0].transcript + ' ';
        transcript = text;
        onInterim?.(text.trim());
      };
      rec.onerror = (e) => { if (e.error === 'not-allowed' && !error) error = 'mic-blocked'; };
      rec.onend = () => {
        recDone = true;
        // The recognizer heard you finish: stop recording a moment later.
        setTimeout(() => { if (recorder && recorder.state === 'recording') recorder.stop(); }, 350);
        maybeFinish();
      };
      rec.start();
    } catch {
      recDone = true;
    }
  }

  return { stop, done };
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

// Splits the phrase into words and marks each one: hit, close, miss, or slot (a ___ blank).
export function compare(target, heard) {
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
