# English editorial cut: Level 1 repairs and Level 2 (2026-11-14)

Input: ChatGPT's `level1_gap_candidates.json` (61 lines) and `level2_english_exchanges.json` (244 lines = 61 exchanges × say / hear / follow-up / recovery), following `CLAUDE_CODE_HANDOFF.md`. Checked against the live content: 123 phrases, 14 replies, 73 vocab words, pattern variants.

**Status: proposal. No content file has been changed and nothing is translated. Waiting for the owner's approval of this English list.**

Rules applied: the 123 existing phrases and their translations are untouched; a candidate that an existing phrase, variant or reply already covers is **reused**, not rewritten; a "Where is ___?"-type candidate becomes a new **word** for the existing frame rather than a new phrase; anything marginal for a tourist is **cut**.

ChatGPT's own QA reported zero overlaps with existing content. That check was exact-match only; real overlaps are listed below.

---

## Part A: Level 1 repairs

### Result

| Situation | New to say | New to understand | New words for existing frames | Reused from what exists |
|---|---|---|---|---|
| Flirting | 10 | 4 | – | You're funny · I like talking to you · Can I get your Instagram? |
| Meeting People | 4 | 3 | 5 countries | What do you recommend? · I'm learning by trying to speak (moved from Flirting) |
| Help & emergencies | 5 | 3 | hospital + 4 (pain, a fever, a cough, allergies) | Where is ___? · Please leave me alone (shared with Flirting) |
| Airport (new) | 3 | 3 | check-in, baggage claim, gate | Where is ___? · passport, ticket |
| Sightseeing (new) | 4 | 2 | – | Can I take photos here? · Where is ___? + entrance · It's closed. |
| Bar (new) | 2 | 2 | red wine, white wine | beer / glass of wine via I'd like ___ · Another one, please · Cheers! |
| Numbers, times, prices (new) | 1 | 2 | – | the 13 number words already in vocab |
| **Total** | **29** | **19** | **15** | |

48 new lines and 15 words, × 9 languages as drafts.

### The lists

