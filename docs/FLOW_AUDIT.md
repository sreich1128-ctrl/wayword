# Wayword flow audit

2026-10-12. Based on the code, a walkthrough as a first-time visitor on a phone-sized screen (375×812, European Portuguese), and the two research reports in `docs/research/` (ChatGPT and Claude). Principle numbers below are written **C#** (Claude report) and **G#** (ChatGPT report).

## Bottom line

The core loop isn't what overwhelms people. The overwhelm comes from three things around it:

1. **Too many front doors to the same few activities.** The language home has 8 sections and 55 tappable things over 3.2 screen-lengths. The same activity can be reached from 2 to 4 places, each with a different name.
2. **Three ways of sorting the same 56 phrases at once**: levels (Core/Travel/Explore), Places (9) and categories (10). Levels also *hide* phrases when you're looking something up.
3. **The loop users love appears in four different shapes**, so it never becomes one familiar thing.

On top of that, a new user meets about 25 Wayword-specific terms and a 270-word tour before hearing a single phrase.

The research agrees on the fix: keep the loop and make it the one consistent screen everything leads to. Give one obvious next step, a fast lookup path for "I need it now", and make the rest appear when it's relevant (C4, C6, C7, C14; G2, G4, G5, G6).

## What a first visit looks like today

| Step | What happens | Measured |
|---|---|---|
| 1. Open the app | Passport cover animation, then the passport page: 9 language stamps | Picking a language is the only choice: good |
| 2. Tap Portuguese | **Welcome tour opens** in a sheet: 6 numbered lessons (levels, how to read a phrase, Listen/Say it, Lock it in, EN/Aa, navigation) | 270 words. The "Start my first 5 phrases" button is below the fold |
| 3. Close the tour | Language home | 55 tappables, 17 above the fold, 3.2 screens, 8 sections |
| 4. Start a session | Phrase 1 of 5: Listen, then Say it | 21 tappables on screen, including the 5-tab bar, language chip, EN/Aa/? |

**First audio heard:** after 3 taps (language, the tour button, Listen) plus reading or skipping the tour. If they close the tour instead: language → close → scroll or Phrases → Listen.

## Every screen, measured

| Screen | Tappables | Above the fold | Length (screens) | Words |
|---|---|---|---|---|
| Language home | 55 | 17 | 3.2 | 234 |
| Phrases tab | 126 | 35 | 7.1 | 463 |
| Places tab | 24 | 21 | 1.0 | 68 |
| One place (Café) | 70 | 24 | 4.2 | 235 |
| Patterns tab | 43 | 20 | 2.4 | 205 |
| Practice tab (setup form) | 24 | 20 | 1.2 | 95 |
| Flying soon? | 34 | 12 | 2.3 | 214 |
| Sound guide | 61 | 10 | 5.4 | 655 |
| Cheat sheet | 37 | 19 | 2.9 | 241 |
| Learn session, phrase 1 | 21 | 18 | 1.1 | 79 |
| Welcome tour (sheet) | 3 | 1 | 1.4 | 270 |

There's no magic number of buttons (C1, G1). What matters is that most screens give **equal weight** to many options with no clear first one, and that the focused screens (sessions) still show all the navigation.

## The map: one loop, many doors

### The same activity, reached from several places

| Activity | Ways in | Names used |
|---|---|---|
| Guided learn-5 session | Language home "Start here" · welcome tour button · Flying soon? crash course · after Lock it in · session end "Learn 5 more" | Start a 5-minute session, Start my first 5 phrases, Crash course, Learn 5 new phrases |
| Flashcards | Home "More practice" · Practice tab · each Place · session end · deck end | Flashcards, Reverse flashcards, Shuffle & start |
| Speaking practice | Home "More practice" · Practice tab · each Place · every phrase card's "Say it" · Learn session step 2 | Speak it, Say it, Your turn, Now say them aloud |
| Review | Passport "Due today" strip · home card when due · Flying soon? quick review · level-complete card | Lock it in, Due today, Quick review, Review 5 at random |
| Finding a phrase | Phrases tab (search + 13 chips) · Places tab · home "Where are you?" · home "Browse" (10 categories) · Saved · Cheat sheet | Phrases, Places, Where are you?, Browse, Cheat sheet |
| Patterns | Patterns tab · home "Browse" | Patterns, Power patterns |

