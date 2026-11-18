# Pronunciation-line audit (2026-11-18, v53)

The owner's report: the pronunciation line read word by word ("es-keel yah day…") while the "Listen for" note under it gave the way it's really said ("es-kee-YAH day…"). Two lines disagreeing is worse than either.

## What was wrong

1. **Careful, word-by-word respelling** where everyone reduces: Portuguese *está* as "esh-TAH" (said "shtah"), *que* as "keh" (said "kuh"), French *il y a* as "eel yah" (said "ee-yah"), *je ne* as "zhuh nuh" (said "zhuhn").
2. **The same word spelled two or more ways** across phrases (found by `scripts/fix-pron.py`'s scan): Portuguese 24 words, Russian 24, Arabic 27, Hebrew 19, French 17, Italian 12, Romanian 9, Spanish 3. Some differences are right (French liaison, Russian в as "v"/"f", Hebrew gender forms) and were left alone.
3. **Lines with no stress shown** ("oo keh faz", "ee too").
4. **Spellings an English reader mis-says**: Russian "-zat" (reads like "cat"; now "-zaht"), "ah-leer-GEE-yah" (reads "jee"; now "GHEE"), "tak-see" (now "tahk-see").

## What changed

| Language | Lines changed | Of which vetted (overlay) |
|---|---|---|
| European Portuguese | about 100 | 19 |
| French | 69 | 10 |
| Russian | 66 | 11 |
| Levantine Arabic | about 47 | 9 |
| Italian | 24 | 6 |
| Romanian | about 25 | 5 |
| Hebrew | about 19 | 7 |
| Spanish | 7 | 1 |
| Japanese | 0 | 0 (kana is the authority there) |

Rules: one respelling per word; CAPITALS on the stressed syllable in every line; Portuguese unstressed *es-* at the start of a word is "sh"; French *il y a* → "ee-yah", *qu'est-ce que* → "kesk", *est-ce que* → "esk", *je ne* → "zhuhn".

Deliberately not changed: Spanish linking (the "Listen for" notes explain it; fused spellings like "PWEH-deh-sah-BLAR" are harder to read than "PWEH-des ah-BLAR"), and casual French drops ("shpuh" for *je peux*) which stay as notes.

## How it's stored

- Drafts (`content/added/`) are corrected in place.
- The vetted dataset (`content/lang/`) is not edited. Its corrected lines live in `content/pron/<code>.json` (`{ id: pronunciation }`), which `js/data.js` lays over the vetted file at load.
- `python3 scripts/fix-pron.py` reapplies everything (safe to rerun; `--dry` previews). Add a word to `WORDS`, a whole-line pattern to `LINES`, or a single line to `IDS`.

## Not done

- No one has checked these against a native speaker's ear. The scan finds inconsistency, not wrongness: a word that's spelled the same wrong way everywhere isn't caught.
- When a language gets recorded audio, listen through with the pronunciation line on screen (the karaoke view) and log mismatches.
