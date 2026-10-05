// Progress lives in this browser only (localStorage). Keys are "<lang>:<concept id>"
// so the same concept can be learned separately in each language.
//
// Reviews: every learned phrase gets a review box. Each box has a longer gap
// before the phrase comes back for a quick check (1, 3, 7, 16, 35 days).
// Remembering it moves it up a box; missing it sends it back to the first.

const KEY = 'wayword:v1';
const DAY = 24 * 60 * 60 * 1000;
export const REVIEW_GAPS_DAYS = [1, 3, 7, 16, 35];

const defaults = () => ({
  v: 1,
  fav: {},
  learned: {},
  srs: {}, // key -> { box, due }
  prefs: { showEnglish: true, showPron: true, tier: 'core', lastLang: null, theme: 'auto' },
});

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const s = JSON.parse(raw);
    const d = defaults();
    const state = { ...d, ...s, prefs: { ...d.prefs, ...(s.prefs || {}) }, srs: s.srs || {} };
    // Phrases learned before reviews existed: first review a day after they were learned.
    for (const [k, at] of Object.entries(state.learned)) {
      if (!state.srs[k]) state.srs[k] = { box: 0, due: (typeof at === 'number' ? at : Date.now()) + DAY };
    }
    return state;
  } catch {
    return defaults();
  }
}

let state = read();
const listeners = new Set();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: keep in memory */ }
  listeners.forEach((fn) => fn(state));
}

export const store = {
  get: () => state,
  prefs: () => state.prefs,
  setPref(k, v) { state.prefs[k] = v; save(); },
  isFav: (key) => !!state.fav[key],
  isLearned: (key) => !!state.learned[key],
  toggleFav(key) { state.fav[key] ? delete state.fav[key] : (state.fav[key] = Date.now()); save(); },
  setLearned(key, on) {
    if (on) {
      if (!state.learned[key]) state.learned[key] = Date.now();
      if (!state.srs[key]) state.srs[key] = { box: 0, due: Date.now() + REVIEW_GAPS_DAYS[0] * DAY };
    } else {
      delete state.learned[key];
      delete state.srs[key];
    }
    save();
  },
  toggleLearned(key) { this.setLearned(key, !state.learned[key]); },

  // Record a review. Remembered: wait longer next time. Missed: back to tomorrow.
  review(key, remembered) {
    if (!state.learned[key]) return;
    const cur = state.srs[key] || { box: 0, due: Date.now() };
    const box = remembered ? Math.min(cur.box + 1, REVIEW_GAPS_DAYS.length - 1) : 0;
    state.srs[key] = { box, due: Date.now() + REVIEW_GAPS_DAYS[box] * DAY };
    save();
  },
  isDue: (key, now = Date.now()) => !!(state.learned[key] && state.srs[key] && state.srs[key].due <= now),
  dueKeys(lang, now = Date.now()) {
    return Object.entries(state.srs)
      .filter(([k, r]) => k.startsWith(lang + ':') && state.learned[k] && r.due <= now)
      .sort((a, b) => a[1].due - b[1].due)
      .map(([k]) => k);
  },
  // Next review time for a language (or null), for "next review in 2 days".
  nextDue(lang) {
    const dues = Object.entries(state.srs).filter(([k]) => k.startsWith(lang + ':') && state.learned[k]).map(([, r]) => r.due);
    return dues.length ? Math.min(...dues) : null;
  },

  countFor(map, lang) { return Object.keys(state[map]).filter((k) => k.startsWith(lang + ':')).length; },
  reset(lang) {
    for (const map of ['fav', 'learned', 'srs']) {
      for (const k of Object.keys(state[map])) if (k.startsWith(lang + ':')) delete state[map][k];
    }
    save();
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};
