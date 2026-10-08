// "Type it": compares what you typed with the phrase and says what's different.
// Pure functions (no DOM), so they're tested in Node: tests/typecheck.test.mjs.
//
// Ignored: capitals, punctuation, extra spaces.
// Reported: accents/marks (ê vs e), spelling, missing words, extra words, word order.
// Accepted: either side of a gender/ending alternative ("graciosa/o", "le/la"),
// any word (or none) in a pattern's ___ blank, and the kana reading for Japanese.

const PUNCT = /[\p{P}\p{S}]/gu;
const MARKS = /[̀-ͯ]/g;

// Loose form: no case, punctuation or marks. Arabic/Hebrew vowel marks and letter variants folded.
export function base(s) {
  return full(s)
    .normalize('NFD').replace(MARKS, '')
    .replace(/[֑-ׇ]/g, '')
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/ё/g, 'е');
}
// Strict form: marks kept, case and punctuation dropped (internal hyphens/apostrophes too).
export function full(s) {
  return s.normalize('NFC').toLowerCase().replace(/[-'’]/g, '').replace(PUNCT, '').trim();
}

function similarity(a, b) {
  if (a === b) return 1;
  const m = a.length; const n = b.length;
  if (!m || !n) return 0;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return 1 - prev[n] / Math.max(m, n);
}

// "cercano/a" -> [cercano, cercana]; "conhecê-lo/la" -> [conhecê-lo, conhecê-la]; "ближайший/ближайшая" -> both.
const trimPunct = (t) => t.replace(/^[\p{P}\p{S}]+|[\p{P}\p{S}]+$/gu, '');

function expandAlt(token) {
  const [a, ...rest] = trimPunct(token).split('/');
  const out = [a];
  for (const b of rest) {
    if (!b) continue;
    out.push(b.length <= 3 && b.length < a.length / 2 + 1 && a.length > b.length ? a.slice(0, a.length - b.length) + b : b);
  }
  return out.filter(Boolean);
}

// Target -> slots. Each slot: { alts: [display forms], wild?: true }.
export function targetSlots(target) {
  const raw = target.replace(/_{2,}/g, ' ___ ').split(/\s+/).filter((t) => t && full(t) !== '' || t === '___' || t === '/');
  const slots = [];
  for (let i = 0; i < raw.length; i++) {
    const t = raw[i];
    if (t === '___') { slots.push({ wild: true, alts: ['___'], raw: '___' }); continue; }
    if (t === '/' && slots.length && raw[i + 1]) { // "amuzantă / amuzant": one slot with two options
      const prev = slots[slots.length - 1];
      prev.alts.push(trimPunct(raw[i + 1])); prev.raw += ` / ${raw[i + 1]}`; i++;
      continue;
    }
    slots.push({ alts: t.includes('/') ? expandAlt(t) : [trimPunct(t)], raw: t });
  }
  return slots;
}

const words = (s) => s.split(/\s+/).filter((w) => full(w) !== '');

// Align typed words to slots (longest common subsequence on the loose form).
// A wild slot may absorb up to 6 typed words, or none (it takes as many as fit).
function align(slots, typed) {
  const n = slots.length; const m = typed.length;
  const tb = typed.map(base);
  const match = (i, j) => !slots[i].wild && slots[i].alts.some((a) => base(a) === tb[j]);
  // dp[i][j] = best score aligning slots[i..] with typed[j..]
  const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  const how = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(null));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m; j >= 0; j--) {
      let best = dp[i + 1][j]; let mv = ['skipSlot'];
      if (j < m && dp[i][j + 1] > best) { best = dp[i][j + 1]; mv = ['skipTyped']; }
      if (slots[i].wild) {
        for (let k = Math.min(6, m - j); k >= 0; k--) { // largest first: ties go to filling the blank
          const sc = dp[i + 1][j + k] + 1 + k * 0.01; // tiny bonus: filling the blank beats calling words "extra"
          if (sc > best) { best = sc; mv = ['wild', k]; }
        }
      } else if (j < m && match(i, j) && dp[i + 1][j + 1] + 1 > best) { best = dp[i + 1][j + 1] + 1; mv = ['match']; }
      dp[i][j] = best; how[i][j] = mv;
    }
  }
  const pairs = []; let i = 0; let j = 0;
  while (i < n || j < m) {
    if (i >= n) { pairs.push({ typed: typed[j++] }); continue; }
    const [mv, k] = how[i][j] || ['skipSlot'];
    if (mv === 'match') pairs.push({ slot: slots[i++], typed: typed[j++] });
    else if (mv === 'wild') { pairs.push({ slot: slots[i++], typed: typed.slice(j, j + k).join(' ') || null }); j += k; }
    else if (mv === 'skipTyped') pairs.push({ typed: typed[j++] });
    else pairs.push({ slot: slots[i++] });
  }
  return pairs;
}

// Which letters differ only by a mark: "portugues" vs "português" -> ["ê"].
function markDiffs(typed, expected) {
  const a = [...full(typed)]; const b = [...full(expected)];
  if (a.length !== b.length) return [expected];
  const out = [];
  for (let k = 0; k < b.length; k++) if (a[k] !== b[k]) out.push(b[k]);
  return out.length ? out : [expected];
}

