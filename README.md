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
`regional_note`, `usage_note`, `example`, `response`. Today only `regional_note` appears in the data (3 Portuguese entries).

### Add a language

1. Add `content/lang/<code>.json` in the same shape as the others, plus a row in `languages.json`. RTL languages use `"direction": "rtl"`.
2. Add a block in `language-meta.json` (accent colors, glyph, `bcp47`).
3. Add the file to `LANGS` in `sw.js` and bump `VERSION`.
4. Run `npm run validate`.

### Add phrases, scenarios, or substitution words

- **New phrase:** add the concept to `concepts.json`, then an entry with the same `id` in every `lang/*.json`.
- **Scenario:** add an object to `scenarios.json` with concept ids.
- **Substitution words** for a pattern: add them under `patterns.json → patterns.<pattern id>.substitutions.<lang code>` as
  `{ "english": "the station", "target": "…", "pronunciation_easy": "…" }`. They show as chips under the pattern.

After any content change, bump `VERSION` in `sw.js` so installed phones pick it up.

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
