---

layout: post
title: Using docker for local Jekyll development
date: 2019-04-01
comments: true

---

Here's a simple docker setup for developing Jekyll sites locally with docker. This way I won't have to install ruby, bundler or jekyll directly on my local machine. Instead, I'll use the official `jekyll/jekyll:pages` image from Docker Hub.

## docker-compose

```yml
version: '3'

services:

  jekyll:
      image: jekyll/jekyll:pages
      command: jekyll serve --watch --incremental
      ports:
          - 4000:4000
      volumes:
          - .:/srv/jekyll
```