**Flirting** — say: I like your style. · Would you like to get a coffee? · Can I buy you a drink? *(added: missing from ChatGPT's list)* · I'd like to see you again. · Are you free tomorrow? · Can I have your number? · Are you here with friends? · I had a great time. *(added)* · Thanks, but I'm not interested. ⚑ · Please leave me alone. ⚑
Understand: I'd love to. · Maybe another time. · Sorry, I can't. · I'm seeing someone.
Flirting stops counting the 9 Meeting People phrases as its own.

**Meeting People** — say: My name is ___. · I'm from ___. (the United States, Canada, the UK, Israel, Australia) · How long are you here for? · Cheers!
Understand: I'm here for a week. · How long are you staying? · Do you like it here?

**Help & emergencies** — say: I need an ambulance. ⚑ · It hurts here. ⚑ · I've been robbed. · I need medicine for ___. ⚑ · I'm having trouble breathing. ⚑
Understand: What happened? · Where does it hurt? · Wait here.

**Airport** — say: My luggage didn't arrive. · Is my flight delayed? · I have a connecting flight.
Understand: Passport, please. · Boarding has started. · Your gate has changed.

**Sightseeing** — say: ___ tickets, please. (one–four) · What time does it open? · What time does it close? · Is there a guided tour in English?
Understand: It's sold out. · Follow me.

**Bar** — say: What do you have on tap? · Something non-alcoholic, please.
Understand: What can I get you? · Last call.

**Numbers, times, prices** — say: What time is it?
Understand: That's ___ altogether. · It starts at ___. (number words, as listening practice)

⚑ = priority for native review (medical, or a boundary that must stay firm in every language).

### Cut or moved (13 of 61)

| Candidate | Decision | Why |
|---|---|---|
| Can I take photos here? | Reuse | Exists word for word as a variation of "Can I ___ here?" |
| Where is the hospital? / check-in? / baggage claim? / the entrance? / gate ___? | Reuse | "Where is ___?" exists; these become words for it (entrance already is one) |
| It's closed today. | Reuse | Reply "It's closed." exists |
| A beer, please. / A glass of ___ wine, please. | Reuse | "I'd like ___" + beer / glass of wine exist; add red and white wine as words |
| What should I see while I am here? | Reuse | "What do you recommend?" exists; list it under Meeting People |
| Would you like to open a tab? | Cut | A US custom; rare elsewhere |
| Do you have insurance? | Move to Level 2 | Belongs in the longer hospital/pharmacy exchange |
| Is that the total? / Is that in the morning or evening? / That's per person. | Move to Level 2 | Level 2 has the full versions of all three |

### Display fix (code, not content)

Each situation shows its own phrases first; shared general ones collapse under "You already know these (n)". Readiness counts own phrases only (`counts` already does this for most situations; extend to all).

---

## Part B: Level 2 (Communicative)

### How I'd teach an exchange

ChatGPT gave every exchange four lines. Making all four a flashcard would quadruple the work and bury the useful part. Proposed:

- **Say** and **follow-up**: learned to speak (the existing lesson).
- **Hear**: learned to understand (the existing listening step, then you answer it).
- **Recovery**: most of the 61 are the same handful of moves ("Could you check it again?", "Could you show me?", "I'll come back later"). Teach a **recovery kit of 8** once, in The basics at Level 2, and keep a situation's own recovery only where it is specific (15 of them, e.g. "I need urgent medical attention", "Who can help me rebook?", "Please give me some space").

Recovery kit: Could you type it on my phone? · Could you explain it another way? · Could you show me? · Could you check it again? · Could you write it down? · Could we use a translation app? · I'll come back later. · Never mind, thank you.

### Result: 52 of 61 exchanges kept

| Situation | Exchanges kept | To say (say + follow-up + own recovery) | To understand |
|---|---|---|---|
| The basics | 3 of 4 | 6 + recovery kit 8 | 3 |
| Help & emergencies | 4 of 4 | 8 + 3 | 5 (incl. Do you have insurance?) |
| Café | 2 of 4 | 4 + 1 | 2 |
| Restaurant | 4 of 4 | 8 + 1 | 4 |
| Transportation | 4 of 4 | 8 + 1 | 4 |
| Lost / Directions | 3 of 4 | 6 | 3 |
| Hotel | 4 of 4 | 8 + 1 | 4 |
| Shopping | 3 of 4 | 6 + 1 | 3 |
| Meeting People | 4 of 4 | 8 + 1 | 4 |
| Flirting | 3 of 4 | 6 + 2 | 3 |
| Barber | 4 of 4 | 8 + 1 | 4 |
| Airport | 4 of 5 | 8 + 2 | 4 |
| Sightseeing | 3 of 4 | 6 | 3 |
| Bar | 3 of 4 | 6 + 1 | 3 |
| Numbers, times, prices | 4 of 4 | 8 | 5 (incl. That's per person.) |
| **Total** | **52** | **104 + 15 + kit 8 = 127** | **54** |

About 181 lines × 9 languages ≈ 1,630 draft translations. That is more than everything written so far, so it goes situation by situation, each batch through the Tatoeba check and a ChatGPT review sheet before it ships.

### Cut exchanges (9), with reasons

| Situation | Exchange | Why |
|---|---|---|
| The basics | End a confusing exchange politely ("I think I understand now." / "Are you sure?") | Not a real need; nobody rehearses this |
| Café | Adjust sweetness | Marginal, and a specific café culture |
| Café | Check a missing order ("What's your order number?") | App/kiosk ordering; rare for a tourist |
| Lost / Directions | Mark it on my phone | "Can you show me on the map?" exists at Level 1 |
| Shopping | Contactless payment | "Can I pay by card?" and "…with Apple Pay?" exist |
| Flirting | "Would you like to go on a date?" | Too direct and unnatural in most of the nine languages; "Would you like to do something this weekend?" does the job and is kept |
| Airport | Handle a gate change | Level 1 already teaches hearing "Your gate has changed." |
| Sightseeing | How long is the guided tour? | Folded into the Level 1 tour question |
| Bar | Mocktails | Level 1's "Something non-alcoholic, please." covers it |

### Wording changes inside kept exchanges

- **One-off answers become typical ones.** "The grilled fish." / "My colleague does." / "This one is more durable." are a single arbitrary answer. Replace with what you'd really hear, built from number and vocab words where possible ("About ___ minutes.", "Let me ask.", "This one is better.").
- **"Is that ___ AM or PM?"** → "In the morning or in the evening?" Most of these countries use the 24-hour clock.
- **"Do you have change for ___?"** uses local notes per language, not "a twenty".
- **"My ___ is getting worse."** and **"Does this contain ___?"** are written as whole sentences per word (the existing variations mechanism), never by pasting a word into a frame.
- **"About ___ centimeters."** (barber) → "A little shorter." / "That's enough." Nobody quotes centimetres in a chair.
- **Border questions** stay, taught mainly as listening ("When are you flying home?"), with truthful answers only.

### Priority for native review before publication

Everything medical and allergy-related (emergency, pharmacy, "Does this contain ___?"), every boundary line in Flirting, and all Japanese and Levantine Arabic social lines (register and directness differ most there).

---

## What I need from the owner

1. Approve, cut or add to the Level 1 list (48 lines + 15 words).
2. Approve the Level 2 shape: 52 exchanges, a shared recovery kit, about 181 lines.
3. Order of work: Level 1 repairs (content + display fix) first, shipped; then Level 2 situation by situation.
