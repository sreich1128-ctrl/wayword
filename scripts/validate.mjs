// Checks content/ for structural problems. Never edits anything.
// Run: node scripts/validate.mjs
import { readFileSync, existsSync } from 'node:fs';

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
const flight = read('flight.json');

const ids = new Set(concepts.map((c) => c.id));
const vocab = read('vocab.json');
const replies = read('replies.json').replies;
const wordIds = new Set(vocab.words.map((w) => w.id));
const readAdded = (code) => (existsSync(new URL(`../content/added/${code}.json`, import.meta.url)) ? read(`added/${code}.json`) : null);
const catIds = new Set(categories.map((c) => c.id));
const prios = new Set(tiers.flatMap((t) => t.includes));

for (const c of concepts) {
  if (!catIds.has(c.category)) errors.push(`concept ${c.id}: category "${c.category}" missing from categories.json`);
  if (!prios.has(c.priority)) errors.push(`concept ${c.id}: priority "${c.priority}" not in any tier`);
}

const drafts = {};
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
  // Drafts (content/added/<code>.json) cover what the vetted file doesn't have yet.
  const added = readAdded(l.code);
  const draftIds = new Set();
  if (added) {
    if (added.review !== 'draft') errors.push(`added/${l.code}: top-level "review" must be "draft"`);
    for (const e of added.entries || []) {
      if (!ids.has(e.id)) errors.push(`added/${l.code}: unknown concept ${e.id}`);
      if (seen.has(e.id)) warn.push(`added/${l.code}: ${e.id} is already in the vetted file (the vetted one wins; delete the draft)`);
      if (!e.target) errors.push(`added/${l.code}: ${e.id} has no target`);
      if (!e.pronunciation_easy) errors.push(`added/${l.code}: ${e.id} has no pronunciation`);
      if (l.code === 'ja' && !e.reading) errors.push(`added/ja: ${e.id} has no reading`);
      const c = concepts.find((x) => x.id === e.id);
      if (c?.type === 'pattern' && c.english.includes('___') && !e.target.includes('___')) errors.push(`added/${l.code}: ${e.id} is a ___ frame but the target has no blank`);
      draftIds.add(e.id);
    }
    for (const w of wordIds) {
      const v = added.vocab?.[w];
      if (!v?.target || !v?.pronunciation_easy) errors.push(`added/${l.code}: word ${w} missing or incomplete`);
      else if (l.code === 'ja' && !v.reading) errors.push(`added/ja: word ${w} has no reading`);
    }
    for (const k of Object.keys(added.vocab || {})) if (!wordIds.has(k)) errors.push(`added/${l.code}: unknown word ${k}`);
    for (const [pid, p] of Object.entries(patterns)) {
      for (const w of p.examples || []) {
        const x = (added.examples?.[pid] || []).find((e) => e.word === w);
        if (!x?.target || !x?.pronunciation_easy) errors.push(`added/${l.code}: example ${pid} + ${w} missing`);
        else if (x.target.includes('___')) errors.push(`added/${l.code}: example ${pid} + ${w} still has a blank`);
        else if (l.code === 'ja' && !x.reading) errors.push(`added/ja: example ${pid} + ${w} has no reading`);
      }
    }
    for (const r of replies) {
      if (r.same_as) continue;
      const x = added.replies?.[r.id];
      if (!x?.target || !x?.pronunciation_easy) errors.push(`added/${l.code}: reply ${r.id} missing`);
      else if (l.code === 'ja' && !x.reading) errors.push(`added/ja: reply ${r.id} has no reading`);
    }
  }
  const missing = [...ids].filter((id) => !seen.has(id) && !draftIds.has(id));
  if (missing.length) warn.push(`${l.code}: missing ${missing.length} concept(s): ${missing.join(', ')}`);
  if (draftIds.size) drafts[l.code] = draftIds.size;
}

for (const s of scenarios) {
  for (const id of s.concepts) if (!ids.has(id)) errors.push(`scenario ${s.id}: unknown concept ${id}`);
  for (const id of s.counts || []) if (!s.concepts.includes(id)) errors.push(`scenario ${s.id}: counts ${id}, which isn't in its concepts`);
}
for (const w of vocab.words) for (const b of w.banks) if (!vocab.banks[b]) errors.push(`vocab ${w.id}: unknown bank ${b}`);
for (const r of replies) if (r.same_as && !ids.has(r.same_as)) errors.push(`reply ${r.id}: same_as unknown concept ${r.same_as}`);
for (const id of flight.rescue || []) if (!ids.has(id)) errors.push(`flight.json: unknown rescue concept ${id}`);
for (const [pid, p] of Object.entries(patterns)) {
  if (!ids.has(pid)) errors.push(`patterns.json: unknown pattern ${pid}`);
  for (const id of p.related || []) if (!ids.has(id)) errors.push(`patterns.json ${pid}: unknown related ${id}`);
  for (const w of p.examples || []) if (!wordIds.has(w)) errors.push(`patterns.json ${pid}: unknown example word ${w}`);
}

// Sound guides: every example must be a real concept, and any highlighted text must appear in that phrase.
for (const l of languages) {
  let guide;
  try { guide = read(`sounds/${l.code}.json`); } catch { warn.push(`${l.code}: no sound guide`); continue; }
  const file = read(`lang/${l.code}.json`);
  const byId = new Map(file.entries.map((e) => [e.id, e]));
  for (const id of Object.keys(guide.tips || {})) if (!byId.has(id)) errors.push(`sounds/${l.code}: tip for unknown phrase ${id}`);
  for (const snd of guide.sounds) for (const ex of snd.examples) {
    const e = byId.get(ex.id);
    if (!e) errors.push(`sounds/${l.code}: "${snd.name}" uses unknown phrase ${ex.id}`);
    else if (ex.mark && !e.target.includes(ex.mark)) errors.push(`sounds/${l.code}: "${ex.mark}" not found in ${ex.id} (${e.target})`);
  }
}

const counts = Object.fromEntries(tiers.map((t) => [t.label, concepts.filter((c) => t.includes.includes(c.priority)).length]));
console.log(`${languages.length} languages, ${concepts.length} concepts, ${scenarios.length} scenarios`);
console.log('Tier sizes:', counts);
console.log(`Words: ${vocab.words.length} · replies: ${replies.length} · drafts per language:`, drafts);
warn.forEach((w) => console.log('warn:', w));
errors.forEach((e) => console.log('ERROR:', e));
process.exit(errors.length ? 1 : 0);
