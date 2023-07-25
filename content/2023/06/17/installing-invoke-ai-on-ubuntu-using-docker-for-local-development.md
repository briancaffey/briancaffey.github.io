---
title: Installing InvokeAI on Ubuntu using docker for local development
date: '2023-06-17'
description: Installing InvokeAI on Ubuntu using docker for local development
# image: /static/iac_rosetta_stone_og_image.png
tags:
  - invokeai
  - ai
  - docker

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

Mount the hard drive:

```
sudo mount -t ntfs /dev/sda2 /media/brian/
```

TODO: mount this drive at startup

Install NVIDIA runtime

```
apt-get install nvidia-container-runtime
```

Using Ubuntu 23.04, I did the following:

```
distribution=ubuntu22.04
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey    | sudo apt-key add -    && curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | sudo tee /etc/apt/sources.list.d/nvidia-docker.list
```

(There is not official support for 23.04, see here: https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/nvidia-docker.html#installing-on-ubuntu-and-debian)


