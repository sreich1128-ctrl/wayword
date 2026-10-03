// Loads the content/ folder and joins every language file onto the canonical
// concept list by `id`. Language strings are passed through untouched: this
// module never edits, normalizes or fills in translations.

const BASE = './content/';

async function getJSON(path) {
  const res = await fetch(BASE + path);
  if (!res.ok) throw new Error(`Could not load ${path} (${res.status})`);
  return res.json();
}

// Optional per-entry fields the UI knows how to show if a dataset provides them.
export const OPTIONAL_FIELDS = ['regional_note', 'usage_note', 'example', 'response'];

// Pattern transliterations in the dataset leave out the blank ("وين ___؟" = "wayn").
// For display only, put a ___ where the blank falls, counted by words: the wording
// itself is never changed. A blank glued to a prefix (Hebrew ל___) becomes "le-___".
export function slotPron(target, pron) {
  if (!pron || !/_{3}/.test(target) || /_{3}/.test(pron)) return pron;
  const words = target.split(/\s+/);
  const at = words.findIndex((w) => w.includes('___'));
  const prefix = words[at].split('___')[0].replace(/[¿¡]/g, '');
  const n = at + (prefix ? 1 : 0);
  const p = pron.split(' ');
  if (n === 0) return `___ ${pron}`;
  if (n > p.length) return `${pron} ___`;
  const [, word, punct] = p[n - 1].match(/^(.*?)([,.;!?]*)$/);
  p[n - 1] = `${word}${prefix ? '-___' : ' ___'}${punct}`;
  return p.join(' ');
}

export async function loadContent() {
  const [languages, concepts, categories, tiers, scenarios, patterns, meta] = await Promise.all([
    getJSON('languages.json'),
    getJSON('concepts.json'),
    getJSON('categories.json'),
    getJSON('tiers.json'),
    getJSON('scenarios.json'),
    getJSON('patterns.json'),
    getJSON('language-meta.json'),
  ]);

  const conceptById = new Map(concepts.map((c, i) => [c.id, { ...c, order: i }]));
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  const langs = languages.map((l) => ({
    ...l,
    meta: { ...meta.default, ...(meta[l.code] || {}) },
    file: null, // loaded lazily
  }));

  return {
    languages: langs,
    languageByCode: new Map(langs.map((l) => [l.code, l])),
    concepts: [...conceptById.values()],
    conceptById,
    categories,
    categoryById,
    tiers,
    scenarios,
    patterns: patterns.patterns || {},
  };
}

const langCache = new Map();

// Returns the language's phrases as one list in concept order. A concept the
// language file lacks comes back with `missing: true` so the UI can say so.
export async function loadLanguage(content, code) {
  if (langCache.has(code)) return langCache.get(code);
  const lang = content.languageByCode.get(code);
  if (!lang) throw new Error(`Unknown language ${code}`);
  const file = await getJSON(`lang/${code}.json`);
  const entryById = new Map(file.entries.map((e) => [e.id, e]));

  const phrases = content.concepts.map((c) => {
    const e = entryById.get(c.id);
    const base = {
      key: `${code}:${c.id}`,
      id: c.id,
      order: c.order,
      category: c.category,
      priority: c.priority,
      type: c.type,
      english: c.english,
    };
    if (!e) return { ...base, missing: true };
    const p = { ...base, target: e.target, pron: slotPron(e.target, e.pronunciation_easy) };
    for (const f of OPTIONAL_FIELDS) if (e[f]) p[f] = e[f];
    return p;
  });

  // Entries that exist in the file but not in concepts.json are still shown.
  for (const e of file.entries) {
    if (content.conceptById.has(e.id)) continue;
    phrases.push({
      key: `${code}:${e.id}`, id: e.id, order: 9999, category: e.category,
      priority: e.priority, type: e.type, english: e.english,
      target: e.target, pron: slotPron(e.target, e.pronunciation_easy),
      ...Object.fromEntries(OPTIONAL_FIELDS.filter((f) => e[f]).map((f) => [f, e[f]])),
    });
  }

  // Language-level notes that are not tied to a single concept (e.g. dialect, gender).
  const generalNotes = Object.entries(file.notes || {})
    .filter(([k]) => !content.conceptById.has(k))
    .map(([k, v]) => ({ key: k, text: v }));

  const result = {
    lang,
    file,
    phrases,
    byId: new Map(phrases.map((p) => [p.id, p])),
    generalNotes,
  };
  langCache.set(code, result);
  return result;
}

export function tierIncludes(content, tierId, priority) {
  const t = content.tiers.find((x) => x.id === tierId) || content.tiers[content.tiers.length - 1];
  return t.includes.includes(priority);
}

export function inCategory(content, phrase, catId) {
  if (phrase.category === catId) return true;
  const cat = content.categoryById.get(catId);
  return !!(cat && cat.also_include_types && cat.also_include_types.includes(phrase.type));
}

const soundCache = new Map();

// Optional per-language sound guide (content/sounds/<code>.json). Null if absent.
export async function loadSounds(code) {
  if (soundCache.has(code)) return soundCache.get(code);
  let guide = null;
  try { guide = await getJSON(`sounds/${code}.json`); } catch { guide = null; }
  soundCache.set(code, guide);
  return guide;
}
