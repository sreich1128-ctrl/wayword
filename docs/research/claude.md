# Wayword: The Science of Smooth Phone App Flow

Oct 12, 2026 · @Steven Reich

Wayword should collapse its eight entry points into one adaptive session, make practice retrieval-first and guide the record-and-compare step. One flag up front: the evidence suggests the record-and-compare loop may teach less than it feels like it does, because beginners often can't hear the difference between their recording and the native one.

Evidence ratings used throughout: **Strong** (replicated research), **Moderate** (some studies or solid industry data), **Weak** (popular belief, single study or failed replication).

## Principles

### 1. Working memory holds about 4 chunks, not 7±2

- **What it says:** People can hold roughly 3 to 5 meaningful units in mind at once. Miller's "7±2" was partly rhetorical and counted rehearsed or chunked items.
- **Evidence:** Strong for a small capacity limit. Weak for "7±2" as a design rule. It is one of the most misused numbers in UX, often stretched to "menus should have 7 items." It was never about menus, since menus are visible and need no memorizing.
- **Sources:** Miller, 1956, ["The magical number seven, plus or minus two,"](https://doi.org/10.1037/h0043158) Psychological Review. Cowan, 2001, ["The magical number 4 in short-term memory,"](https://doi.org/10.1017/S0140525X01003922) Behavioral and Brain Sciences.
- **For a phone app:** Never make users remember something from a previous screen, such as a phrase they must type on the next one. Keep visible on screen whatever they need to act on. Don't use "7 items" to justify a crowded menu.
- **For Wayword:** One phrase per screen during practice. The phrase, its pronunciation line and the audio button are the whole working set. Filters, levels and categories add load while the user is trying to hold a new sound in memory.

### 2. Cognitive load: cut what doesn't serve the task

- **What it says:** Learning suffers when the format makes people do extra mental work, such as splitting attention between separated sources or reading redundant text. Load from the material itself is fine. Load from the interface is waste.
- **Evidence:** Strong in instructional research. Some measurement debates exist about how to quantify load.
- **Sources:** Sweller, 1988, ["Cognitive load during problem solving,"](https://doi.org/10.1207/s15516709cog1202_4) Cognitive Science.
- **For a phone app:** Put the label, audio and text together. Remove decorative elements from learning screens. Avoid showing the same information twice in competing forms, such as a transliteration plus IPA plus a phonetic respelling.
- **For Wayword:** Pick one pronunciation aid per phrase (the "easy pronunciation line") and keep IPA or Sound guide content behind a tap. For Hebrew, Arabic, Russian and Japanese, don't show native script, romanization and respelling all at full size. Pick one primary line.

### 3. Mobile attention comes in short bursts

- **What it says:** On the move, people look away from the screen every few seconds to check their surroundings.
- **Evidence:** Moderate. One well-known field study from 2005, consistent with later work on interruptions. In it, users' visual attention left the phone after about 4 to 8 seconds on the move, compared with more than 14 seconds in the lab. Exact numbers will differ on today's faster phones.
- **Sources:** Oulasvirta, Tamminen, Roto & Kuorelahti, 2005, ["Interaction in 4-second bursts: the fragmented nature of attentional resources in mobile HCI,"](https://doi.org/10.1145/1054972.1055101) CHI '05.
- **For a phone app:** Make every step complete in a glance. Make every state resumable: if the user looks up at the barista and comes back, they should be exactly where they left off. Audio helps because it doesn't need the eyes.
- **For Wayword:** Plane, queue and pre-order use is exactly this setting. Auto-save mid-session. Make "resume" the default on reopen, and let the audio play without the user needing to read.

### 4. Choice overload is real but conditional

- **What it says:** More options sometimes reduce action and satisfaction, but often don't. The effect is strongest when choices are complex, preferences are unclear, people are under time pressure and they want to decide quickly.
- **Evidence:** Moderate, with a flag. The famous jam study is often cited as universal. A 2010 meta-analysis found a mean effect near zero. A 2015 meta-analysis found reliable effects only under the moderators above. Hick's law is Strong for simple reaction tasks but Weak when stretched to app menus, where scanning and familiarity dominate.
- **Sources:** Iyengar & Lepper, 2000, [JPSP](https://doi.org/10.1037/0022-3514.79.6.995). Scheibehenne, Greifeneder & Todd, 2010, ["Can there ever be too many options?"](https://doi.org/10.1086/651235) Journal of Consumer Research. Chernev, Böckenholt & Goodman, 2015, ["Choice overload: a conceptual review and meta-analysis,"](https://doi.org/10.1016/j.jcps.2014.08.002) Journal of Consumer Psychology. Hick, 1952, Quarterly Journal of Experimental Psychology.
- **For a phone app:** Reduce options where users are new, rushed or unsure what they want. Keep options where users have clear goals.
- **For Wayword:** Wayword users hit every moderator. They are new to the language, rushed and unsure which mode is "right." Eight entry points at that moment is the worst case. A person who knows exactly what they want ("café phrases") can still be served by one secondary path.

### 5. Decision fatigue and ego depletion: don't lean on them

- **What it says:** The idea is that willpower is a resource that runs out with each decision.
- **Evidence:** Weak. A 23-lab preregistered replication of ego depletion found an effect near zero. The "hungry judges" parole study has been challenged on case-ordering grounds. A commonly misused idea.
- **Sources:** Hagger et al., 2016, ["A multilab preregistered replication of the ego-depletion effect,"](https://doi.org/10.1177/1745691616652873) Perspectives on Psychological Science. Danziger, Levav & Avnaim-Pesso, 2011, [PNAS](https://doi.org/10.1073/pnas.1018033108). Weinshall-Margel & Shapard, 2011, PNAS letter (critique).
- **For a phone app:** Cut decisions because they cost time and attention (principles 3 and 4), not because of a depletion battery.
- **For Wayword:** The case for fewer choices stands without this theory, so drop it from internal rationale.

### 6. Defaults: one obvious next action

- **What it says:** People heavily favor the preselected or most prominent option.
- **Evidence:** Moderate to Strong. Strong field effects exist, such as organ donation. A 2019 meta-analysis found a medium average effect with wide variation (exact numbers not re-checked).
- **Sources:** Johnson & Goldstein, 2003, ["Do defaults save lives?"](https://doi.org/10.1126/science.1091721) Science. Jachimowicz, Duncan, Weber & Johnson, 2019, "When and why defaults influence decisions: a meta-analysis of default effects," Behavioural Public Policy.
- **For a phone app:** Each screen gets one visually dominant button in the lower third, where thumbs reach on large phones. Secondary actions are smaller or text links. Don't make two equal buttons that ask the user to deliberate.
- **For Wayword:** Home should be one large "Continue" button that starts the right session for this user right now. Everything else is secondary.

### 7. Progressive disclosure, and visible beats hidden

- **What it says:** Show the few things most people need first and reveal advanced options on request. Navigation hidden behind menus gets used less than visible navigation.
- **Evidence:** Moderate. Solid industry usability research, including quantitative studies on hidden navigation. Not academic replication.
- **Sources:** Nielsen, 2006, ["Progressive Disclosure,"](https://www.nngroup.com/articles/progressive-disclosure/) NN/g. Pernice & Budiu, 2016, ["Hamburger Menus and Hidden Navigation Hurt UX Metrics,"](https://www.nngroup.com/articles/hamburger-menus/) NN/g. Hoober, 2013, ["How Do Users Really Hold Mobile Devices?"](https://www.uxmatters.com/mt/archives/2013/02/how-do-users-really-hold-mobile-devices.php) UXmatters.
- **For a phone app:** Use a bottom tab bar of at most 3 to 4 visible destinations. Push advanced features into context, where they appear when relevant. Don't hide main modes behind a hamburger, and don't expose 8 modes as equals either.
- **For Wayword:** The Sound guide should appear when the user taps a hard sound inside a phrase. Patterns should appear after a user has learned 2 or 3 phrases sharing a frame ("I'd like a \_\_\_"). Level and category filters belong in a "Browse all" view, not on the front.

### 8. Instant feedback

- **What it says:** About 0.1 seconds feels instant, about 1 second keeps flow of thought, and about 10 seconds loses attention.
- **Evidence:** Moderate. Long-standing, widely used limits. The popular "Doherty threshold of 400ms" comes from 1980s IBM productivity work and is Weak as a universal rule.
- **Sources:** Nielsen, 1993, ["Response Times: The 3 Important Limits,"](https://www.nngroup.com/articles/response-times-3-important-limits/) NN/g.
- **For a phone app:** Audio must start on tap with no perceptible lag, so preload it. Recording should start and stop instantly with clear visual state. Show a loading state for anything over 1 second.
- **For Wayword:** Preload audio for the whole session when it starts. That also makes it work on a plane: cache the session for offline use.

### 9. Fogg Behavior Model and implementation intentions

- **What it says:** Behavior happens when motivation, ability and a prompt line up at the same moment. Make the action tiny and attach it to an existing cue. The "if X, then I'll do Y" plan is the evidence-backed version of the same idea.
- **Evidence:** Fogg's model is Weak to Moderate: a useful framework, published as a conference paper and not tested as a predictive model. Implementation intentions are Strong, with a meta-analysis of about 94 studies showing medium-to-large effects on goal attainment.
- **Sources:** Fogg, 2009, ["A behavior model for persuasive design,"](https://doi.org/10.1145/1541948.1541999) Persuasive '09. Gollwitzer & Sheeran, 2006, ["Implementation intentions and goal achievement: a meta-analysis,"](<https://doi.org/10.1016/S0065-2601(06)38002-1>) Advances in Experimental Social Psychology.
- **For a phone app:** Lower the cost of starting to one tap. Ask users to pick a cue ("When I sit down on the plane"). Don't rely on raw motivation.
- **For Wayword:** Users have built-in cues: boarding, queueing, sitting at a café. At setup ask "When will you practice?" with 3 tappable cues. Use them in reminders if push or email exists.

### 10. Self-determination theory: competence, autonomy, relatedness

- **What it says:** Lasting motivation comes from feeling capable, feeling in control and feeling connected. Controlling rewards can undermine interest in tasks people already find interesting.
- **Evidence:** Strong for SDT as a framework and for its links to persistence. The undermining effect of rewards is Strong in a large meta-analysis, but its practical size is contested (Cameron and Pierce). It applies mainly to expected, tangible, task-contingent rewards.
- **Sources:** Ryan & Deci, 2000, ["Self-determination theory and the facilitation of intrinsic motivation,"](https://doi.org/10.1037/0003-066X.55.1.68) American Psychologist. Ryan, Rigby & Przybylski, 2006, ["The motivational pull of video games,"](https://doi.org/10.1007/s11031-006-9051-8) Motivation and Emotion. Deci, Koestner & Ryan, 1999, [Psychological Bulletin](https://doi.org/10.1037/0033-2909.125.6.627).
- **For a phone app:** Competence means visible progress and early success. Autonomy means a default path plus one escape hatch, not a forced march and not a maze. Rewards should report progress ("you can now order coffee") rather than serve as bribes.
- **For Wayword:** The strongest motivator is real-world competence: the trip. Frame progress as situations unlocked ("Café: ready"), not points. Serve autonomy by letting users jump to a situation when they need it.

### 11. Streaks motivate, and broken streaks cause dropout

- **What it says:** Seeing an intact streak increases continued engagement. Seeing a broken one reduces it, unless people can repair it.
- **Evidence:** Moderate. A strong 7-study academic paper, consistent with Duolingo's published A/B data. Showing an intact streak raised later engagement compared with a broken one, regardless of actual past behavior. The drop was larger when people blamed themselves for the break and smaller when they could repair the streak.
- **Sources:** Silverman & Barasch, 2023, ["On or Off Track: How (Broken) Streaks Affect Consumer Decisions,"](https://doi.org/10.1093/jcr/ucac029) Journal of Consumer Research. Duolingo, ["Improving the streak"](https://blog.duolingo.com/improving-the-streak).
- **For a phone app:** If you use streaks, make them cheap to keep (one small action). Offer repair or freezes. Frame breaks as external ("You were traveling"). Don't make the daily goal the streak condition.
- **For Wayword:** Argue against a daily streak as the main mechanic. Users have a finite goal (a trip in 3 weeks), not an endless habit. A broken streak right before departure is the worst moment to demotivate someone. A countdown-based plan fits better (principle 12).

### 12. Goal gradient and endowed progress

- **What it says:** People speed up as they near a goal. A goal that already shows some progress gets completed more often than an equivalent one starting at zero.
- **Evidence:** Moderate. Field studies with real customers (coffee cards, car washes), replicated in several contexts.
- **Sources:** Kivetz, Urminsky & Zheng, 2006, ["The goal-gradient hypothesis resurrected,"](https://doi.org/10.1509/jmkr.43.1.39) Journal of Marketing Research. Nunes & Drèze, 2006, ["The endowed progress effect,"](https://doi.org/10.1086/500480) Journal of Consumer Research.
- **For a phone app:** Show a finite, near goal ("12 phrases to café-ready"). Give credit for things already done. Avoid infinite progress bars.
- **For Wayword:** 56 phrases is a finishable goal. Show "You're 18/56 ready for Lisbon." Group the 56 into about 8 situations so the nearest goal is always close. Count phrases many travelers already know ("hello," "thank you") as instant progress.

### 13. Hook model and variable rewards: use with care

- **What it says:** Habits form through trigger, action, variable reward and investment loops.
- **Evidence:** Weak. A popular business book, not peer-reviewed. Variable reward schedules do sustain behavior in classic conditioning research. Applying them to learning raises ethical and attention concerns and is associated with compulsive use patterns.
- **Sources:** Eyal, 2014, Hooked: How to Build Habit-Forming Products (book, Portfolio).
- **For a phone app:** Take the "investment" idea (users saving their own favorites or recordings makes return more likely). Skip slot-machine rewards in a learning tool.
- **For Wayword:** User recordings are a natural investment. "Hear how you sounded on Day 1 vs today" is a reward tied to real competence, not randomness.

### 14. Flow: clear goal, instant feedback, matched challenge

- **What it says:** People get absorbed when they know what to do next, see results right away and face a challenge near their skill.
- **Evidence:** Moderate. Widely supported descriptively but hard to measure. The "85% rule" comes from a mathematical model and simulations and is Weak as a human design target.
- **Sources:** Csikszentmihalyi, 1990, Flow: The Psychology of Optimal Experience (book, Harper & Row). Wilson, Shenhav, Straccia & Cohen, 2019, ["The Eighty Five Percent Rule for optimal learning,"](https://doi.org/10.1038/s41467-019-12552-4) Nature Communications.
- **For a phone app:** Never end a step on "now what?" Each screen flows into the next automatically. Adjust difficulty from performance: more review when users struggle, new items when they cruise. Mode switches and menus between items break flow.
- **For Wayword:** Jumping from Phrases to Practice to "Lock it in" are flow breaks. One continuous session mixing new phrases and reviews removes them.

### 15. Feedback about the task, not the person

- **What it says:** Feedback improves performance on average but makes it worse in about a third of cases. It works when it points to the task and the next step, and fails when it focuses on the self ("Great job!") or overloads.
- **Evidence:** Strong. Large meta-analyses.
- **Sources:** Kluger & DeNisi, 1996, ["The effects of feedback interventions on performance,"](https://doi.org/10.1037/0033-2909.119.2.254) Psychological Bulletin. Hattie & Timperley, 2007, ["The power of feedback,"](https://doi.org/10.3102/003465430298487) Review of Educational Research.
- **For a phone app:** Feedback should say what was off and what to try. Keep generic praise short.
- **For Wayword:** After comparison, point to one thing: "Listen to the 'r' in 'obrigado'." Don't show a vague score.

### 16. Retrieval practice beats rereading and relistening

- **What it says:** Trying to recall something, even with errors, produces much better long-term memory than reviewing it again.
- **Evidence:** Strong. Among the best-replicated findings in learning science, rated "high utility" in a major review.
- **Sources:** Roediger & Karpicke, 2006, ["Test-enhanced learning,"](https://doi.org/10.1111/j.1467-9280.2006.01693.x) Psychological Science. Karpicke & Roediger, 2008, ["The critical importance of retrieval for learning,"](https://doi.org/10.1126/science.1152408) Science. Dunlosky et al., 2013, ["Improving students' learning with effective learning techniques,"](https://doi.org/10.1177/1529100612453266) Psychological Science in the Public Interest.
- **For a phone app:** Prompt first, answer second. Show the meaning or situation, have the user try, then reveal.
- **For Wayword:** The biggest learning upgrade available. The loop currently starts with hearing the answer, which is fine the first time. From the second exposure on, flip it: show "You want the bill," let the user say it, then play the native audio. This is also Pimsleur's core move.

### 17. Spacing, timed to the trip

- **What it says:** Spreading practice over time beats cramming. The best gap depends on how long you need to remember: roughly 10 to 20% of the retention interval for short horizons, and a smaller fraction for longer ones.
- **Evidence:** Strong for spacing. Moderate and contested for expanding gaps (1, 3, 7 days) over equal gaps, since some studies find equal gaps as good or better for long-term retention.
- **Sources:** Cepeda et al., 2006, ["Distributed practice in verbal recall tasks,"](https://doi.org/10.1037/0033-2909.132.3.354) Psychological Bulletin. Cepeda et al., 2008, ["Spacing effects in learning: a temporal ridgeline of optimal retention,"](https://doi.org/10.1111/j.1467-9280.2008.02209.x) Psychological Science. Karpicke & Roediger, 2007, ["Expanding retrieval practice promotes short-term retention, but equally spaced retrieval enhances long-term retention,"](https://doi.org/10.1037/0278-7393.33.4.704) JEP: Learning, Memory, and Cognition.
- **For a phone app:** Schedule reviews automatically. Hide the algorithm. Cap reviews so they never pile up into a guilt backlog.
- **For Wayword:** Wayword knows the departure date. A user leaving in 14 days wants reviews about 1 to 3 days apart, with a final review in the last 24 hours. "Lock it in" should be the engine inside every session, not a separate destination.

### 18. Interleaving: not for new words

- **What it says:** Mixing categories helps people learn to tell similar things apart, but it can hurt word and vocabulary learning.
- **Evidence:** Moderate. A meta-analysis of 59 studies found a moderate overall benefit (g = 0.42), but blocked study came out ahead for word materials (g = −0.39), and the authors advise caution with words and expository texts. Commonly misapplied as "always shuffle."
- **Sources:** Brunmair & Richter, 2019, ["Similarity matters: a meta-analysis of interleaved learning and its moderators,"](https://doi.org/10.1037/bul0000209) Psychological Bulletin. Kornell & Bjork, 2008, Psychological Science.
- **For a phone app:** Introduce new items in coherent blocks. Mix during review.
- **For Wayword:** Teach new phrases within one situation (the Places grouping already does this). Mix situations in review sessions. Exception: interleave easily confused pairs, such as similar-sounding Hebrew words, on purpose.

### 19. Say it out loud, and train the ear too

- **What it says:** Producing items aloud improves memory over silent study (the production effect). Pronunciation instruction works. Perception training improves production somewhat, but learners' ability to judge their own speech is limited.
- **Evidence:** Strong for the production effect and for pronunciation instruction generally. Moderate for the perception-to-production link. A meta-analysis of 25 years of studies found controlled perception training produced medium perception gains (d = 0.92) and smaller production gains (d = 0.54). A later HVPT meta-analysis found small-to-medium production gains for trained items, with little evidence of long-term retention or transfer to untrained items.
- **Sources:** MacLeod et al., 2010, ["The production effect,"](https://doi.org/10.1037/a0018785) JEP: Learning, Memory, and Cognition. Lee, Jang & Plonsky, 2015, ["The effectiveness of second language pronunciation instruction: a meta-analysis,"](https://doi.org/10.1093/applin/amu040) Applied Linguistics. Sakai & Moorman, 2018, [Applied Psycholinguistics](https://doi.org/10.1017/S0142716417000418). Uchihara et al., 2024, ["Does perceptual high variability phonetic training improve L2 speech production?"](https://www.cambridge.org/core/product/1F82CDEAD0AC9998F120EFFDC01027B4) Applied Psycholinguistics. Thomson, 2018, "High Variability \[Pronunciation\] Training (HVPT)," Journal of Second Language Pronunciation (link not re-verified).
- **For a phone app:** Require speaking, not just listening. Make comparison easy: back-to-back playback, a slowed version and one focused sound to listen for. Add quick listening checks ("Which one is the native 'ח'?").
- **For Wayword:** Pushback on what users love. "Record and compare" feels great, but a beginner who can't perceive the Hebrew "ח" or a French nasal vowel will hear no difference and conclude they nailed it. Keep the loop and make the comparison guided: auto-play native, then theirs, then native again, with one "listen for" cue per phrase.

### 20. End on a win (peak-end)

- **What it says:** People judge an experience heavily by its most intense moment and its ending.
- **Evidence:** Weak to Moderate. The original lab studies hold up reasonably, but evidence for it driving app retention specifically is thin.
- **Sources:** Kahneman, Fredrickson, Schreiber & Redelmeier, 1993, ["When more pain is preferred to less,"](https://doi.org/10.1111/j.1467-9280.1993.tb00589.x) Psychological Science.
- **For a phone app:** End sessions on an item the user gets right, plus a one-line summary of what they can now do. Don't end on a failure or an upsell.
- **For Wayword:** Close each session with "You can now: order a coffee, ask for the bill," and replay their best recording of the session.

## App examples

The smoothest apps share one move: a single default action on the home screen, with choices pushed to the edges. Published A/B data exists mainly for Duolingo, and it measures engagement, not learning.

### Duolingo

- **Flow:** One home path, one big button, short lessons with very little choosing. Signup is delayed until after the first lesson.
- **Design moves:** The 2022 path redesign replaced a branching skill tree with a single linear path, a direct cut in entry points, though some longtime users complained about lost control (no published A/B numbers found for it). A former growth VP said letting people try a lesson before signing up raised DAUs by about 20% ([First Round Review](https://review.firstround.com/the-tenets-of-a-b-testing-from-duolingos-master-growth-hacker)). Duolingo split the streak from the daily goal so that one lesson extends the streak, after finding ambitious daily goals were a barrier to habit forming.
- **Evidence:** That streak change raised Day 14 retention by 3.3%, daily active learners by 1% and the share of daily learners on a streak by 10.5% within 20 days ([Duolingo blog](https://blog.duolingo.com/improving-the-streak)). Their trainable spacing model (half-life regression) improved daily student engagement by 12% in an operational study ([Settles & Meeder, 2016, ACL](https://aclanthology.org/P16-1174/)). They also published a bandit algorithm for choosing notification copy (Yancey & Settles, 2020, KDD).
- **Caveat:** These are engagement metrics. Engagement isn't learning, and Duolingo's own efficacy studies are company-run.

### Babbel

- **Flow:** Fixed 10 to 15 minute lessons built around realistic dialogues, plus a separate Review section using spaced repetition.
- **Design moves:** Situation-based content, similar to Wayword's Places. Review is a separate destination, which is the pattern Wayword should merge rather than copy.
- **Evidence:** Babbel commissioned an efficacy study (Vesselinov & Grego, 2016). It isn't independent, so treat it as Weak. Link not re-verified.

### Speak

- **Flow:** Speaking from the first lesson, AI pronunciation and conversation feedback, inside a path layout similar to Duolingo's.
- **Design moves:** Reviewers note users can compare their attempt against the model pronunciation after speaking exercises ([ScreensDesign](https://screensdesign.com/showcase/speak-learn-spanish-french)). This is Wayword's loop with automated feedback added.
- **Evidence:** Weak. No independent efficacy data found. A recent job posting says the company has a Proficiency team building ways to measure learning gains ([listing](https://seedtable.com/jobs/46323)), so published evidence may come later.

### Pimsleur

- **Flow:** Audio-only 30 minute lessons with zero navigation choices. A prompt in English, a pause for the learner to answer aloud, then the native answer.
- **Design moves:** Every item is retrieval plus speaking (principles 16 and 19). Reviews are built into the audio on a "graduated interval recall" schedule.
- **Evidence:** The underlying principles are Strong. The specific expanding schedule from Pimsleur's 1967 paper ("A memory schedule," Modern Language Journal) is Moderate or contested (principle 17). No independent controlled trial of the course is known. The prompt-pause-answer format is the most transferable move for Wayword.

### Anki

- **Flow:** Minimal flow by design: due cards, show answer, rate. Very effective for motivated users and famously punishing for casual ones.
- **Design moves:** In 2023 Anki added FSRS, a modern scheduler (Ye, Su & Cao, 2022, KDD). Community benchmarks report better recall prediction than the old SM-2 algorithm. Moderate evidence: community-run, though on large data.
- **Lesson for Wayword:** The anti-pattern is review backlogs ("327 due") and settings overload, which is exactly the overwhelm Wayword is trying to remove.

### Headspace

- **Flow:** Opens to a "Today" screen with one recommended session. Short sessions (3 to 10 minutes), onboarding that asks your goal and simple animations explaining concepts.
- **Design moves:** One default action, length chosen once, calm low-stimulation visuals.
- **Evidence:** RCTs exist on Headspace's mental health outcomes. No published A/B data on its navigation or flow could be verified, so treat the design rationale as Weak.

## Top 5 changes for Wayword

Ordered by expected impact, highest first.

1. **Replace 8 entry points with one "Continue" button.** Home becomes a single large button that runs a short mixed session (about 2 to 3 minutes, 5 phrases): due reviews plus 1 or 2 new phrases from the current situation. Below it, one secondary row: "I need a phrase now" (change 4). Phrases, Patterns, the Sound guide and filters move to "Browse" or into context. *Principles: 4, 6, 7, 14.*
2. **Flip the loop to retrieval-first after the first exposure.** First time: hear, see, say, compare (the current loop). From then on: situation prompt, say it, hear the native, compare, then self-rate "Got it / Close / Again." The rating drives scheduling. This keeps what users love and adds the strongest learning effect available. *Principles: 16, 17, 19.*
3. **Merge Practice, Learn, Lock it in and Crash course into one session engine set by the trip date.** Ask "When do you leave?" once. The engine paces the 56 phrases across the days left and spaces reviews to fit, with a final review in the last 24 hours. Crash course becomes "leaving in under 3 days" mode in the same engine. Cap daily reviews so there's never a backlog. *Principles: 9, 12, 17, 18.*
4. **Add a just-in-time "Now" mode for the queue and café moment.** Two taps: pick a situation, get big phrase cards with one-tap audio and a "show this screen" option. No learning flow and no scoring. It serves the "just before ordering" use without forcing users through a lesson, and gives autonomy without adding a maze. *Principles: 3, 8, 10.*
5. **Make the comparison guided, and frame progress as trip-readiness.** Auto-play native, theirs, native. Add one "listen for" cue per phrase, a slow-playback toggle and occasional 2-option listening checks on hard sounds. Replace any streak or points framing with "18/56 ready, Café ready," and end sessions on a success with a "You can now..." line. *Principles: 11, 12, 15, 19, 20.*

## Disagreements and open questions

The biggest gap: almost no research covers engagement design for a learning goal with a fixed end date, which is Wayword's whole situation.

- **Habit vs. trip deadline.** Nearly all habit research (streaks, Hook, Duolingo data) assumes an open-ended daily habit. Wayword users have a deadline and a finish line. No research was found on engagement design for time-boxed, goal-ending learning. Dropping streaks is reasoned from principles, not tested. Worth an A/B test.
- **Expanding vs. equal spacing.** Studies conflict. For a 1 to 3 week horizon the difference is probably small, so pick the simpler implementation.
- **Can self-comparison teach pronunciation?** Perception training helps production only modestly, and the link is weak at the individual level. Automated pronunciation scoring (Speak's route) might help more, but scoring accuracy for Levantine Arabic and Hebrew learners is uncertain, and a wrong score is worse than none (principle 15).
- **How short is too short?** Microlearning claims ("5 minutes is optimal") have Weak evidence. Spacing research supports several short sessions over one long one, but no solid data on minimum useful session length for phrase learning is known. Log session length vs. later recall to find out.
- **Choice reduction vs. power users.** Cutting entry points could annoy users who liked browsing. Overload depends on context, so instrumentation should show whether "Browse" gets used before removing it entirely.
- **Engagement isn't learning.** Every published A/B number above measures retention or DAU, not whether people could order a coffee in Lisbon. Measure the outcome that matters, for example a short "say it from the prompt" check on departure day.
