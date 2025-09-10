---
title: "hnfm: Building a Local-First AI Podcast Generator for Hacker News"
date: '2025-09-09'
description: "hnfm transforms the Hacker News feed into your personalized AI-powered podcast"
image: /static/hnfm/hnfm_cover.png
tags:
  - ai
  - llm
  - tts
  - flux
  - nuxt
  - fastapi
  - openai
  - gpt-oss

draft: false

comments: true
---

## Introduction

hnfm is my hackathon project for the OpenAI Open Model Hackathon. It's an application that takes Hacker News articles and automatically transforms them into podcast-style videos using a full suite of AI models.

The idea is simple: turn text-heavy news into a multimedia experience with **summarization, narration, imagery, and subtitles**. But behind the scenes, hnfm is also a deep experiment in **local AI inference** - running everything on my own hardware instead of relying on cloud services. I wanted to see how far I could push open-source models for end-to-end content creation.

---

## Motivation

I spend a lot of time on Hacker News. The community constantly surfaces interesting articles, clever projects, and thoughtful discussions. But it's not always easy to keep up.

I also enjoy short-form podcasts and clips. They're easier to consume while multitasking, and they bring a different kind of engagement compared to reading. That's where hnfm came in. I wanted to **reimagine the Hacker News experience** by creating a kind of radio show or podcast that could automatically generate short episodes, complete with voices, visuals, and subtitles.

Some guiding motivations for hnfm:

* **Richer formats**: Instead of just reading, I can *listen* and *watch*.
* **Local-first AI**: Everything runs on my own hardware, with no reliance on cloud APIs.
* **State-of-the-art tools**: I wanted to benchmark what's possible today with free and open-source models for language, speech, and images.
* **Personalization**: Hacker News does a good job surfacing popular stories, but hnfm goes deeper - indexing articles from the "new" feed and sorting them by relevance to my own interests.
* **Prosumer ethos**: Not just consuming content, but producing something new from it that I can share and monetize.

The name "hnfm" plays on the idea of a radio show for Hacker News - a personalized channel that broadcasts the latest in tech and AI.

---

## The Pipeline

hnfm stitches together a chain of AI tasks into a single automated pipeline:

1. **Fetch and scrape**

   * Grab post metadata via the free and public Hacker News Firebase API.
   * Use **Firecrawl** (powered by a gpt-oss-20b) to scrape and clean article content, returning Markdown.

2. **Summarization + script generation**

   * Send content to **gpt-oss**, my local large language model.
   * Summarize the article and generate a **two-speaker podcast script**.
   * Adjust reasoning levels (low/medium/high) depending on content complexity.

3. **Text-to-speech narration**

   * Pass script segments to **nari-labs/dia**, an ultra-realistic TTS model.
   * Save each narration as a WAV file.

4. **Image generation**

   * Use gpt-oss to create **visual descriptions** for each narration segment.
   * Feed these prompts to **InvokeAI**, running the **Flux Krea [dev]** image model.
   * Save the generated images alongside the audio.

5. **Speech recognition and subtitles**

   * Run **WhisperX** for word-level timestamps and speaker diarization.
   * Output JSON data for subtitle alignment.

6. **Assembly**

   * Combine narration, images, and subtitles into a polished video using ffmpeg.
   * Each segment has a matched voice, image, and subtitle track.

The result: a mini-episode podcast complete with narration, visuals, and synced captions.

---

## Architecture and Tools

At its core, hnfm runs on **Python** with a modular architecture. Here's the breakdown:

* **Backend Frameworks**

  * FastAPI for the API server.
  * Celery for asynchronous task execution.
  * Redis as a general-purpose database, message broker and vector database.
  * LangChain for orchestration and chaining model calls.

* **External Services (running on my home network)**

  * **LM Studio** with gpt-oss-20b (LLM inference, embeddings, reasoning).
  * **dia** for text-to-speech (wrapped with a custom FastAPI server to manage VRAM usage).
  * **InvokeAI** for image generation (Flux Krea [dev]).
  * **WhisperX** for speech recognition (ASR).

* **Frontend**

  * Built with Nuxt.js and shadcn components.
  * Lets me scrape Hacker News, browse articles, trigger generation, and review audio, image and video outputs.

