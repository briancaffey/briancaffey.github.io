---
title: Deploying InvokeAI on AWS ECS with Pulumi
date: '2023-05-29'
description: Deploying InvokeAI on AWS ECS with Pulumi
# image: /static/iac_rosetta_stone_og_image.png
tags:
  - invokeai
  - ai
  - ecs
  - efs
  - pulumi
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

This article will show how to deploy InvokeAI on AWS with ECS using Pulumi. InvokeAI is a generative AI tool that allows you to generate images.

- InvokeAI supports deploying with docker containers
- I wanted to try this but the documentation on how to do this is limited
- I have been able to set up IvokeAI on AWS by installing it directly via git, doing pip install and following instructions in their documentation
- I wanted to get more hands-on experience with ECS, GPU instances, EFS, DataSync and Pulumi

## Links

- Documentation: [https://invoke-ai.github.io/InvokeAI/](https://invoke-ai.github.io/InvokeAI/)
- Install with docker: [https://invoke-ai.github.io/InvokeAI/installation/040_INSTALL_DOCKER/](https://invoke-ai.github.io/InvokeAI/installation/040_INSTALL_DOCKER/)
- EFS Guide: [https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/tutorial-efs-volumes.html)
- Pulumi examples: [https://github.com/pulumi/examples/blob/master/aws-ts-lambda-efs/index.ts](https://github.com/pulumi/examples/blob/master/aws-ts-lambda-efs/index.ts)



```ts
import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// Create an ECS cluster
const ecsCluster = new aws.ecs.Cluster("my-ecs-cluster");

// Get the most recent Ubuntu 20.04 LTS image
const ubuntuAmi = pulumi.output(aws.ec2.getAmi({
    filters: [
        {
            name: "name",
            values: ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"],
        },
        {
            name: "virtualization-type",
            values: ["hvm"],
        },
    ],
    owners: ["099720109477"], // Canonical owner ID
    mostRecent: true,
}));

// Create a security group for the cluster
const clusterSecurityGroup = new aws.ec2.SecurityGroup("cluster-security-group", {
    ingress: [
        {
            fromPort: 0,
            toPort: 65535,
            protocol: "tcp",
            cidrBlocks: ["0.0.0.0/0"],
        },
    ],
});

// Create a launch configuration for the ASG
const launchConfiguration = new aws.ec2.LaunchConfiguration("ecs-launch-configuration", {
    imageId: "ami-xxxxxxxxxxxx",
    instanceType: "t2.micro",
    iamInstanceProfile: "<replace-with-your-iam-instance-profile>",
    associatePublicIpAddress: true,
    securityGroups: [clusterSecurityGroup.id],
    userData: `#!/bin/bash
echo ECS_CLUSTER=${ecsCluster.id} >> /etc/ecs/ecs.config`,
});

// Create an Auto Scaling Group
const autoScalingGroup = new aws.autoscaling.Group("ecs-asg", {
    desiredCapacity: 2,
    launchConfiguration: launchConfiguration.id,
    maxSize: 5,
    minSize: 1,
    tags: [
        { key: "Name", value: "my-ecs-asg", propagateAtLaunch: true },
    ],
});

// Create an ECS capacity provider
const capacityProvider = new aws.ecs.CapacityProvider("my-capacity-provider", {
    autoScalingGroupProvider: {
        autoScalingGroupArn: autoScalingGroup.arn,
        managedScaling: {
           : "ENABLED",
            targetCapacity: 75,
        },
        managedTerminationProtection: "ENABLED",
    },
});

// Add the capacity provider to the ECS cluster
const clusterCapacityProvider = new aws.ecs.ClusterCapacityProviders("ecs-cluster-capacity-providers", {
    capacityProviders: [capacityProvider.name],
    clusterName: ecsCluster.name,
});

// Export ECS cluster name
export const ecsClusterName = ecsCluster.name;
```

```ts
const targets = [];
for (let i = 0; i < subnetIds.length; i++) {
    targets.push(new aws.efs.MountTarget(`fs-mount-${i}`, {
        fileSystemId: filesystem.id,
        subnetId: subnetIds[i],
        securityGroups: [vpc.vpc.defaultSecurityGroupId],
    }));
}
const ap = new aws.efs.AccessPoint("ap", {
    fileSystemId: filesystem.id,
    posixUser: { uid: 1000, gid: 1000 },
    rootDirectory: { path: "/www", creationInfo: { ownerGid: 1000, ownerUid: 1000, permissions: "755" } },
}, { dependsOn: targets });
```
