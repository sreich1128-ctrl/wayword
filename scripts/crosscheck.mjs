// Cross-checks the draft translations (content/added/) against sentences native speakers wrote,
// from Tatoeba (tatoeba.org, CC BY 2.0 FR). Never edits drafts; writes:
//   content/added/crosscheck.json  status per draft: match · close · differs · none (+ native wordings)
//   docs/CROSSCHECK.md             the report, with native wordings to compare where we differ
// Run: node scripts/crosscheck.mjs   (responses are cached in .cache/tatoeba.json, so reruns are fast)
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Tatoeba language codes per Wayword language. Arabic: Levantine first (apc, ajp), then formal Arabic.
const TATOEBA = {
  'pt-PT': ['por'], es: ['spa'], fr: ['fra'], it: ['ita'], ro: ['ron'], ru: ['rus'], ja: ['jpn'], he: ['heb'],
  'ar-levantine': ['apc', 'ajp', 'ara'],
};
const NOTE = {
  'pt-PT': 'Tatoeba mixes Brazilian and European Portuguese, so a "differs" can just be Brazilian wording.',
  'ar-levantine': 'Tatoeba has few Levantine sentences; most matches are formal Arabic (ara), which a dialect phrase is expected to differ from.',
};

/* ---------- the drafts, each with its English ---------- */

const concepts = new Map(read('content/concepts.json').map((c) => [c.id, c]));
const words = new Map(read('content/vocab.json').words.map((w) => [w.id, w]));
const replies = read('content/replies.json').replies;
const AMBIGUOUS = new Set(['left', 'right']);
const fillEnglish = (frame, w) => frame.replace(/\b((?:the|a|an|my) (?:\w+ )?)?_{2,}/i, (m, art) => (art ? art + w.english : w.in_sentence || w.english));

function draftsFor(code) {
  const a = read(`content/added/${code}.json`);
  const out = [];
  for (const e of a.entries) {
    const c = concepts.get(e.id);
    if (c.english.includes('___')) continue; // frames are checked through their full examples
    if (AMBIGUOUS.has(e.id)) continue; // English that means something else on its own ("Right." = correct)
    out.push({ key: e.id, english: c.english, target: e.target });
  }
  for (const [pid, list] of Object.entries(a.examples || {})) {
    for (const x of list) out.push({ key: `${pid}~${x.word}`, english: fillEnglish(concepts.get(pid).english, words.get(x.word)), target: x.target });
  }
  for (const r of replies) if (a.replies?.[r.id]) out.push({ key: `reply~${r.id}`, english: r.english, target: a.replies[r.id].target });
  return out;
}

/* ---------- normalising for comparison ---------- */

const CONTRACTIONS = [[/\bi'm\b/g, 'i am'], [/\bit's\b/g, 'it is'], [/\bwhat's\b/g, 'what is'], [/\byou're\b/g, 'you are'], [/\bi'd\b/g, 'i would'], [/\bi'll\b/g, 'i will'], [/\bdoesn't\b/g, 'does not'], [/\bdon't\b/g, 'do not'], [/\bcan't\b/g, 'cannot'], [/\bcentre\b/g, 'center']];
function normEn(s) {
  let t = s.toLowerCase().replace(/[’‘]/g, "'");
  for (const [re, to] of CONTRACTIONS) t = t.replace(re, to);
  return t.replace(/[^\p{L}\p{N}' ]/gu, ' ').replace(/\s+/g, ' ').trim();
}
function normTarget(s, code) {
  let t = s.normalize('NFC').toLowerCase().replace(/[’‘`]/g, "'")
    .replace(/[֑-ׇ]/g, '')            // Hebrew points
    .replace(/[ً-ْٰـ]/g, '') // Arabic marks, tatweel
    .replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه')
    .replace(/ё/g, 'е');
  t = t.replace(/[^\p{L}\p{N}' ]/gu, ' ').replace(/\s+/g, ' ').trim();
  return code === 'ja' ? t.replace(/\s/g, '') : t;
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

/* ---------- Tatoeba ---------- */

const cachePath = new URL('.cache/tatoeba.json', root);
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, 'utf8')) : {};
let fetched = 0;

// English sentences that say exactly this, with their translations: { lang: [{ text, id, direct }] }.
async function nativeFor(english) {
  if (cache[english]) return cache[english];
  const q = `"${english.replace(/[?.!,"]/g, '').trim()}"`;
  const url = `https://tatoeba.org/en/api_v0/search?from=eng&query=${encodeURIComponent(q)}&orphans=no&unapproved=no&sort=words`;
  let data = null;
  for (let attempt = 1; attempt <= 3 && !data; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'wayword-crosscheck (travel phrasebook QA)' } });
      if (res.ok) data = await res.json();
      else await sleep(2000 * attempt);
    } catch { await sleep(2000 * attempt); }
  }
  fetched++;
  await sleep(700); // be polite to a volunteer-run site
  const want = normEn(english);
  const out = {};
  for (const s of data?.results || []) {
    if (normEn(s.text) !== want) continue;
    (s.translations || []).forEach((group, gi) => {
      for (const t of group) (out[t.lang] ||= []).push({ text: t.text, id: t.id, direct: gi === 0 });
    });
  }
  cache[english] = out;
  return out;
}