### The core loop exists in four shapes

| Where | Shape |
|---|---|
| Phrase card → "Say it" | A bottom sheet: Listen, speed bar, big mic, mode switch, then Compare with 3 buttons (Hear it, Hear me, Back to back) |
| Learn session | A numbered page: Listen, speed bar, big mic, Compare, Next |
| Practice → Speak it | A flashcard: English, then mic, then the answer on the back, then Again/Got it, with Listen/speed/status below |
| Quick check / Lock it in | A flashcard: English, then tap to reveal, then Not yet/Got it (no recording) |

Each shape has different buttons in different places. A user can't build one "this is how Wayword works" habit (C14, G13; Duolingo and Pimsleur each have one repeated shape).

## Findings

Severity: **High** = a direct cause of the overwhelm. **Medium** = adds friction. **Low** = polish.

### 1. The language home asks for a decision before the loop (High)
- **Seen:** below the good "Start here" card come More practice (6 rows), Phrase of the moment, Where are you? (9 buttons), Browse (2 + 10 rows), Audio settings, and notes. The level tabs sit above everything.
- **Research:** one default action, everything else secondary (C6, G6). New, rushed, unsure users are exactly where choice overload bites (C4, G2).
- **Keep:** the "Start here" card itself. It's the right idea, it just competes with 7 other sections.

### 2. Levels filter everything, including lookup (High)
- **Seen:** the Core/Travel/Explore tabs appear on Home, Phrases, Places and Patterns and *hide* phrases. In Places at Core: Restaurant shows 7 of 16, Meeting People 4 of 18, and **Flirting 0 of 13** (an empty card). Someone at a restaurant gets fewer than half the restaurant phrases unless they understand levels.
- **Research:** when someone needs a phrase now, the immediate goal wins (G2, G8; C4, change 4). Levels are a learning-order idea, not a lookup filter.
- **Direction:** levels decide *what the session teaches next*. Lookup always shows everything.

### 3. Two overlapping ways to group phrases (High)
- **Seen:** 9 Places (Café, Restaurant, Transportation, Lost / Directions, Hotel, Shopping, Meeting People, Flirting, Barber) and 10 categories (Essentials, Language Rescue, Power Patterns, Getting Around, Food & Drink, Money & Paying, Social Conversation, Conversation Glue, Connection / Flirting, Problems & Help). Both are on the home page; categories are also the Phrases chips and the Practice dropdown.
- **Research:** labels must mean something before you learn the product (G5). Situations are what travelers recognize (G5, C10).
- **Direction:** one list of situations for finding phrases, with search. Categories become internal tags at most.

### 4. Too many Wayword terms to learn (High)
- **Seen:** about 25 product terms a new user meets: Core, Travel, Explore, Learning, Locked in, Lock it in, Due today, Start here, Crash course, Flying soon?, Rescue kit, Cheat sheet, Power patterns, Phrase of the moment, Flashcards, Reverse flashcards, Speak it, Say it, Type it, Quick check, Sound guide, Saved, Not started, Mic check, EN / Aa. The welcome tour tries to teach them all up front (270 words, 6 lessons).
- **Research:** recognition over recall; names that build personality vs labels that convey meaning (G5). Don't make people remember instructions across screens (C1). Teach in context (G4).
- **Direction:** cut the up-front tour. Explain each thing the first time it appears (for example, a one-line "how to read this" on the first phrase).

