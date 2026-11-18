// Backup and restore: the whole progress state survives a round trip, and junk is refused.
import { test } from 'node:test';
import assert from 'node:assert/strict';

const mem = {};
globalThis.localStorage = { getItem: (k) => mem[k] ?? null, setItem: (k, v) => { mem[k] = String(v); } };
const { store } = await import('../js/store.js');

test('a backup restores phrases, reviews, levels and settings', () => {
  store.setLearned('es:hello', true, 'session');
  store.setLearned('fr:thank_you', true, 'session');
  store.setPref('unlocked', { es: { course: 123 } });
  const backup = store.exportData();
  mem['wayword:v1'] = JSON.stringify({ v: 2, fav: {}, learned: {}, srs: {}, locked: {}, prefs: {} }); // "the app was removed"
  const n = store.importData(backup);
  assert.equal(n, 2);
  assert.ok(store.isLearned('es:hello') && store.isLearned('fr:thank_you'));
  assert.ok(store.get().srs['es:hello']);
  assert.equal(store.prefs().unlocked.es.course, 123);
});

test('text that is not a Wayword backup is refused and changes nothing', () => {
  assert.throws(() => store.importData('{"hello":1}'));
  assert.throws(() => store.importData('not json'));
  assert.ok(store.isLearned('es:hello'));
});
