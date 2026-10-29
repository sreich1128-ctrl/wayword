// Builds one review sheet per language (docs/review/<code>.md) for a second opinion from other AIs
// (ChatGPT, Gemini). Each sheet lists the drafts that no native-written sentence confirmed
// (content/added/crosscheck.json), and asks for answers as JSON that scripts/import-review.mjs reads.
// Run: node scripts/review-sheets.mjs
import { variantDefs, variantEnglish } from '../js/variants.js';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const concepts = new Map(read('content/concepts.json').map((c) => [c.id, c]));
const words = new Map(read('content/vocab.json').words.map((w) => [w.id, w]));
const patternsConf = read('content/patterns.json').patterns;
const exampleEnglish = (pid, variantId) => { const d = variantDefs(patternsConf[pid], words).find((x) => x.id === variantId); return d ? variantEnglish(concepts.get(pid).english, d) : ''; };
const replies = read('content/replies.json').replies;
const cross = read('content/added/crosscheck.json').results;
const langs = read('content/languages.json');
const fillEnglish = (frame, w) => frame.replace(/\b((?:the|a|an|my) (?:\w+ )?)?_{2,}/i, (m, art) => (art ? art + w.english : w.in_sentence || w.english));
const SAFETY = new Set(['allergic_to', 'without', 'help_shout', 'call_police', 'need_doctor', 'where_pharmacy', 'its_emergency', 'not_well', 'call_someone', 'lost_my']);

mkdirSync(new URL('docs/review/', root), { recursive: true });
let total = 0;
for (const l of langs) {
  const a = read(`content/added/${l.code}.json`);
  const vetted = read(`content/lang/${l.code}.json`);
  const done = (key) => cross[l.code]?.[key]?.status === 'match';
  const rows = [];
  const add = (key, english, x, note = '') => { if (!done(key)) rows.push({ key, english, target: x.target, reading: x.reading, pron: x.pronunciation_easy, note: [note, x.qa].filter(Boolean).join(' ') }); };
  for (const e of a.entries) {
    const c = concepts.get(e.id);
    add(e.id, c.english, e, [c.english.includes('___') ? 'Frame: ___ is filled with a word.' : '', SAFETY.has(e.id) ? 'SAFETY: allergy/emergency.' : '', e.id === 'left' || e.id === 'right' ? 'Direction (turn left/right), not "correct".' : ''].filter(Boolean).join(' '));
  }
  for (const [pid, list] of Object.entries(a.examples || {})) for (const x of list) add(`${pid}~${x.word}`, exampleEnglish(pid, x.word), x, SAFETY.has(pid) ? 'SAFETY: allergy/emergency.' : '');
  for (const r of replies) if (a.replies?.[r.id]) add(`reply~${r.id}`, r.english, a.replies[r.id], 'Said TO the traveller by staff.');
  for (const [id, w] of Object.entries(a.vocab || {})) add(`word~${id}`, words.get(id).english, w, 'A single word, as it would appear inside a sentence.');
  total += rows.length;

  const style = vetted.notes ? Object.entries(vetted.notes).map(([k, v]) => `- ${k}: ${v}`).join('\n') : '';
  const md = `# Review sheet: ${l.name} (${rows.length} items)

Paste everything below the line into ChatGPT or Gemini (a fresh chat). Save the JSON it returns as \`docs/review/${l.code}.<tool>.json\` (for example \`${l.code}.chatgpt.json\`), or paste it back to Claude Code.

---

You are a native-level reviewer of ${l.name}${l.region ? ` (${l.region})` : ''} for a travel phrasebook app. Below are draft translations written by another AI. Travellers will say these to local people, so they must be correct, natural, and in the right variety and register. Some are about allergies and emergencies: be especially strict with those.

House style of this phrasebook (follow it; don't "fix" things that follow it):
${style}
- \`pronunciation_easy\` is an easy respelling for English speakers (stress in CAPITALS where the language has stress; hyphenated syllables). Check it matches how the phrase is actually said.

For EVERY item, reply with one JSON object per line inside a single \`\`\`json code block, as an array:
{"key": "...", "verdict": "ok" | "fix" | "unsure", "better": "corrected target text, only if fix", "pronunciation_easy": "corrected respelling, only if it needs fixing", "why": "short reason, only if fix or unsure"}

- "ok" = a native speaker would say exactly this (or it's one of the normal ways to say it).
- "fix" = wrong, unnatural, wrong variety/register, or a meaning error. Give the better version.
- "unsure" = you can't tell; say why.
Return all ${rows.length} keys, in order, and nothing else after the code block.

| key | English | draft | ${l.code === 'ja' ? 'reading | ' : ''}pronunciation_easy | note |
|---|---|---|${l.code === 'ja' ? '---|' : ''}---|---|
${rows.map((r) => `| ${r.key} | ${r.english} | ${r.target} | ${l.code === 'ja' ? `${r.reading || ''} | ` : ''}${r.pron} | ${(r.note || '').replace(/\|/g, '/')} |`).join('\n')}
`;
  writeFileSync(new URL(`docs/review/${l.code}.md`, root), md);
  console.log(`${l.code}: ${rows.length} items to review`);
}
console.log(`total ${total}`);
