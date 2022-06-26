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

# I deployed the same Django application to AWS ECS with Terraform and CDK

## My journey in Infrastructure as Code

## Publishing reusable infrastructure as code modules with CDK and Terraform

### Why

### Terraform

- Terraform Registry + GitHub
- release please + CHANGELOG.md

### CDK

- npm + PyPI
- projen for managing project dependencies

## Including runable examples in infrastructure code

- Makefile

### CDK

### Terraform

## `django-cdk` and `terraform-aws-django`

- Reusable libraries for deploying infrastructure on AWS
- Both libaries contain multiple reusable modules for two main use cases
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
