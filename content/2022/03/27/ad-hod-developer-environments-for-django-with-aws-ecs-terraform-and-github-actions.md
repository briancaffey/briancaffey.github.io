---
title: Setting up ad hoc development environments for Django applications with AWS ECS, Terraform and GitHub Actions
date: '2022-05-27'
description: How to use AWS to provide isolated ad hoc environments for teams developing web applications
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

This article shows how software development teams can spin up ad hoc environments for testing and demoing purposes.

## GitHub Links

This article has three corresponding code repositories on GitHub that will be referenced in this article:

- [django-step-by-step](https://github.com/briancaffey/django-step-by-step)
  - this repo contains an example microblogging application called μblog
  - includes complete GitHub Action examples for automating creation, updating and removal of ad hoc environments

- [terraform-aws-django](https://github.com/briancaffey/terraform-aws-django)
  - a Terraform module that has been published to Terraform Registry
  - includes examples of how to use the module

- [terraform-aws-ad-hoc-environments](https://github.com/briancaffey/terraform-aws-ad-hoc-environments)
  - this repo is also published to Terraform Registry
  - it provides the shared infrastructure for setting up our ad hoc environments

## Assumptions

There are all sorts of applications, and all sort of engineering teams. For some context of what I'm describing in this article, here are some basic assumptions that I'm making about a fictional application and developed by a fictional engineering team:

- engineering department has a backend team, a frontend team, a devops team and works closely with a product team
- backend team primarily develops an API
- frontend team develops an JavaScript SPA (frontend website)
- SPA consumes backend API
- product team frequently needs to demo applications to prospective clients
- development teams don't have deep expertise in infrastructure, containers, CI/CD or automation
- devops team has some knowledge of the application and is responsible for building automation that will allow anyone on the team to quickly spin up a complete environment for either testing or demoing purposes

Here are assumptions about specific tools and technologies used at the company:

- backend is a REST API developed with Django and a Postgres database
- backend is packaged into a docker container
- frontend is also packaged into a docker container using multi-stage builds and NGINX
- frontend does not require any build-time configuration (all configuration needed by frontend is fetched from backend)
- backend application's configuration is driven by plain-text environment variables at run-time
- automation pipeline exists for building, tagging and pushing backend and frontend containers to an ECR repository
- engineering team uses AWS
- devops team uses AWS ECS for running containerized workloads
- devops team uses Terraform for provisioning infrastructure
- devops team uses GitHub Actions for building automation pipelines
- team is somewhat cost-conscious

## What are ad hoc environments?

Ad hoc environments are short-lived environments that are designed to be used for testing a specific set of features or for demoing a specific application configuration in an isolated environment.

## eli5

A developer named Brian says: I want to run version 1.2.3 of the backend application and version 4.5.6 of the frontend application. That developer selects these two version values as inputs in a GitHub Action or  Jenkins pipeline or Slack chatbot and then a few moments later gets a message saying:

    Hey Brian, your environment is ready!

    visit: https://brian.dev.company.com to access the environment

    this environment will self-destruct in 1 day!

    thank you!

## Trade-offs to make when designing ad hoc environment infrastructure and automation

When building infrastructure for ad hoc environments, there are a few things to solve for:

- startup speed
- shared vs isolated resources
- costs
- automation complexity
- degree of similarity to production environments

Startup speed can be measured by the time between when an environment is requested and when that environment can be used. In this period of time, an automation pipeline may do the following:

- run `terraform init`, `terraform plan` and `terraform apply`
- run scripts to prepare the application such as database migrations
- seeding initial sample data with a script or database dump
- message the user with information about the environment (URLs, commands for accessing a bastion host or interactive shell, etc.)

Some things in AWS take more time to provision than others. RDS and ElastiCache instances can take a long time to create relative to S3 buckets or IAM roles. RDS and ElastiCache instances are also more costly than other resources. We could use a single, shared RDS instance placed in a private subnet of a shared VPC. Each ad hoc environment could use a different named database in the RDS instance in the form `{ad-hoc-env-name}-db`. We can do port forwarding from the GitHub Action script as described [here](https://itnext.io/secure-access-to-a-private-network-from-github-actions-47dab60cf37d):

    ssh -o StrictHostKeyChecking=no -t -t  \
      -i ./github_id_rsa "${SHH_USER}@${BASTION_IP}" \
      -L "3306:${MYSQL_IP}:3306" &

This would require that we have a bastion in order to access RDS in a private database. Now our setup is more complex, but the complexity is justified since we now:

- won't incur the costs of lots of RDS instances
- will start up faster because it doesn't need to create an RDS per environment
- have slightly less resource isolation (but this is an acceptable trade-off)

The postgres database is just one part of our application, and already there a few decisions that we have to make when it comes to some of the trade-offs mentioned above.

## More on shared resources vs per-environment resources

Here's a detailed overview of the resources that are shared and the resources that are specific to each ad hoc environment.

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
- CloudWatch logging groups
- ALB Target groups
- ALB listener rules
- Route53 record that point to the load balancer
- S3 bucket
- Service Discovery Service

Shared resources can be defined in one terraform configuration and deployed once. These resources will be long-lived as long as the application is under active development and the team requires on-demand provisioning of ad hoc environments.

Ad hoc environment resources can be defined in another terraform configuration that references outputs from the shared resource configuration using `terraform_remote_state`. Each ad hoc environment can be defined by a `<name>.tfvars` file that contains the name of the ad hoc environment (such as `brian`, `brian2`, `demo-feature-abc`, etc.). This `<name>` value will also be the name of the Terraform workspace and will be used to name and tag AWS resources associated with the corresponding ad hoc environment.

The `<name>.tfvars` file will allow developers to use a simple, standard file interface for defining application specific values, such as the version of the backend and frontend. This brings developers into the concepts and practices of "infrastructure as code" and "configuration as code" and also helps the entire team keep track of how different environments are configured.

Ad hoc environment `<name>.tfvars` files are stored in a directory of a special git repository that also defines the ad hoc environment terraform configuration. Currently, the `tfvars` files are stored [here](https://github.com/briancaffey/django-step-by-step/tree/main/terraform/live/dev).

Now let's look at the two terraform configurations used for defining shared resources and ad hoc environment resources.

## Diagram

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

We can use the [AWS VPC module](https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest) for creating the shared VPC with Terraform. This module provides a high level interface that will provision lots of the components that are needed for a VPC following best practices, and it is less code for the DevOps team to manage.

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
# terraform_remote_state

terraform {
  required_version = ">=1.1.7"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.4.0"
    }
  }

  backend "s3" {}
}

provider "aws" {
  region = var.region
}

# shared resources
# see https://github.com/briancaffey/terraform-aws-ad-hoc-environments

data "terraform_remote_state" "shared" {
  backend = "s3"
  config = {
    bucket = var.s3_bucket
    key    = var.key
    region = var.region
  }
}

# main

module "main" {
  source = "../../modules/ad-hoc"

  # shared resources -- taken from terraform_remote_state data source above
  vpc_id                         = data.terraform_remote_state.shared.outputs.vpc_id
  private_subnets                = data.terraform_remote_state.shared.outputs.private_subnets
  public_subnets                 = data.terraform_remote_state.shared.outputs.public_subnets
  listener_arn                   = data.terraform_remote_state.shared.outputs.listener_arn
  alb_dns_name                   = data.terraform_remote_state.shared.outputs.alb_dns_name
  service_discovery_namespace_id = data.terraform_remote_state.shared.outputs.service_discovery_namespace_id
  task_role_arn                  = data.terraform_remote_state.shared.outputs.task_role_arn
  execution_role_arn             = data.terraform_remote_state.shared.outputs.execution_role_arn
  rds_address                    = data.terraform_remote_state.shared.outputs.rds_address
  alb_default_tg_arn             = data.terraform_remote_state.shared.outputs.alb_default_tg_arn
  ecs_sg_id                      = data.terraform_remote_state.shared.outputs.ecs_sg_id

  # per environment settings -- taken from .tfvars files
  ecr_be_repo_url = var.ecr_be_repo_url
  ecr_fe_repo_url = var.ecr_fe_repo_url
  region          = var.region
  frontend_url    = var.frontend_url
  zone_name       = var.zone_name
  record_name     = var.record_name
}
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

If there are database migrations included in the new version of the code that is going out, we will need to run the database migrations after the `terraform apply` completes. One of the top level outputs of our ad hov environment terraform configuration includes a complete `run-task` command that will run our database migrations when called from GitHub Actions (or our local machine).

### Order of Operations

For ad hoc environments, it is probably fine to update the services and then run the database migrations. Ad hoc environments may only have a single "user" -- the developer, so **we don't need to worry about any errors that may occur if requests are made against the new version of code before database migrations have been applied**.

Let's consider a simple example to illustrate what can go wrong here. If we add a `total_views` to our blog post model to track the total number of page views a post has, we would add a field to the model, generate migration file with `makemigrations`, and then update our views and model serializers to make use of this new field. In the time between updating our service and running the database migrations, any requests to endpoints that access the new database field will fail since the table does not yet exist.

If we first run database migrations **and then** update application code (ECS services), then we can avoid errors about fields not existing. In our production application, we want to aim for fewer errors, so we should be using this "order of operations": first run new database migrations and then update application code.

### GitHub Action for application updates

We need a GitHub Action that can do the following:

- fetch the container definitions JSON for the backend tasks (`aws ecs describe-task-definition`)
- write new container definitions JSON with the new backend image tag
- register new task definitions with the new container definition JSON files for each task (`aws ecs register-task-definition`)
- call run-task with the newly updated migration ECS task (`aws ecs run-task`)
- wait for the task to exit and display the logs
- update the backend services (gunicorn, celery, celery beat) (`aws ecs update-service`)
- wait for the new backend services to be stable (`aws ecs wait services-stable`)

In order have the correct arguments for all of the AWS CLI calls used in the above workflow, we can fetch values from `terraform output` and save values into environment variables, and then use these value in a later stage of our GitHub Actions workflow.

The process described above is needed for updating the backend application. Updating the frontend application involves a similar process to the backend update:

- fetch the container definition JSON for the frontend tasks (`aws ecs describe-task-definition`)
- write new container definition JSON with the new frontend image tag
- register new task definitions with the new container definition JSON file for the frontend task (`aws ecs register-task-definition`)
- update the frontend service (`aws ecs update-service`)
- wait for the new backend services to be stable (`aws ecs wait services-stable`)

## How to destroy an ad hoc environment

Destroying an ad hoc environment is as simple as creating or updating an ad hoc environment. We simply provide the name of the terraform workspace and corresponding `<name>.tfvars` file and another GitHub Action will run `terraform destroy` with the correct inputs.

The `<name>.tfvars` will not be automatically deleted.

No data from the ad hoc environment will be deleted. The S3 bucket objects will be destroyed, as well as the database for the specific ad hoc environment.

## Keeping track of ad hoc environments

We need to think about how we can keep track of our active ad hoc environments. Active environments will incur additional AWS costs, and we do not want developers or the product team to create lots of environments and then leave them running without actively using them.

We may decide to have some long-lived ad hoc environments, but those would be managed primarily by the DevOps team.

One way to check the active ad hoc environments would be to use the AWS CLI. We could list the ECS clusters in our development account, and this would show the number of ad hoc environments running. We could go farther and list the ad hoc environments by when they were last updated. We could then request developers or team members to remove ad hoc environments that are not in use.

Or we could have a policy that all ad-hoc environments are deleted automatically at the end of the week.

There could be a lot of ways to track active ad hoc environments, so I won't go into more alternatives here.

## Other considerations

- [ ] Creating new databases without using SSH or bastion host

## AWS Usage Quotas

- [ ] Make sure that there are no default usage quotas that would be exceeded for some number of concurrent ad hoc environments.

## Options for ad hoc environment settings

At the very minimum, our ad hoc environments need to know what versions of the frontend and backend application to use (the image tag for the frontend and backend images that have been pushed to ECR).

- [ ] Public or private - do you want anyone on the internet to be able to access your ad hoc environment, or should the environment only be accessible over a private VPN connection. A `public` boolean could default to `false`, and you could have the environment only available

- [ ] Custom AWS tags

- [ ] Custom environment variables

## AWS Tagging

## Deploying the application from your local machine

Deploying the application from your local machine can have a faster feedback loop while developing. This allows us to iterate on the deployment pipeline before automating it in GitHub Actions or another automation platform.

In order to deploy the application, you will need to do the following:

- set up resources for an S3 backend that can be used by both the shared infrastructure and the ad hoc environments
  - this can be done with the `tf-bootstrap-*` Makefile targets in the `django-step-by-step` repo
  - take note of the S3 bucket name and dynamodb table name
  - store these in a file called `backend.config` that will be used in both the shared infrastructure deployment and the ad hoc environment deployment
- Install the AWS CLI and configure credentials with sufficient permissions (admin)
- build and push the frontend and backend application images to the ECR repositories that were set up with the `tf-bootstrap-*` commands
- Deploy base layer application
  - in the `terraform-aws-ad-hoc-environments` repo, deploy the `examples/simple` terraform configuration. This requires two inputs:
    1. the `certificate_arn` for the wildcard certificate that will be used on the shared load balancer
    2. the AWS Key Pair name that will be used for SSHing into the bastion host
  - The bucket name, region and key will be used

## Spin everything up

Starting with an empty AWS account, here is how to get ad hoc environments set up.

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

### `1`: AWS CloudMap

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

Redis is a key-value database that is used for application data caching and brokering tasks. Running redis servers as an ECS service is an alternative to using a managed ElastiCache instance per environment.

### `1`: Service Discovery Service (CloudMap)

In order for our backend application containers to communicate with the Redis ECS service, we need to set up a Service Discovery service for Redis. This will maintain an internal Route 53 record that points to the private IP of the Redis ECS service.

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

## TODOs

A list of things that need to be fixed or added to this article

- [x] rename GitHub Action to `create_update_ad_hoc_env`
- [x] rename GitHub Action to `destroy_ad_hoc_env`
- [ ] Build Route 53 resources based on ad hoc environment name (e.g. `my-env.dev.example.com`)
- [ ] Mention CloudFormation template as an option for managing S3 backend resources [link](https://www.bti360.com/mng-terraform-state-cloudformation/)
- [ ] Use Fargate Spot launch type instead of regular Fargate in order to lower costs for ad hoc environments
- [ ] Add a dedicated directory for storing `tfvars` files
