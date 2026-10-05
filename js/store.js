// Progress lives in this browser only (localStorage). Keys are "<lang>:<concept id>"
// so the same concept can be learned separately in each language.
//
// Lock it in (see js/schedule.js and docs/lock-it-in.md). A phrase has one of two labels:
//   Learning  - started (passed once, or marked by hand) and in the review queue
//   Locked in - passed all its reviews; it leaves the queue for good
// `learned` holds every started phrase (Learning or Locked in), so progress rings count both.

import { DAY, gapsFor, gapFor, afterPass, daysUntil, endOfToday, migrateOld } from './schedule.js';

const KEY = 'wayword:v1';
const VERSION = 2;

const defaults = () => ({
  v: VERSION,
  fav: {},
  learned: {}, // key -> first started (Learning or Locked in)
  srs: {},     // key -> { box 1..4, due, last, met, via }  (the queue: Learning only)
  locked: {},  // key -> when it was Locked in
  prefs: { showEnglish: true, showPron: true, tier: 'core', lastLang: null, theme: 'auto', trips: {} },
});

const langOf = (key) => key.slice(0, key.indexOf(':'));

function gapsForLang(state, lang) {
  const trip = state.prefs.trips?.[lang];
  const d = trip ? daysUntil(trip) : null;
  return gapsFor(d != null && d >= 0 ? d : null);
}

function recompute(state, lang) {
  const gaps = gapsForLang(state, lang);
  for (const [k, r] of Object.entries(state.srs)) {
    if (langOf(k) === lang) r.due = r.last + gapFor(r.box, gaps);
  }
}

function read() {
  let state;
  try {
    const raw = localStorage.getItem(KEY);
    const s = raw ? JSON.parse(raw) : {};
    const d = defaults();
    state = { ...d, ...s, prefs: { ...d.prefs, ...(s.prefs || {}) }, srs: s.srs || {}, locked: s.locked || {}, learned: s.learned || {} };
    state.prefs.trips = { ...(state.prefs.trips || {}) };
  } catch {
    state = defaults();
  }
  // Migrate the earlier review model (boxes 0-4, gaps 1/3/7/16/35 days) and phrases learned before reviews.
  if (state.v !== VERSION) {
    for (const [k, at] of Object.entries(state.learned)) {
      const learnedAt = typeof at === 'number' ? at : Date.now();
      if (state.locked[k]) continue;
      const old = state.srs[k];
      state.srs[k] = old && typeof old.box === 'number' && old.last === undefined
        ? migrateOld(old, learnedAt)
        : old && old.last !== undefined ? old : { box: 1, due: learnedAt + DAY, last: learnedAt, met: learnedAt, via: 'migrated' };
    }
    state.v = VERSION;
  }
  // Trip dates that have passed go back to the normal schedule.
  for (const [lang, iso] of Object.entries(state.prefs.trips)) {
    if (daysUntil(iso) < 0) { delete state.prefs.trips[lang]; recompute(state, lang); }
  }
  return state;
}

let state = read();
const listeners = new Set();

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: keep in memory */ }
  listeners.forEach((fn) => fn(state));
}
save();

export const store = {
  get: () => state,
  prefs: () => state.prefs,
  setPref(k, v) { state.prefs[k] = v; save(); },
  isFav: (key) => !!state.fav[key],
  toggleFav(key) { state.fav[key] ? delete state.fav[key] : (state.fav[key] = Date.now()); save(); },

  // Started = Learning or Locked in.
  isLearned: (key) => !!state.learned[key],
  status: (key) => (state.locked[key] ? 'locked' : state.learned[key] ? 'learning' : null),

  // A first-try pass (or the manual button) starts a phrase: Learning, box 1.
  setLearned(key, on, via = 'manual') {
    if (on) {
      const now = Date.now();
      if (!state.learned[key]) state.learned[key] = now;
      if (!state.locked[key] && !state.srs[key]) {
        state.srs[key] = { box: 1, due: now + gapFor(1, gapsForLang(state, langOf(key))), last: now, met: now, via };
      }
    } else {
      delete state.learned[key];
      delete state.srs[key];
      delete state.locked[key];
    }
    save();
  },
  toggleLearned(key) { this.setLearned(key, !state.learned[key]); },

  // A review result. Passed: up a box, or Locked in after the last. Missed: back to box 1.
  review(key, passed) {
    const r = state.srs[key];
    if (!r) return null; // not in the queue (not started, or already Locked in)
    const now = Date.now();
    const gaps = gapsForLang(state, langOf(key));
    if (passed) {
      const next = afterPass(r.box, gaps);
      if (next.locked) {
        delete state.srs[key];
        state.locked[key] = now;
        save();
        return { locked: true };
      }
      r.box = next.box;
    } else {
      r.box = 1;
    }
    r.last = now;
    r.due = now + gapFor(r.box, gaps);
    save();
    return { locked: false, box: r.box, due: r.due };
  },
  // What passing this review would do, for the hint under a flipped card.
  previewPass(key) {
    const r = state.srs[key];
    if (!r) return null;
    const gaps = gapsForLang(state, langOf(key));
    const next = afterPass(r.box, gaps);
    return next.locked ? { locked: true } : { locked: false, inMs: gapFor(next.box, gaps) };
  },
  isDue: (key, now = Date.now()) => !!(state.srs[key] && state.srs[key].due <= endOfToday(now)),
  // Due before the end of today (local), most overdue first.
  dueToday(lang, { cap = Infinity, now = Date.now() } = {}) {
    const end = endOfToday(now);
    return Object.entries(state.srs)
      .filter(([k, r]) => langOf(k) === lang && r.due <= end)
      .sort((a, b) => a[1].due - b[1].due)
      .slice(0, cap)
      .map(([k]) => k);
  },
  dueTodayByLang(now = Date.now()) {
    const end = endOfToday(now);
    const out = {};
    for (const [k, r] of Object.entries(state.srs)) if (r.due <= end) out[langOf(k)] = (out[langOf(k)] || 0) + 1;
    return out;
  },
  nextDue(lang) {
    const dues = Object.entries(state.srs).filter(([k]) => langOf(k) === lang).map(([, r]) => r.due);
    return dues.length ? Math.min(...dues) : null;
  },
  counts(lang) {
    const learning = Object.keys(state.srs).filter((k) => langOf(k) === lang).length;
    const locked = Object.keys(state.locked).filter((k) => langOf(k) === lang).length;
    return { learning, locked, started: learning + locked };
  },

  // Trip date per language ('YYYY-MM-DD' or null). Re-plans every queued phrase in that language.
  trip: (lang) => state.prefs.trips?.[lang] || null,
  gaps: (lang) => gapsForLang(state, lang),
  setTrip(lang, iso) {
    if (iso) state.prefs.trips[lang] = iso; else delete state.prefs.trips[lang];
    recompute(state, lang);
    save();
  },

  countFor(map, lang) { return Object.keys(state[map]).filter((k) => k.startsWith(lang + ':')).length; },
  reset(lang) {
    for (const map of ['fav', 'learned', 'srs', 'locked']) {
      for (const k of Object.keys(state[map])) if (k.startsWith(lang + ':')) delete state[map][k];
    }
    save();
  },
  subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
};
