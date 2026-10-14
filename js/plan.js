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
// replies: things you'll hear in the situation you're working on ({ key, english }). The listening
// check uses one of them about half the time, so you practise understanding staff, not just yourself.
export function planSession({ due = [], fresh = [], known = [], replies = [], leavingSoon = false, canListen = true, rand = Math.random } = {}) {
  const reviews = due.slice(0, leavingSoon ? SESSION.reviewsLeavingSoon : SESSION.reviews);
  const news = fresh.slice(0, Math.max(SESSION.minNew, SESSION.size - reviews.length));
  const inSession = new Set([...reviews, ...news].map((p) => p.key));
  const steps = reviews.map((p) => ({ kind: 'review', p }));

  if (!reviews.length && !news.length) {
    for (const p of shuffled(known, rand).slice(0, SESSION.practice)) steps.push({ kind: 'practice', p });
    return steps;
  }

  const others = known.filter((p) => !inSession.has(p.key));
  const useReply = replies.length >= 2 && (!others.length || rand() < 0.5);
  if (canListen && (others.length || useReply)) {
    const from = useReply ? replies : others;
    const p = from[Math.floor(rand() * from.length)];
    const pool = (useReply ? replies : [...known, ...fresh, ...due]).filter((x) => x.key !== p.key && x.english !== p.english);
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

// How ready you are for a situation: only its own phrases count (scenario.counts), so learning
// "hello" and "thank you" doesn't make Hotel look half done. Without a counts list, all of them count.
export function readiness(sit, isLearned, has = () => true) {
  const ids = (sit.counts || sit.concepts).filter(has);
  return { n: ids.length, ready: ids.filter(isLearned).length };
}

// How a review asks for a phrase, getting harder as the phrase gets stronger ("desirable difficulty"):
//   say    - see the English, say it, then hear it (box 1)
//   type   - see the English, type it; checked letter by letter (box 2, box 4)
//   answer - hear something staff say, answer with this phrase (box 3, when a reply fits)
// Keep checks on Locked in phrases rotate through all three.
export function reviewMode({ box = 1, keep = false, stage = 0, hasReply = false, canType = true } = {}) {
  let mode = keep ? ['type', 'answer', 'say'][stage % 3] : box <= 1 ? 'say' : box === 3 ? 'answer' : 'type';
  if (mode === 'answer' && !hasReply) mode = keep ? 'say' : 'type';
  if (mode === 'type' && !canType) mode = 'say';
  return mode;
}
