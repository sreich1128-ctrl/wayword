# ChatGPT: flow research (2026-10-12)

The owner's ChatGPT answer to the prompt in `docs/RESEARCH_PROMPT.md`, **condensed** by Claude: image links and favicon clutter removed, wording shortened, every principle, rating, source and recommendation kept. Sources are not yet checked.

**Core thesis:** a smooth app doesn't necessarily have fewer features. It makes fewer decisions necessary to reach the user's immediate goal. Protect the loop (Listen → Read → Speak → Compare → Repeat) and make it effortless to enter. Two jobs, "say something right now" and "remember it later", should not compete on the same screen.

## Principles

| # | Principle | Evidence | Sources | For Wayword |
|---|---|---|---|---|
| 1 | Limited working memory: about 3–5 chunks; not a rule for button counts | Strong (the exact number varies) | Cowan 2001 (doi 10.1017/S0140525X01003922); Miller 1956; Sweller 1988 | Phrase + pronunciation + meaning together is fine (one task). Don't give equal emphasis to levels, modes, streaks and destination choices. 7±2 is not a menu rule. |
| 2 | Choice overload is conditional: reduce uncertainty, not choice | Moderate (context-dependent); Weak for "fewer is always better" | Iyengar & Lepper 2000; Scheibehenne et al. 2010 meta-analysis (50 experiments, mean effect ≈ 0) | Someone ordering coffee shouldn't need to know Phrases vs Places vs Learn vs Practice vs Crash course. Those are internal concepts. |
| 3 | Mobile attention is fragmented: progress must survive interruption | Moderate | Oulasvirta et al. 2005, *Interaction in 4-second bursts* | Waiter interrupts → come back 30 s later, phrase still there. Never restart a lesson to get one sentence. |
| 4 | Progressive disclosure | Moderate | Nielsen 2006, NN/g | Patterns as an expansion inside a phrase ("Try another drink"); Sound guide when a sound is hard, not before the first phrase. |
| 5 | Recognition over recall: labels must mean something before you learn the product | Strong (principle); Moderate (implementation) | Budiu 2024, NN/g; Nielsen's 10 heuristics | "Lock it in" doesn't say what happens; "Review phrases" does. "Patterns" → "Build a sentence". Places → real situations. |
| 6 | One clear primary action per state (a heuristic, not a law) | Moderate | Pernice & Budiu 2016 (hidden navigation, 179 participants); Cardello 2014, NN/g | Avoid eight equally prominent cards. Inside a phrase: listen → speak progression, not competing buttons. |
| 7 | Immediate, informative feedback | Moderate | Nielsen 1993 response-time limits (0.1 / 1 / 10 s); 10 heuristics | Clear Ready / Recording / Ready to compare states. If speech checking fails, still allow original-vs-mine playback. |
| 8 | Lower the activation barrier | Moderate (a framework, not a law) | Fogg 2009 Behavior Model | Language → useful phrase playing immediately; no level or mode choice first. Ask for the mic only when recording. |
| 9 | Autonomy, competence, relatedness | Strong (theory); weaker for UI translation | Ryan & Deci 2000; APA 2025 SDT review | "You can now order a coffee in Portuguese" beats "+50 XP". Skip/repeat/save freely; guidance should feel like help. |
| 10 | Habits form around stable contexts; if-then plans | Strong (implementation intentions, 94 tests); Moderate (timelines) | Gollwitzer & Sheeran 2006; Lally et al. 2010 | Situational cues ("before ordering, practise 2 restaurant phrases"), not a daily-login habit. One missed day doesn't break a habit. |
| 11 | Rewards and streaks can help or hurt | Moderate | Deci, Koestner & Ryan 1999 meta-analysis; Duolingo streak blog 2017 | Don't prioritise a daily streak (use is bursty around trips). Track mastery: "8 phrases ready for your trip". |
| 12 | Hook model is a hypothesis, not a law | Weak (as a whole) | Eyal 2014; Hamari et al. 2014 gamification review | The recording comparison is already the reward; skip mystery rewards and currencies. |
| 13 | Flow needs clear goals and feedback | Moderate | Csikszentmihalyi 1990; Peifer et al. 2022 scoping review (252 studies) | The loop is already flow-friendly; the risk is interrupting it with navigation, mode changes and result screens. |
| 14 | Difficulty matches ability | Moderate | Peifer 2022; Csikszentmihalyi 1990 | One phrase, fading support: listen with all text → say with pronunciation → say from English → recall in a scenario. Variations of one experience, not four modes. |
| 15 | Retrieval practice | Strong | Karpicke & Roediger 2008 (*Science*); Dunlosky et al. 2013 | Sometimes "How do you ask for the bill?" before revealing. Optional, never in the way of urgent lookup. |
| 16 | Spaced repetition | Strong | Cepeda et al. 2006 meta-analysis (317 experiments); Lindsey et al. 2014 | Keep "Lock it in" internally; surface it as "Review what you've learned", 3–5 phrases, scheduler hidden. |
| 17 | Interleaving after initial learning | Moderate | Rohrer & Taylor 2007; Dunlosky 2013 | Learn café phrases together, later mix with hotel and transport. Never forced on lookups. |
| 18 | Speaking feedback must be actionable | Moderate | Ngo, Chen & Lai 2023 ASR pronunciation meta-analysis (15 studies, medium effect) | Protect the native-vs-mine comparison. Any future scoring = specific coaching, not "83%". Scores can mislead for pt-PT and Levantine. |
| 19 | Physical ease = cognitive ease | Moderate | WCAG 2.2 SC 2.5.8 (24 px minimum); Budiu 2017 mobile subnavigation | Play/Record/Replay big enough to use while walking (aim for 44–48 px). |

