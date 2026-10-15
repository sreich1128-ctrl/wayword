import { test } from 'node:test';
import assert from 'node:assert/strict';
import { planSession, requeue } from '../js/plan.js';

const ph = (n, prefix = 'p') => Array.from({ length: n }, (_, i) => ({ key: `pt:${prefix}${i}`, english: `${prefix} ${i}` }));
const kinds = (steps) => steps.map((s) => s.kind).join(',');
const fixed = () => 0; // deterministic "random"

test('first session: new phrases, then a quick check of the same ones, no listening check', () => {
  const steps = planSession({ fresh: ph(10), rand: fixed });
  assert.equal(kinds(steps), 'new,new,new,new,new,check,check,check,check,check');
  assert.deepEqual(new Set(steps.filter((s) => s.kind === 'check').map((s) => s.p.key)), new Set(steps.filter((s) => s.kind === 'new').map((s) => s.p.key)));
});

test('reviews come first, capped at 3, and at least 2 new phrases still come', () => {
  const steps = planSession({ due: ph(6, 'd'), fresh: ph(10), known: ph(6, 'd'), rand: fixed });
  assert.equal(steps.filter((s) => s.kind === 'review').length, 3);
  assert.equal(steps[0].kind, 'review');
  assert.equal(steps.filter((s) => s.kind === 'new').length, 2);
});

test('leaving soon allows up to 5 reviews', () => {
  const steps = planSession({ due: ph(8, 'd'), fresh: ph(10), leavingSoon: true, rand: fixed });
  assert.equal(steps.filter((s) => s.kind === 'review').length, 5);
});

test('listening check uses a known phrase outside the session, with one right and one wrong option', () => {
  const steps = planSession({ due: ph(1, 'd'), fresh: ph(10), known: [...ph(1, 'd'), ...ph(3, 'k')], rand: fixed });
  const lc = steps.find((s) => s.kind === 'listen');
  assert.ok(lc);
  assert.ok(lc.p.key.startsWith('pt:k'));
  assert.equal(lc.options.filter((o) => o.ok).length, 1);
  assert.equal(lc.options.find((o) => o.ok).text, lc.p.english);
  assert.notEqual(lc.options[0].text, lc.options[1].text);
});

test('no listening check when audio is off', () => {
  const steps = planSession({ fresh: ph(10), known: ph(3, 'k'), canListen: false, rand: fixed });
  assert.equal(steps.some((s) => s.kind === 'listen'), false);
});

test('nothing new or due: a practice round of known phrases', () => {
  const steps = planSession({ known: ph(8, 'k'), rand: fixed });
  assert.equal(kinds(steps), 'practice,practice,practice,practice,practice');
});

test('a missed step comes back once, a little later', () => {
  const steps = [{ kind: 'check', p: { key: 'a' } }, { kind: 'check', p: { key: 'b' } }];
  requeue(steps, 0, steps[0]);
  assert.equal(kinds(steps), 'check,check,again');
});

import { readiness } from '../js/plan.js';
import { mergeAdded } from '../js/data.js';

test('readiness counts only a situation\'s own phrases', () => {
  const sit = { concepts: ['hello', 'thank_you', 'have_reservation', 'wifi_password'], counts: ['have_reservation', 'wifi_password'] };
  const learned = new Set(['hello', 'thank_you']);
  assert.deepEqual(readiness(sit, (id) => learned.has(id)), { n: 2, ready: 0 }); // generic phrases don't count
  learned.add('wifi_password');
  assert.deepEqual(readiness(sit, (id) => learned.has(id)), { n: 2, ready: 1 });
  assert.deepEqual(readiness({ concepts: ['hello', 'yes'] }, (id) => learned.has(id)), { n: 2, ready: 1 }); // no counts list: all count
});

test('drafts fill gaps but never replace the vetted dataset, and are marked', () => {
  const vetted = new Map([['hello', { id: 'hello', target: 'Olá' }]]);
  const merged = mergeAdded(vetted, { entries: [{ id: 'hello', target: 'Oi' }, { id: 'goodbye', target: 'Adeus' }] });
  assert.equal(merged.get('hello').target, 'Olá');
  assert.equal(merged.get('hello').draft, undefined);
  assert.equal(merged.get('goodbye').target, 'Adeus');
  assert.equal(merged.get('goodbye').draft, true);
});

test('listening check can use a reply from the situation', () => {
  const replies = [{ key: 'r1', english: 'Anything else?' }, { key: 'r2', english: 'For here or to go?' }];
  const steps = planSession({ fresh: ph(5), replies, rand: () => 0 });
  const lc = steps.find((s) => s.kind === 'listen');
  assert.ok(lc && lc.p.key.startsWith('r'));
  assert.equal(lc.options.length, 2);
});

import { reviewMode } from '../js/plan.js';

test('reviews climb a ladder: recognize, say, write, answer', () => {
  assert.equal(reviewMode({ box: 1 }), 'recognize');
  assert.equal(reviewMode({ box: 2 }), 'say');
  assert.equal(reviewMode({ box: 3 }), 'type');
  assert.equal(reviewMode({ box: 4, hasReply: true }), 'answer');
  assert.equal(reviewMode({ box: 4 }), 'say', 'no reply fits: say it instead');
  assert.equal(reviewMode({ box: 3, canType: false }), 'say');
  assert.deepEqual([0, 1, 2].map((stage) => reviewMode({ keep: true, stage, hasReply: true })), ['type', 'answer', 'say']);
  assert.equal(reviewMode({ keep: true, stage: 1 }), 'type', 'keep check without a reply: type');
});
