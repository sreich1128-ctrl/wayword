# Starting the next Wayword chat

Paste this as the first message of the new chat:

```
We're continuing work on Wayword, my travel phrasebook app, in ~/Projects/wayword.
Before doing anything, read docs/HANDOFF.md ("Current state" first), then docs/PRINCIPLES.md
and docs/LEVEL2.md. Tell me in a few lines what state the app is in and what the open items are,
then wait for me to pick what we do.

Standing rules: never edit content/lang/*.json; new content goes in as labelled drafts; bump
VERSION in sw.js on every change; ask before spending ElevenLabs credits; never tell me to remove
or reinstall the app; test in a separate tab at http://127.0.0.1:5180 so my own progress at
localhost:5180 isn't touched; deploy to GitHub Pages by pushing and to Vercel from a clean worktree.
```

## What the second chat did (2026-10 to 2026-11-20, v28 → v54)

1. **Audio and coaching:** tuned the Portuguese ElevenLabs voice, added "how it's said" tips.
2. **Flow redesign** from research: one session engine, three tabs (Today, Phrases, More), situations.
3. **Retention:** spaced reviews that get harder (recognize, build, say, type, answer), keep checks, honest grading, calendar reminder.
4. **Swap it** pattern variations, Build it tiles, Swap race.
5. **Game feel and design:** feedback panel, sounds, combo, scoreboard, Progress page, the chunky cartoony look, the mascot, sticker stamps, week circles.
6. **Karaoke** (words light up as audio plays), **tap a word to hear it**, **hear it then build it**.
7. **Fixes from phone testing:** playback volume (the mic was being opened early), a clear way out of typing, "don't ask me to type", a message when a hearing aid switches the mic.
8. **Topic audit and Level 1 repairs:** Flirting rebuilt, four new situations (Airport, Sightseeing, Bar, Numbers & time), situation pages show their own phrases first.
9. **Level 2 · Communicative:** unlock rules, the Level 2 test, level tabs, and all content in 9 languages (130 phrases, 53 replies each).
10. **Pronunciation-line audit** in 8 languages.
11. **Spanish recorded voices:** Nelly (Level 1) and Camilo (Level 2).
12. **Backup and restore** of progress, after the owner lost his by removing the app.

## Good first things for the third chat

- Rebuild the owner's progress with a restore file (he needs to say which languages).
- A ChatGPT review pass of the Level 1 repairs and Level 2 drafts, language by language.
- Record Portuguese Level 2 and drafts, then pick the next language for a recorded voice.
- Decide what "finishing a level" looks like (certificate page), then accounts, then publication.
