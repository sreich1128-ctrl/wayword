# Claude Code / Codex handoff: Wayword levels 1 and 2

Your task is CONTENT CURATION AND STAGING. Do not implement a database or invent a new storage schema.

Read and trust the live repository before changes:
- `docs/PRINCIPLES.md`, `docs/TOPIC_AUDIT.md`, `docs/EXPANSION_PLAN.md`
- `content/concepts.json`, `content/scenarios.json`, `content/replies.json`, `content/vocab.json`
- `content/lang/`, `content/added/`, `content/added/README.md`

Then inspect the attached English candidate files `level1_gap_candidates.json`, `level2_english_exchanges.json`, and `qa_checks.json`.

## Phase A: Level 1 repairs
1. Treat the current 123 concept IDs as immutable. Preserve all vetted translation bytes and IDs. Never rewrite or silently normalize text in `content/lang/`.
2. Review the Level 1 candidate list against all existing content, including concept paraphrases, pattern examples, and replies. Reject overlaps and marginal items.
3. Retain the most necessary missing spoken phrases: emergencies, airport, meeting people, respectful flirting/declining, sightseeing, bars, numbers and time. These are editorial proposals, not final approved additions.
4. Improve the situational display to feature situation-specific content and collapse already-known general phrases, if that is compatible with the present interface. Do not inflate situation progress through shared lines.
5. Prioritize comprehension: short likely replies for danger, social situations, airport, times and prices. Reuse existing replies where applicable.

## Phase B: Level 2 content
1. Use the role-tagged English Level 2 list as a candidate exchange syllabus in all current situations, plus Airport, Sightseeing, Bar and Numbers/times/prices.
2. Before any translation work, deliver a compact English editorial report: approved / cut / re-used, with reasons for cuts and semantically overlapping entries. Show the proposed final number of new spoken phrases and new listening replies per situation.
3. Level 2 is Communicative: a tourist can ask, understand a normal reply, follow up, and recover. Teach each exchange as chunks; do not turn every exchange role into a mandatory flashcard. Keep mobile flow simple.
4. Avoid presenting A2 as a formal proficiency certification. Level 3 is out of scope.

## Translation and review safeguards
- Do not translate until English curation is accepted. When approved, write **only new translations as Draft** following the repository's existing draft mechanism. Keep the nine languages including Romanian, unless the owner explicitly changes this.
- Never claim a draft was checked by a native speaker. Flag medical, allergy, boundary/consent and Japanese/Arabic pragmatics for priority native review.
- Preserve original transliterations; Japanese needs reading, and Hebrew/Arabic script direction must remain correct.
- `___` blanks require locally natural grammar. Reuse the existing example mechanism, not mechanical string substitution.
- No new backend, database, data model, or general UI feature initiative.
- If a code change is eventually made, follow `docs/HANDOFF.md` and bump the service-worker version per the repo instructions.

## For this handoff
First deliver the English-only editorial cut and targeted Level 1 fix list. Do not modify live content or publish translations until the owner approves the cut.
