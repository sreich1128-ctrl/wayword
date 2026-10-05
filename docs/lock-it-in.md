# Lock it in: spaced review plan

Status: **plan only, nothing built.** Written 2026-10-05.

## Goal

Phrases you pass in the crash course shouldn't fade before (or during) the trip. "Lock it in" brings each one back for a quick check on a Leitner schedule (1, 3, 7, 14 days). It shows a **Due today** card on the home screen and labels phrases **Met** (in the queue) or **Kept** (locked in). An optional **trip date** squeezes the schedule so every phrase is Kept before you fly.

## What exists today (and why this plan extends it rather than adding a second queue)

A review layer shipped on 2026-10-05:

| Piece | Where | Behaviour now |
|---|---|---|
| Schedule | `js/store.js` → `REVIEW_GAPS_DAYS = [1, 3, 7, 16, 35]`, `state.srs[key] = { box, due }` | Box 0–4. Remembered moves up a box; missed goes back to box 0 (1 day). |
| Entry | `store.setLearned(key, true)` | **Every** learned phrase enters, whatever the path: session, crash course, flashcards, or the manual Learned button. |
| Review session | `#/<lang>/session?mode=due` (`pickSession('due')`, recall-only) | Up to 10 due phrases, most overdue first. |
| Home card | `nextStepCard()` in `js/app.js` | "Review time · N phrases to review" replaces the learn card when anything is due. |
| Other surfaces | Passport stamps, flashcards | Stamps show "N to review"; a first-try flashcard "Got it" on a due phrase counts as its review, a miss resets it. |
| Migration | `read()` in `js/store.js` | Phrases learned before reviews existed are due 1 day after they were learned. |

Running "Lock it in" next to this would put the same phrase in two queues and show two competing "due" cards. **The plan is to turn the existing layer into Lock it in.** That means new intervals, Met/Kept states, trip-date compression and a Due today card, all on one queue.

## Decisions needed before building

1. **Replace the current reviews, or keep both?** Recommended: replace (one queue, explained above).
2. **What enters the queue?** The brief says *phrases passed in the crash course*. Today every learned phrase enters. Options:
   - **A. Crash course only**, as specified. Phrases learned through normal sessions or flashcards stay "Learned" but are never reviewed.
   - **B. Any first-try pass** (crash course, normal sessions, flashcards). Recommended, because a phrase learned in a normal session fades just as fast. The crash course stays the main way in, and the trip date only squeezes phrases you might need on the trip (see 5).
   - **C. Crash course, plus anything the trip date applies to.**
3. **After Kept, what then?** Recommended: Kept phrases leave the daily queue. An optional light "still kept?" check every ~30 days could follow later; it's out of scope here.
4. **Which home screen?** The language home already has the next-step card. Recommended: both. The language home gets the Due today card; the passport (visa) page gets a one-line strip ("Due today: Português 4 · עברית 2") above the stamps.
5. **Trip date: per language or one for the whole app?** Recommended: per language, set on the Flight prep page. Trips are usually to one country, and a multi-country trip can set several.
6. **Met/Kept vs. Learned.** Recommended: keep **Learned** as the progress measure (the ring and level completion) and add Met/Kept as review state on top. Learned = you've got it once. Met = it's in the queue being reinforced. Kept = it survived the full schedule.

The rest of this plan assumes the recommended options (1 replace, 2B, 3 leave the queue, 4 both, 5 per language, 6 keep Learned).

## The schedule

### Boxes and labels

| Box | Gap before the review | Label shown | How you get here |
|---|---|---|---|
| 1 | 1 day | **Met** | First-try pass in the crash course (or session/flashcards under 2B), or a missed review |
| 2 | 3 days | Met | Passed the box 1 review |
| 3 | 7 days | Met | Passed the box 2 review |
| 4 | 14 days | Met | Passed the box 3 review |
| Kept | none (leaves the queue) | **Kept** | Passed the box 4 review |

