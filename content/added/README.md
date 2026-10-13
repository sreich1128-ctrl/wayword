# content/added: draft content, not yet checked

One file per language (`<code>.json`) holding content added after the original dataset:
the 2026-10-13 expansion (docs/EXPANSION_PLAN.md). Everything here is a **draft**: written by
Claude, not yet checked by a native speaker or the owner's dataset tool. The app shows it with a
"Draft" tag. Once an item is checked, move it into `content/lang/<code>.json` (the vetted dataset)
and delete it here.

English, category, priority and type come from content/concepts.json, vocab.json and replies.json;
these files only hold the language's own text.

```json
{
  "language_code": "fr",
  "review": "draft",
  "source": "Claude draft, 2026-10-13. Not yet checked by a native speaker.",
  "entries": [
    { "id": "goodbye", "target": "Au revoir.", "pronunciation_easy": "oh ruh-VWAHR", "qa": "optional note for the reviewer" }
  ],
  "vocab":    { "word_airport": { "target": "l'aéroport", "pronunciation_easy": "lah-ay-roh-POR" } },
  "examples": { "take_me_to": [ { "word": "word_airport", "target": "À l'aéroport, s'il vous plaît.", "pronunciation_easy": "ah lah-ay-roh-POR, seel voo PLEH" } ] },
  "replies":  { "anything_else": { "target": "Autre chose ?", "pronunciation_easy": "OH-truh SHOHZ" } }
}
```

Japanese adds `"reading"` (kana) to every entry, word, example and reply. Frames (`type: pattern`)
keep `___` in `target` (and `reading`) exactly where the blank goes. `examples` are complete
sentences: grammar is applied per language, never by pasting a word into the frame.