### 5. The loop has four shapes (High)
- **Seen:** see the table above.
- **Research:** one universal phrase player that every route leads to (G change 2, confidence 0.94); flow breaks at mode switches (C14, G13).
- **Direction:** one phrase player. Modes change *how a phrase is prompted* (hear first vs English first), not the screen.

### 6. The session screen isn't focused (Medium)
- **Seen:** during a session the full 5-tab bar, language chip, EN/Aa/? stay visible (21 tappables). The bottom bar overlaps the "Next phrase" button. Two equally strong blue elements (the big mic and Next) compete. The 5-option speed bar is always open. Listen doesn't play by itself.
- **Research:** protect the flow state; no unrelated options mid-task (C14, G13); one dominant action (C6); audio on tap with no lag (C8, G7).
- **Direction:** a full-screen session with only Close. Play the phrase automatically when it appears, with speed tucked behind one control.

### 7. Compare isn't guided (Medium)
- **Seen:** after recording, three buttons: Hear it, Hear me, Back to back. Nothing says what to listen for. The new "How it's said" tips sit in the card above, not at the compare step. The speech-check verdict ("Clear. Your phone understood almost every word") measures whether the phone recognized the words, not pronunciation.
- **Research:** beginners often can't hear their own errors; feedback should name one thing to listen for (C15, C19, G18).
- **Direction:** after recording, play native → you → native automatically, with one "Listen for: …" cue (from the tips and Sound guide). Keep the speech check, but say what it is.

### 8. Always hear-first; recall lives somewhere else (Medium)
- **Seen:** the Learn step always plays the answer first. Recall from English (the strongest learning move) only happens in the Quick check, Lock it in and flashcards, which are separate places.
- **Research:** retrieval practice is the strongest-evidence finding in both reports (C16, G15); Pimsleur's prompt → pause → answer (both reports).
- **Direction:** the first time, hear it; every time after, show the situation, you say it, then hear the native, inside the same session.

### 9. Review and the trip date are separate destinations (Medium)
- **Seen:** reviews are a "Lock it in" mode reached from a Due strip or a home card. The trip date lives on the Flying soon? page and only speeds up review gaps. The crash course is a separate mode limited to Core. The new-phrase session doesn't use the trip date.
- **Research:** review should be the engine inside every session, paced to the trip (C17, change 3; G16, change 4). Cap reviews, with no backlog guilt (C17; Anki anti-pattern).
- **Good news:** spaced review, per-language trip dates and the 20-a-day cap **already exist** in `js/schedule.js` and `js/store.js`. This is mostly rewiring, not new science.

### 10. Lookup is slow and buried (Medium)
- **Seen:** "I'm at the café, what do I say?" means Places → Café → scroll 4.2 screens of cards, each with 4 buttons, filtered by level. The best lookup screen, the Cheat sheet (all phrases with play buttons on one screen, offline), is buried in Home → Flying soon? → section 3, and shows Core only.
- **Research:** a just-in-time "Now" mode (C change 4, G change 1); interruption-proof, glanceable steps (C3, G3).
- **Direction:** a "Phrase now" path: pick a situation, get big cards with one-tap audio and a show-this-screen view. It's mostly the Cheat sheet, promoted.

### 11. Progress is abstract (Low)
- **Seen:** "0/23 Core", "0 learning · 0 locked in", a ring. Nothing says what you can *do*.
- **Research:** competence framed as real situations ("Café ready", "You can now order a coffee") (C10, C12, C20; G9, G11).
- **Direction:** show readiness by situation, and end sessions with "You can now: …".

### 12. "Learn" on every phrase card skips learning (Low)
- **Seen:** each phrase card has a "Learn" button that adds the phrase straight to Learning, without the first-try recall that sessions and flashcards require. It also adds a fourth button to every card.
- **Direction:** replace it with "Practise this" (opens the phrase player), or drop it. The star already saves a phrase for later.

