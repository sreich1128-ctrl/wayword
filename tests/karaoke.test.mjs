// Karaoke word timing: which written word is being said, from real or estimated times.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { displayWords, estimateTimes, wordAt, wordAtChar, timesFromChars } from '../js/karaoke.js';

test('words are the pieces with letters; blanks and lone punctuation are not words', () => {
  assert.deepEqual(displayWords('Onde fica ___?'), ['Onde', 'fica']);
  assert.deepEqual(displayWords('¿Dónde está el baño?'), ['¿Dónde', 'está', 'el', 'baño?']);
  assert.deepEqual(displayWords('Uma mesa para 2 , por favor.'), ['Uma', 'mesa', 'para', '2', 'por', 'favor.']);
});

test('estimated times cover the whole phrase, in order, longer words longer', () => {
  const t = estimateTimes('Sou alérgico a amendoins', 2);
  assert.equal(t.length, 4);
  assert.equal(t[0][0], 0);
  assert.ok(Math.abs(t[3][1] - 2) < 1e-9);
  for (let i = 1; i < t.length; i++) assert.equal(t[i][0], t[i - 1][1]);
  assert.ok(t[3][1] - t[3][0] > t[2][1] - t[2][0]); // "amendoins" takes longer than "a"
});

test('slow playback: the same word at the same point of a stretched phrase', () => {
  const fast = estimateTimes('Bom dia, tudo bem?', 1);
  const slow = estimateTimes('Bom dia, tudo bem?', 2);
  assert.equal(wordAt(fast, 0.5), wordAt(slow, 1.0));
});

test('wordAt: -1 before the first word, then the latest word started', () => {
  const t = [[0.1, 0.4], [0.45, 0.9]];
  assert.equal(wordAt(t, 0), -1);
  assert.equal(wordAt(t, 0.2), 0);
  assert.equal(wordAt(t, 0.42), 0);
  assert.equal(wordAt(t, 0.5), 1);
  assert.equal(wordAt(t, 5), 1);
});

test('phone word events point at the right written word, also after a blank', () => {
  const spoken = 'Onde fica  …  agora?'; // "Onde fica ___ agora?" as given to the phone
  assert.equal(wordAtChar(spoken, 0), 0);
  assert.equal(wordAtChar(spoken, 5), 1);
  assert.equal(wordAtChar(spoken, spoken.indexOf('agora')), 2);
});

test('aligner characters become per-word times; a mismatch is refused, not guessed', () => {
  const spoken = ['Olá,', 'bom', 'dia.'];
  const text = spoken.join(' ');
  const chars = [...text].map((c, i) => ({ text: c, start: i * 0.1, end: i * 0.1 + 0.08 }));
  assert.deepEqual(timesFromChars(spoken, chars), [[0, 0.38], [0.5, 0.78], [0.9, 1.28]]);
  assert.equal(timesFromChars(spoken, chars.slice(1)), null);
  const off = chars.map((c, i) => (i === 5 ? { ...c, text: 'X' } : c));
  assert.equal(timesFromChars(spoken, off), null);
});