## App examples (product evidence ≠ interface evidence)
- **Duolingo:** 2022 guided path replaced the self-directed tree; review and stories folded in. Company A/B results: separating the streak from the daily goal gave +3.3% D14 retention; streak wager gave +14% D7. Lesson: one obvious next lesson. Don't copy the whole engagement system. Sources: Duolingo blog 2022 home screen redesign; 2020 "Improving the streak".
- **Babbel:** useful language in context, 10–15 min lessons. Vesselinov & Grego 2016 efficacy study (no proper control). Lesson: organise by real conversations, with shorter sessions.
- **Speak:** speaking at the centre. Its method pages cite no independent RCT. Lesson: speaking inside the phrase, not a separate destination.
- **Pimsleur:** audio-first, pause-to-respond, graduated recall. Lesson: "Say it before you hear it" prompts for pre-trip review.
- **Anki:** prompt → recall → reveal → rate; hidden scheduler (FSRS). Lesson: hide the scheduler; two buttons ("Got it" / "Need practice"), not four.
- **Headspace:** bounded 3/5/10-min sessions with clear endings. 2022 systematic review (14 RCTs, mixed results). Lesson: two minutes should feel like enough.
- **Google Translate:** immediate utility, no lessons. Lesson: a useful phrase immediately; Wayword's edge is curated phrases, readable pronunciation and natural audio.

Collective pattern: a well-defined primary task with enough guidance to act before understanding the product's structure.

## Top 5 changes (ChatGPT's ranking)
1. **Two clear intentions on home:** "Use a phrase now" (situation, search, category) and "Practice for my trip" (guided short session), plus a quieter "Browse all phrases". Existing features become roles: Phrases → library; Places → situations inside "Use a phrase"; Learn/Practice → one guided engine; Lock it in → automatic review; Patterns → contextual expansion; Crash course → pre-trip sequence; Sound guide → contextual help. (Confidence 0.90)
2. **One universal phrase player** that every route leads to: script, pronunciation, meaning, hear, record, compare, retry, without leaving. (0.94)
3. **Quick practice that builds itself:** about 2 min; hear and repeat → record and compare → related phrase → recall from English; due reviews mixed in; stop after any phrase. (0.86)
4. **Spaced review built into the normal journey:** "3 phrases worth reviewing, ~1 min"; strength based on recall, not replays; never blocks urgent lookup. (0.92 spacing / 0.78 presentation)
5. **Advanced features appear in context:** Patterns after a reusable phrase; Sound guide on a hard sound; typing optional; Crash course on a pre-trip goal; filters inside browse. "Entry points vs capabilities." (0.85)

## Disagreements and open questions
1. Fewer choices ≠ less confusion; labels, hierarchy and duplicated routes may matter more. Two intentions vs one search-first screen is untested.
2. Guided path vs direct lookup: keep both, on the same phrase player.
3. Daily retention is the wrong metric; use time to playback, delayed recall, and return trips.
4. The pronunciation line may create dependence; let it be hidden during recall; good recordings beat precise-looking respellings.
5. How much speaking feedback? Test before adding scores.
6. There is no proven session length; start at 2 min as an experiment.
7. Decision fatigue / ego depletion: Hagger et al. 2016 23-lab replication found ≈ 0; don't argue from it.
8. Recording must stay optional: a full listen-and-read path without the mic (noisy queues, shyness).
9. Offline reliability may matter more than new learning features (text plus downloaded audio).
10. Product-effectiveness research ≠ interface research.
11. Biggest unknown: which job users prioritise. Suggests 8–12 travellers doing realistic tasks on their own phones (restaurant lookup, hotel prep, pronunciation repeat, resume after interruption, review).

Final test: *a first-time traveler should open Wayword, find a relevant phrase, hear it, and be ready to use it without having to learn how Wayword itself works.*

## Claude's notes (for the merge)
- Most citations are well-known works that exist (Cowan, Miller, Sweller, Iyengar & Lepper, Scheibehenne, Fogg, Ryan & Deci, Gollwitzer & Sheeran, Lally, Deci/Koestner/Ryan, Karpicke & Roediger, Dunlosky, Cepeda, Rohrer & Taylor, Hagger 2016, NN/g articles, WCAG 2.2). Still to verify: Ngo/Chen/Lai 2023, Peifer 2022 details, Lindsey 2014 percentages, the Duolingo A/B numbers, the "APA 2025" SDT page, and the Speak "Live Tutor" 2026 post.
- It made assumptions about Wayword to check in the audit: it calls the audio "human-recorded" (it's ElevenLabs AI), it assumes nothing works offline (a service worker already caches the app; the MP3s are not pre-cached), and it doesn't know about the existing speech check, Mic check, or Learn steps.
