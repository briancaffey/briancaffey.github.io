---
title: Building and deploying unstoppable Django applications with Terraform, AWS ECS and GitHub Actions
date: '2022-06-17'
description: This article is a deep dive into how to do fast, zero-downtime deployments for highly scalable and cost-effective serverless Django applications using Terraform, ECS Fargate and GitHub Actions
# image: /static/adhoc.png
tags:
  - django
  - terraform
  - github-actions
  - aws
  - ecs
  - containers
  - docker

draft: true

# external:
  # - link: https://news.ycombinator.com/item?id=31704417
  #   site: hn
  # - link: https://www.reddit.com/r/aws/comments/v9ycwh/my_approach_to_building_ad_hoc_developer/
  #   site: reddit
  # - link: https://dev.to/briancaffey/setting-up-ad-hoc-development-environments-for-django-applications-with-aws-ecs-terraform-and-github-actions-4abh
  #   site: dev
  # - link: https://medium.com/@briancaffey/setting-up-ad-hoc-development-environments-for-django-applications-with-aws-ecs-terraform-and-84d26e710539
  #   site: medium
  # - link: https://briancaffey.hashnode.dev/setting-up-ad-hoc-development-environments-for-django-applications-with-aws-ecs-terraform-and-github-actions
  #   site: hashnode
  # - link: https://twitter.com/briancaffey/status/1535683865330831360
  #   site: twitter
  # - link: https://briancaffey.substack.com/p/setting-up-ad-hoc-development-environments
  #   site: substack
  # - link: https://hackernoon.com/ad-hoc-environments-for-django-applications-with-ecs-terraform-and-github-actions
  #   site: hackernoon

comments: true
---

# Topics to cover

## Terraform

- Discuss Ad Hoc environment work in my last article
- How I build and version Terraform modules
- `release-please` for generating `CHANGELOG.md` files and using conventional commits
- Publishing modules to Terraform Registry
- Creating modules for live infrastructure that consumes a reusable module and re-exposing Terraform variables + tfvars
- GitHub Actions for Terraform modules

## Repos

- `django-step-by-step` - sample application that we will deploying (MTV + DRF + GraphQL + Vue App)
- `terraform-aws-django` / `production-django-app` (or create a new repo?) - (application components - ECS services)
- `terraform-aws-django-app-base` (base layer of infrastructure and backing services used for environment isolation)

## GitHub Actions

- [ ] Terraform environment deployment
- [ ] break backend update script into sections with `needs`
- [ ] Slack messages for deployment status

## AWS ECS

- [ ] Autoscaling policies
- [ ] alarms for triggering autoscaling policies
- [ ] Fargate capacity provider
- [ ]

## TODO

- [ ] figure out what to clean up in `django-step-by-step`
  - [x] Use multi stage Dockerfile and remove Dockerfile.dev
  - [x] Add `migrate` service with `restart: "on-failure"`
  - [x] remove `--platform` from Dockerfile `FROM`
  - [x] Dockerfile.dev -> Dockerfile
  - [ ]
- [ ] Checklist of things to do in local development environment
  - [ ] Enable virtualization in Docker desktop
- [x] Reset all tags on ECR
  - [x] Update job to build ECR on tags
  - [ ] Figure out how to setup pipeline for FE ECR image build + push
- [ ] create new repos
- [ ] create new scripts for backend update
- [ ] create Terraform CI/CD pipelines in GitHub Actions
- [ ] Check to see if S3 permissions are still causing issues for file uploads
- [ ]


## Introduction

What is an unstoppable Django application?

### Horizontal Scaling

- Will not fall over or become unresponsive when there is a large amount of traffic
- Scale out by the process model (12Factor principle: Concurrency - Scale out via the process model)
- How to scale Fargate Services with CloudWatch alarms and autoscaling policies

### Zero-downtime deployments with rolling updates

- Deployment script step-by-step overview
- Backward-compatible database migrations
- Running migrations on a separate Fargate instance (not in the same container that runs the application)
- AWS CLI commands for doing rolling updates to ECS services

### Infrastructure updates with Terraform

- How to introduce an infrastructure update that changes configuration in our Django application (environment variables, etc.)
- Terraform module/configuration separation (network layer, database layer, application layer, etc.)

### SDLC and Teamwork

If you are working on a Django application yourself, you might have a way to rapidly build and push out changes to your application in a safe way. Would this work safely with a large number of developers?

- [ ]
- Variation in developer environments (M1, Intel Mac, Windows, WSL, Linux, docker vs virtualenv)
-

### Avoiding the introduction of code (and configuration) bugs

Another important consideration to make for our unstoppable Django application is how to avoid the introduction of code (and configuration) bugs.

- [ ] Promoting the same image artifact across multiple environments (build once, deploy many times)
- [ ] Testing the application in series of pre-production environments (QA, RC, staging, production)
- [ ] Allowing developers to test the application in an isolated environment that resembles the production environment (mention ad hoc environments)
- [ ] Automated load testing to make sure that code changes are not introducing inefficient database queries

### Auditing and Security

- [ ] Disaster recovery
- [ ] Auditing Infrastructure as Code
- [ ] Automated application vulnerability scanning as soon as a deployment artifact is created

### Automated tests, linting, coverage, cyclomatic complexity analysis

- [ ]

###
