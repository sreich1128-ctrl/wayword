# Wayword content audit: are the phrases right for each situation?

2026-10-13. Based on `content/concepts.json` (56 phrases), `content/scenarios.json` (10 situations), `content/patterns.json` and all 9 language files.

## Bottom line

- **Complete across languages: yes.** All 9 languages have all 56 phrases, each with a pronunciation line. Nothing is missing anywhere.
- **Right for each situation: only partly.** The 56 phrases are mostly general-purpose. Five of the ten situations have **no phrase of their own**: Transportation, Lost / Directions, Hotel, Shopping and Barber are built entirely from generic phrases (hello, thank you, how much, can I pay by card, where is ___). You can't buy a train ticket, check into a hotel, say "left" or "right", or ask for a haircut.
- **The sentence frames have nothing to put in them.** "Where is ___?", "How do I get to ___?", "Can I have ___, please?" and "I'd like ___, please." are the most useful patterns in the set, but no language has swap-in words (station, ticket, menu, towel…). `patterns.json` has an empty `substitutions` slot for every pattern.
- **Readiness is flattered by sharing.** "Thank you" sits in 6 situations and "Hello" in 7, so learning The basics makes Hotel, Shopping and Barber look a third ready without one hotel, shop or barber phrase.
- **A few everyday basics are missing entirely:** goodbye, sorry, you're welcome, no thanks, numbers, and any emergency phrase (help!, police, doctor, pharmacy). "Problems" has one phrase ("Can you help me?").

## Situation by situation

| Situation | Phrases | Only in this situation | Verdict |
|---|---|---|---|
| The basics | 14 | Yes, No | Good core, but no goodbye / sorry / you're welcome |
| Café | 16 | A coffee, please. | OK. Needs drinks to fill "I'd like ___" |
| Restaurant | 16 | What do you recommend? · What's in this? · Do people tip here? | Decent. Missing table for ___, the menu, allergies, vegetarian |
| Transportation | 13 | none | **Gap:** no ticket, train, bus, taxi, platform, "does this go to ___" |
| Lost / Directions | 13 | none | **Gap:** no left, right, straight ahead, map, "I'm lost" |
| Hotel | 14 | none | **Gap:** no reservation, check-in/out, key, Wi-Fi, "the ___ doesn't work" |
| Shopping | 13 | none | **Gap:** no just looking, size, try it on, too expensive, I'll take it |
| Meeting People | 18 | 5 | Good: the richest situation |
| Flirting | 13 | 4 | Good |
| Barber | 15 | none | **Gap:** no haircut words at all (already noted in the situation) |

## What's strong

- **Language rescue** (I don't understand, slower please, say that again, how do you say ___): 10 phrases, excellent for a traveller.
- **Social and conversation glue** (Really? / Me too / And you? / That's interesting): what makes a real conversation possible, unusually good for a phrasebook.
- **Money** (7 phrases): card, Apple Pay, cash, tipping. Practical and current.
- **Consistency:** every language covers every phrase, with the same structure, so situations work identically everywhere.

## Proposed additions (for the dataset tool)

Translations must come from the owner's dataset tool (the dataset is the source of truth; Wayword never invents translations). This is a proposed English list to generate for all 9 languages. Roughly 55 phrases plus swap-in word lists; priority **core** = needed by almost every traveller.

### The basics (+6)
| Phrase | Priority |
|---|---|
| Goodbye. | core |
| Sorry. | core |
| You're welcome. | core |
| No, thank you. | core |
| Okay. / Alright. | travel |
| Good evening. | travel |

### Café and restaurant (+8)
| Phrase | Priority |
|---|---|
| A table for ___, please. | core |
| The menu, please. | core |
| I'm allergic to ___. | core |
| I'm vegetarian. | travel |
| Without ___, please. | travel |
| To go, please. / For here. | travel |
| It was delicious. | travel |
| Another one, please. | explore |

### Transportation (+8)
| Phrase | Priority |
|---|---|
| A ticket to ___, please. | core |
| Does this go to ___? | core |
| Take me to ___, please. (taxi) | core |
| Stop here, please. | core |
| When does the next one leave? | travel |
| Which platform? | travel |
| How long does it take? | travel |
| One way or return? | explore |

### Lost / Directions (+6)
| Phrase | Priority |
|---|---|
| Left. | core |
| Right. | core |
| Straight ahead. | core |
| I'm lost. | core |
| Can you show me on the map? | travel |
| Is it near here? | travel |

### Hotel (+7)
| Phrase | Priority |
|---|---|
| I have a reservation. | core |
| Under the name ___. | core |
| What's the Wi-Fi password? | core |
| What time is checkout? | travel |
| Can I leave my bags here? | travel |
| The ___ doesn't work. | travel |
| Can I have another towel? | explore |

### Shopping (+6)
| Phrase | Priority |
|---|---|
| I'm just looking. | core |
| I'll take it. | core |
| It's too expensive. | travel |
| Can I try it on? | travel |
| Do you have it in another size? | travel |
| A bag, please. | explore |

### Barber (+6)
| Phrase | Priority |
|---|---|
| A haircut, please. | core |
| Just a trim. | core |
| Not too short. | core |
| Shorter on the sides. | travel |
| Like this. (showing a photo) | travel |
| A beard trim, please. | explore |

### New situation: Help & emergencies (+8)
| Phrase | Priority |
|---|---|
| Help! | core |
| Call the police. | core |
| I need a doctor. | core |
| Where is the pharmacy? | core |
| It's an emergency. | core |
| I lost my ___. | travel |
| I don't feel well. | travel |
| I need to call someone. | explore |

### Swap-in words for the frames (`patterns.json` substitutions)
| Frame | Words to fill it |
|---|---|
| Where is ___? / How do I get to ___? / Where is the nearest ___? | the train station, the bus stop, the airport, the metro, the hotel, the beach, the city centre, a pharmacy, an ATM, a supermarket |
| Can I have ___? / I'd like ___ | a tea, a beer, a glass of wine, an orange juice, the menu, the bill, a bag, a receipt |
| I'm allergic to ___ / Without ___ | nuts, gluten, shellfish, milk, eggs, meat |
| I lost my ___ | passport, phone, wallet, bag, keys |
| The ___ doesn't work | the air conditioning, the shower, the Wi-Fi, the TV |
| A table for ___ / numbers | one to ten, twenty, fifty, a hundred |

### Optional: likely replies (for listening checks)
The dataset already has an optional `response` field per phrase that Wayword shows as "Likely reply". Filling it for the most common exchanges gives the "What did they say?" listening checks real things you'll hear: "For here or to go?", "Anything else?", "Here you go.", "Card or cash?", "Inside or outside?", "How many people?", "Do you have a reservation?".

## How the app would use it (no redesign needed)

- New phrases slot into situations through `scenarios.json` and get taught by Continue automatically, Core first.
- Swap-in words fill the existing `substitutions` slot. The Patterns page already shows "Fill the blank" chips when they exist, and the player could offer "Try another: a tea / a beer".
- A "Help & emergencies" situation would be the first non-Basics situation Continue suggests when a trip is close.

## Next step

Write a prompt for the owner's dataset tool, in the format of `docs/ADD_A_LANGUAGE_PROMPT.md`, that asks for these ~55 phrases and the swap-in lists in all 9 languages, with the same fields (target, pronunciation_easy, notes). Then copy the results in verbatim, as with every language so far.
