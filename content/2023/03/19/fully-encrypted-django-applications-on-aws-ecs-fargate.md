---
title: Fully encrypted Django applications on AWS ECS Fargate
date: '2023-03-19'
description: "Building and deploying fully encrypted Django applications on AWS ECS Fargate"
# image: /static/iac_rosetta_stone_og_image.png
tags:
  - django
  - encryption
  - aws
  - gunicorn
  - nginx
  - ecs
  - fargate
  - rds
  - s3

draft: true

# external:
#   - link: https://news.ycombinator.com/item?id=34291336
#     site: hn
#   - link: https://www.reddit.com/r/aws/comments/105vo53/my_infrastructure_as_code_rosetta_stone_deploying/
#     site: reddit
#   - link: https://dev.to/briancaffey/my-infrastructure-as-code-rosetta-stone-deploying-the-same-web-application-on-aws-ecs-fargate-with-cdk-terraform-and-pulumi-oe4
#     site: dev
#   - link: https://medium.com/@briancaffey/my-infrastructure-as-code-rosetta-stone-with-cdk-terraform-and-pulumi-44fcb8233e6a
#     site: medium
#   - link: https://briancaffey.hashnode.dev/setting-up-ad-hoc-development-environments-for-django-applications-with-aws-ecs-terraform-and-github-actions
#     site: hashnode
#   - link: https://briancaffey.substack.com/p/my-infrastructure-as-code-rosetta
#     site: substack

comments: true
---

This article demonstrates how to build fully encrypted web applications on AWS with ECS Fargate. I'll be using the Django web framework, but the concepts in this article can be implemented in any number of languages, libraries and frameworks. I'll be using Infrastructure as Code to show AWS resource configuration rather than showing how to configure things in the AWS Console. This article will expand on my last article where I build the same Django application on AWS with ECS Fargate using CDK, Terraform and Pulumi. I will be using each of these three tools to demonstrate the configuration of my fully encrypted application infrastructure.

## What is a "fully encrypted" Django application?

Here's a short definition of "fully encrypted Django application": each component of the system implements end-to-end encryption.

End-to-end encryption refers to the combination of `Encryption in Transit` and `Encryption at Rest`.

https://www.splunk.com/en_us/blog/learn/end-to-end-encryption.html#:~:text=Encryption%20at%20Rest%20refers%20to%20the%20encryption%20applied,is%20transferred%20between%20two%20nodes%20of%20the%20network.

Next, we need to think about the different components of our Django web application.

[Diagram of Web Application components](#)

The main components include:

- application load balancer (main entrypoint for traffic entering our system)
- ECS services that run the Django web server, worker nodes and task schedulers
- access patterns for opening a shell in a container over a secure connection (ECS Exec)
- RDS database store (in-transit and at-rest encryption)
  - Encrypted database fields
- Redis and ElastiCache (in-transit and at-rest encryption)
- S3 (in-transit and at-rest encryption)
- Misc Security concerns (Django's SECRET_KEY, AWS Secrets Manager, KMS, self-signed certificates, OpenSSL)

Wherever possible I'll link to official AWS Documentation that details best practices for using encrypted connections for each of these services. I'm hoping to learn a lot about some finer details of best practices when building standard Django web applications.

### Application Load Balancer

- ACM Certificate is used for the outer-most level of encryption
- Traffic from a client uses the ACM Certificate attached to the load balancer

### NGINX and Gunicorn containers

- Use an NGINX sidecar container
  - NGINX passes traffic off to gunicorn container that runs on the same task (localhost network)
- Protocol used to connect with the target is HTTPS
- Load Balancer redirects HTTP traffic to HTTPS
- Load Balancer traffic is sent to target group using HTTPS protocol
- NGINX service listens on port 443
- NGINX is configured with self-signed certificates and private key
  - The certificate and key are built into the image and are long-lived (thousands of years)
  - Created with OpenSSL (see Dockerfile, nginx.conf, v3.ext for full configuration details)
- NGINX uses `proxy_pass` to send all traffic to `localhost:8000` where the gunicorn service is listening
- For each ECS task there is one NGINX container and one gunicorn container

[https://stackoverflow.com/questions/67883155/add-custom-header-to-amazon-aws-alb-request](https://stackoverflow.com/questions/67883155/add-custom-header-to-amazon-aws-alb-request)

This SO thread says that there is no good way to add custom headers to ALB directly.

### Encrypting Gunicorn

### ECS Exec

- [https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-exec.html#ecs-exec-logging](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-exec.html#ecs-exec-logging)

> By default, the data transferred between your local client and the container uses TLS 1.2 encryption that AWS provides. To further encrypt data using your own KMS key, you must create a KMS key and add the kms:Decrypt permission to your task IAM role. This permission is used by your container to decrypt the data.

### RDS

Encryption in transit requires that the applications (database clients) use secure connections. To do this:

- clients need to have the correct file
- the database needs to have `storageEncrypted` parameter: [https://www.pulumi.com/registry/packages/aws/api-docs/rds/instance/#storageencrypted_nodejs](https://www.pulumi.com/registry/packages/aws/api-docs/rds/instance/#storageencrypted_nodejs)

- What files to add to container (2019-rds-ca, bundle, etc.)
- Build these files into the container image / EC2 machines
- Configure database to use the `ssl` setting in the Django settings

Enforcing encrypted connections to RDS instances

- Use parameter group setting to require that RDS postgres only accepts encrypted connections

- MySQL: [https://aws.amazon.com/about-aws/whats-new/2022/08/amazon-rds-mysql-supports-ssl-tls-connections/](https://aws.amazon.com/about-aws/whats-new/2022/08/amazon-rds-mysql-supports-ssl-tls-connections/) (August 2022)

- Postgres: [https://aws.amazon.com/about-aws/whats-new/2016/03/enhanced-monitoring-and-option-to-enforce-ssl-connections-is-now-available-for-amazon-rds-for-postgresql/](https://aws.amazon.com/about-aws/whats-new/2016/03/enhanced-monitoring-and-option-to-enforce-ssl-connections-is-now-available-for-amazon-rds-for-postgresql/) (March 2016)


- Get connection info with `select * from pg_stat_ssl;`

```
psql (13.9 (Debian 13.9-0+deb11u1), server 13.7)
SSL connection (protocol: TLSv1.2, cipher: ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
Type "help" for help.

postgres=>
```

After removing the `2019-rds-ca` certificate from the container the connection is still able to be established. Need to look into why this is the case


- `parameterGroupName` parameter: [https://www.pulumi.com/registry/packages/aws/api-docs/rds/instance/#state_parametergroupname_nodejs](https://www.pulumi.com/registry/packages/aws/api-docs/rds/instance/#state_parametergroupname_nodejs)


Encrypted connection from bastion host

- [Installing certificates on EC2 machines](https://stackoverflow.com/a/62283247/6084948)

### Encrypted Fields

- Beyond at-rest and in-transit encryption, we can encrypt individual fields on our database using [django-searchable-encrypted-fields](https://gitlab.com/guywillett/django-searchable-encrypted-fields)

### Redis and ElastiCache

- Two ways to run redis: ECS service (container) and managed AWS service: ElastiCache
- Both can be encrypted

### S3

- Bucket encryption
- AES256 encryption
