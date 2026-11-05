// Karaoke: which word of a phrase is being said, for the word highlight and tap-to-hear.
// A "word" is a space-separated piece of the written phrase with at least one letter or digit
// ("Onde fica ___?" → Onde · fica). Recorded audio has real times per word in
// content/audio/<lang>/timings.json (made by scripts/align-audio.mjs); the phone's voice uses the
// browser's word events where it sends them, otherwise an estimate from word length.
// No DOM here, so the tests and the alignment script can use it too.

const LETTER = /[\p{L}\p{N}]/u;

export const displayWords = (target) => String(target).split(/\s+/).filter((t) => LETTER.test(t));

// Estimated [start, end] seconds per word over `total` seconds: longer words take longer, and every
// word gets a little fixed time (short words aren't said in zero time).
export function estimateTimes(target, total) {
  const w = displayWords(target).map((t) => t.replace(/[^\p{L}\p{N}]/gu, '').length + 2);
  const sum = w.reduce((a, b) => a + b, 0);
  let t = 0;
  return w.map((n) => { const s = t; t += (n / sum) * total; return [s, t]; });
}

// The word being said at time t (seconds), or -1 before the first.
export function wordAt(times, t) {
  for (let i = times.length - 1; i >= 0; i--) if (t >= times[i][0]) return i;
  return -1;
}

// The word a speech "boundary" event points at: charIndex is into the text the phone was given.
// "___" becomes " … " in that text, which has no letters, so word counts still line up.
export function wordAtChar(spoken, charIndex) {
  let n = -1;
  const re = /\S+/g;
  let m;
  while ((m = re.exec(spoken)) && m.index <= charIndex) if (LETTER.test(m[0])) n++;
  return n;
}

// Turn an aligner's per-character times into per-word times for the written words.
//   words:  the written words (displayWords)
//   spoken: per written word, how it was said (scripts' spokenText; usually the same word)
//   chars:  [{ text, start, end }] for the joined spoken text, one per character
// Returns [[start, end], ...] per written word, or null if the characters don't line up.
export function timesFromChars(spoken, chars) {
  const text = spoken.join(' ');
  if (!chars || chars.length !== text.length) return null;
  const out = [];
  let off = 0;
  for (const s of spoken) {
    const seg = chars.slice(off, off + s.length);
    if (seg.map((c) => c.text).join('') !== s) return null;
    out.push([seg[0].start, seg[seg.length - 1].end].map((x) => Math.round(x * 1000) / 1000));
    off += s.length + 1;
  }
  return out;
}
