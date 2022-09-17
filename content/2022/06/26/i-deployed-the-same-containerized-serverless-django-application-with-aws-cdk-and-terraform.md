---
title: I deployed the same Django application to AWS ECS with Terraform and CDK
date: '2022-06-26'
description: "This article is a deep technical dive into two popular Infrastructure as Code tools: Terraform and CDK. I will show how these two tools can be used for the task of provisioning infrastructure on AWS for running a serverless, containerized Django application in a production environment using ECS Fargate and GitHub Actions."
# image: /static/adhoc.png
tags:
  - django
  - terraform
  - cdk
  - cloudformation
  - github-actions
  - aws
  - ecs
  - containers
  - docker
  - fargate

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

I deployed the same Django application to AWS ECS with Terraform and CDK. This article discusses my experience with these two popular Infrastructure as Code tools. I will show my process for developing and using reusable code modules for provisioning infrastructure on AWS to support a sample micro blogging application built with Django.

## My journey in Infrastructure as Code

- Context on my experience, what led me to writing this article
- Started my career in software development as a backend developer working on Django applications, also learned frontend code working with Vue.js to build SPAs
- Wanted to improve my AWS skills by using standard tools and best practices
- Took a crash course with Linux Academy to fill in some of the gaps in my AWS skills
- Searched for authoritative examples of application + infrastructure code matching my use case
- [ecs-refarch-cloudformation](https://github.com/aws-samples/ecs-refarch-cloudformation) repo as a guide
- Started with raw CloudFormation templates
- Figured out how to used CloudFormation for my use case.
- Not perfect,but I got things to work
- difficulty with syntax and modularity, DRY, complexity, reusability and maintainability
- heard about the troposphere project for writing CLoudFormation with Python, sounded like a good way to abstract things
- People recommended looking at CDK, a new library for doing basically the same thing
- I resisted learning CDK, but I learned how to use it to support my use case at work
- Wrote some open source projects using the patterns I learned with CDK (using Python)
- Started thinking about publishing reusable modules for a more generalized use case that could be used across multiple projects
- started working on `django-cdk` as a component library taking an application-first approach to infrastructure as code development to learn in public and keep up with changes in CDK
- started learning TypeScript (having some experience with front-end JavaScript) so that I could write reusable CDK components
- cdk workshop (TypeScript) repos to get up to speed with the new language
- started working with Terraform
- read the Terraform up and running book to learn about best practices
- started working on `terraform-aws-django` as a collection of modules to learn how to deploy Django applications with Terraform
- focused on both on-demand ad hoc environments as well as production-ready environments
- decided to write about my experience with Terraform and CDK

## Publishing reusable infrastructure as code modules with CDK and Terraform

### What and Why

- `django-cdk` and `terraform-aws-django` are the two open source libraries I wrote to learn more about Infrastructure as Code in the context of building and deploying web applications
- They are intended to provide a starting point for DevOps engineers to start learning about Infrastructure as Code

### Terraform

- Terraform Registry + GitHub
- release please + CHANGELOG.md

### CDK

- npm + PyPI
- projen for managing project dependencies

## `django-cdk` and `terraform-aws-django`

- Reusable libraries for deploying infrastructure on AWS
- Both libraries contain multiple reusable modules for two main use cases
  - on-demand ad-hoc environments for testing and demos
  - production environments and pre-production environments (with minor differences)

### `django-cdk`

- built with TypeScript and uses projen to manage dependencies
- published to npm
- versioned by projen

### `terraform-aws-django`

- built with Terraform and written in HCL
- published to Terraform Registry
- versioned by GitHub Actions (release-please)
- uses submodules

## Including runnable examples in infrastructure code modules and libraries

- Makefile

### CDK

- `integ` integration tests

### Terraform

- `examples`

## The application

- Containerized Serverless Django application deployed with ECS Fargate

### How and why to split up the application infrastructure into two parts

- Splitting the application infrastructure into two parts

### Base layer

Things that ideally should not change much.

- VPC
- Databases
- Load Balancer
- S3 Buckets

### Application

- ECS Services
- ECS Task Definitions

## Constructs, modules and reusability in `django-cdk` and `terraform-aws-django`

### `aws-vpc-module` and `Vpc` construct

- both serve

## Outputs

### Terraform outputs

- used in CI/CD and for `terraform_remote_state`

### CloudFormation outputs

- used for cross-stack references and for CI/CD

## Application vs Infrastructure updates

Most important part of this application. How do we make sure that updates to the application and infrastructure can both be done without issues, downtime, conflicts and out tooling getting "stuck".

### Initial deployment of the application

- We can make sure that the application starts running properly as soon as it is deployed.
- First apply the base layer infrastructure and then apply the application layer infrastructure using GitHub Actions.
- After `terraform apply` has finished, apply management commands (migrate, collectstatic, etc.)
- Use EcsExec to setup initial admin user, etc.
- Show the two commands that are used for this
- Show where state is stored (S3 bucket vs CloudFormation stacks)

### Application updates

- Overview of the script that is used for updating the application using AWS CLI
- This script will be the same for both Terraform and CDK
- It leverages tags and naming conventions that are used when infrastructure is set up by Terraform and CDK


### Updating the infrastructure layer after the application layer has been updated

- With CDK, if we make an update to the infrastructure after the application has been update (via our application update script with AWS CLI), the infrastructure will update the application to whatever version is specified in the infrastructure.

- If we specify the current version of the application when we make new infrastructure updates, then the version of our application won't change and we can safely apply infrastructure updates.

- The downside is that we have to remember to do this every time we update the infrastructure.

- Terraform has `ignore_changes`, so we can make changes to the task definition and do `terraform apply` the services won't change, but a new task definition will be created in the AWS account which we can use on the next deployment. Then we simply do a new application update via the CLI and it should take the most recent task definition that we have deployed.

## My process for getting into a good flow when working on this stuff

Sometimes there can be a lot to juggle when working on these types of projects. Multiple repos are involved and everything has to work together, and this can add up to a large mental overhead. Here are some notes on how I maintain a good flow when working at the intersection of application code and infrastructure as code.

- Pick a goal and build a checklist before digging in deep on something

- Let error messages work for you, not against you. This is especially true with Terraform. The error messages tell me what I'm missing

- Move things into CI/CD
