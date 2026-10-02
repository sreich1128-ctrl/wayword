// Checks content/ for structural problems. Never edits anything.
// Run: node scripts/validate.mjs
import { readFileSync } from 'node:fs';

const read = (p) => JSON.parse(readFileSync(new URL(`../content/${p}`, import.meta.url), 'utf8'));
const errors = [];
const warn = [];

const languages = read('languages.json');
const concepts = read('concepts.json');
const categories = read('categories.json');
const tiers = read('tiers.json');
const scenarios = read('scenarios.json');
const patterns = read('patterns.json').patterns;
const meta = read('language-meta.json');

const ids = new Set(concepts.map((c) => c.id));
const catIds = new Set(categories.map((c) => c.id));
const prios = new Set(tiers.flatMap((t) => t.includes));

for (const c of concepts) {
  if (!catIds.has(c.category)) errors.push(`concept ${c.id}: category "${c.category}" missing from categories.json`);
  if (!prios.has(c.priority)) errors.push(`concept ${c.id}: priority "${c.priority}" not in any tier`);
}

for (const l of languages) {
  if (!meta[l.code]) warn.push(`${l.code}: no entry in language-meta.json (default theme used)`);
  if (!['ltr', 'rtl'].includes(l.direction)) errors.push(`${l.code}: direction must be ltr or rtl`);
  let file;
  try { file = read(`lang/${l.code}.json`); } catch (e) { errors.push(`${l.code}: cannot read lang/${l.code}.json`); continue; }
  const seen = new Set();
  for (const e of file.entries) {
    if (seen.has(e.id)) errors.push(`${l.code}: duplicate id ${e.id}`);
    seen.add(e.id);
    if (!ids.has(e.id)) warn.push(`${l.code}: ${e.id} is not in concepts.json`);
    if (!e.target) errors.push(`${l.code}: ${e.id} has no target text`);
    if (!e.pronunciation_easy) warn.push(`${l.code}: ${e.id} has no pronunciation`);
    const c = concepts.find((x) => x.id === e.id);
    if (c) for (const k of ['category', 'priority', 'type', 'english']) {
      if (c[k] !== e[k]) warn.push(`${l.code}: ${e.id}.${k} "${e[k]}" differs from concepts.json "${c[k]}"`);
    }
    if (c && c.type === 'pattern' && e.english.includes('___') && !e.target.includes('___')) {
      warn.push(`${l.code}: ${e.id} is a ___ pattern but the target has no blank`);
    }
  }
  const missing = [...ids].filter((id) => !seen.has(id));
  if (missing.length) warn.push(`${l.code}: missing ${missing.length} concept(s): ${missing.join(', ')}`);
}

for (const s of scenarios) for (const id of s.concepts) {
  if (!ids.has(id)) errors.push(`scenario ${s.id}: unknown concept ${id}`);
}
for (const [pid, p] of Object.entries(patterns)) {
  if (!ids.has(pid)) errors.push(`patterns.json: unknown pattern ${pid}`);
  for (const id of p.related || []) if (!ids.has(id)) errors.push(`patterns.json ${pid}: unknown related ${id}`);
}

const counts = Object.fromEntries(tiers.map((t) => [t.label, concepts.filter((c) => t.includes.includes(c.priority)).length]));
console.log(`${languages.length} languages, ${concepts.length} concepts, ${scenarios.length} scenarios`);
console.log('Tier sizes:', counts);
warn.forEach((w) => console.log('warn:', w));
errors.forEach((e) => console.log('ERROR:', e));
process.exit(errors.length ? 1 : 0);
