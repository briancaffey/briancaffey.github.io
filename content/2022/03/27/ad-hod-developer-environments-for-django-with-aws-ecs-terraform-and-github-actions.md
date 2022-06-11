---
title: Setting up ad hoc development environments for Django applications with AWS ECS, Terraform and GitHub Actions
date: '2022-05-27'
description: This article will show how software development teams can build on-demand environments for dog-food testing, quality review, internal and external demos and other use cases that require short-lived but feature-complete instances of a web application.
image: /static/adhoc.png
tags:
  - django
  - terraform
  - github-actions
  - aws
  - ecs
  - containers
  - docker

draft: true

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

comments: true
---

## tl;dr

This article will show how software development teams can build on-demand instances of a web application project for dog-food testing, quality review, internal and external demos and other use cases that require short-lived but feature-complete environments. It will focus on the technical implementation of building ad hoc environments using a specific set of tools (including AWS ECS, Terraform and GitHub Actions). I will also be giving context on high-level implementation decisions based on what I think are best practices guided by the [12-Factor Application methodology](https://12factor.net/). If any of this interests you, please have a read and let me know what you think in the comments on the outlets where I'll be sharing this article (links at the end).

## GitHub Links

This article references three open-source code repositories on GitHub.

- [django-step-by-step](https://github.com/briancaffey/django-step-by-step)
  - this repo contains an example microblogging application called μblog built with Django
  - the same application is implemented as a traditional Model Template View (MTV) site, a decoupled REST API and Javascript web application and a GraphQL API
  - it is a monorepo that also includes a frontend Vue.js application, CI/CD pipelines, a VuePress documentation site as well as tooling and instructions for settings up a local development environments (both with and without docker)
  - it includes a complete set of GitHub Action examples for automating the processes of creating, updating and destroying ad hoc environments that will be an important part of what is covered in this article

- [terraform-aws-django](https://github.com/briancaffey/terraform-aws-django)
  - a collection of modules for running Django applications on AWS using Terraform
  - one of the submodules can be used for creating ad hoc environments which will be what we use to create ad hoc environments
  - this module has been published to Terraform Registry and is used in the `terraform/live/ad-hoc` directory of the `django-step-by-step` repo

- [terraform-aws-ad-hoc-environments](https://github.com/briancaffey/terraform-aws-ad-hoc-environments)
  - a Terraform module that provides shared infrastructure used by ad hoc environments (including VPC, RDS instance, bastion host, security groups and IAM roles, etc.)
  - this module has also been published to Terraform Registry and is also used in `django-step-by-step`
  - this module is designed to be used with the `terraform-aws-django` Terraform module

## Assumptions

There are all sorts of applications, and all sort of engineering teams. For some context on what I'm describing in this article, here are some basic assumptions that I'm making about the type of engineering team and software application product that would be a good fit for this type of development workflow.

- engineering team is composed of a backend team, a frontend team, a devops team and works closely with a product team
- backend team primarily develops a REST API
- frontend team develops a JavaScript SPA (frontend website)
- SPA consumes backend REST API
- product team frequently needs to demo applications to prospective clients
- development teams don't have deep expertise in infrastructure, containers, CI/CD or automation
- devops team has been tasked with building automation that will allow anyone on the team to quickly spin up a complete environment for testing and demoing purposes within minutes

Here are assumptions about specific tools and technologies used at the company:

- backend is a REST API developed with Django and a Postgres database
- backend is packaged into a docker container
- frontend is also packaged into a docker container using multi-stage builds and NGINX
- frontend does not require any build-time configuration (all configuration needed by frontend is fetched from backend)
- backend application's configuration is driven by plain-text environment variables at run-time
- engineering team uses AWS
- automation pipeline exists for building, tagging and pushing backend and frontend container images to an ECR repository
- devops team uses AWS ECS for running containerized workloads
- devops team uses Terraform for provisioning infrastructure
- devops team uses GitHub Actions for building automation pipelines
- team is somewhat cost-conscious

## What are ad hoc environments?

Ad hoc environments are short-lived environments that are designed to be used for testing a specific set of features or for demoing a specific application configuration in an isolated environment. It is intended to be a functional duplicate of the main production environment. An ad hoc environment is the first cloud environment that the application code will be deployed to after a developer has been working on it in a local development environment.

## Trade-offs to make when designing ad hoc environment infrastructure and automation

Now that we have a sense of what we are building and the team we are working with, let's think about the high-level trade-offs that we will face as we build a solution for providing on-demand ad hoc environments. When building infrastructure and workflows for ad hoc environments, there are a few things to solve for:

- simplicity of the end-user interface and process for requesting an ad hoc environment
- startup speed
- total cost of ownership
- degree of similarity to production environments
- shared vs isolated resources
- automation complexity

Let's look at these items by considering how we can set up the main infrastructure components that will be used to run our ad hoc application environments.

### Relational Databases

Startup speed can be measured by the time between when an environment is requested and when that environment can be used by whoever requested it. In this period of time, an automation pipeline may do some of the following:

- run `terraform init`, `terraform plan` and `terraform apply` to build infrastructure
- run scripts to prepare the application such as database migrations
- seeding initial sample data with a script or database dump
- message the user with information about the environment (URLs, commands for accessing an interactive shell, etc.)

RDS instances can take a long time to create relative to other AWS resources such as S3 buckets and IAM roles. RDS instances are also more costly than other resources. We could use a single, shared RDS instance placed in a private subnet of a shared VPC. Each ad hoc environment could use a different named database in the RDS instance in the form `{ad-hoc-env-name}-db`. Using one RDS instance per ad hoc environment would be slow to startup and tear down and also costly if there are many developers using ad hoc environments simultaneously.

If we choose to isolate the application's relational database at the database level (and not the RDS instance level), then we will need our automation workflow to create a database per ad hoc environment.

Let's spin up a simple example to illustrate how this would would work.

- A developer is working on `feature-abc` that involves a significant refactor of the data model.
- The developer decides to spin up an ad hoc environment called `feature-abc`.
- Our automation will need to create a database in the RDS instance called `feature-abc`.
- We can configure a bastion host with `psql` installed that has network and security group access to our RDS instance, and we can give our GitHub Actions an SSH key that can be used to run `createdb` over SSH.
- The automation also runs database migrations once the application has started, and we can view the logs of the database migration to check for any irregularities or other issues.
- This will give the developer and the rest of team confidence that the promoting `feature-abc` to the next pre-production environments will not have any errors.
- The developer may even choose to load a SQL dump of the next pre-production environment into their `feature-abc` database get even more confidence that there will be no data integrity errors.
- When the developer's PR is merged and approved, the ad hoc environment `feature-abc` can be destroyed, including the `feature-abc` database in the shared RDS instance.

With this approach we won't incur the costs of multiple RDS instances. Ad hoc environments will start up faster because an RDS instance per environment is not required. We do have slightly less resource isolation, and we need to introduce a bastion host, but I consider this an acceptable trade-off.

### Redis (key-value database)

Redis is another database used in the application and it plays a few different roles:

- primarily, it is a caching layer that can cache request responses to reduce load on the database and speed up our application
- it is a message broker for our async task workers (celery)
- it can be used as a backend for other 3rd party Django apps that our main application may need to use (such as django-constance, cache-ops, django-channels, etc.)

AWS offers a managed Redis service called ElastiCache. Redis running on an ElastiCache instance can do database isolation similar to how Postgres running on RDS can do database isolation as we discussed previously, but there are some key differences:

- redis databases are numbered, not named
- the backend application uses isolated numbered databases for the different 3rd party apps that I just mentioned (for example: celery can use database `0`,  API caching layer can use database `1`, etc.)

This makes it difficult to use a single ElastiCache instance for our ad hoc environments since we would need to figure out which numbered database to assign to a specific role for each ad hoc environment (e.g. how do we know which numbered database to use for the API caching for the `feature-abc` ad hoc environment).

So how can we approach providing isolated redis instances for multiple ad hoc environments? Spoiler: my solution is to run redis as a stateful service in ECS. Before we dig into how to do this, we need to talk about another important part of our application: compute.

### Compute

Our backend application is composed of a few different services that all share the same code base. In other words, our backend's services uses the same docker image but run different processes for each component:

- gunicorn for the core API
- celery for the task workers
- celerybeat for task scheduling

If our application used websockets, we could have another service that runs an asgi server process (like daphne or uvicorn).

Since our backend application is packaged into a container and we are using AWS as our cloud provider, ECS is a great choice for running our backend services. ECS is a container orchestration tool that I usually describe as a nice middle ground between docker swarm and Kubernetes. Simply put, it is a flexible option for running our containerized services that make up our backend application.

With ECS you can choose to run containers directly on EC2 instances that you manage, or you can run containers using Fargate. Fargate is a serverless compute option that takes care of managing both the underlying "computer" and operating system that run our application's containers. All of our backend dependencies are defined in our Dockerfile, so we do not to maintain or update the underlying operating system that runs our containers -- AWS handles all of this for us. To use Fargate, we simply tell AWS which containers to run and how much CPU and memory to use in the ECS Task that runs the containers. To scale our app horizontally, the ECS service that managed ECS tasks simply increases the number of tasks that run.

Since we are going to use the Fargate launch type for our ECS Tasks, let's talk about the ergonomics of these serverless compute instances compared to running our services directly on an EC2 instances.

- We can't SSH into Fargate compute instance. We can instead use AWS Systems Manager and EcsExec to open an interactive shell in a running backend container. This can be useful for developers who might need to run a management command or access an interactive Django shell to verify behavior in their ad hoc environment.

- We can't simply change code on the server and restart services. This can sometimes be a useful pattern for debugging something that can only be tested on a cloud environment (e.g. something that can't easily be reproduced on your local machine), so this requires that developers push new images to their backend services for every change they want to see reflected on their ad hoc environment. Later on I'll discuss how we can provide tooling for developers to quickly update the image used in their backend services.

With AWS Fargate, you will pay more than you would for a comparable amount of CPU and memory on EC2 instances. Similar to EC2 spot instances, Fargate offers interruptable instances called Fargate Spot which costs significantly less than regular Fargate instances. Fargate spot is appropriate for our ad hoc environments since ad hoc environments are non-critical workloads. In the event that a Fargate spot instance is interrupted, the ECS service will automatically launch another Fargate task to replace the task that was stopped.

In my opinion, ECS with Fargate is ideal for running the stateless services that make up our backend application. In terms of parity with our production environment, we can keep almost everything the same, except use regular Fargate instances instead of Fargate spot instances.

### Redis, revisited

We can run redis as an ECS service instead of using ElastiCache. In order to do this, we will need our backend services (gunicorn, celery and celerybeat) to be able to communicate with a fourth ECS service that will be running redis (using an official redis image from Docker Hub, or a redis image that we define in ECR).

By default, **there is no way for our backend services to know how to communicate with any other service in our ECS cluster**. If you have used docker-compose, you may know that you can use the service name `redis` in a backend service to easily communicate with a redis service called `redis`. This networking convenience is not available to use out of the box with ECS. To achieve this in AWS, we need some way to manage a unique ad hoc environment-specific Route 53 DNS record that points to the private IP of the Fargate task that is running redis in an ECS cluster for a given ad hoc environment. Such a service exists in AWS and it is called Cloud Map. Cloud Map offers service discovery so that our backend services can make network calls to a static DNS address that will reliably point to the correct private IP of the ECS task running the redis container.

We can define a service discovery namespace (which will essentially be a top level domain, or TLD) that all of our ad hoc environments can share. Let's assume this namespace is called `ad-hoc`. Each ad hoc environment can then define a service discovery service in the shared namespace for redis that is called `{ad-hoc-env-name}-redis`. This way, we can have a reliable address that we can configure as an environment for our backend that will look like this: `redis://{ad-hoc-env-name}-redis.ad-hoc:6379/0`. `{ad-hoc-env-name-redis}.ad-hoc` will be the hostname of the redis service, and Route 53 will create records that point `{ad-hoc-env-name}-redis.ad-hoc` to the private IP of the redis Fargate task for each ad hoc environment.

### Load Balancing

We now have our backend services (gunicorn, celery and celerybeat) running on Fargate spot instances, and these services can communicate with the redis service in our ad hoc environment's ECS cluster using service discovery that we configured with Cloud Map. We still need to think about a few things:

- how will we expose our API service to the public (or private) internet
- how will we expose our frontend application to the public (or private) internet
- how will we make sure that requests go the correct ECS services

Application load balancers (ALBs) are a great way to expose web app traffic to the internet. We could either have one application load balancer per ad hoc environment, or one application load balancer shared between all ad hoc environments. ALBs are somewhat slow to create and they also incur a significant monthly cost. They are also highly scalable, so using a shared ALB for all ad hoc environments would work.

Individual ad hoc environments can then create target groups and listener rules for a shared ALB for each service that needs to serve requests from the internet (the backend and the frontend). In our case this is the backend API server and the frontend server that serves our static frontend site using NGINX.

ECS services that need to be exposed to the internet can specify the target group, port and container to use for load balancing. A target group is created that defines the health check and other settings, and a load balancer listener rule is created on the shared load balancer that will forward traffic matching certain conditions to the target group for our service.

For a given ad hoc environment, we need to specify that only traffic with certain paths should be sent to the backend service, and all other traffic should be sent to the frontend service. For example, we may only want to send traffic that starts with the path `/api` or `/admin` to the backend target group, and all other traffic should be sent to the frontend target group. We can do this by setting conditions on the listener rules that forward traffic do the frontend and backend target groups based on the hostname and path.

We want our listener rule logic to forward `/api`, `/admin` and any other backend traffic to the backend target group, and forward all other traffic (`/*`) to the frontend target group. In order to do this, we need the backend listener rule to have a higher priority than the frontend listener rule for each ad hoc environment. Since we are using the same load balancer for all ad hoc environments, the priority values for each listener rule need to be unique. If we don't set the priority explicitly, then the priority will be set automatically to the next available value in ascending order. In order to make sure that the backend listener rule has a higher priority than the frontend listener rule, we need to tell Terraform that the frontend module `depends_on` the backend module. This way that backend listener rule will have a higher priority (e.g. priority of 1) because it will be created first, and the frontend listener rule will have a lower priority (e.g. priority of 2).

## More on shared resources vs per-environment resources

Up until now we have discussed infrastructure design decisions at a high level, but we have not yet talked about how to organize our infrastructure as code. At a basic level, components of our ad hoc environment either fall into shared infrastructure or infrastructure that is specific to an individual ad hoc environment. Here's a list of the resources that are shared and the resources that are specific to each ad hoc environment.

Shared resources include:

- VPC
- IAM policies
- Security groups
- RDS instance
- Service Discovery namespace
- Application Load Balancer
- Bastion host

Ad hoc environment resources include:

- ECS Cluster
- ECS Tasks and Services (for backend and frontend applications)
- ECS Tasks for running management commands (such as migrate)
- CloudWatch logging groups for containers defined in ECS Tasks
- ALB Target groups
- ALB listener rules
- Route 53 record that points to the load balancer (e.g. `ad-hoc-env-name.example.com`)
- S3 bucket for static and media assets
- Service Discovery Service for redis service in ECS cluster

Shared resources can be defined in one terraform configuration and deployed once. These resources will be long-lived as long as the application is under active development and the team requires on-demand provisioning of ad hoc environments.

Ad hoc environment resources can be defined in another terraform configuration that references outputs from the shared resource configuration using `terraform_remote_state`. Each ad hoc environment can be defined by a `<name>.tfvars` file that contains the name of the ad hoc environment (such as `brian`, `brian2`, `demo-feature-abc`, etc.). This `<name>` value will also be the name of the Terraform workspace and will be used to name and tag AWS resources associated with the corresponding ad hoc environment.

The `<name>.tfvars` file will allow developers to use a simple, standard file interface for defining application specific values, such as the version of the backend and frontend. This brings developers into the concepts and practices of "infrastructure as code" and "configuration as code" and also helps the entire team keep track of how different environments are configured.

Ad hoc environment `<name>.tfvars` files are stored in a directory of a special git repository that also defines the ad hoc environment terraform configuration. Currently, the `tfvars` files are stored [here](https://github.com/briancaffey/django-step-by-step/tree/main/terraform/live/dev).

Now let's look at the two terraform configurations used for defining shared resources and ad hoc environment resources.

## Ad Hoc Environment Diagram

Here's an overview of the resources used for the ad hoc environments. The **letters represent shared resources** and the **numbers represent per-environment resources**.

![png](/static/adhoc.png)

### Shared architecture

A. VPC (created using the [official AWS VPC Module](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest))

B. Public subnets for bastion host, NAT Gateways and Load Balancer

C. Private subnets for application workloads and RDS

D. Application Load Balancer that is shared between all ad hoc environments. A pre-provisioned wildcard ACM certificate is attached to the load balancer that is used to secure traffic for load-balanced ECS services

E. Service discovery namespace that provides a namespace for application workloads to access the redis service running in ECS

F. IAM roles needed for ECS tasks to access AWS services

G. RDS instance using postgres engine that is shared between all ad hoc environments

H. Bastion host used to access RDS from GitHub Actions (needed for creating per-environment databases)

I. NAT Gateway used to give traffic in private subnets a route to the public internet

### Environment-specific architecture

1. ECS Cluster that groups all ECS tasks for a single ad hoc environment
2. Listener rules and target groups that direct traffic from the load balancer to the ECS services for an ad hoc environment.
3. Redis service running in ECS that provides caching and serves as a task broker for celery
4. Route53 records that point to the load balancer
5. Frontend service that serves the Vue.js application over NGINX
6. API service that serves the backend with Gunicorn
7. Celery worker that process jobs in the default queue
8. Celery beat that schedules celery tasks
9. `collectstatic` task
10. `migrate` task
11. CloudWatch log groups are created for each ECS task in an ad hoc environment
12. Each ad hoc environment gets a database in the shared RDS instance


## Shared resources terraform configuration

Let's have a detailed look at the terraform configuration for shared resources that will support ad hoc environments.

![Shared AWS resources for ad hoc environment](/image/shared-resources.png)

### VPC

We can use the [AWS VPC module](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest) for creating the shared VPC with Terraform. This module provides a high level interface that will provision lots of the components that are needed for a VPC following best practices, and it is less code for the DevOps team to manage compared to defining each component of a VPC (route tables, subnets, internet gateways, etc.).

### Cloud Map Service Discovery Namespace

Cloud Map is used in order to allow services in our ECS cluster to communicate with each other. The only reason that Cloud Map is needed is so that the backend services (API, celery workers, beat) can communicate with Redis, which will be an important service for our application, providing caching and also serving as a broker for celery. If we were to use Django Channels for websockets, the Redis service would also function as the backend for Django Channels.

We will only need to specify `service_registries` on the redis service in our ECS cluster. What this will do is provide an address that our other services can use to communicate with redis. This address is created in the form of a Route 53 record, and it points to the private IP address of the redis service. If the private IP of the redis service is updated, the Route 53 record record for our redis service will be updated as well.

In order for service discovery to work in the VPC that we created, we need to add the following options to the terraform AWS VPC module:


    # DNS settings
    enable_dns_hostnames = true
    enable_dns_support   = true

### Security Groups

There are two important security groups that we will set up as part of the shared infrastructure layer to be used by each ad hoc environment: one security group for the load balancer, and one security group where all of our ECS services will run.

The load balancer security group will allow all traffic on port `80` and `443` for `HTTP` and `HTTPS` traffic. The ECS security group will only allow inbound traffic from the application load balancer security group.

### IAM Roles

There are two important IAM roles that we will need for our ECS tasks. We need a task execution role that our ECS tasks will use to interact with other AWS services, such as S3, Secrets Manager, etc.

### RDS Instance

We will create one RDS instance in one of the private subnets in our VPC. This RDS instance will have one Postgres database per ad hoc environment. This RDS instance has a security group that allows all traffic from our ECS security group.

### Load Balancer

We will use one load balancer for all ad hoc environments. This load balancer will have a wildcard ACM certificate attached to it (`*.dev.example.com`, for example). Each ad hoc environment will create a Route 53 record that will point to this load balancer's public DNS name. For example, `brian.dev.example.com` will be the address of my ad hoc environment. Requests to this address will then be routed to either the frontend ECS service or the backend ECS service depending on request header values that will be set on the listener rules.

By default, a load balancer supports up to 50 listener rules, so we can create plenty of ad hoc environments before we need to increase the default quota. There will be a discussion at the end of this article about AWS service quotas.

### Bastion Host

The bastion host will be created in one of the VPC's public subnets. This will primarily be used for connecting to RDS to create new databases for new ad hoc environments, or for manually manipulating data in an ad hoc environment for debugging.

## Environment-specific resources

Now that we have defined a shared set of infrastructure that our ad hoc environments will use, let's have a look at the resources that will be specific to ad hoc environments that will be added on top of the shared resources.

### ECS Cluster

The ECS Cluster is a simple grouping of ECS tasks and services.

### ECS Tasks and Services

Each environment will have a unique collection of ECS tasks and services that will be used to run the application.

There are four important ECS services in our application that are used to run "long-running" ECS tasks. Long-running tasks are tasks that start processes that run indefinitely, rather than running until completion. The long-running tasks in our application include:

- backend web application (gunciron web server)
- backend celery worker
- backend celery beat
- frontend web site
- redis

The infrastructure code also defines some tasks that are not long-running but rather short lived tasks that run until completion and do not start again. These services include:

- collectstatic
- database migrations
- any other ad-hoc task that we want to run, usually wrapped in a Django management command

### ALB Listener Rules and Target Groups

These two resources work together to expose certain ECS tasks to the internet. The pattern used to do this involves:

- creating an `aws_lb_target_group` that define a `health_check`, references a VPC and a port
- defining a `load_balancer` block on an `aws_ecs_service` resource that references the `aws_lb_target_group`
- an `aws_lb_listener_rule` rule is defined to forward traffic matching certain hostname, path or header values that we define to the `aws_lb_target_group`

### Route 53 record

The Route 53 resource we create for ad hoc environment will define a subdomain that will use for the ad hoc environment, such as `brian.example.dev` (where `example.dev` is a domain name used internally by the DevOps team). The load balancer created as part of the shared resources will have a wildcard certificate that will give us secure connections for URLs following the pattern `*.example.dev`.

### S3 bucket

An S3 bucket will be provisioned per ad hoc environment. This S3 bucket will store both static files as well as media uploads (images).

### Database within RDS instance

We will create one database in our RDS instance per ad hoc environment for data isolation.

### terraform_remote_state

[`terraform_remote_state`](https://www.terraform.io/language/state/remote-state-data) is a feature of terraform that will allow us to separate the shared infrastructure terraform configuration ([link]()) from the ad hoc environment terraform infrastructure ([link]()).

Our terraform configuration for ad hoc environments will define variables that will be provided by `terraform_remote_state` that will reference values from our shared resource terraform configuration. This is what that looks like in Terraform code:

```hcl
```

## How to setup an ad hoc environment

Now that we have been over the resources that will be created to support our ad hoc environments, let's talk about how we can enable individuals on our team to create and update ad hoc environments.

### Design decisions

The devops team will decide on the interface that will be used for creating an ad hoc environment. Since we are using Terraform, this interface will be a Terraform configuration. The minimum amount of information that our ad hoc environment configuration needs is image tags for the frontend and backend images to use. Other configurations will be provided by default values set in `variables.tf`, and these defaults can easily be overridden by passing values to `terraform plan` and `terraform apply`. I'm choosing to use `<name>.tfvars` as the way to pass configuration values to our ad hoc environments where `<name>` is the name of the ad hoc environment being created. This will give us the following benefits:

- all ad hoc environments will be visible to the entire team in git since each ad hoc environment will have a `<name>.tfvars` file associated with it
- adding additional customization to an ad hoc environment does not add additional complexity to our automation pipeline since all customization is added through a single file that will be referenced by `$WORKSPACE.tfvars`

The downsides of this approach are:

- creating ad hoc environments requires knowledge of git, so non-technical product team members might need help from the engineering team when setting up an ad hoc environment
- there is an additional "manual" step of creating a `<name>.tfvars` file that must be done before running a pipeline to create an ad hoc environment

Provided that a `<name>.tfvars` file has been created and pushed to the correct branch (`main`, for example) of our "live" Terraform repo, creating or updating an ad hoc environment will be as simple as running a pipeline in GitHub Actions that specifies the `<name>` of our ad hoc environment. If no such `<name>.tfvars` file exists, our pipeline will fail.

### GitHub Action

Creating ad hoc environments will involve manually triggering a GitHub Action that runs on `workflow_dispatch`:

    on:
      workflow_dispatch:
        inputs:
          workspace:
            description: 'Name of terraform workspace to use'
            required: true
            default: 'dev'
            type: string

We only have to enter the name of the ad hoc environment we want to create or update. The ad hoc environment name is used as the Terraform workspace name. This name is also the name of the `<name>.tfvars` file that must be created per environment.

This workflow will do `terraform init`, `terraform plan` and `terraform apply` using the `<name>.tfvars` file. When everything has been created, we will use the AWS CLI to prepare the environment so that it can be used. We will use the `aws ecs run-task` command to run database migrations needed so that the application code can interact with the database.

## How to update code in an existing ad hoc environment

Assuming that we have deployed an ad hoc environment called `brian` with version `v1.0.0` of the backend application and `v2.0.0` of the frontend application, let's think about the process of updating the application to `v1.1.0` of the backend and `v2.1.0` of the frontend.

The simplest approach to updating the application would be edit the `brian.tfvars` file with the new versions:

    # brian.tfvars
    be_image_tag = "v1.1.0"
    fe_image_tag = "v2.1.0"

If we run the same pipeline that we initially used to deploy ad hoc environment (with `terraform init`, `terraform plan` and `terraform apply`) against the updated `brian.tfvars` file, this will result in a rolling update of the frontend and backend services ([more on rolling updates here](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-ecs.html)).

If there are database migrations included in the new version of the code that is going out, we need to run database migrations after the `terraform apply` completes. We use a top level output from the ad hov environment terraform configuration that is a `run-task` command with all appropriate arguments that will run database migrations when called from GitHub Actions.

### Order of Operations

For ad hoc environments, it is probably fine to update the services and then run the database migrations. Ad hoc environments may only have a single "user" -- the developer, so **we don't need to worry about any errors that may occur if requests are made against the new version of code before database migrations have been applied**.

Let's consider a simple example to illustrate what can go wrong here. If we add a `total_views` to our blog post model to track the total number of page views a post has, we would add a field to the model, generate migration file with `makemigrations`, and then update our views and model serializers to make use of this new field. In the time between updating our service and running the database migrations, any requests to endpoints that access the new database field will fail since the table does not yet exist.

If we first run database migrations **and then** update application code (ECS services), then we can avoid errors about fields not existing. In our production application, we want to aim for fewer errors, so we should be using this "order of operations": first run new database migrations and then update application code.

### GitHub Action for application updates

We need a GitHub Action that can do the following:

- fetch the current container definition JSON files for each backend tasks (`aws ecs describe-task-definition`)
- write new container definitions JSON with the new backend image tag
- register new task definitions with the new container definition JSON files for each task (`aws ecs register-task-definition`)
- call run-task with the newly updated migration ECS task (`aws ecs run-task`)
- wait for the task to exit and display the logs
- update the backend services (gunicorn, celery, celery beat) (`aws ecs update-service`)
- wait for the new backend services to be stable (`aws ecs wait services-stable`)

Here's a visual representation of the backend update process:

![png](/static/adhoc/ad_hoc.backend_update.drawio.png)

In order have the correct arguments for all of the AWS CLI calls used in the above workflow, we can use the AWS CLI to fetch resource names by tag.

We should also consider the following:

- the GitHub Action should call a script that runs the steps described above instead of writing the script directly in the GitHub Action itself. This will make debugging easier and will also make it easier to setup automation pipelines using a tool other than GitHub Actions if we choose to do so later
- how do we structure this script? should it be one big script, or can we break out each step into small scripts? we should try to use KISS and DRY principles

Here is what I'm using for the script. There lots of comments, so please refer to those comments for an explanation of what the script is doing.

```bash
#!/bin/bash

# This script will be called to update an ad hoc environment backend
# with a new image tag. It will first run pre-update tasks (such as migrations)
# and then do a rolling update of the backend services.

# It is called from the ad_hock_backend_update.yml GitHub Actions file

# Required environment variables that need to be exported before running this script:

# WORKSPACE - ad hoc environment workspace
# SHARED_RESOURCES_WORKSPACE - shared resources workspace
# BACKEND_IMAGE_TAG - backend image tag to update services to (e.g. v1.2.3)
# AWS_ACCOUNT_ID - AWS account ID is used for the ECR repository URL

echo "Updating backend services..."

# first define a variable containing the new image URI
NEW_BACKEND_IMAGE_URI="$AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/backend:$BACKEND_IMAGE_TAG"


# register new task definitions
# https://docs.aws.amazon.com/cli/latest/reference/ecs/describe-task-definition.html#description
for TASK in "migrate" "gunicorn" "default" "beat"
do
  echo "Updating $TASK task definition..."

  # in Terraform we name our tasks based on the ad hoc environment name
  # (also the Terraform workspace name) and the name of the task
  # (e.g. migrate, gunicorn, default, beat)
  TASK_FAMILY=$WORKSPACE-$TASK

  # save the task definition JSON to a variable
  TASK_DESCRIPTION=$(aws ecs describe-task-definition \
    --task-definition $TASK_FAMILY \
  )

  # save container definitions to a file for each task
  echo $TASK_DESCRIPTION | jq -r \
    .taskDefinition.containerDefinitions \
    > /tmp/$TASK_FAMILY.json

  # write new container definition JSON with updated image
  echo "Writing new $TASK_FAMILY container definitions JSON..."

  # replace old image URI with new image URI in a new container definitions JSON
  cat /tmp/$TASK_FAMILY.json \
    | jq \
    --arg IMAGE "$NEW_BACKEND_IMAGE_URI" '.[0].image |= $IMAGE' \
    > /tmp/$TASK_FAMILY-new.json

  # Get the existing configuration for the task definition (memory, cpu, etc.)
  # from the variable that we saved the task definition JSON to earlier
  echo "Getting existing configuration for $TASK_FAMILY..."

  MEMORY=$( echo $TASK_DESCRIPTION | jq -r \
    .taskDefinition.memory \
  )

  CPU=$( echo $TASK_DESCRIPTION | jq -r \
    .taskDefinition.cpu \
  )

  ECS_EXECUTION_ROLE_ARN=$( echo $TASK_DESCRIPTION | jq -r \
    .taskDefinition.executionRoleArn \
  )

  ECS_TASK_ROLE_ARN=$( echo $TASK_DESCRIPTION | jq -r \
    .taskDefinition.taskRoleArn \
  )

  # check the content of the new container definition JSON
  cat /tmp/$TASK_FAMILY-new.json

  # register new task definition using the new container definitions
  # and the values that we read off of the existing task definitions
  echo "Registering new $TASK_FAMILY task definition..."

  aws ecs register-task-definition \
    --family $TASK_FAMILY \
    --container-definitions file:///tmp/$TASK_FAMILY-new.json \
    --memory $MEMORY \
    --cpu $CPU \
    --network-mode awsvpc \
    --execution-role-arn $ECS_EXECUTION_ROLE_ARN \
    --task-role-arn $ECS_TASK_ROLE_ARN \
    --requires-compatibilities "FARGATE"

done

# Now we need to run migrate, collectstatic and any other commands that need to be run
# before doing a rolling update of the backend services

# We will use the new task definitions we just created to run these commands

# get the ARN of the most recent revision of the migrate task definition
TASK_DEFINITION=$( \
  aws ecs describe-task-definition \
    --task-definition $WORKSPACE-migrate \
    | jq -r \
    .taskDefinition.taskDefinitionArn \
)

# get private subnets as space separated string from shared resources VPC
SUBNETS=$( \
  aws ec2 describe-subnets \
    --filters "Name=tag:env,Values=$SHARED_RESOURCES_WORKSPACE" "Name=tag:Name,Values=*private*" \
    --query 'Subnets[*].SubnetId' \
    --output text \
)

# replace spaces with commas using tr
SUBNET_IDS=$(echo $SUBNETS | tr ' ' ',')

# https://github.com/aws/aws-cli/issues/5348
# get ecs_sg_id - just a single value
ECS_SG_ID=$( \
  aws ec2 describe-security-groups \
    --filters "Name=tag:Name,Values=$SHARED_RESOURCES_WORKSPACE-ecs-sg" \
    --query 'SecurityGroups[*].GroupId' \
    --output text \
)

echo "Running database migrations..."

# timestamp used for log retrieval (milliseconds after Jan 1, 1970 00:00:00 UTC)
START_TIME=$(date +%s000)

# run the migration task and capture the taskArn into a variable called TASK_ID
TASK_ID=$( \
  aws ecs run-task \
    --cluster $WORKSPACE-cluster \
    --task-definition $TASK_DEFINITION \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$ECS_SG_ID],assignPublicIp=ENABLED}" \
    | jq -r '.tasks[0].taskArn' \
  )

echo "Task ID is $TASK_ID"

# wait for the migrate task to exit
# https://docs.aws.amazon.com/cli/latest/reference/ecs/wait/tasks-stopped.html#description
# > It will poll every 6 seconds until a successful state has been reached.
# > This will exit with a return code of 255 after 100 failed checks.
aws ecs wait tasks-stopped \
  --tasks $TASK_ID \
  --cluster $WORKSPACE-cluster

# timestamp used for log retrieval (milliseconds after Jan 1, 1970 00:00:00 UTC)
END_TIME=$(date +%s000)

# print the CloudWatch log events to STDOUT
aws logs get-log-events \
  --log-group-name "/ecs/$WORKSPACE/migrate" \
  --log-stream-name "migrate/migrate/${TASK_ID##*/}" \
  --start-time $START_TIME \
  --end-time $END_TIME \
  | jq -r '.events[].message'

echo "Migrations complete. Starting rolling update for backend services..."

# update backend services
for TASK in "gunicorn" "default" "beat"
do

  # get taskDefinitionArn for each service to be used in update-service command
  # this will get the most recent revision of each task (the one that was just created)
  # https://docs.aws.amazon.com/cli/latest/reference/ecs/describe-task-definition.html#description
  TASK_DEFINITION=$( \
    aws ecs describe-task-definition \
      --task-definition $WORKSPACE-$TASK \
      | jq -r \
      .taskDefinition.taskDefinitionArn \
  )

  # update each service with new task definintion
  aws ecs update-service \
    --cluster $WORKSPACE-cluster \
    --service $WORKSPACE-$TASK \
    --task-definition $TASK_DEFINITION \
    --no-cli-pager

done

echo "Services updated. Waiting for services to become stable..."

# wait for all service to be stable (runningCount == desiredCount for each service)
aws ecs wait services-stable \
  --cluster $WORKSPACE-cluster \
  --services $WORKSPACE-gunicorn $WORKSPACE-default $WORKSPACE-beat

echo "Services are now stable. Backend services are now up to date with $BACKEND_IMAGE_TAG."

echo "Backend update is now complete!"
```

With this GitHub Actions workflow, a developer can now easily change the version of backend code that is running in their ad hoc environments without needing to involve Terraform.

### Using `ignore_changes` in the definitions

There is one more important point to make about Terraform before we conclude this discussion on updating backend code for existing ad hoc environments. Consider the scenario where a developer has launched an ad hoc environment with backend version `v1.0.0`. They make a small change to the backend code and push version `v1.0.1`. Next, the developer remember that a backend environment variable needs to be changed. This can be done by updating their `*.tfvars` file. If they now re-run the ad hoc environment update pipeline **without also updating the backend version in their `*.tfvars` file**, then their code will be reverted from `v1.0.1` to `v1.0.0`. We would need to coordinate version changes between updating the backend with the pipelines that use Terraform commands and the pipelines that use the AWS CLI commands.

There is a setting on the `aws_ecs_service` resource in Terraform we can can use to prevent this from happening. This setting is called [`ignore_changes`](#TODO-add-link-to-ignore-changes-documentation) and is defined under the resource's `lifecycle` configuration block. With this setting, when we update the `*.tfvars` file with our new environment variable value, we will create another recent task definition with the same `v1.0.0` image, but the ECS service will not update in response to this change (that's what the `ignore_changes` is for). Once we make the `*.tfvars` file update and redeploy using the Terraform pipeline, nothing on our ad hoc changes, but we did get a new task definitions defined in our AWS account for each backend service. When we go to make the backend update with the pipeline that uses AWS CLI commands, the most recent task revision is used to create the new task definition, so it will include the environment variable change that we added earlier.

### Frontend updates

The process described above is needed for updating the backend application. Updating the frontend application involves a similar process to the backend update:

- fetch the container definition JSON for the frontend tasks (`aws ecs describe-task-definition`)
- write new container definition JSON with the new frontend image tag
- register new task definitions with the new container definition JSON file for the frontend task (`aws ecs register-task-definition`)
- update the frontend service (`aws ecs update-service`)
- wait for the new backend services to be stable (`aws ecs wait services-stable`)

## Options for ad hoc environment settings

At the very minimum, our ad hoc environments need to know what versions of the frontend and backend application to use (the image tag for the frontend and backend images that have been pushed to ECR).

- [ ] Public or private - do you want anyone on the internet to be able to access your ad hoc environment, or should the environment only be accessible over a private VPN connection. A `public` boolean could default to `false`, and you could have the environment only available

- [ ] Custom environment variables

### S3 backend resources and ECR repositories

We first want to set up an S3 backend that we can use for storing our Terraform state files as well as ECR repositories for storing the images used for the frontend and backend components of our application. There are a few ways to do this:

1. Set things up manually (not recommended)
2. Set things up using Terraform (this is what I'm doing currently)
3. Set things up using a CloudFormation template
4. Use Terraform Cloud

I'll be using option 2. This is sometimes referred to as "bootstrapping". When using CDK for IaC, you will do something similar that sets up S3 buckets and ECR repositories used to manage the assets used for application deployment.

Have a look at [this README.md file](https://github.com/briancaffey/django-step-by-step/blob/main/terraform/bootstrap/README.md) for more information about bootstrapping a Terraform S3 backend.

We can use the `make tf-bootstrap` command from the `django-step-by-step` GitHub repo to do this. Before running `make tf-bootstrap`, we need to copy the `bootstrap.tfvars.template` file to `bootstrap.tfvars` and add values for `region` and `backend_name`. Setting up these resources takes just a few seconds.

### Set up shared infrastructure

The next step is to setup shared infrastructure components that our ad hoc environments will use. We will use the S3 backend that was setup in the previous step to store the Terraform state for our shared resources. The shared resources is configured with a dedicated Terraform module that I have published to the Terraform Registry ([link](https://registry.terraform.io/modules/briancaffey/ad-hoc-environments/aws/latest)). The git repo for this Terraform module contains a simple example (located in [`examples/simple`](https://github.com/briancaffey/terraform-aws-ad-hoc-environments/tree/main/examples/simple)) that I use to set up the shared resources.

We will need to provide a `backend.config` file that will be used to configure the S3 backend where we will store the terraform state for the shared resources.

This terraform configuration will not be updated frequently, so there is no GitHub Actions pipeline that will be used for updating and deploying the shared resources. For larger infrastructure teams, it might make sense to build a GitHub Actions pipeline for introducing changes to the shared resources rather than deploying from a local machine.

The shared resources terraform configuration requires two inputs:

- `certificate_arn`: the ARN of a pre-provisioned wildcard ACM certificate that will be used to provide secure connections to the shared load balancer over the public internet. (My approach to ad hoc environments assumes that the environments can be accessed over the public internet without a VPN connection, but your requirements may be different)
- `key_name`: the name of a pre-existing EC2 key pair name that will be used to access the bastion host from GitHub Actions. We need this in order to create databases in our RDS instance per ad hoc environment

### Setting up an ad hoc environment

Now that we have set up shared resources, we can start

## Spin everything down

To get rid of all of the AWS resources used to support ad hoc environments, we need to delete the following:

- all ad hoc environments
- shared resources
- S3 bucket and dynamodb table that were used to store terraform state

### Delete ad hoc environment

This can be done by running the `terraform destroy` GitHub Actions job with the name of the ad hoc environment to be destroyed.

### Delete shared resources

Currently this can be done from the command line using the `make examples-simple-destroy` Makefile command in the `terraform-aws-ad-hoc-environments` repo.

### Delete the S3 bucket and DynamoDB table that are used to store and lock state files

This can be done from the `django-step-by-step` repo using the `make tf-bootstrap-destroy` command.


## State management & resource lifecycle

Let's take a look at the way that state is stored and shared between different components of our ad hoc environment setup.

## Diagram

Here's a diagram that shows both where state is stored as well as the lifecycle of resources used in ad hoc environments.

![png](/static/adhoc/lifecycle.drawio.png)

## High level overview of lifecycle (A - F)

### `A`: bootstrapped S3 backend for terraform state

These resource are long lived and they provide the ability to store Terraform state (a JSON object that described what is deployed to our AWS account) as well as Elastic Container Registry repos that store builds of our frontend and backend application.

### `B`: deploy shared resources for ad hoc environments

Ad hoc environments share resources. This helps keeps startup speeds low and also helps to keep costs down.

### `C`: launch (or update) ad hoc environments

Ad hoc environments can be launched by developers for testing a feature, or setting up an environment for a product demo. The same process used for launching a new environment can be used for updating an existing environment. Application versions can be updated through updating Terraform, or through a GitHub Action that makes a series of AWS CLI calls to make rolling updates to ECS services. This is triggered by a manual GitHub Action.

### `D`: destroy an ad hoc environment

Once an ad hoc environment is no longer needed, it can be destroyed by running another GitHub Action with the name of the ad hoc environment to destroy as the only input.

### `E`: destroy shared resources

If ad hoc environments are no longer needed altogether, then the shared resources can be deleted as they incur costs.

### `F`: destroy bootstrap resources

Once all ad hoc environments and shared resources are removed, the S3 backend resource can also be removed.

## Ad hoc infrastructure component and process details (1 - 25)

### `1`: `make tf-bootstrap`

This command does a `terraform init / plan / apply` to create the S3 backend resources needed for storing state files for both shared infrastructure and per-environment resources (using Terraform workspaces).

### `1`: S3 backend Terraform configuration

[Link](https://github.com/briancaffey/django-step-by-step/tree/main/terraform/bootstrap) to this Terraform configuration.

### `1`: S3 bucket for S3 backend

The S3 bucket that is used to store Terraform state files. The bucket name is provided in `bootstrap.tfvars`.

### `1`: DynamoDB lock table

More information about state locking can be found [here](https://www.terraform.io/language/settings/backends/s3#dynamodb-table-permissions).

### `1`: ECR resources

The bootstrap terraform configuration includes Elastic Container Registry repos used for storing frontend and backend application container images that will be used in the ECS clusters for each ad hoc environment.

### `1`: S3 backend outputs

The S3 backend Terraform configuration has Terraform outputs that can be used

### `1`: Terraform state file for S3 backend

The state file that stores the state for our AWS resources that store state for our ad hoc environments is stored on my local machine. This is not ideal, but the S3 backend resource are fairly simple and will not be changed as we use and develop our ad hoc environment infrastructure setup. Also, these resources can easily be delete manually from the AWS console.

### `1`: `make examples-simple` for setting up shared resources

`make examples-simple` is a Makefile command from the `briancaffey/terraform-aws-ad-hoc-environments` repo. Like `tf-bootstrap`, it also wraps `terraform init / plan / apply` commands, but for another Terraform configuration.

### `1`: `terraform-aws-ad-hoc-environments` Terraform module on Terraform Registry

The `terraform-aws-ad-hoc-environments` module has been published to the Terraform Registry and can be viewed [here](https://registry.terraform.io/modules/briancaffey/ad-hoc-environments/aws/latest).

### `1`: VPC module

### `1`: AWS Cloud Map

### `1`: EC2 instance (bastion host)

### `1`: RDS instance

### `1`: Application Load Balancer

### `1`: IAM resources

### `1`: ECS roles

### `1`: Shared resources state file

### `1`: `workflow_dispatch`

### `1`: `create_update_ad_hoc_env` GitHub Action

### `1`: Ad hoc environment name

### `1`: `terraform-aws-django` Terraform module

[Link](https://registry.terraform.io/modules/briancaffey/django/aws/latest) to the `terraform-aws-django` module on the Terraform Registry.

### `1`: ECS cluster

One ECS cluster is created for each ad hoc environment. The ECS cluster resources is is a grouping of ECS services and tasks.

### `1`: ECS services

The application uses the following ECS services for ad hoc environments:

- `gunicorn` - web server process for the API
- `celery` - web worker that processes tasks
- `celery beat` - job scheduler that creates tasks for celery workers to process
- `nginx` - for serving the frontend application
- `redis` - a stateful service that is used for application data caching and brokering tasks

### `1`: S3 bucket for ad hoc environment

Each ad hoc environment will have a dedicated S3 bucket for storing static and media files. In the context of the example application we are running, these files are all image files

### `1`: ALB Listener Rules

There is a single load balancer shared across all ad hoc environments. Each ad hoc environments has associated listener rules that route requests based on the path to the correct application

### `1`: Postgres database in RDS instance

Each ad hoc environment uses a dedicated postgres database that lives in an RDS instance that is shared by all ad hoc environments.

### `1`: Redis

Redis is a key-value database that is used for application data caching and brokering tasks. Running redis as an ECS service is an alternative to using a managed ElastiCache instance per ad hoc environment.

### `1`: Service Discovery Service (CloudMap)

In order for our backend application containers to communicate with the Redis ECS service, we need to set up a Service Discovery service for Redis. This will maintain an internal Route 53 record that points to the private IP of the Fargate Task that runs the redis container.

### `1`: `terraform-remote-state`

[`terraform-remote-state`](https://www.terraform.io/language/state/remote-state-data) is used to share state between two Terraform configurations. For example, the endpoint of the RDS instance needs to shared from the shared resources Terraform Configuration to the ad hoc environment configuration.

### `1`: `destroy_ad_hoc_env`

### `1`: `make examples-simple-destroy`

### `1`: `make tf-bootstrap-destroy`

### `1`: `briancaffey/django-step-by-step` GitHub repo

### `1`: `briancaffey/terraform-aws-django` GitHub repo

### `1`: `briancaffey/terraform-aws-ad-hoc-environments` GitHub repo

### Google Drive link to this draw.io diagram

[Google Drive link to this diagram](https://drive.google.com/file/d/1Te427LEPSlGinEfncH39gArHxwB1cMp0/view?usp=sharing). It is view-only, but you can duplicate it and edit the copy.

## Future improvements, open questions and next steps

- Least privilege (for roles used in automation)

### Keeping track of ad hoc environments

We need to think about how we can keep track of our active ad hoc environments. Active environments will incur additional AWS costs, and we do not want developers or the product team to create lots of environments and then leave them running without actively using them.

We may decide to have some long-lived ad hoc environments, but those would be managed primarily by the DevOps team and respective owners (e.g. QA, product team, etc.).

One way to check the active ad hoc environments would be to use the AWS CLI. We could list the ECS clusters in our development account, and this would show the number of ad hoc environments running. We could go farther and list the ad hoc environments by when they were last updated. We could then request developers or team members to remove ad hoc environments that are not in use.

Or we could have a policy that all ad-hoc environments are deleted automatically at the end of each week.

### Terraform Tooling: Terragrunt and Terraform Cloud

- Testing Terraform Code
- Testing GitHub Actions

### More secure way of defining RDS username and password

Currently the postgres database does not have a secure password. It is both hardcoded in the module as a default value and it will also be saved in plaintext in the Terraform state file.

### Backend application update script

The script used for updating the backend application could be improved or broken up into multiple scripts to better handle errors and failures that happen during the pipeline. The script runs several different commands and could potentially fail at any step, so it would be nice to improve the error messages so that both developers and DevOps teams can more quickly diagnose pipeline failures.

### Repository Organization

One minor improvement would be to move the `terraform` directory out of the `django-step-by-step` monorepo into a dedicated repo. We may also want to move GitHub Actions for creating, updating and destroying environments to this new repo. For early stage development, using a single repository that stores both application code and Terraform configuration works, but it would be better keep these separate at the repository level as the project grows. One reason for this is that we don't want lots of small commits to `*.tfvars` files to pollute the commit history of our main Django application.

### Multiple AWS Accounts

Everything shown here uses a single AWS account for everything: ECR images, Terraform remote state storage, all shared resource environments and all ad hoc environments. For a demonstration of this workflow one account keeps things simple, but in practice it would be beneficial to use multiple AWS accounts for different purposes. This would also involve more carefully planned IAM roles for cross-account resource access.

### Modules for stable environments to be used for long-lived pre-production and production environments

This article looked at how to make tradeoffs between costs, speed of deployment and production parity in ad hoc environments. I'm interested in building a new set of modules that can be used to set up environments that:

- are more stable and more long-lived
- have less resource sharing (dedicated RDS and ElastiCache resources)
- implement autoscaling for load-testing (or maybe implement autoscaling for ad hoc environments)
- can be used to perform load testing
- have enhanced observability tooling

These environments might be used as part of a QA process that does a final sign-off on a new set of features scheduled for deployment to production environments, for example.

## Conclusion

This wraps up the tour of my ad hoc environment infrastructure automation.

## TODOs

A list of things that need to be fixed or added to this article

- [ ] Mention CloudFormation template as an option for managing S3 backend resources [link](https://www.bti360.com/mng-terraform-state-cloudformation/)
- [ ] [https://discuss.hashicorp.com/t/setup-terraform-github-action-fails-during-init-before-while-managing-workspaces-in-terraform-cloud/29659/2](https://discuss.hashicorp.com/t/setup-terraform-github-action-fails-during-init-before-while-managing-workspaces-in-terraform-cloud/29659/2)

### Important TODOs

- [ ] Detail the repository secrets that must be added to GitHub in order for GitHub Actions to work for shared resources environments and ad hoc environments
  - [ ] AWS Key Pair to be used on bastion host
  - [ ] ACM certificate
  - [ ] AWS Region
  - [ ] S3 Backend bucket name
  - [ ] Other environment variables that will be available for all GitHub Action jobs
  - [ ] AWS Credentials

- [ ] Fix Workspace issues once and for all
  - [ ] Delete all ad hoc environments and all shared resources environments
  - [ ] Delete all state from the S3 bucket in order to start from scratch
  - [ ] Create two files for shared resources environments and make sure they can both be created
  - [ ] Draft a post on the forum about the workspace configuration issues I'm having in order to make sure that I have tried everything
  - [ ] The shared resources and ad hoc environments should be able to be created without errors about workspace configuration

### Notes about TF_WORKSPACE

- It can override selections made using the `terraform workspace` commands
- If you set the TF_WORKSPACE environment variable to an empty or new configuration, then there will be issues

- [ ] Add parameters to names of GitHub Actions runs (version numbers, env names for shared resources, ad hoc environment names)

- [x] Add collectstatic and migrate commands to GitHub Actions workflow via run-task command (with logs)
- [ ] Create a combined Django management command that can be used for database mgirations and collectstatic commands

### Backend Service update process

- [ ] Build and push whenever a tag is pushed?

### Implement Frontend Service Update

- [ ] Add GitHub Actions workflow
- [ ] Update Existing Build and Push frontend workflow to use git tag
- [ ] Build client version into client and display it on UI

## Meta

- [ ] Look into using bastion host for EcsExec commands instead of running EcsExec from local machine
- [x] Remove as many env vars as possible (ECR repo names - use AWS account number and interpolate)
- [ ] Least privilege for AWS credentials used in automation and those used by developers. Give roles only the permissions to do what they need to do any nothing more.
