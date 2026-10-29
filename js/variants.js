// Pattern variations ("Swap it"): complete sentences per language, never built by pasting a word
// into a frame, because articles, gender, case, particles and word order change between them.
//
// content/patterns.json lists each frame's variants, in chip order. A variant is either
//   - a word id from content/vocab.json ("word_airport"), or
//   - an object { id, label, english, same_as? }.
// same_as reuses an existing phrase ("How much is this?" for how_much_is + "this"): its vetted text
// and its recording, rather than a second copy.
// Each language's sentences live in content/added/<code>.json → examples[frame] =
//   [{ word: <variant id>, target, pronunciation_easy, reading? }].
// A variant a language doesn't have yet is simply left out (no chip), never invented.

// English for a variant: its own, or the frame with the word in it ("Where is the train station?").
// If the frame already has "the"/"a"/"my" just before the blank ("the nearest ___"), the bare word goes in.
export function fillEnglish(frame, w) {
  return frame.replace(/\b((?:the|a|an|my) (?:\w+ )?)?_{2,}/i, (m, art) => (art ? art + w.english : w.in_sentence || w.english));
}

// The variants a frame offers, as { id, label, english?, same_as? } (words resolved from vocab).
export function variantDefs(conf, words) {
  return (conf?.examples || []).map((v) => {
    if (typeof v !== 'string') return v;
    const w = words.get(v);
    return { id: v, label: w ? w.english : v, word: w || null };
  });
}

export function variantEnglish(frameEnglish, def) {
  if (def.english) return def.english;
  return def.word ? fillEnglish(frameEnglish, def.word) : '';
}

// Build every frame's variants for one language.
//   phraseById: the language's phrases (for same_as); added: content/added/<code>.json; checked: crosscheck results.
export function buildVariants({ code, concepts, patterns, words, added, phraseById, checked = {} }) {
  const out = {};
  for (const [pid, conf] of Object.entries(patterns)) {
    const frame = concepts.get(pid);
    if (!frame) continue;
    const written = new Map((added?.examples?.[pid] || []).map((x) => [x.word, x]));
    const items = [];
    for (const def of variantDefs(conf, words)) {
      if (def.same_as) {
        const p = phraseById.get(def.same_as);
        if (p && !p.missing) items.push({ ...p, label: def.label, same_as: def.same_as });
        continue;
      }
      const x = written.get(def.id);
      if (!x?.target) continue; // not written in this language yet: no chip
      const id = `${pid}~${def.id}`;
      const item = { id, key: `${code}:${id}`, label: def.label, target: x.target, pron: x.pronunciation_easy, english: variantEnglish(frame.english, def), draft: true };
      if (x.reading) item.reading = x.reading;
      if (checked[id]?.status === 'match') item.native_match = true;
      items.push(item);
    }
    if (items.length) out[pid] = items;
  }
  return out;
}