- **Pass** (first-try "Got it" in a review) moves up one box: `due = now + gap(nextBox)`.
- **Miss** goes back to box 1, due tomorrow, and the phrase is re-asked once later in the same review (as today).
- From first pass to Kept takes 1 + 3 + 7 + 14 = **25 days** at minimum on the normal schedule.
- Un-marking Learned removes the phrase from the queue (as `setLearned(false)` does today).

### "Due today", not "due now"

The card counts everything due before the **end of today, local time**, so a phrase due at 6pm shows up in the morning. `dueKeys(lang, endOfToday())` replaces `dueKeys(lang, Date.now())`. There's a daily cap of 20, oldest first; the rest roll over and the card says "+N tomorrow".

### Trip date compression

With a trip date set, the schedule shrinks so a phrase passed today reaches **Kept on or before the day before departure**. `D` = whole days from today to the trip (local dates); the last review must land by day `D − 1`.

```
standard gaps  G = [1, 3, 7, 14]   (sum 25)
available      A = D − 1           (days in which reviews can happen)

if A ≥ 25:   gaps = G                                   (no compression needed)
elif A ≥ 1:
    boxes = the last min(4, A) entries of G             (drop early boxes only if there
                                                          aren't enough days for one review each)
    s     = A / sum(boxes)
    gaps  = [max(1, round_half_up(g × s)) for g in boxes]
    while sum(gaps) > A:  subtract 1 from the largest gap
    while sum(gaps) < A:  add 1 to the largest gap
else (flying today or tomorrow):
    same-day gaps in hours: [15 min, 2 h, 6 h]          ("cram mode")
```
Worked examples (a phrase first passed today):

| Days to trip `D` | Gaps (days) | Reviews on day | Kept by |
|---|---|---|---|
| 30 | 1, 3, 7, 14 | 1, 4, 11, 25 | day 25 |
| 20 | 1, 2, 5, 11 | 1, 3, 8, 19 | day 19 |
| 14 | 1, 2, 4, 6 | 1, 3, 7, 13 | day 13 |
| 10 | 1, 1, 3, 4 | 1, 2, 5, 9 | day 9 |
| 7 | 1, 1, 2, 2 | 1, 2, 4, 6 | day 6 |
| 5 | 1, 1, 1, 1 | 1, 2, 3, 4 | day 4 |
| 4 | 1, 1, 1 (three boxes) | 1, 2, 3 | day 3 |
| 3 | 1, 1 (two boxes) | 1, 2 | day 2 |
| 2 | 1 (one box) | 1 | day 1 |
| 1 or 0 | 15 min, 2 h, 6 h | same day | tonight |

These numbers were checked against the pseudocode with a script on 2026-10-05; `tests/schedule.test.mjs` should assert exactly this table.

Rules:
- Compression applies to phrases you'd use on the trip: in Option B, **Core and anything in the current level**. Others keep the normal schedule.
- Gaps are computed from each phrase's **current box and days remaining**, not from when it entered. Setting, moving or clearing the trip date recomputes every queued phrase: `due = last + gap(box, D)`, so a `last` timestamp is needed.
- After the trip date passes, the trip is cleared automatically and phrases still in the queue continue on the normal gaps from their current box.
- If the queue can't all reach Kept in time (e.g. 23 phrases first passed 2 days before flying), the Flight prep page says so: "8 will be Kept before you fly; the rest will be Met." No false promises.

## Data model (`js/store.js`)

```js
state.srs[key] = {
  box: 1..4,          // Leitner box; replaces today's 0..4
  due: <ms>,
  last: <ms>,         // last pass or miss; needed to recompute under a new trip date
  met: <ms>,          // first time it entered the queue
  kept: <ms> | null,  // set when it passes box 4; it then leaves the queue
  via: 'crash' | 'session' | 'cards' | 'manual'
}
state.prefs.trips = { 'pt-PT': '2026-11-12' }   // ISO local date, per language
```