// Main check for space-separated languages.
export function checkTyped(target, typedText) {
  const slots = targetSlots(target);
  const typed = words(typedText || '');
  const pairs = align(slots, typed);

  // Pair up leftovers that sit next to each other: a missing word and an extra word
  // in the same spot are a misspelling (if similar) or a wrong word.
  const parts = [];
  for (let k = 0; k < pairs.length; k++) {
    const p = pairs[k];
    if (p.slot && p.typed !== undefined) {
      if (p.slot.wild) { parts.push({ status: 'slot', expected: '___', typed: p.typed }); continue; }
      const exact = p.slot.alts.find((a) => full(a) === full(p.typed));
      if (exact) parts.push({ status: 'ok', expected: exact, typed: p.typed });
      else {
        const alt = p.slot.alts.find((a) => base(a) === base(p.typed));
        parts.push({ status: 'mark', expected: alt, typed: p.typed, marks: markDiffs(p.typed, alt) });
      }
      continue;
    }
    const next = pairs[k + 1];
    if (p.slot && !p.slot.wild && next && !next.slot && next.typed) {
      const sim = Math.max(...p.slot.alts.map((a) => similarity(base(a), base(next.typed))));
      parts.push({ status: sim >= 0.6 ? 'spelling' : 'wrong', expected: p.slot.alts[0], typed: next.typed }); k++;
      continue;
    }
    if (!p.slot && next && next.slot && !next.slot.wild && next.typed === undefined) {
      const sim = Math.max(...next.slot.alts.map((a) => similarity(base(a), base(p.typed))));
      parts.push({ status: sim >= 0.6 ? 'spelling' : 'wrong', expected: next.slot.alts[0], typed: p.typed }); k++;
      continue;
    }
    if (p.slot) parts.push(p.slot.wild ? { status: 'slot', expected: '___', typed: null } : { status: 'missing', expected: p.slot.alts[0] });
    else parts.push({ status: 'extra', typed: p.typed });
  }

  // Word order: a "missing" word that was typed elsewhere as "extra".
  const extras = parts.filter((p) => p.status === 'extra');
  for (const p of parts.filter((x) => x.status === 'missing')) {
    const e = extras.find((x) => !x.used && base(x.typed) === base(p.expected));
    if (e) { e.used = true; e.status = 'order'; p.status = 'order'; }
  }

  return summarize(parts, typed.length);
}

function summarize(parts, typedCount) {
  const counted = parts.filter((p) => p.status !== 'slot');
  const okish = counted.filter((p) => p.status === 'ok' || p.status === 'mark').length;
  const expectedWords = counted.filter((p) => p.status !== 'extra').length || 1;
  const problems = counted.filter((p) => !['ok', 'mark'].includes(p.status));
  let verdict;
  if (!typedCount) verdict = 'empty';
  else if (!problems.length && counted.every((p) => p.status === 'ok')) verdict = 'correct';
  else if (!problems.length) verdict = 'marks';
  else if (problems.every((p) => p.status === 'order') || (problems.length === 1 && expectedWords >= 3) || okish / expectedWords >= 0.6) verdict = 'close';
  else verdict = 'wrong';

  const notes = [];
  for (const p of parts) {
    if (p.status === 'mark') notes.push({ kind: 'mark', text: `Check the accent or mark: ${p.marks.join(', ')} in “${p.expected}” (you wrote “${p.typed}”).` });
    if (p.status === 'spelling') notes.push({ kind: 'spelling', text: `Spelling: “${p.expected}” (you wrote “${p.typed}”).` });
    if (p.status === 'wrong') notes.push({ kind: 'wrong', text: `“${p.expected}” goes here (you wrote “${p.typed}”).` });
    if (p.status === 'missing') notes.push({ kind: 'missing', text: `Missing word: “${p.expected}”.` });
    if (p.status === 'extra') notes.push({ kind: 'extra', text: `Not needed: “${p.typed}”.` });
  }
  if (parts.some((p) => p.status === 'order')) notes.push({ kind: 'order', text: 'All the words are there; check the word order.' });
  return { verdict, parts, notes };
}

// Languages written without spaces (Japanese): compare characters; accept the written form or its kana reading.
export function checkTypedChars(target, typedText, reading) {
  const kana = (s) => s.normalize('NFKC').replace(/[ァ-ヶ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0x60));
  const clean = (s) => kana(s || '').replace(/_{2,}/g, '').replace(/[\p{P}\p{S}\s]/gu, '');
  const t = clean(typedText);
  const options = [target, reading].filter(Boolean).map(clean);
  if (!t) return { verdict: 'empty', parts: [], notes: [] };
  const best = Math.max(...options.map((o) => (o === t ? 1 : similarity(o, t))));
  const verdict = best === 1 ? 'correct' : best >= 0.75 ? 'close' : 'wrong';
  const notes = verdict === 'correct' ? [] : [{ kind: 'chars', text: `Close${verdict === 'wrong' ? '-ish' : ''}: ${Math.round(best * 100)}% of the characters match.` }];
  return { verdict, parts: [], notes };
}
