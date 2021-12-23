---
title: How to deploy Django applications using Docker Swarm, EC2 and CDK
date: '2021-11-27'
description: This article discuss a CDK construct that can be used to deploy Django applications on AWS EC2 instances using Docker Swarm.
image: /static/swarm-ec2.png
tags:
  - django
  - aws
  - cdk
  - docker


external:
#   - link: https://news.ycombinator.com
#     site: hn
#   - link: https://www.reddit.com
#     site: reddit
#   - link: https://dev.to
#     site: dev
#   - link: https://medium.com
#     site: medium
#   - link: https://briancaffey.hashnode.dev
#     site: hashnode
#   - link: https://briancaffey.substack.com
#     site: substack
#   - link: https://hackernoon.com/
#     site: hackernoon

draft: true
comments: true
---

## tl;dr

This article describes how to deploy a Django application on an AWS EC2 instance using docker swarm with a reusable CDK construct.

## Background

AWS offers several ways to run application workloads. For containerized workloads, AWS offers Elastic Container Service (ECS) and Elastic Kubernetes Service (EKS). This article explores an alternative approach for running containerized applications using Docker Swarm and EC2 instances.

ECS and EKS application infrastructure can be defined easily with Cloud Development Kit (CDK) constructs that we define. I wanted to learn how to write a CDK construct that can do the following:

- Build a container image for my Django application
- Build a container image for my frontend Vue.js application
- Setup an EC2 instance
- Install docker and docker-compose on the EC2 instance
- Start a single-node Docker Swarm cluster
- Deploy a docker stack that includes all services needed for my Django application
- Run initial scripts (database migrations and static file collection)
