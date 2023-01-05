---
title: My Infrastructure as Code Rosetta Stone - Deploying the same web application on AWS ECS with CDK, Terraform and Pulumi
date: '2022-06-26'
description: "I wrote three reusable infrastructure as code libraries to develop high-level abstractions for deploying containerized web apps on AWS ECS. This article will provide an overview of my experience working with CDK, Terraform and Pulumi and will cover how I use these libraries in automated infrastructure deployment pipelines using GitHub Actions"
image: /static/iac_rosetta_stone_og_image.png
tags:
  - django
  - cdk
  - terraform
  - pulumi
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

I wrote infrastructure as code libraries for deploying serverless containerized 3-tier web apps on AWS ECS Fargate. This article will provide an overview of my experience working with CDK, Terraform and Pulumi and will cover how I use my libraries in automated infrastructure deployment pipelines using GitHub Actions.

- **CDK Construct Library**: [github.com/briancaffey/cdk-django](https://github.com/briancaffey/cdk-django)
- **Terraform Modules**: [github.com/briancaffey/terraform-aws-django](https://github.com/briancaffey/terraform-aws-django)
- **Pulumi Component Library**: [github.com/briancaffey/pulumi-aws-django](https://github.com/briancaffey/pulumi-aws-django)

- Mono repo with a sample Django micro blogging app (μblog) and frontend app (Vue SPA written with Quasar), GitHub Action workflows for infrastructure and (separate) application deployment pipelines, IaC code that *consumes* each of the libraries listed above, [VuePress documentation site](https://briancaffey.github.io/django-step-by-step/) and miscellaneous items (k6 load testing scripts, Cypress tests, docker-compose, etc.): [github.com/briancaffey/django-step-by-step](https://github.com/briancaffey/django-step-by-step)

## eli5

Pretend we are at the beach trying to build some awesome sandcastles. We can build sand castles using our hands, but this takes a lot of time, and we might accidentally knock over part of our sandcastle or bump into each other, so I made some really cool tools for building sandcastles. We have one tool for building a sand castle base that includes the wall around the outside, the moat, the door and different sections inside the walls. We have another tool for deploying smaller sand castle houses. We fill the tool with sand and water and then turn it over inside of our base and we can build an entire little city of sandcastles. Also, the tool lets us carefully remove sandcastle houses without knocking over any of the other sandcastles. Also we can share the tool with all of our friends and they can make cool sandcastles too, and the tool is free for them to use.

Instead of sandcastles, I'm working with computer systems that can power internet applications, like YouTube. I'm building tools that can allow me or anyone to build really awesome applications using computers. These tools are not physical tools like our tools for building sandcastles, but instead these tools are actually code. When we run this code, it creates my computer system.

## Why I made an Infrastructure as Code Rosetta Stone with CDK, Terraform and Pulumi

1. To push myself to learn more about AWS, IaC, CI/CD, automation and Platform Engineering

- learn differences between major IaC tools and how to use them to do exactly the same thing (build a web app) on the same Cloud (AWS) in the same way (ECS Fargate).
- get more experience publishing software packages (npm) and finding the right level of abstraction

2. To fail as many times as possible

- Every time I fail when I think I have things right, I learn something new
- Failed IaC pipelines can sometimes be scary, and every failure I have on these project can teach me about potential failure modes for live projects running in production
- You can often times be "stuck" where you have a set of resources that you can't update or delete. Learning to get unstuck from these scenarios is important

3. To take an application-first approach to DevOps

- While learning about IaC, I had a hard time finding in-depth materials covering application development, CI/CD pipelines and automation and Infrastructure as Code and how these three knowledge domains work together
- You could probably use another framework with these IaC libraries like Flask or Rails, but for now I'm building these projects with Django first in mind
- Application developers who are increasingly being tasked to do operations

4. To develop a project I can reference when helping myself and others

- companies and projects that do IaC and CI/CD for the most part have things in private repos for obvious reasons, there isn't much incentive to share this type of code
- Hopefully the application, IaC and CI/CD pipelines *aren't overly complex*. There are more complex examples of open source companies out there, but their repos have steep learning curves and a lot going on
- for example: how do I split up IaC and application deployments? I see this question asked over. I want to be able to use this project to **show** people how it can be done

5. To encourage others (in the CDK, Terraform and Pulumi communities) to share complete and non-trivial examples of IaC software **in use** with an actual application.

- There are many ways one could create "IaC Rosetta Stone" (`public cloud providers x CI/CD providers x IaC tools` is a big number)
- This takes a lot of effort and time

6. I have nothing to sell you

- So many articles about Cloud/DevOps are trying to sell you a tool. Outside of what I consider to be mainstream, dominant vendors like GitHub and AWS, there are no products that I'm promoting here. I'm also not trying to sell anyone on using my IaC packages. Hopefully my IaC packages can serve as helpful reference or starting point.

7. Walk before running

- I want to build up confidence with vanilla without getting too fancy
- With a solid foundation in these tools, I want to learn about some of the more advanced patterns teams are adopting (Pulumi Automation API, Terragrunt for Terraform, self-mutating CDK Pipelines)

8. 12 Factor App, DevOps and Platform Engineering

- 12 Factor App is great, and has guided how I approach both Django application development and IaC library development
- The [platformengineering.org](https://platformengineering.org/) has so good guiding principles

## A quick overview of terminology for context

### constructs, modules and components

A CDK construct, Terraform module and Pulumi component generally mean the same thing: an abstract grouping of one or more cloud resources.

- CDK: constructs and stacks
- Terraform: modules (and stacks) [discuss.hashicorp.com/t/what-is-a-terraform-stack/31985](https://discuss.hashicorp.com/t/what-is-a-terraform-stack/31985)
- Pulumi: components and stacks

In this article I will refer to **constructs/modules/components** as **c/m/c** for short, and the term **stack** can generally be used to refer to either a CloudFormation stack, a Pulumi Stack or a Terraform group of resources that are part of a module that has had `apply` ran against it.

### What is a stack?

Constructs and Components are similar, but Constructs map to CloudFormation and the Pulumi components I'm using from the `@pulumi/aws` package generally map directly to Terraform resources from the AWS Provider ()

For the pulumi/aws package, the components generally map directly onto Terraform modules.

[Transformations](https://www.pulumi.com/docs/intro/vs/terraform/) are unique to Pulumi.

## Infrastructure as Code library repos

Let's look at the three repos that I wrote for deploying the same type of 3-tier web application to AWS using ECS Fargate with both CDK, Terraform and Pulumi.

- terraform-aws-django
- pulumi-aws-django
- cdk-django

### Language

`cdk-django` and `pulumi-aws-django` are both written in TypeScript. `terraform-aws-django` is written in HCL.

### Versions

Here are the versions of CDK, Terraform and Pulumi and related dependencies that I'm using at the time of writing:

- CDK
- Terraform
- Pulumi

### Release management and publishing

`pulumi-aws-django` and `terraform-aws-django` both use `release-please` for automatically generating a changelog file and bumping versions.

`cdk-django` uses `projen` for maintaining the changelog and bumping versions and publishing to npm.

### Makefile and local development

Each repo has a Makefile that includes commands that I frequently use when developing new features or fixing bugs. Each repo has commands for the following:

- synthesizing CDK to CloudFormation / running `terraform plan` / previewing pulumi up for both the base and app stacks
- creating/updating an ad-hoc base environment called `dev`
- destroying all resources in the ad-hoc base environment called `dev`
- creating an ad-hoc app environment called `alpha` that uses resources from `dev`
- destroying an ad-hoc app environment called `alpha` that uses resources from `dev`

### ad-hoc vs prod

- the last article I wrote was about ad hoc environments. Also known as "on-demand" environments or "preview" environments.
- the motivation for ad-hoc environments is speed and cost
- you can completely ignore "ad-hoc" environments and use the "prod" infrastructure for any number of environments (such as dev, QA, RC, stage and prod)
- prod can be used for prod and any number of pre-prod environments
- multiple environments built with "prod" infrastructure can be configured with a "knobs and dials" (e.g., how big are app and DB instances, how many tasks to run in a service, etc.)
- the "prod" infrastructure should be the same for the "production" environment and the "staging" environment

### Directory structure

The directory structures for each repo are all similar with some minor differences.

There are two types of environments: `ad-hoc` and `production`. Within ad-hoc and production, there are two directories `base` and `app`.

Each repo has a directory called `internal` which contain building blocks used by the modules/components/constructs that are exposed. The contents of the `internal` directories are not intended to be used by anyone who is using the libraries.

**CDK construct library repo structure**

```
~/git/github/cdk-django$ tree -L 4 -d src/
src/
├── constructs
│   ├── ad-hoc
│   │   ├── app
│   │   └── base
│   ├── internal
│   │   ├── alb
│   │   ├── bastion
│   │   ├── customResources
│   │   │   └── highestPriorityRule
│   │   ├── ecs
│   │   │   ├── iam
│   │   │   ├── management-command
│   │   │   ├── redis
│   │   │   ├── scheduler
│   │   │   ├── web
│   │   │   └── worker
│   │   ├── rds
│   │   ├── sg
│   │   └── vpc
│   └── prod
│       ├── app
│       └── base
└── examples
    └── ad-hoc
        ├── app
        │   └── config
        └── base
            └── config
```

**Terraform module library repo structure**

```
tree -L 3 -d .
.
├── CHANGELOG.md
├── Makefile
├── NOTES.md
├── README.md
├── examples
│   ├── ad-hoc
│   │   ├── app
│   │   └── base
│   └── prod
│       ├── app
│       └── base
├── local.tfvars
├── logs.txt
└── modules
    ├── ad-hoc
    │   ├── app
    │   └── base
    ├── internal
    │   ├── app
    │   ├── autoscaling
    │   ├── bastion
    │   ├── celery_beat
    │   ├── celery_worker
    │   ├── ecs
    │   ├── elasticache
    │   ├── iam
    │   ├── lb
    │   ├── management_command
    │   ├── rds
    │   ├── redis
    │   ├── route53
    │   ├── s3
    │   ├── sd
    │   ├── sg
    │   └── web
    └── prod
        ├── app
        └── base
```

**Pulumi component library repo structure**

```
~/git/github/pulumi-aws-django$ tree -L 3 src/
src/
├── components
│   ├── ad-hoc
│   │   ├── README.md
│   │   ├── app
│   │   └── base
│   └── internal
│       ├── README.md
│       ├── alb
│       ├── bastion
│       ├── cw
│       ├── ecs
│       ├── iam
│       ├── rds
│       └── sg
└── util
    ├── index.ts
    └── taggable.ts
```

**Pulumi examples directory**

```
~/git/github/pulumi-aws-django$ tree -L 3 examples/
examples/
└── ad-hoc
    ├── app
    │   ├── Pulumi.alpha.yaml
    │   ├── Pulumi.yaml
    │   ├── index.ts
    │   ├── node_modules
    │   ├── package-lock.json
    │   ├── package.json
    │   └── tsconfig.json
    └── base
        ├── Pulumi.yaml
        ├── bin
        ├── index.ts
        ├── package-lock.json
        ├── package.json
        └── tsconfig.json

```

There is a balance to be found between single stacks vs micro stacks.
Both the base and app modules/components/constructs could be split out further. For example, the `base` modules/components/constructs could be split into `networking` and `rds`. The `app` stack could be split into different ECS services so that their infrastructure can be deployed independently.

The rule of thumbs are:

- single stacks are bad because you don't want to put all your eggs in one basket, however your IaC tool should give you confidence about what is going to change when you try to make a change
- Lots of small stacks can cause overhead and make things more complex than they need to be

### CLOC

Let's use CLOC (count lines of code) to compare the lines of code used in the `c/m/c` of CDK/CloudFormation/Terraform/Pulumi.

**`cdk-django`**

```

~/git/github/cdk-django$ cloc src/constructs/
      14 text files.
      14 unique files.
       0 files ignored.

github.com/AlDanial/cloc v 1.94  T=0.04 s (356.1 files/s, 30040.9 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
TypeScript                      13            155             59            908
Python                           1             18              8             33
-------------------------------------------------------------------------------
SUM:                            14            173             67            941
-------------------------------------------------------------------------------
```

**`terraform-aws-django`**

```
~/git/github/terraform-aws-django$ cloc modules/
      66 text files.
      62 unique files.
       5 files ignored.

github.com/AlDanial/cloc v 1.94  T=0.11 s (587.6 files/s, 32772.6 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
HCL                             59            539            207           2685
Markdown                         3              7              0             20
-------------------------------------------------------------------------------
SUM:                            62            546            207           2705
-------------------------------------------------------------------------------
```

**`pulumi-aws-django`**

```
~/git/github/pulumi-aws-django$ cloc src/components/
      15 text files.
      15 unique files.
       0 files ignored.

github.com/AlDanial/cloc v 1.94  T=0.11 s (134.5 files/s, 12924.2 lines/s)
-------------------------------------------------------------------------------
Language                     files          blank        comment           code
-------------------------------------------------------------------------------
TypeScript                      13            110            176           1119
Markdown                         2              6              0             30
-------------------------------------------------------------------------------
SUM:                            15            116            176           1149
-------------------------------------------------------------------------------
```

### Examples

Each repo contains examples of how to use the respective module/component/construct libraries. These examples allow me to make changes in my local repo and then deploy stacks from my computer (as opposed to using GitHub Actions).

## Communities

- CDK.dev
- Pulumi Slack
- Terraform Discourse Forum

## μblog

μblog is a micro blogging application that I have written using Django and Vue.js.

### Mono-repo structure

It lives in a GitHub mono repo called `django-step-by-step`. This mono repo contains a few different things:

- backend Django application
- frontend Vue.js application
- IaC code that uses c/m/c from `cdk-django`, `terraform-aws-django` and `pulumi-aws-django`
- GitHub Actions workflows for both Infrastructure deployments and application deployments

μblog is the reference application that I deploy to infrastructure created with CDK, Terraform and Pulumi. μblog is meant to represent a generic application uses:

- gunicorn for a backend API
- Vue.js for a client that consumes the backend API
- celery for async task processing
- celery beat for scheduling tasks
- Postgres for relational data
- Redis for caching and message brokering (and maybe websocket backend)
- S3 for object storage
- Django admin for a simple admin interface

There is a lot more I could add on μblog. For now I'll just mention that it:

- has a great local development environment (supports both docker-compose and virtual environments)
- demonstrates how to use Django in different ways. It implements the same application using Function Based View and Class Based Views, and implements both a REST API (both with FBV and CBV) and GraphQL.
- GitHub Actions for running unit tests
- k6 for load testing
- contains a documentation site deployed to GitHub pages (made with VuePress) can be found here: [https://briancaffey.github.io/django-step-by-step/](https://briancaffey.github.io/django-step-by-step/)

# Infrastructure Deep Dive

Let's go through each of the `c/m/c`s used in the three libraries. I'll cover some of the organizational decisions, dependencies and differences between how things are done between CDK, Terraform and Pulumi.

I'll first talk about the two stacks used in ad hoc environments: `base` and `app`. Then I'll talk about the prod environments which are also composed of `base` and `app` stacks.

Keep in mind that there aren't that many differences between the ad hoc environment base and app stacks and the prod environment app and base stacks. A future optimization could be to use a single base and app stack, but I think there is a tradeoff between readability and DRYness of infrastructure code, **especially with Terraform**. In general I try to use very little conditionals with Terraform code. It is much easier to have dynamic configuration in CDK and Pulumi, and probably also for other tools like CDKTF (that I have not yet tried).

## Splitting up the stacks

While it is possible to put all resources in a single stack with both Terraform, CDK and Pulumi, it is not recommended to do so.

- Terraform enables this with outputs and `terraform_remote_state`
- Pulumi encourages the use of [micro stacks](https://www.pulumi.com/docs/guides/organizing-projects-stacks/)
- CDK has an article on how to [create an app with multiple stacks](https://docs.aws.amazon.com/cdk/v2/guide/stack_how_to_create_multiple_stacks.html)

The modules

Also, on-demand environments really lends itself to stacks that are split up.

https://docs.aws.amazon.com/cdk/v2/guide/resources.html See the section "Passing unique identifiers"

## Ad hoc base overview

Here's an overview of the resources used in an ad hoc base environment

### VPC

The VPC is the first resource that is create as part of the `base` stack.
- There official, high-level constructs in each IaC tool for building VPCs and all related networking resources.

- `awsx` has a VPC module
- `terraform-aws-vpc` module
- L2 VPC Construct in CDK

The setting in the Terraform VPC module `one_nat_gateway_per_az = false` doesn't seem to exist on the `awsx.ec2.Vpc` module. This will add to cost savings since it will use 1 NAT Gateway instead of 2.

### Security Groups

Pulumi and Terraform can be used in a similar way to define security groups. CDK has a much more concise way of defining ingress and egress rules for security groups.

```
TODO
# Pulumi Example

# Terraform example

# CDK example
```

### Load Balancer Resources

There's not much to comment on here. In each library I have resource group that defines the following:

- Application Load Balancer
- A default target group
- An HTTP listener that redirects to HTTPS
- An HTTPS listener with a default "fixed-response" action

Properties from these resources are used in the "app" stack to build listener rules for ECS services that are configured with load balancers, such as the backend and frontend web services.

Ad hoc app environments all share a common load balancer from the base stack that they use.

### RDS Resources

All three libraries have the RDS security group and Subnet Group in the same `c/m/c` as the RDS instance. The SG and DB Subnet group could alternatively be grouped closer to the other network resources.

Currently the RDS resources are part of the "base" stack for each library. A future optimization may be to break the RDS instance out of the "base" stack and put it in its own stack. The "RDS" stack would be dependent on the "base" stack, and then "app" stack would then be dependent on both the "base" stack and the "RDS" stack. More stacks isn't necessarily a bad thing, but for my initial implementation of these libraries I have decided to keep the "micro stacks" approach limited to only 2 stacks for an environment.

## Ad hoc app overview

The ad hoc app is an group of resources that powers an on-demand environment that is meant to be short lived for testing, QA, validation, demos, etc. To build

### ECS Cluster

- This is a small component that defines both ECS Cluster and the default capacity providers
- It defaults to not using `FARGATE_SPOT`; ad hoc environments do use `FARGATE_SPOT` for cost savings

https://docs.aws.amazon.com/cdk/api/v1/docs/@aws-cdk_aws-ecs.CapacityProviderStrategy.html

> NOTE: defaultCapacityProviderStrategy on cluster not currently supported.



### Shared environment variables

- Struggled to get this right in pulumi. A lot of Pulumi examples used `JSON.stringify` for containerDefinitions in task definitions. I was able to get help from the Pulumi Slack channel; someone recommended that I use `pulumi.jsonStringify` which was added in a relatively recent version of `pulumi/pulumi`.

- CDK allows you to declare environment variables for a containerDefinition like `{ FOO: "bar" }`
- Pulumi and Terraform require that values are passed like `{ name: "FOO", value: "bar"}`
- You could transform `{ FOO: "bar" }` into the name/value format, but I didn't bother to do this
- extra env vars in Terraform to allow for dynamically passing extra environment variables

### Route53 Record

This is pretty straightforward in each library. Each ad hoc environment gets a Route 53 record, and listener rules for the web services (Django and Vue.js SPA) match on a combination of the host header and path patterns.

This part is pretty opinionated in that it assumes you want to host the frontend and backend services on the same URL. For example, requests matching `example.com/api/*` are routed to the backend API and all other requests matching `example.com/*` are routed to the frontend service.

### Redis

I go into more depth about why I run a Redis instance in an ECS service in my other article. This is only for the ad hoc environments. Production environments will be configured with ElastiCache for managed Redis.

I decided to not make this service use any persistent storage. It may be a good idea to not use FARGATE_SPOT for this service, since restarts to the redis service could cause issues in ad hoc environments. For example, you may get a lot of celery errors in ad hoc environments if redis is not reachable.

### Web Service

The web service is what defines the main Django application as well as the frontend website (JavaScript SPA or SSR site). I designed the Web Service resources group to be able to support both traditional Django apps (powered by templates), or for Django apps that service only a limited number of endpoints. This `c/m/c` has an input parameter called `pathPatterns` which determines which paths it serves. For example, you Django container may serve traffic for `/api/*` and `/admin/*` only, or it may want to serve all traffic (`/*`).

The way I use these components in ad hoc and prod environments is heavily opinionated in that it:

- assumes that the frontend SPA/SSR site should have a lower priority rule than the backend service and should route request paths matching `/*`, while the backend service routes requests for a specific list of path patterns (`/api/*`, `/admin/*`, `/graphql/*`, etc.).

You may want Django to handle most of your routes and 404 pages, in which case you would want the SPA to only handle requests matching certain paths. This would require some more consideration and careful refactoring.

### Celery

- The reason for having a celery service is to be able to have potentially multiple workers that scale independently
- I use the same Pulumi component for both works and schedulers

The terminology for this resource group could be better. Celery is one of many options for running async task workers, so it should probably be called something like `AsyncWorker` across the board rather than using the term `celery`.

### Management Command

- Defines a task that can be used to run commands like `collectstatic` and `migrate`
- These tasks are ran both after the initial `app` stack deployment and before rolling application upgrades

### Passing data between stacks

Pulumi uses stack references, Terraform uses remote state and CDK uses Stack Outputs or Stack References

```
# CDK example

# Terraform example

# Pulumi example
```



## Design Principles

Terraform, Pulumi and CDK all do a good job of providing extensive examples covering different languages, cloud resource types and (for Terraform and Pulumi) different cloud providers.

Here are some examples of official examples:

- CDK examples
- Terraform examples
- Pulumi examples

## CLI scaffolding

CDK and Pulumi have some good options for how to scaffold a project.

- Pulumi has `pulumi new aws-typescript` among lots of other options (run `pulumi new -l` to see over 200 project types)
- CDK has `projen` CLI commands which can help set up either library code or project code
- The major benefits of these tools is setting up `tsconfig.json` and `package.json` correctly
- Terraform is so simple that it doesn't really need tooling for this

Across the three project I have created lots of package.json files. Each

For `terraform-aws-django`, I tried to follow the recommendations from [terraform-best-practices.com](https://www.terraform-best-practices.com/) which helped me a lot with things like consistent naming patterns and directory structures. Two recommendations I followed carefully:

- use the name `this` for resources in a module where that resource is the only resource of its type
- avoid using nested modules

I think CDK and Pulumi lend themselves to more nesting and abstractions because they can be written in more familiar programming languages with better abstractions, function, loops, classes, etc., so there are some differences in directory structure of my libraries when comparing Terraform to both CDK and Pulumi.

## Environment configuration

Environment configuration allows for either a base or app stack to be configured with non-default values. For example,

- you may decide to start a new base environment but you want to provision a powerful database instance class and size. You would change this using environment configuration
- You might want to create an ad hoc app environment but you need it to include some special environment variables, you could set these in environment config.

In the examples above, our IaC can optionally take environment configuration values that overwrite default values, or extend default values.

- Pulumi defines environment-specific config in files called `Pulumi.{env}.yaml` ([Pulumi article on configuration](https://www.pulumi.com/docs/intro/concepts/config/))
- Terraform uses `{env}.tfvars` for this type of configuration
- CDK has several options for this type of configuration (`cdk.context.json`, extending stack props, etc.)

For CDK I have been using `setContext` and the `tryGetContext` and `getContext`. Pulumi has similar

Environment configurationI have tried to use sensible defaults for the ad hoc environments.

Ad hoc app environments are configured

## Local development

Using the Makefile targets in each library repo, my process for developing c/m/c involves making code changes followed by Makefile targets that preview/plan/diff against my AWS account, then running deploy/apply/up and waiting for things to finish deploying. Once I can validate that things are looking correct in my account, I run the destroy command and make sure that all of the resources are removed successfully. RDS instances can take up to 10 minutes to create, which means that the base stack takes some time to test. The app environment is able to be spun up quickly, but it can sometimes get stuck and take some time to delete services.

Here are some sample times for deploying ad hoc stacks with CDK, Terraform and Pulumi.

```
# CDK ad hoc base deployment time

 ✅  ExampleAdHocBaseStack (dev)

✨  Deployment time: 629.64s

# CDK ad hoc app deployment time

 ✅  ExampleAdHocAppStack (alpha)

✨  Deployment time: 126.62s

# Terraform sample time

# Pulumi sample time
```

Here are some examples of what the diff/plan/preview commands show:

```
# CDK synth

# Terraform plan

# Pulumi preview
```

## Running infrastructure pipelines in GitHub Actions

- pulumi action
- terraform commands (wrapper)
- CDK commands

Pulumi has [a great article](https://www.pulumi.com/docs/guides/continuous-delivery/github-actions/) about how to use their official GitHub Action. This action calls the Pulumi CLI under the hood with all of the correct flags.

For CDK I am currently running the raw CLI calls, and same for Terraform.

## Application deployments

- There are two GitHub Actions pipelines for deploying the frontend and the backend. Both of these pipelines run bash scripts that call AWS CLI commands to perform rolling updates on all of the services used in the application (frontend, API, workers, scheduler)

- The backend deployment script runs database migrations, the `collectstatic` command and any other commands needed to run before the rolling update starts (clearing the cache, loading fixtures, etc.)

- What is important to note here is that application deployments are not dependent on the IaC tool we use. Since we are tagging things consistently across CDK, Terraform and Pulumi, we can look up resources by tag rather than getting "outputs" of the app stacks.

## Interacting with AWS via IaC

- CDK interacts directly with CloudFormation (and custom resources which allow for running arbitrary SDK calls and lambda functions) and provides [L1, L2 and L3 constructs](https://docs.aws.amazon.com/cdk/v2/guide/constructs.html) which offer different levels of abstraction over CloudFormation.
- Terraform has the [AWS Provider](https://registry.terraform.io/providers/hashicorp/aws/latest/docs) and the [`terraform-aws-modules`](https://registry.terraform.io/namespaces/terraform-aws-modules).
- Pulumi has AWS Classic (`@pulumi/aws`) **provider** and `AWSx` ([Crosswalk for Pulumi](https://www.pulumi.com/registry/packages/awsx/)) **library** and `aws_native` **provider**.

> `aws_native` "manages and provisions resources using the AWS Cloud Control API, which typically supports new AWS features on the day of launch."

`aws_native` looks like a really interesting option, but it is currently in public preview so I have not decided to use it.

I am using the AWSx library only for my VPC and associated resources, everything else uses the AWS Classic provider.

For CDK I use mostly L2 constructs and some L1 constructs.

Fot Terraform I use the VPC from the `terraform-aws-modules`, and everything else uses the AWS Terraform Provider.

## What I did not put in IaC

- ECR
- ACM

## Completion

CDK Terraform Pulumi

Local Ad Hoc Base P C T
Local Ad Hoc App  P   T
GHA Ad Hoc Base
GHA Ad Hoc App
Local Prod Base
Local Prod App
GHA Prod Base
GHA Prod App

## Tagging

- Terraform and CDK both make it easy to automatically tag all resources in a stack
- It is possible to do this in Pulumi, but you need to write a little bit of code.
- [https://www.pulumi.com/blog/automatically-enforcing-aws-resource-tagging-policies/](https://www.pulumi.com/blog/automatically-enforcing-aws-resource-tagging-policies/)
- [https://github.com/joeduffy/aws-tags-example/tree/master/autotag-ts](https://github.com/joeduffy/aws-tags-example/tree/master/autotag-ts)
- Tagging is important since I look up resources by tag in GitHub Actions pipelines (for example, the Bastion Host is looked up by tag)

## Next steps

Here are some of the next things I'll be working on in these project, in order of importance:

- Introduce manual approvals in GitHub Actions and allow for the previewing or "planning" before proceeding with an live operations in infrastructure pipelines
- For Pulumi and Terraform, use a Secrets Manager secret for the database instead of hardcoding it. Use the `random` functions to do this
- Refactor GitHub Actions and make them reusable across different projects
- Writing tests for Pulumi and CDK. Figure out how to write tests for Terraform modules
- Use graviton instances and have the option to select between different architectures
- Standardize all resources names
- The Pulumi components that define the resources associated with each ECS service are not very dry
- Interfaces could be constructed with inheritance (base set of properties that is extended for different types of services)
- Make all three of the libraries less opinionated about how the application as a whole. Celery worker and scheduler should be optional, the frontend component should also be optional
- experiment with using a frontend with SSR. This is supported by Quasar, the framework I'm currently using to build my frontend SPA site.

## Sharing

- my personal blog (briancaffey.github.io)
- DEV.to
- Ops Community
- Medium
- Substack
- My MailChimp mailing list
- Hacker News
- Twitter
- LinkedIn
- Facebook
- HashNode
- Hackernoon
- Reddit (r/aws, r/Terraform, r/pulumi, r/django, r/devops)
- Terraform Forum
- Pulumi Slack channel
- CDK.dev Slack channel
