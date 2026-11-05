# Karaoke, tap to hear, hear then build (2026-11-05, v42)

Handoff for the "hear the words" features. Principles they answer to: `docs/PRINCIPLES.md`.

## What was built

1. **Karaoke.** When a phrase plays, the word being said lights up (accent colour, a small lip) and words already said stay tinted. Works on every native line drawn by `phraseLines()` (lookup cards, lesson cards, lists) and the Recognize step. Off where the text would give an answer away (Build and Type prompts never show it).
   - `js/karaoke.js`: pure helpers (word split, estimate, which word at time t, phone word events, aligner characters → word times). Tested in `tests/karaoke.test.mjs`.
   - `js/speech.js`: `currentWord()` says which word is playing. Recordings: real times from `content/audio/<lang>/timings.json`, else an estimate from the recording's length. Phone voice: its word ("boundary") events, else an estimate from text length and speed. Slow playback stays in sync (recordings follow the audio clock; estimates scale with speed).
   - `js/app.js`: words are wrapped in `<span class="kw" data-w>` after render (a MutationObserver on `#app`, walking text nodes so sound-cue highlights and blanks survive); one `requestAnimationFrame` loop paints while audio plays.
2. **Tap a word to hear it.** Native lines with `data-tap` (lesson card, lookup card, Recognize) have a faint dotted underline; a tap plays just that word (`tts.playWord`). From the recording when word times exist (cut 40 ms early, 60 ms late; words under 0.25 s play at 0.85×); otherwise the phone's voice says the word alone. No meanings.
3. **Hear it, then build it.** In reviews at the Build rung, every other Build is heard instead of read (`buildPrompt()` in `js/plan.js`; turns carry across sessions via the session count). The phrase plays automatically, with a big Listen button to replay. A miss shows the right version and plays it with karaoke (existing reveal flow). The quick check after learning always reads.
4. **Service worker fix.** Install fetches every precached file with `cache: 'reload'`, so a new version can't mix in an older module from the browser cache (this broke the app in testing).

## Decisions

- **Word cut from the phrase, not a separate clip** (European Portuguese reduces and links words; the in-phrase sound is what you'll hear and need to say; no extra credits). Short words play slightly slower instead.
- **Phone-voice languages: the phone says the word on its own** (owner's call). Free; it's the dictionary sound, not the in-phrase one.
- **Hear then build: reviews only** (owner's call), as a second way of asking Build, not a new step type. The single-word "hear a word, tap it" drill was dropped: tap-to-hear covers words, and a word drill would teach word-by-word thinking.
- **No word meanings** on tap (principle 3, and ~1,100 unchecked glosses).
- **Japanese: karaoke and tap are off.** No spaces between words, so no reliable word split yet.

## What's left

- **Real word timings for Portuguese.** `scripts/align-audio.mjs` is written and tested offline, but the ElevenLabs key lacks the **Forced Alignment** permission (401, nothing charged). Once it's on: `node scripts/align-audio.mjs --lang=pt-PT --limit=3` (trial, owner checks credits used), then without `--limit`. Commit `content/audio/pt-PT/timings.json`, bump `sw.js`. Until then recordings use the length estimate, and tapped Portuguese words use the phone voice.
- Draft phrases recorded later need a rerun (it skips what's done).
- **iPhone checks:** word events from the phone voice are patchy on iOS (estimate takes over); seeking inside a recording served by the service worker for tap-to-hear is untested on iOS.
- Japanese word split (maybe from the `reading` line or a small segmenter).
