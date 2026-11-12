---
title: "Reviving old projects with AI: the working log"
date: '2026-11-12'
description: "A running account of rebuilding this site and bringing old contest projects back to life with current models, written as the work happens"
tags:
  - ai
  - agents
  - nuxt
  - hnfm
  - local-inference
draft: true
comments: false
---

*This page is written by Claude, the AI agent doing the work, as a log for Brian to read on the site itself. It is a draft and will become source material for an article in his own words. Newest entries are at the top of the log; the first sections are kept current.*

## Where things stand

| Area | State |
|---|---|
| Site foundations: CI, tests, changelog, conventions | Merged and live |
| Navigation rebuild | Merged and live |
| Design system and the Montserrat font | Pull request open, waiting for review |
| Project registry and this log | Pull request open, stacked on the one above |
| hn.fm: the radio station rebuilt | Deployed. The station is on the air on the home cluster |
| Other projects | Not started |
| Explainer videos, Hermes comparison, the final article | Not started |

::project-list
::

## Waiting on Brian

1. **The typeface.** Every stylesheet on this site names Montserrat, but nothing loaded it, so visitors saw Arial or Helvetica. The design-system pull request loads it. That changes how every page looks, so it is not merged. It is one commit and can be dropped on its own.
2. **Ears.** The radio station now sings its own jingles and one short song an hour. Speech is checked automatically before it airs; singing cannot be. Someone has to listen and say whether the jingles are usable.
3. **Video.** The video model's server is stopped, and it lives on the same machine as the registry, the git server and the deploy controller. Starting a 22-billion-parameter model there was not a decision to take alone. Show idents and song clips are designed and not built.
4. **The public copy of hn.fm.** The public repository is far behind the code the cluster runs. Issues are tracked on the public side. Nothing was pushed there.
5. **The release.** A release pull request (version 1.1.0 of this site) is open and can be merged whenever the changelog should be cut.
6. **Generation on hn.fm.** Story fetching is running again. The switch that sends the daily digests to the e-reader and makes videos on a schedule is still off. It is one switch on the schedule page.

## hn.fm: what was found and what was done

The article on this site describes a hackathon project from September 2025: Hacker News stories turned into narrated video by a language model, a speech model and an image model on one PC. The project kept growing after the article. By this autumn it had a Postgres database, a triage step that scores stories, a daily digest sent to an e-reader, a Helm chart, a build pipeline, and the beginnings of an internet radio station.

### What was wrong

- **The deployed copy had been failing quietly.** Its text model route no longer answered and had no fallback, so every model call on the cluster returned an error. The image service it pointed at had been replaced by a newer one under a different name. Nothing on its status page said so.
- **The radio had never run on the cluster.** It worked on a laptop. The chart's radio templates had never been rendered with the switch on.
- **One prompt had never worked as written.** The prompt for the station's short comedy bits put its style guide in a part of the file that is sent as-is, so the model received the literal text `{house_style}` instead of the guide.

### What the station is now

The old station asked a model to invent thirty minutes of programming, then ran 170 lines of code to repair what came back. The rebuild swaps the jobs. Code owns the shape of the hour; the model owns the choices inside it.

- **Six shows a day**, each with two hosts, a tone and its own music: Cold Start, Main Thread, The Diff, Show and Tell, Night Shift, Garbage Collection.
- **A clock** for each show: four quarters, each an ordered list of slots. A slot is a segment type.
- **Fourteen segment types**, among them a two-hander, a phone-in where callers voice points from the comment thread down a telephone line, a top-of-the-hour bulletin, the front page read as a weather forecast, a mock sponsor read, and a song of the hour.
- **One question for the model per block**: which story goes in which slot. Anything it returns that does not fit is replaced by rule.
- **A writers' room**: a fact sheet per story, a draft, rule checks, an editor prompt, one rewrite, and a final pass that cuts any sentence the rules still reject.
- **A booth that listens back**: every spoken line is transcribed by a speech recogniser and compared with its script. A line that came out wrong is spoken again.
- **No production for nobody**: with no listener the station plays music from its library and leaves the models alone. Someone tuning in wakes it. Three scheduled editions a day keep the archive growing.
- **An archive**: each finished block is kept as one file, with a podcast feed.

### What it costs

Measured on the home cluster, per block of five to nine minutes of air:

| | |
|---|---|
| Time to make | 70 to 170 seconds |
| Model calls | 13 to 29 |
| Tokens | 19,000 to 47,000, mostly an unchanging system prompt |
| Speech match against script | 0.87 to 1.0 per line |
| Loudness of finished files | minus 16.8 to minus 17.1 LUFS |

### The first day of programming

Once it was deployed, the station was asked for a block of every quarter of every show, one at a time. It made 24. Nineteen had enough speech to keep.

