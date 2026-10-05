// Lock it in: the review schedule, as pure functions (no storage), so it can be tested in Node.
//
// A phrase you pass enters box 1 ("Learning"). Each review you pass moves it up a box;
// passing the box 4 review makes it "Locked in" and it leaves the queue for good.
// A miss sends it back to box 1. Normal gaps between reviews: 1, 3, 7, 14 days.
//
// With a trip date, the gaps shrink so a phrase passed today can be Locked in by the
// day before you fly. If there aren't enough days for all four reviews, the early
// boxes are skipped (a phrase in box 1 is treated as being in a later box).

export const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
export const BOXES = 4;
export const GAP_DAYS = [1, 3, 7, 14];
export const CRAM_GAPS = [15 * 60 * 1000, 2 * HOUR, 6 * HOUR]; // flying today or tomorrow

const sum = (a) => a.reduce((s, x) => s + x, 0);
const idxMax = (a) => a.indexOf(Math.max(...a));

// Local calendar helpers (not 24-hour blocks, so daylight-saving changes don't shift a day).
export function startOfDay(t) { const d = new Date(t); return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime(); }
export function endOfToday(now = Date.now()) { const d = new Date(now); return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1).getTime() - 1; }
export function parseDate(iso) { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).getTime(); }
export function todayIso(now = Date.now()) { const d = new Date(now); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
export function daysUntil(iso, now = Date.now()) { return Math.round((parseDate(iso) - startOfDay(now)) / DAY); }

// Gap lengths (ms) for the boxes in use. No trip (null): the normal 1, 3, 7, 14 days.
export function gapsFor(daysToTrip = null) {
  if (daysToTrip == null) return GAP_DAYS.map((g) => g * DAY);
  const available = daysToTrip - 1; // reviews must happen by the day before departure
  if (available >= sum(GAP_DAYS)) return GAP_DAYS.map((g) => g * DAY);
  if (available < 1) return CRAM_GAPS.slice();
  let g = GAP_DAYS.slice(-Math.min(BOXES, available)); // one review per day at most when days are scarce
  const s = available / sum(g);
  g = g.map((x) => Math.max(1, Math.floor(x * s + 0.5)));
  while (sum(g) > available) g[idxMax(g)] -= 1;
  while (sum(g) < available) g[idxMax(g)] += 1;
  return g.map((x) => x * DAY);
}

// With only k gaps, boxes before the last k are skipped.
export const effectiveBox = (box, gaps) => Math.max(box, BOXES - gaps.length + 1);
export const gapFor = (box, gaps) => gaps[effectiveBox(box, gaps) - (BOXES - gaps.length) - 1];

// What a pass does: move up a box, or lock in after the last one.
export function afterPass(box, gaps) {
  const e = effectiveBox(box, gaps);
  return e >= BOXES ? { locked: true } : { locked: false, box: e + 1 };
}

// When a phrase would be Locked in if every remaining review is passed on time.
export function lockTime(box, due, gaps) {
  let t = due;
  let b = box;
  for (;;) {
    const next = afterPass(b, gaps);
    if (next.locked) return t;
    b = next.box;
    t += gapFor(b, gaps);
  }
}

// Old review model (2026-10-05): boxes 0-4 with gaps 1, 3, 7, 16, 35 days.
export const OLD_GAP_DAYS = [1, 3, 7, 16, 35];
export function migrateOld(old, learnedAt) {
  const box = Math.min(old.box + 1, BOXES);
  const last = Number.isFinite(old.due) ? old.due - OLD_GAP_DAYS[old.box] * DAY : learnedAt;
  const due = Math.min(Number.isFinite(old.due) ? old.due : Infinity, last + GAP_DAYS[box - 1] * DAY);
  return { box, due, last, met: learnedAt, via: 'migrated' };
}
