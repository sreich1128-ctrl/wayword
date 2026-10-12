# Wayword redesign plan: one loop, one next step

2026-10-12. Follows `docs/FLOW_AUDIT.md` and the research in `docs/research/`. Status: **approved 2026-10-12.** Phases 1–3 shipped 2026-10-12.

## The owner's answers that shape this

1. **Who it's for:** both the hobbyist before a trip and the traveller mid-trip. The goal is "enough of a language to travel". So the app needs a learning path *and* a fast lookup, and neither should block the other.
2. **Passport home:** keep it.
3. **Flashcards, Reverse, Type it:** follow the research (see below).
4. **Progress:** "ready for different contexts" is what matters. Core/Travel/Explore stop being visible labels; everything is beginner to intermediate anyway.
5. **No user test first:** the redesign comes from many testers' feedback already.

### What the research says about the practice modes (question 3)

| Mode | What it trains | Research | Decision |
|---|---|---|---|
| **Flashcards** (English → say it) | Recall and production | The strongest-evidence finding in both reports (retrieval practice) | **Folded in.** It becomes the normal way you meet a phrase the second time, inside every session. No separate mode needed. |
| **Speak it** | Production aloud | Production effect, pronunciation practice | **Folded in.** Every session step can be said aloud and compared. |
| **Reverse** (Portuguese → meaning) | Recognising | Weaker for learning to speak; but understanding replies matters when travelling | **Changed.** It becomes an occasional "What did they say?" listening check inside sessions (hear it, pick the meaning). Not a separate mode. |
| **Type it** | Spelling, accents, script | Useful but not central to speaking while travelling; both reports say "optional" | **Kept as an extra** under More, for people who want it (especially for scripts like Russian or Hebrew). |

## The shape

```
Passport (pick a language)          unchanged
└── Language
    ├── Today        Continue card · Phrase now · your situations
    ├── Phrases      every situation + search, every level, big play buttons
    └── More         Sound guide · Patterns · Type it · Cheat sheet / print · trip date · voice · Mic check
```

- **Bottom bar:** 3 tabs (Today, Phrases, More) instead of 5.
- **Sessions are full-screen:** only a Close button; no tabs or toggles.

### Situations replace levels and categories on screen

- The 9 Places become the one way to group phrases, plus a new **"The basics"** situation for phrases that go everywhere: hello, thank you, yes, no, excuse me, I don't understand, and so on. Curation only: concept ids in `scenarios.json`; translations untouched.
- **Readiness per situation:** "Café: 9 of 16 ready". Phrases are shared across situations (*thank you* is in 5 of them), so learning one moves several situations at once. That's the goal-gradient effect the research recommends.
- **Levels stay inside the app** as the teaching order (Core phrases come first in every situation), but nothing is hidden by level, and the Core/Travel/Explore tabs disappear.
- **Categories** stay in the data for search but aren't shown as a second list.

### The Continue card (Today)

```
Working on: ☕ Café ▾            9 of 16 ready
[ ▶ Continue · about 3 min ]
3 to review · 2 new
```

- **One button** starts today's session. The situation picker sits right on the card, so changing focus is one tap but never required.
- **Default situation:** "The basics" first, then the least-ready situation, or the one you picked.
- **Trip date:** set once ("When do you leave?"), shown as "Lisbon in 12 days". It paces reviews (the existing scheduler) and, under 3 days, the session switches to "leaving soon" mode: Core phrases first, more reviews, and a reminder to save the situation for offline use. This replaces the Crash course.
- **Phrase now:** a large secondary row under the card: "Need a phrase now? ☕ 🍽 🚕 🏨 …" opens the situation's lookup view directly.

### One session engine

Every session is about 5 phrases, about 3 minutes, and can be stopped after any phrase:

1. **Due reviews first** (up to 3, from the existing Lock it in queue, capped as today).
2. **Then 2 to 3 new phrases** from the focus situation, Core first.
3. **New phrase:** hear it → see it → say it → guided compare.
4. **A phrase you've met before:** situation prompt ("You want the bill") → say it → hear the native → guided compare → **Got it / Not yet** (that's the review result).
5. **Now and then:** a "What did they say?" listening check (hear it, pick the meaning from 2).
6. **End on a win:** "You can now: order a coffee, ask for the bill", plus Café readiness going up. One button: "Keep going" (another session) or Done.

