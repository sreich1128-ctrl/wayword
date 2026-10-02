# BUILD_SPEC.md

Build a polished, mobile-first personal travel-language web app using the JSON files in this repository as the source of truth.

## Product goal
Answer one question extremely well:
"What do I need to understand and say to travel, solve problems, meet people, and make connections?"

## Languages
Render every language in `languages.json`.
Support LTR and RTL from the data. Arabic and Hebrew must render correctly in RTL.

## Core screens
1. Home / language selector
2. Language dashboard
3. Phrase browser
4. Scenario mode
5. Power-pattern view
6. Flashcard / practice mode
7. Favorites / learned phrases

## Phrase card
Display:
- English
- target-language text, visually dominant
- easy pronunciation
- regional or usage note when present
- priority badge
- category

## Priority filters
- Core: must-know before arrival
- Travel: high-value trip vocabulary
- Explore: useful social/expansion material

## Interaction
- Search
- Filter by category
- Filter by priority
- Favorite
- Mark learned
- Hide/show English
- Hide/show pronunciation
- Shuffle practice
- English -> target flashcards
- Target -> English flashcards
- Store progress locally for v1

## Scenario mode
Map concepts into practical views:
Cafe, Restaurant, Transportation, Lost/Directions, Hotel, Shopping, Meeting People, Flirting, Barber.
Do not duplicate language strings. Scenarios should reference concept IDs.

## Visual direction
Modern travel companion, not textbook.
Colorful but clean.
Fast one-handed phone use.
Large native script.
Pronunciation directly beneath, visually secondary.
Strong spacing and touch targets.
Each language may have an accent color while sharing one design system.
Dark mode is welcome.

## Architecture
Keep content completely separate from components.
Do not silently rewrite translations.
If data is missing, show it as missing rather than inventing content.
Make adding a seventh language possible by adding JSON, not redesigning components.

## Future-ready
Leave clean extension points for:
- native audio
- spaced repetition
- explicit regional variants
- gender variants
- "I'm flying tomorrow" Core-only mode
- user-created phrase modules such as Barbershop Russian
- PWA/offline mode

## Acceptance criteria
- All seven languages load from JSON.
- RTL Arabic is correct.
- Search and filters work.
- Core/Travel/Explore work.
- Favorites and learned state persist locally.
- Flashcard mode works both directions.
- Responsive at common phone widths.
- No language text is hard-coded in presentation components.