- **Pure scheduling in a new `js/schedule.js`:** `gapsFor(daysToTrip)`, `nextDue(box, last, trip)`, `endOfToday()`. No localStorage in it, so it can be unit-tested with Node.
- **Store API:** `review(key, passed)` keeps its signature. New: `kept(lang)`, `met(lang)`, `dueToday(lang)`, `setTrip(lang, date|null)` (recomputes `due` for that language), `labelFor(key)` returning `'met' | 'kept' | null`.
- **Migration from the current model** (runs once in `read()`):
  - Box: old 0 → 1, 1 → 2, 2 → 3, 3 and 4 → 4.
  - `last` = `due − oldGap(box)` (or the learned timestamp if that's missing).
  - `met` = the learned timestamp.
  - `kept` = null.
  - `due` = `min(existing due, last + newGap)`, so nobody waits longer than the new schedule allows.

## UI changes

| Where | Change |
|---|---|
| **Language home**, `nextStepCard()` | "Review time" becomes **"Due today · N to lock in · about M min"**, with a "+K tomorrow" overflow note and "or learn 5 new phrases" kept as the secondary link. Shown whenever `dueToday > 0`. |
| **Passport page**, `viewHome()` | A "Due today" strip above the stamps listing languages with due counts; tapping one goes to that language's review. The stamp foot changes from "N to review" to "N due · K kept". |
| **Phrase cards**, cheat sheet, session summary | A small **Met** badge (outline) or **Kept** badge (filled, accent colour) beside the priority label. The Learned button stays. |
| **Review session** (`mode=due`) | Header "Lock it in · 3 of 8". After each pass, a brief note: "Kept for good" when leaving box 4, otherwise "Next check in 7 days" (compressed gaps shown when a trip is set). |
| **Done screen** | "6 passed · 2 newly Kept · next check tomorrow"; with a trip set, "11 of 23 Core phrases Kept · 9 days to go". |
| **Flight prep** (`viewFlight()`) | New **Trip date** row (native `<input type="date">`, clearable). Crash course card shows Met/Kept counts and the honest projection ("8 will be Kept before you fly"). |
| **Crash course** (`mode=flight`) | First-try pass → `via: 'crash'`, box 1. Recall prompt copy: "Got it puts this phrase into Lock it in." |
| **Help sheet** (`helpHtml()`) | One new item explaining Met → Kept and the trip date. |

## Files touched

- `js/schedule.js` (new): pure interval and compression maths.
- `js/store.js`: model, migration, new API; `REVIEW_GAPS_DAYS` replaced by `schedule.js`.
- `js/app.js`: `nextStepCard`, `viewHome` (strip and stamps), `phraseCard` (badges), `viewCheatsheet`, `drawSession` (copy, notes, done screen), `viewFlight` (trip date), `helpHtml`, event handlers (trip date input).
- `css/style.css`: badges, due strip, trip row.
- `sw.js`: add `js/schedule.js` to the precache, bump `VERSION`.
- `README.md` (Learning flow section), `docs/lock-it-in.md` (mark as built).
- `tests/schedule.test.mjs` (new, `node --test`): the worked-examples table above, migration mapping, end-of-day boundary, trip date in the past, rounding fix-ups, cram mode.

## Edge cases

- **Clock changes and time zones:** due checks compare against local end of day; trip day counts use local calendar dates, not 24-hour blocks.
- **Trip date in the past, or today:** in the past it's ignored and cleared on load; today means cram mode.
- **A phrase removed from a future dataset:** its queue entry is skipped and not counted.
- **Several devices:** progress is per browser (unchanged); noted in the help text.
- **Very large backlog** (returning after weeks away): the daily cap of 20, oldest first, prevents a 60-card wall.
- **Pattern phrases with `___`:** reviewed the same way. The answer shows the frame; it's still a pass or a miss.

## Verification plan

1. `node --test tests/` covers the schedule maths and migration.
2. In the browser, with simulated dates (seed `localStorage` the same way the 2026-10-05 review tests did):
   - Pass a phrase in the crash course: it becomes Met, box 1, due tomorrow.
   - Shift its due date: Due today shows on both the language home and the passport page.
   - Four passes: Kept, gone from the queue, badge filled.
   - A miss: back to box 1.
   - Trip date 7 days out: gaps become 1, 1, 1, 3, and moving the date recomputes them.
   - Trip date passed: back to normal gaps.
3. Check at phone size (375px) in light and dark mode, Arabic/Hebrew right-to-left badges, and Japanese.
4. Re-run `tests/mic-stress.html` (shared session code) and `npm run validate`.

## Estimate

About half a day: roughly 2 hours of store/schedule work and tests, 2 hours of UI, 1 hour of verification.

---

# Tier toggle: make every switch visibly change something

Status: **plan only, nothing built.** Written 2026-10-05.

## How it behaves today

Tiers are **cumulative**: Core 20 = `core` (23 phrases), Travel 50 = `core + travel` (49), Explore 100 = everything (56). They're defined by `includes` in `content/tiers.json` and applied by `inTier()` in `js/app.js`. The toggle is one setting (`prefs.tier`) shared by every screen. Switching it saves the setting, resets any flashcard deck in progress, re-renders and scrolls to the top.

| Screen | Toggle shown? | What switching changes |
|---|---|---|
| **Home** (language) | Yes | The ring's denominator and learned count (x/23 → x/49 → x/56), the blurb under the toggle, the Next step card (which phrases a session pulls; "level complete"), Phrase of the moment's pool, and the counts on Power patterns and each category row. Nothing near the top re-orders. |
| **Phrases** | Yes | The list and the "N phrases" count. **Order is dataset order (grouped by category), so Travel's first 14 cards are identical to Core's.** New phrases are mixed in further down. Saved ignores the level; Not learned and the categories respect it. |
| **Places** | **No** (the setting still applies, invisibly) | Grid counts and each place's list. Each place keeps its curated order and offers "+N more at higher levels". At Core, Flirting shows **0 phrases**. |
| **Patterns** | Yes | Filters: Core 3 patterns, Travel 8, Explore 8. **Travel → Explore changes nothing**, because no pattern is Explore-level. "Built on this" examples are not filtered by level. |
| **Practice** | Yes (setup screen only) | Deck sizes ("All of Travel 50 · 49", "Not learned yet") and which cards a deck draws. Decks are shuffled. Saved ignores the level. The Flight crash course and the default cheat sheet ignore it (always Core). |

Why switching feels like nothing happened: on Phrases, Places and Patterns the top of the screen is usually identical, because earlier-level phrases come first. Some switches change nothing at all: Travel → Explore on Patterns, and any category with no new phrases at that level (e.g. Essentials is all Core).

## Goal

Every level switch produces a visible change at the top of the screen:
1. Phrases **new to the selected level** appear first.
2. A divider, **"Already in Core 20"**, separates them from phrases from earlier levels.
3. When nothing is new, an explicit note says so instead of a silently identical screen.

## Rules

- **Introduced at.** Each priority is "introduced" by the first tier whose `includes` contains it: `core` → Core 20, `travel` → Travel 50, `explore` → Explore 100. This is derived from `tiers.json`, so a future fourth tier works without code changes.
- **Grouping.** Show the selected level's own phrases first, then each earlier level, newest first:
  - Core 20: one group, no divider (nothing earlier).
  - Travel 50: *New in Travel 50 (26)* → divider **Already in Core 20 (23)**.
  - Explore 100: *New in Explore 100 (7)* → divider **Already in Travel 50 (26)** → divider **Already in Core 20 (23)**.
- **Order within a group** stays exactly as now: dataset order on Phrases, curated relevance on Places, power-patterns-first on Patterns.
- **Empty "new" group.** If nothing in the current view is new at this level, the top shows a note instead of a header. For example: *"Nothing new in Essentials at Travel 50: all 8 are Core 20 phrases."* or *"No new patterns at Explore 100. All 8 are already in Travel 50."* A switch never looks like a no-op.
- **Badges.** Cards in the new group get a small **New in Travel 50** tag in the card's meta line (where "Core / Travel" shows today), so the change is visible even after scrolling.
- **Count line.** "49 phrases · 26 new at Travel 50".

## Where it applies

| Screen | Change |
|---|---|
| **Phrases** (All, Not learned, each category, search results) | Grouping, dividers, empty-group note, count line. **Saved** stays ungrouped (it ignores the level by design). With a search, groups that end up empty after filtering show no divider. |
| **Patterns** | Same grouping. Travel → Explore shows the "no new patterns" note. "Built on this" examples stay unfiltered. |
| **Places → a place** | Same grouping, each group keeping the curated order. Replaces the bottom "+N more at higher levels" link only when a higher level is selected; at Core the link stays. |
| **Places grid** | Add the level toggle (`tierBar()`) so the setting is visible where it's applied, and show "+N new" under each place's count when N > 0. Flirting at Core shows "0 at Core 20 · 9 at Travel 50" instead of a bare 0. |
| **Home** | The blurb under the toggle gains the delta: *"What you actually use on the trip · 26 new on top of Core 20."* The rest is unchanged (the ring and Next step already change). |
| **Practice setup** | Deck rows show the delta: "All of Travel 50 · 49 (26 new)". Decks stay shuffled, since grouping doesn't apply to flashcards. Possible later: a "New at this level only" deck option. |

## Implementation sketch (`js/app.js`, `css/style.css`)

```js
// Index of the tier that introduces a priority (0 = Core 20, 1 = Travel 50, ...).
const introducedAt = (priority) => C.tiers.findIndex((t) => t.includes.includes(priority));

// Split already-filtered items into level groups, newest level first; order inside each group is kept.
function tierGroups(items) {
  const cur = C.tiers.findIndex((t) => t.id === tier());
  const groups = [];
  for (let i = cur; i >= 0; i--) {
    groups.push({ tier: C.tiers[i], isNew: i === cur, items: items.filter((p) => introducedAt(p.priority) === i) });
  }
  return groups; // render: header or empty-note for groups[0], a divider before each later non-empty group
}

function renderGrouped(items, renderItem, { emptyNewNote }) { /* header, dividers, note */ }
```

- `renderList()` (Phrases), `viewPatterns()`, `viewScenario()` call `renderGrouped(...)` instead of `items.map(...)`.
- `phraseCard(p, { isNew })` adds the "New in …" tag.
- `viewScenarios()` renders `tierBar()` and the per-place "+N new".
- `tierBar()` appends the delta to the blurb.
- CSS: `.tier-divider` (a thin rule with a small uppercase label, matching `.sect-head h2`), `.tier-new-head`, `.tier-note` (same look as `.callout`), `.new-tag` (a small tinted pill).
- No data changes: `tiers.json` already holds everything needed.

## Edge cases

- **Core 20 selected:** no dividers and no "new" header; it looks as it does today, plus the count line.
- **A view where every item is from earlier levels** (e.g. Essentials at Travel): only the empty note, then the divider and the earlier group, so the note is the visible change.
- **A view with only new items:** the header and items, no divider.
- **Right-to-left languages:** dividers are full-width, and labels follow the English UI, left-to-right.
- **Screen readers:** dividers are headings (`<h3>`) so the groups are navigable; the new tag has text, not just colour.
- **Scroll on switch:** stays as now (top of the page), which is where the change appears.

## Verification plan

In the browser at 375px, for Spanish and Arabic:
1. **Phrases → All:** Core shows 23 with no divider. Travel's first card is a Travel phrase (`what_mean`), with the "Already in Core 20" divider after 26 cards. Explore shows 7 new, then two dividers.
2. **Phrases → Essentials at Travel:** the "Nothing new…" note shows.
3. **Patterns:** Core → Travel puts 5 new patterns first. Travel → Explore shows the "no new patterns" note.
4. **Places:** the grid shows the toggle and "+N new". Café at Travel shows 3 new first, then the divider, then 13 in curated order. Flirting at Core shows the explanatory zero.
5. **Home:** the blurb shows the delta.
6. **Practice setup:** the "(26 new)" delta shows.
7. **Assert on every screen** that the first card's text differs between adjacent levels, or the note is present.

## Estimate

About 2 hours, plus 30 minutes of checking. Independent of Lock it in, so either can ship first.
