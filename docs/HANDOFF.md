# Wayword handoff, updated 2026-10-08

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
| `js/speech.js` / `js/voices.js` | The audio player: natural recordings from `content/audio/<lang>/` when present, otherwise device text-to-speech. Voice ranking and gender labels, speed (live for recordings), pause/loop. |
| `js/typecheck.js` | Type it: compares typed text with the phrase (accents, missing/extra/misspelt words, order); pure, tested. |
| `scripts/generate-audio.mjs` | One-off natural-voice generation into `content/audio/<lang>/`. Default engine ElevenLabs (Azure also supported). Reads the key from `Wayword.keys.info.local` or `.env.local` (both git- and Vercel-ignored). Voices: `content/audio-voices.json`. Flags: `--list-voices`, `--dry-run`, `--lang=xx`, `--force`. Retries dropped connections; finished files are skipped on re-run. |
| `js/speak.js` | Microphone: record / speech check / both, level meter, auto-stop, plain-English failure reasons, word comparison (character-level for Japanese). |
| `css/style.css` | One design system; each language's accent comes from `language-meta.json`. |

## State of the features (all live)

- **Passport intro and visa-stamp home.** The intro plays once per session; stamps show "N due today" or "N learning · M locked in".
- **Levels** (Core 23 / Travel 49 / Explore 56, cumulative). Lists show phrases new to the selected level first, then "Already in …" dividers. Places has the toggle.
- **Learning flow:** next-step card, 5-minute sessions (listen → say it → quick check), Flying soon? (Core crash course, rescue kit, trip date, cheat sheet), flashcards (first-try Got it counts), Lock it in reviews.
- **Audio:** player with pause/loop/speed 0.5–1.5×, voice picker (female/male), Mic check screen, Say it panel. Arabic audio is on with a warning that phone voices are formal Arabic.
- **Sound guides** for all 9 languages.
- **Type it** practice: type the phrase, get told exactly what differs (accents letter by letter, missing/extra/misspelt words, order).
- **Natural audio:** Portuguese is live (ElevenLabs voice "Claudia", European Portuguese, 56 MP3s, 630 KB). Other languages still use the phone's voices until generated.

## Tests

- `npm test`: review schedule, store, and the Type it checker (17 tests, all passing on 2026-10-08).
- `npm run validate`: content consistency (concept ids, scenario/pattern/flight references, sound-guide highlights).
- `tests/mic-stress.html`: open on localhost and press Run. 20 checks on the real capture code with a simulated mic.
- **No automated UI tests.** Browser checks were done by hand in the preview pane at 375px, light and dark, Spanish, Arabic (right-to-left) and Japanese. Real microphones only work on a device; the owner's iPhone confirmed recording and the speech check work.

## Where we left off (2026-10-08)

**Natural audio rollout (in progress)**
- The owner has an **ElevenLabs Starter** plan (bought 2026-10-08 for $1; renews at $6 around Nov 8). A Google Calendar reminder to cancel is set for **2026-11-05 10:00**. The plan allows Voice Library voices through the API; the free plan doesn't (it returned error 402).
- About 900 of 30,000 credits used. One voice per language for the remaining 7 is about 6,300 more.
- **Portuguese is generated and live.** The owner is listening to it on the phone now. **Wait for their verdict** before generating the rest. If Claudia sounds wrong, the alternative is "Adilson – Portuguese Neutral Male" (also European Portuguese, already in the account).
- **Next command** once Portuguese is approved: `node scripts/generate-audio.mjs` (does every language in `content/audio-voices.json`, skipping Hebrew and anything already done). Then check the files (all 56 per language, sensible lengths via `afinfo`), bump `VERSION` in `sw.js`, commit, push, and run `vercel deploy --prod --yes`. Ask the owner to listen; Arabic especially.
- Chosen voices (exact names in `content/audio-voices.json`): pt-PT Claudia (f), ar-levantine "Laloosh – Soothing Arabic Conversational Voice" (f), es Matilda Paz (f, Spain accent: says c/z as "th"; the pronunciation line is Latin American; noted in the voice note), fr Greg (m), it Rossana (f), ru Maxim (m), ja Takuya (m), ro Claudiu (m).
- **Hebrew is skipped:** ElevenLabs Hebrew failed the owner's listening test (with a non-native voice). Native Hebrew voices are now in the account (Michal, Yael, Tomer). Optional: generate a few test phrases for the owner to judge before enabling (`--lang=he` after adding a `he` entry and removing `he` from `skip`).
- Optional with spare credits: a second voice per language (male/female). The manifest merges voices; add a second entry with a different `slot`. That needs a small generator change: currently one entry per language.
- Keys: the owner's key is in `Wayword.keys.info.local` (git-ignored, `.vercelignore`d). Never print it or commit it.

**Other open threads**
- **Pronunciation quality checks (proposed, not built).** Automatic checks in the validator: (1) the same word should be respelled the same way everywhere (a prototype caught Portuguese "com" kohn/kong); (2) letter-sound rules from the sound guides, count-based (a prototype caught Romanian "roh-MOO-nuh"); (3) format checks; (4) GitHub Actions to block bad deploys. Plus a shared respelling key, `docs/RESPELLING.md`, fed into the add-a-language prompt. Human layer: native spot-check and a per-language "checked by a native speaker" status, plus a "Flag this" button. The owner hasn't said go yet.
- **Arabic pronunciation:** options were offered (native recordings, a generated Jordanian voice (now ElevenLabs Laloosh), reading the pronunciation line aloud, tappable sounds that open the sound guide). The generated voice is the current path; native recordings remain the gold standard and would use the same manifest with `"native": true`.
- **ChatGPT practice comparison:** decided not to send users to ChatGPT. Borrowed ideas built: Type it, natural audio. Still open: per-phrase pronunciation tips ("swallowed vowels", "two r sounds") linking to the sound guide; a daily reminder (calendar `.ics`).

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