This replaces today's Learn session, Quick check, Lock it in, Crash course, Review 5 and the flashcard decks. The review data (`srs`, `learned`, `locked`) stays as it is, so **nobody loses progress**.

### One phrase player, everywhere

The same screen in sessions, from lookup ("Practise this"), and from search:

- **Layout:** the phrase (written / pronunciation line / meaning) at the top; **the audio plays automatically** when it appears; one big button below.
- **The big button follows the step:** ▶ Play → 🎙 Say it → ↻ Compare → Next. Only one strong button at a time.
- **Guided compare:** after you record, it plays native → you → native by itself, and shows one **"Listen for:"** cue from the "How it's said" tips or the Sound guide. Hear me / Hear it / Again stay available as small buttons.
- **Skippable:** speaking can always be skipped ("Skip speaking"), so it works on a plane or in a queue.
- **Small controls:** speed is one small control, not a 5-button bar. EN/Aa hide-and-peek stays for self-testing.
- **The speech check stays,** relabelled honestly: "Your phone understood: …" (word recognition, not a pronunciation score).

### Lookup (Phrases tab, Phrase now)

- **One screen:** pick a situation (or search), and every phrase in it shows as a big card: phrase, pronunciation, meaning, one-tap play. All levels, Core first.
- **Show it:** a "Show this" button makes one phrase full-screen in large type, to hand the phone to someone.
- **Practise this** opens the phrase player.
- **Save for offline:** caches the situation's audio, so it works on a plane. When a session starts, its audio is cached automatically.
- **The Cheat sheet** becomes this screen's print view (More → Print).

### First visit

- **No welcome tour:** each idea is explained the first time it appears, in one line.
- **First phrase:** a small "How to read this: written / say it like / meaning" label on the player, once.
- **First recording:** the existing mic primer.
- **First review:** "You've seen this one. Try saying it before you hear it."
- **Kept:** the ? button keeps a short "How Wayword works" for anyone who wants it.

## Build order (each phase ships on its own and keeps everyone's progress)

| Phase | What | Why first |
|---|---|---|
| **1. Phrase player** | One player component: auto-play, one big step button, guided compare with "Listen for", skip speaking. Used by the current Learn session to start with. | It's the part people love; making it consistent and guided is the biggest single win (audit 5, 6, 7). |
| **2. Session engine** | Continue session: reviews + new from a situation, recall-first for seen phrases, listening check, "You can now" ending, full-screen. Trip date pacing; leaving-soon mode replaces the Crash course. | Removes 5 separate modes (audit 8, 9). |
| **3. Home and navigation** | Today tab (Continue card + Phrase now + situation readiness), 3-tab bar, "The basics" situation, levels hidden, tour removed. | Removes the 8-section home and the level filter (audit 1, 2, 3, 4, 11). |
| **4. Lookup** | Phrases tab as situations + search, big cards, Show this, Save for offline, Cheat sheet as print view. | Fast "I need it now" path (audit 10, 13). |
| **5. More, and in-context extras** | More page; Patterns as "Try another …" inside the player; Sound guide at the compare step; Type it as an extra. | Finishes moving features from front doors into context (audit 12, 13). |

Every phrase in every language keeps working throughout. Natural audio, the phone-voice fallback and the "How it's said" tips plug into the new player unchanged.

## What doesn't change

- **The data is untouched:** dataset translations are never edited. New curation (The basics, the "Listen for" cues) lives in `scenarios.json` and `content/sounds/`.
- **Progress:** stays on the device with no account, and existing progress carries over.
- **Practicalities:** the passport home, the audio pipeline and offline support all stay.

## Decisions to confirm before Phase 1

1. **Okay to build in this order**, shipping each phase live as it's done?
2. **"The basics" as a new first situation:** okay to add?
3. **The Got it / Not yet self-rating** stays two buttons (the research warns that more ratings overwhelm casual users). Okay?
