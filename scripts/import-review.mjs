// Reads the other AIs' answers (docs/review/<code>.<tool>.json, from the sheets made by
// scripts/review-sheets.mjs) and combines them into content/added/review.json. Never edits drafts:
// suggested fixes are listed in docs/REVIEW_RESULTS.md for Claude/the owner to apply.
//   cross-checked: every reviewer said "ok" (at least 2 reviewers), or 1 said ok and a native sentence is close
//   needs a look:  any reviewer said "fix" or "unsure"
// Run: node scripts/import-review.mjs
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';

const root = new URL('..', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const cross = read('content/added/crosscheck.json').results;

// Accepts a JSON array, or text with a ```json block in it (as pasted from a chat).
function parseAnswers(text) {
  const block = text.match(/```json\s*([\s\S]*?)```/);
  const body = (block ? block[1] : text).trim();
  try { return JSON.parse(body); } catch { /* one object per line */ }
  return body.split('\n').map((l) => l.trim().replace(/,$/, '')).filter((l) => l.startsWith('{')).map((l) => JSON.parse(l));
}

const files = readdirSync(new URL('docs/review/', root)).filter((f) => /^[\w-]+\.[\w-]+\.json$/.test(f));
const byLang = {};
for (const f of files) {
  const [code, tool] = f.replace(/\.json$/, '').split('.');
  for (const a of parseAnswers(readFileSync(new URL(`docs/review/${f}`, root), 'utf8'))) {
    if (!a?.key) continue;
    ((byLang[code] ||= {})[a.key] ||= {})[tool] = { verdict: a.verdict, better: a.better, pron: a.pronunciation_easy, why: a.why };
  }
}

const out = {};
const md = ['# Review results', '', `From ${files.length} answer file(s): ${files.join(', ') || 'none yet'}.`, ''];
for (const [code, items] of Object.entries(byLang)) {
  out[code] = {};
  const flagged = [];
  let ok = 0;
  for (const [key, tools] of Object.entries(items)) {
    const verdicts = Object.values(tools).map((t) => t.verdict);
    const allOk = verdicts.every((v) => v === 'ok');
    const close = cross[code]?.[key]?.status === 'close';
    const status = allOk && (verdicts.length >= 2 || close) ? 'cross-checked' : allOk ? 'one-ok' : 'needs-look';
    out[code][key] = { status, tools };
    if (status === 'cross-checked') ok++;
    if (status === 'needs-look') flagged.push([key, tools]);
  }
  md.push(`## ${code}: ${ok} cross-checked, ${flagged.length} to look at`, '');
  if (flagged.length) {
    md.push('| key | reviewer | verdict | suggestion | why |', '|---|---|---|---|---|');
    for (const [key, tools] of flagged) for (const [tool, t] of Object.entries(tools)) md.push(`| ${key} | ${tool} | ${t.verdict} | ${t.better || ''} ${t.pron ? `(${t.pron})` : ''} | ${(t.why || '').replace(/\|/g, '/')} |`);
  }
  md.push('');
}
writeFileSync(new URL('content/added/review.json', root), JSON.stringify({ generated: new Date().toISOString().slice(0, 10), results: out }, null, 2) + '\n');
writeFileSync(new URL('docs/REVIEW_RESULTS.md', root), md.join('\n') + '\n');
console.log(md.filter((l) => l.startsWith('## ')).join('\n') || 'No answer files yet in docs/review/.');
