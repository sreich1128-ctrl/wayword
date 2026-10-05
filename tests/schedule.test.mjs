// Lock it in: schedule maths and store behaviour.  Run: node --test tests/
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DAY, gapsFor, afterPass, gapFor, lockTime, migrateOld, daysUntil, endOfToday, todayIso, CRAM_GAPS } from '../js/schedule.js';

const days = (gaps) => gaps.map((g) => g / DAY);
const cumulative = (a) => a.reduce((acc, x) => [...acc, (acc.at(-1) || 0) + x], []);

test('compression table from docs/lock-it-in.md', () => {
  const table = {
    30: [1, 3, 7, 14], 26: [1, 3, 7, 14], 20: [1, 2, 5, 11], 14: [1, 2, 4, 6], 10: [1, 1, 3, 4],
    7: [1, 1, 2, 2], 5: [1, 1, 1, 1], 4: [1, 1, 1], 3: [1, 1], 2: [1],
  };
  for (const [d, want] of Object.entries(table)) assert.deepEqual(days(gapsFor(Number(d))), want, `D=${d}`);
  assert.deepEqual(days(gapsFor(null)), [1, 3, 7, 14]);
  assert.deepEqual(gapsFor(1), CRAM_GAPS);
  assert.deepEqual(gapsFor(0), CRAM_GAPS);
});

test('every compressed schedule ends by the day before the trip', () => {
  for (let d = 2; d <= 40; d++) {
    const g = days(gapsFor(d));
    assert.ok(g.every((x) => x >= 1), `gaps >= 1 day at D=${d}`);
    assert.ok(cumulative(g).at(-1) <= Math.max(d - 1, 25), `fits at D=${d}`);
    if (d <= 26) assert.equal(cumulative(g).at(-1), d - 1, `uses the days available at D=${d}`);
    for (let i = 1; i < g.length; i++) assert.ok(g[i] >= g[i - 1] || d <= 7, `gaps don't shrink at D=${d}`);
  }
});

test('a phrase passed today walks the boxes to Locked in', () => {
  const g = gapsFor(null);
  // Entering at box 1, passing every review: 1 + 3 + 7 + 14 = 25 days.
  assert.equal(lockTime(1, 0 + gapFor(1, g), g), 25 * DAY);
  assert.deepEqual(afterPass(1, g), { locked: false, box: 2 });
  assert.deepEqual(afterPass(4, g), { locked: true });
  // Trip in 3 days: two reviews, Locked in on day 2.
  const g3 = gapsFor(3);
  assert.equal(gapFor(1, g3), DAY);
  assert.equal(lockTime(1, gapFor(1, g3), g3), 2 * DAY);
  // Cram: three reviews the same day (15 min, then 2 h, then 6 h).
  const gc = gapsFor(1);
  assert.equal(lockTime(1, gapFor(1, gc), gc), CRAM_GAPS.reduce((a, b) => a + b));
});

test('migration from the 1/3/7/16/35 model', () => {
  const learnedAt = 1_000 * DAY;
  // Old box 0, due in 1 day -> new box 1, due unchanged.
  let m = migrateOld({ box: 0, due: learnedAt + DAY }, learnedAt);
  assert.deepEqual([m.box, m.due, m.last], [1, learnedAt + DAY, learnedAt]);
  // Old box 4 (35-day gap) -> new box 4, due no later than last + 14 days.
  m = migrateOld({ box: 4, due: learnedAt + 35 * DAY }, learnedAt);
  assert.equal(m.box, 4);
  assert.equal(m.due, learnedAt + 14 * DAY);
  // Old box 3 (16 days) -> new box 4.
  assert.equal(migrateOld({ box: 3, due: learnedAt + 16 * DAY }, learnedAt).box, 4);
});

test('calendar helpers use local dates', () => {
  const now = new Date(2026, 9, 5, 22, 30).getTime();
  assert.equal(todayIso(now), '2026-10-05');
  assert.equal(daysUntil('2026-10-12', now), 7);
  assert.equal(daysUntil('2026-10-05', now), 0);
  assert.equal(daysUntil('2026-10-04', now), -1);
  assert.equal(endOfToday(now), new Date(2026, 9, 6).getTime() - 1);
});

// ---------- store behaviour (with an in-memory localStorage) ----------

function freshStore(seed) {
  const mem = new Map(seed ? [['wayword:v1', JSON.stringify(seed)]] : []);
  globalThis.localStorage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => mem.set(k, v) };
  return import(`../js/store.js?fresh=${Math.random()}`).then((m) => m.store);
}

test('first pass enters Learning, passes walk to Locked in, a miss resets', async () => {
  const store = await freshStore();
  const k = 'pt-PT:hello';
  store.setLearned(k, true, 'crash');
  assert.equal(store.status(k), 'learning');
  assert.equal(store.get().srs[k].box, 1);
  assert.equal(store.get().srs[k].via, 'crash');
  store.review(k, true); store.review(k, true);
  assert.equal(store.get().srs[k].box, 3);
  store.review(k, false);
  assert.equal(store.get().srs[k].box, 1, 'miss goes back to box 1');
  for (let i = 0; i < 4; i++) store.review(k, true);
  assert.equal(store.status(k), 'locked');
  assert.equal(store.get().srs[k], undefined, 'Locked in leaves the queue');
  store.review(k, false);
  assert.equal(store.status(k), 'locked', 'Locked in stays locked');
  assert.deepEqual(store.counts('pt-PT'), { learning: 0, locked: 1, started: 1 });
});

test('due today, daily cap, and trip date compression', async () => {
  const store = await freshStore();
  const now = Date.now();
  for (let i = 0; i < 25; i++) store.setLearned(`es:p${i}`, true, 'session');
  for (const k of Object.keys(store.get().srs)) store.get().srs[k].due = now - 1000;
  assert.equal(store.dueToday('es').length, 25);
  assert.equal(store.dueToday('es', { cap: 20 }).length, 20);
  // Trip in 3 days: box-1 phrases now come back after 1 day (and lock after 2 reviews).
  store.setLearned('fr:hello', true, 'session');
  const before = store.get().srs['fr:hello'].due;
  const trip = new Date(); trip.setDate(trip.getDate() + 3);
  store.setTrip('fr', todayIso(trip.getTime()));
  const after = store.get().srs['fr:hello'];
  assert.ok(Math.abs(after.due - (after.last + DAY)) < 1000);
  assert.ok(after.due <= before + 1000);
  store.review('fr:hello', true); store.review('fr:hello', true);
  assert.equal(store.status('fr:hello'), 'locked', 'two passes lock it in with a 3-day trip');
});

test('migrates existing v1 review progress and clears past trips', async () => {
  const learnedAt = Date.now() - 10 * DAY;
  const store = await freshStore({
    v: 1, fav: {}, prefs: { trips: { it: '2020-01-01' } },
    learned: { 'es:hello': learnedAt, 'es:yes': learnedAt },
    srs: { 'es:hello': { box: 2, due: learnedAt + 7 * DAY } }, // es:yes has no review entry yet
  });
  const s = store.get();
  assert.equal(s.v, 2);
  assert.equal(s.srs['es:hello'].box, 3);
  assert.equal(s.srs['es:yes'].box, 1);
  assert.equal(s.srs['es:yes'].due, learnedAt + DAY);
  assert.equal(store.prefs().trips.it, undefined, 'a trip date in the past is cleared');
  assert.deepEqual(store.counts('es'), { learning: 2, locked: 0, started: 2 });
});