* **Deployment**

  * Backend services run in Docker.
  * Redis handles both task queues and embeddings.
  * Flower provides monitoring for Celery.

I also created a **status page** and service status API to confirm all services are online before generating content.

---

## Why gpt-oss?

The star of the show is **gpt-oss**, a reasoning-first open-source model. What makes it special:

* **Reasoning control**: I can tune how much "thinking" the model does before responding.

  * Low for quick summarization.
  * High for creative, nuanced scriptwriting or image scene planning.
* **Large context window**: Configurable up to tens of thousands of tokens - enough to handle long-form articles (I configured a context window of about 30k tokens).
* **Embeddings**: I use gpt-oss's embeddings with Redis to build a **vector index** of scraped articles.

This indexing step allows hnfm to:

* Pull from the high-volume "new" feed on Hacker News.
* Sort articles based on alignment with my personal interests.
* Surface content that might never reach the front page.

In other words, gpt-oss powers both **content creation** and **content discovery** in hnfm.

---

## Development Journey

The build process had two phases: quick MVP, then structured rebuild.

### Phase 1: Rapid prototyping

* Started by wiring services together in Cursor with "vibe coding."
* Focused on minimal workflow: scrape → summarize → narrate → image → assemble.
* Stored outputs in JSON and local directories.

### Phase 2: Structured architecture

Once I proved the concept worked, I gutted the initial code and rebuilt with a stronger spec:

* **Custom APIs**:

  * Wrapped WhisperX and DIA in FastAPI servers for reliable inference.
  * Added endpoints for managing VRAM by unloading TTS models between runs.

* **Celery tasks**:

  * Split long-running jobs into queued tasks.
  * Centralized Redis client logic to avoid duplication across tasks.

* **File + Redis dual storage**:

  * Used Redis for fast data structures.
  * Stored images, audio, and metadata as files.

* **Frontend interface**:

  * Allowed browsing of \~50 scraped stories at once.
  * Supported A/B testing multiple scripts for the same article.
  * Structured data into `item` (Hacker News post) and `segment` (podcast episode unit).

* **Testing & linting**:

  * Added unit tests and linters for stability.
  * Iterated with Cursor and Gemini CLI for faster development cycles.

I also Dockerized the backend, which made running multiple services far more manageable.

---

## Lessons Learned

* **Service health is critical**: With multiple AI services, one offline process can derail the pipeline. My health-check API saved hours of frustration.
* **Reasoning tuning matters**: Some steps benefit from deep thinking (scriptwriting), while others only need quick output (summaries). gpt-oss's reasoning control was invaluable, and no other model gives you this type of control.
* **Prompt iteration is the fun part**: Most improvements came from refining prompts, not debugging code.
* **Keep it simple**: Every time the architecture grew too complex, progress stalled. The best results came from aggressively simplifying, and telling code agents to write simple code that sticks to your requirements. Coding agents like Cursor will try to over-optimize
* **Cursor rules and constraints help**: Encoding best practices into coding agents prevented regressions and kept the codebase clean.

---



## Final Thoughts

hnfm is more than a neat hackathon project. It's a **proof of concept for local-first AI media generation**. On a single RTX 4090, I can run:

* A reasoning LLM (gpt-oss).
* An ultra-realistic TTS model (nari-labs/dia).
* A high-quality diffusion model (Flux Krea).
* A state-of-the-art ASR system (WhisperX).

All locally. No cloud APIs. No pay-per-call. Just consumer hardware and open-source models.

For me, hnfm represents a "prosumer" approach to AI - consuming content from Hacker News, but also producing something new with it. It's commentary, transformation, and reimagining, all in one.

I've made the project open source because I believe experiments like this should be shared. The closed-source AI ecosystem is growing rapidly, but it's vital that we also push forward what's possible with **open models** running on personal hardware. It's not just about cost or performance - it's about ownership, freedom, and creative expression.

Building hnfm was challenging, rewarding, and a lot of fun. It's a small glimpse into what's possible with state-of-the-art open source AI running on consumer hardware.

## Video

For the OpenAI hackathon I needed to create a short video that introduces the project. I wrote this article on my blog, submitted it to Hacker News and then used hnfm to generate my submission video.