// "Type it" checker.  Run: npm test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkTyped, checkTypedChars, targetSlots } from '../js/typecheck.js';

const v = (t, typed) => checkTyped(t, typed).verdict;
const notes = (t, typed) => checkTyped(t, typed).notes.map((n) => n.text).join(' | ');

test('capitals and punctuation never count against you', () => {
  assert.equal(v('Pode repetir?', 'pode repetir'), 'correct');
  assert.equal(v('¿Dónde está el baño?', 'donde está el baño'), 'marks'); // ó missing
  assert.equal(v('Où est ___ ?', 'où est la gare'), 'correct');
});

test('accents are named, letter by letter', () => {
  assert.equal(v('Não falo bem português.', 'Nao falo bem portugues'), 'marks');
  assert.match(notes('Não falo bem português.', 'Nao falo bem portugues'), /ã in “Não”.*ê in “português”/);
  assert.equal(v('No hablo bien español.', 'no hablo bien espanol'), 'marks');
  assert.match(notes('No hablo bien español.', 'no hablo bien espanol'), /ñ/);
});

test('missing, extra, misspelt and wrong words', () => {
  assert.match(notes('Um café, por favor.', 'Um café favor'), /Missing word: “por”/);
  assert.match(notes('Pode repetir?', 'Pode você repetir'), /Not needed: “você”/);
  assert.match(notes('Obrigado', 'Obrigadu'), /Spelling: “Obrigado”/);
  assert.equal(v('Obrigado', 'banana'), 'wrong');
  assert.equal(v('Onde fica a casa de banho?', 'Onde fica a casa banho'), 'close');
});

test('word order', () => {
  const r = checkTyped('Eu também falo inglês.', 'Eu falo também inglês');
  assert.ok(r.notes.some((n) => n.kind === 'order'));
  assert.equal(r.verdict, 'close');
});

test('one slip is "close", not "wrong"', () => {
  assert.equal(v('Sei um pouco.', 'Sei pouco'), 'close');
  assert.equal(v('Pode falar mais devagar?', 'Pode falar devagar mais'), 'close');
  assert.equal(v('Um café, por favor.', 'chá'), 'wrong');
});

test('gender and ending alternatives are both accepted', () => {
  assert.equal(v('Eres graciosa/o.', 'Eres gracioso'), 'correct');
  assert.equal(v('Eres graciosa/o.', 'Eres graciosa'), 'correct');
  assert.equal(v('Prazer em conhecê-lo/la.', 'prazer em conhece-la'), 'marks');
  assert.equal(v('Ești amuzantă / amuzant.', 'Ești amuzant'), 'correct');
  assert.equal(v('Где ближайший/ближайшая ___?', 'где ближайшая аптека'), 'correct');
  assert.deepEqual(targetSlots('¿Dónde está el/la ___ más cercano/a?').map((s) => s.alts), [['Dónde'], ['está'], ['el', 'la'], ['___'], ['más'], ['cercano', 'cercana']]);
});

test('pattern blanks accept any word, or none', () => {
  assert.equal(v('Onde fica ___?', 'Onde fica a estação de comboios'), 'correct');
  assert.equal(v('Onde fica ___?', 'Onde fica'), 'correct');
  assert.equal(v('Posso ter ___, por favor?', 'posso ter um café por favor'), 'correct');
});

test('non-Latin scripts', () => {
  assert.equal(v('Я не понимаю.', 'я не понимаю'), 'correct');
  assert.equal(v('Ещё раз', 'еще раз'), 'marks');
  assert.equal(v('وين الحمّام؟', 'وين الحمام'), 'marks'); // shadda missing
  assert.equal(v('אני לא מבין.', 'אני לא מבין'), 'correct');
});

test('Japanese: written form or kana reading', () => {
  assert.equal(checkTypedChars('トイレはどこですか？', 'といれはどこですか', 'といれはどこですか？').verdict, 'correct');
  assert.equal(checkTypedChars('分かりません。', 'わかりません', 'わかりません。').verdict, 'correct');
  assert.equal(checkTypedChars('お会計をお願いします。', 'おかいけいおねがいします', 'おかいけいをおねがいします。').verdict, 'close');
  assert.equal(checkTypedChars('すみません', '', '').verdict, 'empty');
});
