// Progress lives in this browser only (localStorage). Keys are "<lang>:<concept id>"
// so the same concept can be learned separately in each language.

const KEY = 'wayword:v1';

const defaults = () => ({
  v: 1,
  fav: {},
  learned: {},
  prefs: { showEnglish: true, showPron: true, tier: 'travel', lastLang: null, theme: 'auto' },
});

function read() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaults();
    const s = JSON.parse(raw);
    const d = defaults();
    return { ...d, ...s, prefs: { ...d.prefs, ...(s.prefs || {}) } };
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
  setLearned(key, on) { on ? (state.learned[key] = Date.now()) : delete state.learned[key]; save(); },
  toggleLearned(key) { this.setLearned(key, !state.learned[key]); },
  countFor(map, lang) { return Object.keys(state[map]).filter((k) => k.startsWith(lang + ':')).length; },
  reset(lang) {
    for (const map of ['fav', 'learned']) {
      for (const k of Object.keys(state[map])) if (k.startsWith(lang + ':')) delete state[map][k];
    }
    save();
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};
