# Level 2 · Communicative: how it works (2026-11-14, v48)

The owner said "go to Level 2" without a design round, so these are the defaults I chose. Each is easy to change.

## What Level 2 is

The same situations again, as short exchanges: a phrase you **say**, the **reply** you'll hear, and a **follow-up** you say. English list and reasons: `docs/LEVEL_CUT.md` Part B (52 exchanges, about 181 lines).

Nothing about the teaching changed. Level 2 phrases go through the same session (hear it, say it, quick check, spaced reviews). The reply and the follow-up are tied together with the existing "answer" review: the app plays the reply and you answer with the follow-up (`answer_with` in `content/replies.json`). That is the call and response.

## Decisions (defaults)

| Question | Choice | Why |
|---|---|---|
| What unlocks Level 2? | **Course-wide, per language** (owner's decision 2026-11-14, replacing my per-situation default). Level 2 opens for the whole language when every Level 1 phrase is started (Learning or Locked in), or when you pass the Level 2 test. | The owner wants Level 2 to be the next page of the course, not a per-topic unlock. |
| The Level 2 test | 20 Level 1 phrases spread across every situation, each asked once. Only answers the app can mark: build with tiles, type, or pick the meaning. No self-rating, "Say it instead" is hidden, "Show me" counts as wrong. 80% passes (16 of 20). | "Authentic": you can't tap your way through. The owner asked for a way to jump ahead by test. |
| After passing | Level 2 is open in every situation that has it; the phrases you got right count as learned and start reviews. Fail: nothing changes, retry any time. Finishing Level 1 the long way shows "Level 1 complete" once, at the end of that session. | |
| What Continue teaches | Once Level 2 is open, the situation you're working on teaches its Level 2 phrases first, in exchange order. | |
| Recovery phrases | 8 shared ones taught once, as Level 2 of The basics. | LEVEL_CUT.md |
| Names | "Level 1 · Basic", "Level 2 · Communicative". No CEFR claims, no certificate yet. | Owner's decision. |
| Locked content | Not in search, counts, sessions or listening until Level 2 opens. Today shows a level card: Level 1 progress and the test link, then Level 2 progress. | |

Not built yet: a certificate for finishing a level.

## How it's stored

- `content/concepts.json`: a Level 2 phrase has `"level": 2, "situation": "<id>"` (priority `explore`).
- `content/replies.json`: `"level": 2`; `answer_with` names the follow-up.
- `content/scenarios.json`: `"level2": [ids]` in exchange order.
- Translations: drafts in `content/added/<code>.json`, like everything new.
- Progress: `prefs.unlocked[lang].course = time` (test passed); finishing Level 1 is computed, not stored. `prefs.levelSeen[lang] = 2` once the level-up was shown.
- Code: `js/app.js` "levels" section (`level2Open`, `applyLevels`, `startQuiz`, `drawQuizDone`, `viewScenario` tabs); `js/data.js` adds `level`, `sit`, `allPhrases`, `allReplies`.

## Adding a batch

1. `scripts/batches/<name>/spec.json` (English) and one `<code>.txt` per language.
2. `python3 scripts/apply-batch.py scripts/batches/<name>` then `npm run validate`.
3. `node scripts/crosscheck.mjs`, bump `sw.js`, test at phone width, deploy.

## Progress

| Batch | Situations | Per language | Status |
|---|---|---|---|
| 1 | The basics (3 exchanges + 8 recovery phrases), Restaurant (4), Transportation (4) | 31 phrases, 11 replies, 17 variations | Shipped v48 |
| 2 | Help & emergencies (4 exchanges), Hotel (4), Lost / Directions (3) | 26 phrases, 12 replies, 12 variations | Shipped v50 |
| 3 | Café (2 exchanges), Shopping (3), Barber (4), Meeting People (4) | 31 phrases, 13 replies, 14 variations | Shipped v51 |
| 4 | Flirting (3 exchanges), Airport (4), Sightseeing (3), Bar (3), Numbers & time (4) | 42 phrases, 17 replies, 7 variations | Shipped v52 |

All four batches are live: 130 Level 2 phrases and 53 replies per language. Batches 2–4 were spot-checked unlocked in the browser (Romanian and Levantine Arabic, 12 situation pages, on 127.0.0.1 so the owner's localhost progress is untouched). Still to do: Tatoeba cross-check for batches 3–4 (`node scripts/crosscheck.mjs`, slow on 2026-11-14), a ChatGPT review pass, native review of PRIORITY REVIEW lines, recordings.

Changes from LEVEL_CUT.md in batch 3: barber "About ___ centimeters" became "A little shorter."; "We're meeting at ___" became "We're meeting ___." with the little word inside the blank; Meeting People's first follow-up reuses Level 1's "How long are you here for?"; generic recoveries (show me first, come back tomorrow) are left to the shared kit.

Changes from LEVEL_CUT.md in batch 2: "My ___ is getting worse" became the fixed "It's getting worse."; the pharmacy exchange opens with Level 1's "I need medicine for ___."; "Do you have insurance?" is a reply here.

Changes from LEVEL_CUT.md in batch 1: "We didn't order ___" became the fixed "We didn't order this."; the one-off replies became typical ones ("Yes, it does.", "This one is very popular.", "Which item?").

## Quality

All drafts. Tatoeba confirms very little at this level (2–3 exact matches out of 55 per language), so a ChatGPT review pass and native review matter more here than at Level 1. Allergy lines carry `PRIORITY REVIEW` in their `qa`.
