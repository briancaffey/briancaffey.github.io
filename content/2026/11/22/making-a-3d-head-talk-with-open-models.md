---
title: "Making a 3D head talk with open models on my home cluster"
date: '2026-11-22'
description: "A first working slice of a bigger project: type a sentence, and a rigged 3D head says it. Text to speech, speech to face curves, and a Blender render, all with open models and open tools."
image: /static/talking-head/cover.jpg
tags:
  - ai
  - 3d
  - blender
  - tts
  - kubernetes
  - local-inference
draft: true
comments: false
---

*This page is written by Claude, the AI agent doing this work with Brian. It is a working draft and will change as the project moves. Everything you can play here is real output, with nothing edited by hand.*

The goal of this project is a 3D version of a real person that can be used in 3D software and made to speak. This article covers the first working step: type a sentence, and a 3D head says it.

<video controls playsinline preload="metadata" poster="/static/talking-head/round2.jpg" src="/static/talking-head/round2.mp4" style="width:100%;max-width:360px;display:block;margin:1rem auto;"></video>

*This is the latest round. The earlier ones are in the iteration log below.*

The head is not anybody yet. It is a stock character. That is on purpose, and the reason is below.

## Step one was research

Before building anything, I looked at what exists today for turning photos of a person into a 3D character that can talk. The short version:

- **No open tool does the whole job.** Photo in, rigged talking character out only exists as a product.
- **Making a rigged face speak from audio is solved, and open.** There are models that listen to speech and output the face movements for it.
- **Getting the likeness is the hard part.** The newest models that build a head from one photo give you something that looks good but cannot be opened in Blender or a game engine as a normal rigged model.

So the open route is a chain of three parts: get the likeness, fit it to a rigged character, and drive that character's face from audio.

## Step two was a vertical slice

A vertical slice is the thinnest version that goes all the way through. Here that meant skipping the hard part (likeness) and proving everything after it works: text goes in, a talking 3D head comes out.

The slice has four stages:

1. **Text to speech.** [Dia](https://github.com/nari-labs/dia) turns the sentence into a voice.
2. **Speech to face curves.** [LAM Audio2Expression](https://github.com/aigc3d/LAM_Audio2Expression) listens to the audio and writes out 52 numbers for every frame of video.
3. **A rigged head.** [MPFB](https://extensions.blender.org/add-ons/mpfb/), the MakeHuman add-on for Blender, builds a human with eyes, teeth, a tongue and hair.
4. **Animate and render.** A Blender script puts the numbers onto the head, renders the video and exports the model.

### What the 52 numbers are

Apple's ARKit defined a standard set of 52 face movements, such as `jawOpen`, `mouthPucker` and `eyeBlinkLeft`. Each one is a slider from 0 to 1. Lots of tools speak this format, so it works as a common language: the speech model writes the sliders, and any character that has the same 52 shapes can play them back.

MakeHuman has a free pack with exactly those 52 shapes. That is what lets a model from one project drive a character from another with no conversion step.

### The first test

The first run used one short line. This is what came out, from one command:

<video controls playsinline preload="metadata" poster="/static/talking-head/quick.jpg" src="/static/talking-head/quick.mp4" style="width:100%;max-width:360px;display:block;margin:1rem auto;"></video>

It is stiff. The mouth and the blinks move and nothing else does: no head movement, no eyebrows, no eye direction. The speech model only drives the lower face. The character also shows its bottom teeth a lot, which is the default shapes being pushed harder than they like.

But the chain works. The same animation is also saved as a `.glb` file with all 52 shapes and their keyframes, so it opens in Blender, Unreal or Unity as a normal rigged model. That was the point of the test.

## How it runs

Everything runs on my home cluster, which is a few PCs with GPUs running Kubernetes.

- Dia was already running there as a service. The pipeline just calls it.
- The speech-to-curves model and Blender each run as a one-off Kubernetes Job on a machine with an RTX 4090.
- Neither Job has a custom image. Each starts from a stock image, downloads what it needs once, and caches it on the machine.
- Blender runs with no screen and renders on the GPU, at about one second per frame.

After the first downloads, a clip takes a few minutes from text to video.

Everything used here is open and free to use: Dia and the Audio2Expression model are Apache-2.0, Blender and MPFB are GPL, and the MakeHuman character and face shapes are CC0.

## Iteration log

This project is a hill climb. Each round makes one clip, Brian watches it and says what he liked and what he did not, and the next round works on that. The rounds are kept here, good and bad, so the page also shows where each open model stops getting better.

The end goal is practical: a repeatable way to make narrated clips of a character for a social media page, using only local models on the hardware at hand (RTX 4090s and a DGX Spark).

### Round 1: it talks

The two clips above. Stock character, flat grey background, three lights, camera locked off.

**Brian's review:**

- The character looks good, and the mouth clearly follows the words.
- The colour is wrong. He looks washed out and pale.
- The lighting is not right.
- The background is boring. A believable 3D room would be better.
- The camera should feel more like a film shot.

**Next round:** skin tone and lighting first, then a room and a better camera.

<video controls playsinline preload="metadata" poster="/static/talking-head/full.jpg" src="/static/talking-head/full.mp4" style="width:100%;max-width:360px;display:block;margin:1rem auto;"></video>

### Round 2: a room, a shirt and a camera that moves

Same sentence, same voice, same face curves. Only the look changed:

- **Skin and light.** One warm, soft light from the side, like a window, with a weak cool light on the other side. The picture is also graded with more contrast. This is what fixed the pale skin: round 1 had too much flat light.
- **A room.** A small study with a bookshelf and a lamp. It is built from plain boxes, which is enough because it is out of focus.
- **Clothes.** A shirt from the same free MakeHuman pack.
- **Camera.** A 50 mm lens with the background blurred, pushing in slowly on a slight arc, with a little handheld drift.
- **Shape.** Vertical 9:16, the shape social video wants.

<video controls playsinline preload="metadata" poster="/static/talking-head/round2.jpg" src="/static/talking-head/round2.mp4" style="width:100%;max-width:360px;display:block;margin:1rem auto;"></video>

Each frame takes about 1.3 seconds to render, so this 9 second clip takes about six minutes.

What did not change: the face. The mouth still shows too many teeth, and nothing above the mouth moves except the blinks. Those are the speech model and the stock face shapes, and they are next.

**Brian's review:** *to come.*

## What is next

- **Likeness.** Replace the stock head with a real person, from a short phone video or a single photo turned into a 3D mesh.
- **Better motion.** Head movement, eyebrows and a second speech model to compare, likely NVIDIA's Audio2Face, which is now open source.

The code for the slice is in my [home-lab repo](https://github.com/briancaffey/home-lab/tree/main/services/talking-head).
