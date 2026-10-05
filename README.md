# Wayword

A mobile-first travel phrasebook for European Portuguese, Spanish, French, Italian, Russian, Levantine Arabic and Hebrew.
Plain HTML/CSS/JS with no build step, so the same files deploy to GitHub Pages and Vercel. It works offline after the first visit.

## Run locally

```bash
python3 -m http.server 5180
```

Then open http://localhost:5180. Run `npm run validate` to check the content files.

## How content is organized

All language content lives in `content/`. The UI code (`js/`, `css/`) has no phrases in it.

| File | What it is | Who edits it |
|---|---|---|
| `languages.json`, `concepts.json`, `lang/*.json` | **The dataset (source of truth).** Copied verbatim from `steven_travel_language_dataset_v1_1`. | Only when the dataset itself changes |
| `categories.json` | The 10 category labels and icons, mapped to dataset category ids | UI taxonomy |
| `tiers.json` | Core 20 / Travel 50 / Explore 100. Tiers are cumulative: Travel includes Core, Explore includes everything | UI taxonomy |
| `scenarios.json` | Scenario buttons. Each lists **concept ids only**, never language text | Curation |
| `patterns.json` | Power-pattern helpers: related phrases, and a slot for vetted substitution words per language | Curation |
| `sounds/<code>.json` | Sound guide per language. **Written for Wayword, not from the dataset.** Examples are concept ids plus an optional `mark` (the letters to highlight); `npm run validate` checks every mark exists in the phrase | Curation |
| `language-meta.json` | Accent colors, motif, BCP-47 tag, device text-to-speech on/off, preferred voice regions and a warning shown before audio plays | Presentation |
| `source/` | The dataset's own README and build spec, for reference | — |

`concepts.json` is the canonical cross-language map. Each language file has one entry per concept `id`. If a language is missing a concept, the card says "Not in the dataset yet" instead of filling something in.

### Fields a phrase card shows

`english`, `target`, `pronunciation_easy` are required. These optional fields render automatically when an entry has them:
`reading` (a kana/phonetic line shown under the native text when it differs, used by Japanese), `regional_note`, `usage_note`, `example`, `response`. Today only `regional_note` appears in the data (3 Portuguese entries).

### Add a language

A ready-made prompt for building a new language file with another AI tool is in `docs/ADD_A_LANGUAGE_PROMPT.md`.

1. Add `content/lang/<code>.json` in the same shape as the others, plus a row in `languages.json`. RTL languages use `"direction": "rtl"`.
2. Add a block in `language-meta.json` (accent colors, glyph, `bcp47`, `asr`). For scripts written without spaces (Japanese, Chinese, Thai) set `"no_spaces": true` so the speech check compares character by character, and put `___` in the pronunciation of patterns yourself.
3. Add the file to `LANGS` in `sw.js` and bump `VERSION`.
4. Run `npm run validate`.

### Add phrases, scenarios, or substitution words

- **New phrase:** add the concept to `concepts.json`, then an entry with the same `id` in every `lang/*.json`.
- **Scenario:** add an object to `scenarios.json` with concept ids.
- **Substitution words** for a pattern: add them under `patterns.json → patterns.<pattern id>.substitutions.<lang code>` as
  `{ "english": "the station", "target": "…", "pronunciation_easy": "…" }`. They show as chips under the pattern.

After any content change, bump `VERSION` in `sw.js` so installed phones pick it up.

## Learning flow

- **Next step card** on each language home: one action, always (start, keep going, or move up a level once a level is complete).
- **5-minute session** (`#/<lang>/session`): the next 5 unlearned phrases in Core → Travel → Explore order. Each one: listen, say it, compare. Then a quick self-check; "Got it" on the first try marks the phrase learned, misses come back next session.
- **Flashcards** mark a phrase learned on a first-try "Got it". The end screen offers the missed cards, a speaking round, or home.
- **First-time guide** opens on the first language visit; the ? button in the header reopens it.

## Audio and speaking

- `js/speech.js`: device text-to-speech. Play, pause, resume, replay, loop, five speeds (0.5× to 1.5×), and a voice choice per language.
- `js/voices.js`: labels voices female or male by first name, since browsers don't say.
- `js/speak.js`: "Say it". Records your voice for playback and, where the browser supports speech recognition, transcribes it and marks which words came through. The recognition language per language is `asr` in `language-meta.json`.

- **Mic check** (`#/<lang>/mic`, linked under Audio): tests speaker, recording, speech check, and both together on the actual phone, saves the setting that works, and produces a copyable report.
- **`tests/mic-stress.html`**: open on localhost and press Run. Drives the real capture code with a simulated mic (a recorded "Olá" + silence) and simulated recognizers that fail, hang or lag. Checks auto-stop, stop latency, mic release, error messages and word matching.

## Progress

Favorites, learned marks, the level filter and the EN/Aa toggles are stored in `localStorage` on each device (`wayword:v1`).
There is no account or sync yet.

## Deploy

- **GitHub Pages:** served from the `main` branch root (`.nojekyll` is present). Pushing to `main` redeploys.
- **Vercel:** static project, no build command. `vercel.json` only sets cache headers so the service worker and content refresh.

## Extension points left open

Native audio files (a `audio` field per entry), spaced repetition (learned timestamps are already stored),
gender and regional variants (extra fields on an entry), a Core-only "flying tomorrow" mode (a new tier in `tiers.json`),
and user phrase modules such as Barbershop Russian (a new scenario plus new concepts).