/* ---------- run ---------- */

const results = {};
const summary = {};
const codes = Object.keys(TATOEBA);
const all = Object.fromEntries(codes.map((c) => [c, draftsFor(c)]));
const englishes = [...new Set(Object.values(all).flat().map((d) => d.english))];
console.log(`${englishes.length} English sentences to look up (${Object.keys(cache).length} cached)…`);
for (const [i, en] of englishes.entries()) {
  await nativeFor(en);
  if ((i + 1) % 20 === 0) process.stdout.write(`${i + 1} `);
}
mkdirSync(new URL('.cache/', root), { recursive: true });
writeFileSync(cachePath, JSON.stringify(cache));
console.log(`\nlooked up ${fetched} new`);

for (const code of codes) {
  results[code] = {};
  const s = { match: 0, close: 0, differs: 0, none: 0, total: 0 };
  for (const d of all[code]) {
    const native = TATOEBA[code].flatMap((l) => (cache[d.english]?.[l] || []).map((t) => ({ ...t, lang: l })));
    const mine = normTarget(d.target, code);
    let status = 'none';
    let best = 0;
    for (const t of native) best = Math.max(best, similarity(mine, normTarget(t.text, code)));
    if (native.length) status = best === 1 ? 'match' : best >= 0.8 ? 'close' : 'differs';
    // Formal Arabic differing from a dialect phrase isn't a red flag.
    if (code === 'ar-levantine' && status === 'differs' && native.every((t) => t.lang === 'ara')) status = 'formal-only';
    s[status] = (s[status] || 0) + 1;
    s.total++;
    results[code][d.key] = { status, english: d.english, draft: d.target, native: native.slice(0, 4).map(({ text, lang, id }) => ({ text, lang, id })) };
  }
  summary[code] = s;
}

writeFileSync(new URL('content/added/crosscheck.json', root), JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  source: 'Tatoeba (tatoeba.org), sentences translated by native-speaker volunteers. CC BY 2.0 FR. Used here to check drafts, not copied into the app.',
  statuses: { match: 'A native-written translation is identical (ignoring punctuation and case).', close: 'A native-written translation is at least 80% the same.', differs: 'Native-written translations exist but word it differently: compare.', 'formal-only': 'Only formal Arabic found; a dialect phrase is expected to differ.', none: 'No native-written translation of this exact English.' },
  summary,
  results,
}, null, 2) + '\n');

/* ---------- report ---------- */

const NAMES = { 'pt-PT': 'European Portuguese', es: 'Spanish', fr: 'French', it: 'Italian', ro: 'Romanian', ru: 'Russian', ja: 'Japanese', he: 'Hebrew', 'ar-levantine': 'Levantine Arabic' };
const md = ['# Cross-check against native-written sentences', '',
  `Generated ${new Date().toISOString().slice(0, 10)} by \`node scripts/crosscheck.mjs\`. Source: [Tatoeba](https://tatoeba.org), sentences translated by native-speaker volunteers (CC BY 2.0 FR). Each draft phrase, example and reply is looked up by its exact English.`, '',
  '- **match:** a native wrote exactly our draft.', '- **close:** at least 80% the same (often punctuation, an article, or word order).', '- **differs:** natives wrote it differently. Not necessarily wrong (many sentences have several correct forms), but compare.', '- **none:** no native translation of that exact English exists on Tatoeba.', '',
  '| Language | Drafts | Match | Close | Differs | None |', '|---|---|---|---|---|---|'];
for (const c of codes) {
  const s = summary[c];
  md.push(`| ${NAMES[c]} | ${s.total} | ${s.match} | ${s.close} | ${(s.differs || 0) + (s['formal-only'] || 0)}${s['formal-only'] ? ` (${s['formal-only']} formal-only)` : ''} | ${s.none} |`);
}
for (const c of codes) {
  const rows = Object.entries(results[c]).filter(([, r]) => r.status === 'differs' || r.status === 'close');
  md.push('', `## ${NAMES[c]}`, '');
  if (NOTE[c]) md.push(`_${NOTE[c]}_`, '');
  if (!rows.length) { md.push('No differences to compare.'); continue; }
  md.push('| English | Our draft | Native-written | |', '|---|---|---|---|');
  for (const [, r] of rows) md.push(`| ${r.english} | ${r.draft} | ${r.native.slice(0, 2).map((t) => `${t.text}${t.lang === 'ara' ? ' (formal)' : ''}`).join(' · ')} | ${r.status} |`);
}
writeFileSync(new URL('docs/CROSSCHECK.md', root), md.join('\n') + '\n');
console.table(summary);
