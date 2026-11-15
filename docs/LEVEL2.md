# Level 2 · Communicative: how it works (2026-11-14, v48)

The owner said "go to Level 2" without a design round, so these are the defaults I chose. Each is easy to change.

## What Level 2 is

The same situations again, as short exchanges: a phrase you **say**, the **reply** you'll hear, and a **follow-up** you say. English list and reasons: `docs/LEVEL_CUT.md` Part B (52 exchanges, about 181 lines).

Nothing about the teaching changed. Level 2 phrases go through the same session (hear it, say it, quick check, spaced reviews). The reply and the follow-up are tied together with the existing "answer" review: the app plays the reply and you answer with the follow-up (`answer_with` in `content/replies.json`). That is the call and response.

## Decisions (defaults)

| Question | Choice | Why |
|---|---|---|
| What unlocks Level 2? | **Per situation.** Restaurant · Level 2 opens when every Level 1 phrase of Restaurant's own is started (Learning or Locked in), or when you pass Restaurant's quiz. | A nearer goal than finishing all 155 phrases; you get Level 2 where you're actually going. |
| The quiz | Up to 8 of the situation's own Level 1 phrases, each asked once. Only answers the app can mark: build with tiles, type, or pick the meaning. No self-rating, "Say it instead" is hidden, "Show me" counts as wrong. 80% passes (7 of 8). | "Authentic": you can't tap your way through. |
| After passing | Level 2 is open for that situation; the phrases you got right count as learned and start reviews. Fail: nothing changes, retry any time. | |
| What Continue teaches | Once a situation's Level 2 is open, its Level 2 phrases come first, in exchange order. | |
| Recovery phrases | 8 shared ones taught once, as Level 2 of The basics. | LEVEL_CUT.md |
| Names | "Level 1 · Basic", "Level 2 · Communicative". No CEFR claims, no certificate yet. | Owner's decision. |
| Locked content | Not in search, counts, sessions or listening until its situation unlocks. | |

Not built yet: a whole-course "Level 1 complete" moment or certificate, and a single "test out of everything" quiz.

## How it's stored

- `content/concepts.json`: a Level 2 phrase has `"level": 2, "situation": "<id>"` (priority `explore`).
- `content/replies.json`: `"level": 2`; `answer_with` names the follow-up.
- `content/scenarios.json`: `"level2": [ids]` in exchange order.
- Translations: drafts in `content/added/<code>.json`, like everything new.
- Progress: `prefs.unlocked[lang][situation] = time` (quiz passes). Readiness-based unlocks are computed, not stored.
- Code: `js/app.js` "levels" section (`level2Open`, `applyLevels`, `startQuiz`, `drawQuizDone`, `viewScenario` tabs); `js/data.js` adds `level`, `sit`, `allPhrases`, `allReplies`.

## Adding a batch

1. `scripts/batches/<name>/spec.json` (English) and one `<code>.txt` per language.
2. `python3 scripts/apply-batch.py scripts/batches/<name>` then `npm run validate`.
3. `node scripts/crosscheck.mjs`, bump `sw.js`, test at phone width, deploy.

## Progress

| Batch | Situations | Per language | Status |
|---|---|---|---|
| 1 | The basics (3 exchanges + 8 recovery phrases), Restaurant (4), Transportation (4) | 31 phrases, 11 replies, 17 variations | Shipped v48 |
| 2 | Help & emergencies, Hotel, Lost / Directions | | Next |
| 3 | Café, Shopping, Barber, Meeting People | | |
| 4 | Flirting, Airport, Sightseeing, Bar, Numbers & time | | |

Changes from LEVEL_CUT.md in batch 1: "We didn't order ___" became the fixed "We didn't order this."; the one-off replies became typical ones ("Yes, it does.", "This one is very popular.", "Which item?").

## Quality

All drafts. Tatoeba confirms very little at this level (2–3 exact matches out of 55 per language), so a ChatGPT review pass and native review matter more here than at Level 1. Allergy lines carry `PRIORITY REVIEW` in their `qa`.
