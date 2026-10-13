# Content expansion v2: implementation plan

2026-10-13. Input: `wayword_content_expansion_v2.zip` (README, prompt, `concept_additions.json`, `vocabulary_additions.json`, `likely_replies.json`), compared against the live repo. Status: **shipped 2026-10-13.** Owner's decisions: Claude writes the translations as labelled drafts; drafts show in the app with a Draft tag; gender follows each language's existing convention. QA report: `docs/EXPANSION_QA.md`.

## What's in the bundle

| File | Items | Notes |
|---|---|---|
| concept_additions.json | 56 phrases (47 phrases, 9 frames with ___) | 28 core, 22 travel, 6 explore. English only. |
| vocabulary_additions.json | 78 words in 8 banks | destinations 14, food & drink 13, allergens & diet 8, belongings 7, hotel facilities 6, numbers 13, directions 7, comprehension 10 |
| likely_replies.json | 14 things you'll hear | "For here or to go?", "Anything else?", "How many people?"… |

All English. **No translations are included**, so 148 items × 9 languages ≈ 1,330 translations must be created, plus fully formed example sentences for the frames.

## Checks against the repo

### No collisions
- None of the 56 new ids exists yet, and there are no duplicates within the bundle.
- The existing 56 concepts and all ids stay untouched.

### Schema conflicts and overlaps

| # | Conflict | Proposed handling |
|---|---|---|
| 1 | **5 new categories** (`transportation`, `hotel`, `shopping`, `barber`, `emergency`) don't exist in `categories.json`. | Add them. Categories are internal now (the app groups by situation), so nothing else changes. |
| 2 | **"Left / Right / Straight ahead" appear twice**: as 3 new phrases and in the `directions` word bank. | Keep the phrases; drop those 3 from the bank. The bank keeps upstairs, downstairs, near, far. |
| 3 | **Bank words duplicate existing phrases**: yes / no (comprehension), coffee / water / bill / menu (food & drink), cash / card. | Keep them as words for filling frames and for listening ("Can I have *a coffee*"), clearly separate from phrase cards. They never become extra cards and never count twice toward progress. |
| 4 | **"Card or cash?"** as a reply duplicates the existing phrase *cash_or_card* ("Cash or card?"). | Link the reply to the existing phrase's translation instead of adding a second one. |
| 5 | **Milk and dairy** are both in the allergens bank, and dairy also has its own phrase ("Does this have dairy?"). "Bag" is in two banks. | Keep both allergen words (they differ in some languages); one "bag" word shared by both banks. |
| 6 | **The concept id `emergency`** is the same as the new category `emergency`. | Rename the phrase to `its_emergency`, so it isn't confused with the category. No existing id changes. |
| 7 | **"Right"** is ambiguous (direction or correct). "Okay / Alright." and "Like this. (showing a photo)" include a slash and stage directions. | Translate "right" as the direction only. One natural word for okay. Keep the photo note as a usage note, not in the English line. |
| 8 | **Frames can't be filled by pasting words in**: Japanese counts people with special words (二人 *futari*), Russian changes noun endings after prepositions, Arabic has a dual form, French and Italian join articles to prepositions (*au*, *alla*), and Hebrew attaches prepositions to the word. | Store **fully formed example sentences** per language (frame + word, written out), not word + frame stitched together in code. The banks only say which words suit which frame. |
| 9 | **Gender.** "I'm lost", "I'm vegetarian", "I'm allergic", "I lost my…" and "Not too short" change with the speaker's gender in most of these languages. | Follow each language file's existing convention: the dataset already writes *próximo/a*-style pairs, and Hebrew/Arabic notes say masculine for now. Flag every gendered item for review. |
| 10 | **Readiness counts generic phrases.** | Add a `counts` list per situation (the phrases that are specific to it). Situations still show everything, but only those count toward "Café: 9 of 16 ready". The basics counts all of its phrases. |
| 11 | **Language files are the verbatim dataset.** | Put new content in separate files, `content/added/<code>.json`, each item marked `"review": "draft"`. The original files stay byte-for-byte unchanged. Once an item is checked, it moves into the main file. |

### Where the new phrases go (situations)

