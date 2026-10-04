# Dataset gaps and review notes

Nothing below was changed in the data. These are things the app can't show yet, or entries worth a native speaker's look.

## Gaps against the brief

- **Tier sizes.** The dataset has 23 core, 26 travel and 7 explore concepts. Cumulatively that is 23 / 49 / 56, so "Explore 100" currently holds 56.
- **No examples or likely replies.** No entry has an example or response field. The card supports them (`example`, `response`) once added.
- **No usage notes.** Only 3 Portuguese entries have a regional (Brazil) note.
- **No substitution words.** Patterns show related dataset phrases instead. Add vetted words in `content/patterns.json`.
- **Patterns from the brief that aren't in the dataset:** "Can you ___?", "Do you have ___?", "What does ___ mean?" (the dataset has "What does *that* mean?"). "I want ___" is covered by "I'd like ___"; the Hebrew and Arabic forms are literally "I want".
- **Problems & Help** has a single phrase ("Can you help me?"). Nothing for pharmacy, police, lost items, or "I'm sick".
- **Barber** has no haircut vocabulary. The scenario uses general phrases and says so on screen.
- **Gender variants.** Russian, Hebrew and Arabic are mostly masculine-speaker or masculine-addressee forms, as the dataset notes say.

## Worth a native check (not changed)

- **Levantine `excuse_me` = عفواً (AF-wan).** In Levantine speech this is often "pardon / you're welcome". To get someone's attention, لو سمحت is common, and the dataset already uses that for "please".
- **Hebrew `help_me` = אפשר לעזור לי?** Understood colloquially, but אתה יכול לעזור לי? is the more standard way to ask.
- **Register is mixed on purpose** (the dataset notes say so). Spanish "help me" uses tú; French uses vous.

## Pronunciation-line inconsistencies (found while writing the sound guides; not changed)

- **Arabic ح isn't spelled consistently.** Sometimes it's a capital H (bteH-KEE, mneeH), sometimes lowercase (ha-LEEB, sa-BAAH), so it can't be told apart from a plain ه. The sound guide warns about this.
- **Arabic `recommend_food` "shoo btin-SAHi"** has a stray final "i"; بتنصح is usually "btin-SAH".
- **Arabic ع** is shown three ways: an apostrophe (t'eed), a capital vowel (A-ra-bee), or nothing (ba-EED).
- **Hebrew `know_a_little` "KT-sat"** for קצת. It's said "ktsat", one syllable.
- **French `nearest` "oo eh luh/lah plew PROSH"** leaves out the second "le/la" that is in the French text.
- **Portuguese "com" is spelled two ways:** "kohn" in `excuse_me` (Com licença) and "kong" in `pay_card` / `apple_pay` (com cartão). It's the same nasal vowel [kõ] either way; one spelling would be clearer.

## Display-only adjustment

Pattern transliterations in the dataset leave out the blank (وين ___؟ is spelled just "wayn"). The app adds a ___ where the blank falls, counted word by word ("wayn ___", "le-___" for Hebrew ל___). The dataset files themselves are unchanged; see `slotPron` in `js/data.js`.
