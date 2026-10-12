// Today's session, as a pure function (no storage, no DOM) so it can be tested in Node.
//
// One session engine replaces Learn, Quick check, Lock it in, the Crash course and Review:
//   1. due reviews first (recall-first: you say it, then hear it)
//   2. one "What did they say?" listening check, when there are phrases you've met
//   3. a few new phrases (heard first, then said)
//   4. a quick recall of the new ones (a first-try pass puts them into Learning)
// When nothing is new or due, it's a short practice round of phrases you know.

export const SESSION = { size: 5, minNew: 2, reviews: 3, reviewsLeavingSoon: 5, practice: 5 };

function shuffled(a, rand) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

// due: phrases due for review, most overdue first. fresh: not started yet, in teaching order.
// known: started phrases (Learning or Locked in). Phrases are objects with `key` and `english`.
export function planSession({ due = [], fresh = [], known = [], leavingSoon = false, canListen = true, rand = Math.random } = {}) {
  const reviews = due.slice(0, leavingSoon ? SESSION.reviewsLeavingSoon : SESSION.reviews);
  const news = fresh.slice(0, Math.max(SESSION.minNew, SESSION.size - reviews.length));
  const inSession = new Set([...reviews, ...news].map((p) => p.key));
  const steps = reviews.map((p) => ({ kind: 'review', p }));

  if (!reviews.length && !news.length) {
    for (const p of shuffled(known, rand).slice(0, SESSION.practice)) steps.push({ kind: 'practice', p });
    return steps;
  }

  const others = known.filter((p) => !inSession.has(p.key));
  if (canListen && others.length) {
    const p = others[Math.floor(rand() * others.length)];
    const pool = [...known, ...fresh, ...due].filter((x) => x.key !== p.key && x.english !== p.english);
    const wrong = pool[Math.floor(rand() * pool.length)];
    if (wrong) steps.push({ kind: 'listen', p, options: shuffled([{ text: p.english, ok: true }, { text: wrong.english, ok: false }], rand) });
  }

  for (const p of news) steps.push({ kind: 'new', p });
  for (const p of shuffled(news, rand)) steps.push({ kind: 'check', p });
  return steps;
}

// A missed recall comes back a couple of steps later, once, without counting again.
export function requeue(steps, i, step) {
  const at = Math.min(steps.length, i + 3);
  steps.splice(at, 0, { ...step, kind: 'again' });
  return steps;
}