### 13. A few smaller things (Low)
- The passport cover animation plays on every new browser session before you can tap anything (about 1 s; tap skips it).
- The Sound guide is only on the home page (and now in tip links), not in the bottom bar. That's fine, but the research says to surface it when a sound is hard, not as a 5.4-screen read (C7, G4).
- Audio is cached for offline only after a phrase has been played once. To work on a plane, a session should cache its audio when it starts (C8).

## What's already right (keep it)

- **The loop:** hear, read, record, compare, with recordings kept on the device. This is the product.
- **A "Start here" card** with a 5-phrase session: the right idea, just too quiet.
- **Learn 5, then a quick check:** blocked new items, then recall (C18, G17).
- **Spaced review with a trip date and a daily cap** is already built.
- **Speaking can be skipped** ("You can skip speaking. Tap Next"), and the mic is only requested at first recording, with a primer explaining why (G8, G open question 8).
- **"How it's said" tips**: real, specific coaching, the kind of feedback the research asks for (C15).
- **Works offline** for text (service worker); progress is local, with no account needed (G8).

## Corrections to the research's assumptions about Wayword

- Both reports call the audio a "native speaker" or "human recording". It's an ElevenLabs AI voice (Claudia), with the phone voice as fallback. "Natural voice" is the honest label; the app already says that.
- ChatGPT assumes Wayword may need a connection. The app shell and text work offline; only audio not yet played is missing (see 13).
- Neither knew that Learn sessions, the quick check, the trip date and the spaced scheduler already exist, which makes their top changes cheaper than they assumed.

## Where the reports disagree, and my recommendation

**Home: one Continue button (Claude) or two choices (ChatGPT)?** I'd combine them: one big **Continue** card (today's session: due reviews plus a few new phrases, paced to the trip), and directly under it a clearly visible but smaller **Phrase now** (situations plus search). Lookup is too central to a travel app to sit behind a small link (finding 10), but it shouldn't be a second equal button that asks new users to choose between learning and lookup.

## A possible shape (for discussion, not a build plan)

- **Language home:** Continue card → Phrase now → a quiet "More" (Patterns, Sound guide, flashcard types, Cheat sheet, settings).
- **Bottom bar from 5 tabs to 3:** Today (the Continue card and progress), Phrases (situations + search, every level), More.
- **One phrase player everywhere**, plays automatically, guided compare, a "listen for" cue; first time hear-first, after that recall-first.
- **One session engine:** due reviews + new phrases, paced by the trip date. The crash course becomes "leaving in under 3 days", not a separate mode.
- **Levels stay internal** (they decide what Continue teaches next), shown as "Café ready" and "18/56 ready for Lisbon".
- **Patterns and the Sound guide in context:** "Try another drink" after a pattern phrase; a sound tip at the compare step.
- **The welcome tour goes**; each idea is explained the first time it appears.

## Open questions for the owner

1. **Who is Wayword for first:** someone a few weeks before a trip (learning), or someone already there (lookup)? It decides which of Continue and Phrase now leads.
2. **Keep the passport home** (pick a language from stamps)? It's charming and only one tap. I'd keep it.
3. **Flashcards, Reverse, Type it:** keep them as options under More, or fold them into the session as variations? The research leans fold-in, but you may like them as a power-user menu.
4. **Progress per situation** ("Café ready") instead of levels on screen: OK to retire Core/Travel/Explore as visible labels?
5. **A quick real-user test:** before building, watch 3 to 5 people try 4 tasks on their phones (find the café phrase, learn 5, come back the next day, compare their pronunciation). Both reports call this the biggest unknown.

## How this was measured

- **Tappables:** every visible link, button, input, select or `[role=button]` in the page, or in an open sheet.
- **Above the fold:** tappables inside the first screen.
- **Length:** page height divided by screen height.
- **Words:** visible text in the main content.
- **Starting state:** fresh progress in the in-app browser, restored afterwards; nothing on your phone was touched.
