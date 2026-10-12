# Flow research prompts

Prompts for researching why Wayword's flow feels overwhelming, run in several AI tools.
Every tool answers in the same format so the results can be merged before the flow audit.

## 1. Main prompt (Claude, ChatGPT, Gemini)

Use each tool's deep research mode if it has one.

```
I'm building Wayword, a free travel phrasebook web app used on a phone. A user picks a language (European Portuguese, Spanish, French, Italian, Russian, Levantine Arabic, Hebrew, Japanese, Romanian) and learns about 56 survival phrases.

What users love is the core loop: hear the phrase (natural recorded voice), see it written with an easy pronunciation line, record themselves saying it, and compare against the original.

What feels confusing and overwhelming is everything around that loop. Right now there are many ways in: Phrases (filterable by level and category), Places (phrases grouped by situation, like café or hotel), Patterns (sentence frames), Practice (flashcards, speaking, typing), Learn sessions, a spaced-review mode called "Lock it in", a pre-flight Crash course, and a Sound guide. People use it in short bursts: on a plane, in a queue, just before ordering.

Research the science of how people pay attention to and move through phone apps, and what makes an app feel smooth and effortless, not overwhelming. Cover:

1. Attention and cognitive load: working memory limits, choice overload, decision fatigue, and how much one phone screen can ask of someone.
2. Behavioral psychology of habits and motivation: what makes people start, keep going, and come back (for example the Fogg Behavior Model, Hook model, self-determination theory, streaks and rewards), including where these backfire.
3. Flow state: clear goals, immediate feedback, matching difficulty to skill, and how apps create or break flow.
4. Navigation and information architecture for small screens: progressive disclosure, one primary action per screen, "what do I do next?", reducing the number of entry points.
5. Learning science that shapes app flow: spaced repetition, retrieval practice, interleaving, and how short sessions should be structured for spoken-language learning.
6. Case studies: what Duolingo, Babbel, Speak, Pimsleur, Anki, Headspace, and any other famously smooth apps do in their flow, and what is known about why it works (including any published data or A/B results).

Rules:
- Cite real sources (papers, books, credible industry research such as Nielsen Norman Group, Baymard, or company engineering/design blogs). Give author, year, and a link where possible. Do not invent citations; if you're unsure a source exists, say so.
- Rate the strength of evidence for each claim: Strong (replicated research), Moderate (some studies or solid industry data), or Weak (popular belief, single study, or failed replication). Flag popular ideas that are often misused, for example "7±2 items" or ego depletion.
- Keep it practical: every principle should end in something a phone app can actually do.

Answer in this exact format:

## Principles
For each principle (aim for 10 to 20):
- **Name:** short name
- **What it says:** 1 to 2 sentences
- **Evidence:** Strong / Moderate / Weak, plus why
- **Sources:** author, year, title, link
- **For a phone app:** what to do (and what not to do)
- **For Wayword:** how it applies to the flow described above

## App examples
For each app: what its flow does well, the specific design moves, and any evidence that it works.

## Top 5 changes for Wayword
The five changes you'd make first, most impact first, each tied to principles above.

## Disagreements and open questions
Where the research conflicts, or where you're unsure.
```

## 2. NotebookLM

NotebookLM only answers from sources you add. Add the best sources first: papers, articles, and the reports from the other tools. Then paste:

```
Using only the sources in this notebook, help me improve the flow of Wayword, a travel phrasebook phone app. Users love its core loop (hear a phrase, see it with an easy pronunciation line, record themselves, compare), but the app around it feels confusing and overwhelming: there are many entry points (Phrases, Places, Patterns, Practice, Learn sessions, a spaced-review mode, a pre-flight crash course, a Sound guide), and people use it in short bursts on their phone.

1. List every principle in these sources about attention, cognitive load, habits and motivation, flow, navigation on small screens, and learning, in the format: Name / What it says / Which source (with the passage) / What a phone app should do / How it applies to Wayword.
2. Where do the sources agree, and where do they contradict each other?
3. Based only on these sources, what are the five changes Wayword should make first?
4. What important questions do these sources NOT answer?

Quote or point to the exact passage for every claim. If the sources don't cover something, say so instead of filling it in.
```

Optional extras in NotebookLM: generate an Audio Overview to listen to, and a mind map to see how the ideas connect.

## 3. Bringing it back

Save each tool's answer (copy the text, or export to a doc or PDF) and give all of them to Claude Code. The answers are merged into one principle list, sources are checked, and the principles are applied to the flow audit.
