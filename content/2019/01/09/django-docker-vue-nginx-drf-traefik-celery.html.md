---
layout: post
title: Setup, Development and Deployment of a web app using Django, VueJS, VuePress, Docker, nginx, traefik and GitLab
date: 2019-01-09
comments: true
image: /static/technologies.png
tags:
  - django
  - vue
  - docker
  - gitlab
---

This project is currently deployed on [https://verbose-equals-true.tk](https://verbose-equals-true.tk). The source code is available at [https://gitlab.com/briancaffey/verbose-equals-true](https://gitlab.com/briancaffey/verbose-equals-true).

The goal of this project is to explain how to setup a project starting with a fresh installation of 16.04. Setup includes local development environment, GitLab CI/CD, VSCode settings and configuration of the different containers that make up the application:

- Django
- Node (for local development with VueJS)
- nginx
- Traefik
- Postgres
- Celery
- flower
- portainer

Here's an overview of the architecture used in the application:

![png](/static/architecture.png)

Extensive documentation for this project can be found at [https://verbose-equals-true.tk/docs](https://verbose-equals-true.tk/docs).
