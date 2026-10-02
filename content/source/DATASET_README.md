# Steven's Travel Language Dataset v1.0

A mobile-first content package for a personal travel-language website.

## What is included
- 56 canonical travel/social concepts shared across all languages
- European Portuguese (Portugal-first)
- Spanish
- French
- Italian
- Russian
- Levantine Arabic (Palestinian/Jordanian-leaning)
- Hebrew (modern conversational Israeli Hebrew)
- Easy learner pronunciation for every entry
- Core / Travel / Explore priority tiers
- Category and pattern metadata

## Design principle
This is not a dictionary and not a raw frequency list. It is optimized for communicative usefulness:
survive, navigate, order, pay, solve problems, meet people, and connect.

## Source relationship
The user's existing `Essential Language Learning Vocabulary` list is broader Stage 1 material. It includes
pronouns, numbers, time, people, body parts, foods, clothing, animals, and high-frequency verbs.
This v1 travel dataset deliberately selects a smaller functional layer rather than duplicating that entire list.

## Important language notes
- Portuguese is European Portuguese first. Add Brazilian alternatives only where they materially help.
- Spanish is intentionally neutral.
- French and Italian mix polite service language with informal social language.
- Russian requires gender-aware expansion in a later version.
- Hebrew uses modern conversational Israeli Hebrew; v1 primarily uses masculine singular forms appropriate for Steven.
- Arabic is spoken Levantine, not MSA. v1 is Palestinian/Jordanian-leaning and should later gain explicit
  masculine/feminine addressee variants.

## Recommended app behavior
Treat `concepts.json` as the canonical cross-language concept map.
Never hard-code language content into UI components.
Join language entries by `id`.

Suggested filters:
- Core
- Travel
- Explore
- Category
- Scenario

Suggested scenarios:
Cafe, Restaurant, Transportation, Lost/Directions, Hotel, Shopping, Meeting People, Flirting, Barber.

## Quality note
The pronunciation field is an easy learner cue, not IPA. The app should label it "Easy pronunciation".
For production audio, use native-language audio/TTS rather than synthesizing the English respelling.