| Situation | New phrases | Counts toward readiness |
|---|---|---|
| The basics | goodbye, sorry, you're welcome, no thank you, okay, good evening | all its phrases |
| Café | menu, to go, for here, another one | coffee, water, to go, for here, another one, menu |
| Restaurant | table for ___, menu, allergic to ___, vegetarian, without ___, delicious | its 3 current specific phrases + these |
| Transportation | ticket to ___, does this go to ___, take me to ___, stop here, next departure, platform, how long, one way or return | the 8 new ones + how do I get to |
| Lost / Directions | left, right, straight ahead, I'm lost, show me on the map, near here | the 6 new ones + where is, nearest, is it far |
| Hotel | reservation, under the name ___, Wi-Fi, checkout, leave bags, the ___ doesn't work, towel | the 7 new ones |
| Shopping | just looking, I'll take it, too expensive, try it on, another size, bag | the 6 new ones + how much |
| Barber | haircut, just a trim, not too short, shorter on the sides, like this, beard trim | the 6 new ones |
| **Help & emergencies** (new) | help!, call the police, I need a doctor, pharmacy, it's an emergency, I lost my ___, I don't feel well, I need to call someone, + existing "Can you help me?" | all of them |
| Meeting People, Flirting | unchanged | their current specific phrases |

## The content model

```
content/concepts.json        +56 concepts (English, category, priority, type). Shared by all languages.
content/vocab.json           NEW: word banks (id, bank, english, priority) and which frames each bank fits.
content/replies.json         NEW: 14 replies (id, english, situations), linked to a phrase where one exists.
content/patterns.json        Existing frames + the 9 new ones; each lists its banks ("ticket_to" → destinations).
content/scenarios.json       New phrases placed; new "Help & emergencies"; a `counts` list per situation.
content/lang/<code>.json     UNCHANGED (the vetted dataset).
content/added/<code>.json    NEW, one per language. Everything marked "review": "draft":
                               entries   → target, pronunciation_easy, reading (ja), notes
                               vocab     → target, pronunciation_easy, reading (ja)
                               examples  → frame id → [{ word, target, pronunciation_easy, reading }]
                               replies   → target, pronunciation_easy, reading (ja)
```

`js/data.js` merges `added` into each language at load time. Each draft item gets a `draft` flag the app can show.

## What changes in the app

- **Draft label.** Draft phrases show a small "Draft, not yet checked" tag on cards and in the player. The audit's rule is not to present unchecked text as authoritative.
- **Readiness** counts only each situation's `counts` list.
- **Listening checks** ("What did they say?") also use the replies: you hear "How many people?" and pick the meaning.
- **"You might hear"** section on each situation page: the replies for that place, with play buttons.
- **Frames show their example sentences** ("Um bilhete para o aeroporto, por favor") under "Try another" in the player, and on the Patterns page.
- **Audio:** new items use the phone's voice until natural recordings are generated, a separate step that uses ElevenLabs credits.

## Tests and checks

- `npm run validate` extended:
  - Every new concept, word, reply and frame example exists in every language's `added` file.
  - Japanese has a `reading` for each.
  - Example sentences point to real bank words.
  - The `counts` ids are in their situation.
  - Every draft is labelled.
- Unit tests:
  - Readiness ignores shared generic phrases.
  - The data merge keeps the original language file untouched and marks drafts.
- **QA report** (`docs/EXPANSION_QA.md`):
  - Counts and completeness per language.
  - Every gendered item.
  - The allergy and emergency items first in line for a native speaker's review.

## Order of work

1. Schema and app changes (merge, draft tag, readiness, replies, examples), tested with English placeholders.
2. Translations: one careful pass per language (9 in parallel). Each writes only its own `content/added/<code>.json` and marks everything draft.
3. My review of the drafts, starting with allergy and emergency phrases. Problems go into the QA report and `DATA_REVIEW.md`.
4. Validate, test in the browser, deploy, report.

## Decisions for the owner

1. **Who writes the translations?** Until now, translations came only from your dataset tool, copied verbatim. This bundle asks me to write them. Options: (a) I write them as clearly labelled drafts in separate files, as above; or (b) I write a prompt for your dataset tool and wait for its output.
2. **Show drafts in the app now (labelled), or keep them hidden until checked?**
3. **Gender:** keep each language's current convention (*perdido/a*-style pairs; masculine in Hebrew and Arabic), or add proper feminine variants for the new phrases now?
