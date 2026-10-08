# Wayword handoff — 2026-10-05

A short orientation for whoever picks this up next (human or AI).

## What it is

A mobile-first travel phrasebook for 9 languages: European Portuguese, Spanish, French, Italian, Russian, Levantine Arabic, Hebrew, Japanese and Romanian. Plain HTML/CSS/JS with no build step; it works offline after the first visit.

- Repo: `~/Projects/wayword` → github.com/sreich1128-ctrl/wayword (public).
- Live: https://sreich1128-ctrl.github.io/wayword/ and https://wayword-sigma.vercel.app. Pushing to `main` redeploys both; Vercel is git-connected.
- Local preview: `python3 -m http.server 5180`, or the `wayword` entry in the session's launch config.

## Ground rules (from the owner)

- **The dataset is the source of truth.** `content/languages.json`, `concepts.json` and `lang/*.json` are copied verbatim from the owner's dataset (and the owner's ChatGPT-built `ja.json` and `ro.json`). Never rewrite translations or fill gaps; show "Not in the dataset yet". Log problems in `DATA_REVIEW.md` instead.
- Curation files (`categories`, `tiers`, `scenarios`, `patterns`, `flight`, `language-meta`, `sounds/*`) may only reference **concept ids**, never language text. The exception is `sounds/*`, which explain sounds and say so on screen.
- **Bump `VERSION` in `sw.js` on every change**, or installed phones keep the old copy. Phones may need to be closed and reopened (sometimes twice).
- Accuracy over features. Don't add another queue or label system without checking `docs/lock-it-in.md`.

## Map of the code

| File | What it owns |
|---|---|
| `js/data.js` | Loads content and joins languages onto concepts. `slotPron` puts `___` into pattern transliterations (display only). |
| `js/store.js` | localStorage state (`wayword:v1`, schema `v: 2`): favourites, `learned` (Learning + Locked in), `srs` (the review queue), `locked`, prefs (level, toggles, voice, speed, mic mode, `trips`). |
| `js/schedule.js` | Lock it in maths: 1/3/7/14-day gaps, trip compression, box walk, migration. Pure functions, tested. |
| `js/app.js` | Every view, plus routing (`#/<lang>/<section>`) and events. Big but sectioned. Look for `/* ---------- name ---------- */` markers. |
| `js/speech.js` / `js/voices.js` | Device text-to-speech: voice ranking and gender labels, speed, pause/loop. |
| `js/typecheck.js` | Type it: compares typed text with the phrase (accents, missing/extra/misspelt words, order); pure, tested. |
| `scripts/generate-audio.mjs` | One-off natural-voice generation (Azure) into `content/audio/<lang>/`; reads `.env.local`. |
| `js/speak.js` | Microphone: record / speech check / both, level meter, auto-stop, plain-English failure reasons, word comparison (character-level for Japanese). |
| `css/style.css` | One design system; each language's accent comes from `language-meta.json`. |

## State of the features (all live)

- **Passport intro and visa-stamp home.** The intro plays once per session; stamps show "N due today" or "N learning · M locked in".
- **Levels** (Core 23 / Travel 49 / Explore 56, cumulative). Lists show phrases new to the selected level first, then "Already in …" dividers. Places has the toggle.
- **Learning flow:** next-step card, 5-minute sessions (listen → say it → quick check), Flying soon? (Core crash course, rescue kit, trip date, cheat sheet), flashcards (first-try Got it counts), Lock it in reviews.
- **Audio:** player with pause/loop/speed 0.5–1.5×, voice picker (female/male), Mic check screen, Say it panel. Arabic audio is on with a warning that phone voices are formal Arabic.
- **Sound guides** for all 9 languages.

## Tests

- `npm test`: review schedule, store, and the Type it checker (17 tests).
- `npm run validate`: content consistency (concept ids, scenario/pattern/flight references, sound-guide highlights).
- `tests/mic-stress.html`: open on localhost and press Run. 20 checks on the real capture code with a simulated mic.
- **No automated UI tests.** Browser checks were done by hand in the preview pane at 375px, light and dark, Spanish, Arabic (right-to-left) and Japanese. Real microphones only work on a device; the owner's iPhone confirmed recording and the speech check work.

## Known gaps and open items

- Dataset issues are listed in `DATA_REVIEW.md` (Arabic ح spelling, a few Japanese respellings, Portuguese "com" spelled kohn/kong, French `nearest`, …). They wait on the owner or the dataset tool.
- No swap-in words for patterns yet (`content/patterns.json` has the slot).
- The level names came from the owner's "Core 20 / Travel 50 / Explore 100"; the tabs now show the real counts.
- Progress is per browser; there are no accounts or sync.
- The owner hasn't yet pasted a Mic check report from the iPhone. If one arrives, it says which mic mode works on that phone.
- Ideas mentioned but not built: stamp "visit dates" on the passport, a light check on Locked in phrases every ~30 days, native audio recordings (a per-entry `audio` field would slot in).

## Adding a language

Use `docs/ADD_A_LANGUAGE_PROMPT.md` with the owner's AI tool. Copy the file verbatim, then add it to:
- `languages.json` and `language-meta.json` (`bcp47`, `asr`, accent, glyph, motif; `no_spaces: true` for scripts without spaces);
- a `content/sounds/<code>.json` guide;
- `LANGS` in `sw.js`.

Then run `npm run validate`.
