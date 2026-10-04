# Prompt: add a language to the Wayword dataset

Paste this into the AI tool that built the original dataset. Attach `content/concepts.json` and one finished language file as an example (e.g. `content/lang/es.json`). Replace JAPANESE / ja with your language.

---

Add **Japanese** to my travel language dataset, using exactly the same framework as the attached files.

Output one file, `ja.json`, with this shape:

```json
{
  "schema_version": "1.0",
  "language_code": "ja",
  "name": "Japanese",
  "native_name": "日本語",
  "region": "Japan",
  "direction": "ltr",
  "notes": { "register": "...", "pronunciation": "..." },
  "entries": [
    {
      "id": "hello",
      "category": "essentials",
      "priority": "core",
      "english": "Hello",
      "type": "phrase",
      "target": "こんにちは",
      "reading": "こんにちは",
      "pronunciation_easy": "kon-nee-chee-wah",
      "usage_note": "optional"
    }
  ]
}
```

Rules:
1. One entry for **every** concept in `concepts.json` (56), same `id`, `category`, `priority`, `type` and `english`. Don't add, drop or rename concepts.
2. `target`: natural, polite spoken Japanese the way a native speaker would write it (kanji + kana). Polite (です/ます) by default for strangers and service staff; social and flirting phrases may be casual. Note the register in `usage_note` when a casual or polite alternative matters.
3. `reading`: the whole phrase in hiragana (kana for any katakana words is fine), so kanji can be read.
4. `pronunciation_easy`: an English-speaker respelling, hyphenated by syllable, like the other languages. Show long vowels doubled ("toh-kyoh"), double consonants ("kit-teh"), and whispered vowels as most people say them ("des-kah" for ですか).
5. **Patterns:** put the blank `___` in `target`, `reading` AND `pronunciation_easy`, at the right spot (e.g. `___はどこですか` / `___ wah doh-koh des-kah`).
6. `[language]` patterns use Japanese itself (日本語).
7. Optional `regional_note` / `usage_note` only where they genuinely help a traveller. Never invent an `example` or `response` you're not confident in.
8. If a concept has no natural equivalent, still give the most natural way to say it and explain in `usage_note`. Don't leave gaps.

Also list any phrases where you're unsure, so a native speaker can check them.
