import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildVariants, variantDefs, variantEnglish, fillEnglish } from '../js/variants.js';

const words = new Map([
  ['word_airport', { id: 'word_airport', english: 'airport', in_sentence: 'the airport' }],
  ['word_pharmacy', { id: 'word_pharmacy', english: 'pharmacy', in_sentence: 'the pharmacy' }],
  ['word_tea', { id: 'word_tea', english: 'tea', in_sentence: 'a tea' }],
]);
const concepts = new Map([
  ['where_is', { id: 'where_is', english: 'Where is ___?' }],
  ['nearest', { id: 'nearest', english: 'Where is the nearest ___?' }],
  ['how_much_is', { id: 'how_much_is', english: 'How much is ___?' }],
  ['how_much', { id: 'how_much', english: 'How much is this?' }],
]);

test('English reads naturally around the blank', () => {
  assert.equal(fillEnglish('Where is ___?', words.get('word_airport')), 'Where is the airport?');
  assert.equal(fillEnglish('Where is the nearest ___?', words.get('word_pharmacy')), 'Where is the nearest pharmacy?');
  assert.equal(variantEnglish('Can I ___ here?', { id: 'sit', english: 'Can I sit here?' }), 'Can I sit here?');
});

test('variants are complete sentences from the language file, never pasted into the frame', () => {
  const patterns = { where_is: { examples: ['word_airport', 'word_pharmacy'] } };
  const added = { examples: { where_is: [{ word: 'word_airport', target: 'Onde fica o aeroporto?', pronunciation_easy: 'ON-duh FEE-kah oo ah-eh-roo-POR-too' }] } };
  const out = buildVariants({ code: 'pt-PT', concepts, patterns, words, added, phraseById: new Map() });
  assert.equal(out.where_is.length, 1, 'pharmacy has no sentence in this language: no chip, nothing invented');
  const v = out.where_is[0];
  assert.equal(v.target, 'Onde fica o aeroporto?');
  assert.equal(v.english, 'Where is the airport?');
  assert.equal(v.label, 'airport');
  assert.equal(v.id, 'where_is~word_airport');
  assert.equal(v.key, 'pt-PT:where_is~word_airport', 'its own id, so it can have its own recording');
  assert.equal(v.draft, true);
});

test('a same_as variant reuses the existing phrase, with its id (and so its recording)', () => {
  const patterns = { how_much_is: { examples: [{ id: 'this', label: 'this', same_as: 'how_much' }, { id: 'ticket', label: 'a ticket', english: 'How much is a ticket?' }] } };
  const phraseById = new Map([['how_much', { id: 'how_much', key: 'fr:how_much', target: "C'est combien ?", pron: 'say kohm-BYAN', english: 'How much is this?' }]]);
  const added = { examples: { how_much_is: [{ word: 'ticket', target: 'Combien coûte un billet ?', pronunciation_easy: 'kohm-BYAN koot uhn bee-YEH' }] } };
  const out = buildVariants({ code: 'fr', concepts, patterns, words, added, phraseById });
  assert.deepEqual(out.how_much_is.map((v) => v.label), ['this', 'a ticket']);
  assert.equal(out.how_much_is[0].id, 'how_much');
  assert.equal(out.how_much_is[0].target, "C'est combien ?");
  assert.equal(out.how_much_is[0].draft, undefined, 'vetted phrase stays vetted');
  assert.equal(out.how_much_is[1].english, 'How much is a ticket?');
});

test('a frame with no written variants offers no chips', () => {
  const out = buildVariants({ code: 'ja', concepts, patterns: { where_is: { examples: ['word_airport'] } }, words, added: null, phraseById: new Map() });
  assert.equal(out.where_is, undefined);
  assert.deepEqual(variantDefs({}, words), []);
});