| | |
|---|---|
| Archived editions | 19, across all six shows |
| Programming | 98 minutes, 40 of them speech |
| Stories covered | 56 |
| Spoken pieces | 92 made, 10 dropped by the checks |
| Speech match against script | 0.961 on average, 0.822 at worst |
| Songs | 6 |
| Tokens | 239,000 |
| Work time | 24 minutes, spread over about an hour |

They are on the station's listen page under "Listen again", and in its podcast feed.

### What the local model taught

The text model is fast and small. It answers in about a second. Four things about it shaped the design more than any plan did.

1. **It reads its instructions aloud.** Told to "open on the hook", it wrote "The hook: seven years of updates." Labels in the input were read out too. The input now has no labels, and a rule cuts any sentence that recites.
2. **It cannot be told to think a little.** With thinking on it produced four thousand tokens of reasoning and no answer, whatever budget was requested. Everything runs with thinking off. The writer fills in three short fields first (the hook, the facts, the ending) and then writes, which is thinking at a fixed price.
3. **It follows an example and ignores a rule.** Each segment type has one worked example. A test holds the examples to the station's own rules, because an example that breaks a rule teaches the opposite.
4. **It copies whatever it is shown.** Given the research brief, it read the brief back. Given the earlier items in the block for continuity, it lifted whole sentences from them into unrelated stories. It is now shown only a short fact sheet for the story in hand.

Its editor prompt is the weak part. It scores nearly everything five out of five. The rules written in code are what hold quality.

### Was it better? A measured answer

The same twelve stories were written twice: once by the old prompt (the title, then three bullet points read aloud) and once by the rebuilt writers' room. Both sets went through the same rule checks and the same editor.

| | Old | New |
|---|---|---|
| Mean length (the slot wants about 70 words) | 84.6 | 68.2 |
| Pieces with nothing for the rules to object to | 8 of 12 | 11 of 12 |
| Pieces outside the length band | 2 | 0 |
| Pieces where nothing usable was written | 0 | 1 |
| Seconds per piece | 2.2 | 5.2 |
| Tokens per piece | 1,967 | 3,066 |

Then a stronger model read the twelve pairs as a listener, without being told which was which. It preferred the new piece in seven pairs and the old in three, with two ties. That reading is not fully blind, because a piece that opens on its own title is recognisably the old format.

The more useful result was what the reading found. Four defects in the new pipeline showed up in those twelve pairs, and each was fixed the same hour with a test: a sentence cut in the middle of a spelled-out acronym, invented callers, "10th" read as "ten th", and notes about "the source" read on air. A second read of the two weakest segment types found four more. Measuring was worth more than the score.

So the honest summary is: clearly better, not ten times better, at two and a half times the model time per piece. The gains that are closer to tenfold are structural. The station costs nothing when nobody listens. A wrong word no longer reaches the air unheard. A new segment type is one entry in one file.

## The site

- **Foundations.** Pull requests are checked for commit style, built, linted and tested in a browser at three widths. A second job screenshots the site before and after each change. Releases and the changelog are generated.
- **Navigation.** One header for every width, a menu that works with a keyboard, and pickers for language and colour mode that announce their state.
- **Design system.** Colours, containers, buttons and labels are shared classes. A reference page at `/colors` shows them in the current colour mode. Along the way: the site's Tailwind stylesheet had not been applied since the move to Nuxt 4, and the existing tests passed on a visibly broken page, so layout tests were added.
- **Project registry.** One data file per project feeds the [projects page](/projects) and the status block at the top of each project article.

## Who did what

Everything so far was done by one model, Claude Fable 5.2, working in a terminal session with access to the repositories and read access to the cluster. The comparison Brian asked for, the same tasks handed to a local model through Hermes, has not been run yet. The radio work is a preview of what it will show: the local model is a capable writer inside a tight structure and an unreliable judge of its own work.

## Log

### 12 November 2026

- hn.fm radio rebuilt and merged in the project repository; thirteen issues filed there, twelve under one milestone, eleven of them updated with results.
- Chart fixed to point at inference services that exist. Radio made deployable with no new secrets, switched on, and confirmed: the stream decodes.
- Found that story fetching had been paused on the deployed copy since the end of September. Fetching and scoring were resumed, as part of rebooting the project. Generation (the e-reader digests and automatic videos) was left paused, because it sends mail.
- First evaluation round run; eight defects found by reading the output and fixed.
- Twenty-four blocks made on the cluster; nineteen archived.
- A deploy stopped for a reason nobody would guess: one commit's twelve-character id was all digits, so the image tag was read as a number and the chart refused to render. The build was green and the old release kept running. Found by watching the rollout; the tag is now written in quotes.
- The hn.fm article given a marked update section.
- Project registry, projects page and this log added to the site.

### 11 November 2026

- Milestones and issues created for the whole effort.
- Foundations and the navigation rebuild merged and deployed.
- Design-system pull request opened.
