---
title: Building and deploying unstoppable Django applications with Terraform, AWS ECS and GitHub Actions
date: '2022-06-17'
description: This article is a deep dive into how to do fast, zero-downtime deployments for highly-scalable and cost-effective serverless Django applications using Terraform, ECS Fargate and GitHub Actions
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

## tl;dr

Following up on my last article about building ad hoc, or "on-demand" environments for testing, QA and demos, this article will focus on how to make Django application "unstoppable" with respect to production environment operations: horizontal scaling in response to traffic changes, zero-downtime application deployments, zero-downtime infrastructure updates, catching code and configuration bugs in pre-production environments, and edge cases. Similar to my last article, this will be a technical deep dive on my implementation of a sample application using Terraform, AWS ECS and GitHub Actions. I will use the 12Factor App methodology to guide the design of the application architecture. If any of this interests you, please have a read and let me know what you think.

# Topics to cover

This article will cover production and pre-production environments. As we will see, production and pre-production environments will be absolutely identical in terms of infrastructure, but there will be some differences in configuration (mostly environment variables). I'll cover the following topics:

- Application code
- Infrastructure code
- CI/CD pipelines
- Access patterns (application and database)

## Infrastructure code (Terraform)

- Discuss Ad Hoc environment work in my last article
- How I build and version Terraform modules
- `release-please` for generating `CHANGELOG.md` files and using conventional commits
- Terraform monorepo for managing modules for multiple environments
- Publishing modules to Terraform Registry
- Creating modules for live infrastructure that consumes a reusable module and re-exposing Terraform variables + tfvars
- GitHub Actions for Terraform modules

## Repos

- `django-step-by-step`
  - Django application (Django Templates, DRF and GraphQL implementations of the same application)
  - Vue.js frontend
  - GitHub Actions for deploying to AWS
  - Consumes Terraform modules
  - Project documentation with VuePress

- `terraform-aws-django`
  - Terraform monorepo for ad hoc and production environments
  - versioned with `release-please`
  - published to Terraform Registry

## GitHub Actions

- [ ] Terraform environment deployment
- [ ] break backend update script into sections with `needs`
- [ ] Slack messages for deployment status



## AWS ECS

- [ ] Autoscaling policies
- [ ] alarms for triggering autoscaling policies
- [ ] Fargate capacity provider

## TODO

- [ ] figure out what to clean up in `django-step-by-step`
  - [ ] Add Readmes to directories
  - [ ] Clean up main readme
- [ ] Checklist of things to do in local development environment
  - [x] Enable virtualization in Docker desktop
  - [x] remove `--platform` from Dockerfile `FROM`
  - [x] Add `migrate` service with `restart: "on-failure"`
  - [x] Use multi stage Dockerfile and remove Dockerfile.dev
  - [x] Dockerfile.dev -> Dockerfile
  - [x] Run tests
  - [ ] Lint code
  - [x] View coverage report (`make htmlcov`)
- [x] Reset all tags on ECR
  - [x] Update job to build ECR on tags
  - [ ] Figure out how to setup pipeline for FE ECR image build + push
- [ ] create new scripts for backend update
- [ ] create Terraform CI/CD pipelines in GitHub Actions
- [ ] Check to see if S3 permissions are still causing issues for file uploads
- [ ] Refactor backend ad hoc update command to use multiple steps in GitHub Actions (break up script to different sections)
- [ ] Create management commands for backend update (pre_update, post_update)
- [ ] Create middleware for putting Django application into maintenance mode

## Introduction

What is an "unstoppable" Django application?

### Horizontal Scaling

- Will not fall over or become unresponsive when there is a large amount of traffic
- Scale out by the process model (12Factor principle: Concurrency - Scale out via the process model)
- How to scale Fargate Services with CloudWatch alarms and autoscaling policies

### Zero-downtime deployments with rolling updates

- Deployment script step-by-step overview
- Backward-compatible database migrations
- Running migrations on a separate Fargate instance (not in the same container that runs the application)
- AWS CLI commands for doing rolling updates to ECS services
- Why we want to do rolling updates and not blue-green updates

### Infrastructure updates with Terraform

- How to introduce an infrastructure update that changes configuration in our Django application (environment variables, etc.)
- Terraform module/configuration separation (network layer, database layer, application layer, etc.)

### SDLC and Teamwork

If you are working on a Django application yourself, you might have a way to rapidly build and push out changes to your application in a safe way. Would this work safely with a large number of developers?

- Variation in developer environments (M1, Intel Mac, Windows, WSL, Linux, docker vs virtualenv)
-

### Avoiding the introduction of code (and configuration) bugs

Another important consideration to make for our unstoppable Django application is how to avoid the introduction of code (and configuration) bugs.

- [ ] Promoting the same image artifact across multiple environments (build once, deploy many times)
- [ ] Testing the application in series of pre-production environments (QA, RC, staging, production)
- [ ] Allowing developers to test the application in an isolated environment that resembles the production environment (mention ad hoc environments)
- [ ] Automated load testing to make sure that code changes are not introducing inefficient database queries

### Getting permission to do deployments

- [ ] Show how to do deployments with GitHub Actions that require permissions to push changes to production environments (or stage environments) with GitHub environments

### Auditing and Security

- [ ] Disaster recovery
- [ ] Auditing Infrastructure as Code
- [ ] Automated application vulnerability scanning as soon as a deployment artifact is created

### Automated tests, linting, coverage, cyclomatic complexity analysis

- [ ]

### Stopping your unstoppable Django application

- [ ] Explain why you would need to do this
- [ ] How to stop your unstoppable Django application
- [ ] Restarting you unstoppable Django application

### Shutting down your unstoppable Django application

If for whatever reason your application needs to be shut down, how do you do that?


## Other ideas

### The base layer module can be split up further

- This project uses only two modules: one for the base layer architecture and one for the application layer.
- The base layer module could be split up into distinct modules that are referenced individually by `terraform_remote_state`
- There are other prebuilt official modules that can be used in the base layer module (such as the `rds` module: https://registry.terraform.io/modules/terraform-aws-modules/rds/aws/latest)
-
