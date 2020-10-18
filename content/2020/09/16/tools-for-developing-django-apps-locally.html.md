---
layout: post
title: Some of the tools and workflows I use for local Django application development
date: 2020-09-16
comments: true
tags:
  - django
  - development
---

This article will be an overview of some of the tools and workflows I use when developing Django applications locally on my computer.

I recently had a few different projects each with slightly different local settings, monitoring tools and utilities, and I had trouble keeping track of them across different projects. This motivated me to combine all of my favorite local development tools in one project that I can clone to quickly get setup with a new project.

## tl;dr

Here's a quick list of the tools I'll talk about:

- `docker` and `docker-compose` for starting multiple containers (runserver_plus/runserver for django, celery, beat, flower, nginx, node for js frontend, postgres, pgadmin, redis, redis-commander, mailhog)
- [Django debug toolbar](https://github.com/jazzband/django-debug-toolbar)
- [flower](https://github.com/mher/flower) (for monitoring celery, also used this in production)
- [redis-commander](https://github.com/joeferner/redis-commander) (used for viewing redis databases)
- [pgadmin4](https://www.pgadmin.org/) (for postgres debugging)
- [mailhog](https://github.com/mailhog/MailHog#docker) (for testing email)
- [watchdog](https://github.com/gorakhargosh/watchdog) (for reloading celery in development)
- [Jupyter notebooks](https://jupyter.org/index.html) with shell_plus for prototyping
- [runserver_plus/Werkzeug/django-extensions](https://django-extensions.readthedocs.io/en/latest/runserver_plus.html)
- [DRF browsable API](https://www.django-rest-framework.org/topics/browsable-api/)
- [black](https://github.com/psf/black) for code formatting in VSCode
- [NGINX](https://www.nginx.com/) for routing the servics above (/pgadmin, /flower/, /rediscommander, etc.), also used in production
- [pytest](https://docs.pytest.org/en/stable/)/[factory_boy](https://factoryboy.readthedocs.io/en/latest/) for testing
- [gitlab-runner](https://docs.gitlab.com/runner/) for testing/debugging gitlab CI pipelines and also running GitLab CI pipelines locally instead of using minutes

Before digging inot to these tools, let's back up and think about some of the goals we should have for local development environments for software projects.

## Goals for development environments

Here are some of the goals we should consider, ordered by priority:

1. local development should emulate our production environment as much as possible and as much as is practical
1. starting a local development environment should be quick and easy and should require little to no mental load
1. The local development environment should have the same dependencies and settings that are used in production, and any additional dependecnies or settings should be clearly separated
1. code changes made while the application runs locally should be reflected immediately as code changes are saved

## Example repo

I'll be referencing this git repository throughout this article:

[https://gitlab.com/verbose-equals-true/digital-ocean-docker-swarm](https://gitlab.com/verbose-equals-true/digital-ocean-docker-swarm)

Here are a few things to know about this repo:

- It is a dummy project that I'm mostly using to get more familiar with celery and to debug an issue I'm having with scheduled celery tasks
- There is currently no interaction between the backend Django application and the frontend Vue.js/Quasar application
