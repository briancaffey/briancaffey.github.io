---
title: GitHub Codespaces for my GitHub Pages blog
date: '2023-04-30'
description: Notes on setting up my personal GitHub Pages blog using GitHub Codespaces
# image: /static/iac_rosetta_stone_og_image.png
tags:
  - github
  - codespaces
  - development
  - nuxt

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

## tl;dr

I'm interested in trying out GitHub Codespaces and submitting an entry to the [GitHub + DEV 2023 Hackathon](https://dev.to/devteam/announcing-the-github-dev-2023-hackathon-4ocn). This article will document my first attempt at using Codespaces. My goal is to set up a cloud development environment for my personal GitHub Pages blog ([briancaffey.github.io](https://briancaffey.github.io)) using GitHub Codespaces.

Hopefully I'll be able to show that I can edit code on github.dev and then view real-time changes on some URL that corresponds to my GitHub Codespace.

If this goes well, I'll try setting up a GitHub Codespaces for `django-step-by-step` and use that as the basis for my hackathon submission.

## Getting started

I'll start with this article: [Creating a codespace for a repository
](https://docs.github.com/en/codespaces/developing-in-codespaces/creating-a-codespace-for-a-repository?tool=vscode)

> If you're starting a new project, you might want to create a codespace from a template and publish to a repository on GitHub later.

I already have a project, which is `briancaffey.github.io`, a statically-generated site built with Nuxt and Nuxt Content.

> After you connect your account on GitHub.com to the GitHub Codespaces extension, you can create a new codespace

It looks like the first step is to install the VSCode extension.

I created a `.devcontainer/devcontainer.json` file and used [the GitHub Codespaces template for Next.js](https://github.com/github/codespaces-nextjs/blob/main/.devcontainer/devcontainer.json).


### Error starting devcontainer

```
@briancaffey ➜ /workspaces/briancaffey.github.io (master) $ yarn dev
yarn run v1.22.19
$ nuxt
ℹ Using Tailwind CSS from ~/assets/css/tailwind.css                               nuxt:tailwindcss 16:23:30
ℹ Merging Tailwind config from ~/tailwind.config.js                               nuxt:tailwindcss 16:23:30
ℹ Parsed 66 files in 6,5 seconds                                                     @nuxt/content 16:23:37

   ╭────────────────────────────────────────────────────────╮
   │                                                        │
   │   Nuxt @ v2.15.8                                       │
   │                                                        │
   │   ▸ Environment: development                           │
   │   ▸ Rendering:   server-side                           │
   │   ▸ Target:      static                                │
   │                                                        │
   │   Listening: http://172.16.5.4:3000/                   │
   │                                                        │
   │   Tailwind Viewer: http://172.16.5.4:3000/_tailwind/   │
   │                                                        │
   ╰────────────────────────────────────────────────────────╯

ℹ Preparing project for development                                                                16:23:38
ℹ Initial build may take a while                                                                   16:23:38
ℹ Discovered Components: .nuxt/components/readme.md                                                16:23:38
✔ Builder initialized                                                                              16:23:38
✔ Nuxt files generated                                                                             16:23:38

 WARN  Browserslist: caniuse-lite is outdated. Please run:                                         16:23:39
  npx browserslist@latest --update-db
  Why you should do it regularly: https://github.com/browserslist/browserslist#browsers-data-updating


● Client █████████████████████████ building (10%) 1/2 modules 1 active
 node_modules/webpack-hot-middleware/client.js

● Server █████████████████████████ building (10%) 1/1 modules 0 active


node:internal/crypto/hash:71
  this[kHandle] = new _Hash(algorithm, xofLen);
                  ^

Error: error:0308010C:digital envelope routines::unsupported
    at new Hash (node:internal/crypto/hash:71:19)
    at Object.createHash (node:crypto:140:10)
    at module.exports (/workspaces/briancaffey.github.io/node_modules/webpack/lib/util/createHash.js:135:53)
    at NormalModule._initBuildHash (/workspaces/briancaffey.github.io/node_modules/webpack/lib/NormalModule.js:417:16)
    at handleParseError (/workspaces/briancaffey.github.io/node_modules/webpack/lib/NormalModule.js:471:10)
    at /workspaces/briancaffey.github.io/node_modules/webpack/lib/NormalModule.js:503:5
    at /workspaces/briancaffey.github.io/node_modules/webpack/lib/NormalModule.js:358:12
    at /workspaces/briancaffey.github.io/node_modules/loader-runner/lib/LoaderRunner.js:373:3
    at iterateNormalLoaders (/workspaces/briancaffey.github.io/node_modules/loader-runner/lib/LoaderRunner.js:214:10)
    at Array.<anonymous> (/workspaces/briancaffey.github.io/node_modules/loader-runner/lib/LoaderRunner.js:205:4)
    at Storage.finished (/workspaces/briancaffey.github.io/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:55:16)
    at /workspaces/briancaffey.github.io/node_modules/enhanced-resolve/lib/CachedInputFileSystem.js:91:9
    at /workspaces/briancaffey.github.io/node_modules/graceful-fs/graceful-fs.js:123:16
    at FSReqCallback.readFileAfterClose [as oncomplete] (node:internal/fs/read_file_context:68:3) {
  opensslErrorStack: [ 'error:03000086:digital envelope routines::initialization error' ],
  library: 'digital envelope routines',
  reason: 'unsupported',
  code: 'ERR_OSSL_EVP_UNSUPPORTED'
}

Node.js v19.9.0
error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
@briancaffey ➜ /workspaces/briancaffey.github.io (master) $
```

Here's a SO thread that I found when search for `ERR_OSSL_EVP_UNSUPPORTED`: [https://stackoverflow.com/questions/70582072/npm-run-fails-with-err-ossl-evp-unsupported](https://stackoverflow.com/questions/70582072/npm-run-fails-with-err-ossl-evp-unsupported)

From [this documentation on environment variables](https://docs.github.com/en/enterprise-cloud@latest/codespaces/developing-in-codespaces/persisting-environment-variables-and-temporary-files#edit-the-devcontainerjson-configuration-file-for-the-repository)
 it looks like environment variables can be added

 ```json
  "remoteEnv": {
    "NODE_OPTIONS": "--openssl-legacy-provider"
 }
 ```

Changing the image to Node version 16 in `.devcontainer/devcontainer.json` got things working.

```
"image": "mcr.microsoft.com/devcontainers/javascript-node:0-18-bullseye"
```

I took a screenshot of my VSCode environment and now I'm trying to get it to display using the following syntax:

```
![png](/static/codespaces-vscode-environment.png)
```

![png](/static/codespaces-vscode-environment.png)

![png](/static/codespaces-vscode-environment-2.png)

In my VSCode application window for this repository I can see that window title ends in `[Codespaces]`. When the terminal is opened, it is opening a terminal on the remote VM where the devcontainers are running:

```
@briancaffey ➜ /workspaces/briancaffey.github.io (master) $
```

We can commit changes in git using the terminal or the VSCode UI

## Working with Codespace on my iPad

This is another major reason I wanted to try out Codespaces. Sometimes I want to go work somewhere but don't want to bring my computer. I may just have my iPad. With Codespaces I can access a consistent development environment from my computer or my iPad without the need to install any local tools or dependencies. Here's a screenshot that I took on my iPad, saved to Files on my iPad, and then drag-and-dropped int the directory tree VSCode running in Safari. Cool!

![GitHub Codespaces running on my iPad](/static/codespaces-on-ipad.png)

### Next steps

My personal blog is a fairly simple application and the Codespaces configuration is relatively straightforward. Next, I want to see if I can setup one of my open-source projects with Codespaces that significantly more complex.

`django-step-by-step` is a sample microblogging application I built with Djangoa nd Vue.js, mostly to better understand AWS ECS, Infrastructure as Code and GitHub Actions pipelines with CDK, Terraform and Pulumi. It has a Django backend, a static frontend client and uses Postgres and Redis. The project also uses celery for asynchronous task processing and utilities like PgAdmin and MailHog.

Another focus of this project is local development environments and tooling. The backend can be easily started with docker and docker-compose, or using python virtual environments. The frontend is started in another terminal and runs a frontend client that makes API calls to the backend. I then use NGINX to Route all `/api/*` requests to the Django application and all other requests are routed to the Vue.js application.

I'll try setting this up with codespaces. I'm not exactly sure to do this, and I'm not sure if what I want to do is possible with GitHub Codespaces, but I'm going to try to find out.

I know there is a `django` template for GitHub Codespaces: [https://github.com/github/codespaces-django](https://github.com/github/codespaces-django). This should be a helpful resource for me to learn about running more complex applications with GitHub Codespaces. So far I love working on my personal blog using GitHub Codespaces. I get a live preview of what the site looks like, and then as soon as I push changes, GitHub Actions builds the site again and deploys the changes in seconds. It is nice to know that I can do work on my personal blog without needing to carry my laptop around if I'm on the move. Excellent!

With my free GitHub account, it looks like I can access my GitHub Codespace for 120 hours per month. Another nice feature is that the codespace automatically shuts down after 30 minutes of idling.

Here is more information about what is included with a free GitHub account and how pricing works for more use cases: [https://docs.github.com/en/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts](https://docs.github.com/en/billing/managing-billing-for-github-codespaces/about-billing-for-github-codespaces#monthly-included-storage-and-core-hours-for-personal-accounts).

Anther great feature of Codespaces is that I can use the built-in Settings Sync app to use my custom VSCode settings on any device (from the browser).

Be careful! When using Codespaces in the browser, `cmd + W` closes the browser window which contains all of the VSCode windows. If we were just using VSCode on a laptop, this would only close the current VSCode window. You can restore all of the windows in the Codespace by restoring the browser tab (`cmd + shift + T`).

### Keyboard shortcuts

Opening and closing a terminal is a little bit tricky on an iPad in Safari. To open a new terminal window you can use `^ + shift + ~` and to hide the terminal window you can use `^ + ~`

### Stopping a Codespace

You can stop the current codespace by clicking on `Codespaces` in the bottom-left corner of VSCode and then click on `Stop Current Codespace`.

### Using github.dev to edit a repo without using Codespaces

For a static website like my personal blog that is mostly markdown files, I don't always need to have a GitHub Codespace running to work on the project. For this use case I can use [github.dev](https://github.dev):

![Codespaces on iPad](/static/codespaces-on-ipad-2.png)

You can't use the built in terminal to commit to git, but you can use the `Source Control` panel in VSCode to commit changes using the GUI.

You can create branches in the `Source Control` panel as well. I typically don't use git with a GUI tool like the one built into VSCode, but it should be pretty intuitive.

## Codespaces for `django-step-by-step`

Now that I have a basic understanding of how to configure and use Codespaces for my personal blog, let's take a look at how we can set up GitHub Codespaces for my micro blogging application built with Django and Vue.js.

I came across this article [containers.dev/guide/dockerfile#docker-compose](https://containers.dev/guide/dockerfile#docker-compose) on the [GitHub Codespaces documentation](https://docs.github.com/en/codespaces/setting-up-your-project-for-codespaces/adding-a-dev-container-configuration/setting-up-your-python-project-for-codespaces#additional-dev-container-configuration-files).

Dev containers has support for docker-compose, which looks like it will be the easiest way to standardize the development environment for `django-step-by-step` using GitHub Codespaces. Looking into the docs of `containers.dev`, it looks like the docker-compose functionality makes use of docker-in-docker.

One of my favorite features of GitHub is code search. To see how other repos use the `dockerComposeFile` option in `devcontainer.json`, I can search for `dockerComposeFile` and filter by `JSON` files.

[AutoGPT](https://github.com/Significant-Gravitas/Auto-GPT/blob/master/.devcontainer/devcontainer.json) is one of the repos that uses the `dockerComposeFile`.

Here's a list of the different `features` options: [containers.dev/features](https://containers.dev/features). This is part of the `devcontainer.json` file configuration that doesn't make immediate sense to me; I'm not sure why I need it. I'll come back to this part of the documentation to review the options used by the AutoGPT repo and to see if I need to include any of these features in my `devcontainer.json` file.

### devcontainer.json for `django-step-by-step`

Here's a minimal `devcontainer.json` file that I can use with my project:

```
{
  "dockerComposeFile": "../docker-compose.devcontainer.yaml",
  "service": "backend",
  "shutdownAction": "stopCompose"
}
```

I committed this code, pushed to the main branch, and then used the command pallet to create a new codespace.

The codespace had an error:

```
This codespace is currently running in recovery mode due to a container error.
1. Use Cmd/Ctrl + Shift + P -> "Codespaces: View Creation Log" to see full logs
2. Update your devcontainer configuration as needed
3. Use Cmd/Ctrl + Shift + P -> "Codespaces: Rebuild Container" to retry
4. For help, read more about custom configuration: https://aka.ms/ghcs-custom-configuration
@briancaffey ➜ /workspaces/django-step-by-step (main) $
```

Here's the full creation log:

```
=================================================================================
2023-05-03 00:39:18.507Z: Configuration starting...
2023-05-03 00:39:18.553Z: Cloning...
2023-05-03 00:39:18.587Z: $ git -C "/var/lib/docker/codespacemount/workspace" clone --branch "main" --depth 1 https://github.com/briancaffey/django-step-by-step "/var/lib/docker/codespacemount/workspace/django-step-by-step"
2023-05-03 00:39:18.652Z: Cloning into '/var/lib/docker/codespacemount/workspace/django-step-by-step'...
2023-05-03 00:39:21.532Z: git process exited with exit code 0
2023-05-03 00:39:21.535Z: $ git -C "/var/lib/docker/codespacemount/workspace/django-step-by-step" config --local remote.origin.fetch +refs/heads/*:refs/remotes/origin/*
2023-05-03 00:39:21.546Z: git process exited with exit code 0

=================================================================================
2023-05-03 00:39:22.210Z: Creating container...
2023-05-03 00:39:22.221Z: $ devcontainer up --id-label Type=codespaces --workspace-folder /var/lib/docker/codespacemount/workspace/django-step-by-step --mount type=bind,source=/.codespaces/agent/mount/cache,target=/vscode --user-data-folder /var/lib/docker/codespacemount/.persistedshare --container-data-folder .vscode-remote/data/Machine --container-system-data-folder /var/vscode-remote --log-level trace --log-format json --update-remote-user-uid-default never --mount-workspace-git-root false --omit-config-remote-env-from-metadata --skip-non-blocking-commands --skip-post-create --config "/var/lib/docker/codespacemount/workspace/django-step-by-step/.devcontainer/devcontainer.json" --override-config /root/.codespaces/shared/merged_devcontainer.json --default-user-env-probe loginInteractiveShell --container-session-data-folder /workspaces/.codespaces/.persistedshare/devcontainers-cli/cache
2023-05-03 00:39:22.428Z: @devcontainers/cli 0.37.0. Node.js v14.21.3. linux 5.4.0-1106-azure x64.
2023-05-03 00:39:23.560Z: Error: Command failed: docker-compose -f /var/lib/docker/codespacemount/workspace/django-step-by-step/docker-compose.devcontainer.yaml -f /var/lib/docker/codespacemount/.persistedshare/docker-compose.codespaces.yml config
2023-05-03 00:39:23.563Z:     at Wc (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:1916:867)
2023-05-03 00:39:23.569Z:     at processTicksAndRejections (internal/process/task_queues.js:95:5)
2023-05-03 00:39:23.571Z:     at async Fse (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:1882:1370)
2023-05-03 00:39:23.576Z:     at async vse (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:1864:3170)
2023-05-03 00:39:23.585Z:     at async Hse (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:1931:2799)
2023-05-03 00:39:23.588Z:     at async Ch (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:1931:3741)
2023-05-03 00:39:23.591Z:     at async cae (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:2059:17376)
2023-05-03 00:39:23.594Z:     at async uae (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:2059:17117)
2023-05-03 00:39:23.596Z: {"outcome":"error","message":"Command failed: docker-compose -f /var/lib/docker/codespacemount/workspace/django-step-by-step/docker-compose.devcontainer.yaml -f /var/lib/docker/codespacemount/.persistedshare/docker-compose.codespaces.yml config","description":"An error occurred retrieving the Docker Compose configuration."}
2023-05-03 00:39:23.598Z: devcontainer process exited with exit code 1

====================================== ERROR ====================================
2023-05-03 00:39:23.599Z: Failed to create container.
=================================================================================
2023-05-03 00:39:23.601Z: Error: Command failed: docker-compose -f /var/lib/docker/codespacemount/workspace/django-step-by-step/docker-compose.devcontainer.yaml -f /var/lib/docker/codespacemount/.persistedshare/docker-compose.codespaces.yml config
2023-05-03 00:39:23.602Z: Error Code: 1302

====================================== ERROR ====================================
2023-05-03 00:39:23.608Z: Container creation failed.
=================================================================================
2023-05-03 00:39:23.625Z:

===================================== WARNING ===================================
2023-05-03 00:39:23.626Z: Creating recovery container.
=================================================================================

=================================================================================
2023-05-03 00:40:10.628Z: Creating container...
2023-05-03 00:40:10.631Z: $ devcontainer up --id-label Type=codespaces --workspace-folder /var/lib/docker/codespacemount/workspace/django-step-by-step --mount type=bind,source=/.codespaces/agent/mount/cache,target=/vscode --user-data-folder /var/lib/docker/codespacemount/.persistedshare --container-data-folder .vscode-remote/data/Machine --container-system-data-folder /var/vscode-remote --log-level trace --log-format json --update-remote-user-uid-default never --mount-workspace-git-root false --omit-config-remote-env-from-metadata --skip-non-blocking-commands --skip-post-create --config "/var/lib/docker/codespacemount/workspace/django-step-by-step/.devcontainer/devcontainer.json" --override-config /root/.codespaces/shared/merged_devcontainer.json --default-user-env-probe loginInteractiveShell --container-session-data-folder /workspaces/.codespaces/.persistedshare/devcontainers-cli/cache
2023-05-03 00:40:10.829Z: @devcontainers/cli 0.37.0. Node.js v14.21.3. linux 5.4.0-1106-azure x64.
2023-05-03 00:40:11.367Z: $alpine -c echo Container started
2023-05-03 00:40:11.408Z: Unable to find image 'mcr.microsoft.com/devcontainers/base:alpine' locally
2023-05-03 00:40:11.647Z: alpine: Pulling from devcontainers/base
2023-05-03 00:40:11.691Z:
2023-05-03 00:40:11.694Z: [1A[2K
f56be85fc22e: Pulling fs layer
[1B2023-05-03 00:40:11.699Z:
[1A[2K
4f4fb700ef54: Pulling fs layer
[1B
[1A[2K
8d7a437d5ec4: Pulling fs layer
[1B
[1A[2K
9dd98cde5bde: Pulling fs layer
[1B
[1A[2K
9d3b72dcf13d: Pulling fs layer
[1B
[1A[2K
503b8b1404bd: Pulling fs layer
[1B
[1A[2K
98ffe52a3ad6: Pulling fs layer
[1B
[1A[2K
888152ba0a0b: Pulling fs layer
[1B[5A[2K
9dd98cde5bde: Waiting
[5B[4A[2K
9d3b72dcf13d: Waiting
[4B[3A[2K
503b8b1404bd: Waiting
[3B[2A[2K
98ffe52a3ad6: Waiting
[2B[1A[2K
888152ba0a0b: Waiting
[1B2023-05-03 00:40:11.742Z: [7A[2K
4f4fb700ef54: Downloading      32B/32B
[7B2023-05-03 00:40:11.744Z: [7A[2K
4f4fb700ef54: Download complete
[7B2023-05-03 00:40:11.778Z: [8A[2K
2023-05-03 00:40:11.782Z: f56be85fc22e: 2023-05-03 00:40:11.784Z: Downloading  48.23kB/3.375MB
2023-05-03 00:40:11.786Z: [8B2023-05-03 00:40:11.831Z: [6A[2K
8d7a437d5ec4: Downloading     417B/417B
[6B2023-05-03 00:40:11.836Z: [6A[2K
8d7a437d5ec4: Verifying Checksum
[6B[6A[2K
8d7a437d5ec4: Download complete
[6B2023-05-03 00:40:11.839Z: [8A2023-05-03 00:40:11.849Z: [2K
f56be85fc22e: 2023-05-03 00:40:11.854Z: Downloading  3.375MB/3.375MB
[8B2023-05-03 00:40:11.863Z: [8A[2K
2023-05-03 00:40:11.867Z: f56be85fc22e: Verifying Checksum
2023-05-03 00:40:11.872Z: [8B2023-05-03 00:40:11.873Z: [8A[2K
2023-05-03 00:40:11.877Z: f56be85fc22e: Download complete
2023-05-03 00:40:11.882Z: [8B2023-05-03 00:40:11.884Z: [8A[2K
f56be85fc22e: Extracting  65.54kB/3.375MB
[8B2023-05-03 00:40:11.885Z: [5A[2K
9dd98cde5bde: Downloading     140B/140B
[5B[5A[2K
9dd98cde5bde: Verifying Checksum
[5B[5A[2K
9dd98cde5bde: Download complete
[5B2023-05-03 00:40:11.934Z: [3A2023-05-03 00:40:11.939Z: [2K2023-05-03 00:40:11.940Z:
2023-05-03 00:40:11.943Z: 503b8b1404bd: 2023-05-03 00:40:11.944Z: Downloading     236B/236B
2023-05-03 00:40:11.947Z: [3B2023-05-03 00:40:11.949Z: [3A2023-05-03 00:40:11.953Z: [2K2023-05-03 00:40:11.955Z:
2023-05-03 00:40:11.962Z: 503b8b1404bd: 2023-05-03 00:40:11.966Z: Download complete
2023-05-03 00:40:11.970Z: [3B2023-05-03 00:40:11.976Z: [8A2023-05-03 00:40:11.978Z: [2K2023-05-03 00:40:11.980Z:
2023-05-03 00:40:11.981Z: f56be85fc22e: 2023-05-03 00:40:11.982Z: Extracting  393.2kB/3.375MB
2023-05-03 00:40:11.984Z: [8B2023-05-03 00:40:11.993Z: [4A2023-05-03 00:40:11.996Z: [2K2023-05-03 00:40:11.998Z:
2023-05-03 00:40:11.999Z: 9d3b72dcf13d: 2023-05-03 00:40:12.000Z: Downloading     227B/227B
2023-05-03 00:40:12.003Z: [4B2023-05-03 00:40:12.004Z: [4A2023-05-03 00:40:12.005Z: [2K2023-05-03 00:40:12.009Z:
2023-05-03 00:40:12.011Z: 9d3b72dcf13d: 2023-05-03 00:40:12.013Z: Verifying Checksum
2023-05-03 00:40:12.017Z: [4B2023-05-03 00:40:12.017Z: [4A2023-05-03 00:40:12.019Z: [2K2023-05-03 00:40:12.020Z:
2023-05-03 00:40:12.021Z: 9d3b72dcf13d: 2023-05-03 00:40:12.023Z: Download complete
2023-05-03 00:40:12.023Z: [4B2023-05-03 00:40:12.024Z: [2A2023-05-03 00:40:12.025Z: [2K2023-05-03 00:40:12.027Z:
2023-05-03 00:40:12.028Z: 98ffe52a3ad6: 2023-05-03 00:40:12.029Z: Downloading  538.4kB/211.6MB
2023-05-03 00:40:12.030Z: [2B2023-05-03 00:40:12.078Z: [8A[2K
f56be85fc22e: Extracting  2.228MB/3.375MB
[8B2023-05-03 00:40:12.098Z: [1A[2K
888152ba0a0b: Downloading  407.3kB/39.74MB
[1B2023-05-03 00:40:12.131Z: [2A[2K
98ffe52a3ad6: Downloading  8.108MB/211.6MB
[2B2023-05-03 00:40:12.197Z: [2A[2K
98ffe52a3ad6: Downloading  19.45MB/211.6MB
[2B2023-05-03 00:40:12.206Z: [1A[2K
888152ba0a0b: Downloading   7.78MB/39.74MB
[1B2023-05-03 00:40:12.226Z: [8A[2K
f56be85fc22e: Extracting  3.015MB/3.375MB
[8B2023-05-03 00:40:12.290Z: [8A[2K2023-05-03 00:40:12.296Z:
f56be85fc22e: Extracting  3.375MB/3.375MB
[8B2023-05-03 00:40:12.335Z: [2A2023-05-03 00:40:12.337Z: [2K
98ffe52a3ad6: Downloading  27.02MB/211.6MB
[2B2023-05-03 00:40:12.341Z: [1A[2K
888152ba0a0b: 2023-05-03 00:40:12.344Z: Downloading   17.2MB/39.74MB
[1B2023-05-03 00:40:12.405Z: [2A2023-05-03 00:40:12.410Z: [2K
2023-05-03 00:40:12.418Z: 98ffe52a3ad6: 2023-05-03 00:40:12.422Z: Downloading  36.21MB/211.6MB
[2B2023-05-03 00:40:12.449Z: [1A[2K
888152ba0a0b: 2023-05-03 00:40:12.504Z: Downloading  27.85MB/39.74MB
[1B2023-05-03 00:40:12.510Z: [2A[2K
2023-05-03 00:40:12.513Z: 98ffe52a3ad6: Downloading  40.53MB/211.6MB
[2B2023-05-03 00:40:12.537Z: [1A[2K
888152ba0a0b: Downloading  32.77MB/39.74MB
[1B2023-05-03 00:40:12.712Z: [2A[2K
98ffe52a3ad6: Downloading  43.78MB/211.6MB
[2B[1A[2K
888152ba0a0b: Downloading   38.5MB/39.74MB
[1B[1A[2K
888152ba0a0b: Verifying Checksum
[1B[1A[2K
888152ba0a0b: Download complete
[1B2023-05-03 00:40:12.722Z: [2A2023-05-03 00:40:12.730Z: [2K2023-05-03 00:40:12.734Z:
2023-05-03 00:40:12.735Z: 98ffe52a3ad6: 2023-05-03 00:40:12.739Z: Downloading  49.18MB/211.6MB
2023-05-03 00:40:12.743Z: [2B2023-05-03 00:40:12.827Z: [2A[2K
98ffe52a3ad6: Downloading  61.62MB/211.6MB
[2B2023-05-03 00:40:12.920Z: [8A[2K
f56be85fc22e: 2023-05-03 00:40:12.925Z: Pull complete
[8B2023-05-03 00:40:12.934Z: [2A[2K2023-05-03 00:40:12.953Z:
98ffe52a3ad6: Downloading  78.92MB/211.6MB
[2B2023-05-03 00:40:12.957Z: [7A[2K
2023-05-03 00:40:12.962Z: 4f4fb700ef54: Extracting      32B/32B
[7B[7A[2K
4f4fb700ef54: Extracting      32B/32B
[7B2023-05-03 00:40:13.032Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:13.034Z: Downloading  89.74MB/211.6MB
[2B2023-05-03 00:40:13.202Z: [2A2023-05-03 00:40:13.208Z: [2K
2023-05-03 00:40:13.226Z: 98ffe52a3ad6: 2023-05-03 00:40:13.232Z: Downloading   97.3MB/211.6MB
2023-05-03 00:40:13.235Z: [2B2023-05-03 00:40:13.253Z: [2A2023-05-03 00:40:13.256Z: [2K2023-05-03 00:40:13.260Z:
2023-05-03 00:40:13.264Z: 98ffe52a3ad6: 2023-05-03 00:40:13.269Z: Downloading  101.1MB/211.6MB
2023-05-03 00:40:13.272Z: [2B2023-05-03 00:40:13.341Z: [2A[2K
98ffe52a3ad6: Downloading  112.4MB/211.6MB
[2B2023-05-03 00:40:13.443Z: [2A[2K
98ffe52a3ad6: Downloading  126.5MB/211.6MB
[2B2023-05-03 00:40:13.547Z: [2A2023-05-03 00:40:13.597Z: [2K2023-05-03 00:40:13.606Z:
2023-05-03 00:40:13.616Z: 98ffe52a3ad6: 2023-05-03 00:40:13.618Z: Downloading  135.7MB/211.6MB
2023-05-03 00:40:13.623Z: [2B2023-05-03 00:40:13.646Z: [2A[2K2023-05-03 00:40:13.649Z:
98ffe52a3ad6: Downloading  142.7MB/211.6MB
[2B2023-05-03 00:40:13.750Z: [2A[2K
98ffe52a3ad6: Downloading  157.3MB/211.6MB
[2B2023-05-03 00:40:13.870Z: [7A[2K
4f4fb700ef54: 2023-05-03 00:40:13.873Z: Pull complete
[7B[2A[2K
98ffe52a3ad6: Downloading  174.6MB/211.6MB
[2B2023-05-03 00:40:13.906Z: [6A[2K
8d7a437d5ec4: Extracting     417B/417B
[6B2023-05-03 00:40:13.914Z: [6A[2K
8d7a437d5ec4: Extracting     417B/417B
[6B2023-05-03 00:40:13.958Z: [2A[2K
98ffe52a3ad6: Downloading  189.8MB/211.6MB
[2B2023-05-03 00:40:14.171Z: [2A2023-05-03 00:40:14.173Z: [2K
98ffe52a3ad6: Downloading  198.4MB/211.6MB
[2B2023-05-03 00:40:14.262Z: [2A[2K
98ffe52a3ad6: Verifying Checksum
[2B[2A[2K
98ffe52a3ad6: Download complete
[2B2023-05-03 00:40:14.464Z: [6A[2K
8d7a437d5ec4: Pull complete
[6B2023-05-03 00:40:14.496Z: [5A[2K
9dd98cde5bde: Extracting     140B/140B
[5B2023-05-03 00:40:14.499Z: [5A[2K
9dd98cde5bde: 2023-05-03 00:40:14.505Z: Extracting     140B/140B
[5B2023-05-03 00:40:14.729Z: [5A[2K
9dd98cde5bde: Pull complete
[5B2023-05-03 00:40:14.763Z: [4A[2K
9d3b72dcf13d: 2023-05-03 00:40:14.764Z: Extracting     227B/227B
[4B2023-05-03 00:40:14.766Z: [4A2023-05-03 00:40:14.768Z: [2K
9d3b72dcf13d: Extracting     227B/227B
[4B2023-05-03 00:40:14.945Z: [4A[2K
9d3b72dcf13d: 2023-05-03 00:40:14.946Z: Pull complete
[4B2023-05-03 00:40:14.977Z: [3A2023-05-03 00:40:14.979Z: [2K
503b8b1404bd: 2023-05-03 00:40:14.980Z: Extracting     236B/236B
[3B2023-05-03 00:40:14.981Z: [3A[2K
503b8b1404bd: Extracting     236B/236B
[3B2023-05-03 00:40:15.180Z: [3A[2K
503b8b1404bd: Pull complete
[3B2023-05-03 00:40:15.270Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:15.271Z: Extracting  557.1kB/211.6MB
[2B2023-05-03 00:40:15.370Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:15.372Z: Extracting  3.899MB/211.6MB
[2B2023-05-03 00:40:15.471Z: [2A[2K
2023-05-03 00:40:15.473Z: 98ffe52a3ad6: Extracting  7.799MB/211.6MB
[2B2023-05-03 00:40:15.572Z: [2A[2K
98ffe52a3ad6: Extracting  12.81MB/211.6MB
[2B2023-05-03 00:40:15.683Z: [2A[2K
98ffe52a3ad6: Extracting  17.27MB/211.6MB
[2B2023-05-03 00:40:15.784Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:15.785Z: Extracting  20.05MB/211.6MB
[2B2023-05-03 00:40:15.934Z: [2A[2K
2023-05-03 00:40:15.936Z: 98ffe52a3ad6: Extracting  21.73MB/211.6MB
[2B2023-05-03 00:40:16.052Z: [2A[2K
2023-05-03 00:40:16.053Z: 98ffe52a3ad6: Extracting  22.84MB/211.6MB
[2B2023-05-03 00:40:16.168Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:16.169Z: Extracting  23.95MB/211.6MB
[2B2023-05-03 00:40:16.300Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:16.302Z: Extracting   27.3MB/211.6MB
[2B2023-05-03 00:40:16.405Z: [2A[2K
98ffe52a3ad6: Extracting  30.64MB/211.6MB
[2B2023-05-03 00:40:16.510Z: [2A[2K
98ffe52a3ad6: Extracting  35.09MB/211.6MB
[2B2023-05-03 00:40:16.623Z: [2A[2K
98ffe52a3ad6: Extracting  40.67MB/211.6MB
[2B2023-05-03 00:40:16.737Z: [2A[2K
98ffe52a3ad6: Extracting  45.68MB/211.6MB
[2B2023-05-03 00:40:16.840Z: [2A[2K
98ffe52a3ad6: Extracting  49.58MB/211.6MB
[2B2023-05-03 00:40:16.941Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:16.943Z: Extracting  53.48MB/211.6MB
[2B2023-05-03 00:40:17.047Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:17.048Z: Extracting  57.38MB/211.6MB
[2B2023-05-03 00:40:17.174Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:17.176Z: Extracting  60.16MB/211.6MB
[2B2023-05-03 00:40:17.297Z: [2A[2K
2023-05-03 00:40:17.299Z: 98ffe52a3ad6: Extracting   63.5MB/211.6MB
[2B2023-05-03 00:40:17.412Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:17.413Z: Extracting  65.73MB/211.6MB
[2B2023-05-03 00:40:17.525Z: [2A[2K
98ffe52a3ad6: Extracting  67.96MB/211.6MB
[2B2023-05-03 00:40:17.629Z: [2A[2K
98ffe52a3ad6: Extracting  74.65MB/211.6MB
[2B2023-05-03 00:40:17.733Z: [2A[2K
98ffe52a3ad6: Extracting  81.89MB/211.6MB
[2B2023-05-03 00:40:17.833Z: [2A[2K
98ffe52a3ad6: Extracting  88.57MB/211.6MB
[2B2023-05-03 00:40:17.935Z: [2A[2K
98ffe52a3ad6: Extracting  95.26MB/211.6MB
[2B2023-05-03 00:40:18.064Z: [2A[2K
98ffe52a3ad6: Extracting  96.37MB/211.6MB
[2B2023-05-03 00:40:18.188Z: [2A[2K
98ffe52a3ad6: Extracting  100.8MB/211.6MB
[2B2023-05-03 00:40:18.302Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:18.304Z: Extracting  103.1MB/211.6MB
[2B2023-05-03 00:40:18.418Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:18.421Z: Extracting  104.7MB/211.6MB
[2B2023-05-03 00:40:18.545Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:18.547Z: Extracting  106.4MB/211.6MB
[2B2023-05-03 00:40:18.653Z: [2A[2K2023-05-03 00:40:18.656Z:
98ffe52a3ad6: Extracting  111.4MB/211.6MB
[2B2023-05-03 00:40:18.759Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:18.761Z: Extracting  115.3MB/211.6MB
[2B2023-05-03 00:40:18.903Z: [2A[2K
98ffe52a3ad6: Extracting    117MB/211.6MB
[2B2023-05-03 00:40:19.146Z: [2A[2K
98ffe52a3ad6: Extracting  117.5MB/211.6MB
[2B2023-05-03 00:40:19.259Z: [2A[2K
98ffe52a3ad6: Extracting  118.1MB/211.6MB
[2B2023-05-03 00:40:19.428Z: [2A[2K
98ffe52a3ad6: Extracting  118.7MB/211.6MB
[2B2023-05-03 00:40:19.530Z: [2A[2K
98ffe52a3ad6: Extracting  120.9MB/211.6MB
[2B2023-05-03 00:40:19.635Z: [2A[2K
98ffe52a3ad6: Extracting  124.8MB/211.6MB
[2B2023-05-03 00:40:19.747Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:19.750Z: Extracting  128.1MB/211.6MB
[2B2023-05-03 00:40:19.871Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:19.872Z: Extracting  131.5MB/211.6MB
[2B2023-05-03 00:40:19.973Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:19.975Z: Extracting  133.7MB/211.6MB
[2B2023-05-03 00:40:20.088Z: [2A[2K
98ffe52a3ad6: 2023-05-03 00:40:20.089Z: Extracting  137.6MB/211.6MB
[2B2023-05-03 00:40:20.199Z: [2A[2K
98ffe52a3ad6: Extracting  141.5MB/211.6MB
[2B2023-05-03 00:40:20.307Z: [2A[2K
98ffe52a3ad6: Extracting  145.4MB/211.6MB
[2B2023-05-03 00:40:20.410Z: [2A[2K
98ffe52a3ad6: Extracting  149.3MB/211.6MB
[2B2023-05-03 00:40:20.512Z: [2A[2K
98ffe52a3ad6: Extracting  154.3MB/211.6MB
[2B2023-05-03 00:40:20.614Z: [2A[2K
98ffe52a3ad6: Extracting  159.3MB/211.6MB
[2B2023-05-03 00:40:20.718Z: [2A[2K
98ffe52a3ad6: Extracting  164.3MB/211.6MB
[2B2023-05-03 00:40:20.819Z: [2A[2K
98ffe52a3ad6: Extracting  169.3MB/211.6MB
[2B2023-05-03 00:40:20.923Z: [2A[2K
98ffe52a3ad6: Extracting  174.4MB/211.6MB
[2B2023-05-03 00:40:21.029Z: [2A[2K
98ffe52a3ad6: Extracting  179.4MB/211.6MB
[2B2023-05-03 00:40:21.132Z: [2A[2K
98ffe52a3ad6: Extracting  184.4MB/211.6MB
[2B2023-05-03 00:40:21.237Z: [2A[2K
98ffe52a3ad6: Extracting  189.4MB/211.6MB
[2B2023-05-03 00:40:21.346Z: [2A[2K
98ffe52a3ad6: Extracting  194.4MB/211.6MB
[2B2023-05-03 00:40:21.452Z: [2A[2K
2023-05-03 00:40:21.457Z: 98ffe52a3ad6: Extracting  198.9MB/211.6MB
[2B2023-05-03 00:40:21.560Z: [2A[2K
98ffe52a3ad6: Extracting  202.2MB/211.6MB
[2B2023-05-03 00:40:21.694Z: [2A[2K
98ffe52a3ad6: Extracting  203.9MB/211.6MB
[2B2023-05-03 00:40:21.799Z: [2A[2K
98ffe52a3ad6: Extracting  205.6MB/211.6MB
[2B2023-05-03 00:40:21.910Z: [2A[2K
98ffe52a3ad6: Extracting  206.7MB/211.6MB
[2B2023-05-03 00:40:22.068Z: [2A[2K
98ffe52a3ad6: Extracting  208.3MB/211.6MB
[2B2023-05-03 00:40:22.199Z: [2A[2K
98ffe52a3ad6: Extracting  208.9MB/211.6MB
[2B2023-05-03 00:40:22.341Z: [2A[2K
98ffe52a3ad6: Extracting  209.5MB/211.6MB
[2B2023-05-03 00:40:22.367Z: [2A[2K
98ffe52a3ad6: Extracting  211.6MB/211.6MB
[2B2023-05-03 00:40:23.871Z: [2A[2K
98ffe52a3ad6: Pull complete
[2B2023-05-03 00:40:24.064Z: [1A[2K
888152ba0a0b: 2023-05-03 00:40:24.066Z: Extracting    426kB/39.74MB
[1B2023-05-03 00:40:24.186Z: [1A[2K
888152ba0a0b: 2023-05-03 00:40:24.187Z: Extracting  3.408MB/39.74MB
[1B2023-05-03 00:40:24.288Z: [1A[2K
888152ba0a0b: 2023-05-03 00:40:24.289Z: Extracting  4.686MB/39.74MB
[1B2023-05-03 00:40:24.391Z: [1A[2K
888152ba0a0b: 2023-05-03 00:40:24.392Z: Extracting  7.242MB/39.74MB
[1B2023-05-03 00:40:24.565Z: [1A[2K
888152ba0a0b: 2023-05-03 00:40:24.566Z: Extracting  10.22MB/39.74MB
[1B2023-05-03 00:40:24.666Z: [1A[2K
888152ba0a0b: Extracting  13.21MB/39.74MB
[1B2023-05-03 00:40:24.771Z: [1A[2K
888152ba0a0b: Extracting  17.04MB/39.74MB
[1B2023-05-03 00:40:24.872Z: [1A[2K
888152ba0a0b: Extracting   21.3MB/39.74MB
[1B2023-05-03 00:40:24.979Z: [1A[2K
888152ba0a0b: Extracting  24.71MB/39.74MB
[1B2023-05-03 00:40:25.083Z: [1A[2K
888152ba0a0b: Extracting  26.84MB/39.74MB
[1B2023-05-03 00:40:25.220Z: [1A[2K
888152ba0a0b: Extracting  27.69MB/39.74MB
[1B2023-05-03 00:40:25.324Z: [1A[2K
888152ba0a0b: Extracting  28.54MB/39.74MB
[1B2023-05-03 00:40:25.584Z: [1A[2K
888152ba0a0b: Extracting  29.39MB/39.74MB
[1B2023-05-03 00:40:25.700Z: [1A[2K
888152ba0a0b: Extracting  31.95MB/39.74MB
[1B2023-05-03 00:40:25.807Z: [1A[2K
888152ba0a0b: Extracting   32.8MB/39.74MB
[1B2023-05-03 00:40:25.943Z: [1A[2K
888152ba0a0b: Extracting  35.78MB/39.74MB
[1B2023-05-03 00:40:26.067Z: [1A[2K
888152ba0a0b: Extracting  37.06MB/39.74MB
[1B2023-05-03 00:40:26.143Z: [1A[2K
888152ba0a0b: Extracting  39.74MB/39.74MB
[1B2023-05-03 00:40:26.772Z: [1A[2K
888152ba0a0b: Pull complete
[1B2023-05-03 00:40:26.827Z: Digest: sha256:6a41a1529462fd6e6c67ee349086ee6072364f333094a870dcbb2c43fa78714f
2023-05-03 00:40:26.858Z: Status: Downloaded newer image for mcr.microsoft.com/devcontainers/base:alpine
2023-05-03 00:40:27.252Z: Container started
2023-05-03 00:40:27.577Z: Outcome: success User: vscode WorkspaceFolder: /workspaces/django-step-by-step
2023-05-03 00:40:27.585Z: devcontainer process exited with exit code 0

=================================================================================
2023-05-03 00:40:29.477Z: Running blocking commands...
2023-05-03 00:40:29.480Z: $ devcontainer up --id-label Type=codespaces --workspace-folder /var/lib/docker/codespacemount/workspace/django-step-by-step --mount type=bind,source=/.codespaces/agent/mount/cache,target=/vscode --user-data-folder /var/lib/docker/codespacemount/.persistedshare --container-data-folder .vscode-remote/data/Machine --container-system-data-folder /var/vscode-remote --log-level trace --log-format json --update-remote-user-uid-default never --mount-workspace-git-root false --omit-config-remote-env-from-metadata --skip-non-blocking-commands --expect-existing-container --config "/var/lib/docker/codespacemount/workspace/django-step-by-step/.devcontainer/devcontainer.json" --override-config /root/.codespaces/shared/merged_devcontainer.json --default-user-env-probe loginInteractiveShell --container-session-data-folder /workspaces/.codespaces/.persistedshare/devcontainers-cli/cache
2023-05-03 00:40:29.676Z: @devcontainers/cli 0.37.0. Node.js v14.21.3. linux 5.4.0-1106-azure x64.
2023-05-03 00:40:29.935Z: Outcome: success User: vscode WorkspaceFolder: /workspaces/django-step-by-step
2023-05-03 00:40:29.945Z: devcontainer process exited with exit code 0

=================================================================================
2023-05-03 00:40:30.015Z: Configuring codespace...

=================================================================================
2023-05-03 00:40:30.098Z: Finished configuring codespace.
```

```
 Error: Command failed: docker-compose -f /var/lib/docker/codespacemount/workspace/django-step-by-step/docker-compose.devcontainer.yaml -f /var/lib/docker/codespacemount/.persistedshare/docker-compose.codespaces.yml config
```

I found this thread when searching for the `Error Code: 1302`: [https://github.com/orgs/community/discussions/3766](https://github.com/orgs/community/discussions/3766)

The most recent reply on this thread mentions a feature that needs to be included:

```json
"features": {
    "ghcr.io/devcontainers/features/common-utils:2": {
      "version": "latest"
    }
```

I got the same issue again, here's a screenshot:

![codespaces recovery mode](/static/codespaces-recovery-mode.png)

Interesting, viewing the creation logs I see there is a new error message:

```
=================================================================================
2023-05-03 00:56:13.652Z: Creating container...
2023-05-03 00:56:13.666Z: $ devcontainer up --id-label Type=codespaces --workspace-folder /var/lib/docker/codespacemount/workspace/django-step-by-step --mount type=bind,source=/.codespaces/agent/mount/cache,target=/vscode --user-data-folder /var/lib/docker/codespacemount/.persistedshare --container-data-folder .vscode-remote/data/Machine --container-system-data-folder /var/vscode-remote --log-level trace --log-format json --update-remote-user-uid-default never --mount-workspace-git-root false --omit-config-remote-env-from-metadata --skip-non-blocking-commands --skip-post-create --expect-existing-container --config "/var/lib/docker/codespacemount/workspace/django-step-by-step/.devcontainer/devcontainer.json" --override-config /root/.codespaces/shared/merged_devcontainer.json --default-user-env-probe loginInteractiveShell --container-session-data-folder /workspaces/.codespaces/.persistedshare/devcontainers-cli/cache
2023-05-03 00:56:13.915Z: @devcontainers/cli 0.37.0. Node.js v14.21.3. linux 5.4.0-1106-azure x64.
2023-05-03 00:56:26.170Z: Error: The expected container does not exist.
2023-05-03 00:56:26.170Z:     at vse (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:1864:2871)
2023-05-03 00:56:26.171Z:     at processTicksAndRejections (internal/process/task_queues.js:95:5)
2023-05-03 00:56:26.171Z:     at async Hse (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:1931:2799)
2023-05-03 00:56:26.171Z:     at async Ch (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:1931:3741)
2023-05-03 00:56:26.171Z:     at async cae (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:2059:17376)
2023-05-03 00:56:26.171Z:     at async uae (/usr/lib/node_modules/@devcontainers/cli/dist/spec-node/devContainersSpecCLI.js:2059:17117)
2023-05-03 00:56:26.176Z: {"outcome":"error","message":"The expected container does not exist.","description":"The expected container does not exist."}
2023-05-03 00:56:26.184Z: devcontainer process exited with exit code 1
```

Let's have a look at the command that is failing here. I'll split out each argument to a new line so it is easier to read:

```
devcontainer up \
  --id-label Type=codespaces \
  --workspace-folder /var/lib/docker/codespacemount/workspace/django-step-by-step \
  --mount type=bind,source=/.codespaces/agent/mount/cache,target=/vscode \
  --user-data-folder /var/lib/docker/codespacemount/.persistedshare \
  --container-data-folder .vscode-remote/data/Machine \
  --container-system-data-folder /var/vscode-remote \
  --log-level trace \
  --log-format json \
  --update-remote-user-uid-default never \
  --mount-workspace-git-root false \
  --omit-config-remote-env-from-metadata \
  --skip-non-blocking-commands \
  --skip-post-create \
  --expect-existing-container \
  --config "/var/lib/docker/codespacemount/workspace/django-step-by-step/.devcontainer/devcontainer.json" \
  --override-config /root/.codespaces/shared/merged_devcontainer.json \
  --default-user-env-probe loginInteractiveShell \
  --container-session-data-folder /workspaces/.codespaces/.persistedshare/devcontainers-cli/cache
```

Found a PR on a similar Django project that tries to use docker-compose with Codespaces: [https://github.com/epicserve/django-base-site/pull/188](https://github.com/epicserve/django-base-site/pull/188)

## MVP with devcontainers and docker-compose

There could be a lot of different failure points with how I have set up devcontainers and docker-compose. It might be easier to start small with a super-simple "hello world" application and build up the different components around that.

I'll create a new repo with the awesome [GitHub CLI](https://cli.github.com/manual/installation):

```
~/git/github$ gh repo create
? What would you like to do? Create a new repository on GitHub from scratch
? Repository name devcontainer-docker-compose-test
? Description A repo for testing the use of docker-compose with devcontainers
? Visibility Public
? Would you like to add a README file? No
? Would you like to add a .gitignore? No
? Would you like to add a license? Yes
? Choose a license MIT License
? This will create "devcontainer-docker-compose-test" as a public repository on GitHub. Continue? Yes
✓ Created repository briancaffey/devcontainer-docker-compose-test on GitHub
? Clone the new repository locally? Yes
Cloning into 'devcontainer-docker-compose-test'...
~/git/github$ cd devcontainer-docker-compose-test/
~/git/github/devcontainer-docker-compose-test$ code .
```

Documentation for the `gh repo create` command can be found [here](https://cli.github.com/manual/gh_repo_create).

In this repo I'll start by creating a `.devcontainer/devcontainer.json` file with a basic setup similar to the one in AutoGPT:

```json
{
  "dockerComposeFile": "./docker-compose.yml",
  "service": "auto-gpt",
  "workspaceFolder": "/workspace/Auto-GPT",
  "shutdownAction": "stopCompose",
  "features": {
    "ghcr.io/devcontainers/features/common-utils:2": {
      "installZsh": "true",
      "username": "vscode",
      "userUid": "6942",
      "userGid": "6942",
      "upgradePackages": "true"
    },
    "ghcr.io/devcontainers/features/desktop-lite:1": {},
    "ghcr.io/devcontainers/features/python:1": "none",
    "ghcr.io/devcontainers/features/node:1": "none",
    "ghcr.io/devcontainers/features/git:1": {
      "version": "latest",
      "ppa": "false"
    }
  },
  // Configure tool-specific properties.
  "customizations": {
    // Configure properties specific to VS Code.
    "vscode": {
      // Set *default* container specific settings.json values on container create.
      "settings": {
        "python.defaultInterpreterPath": "/usr/local/bin/python"
      }
    }
  },
  // Use 'forwardPorts' to make a list of ports inside the container available locally.
  // "forwardPorts": [],

  // Use 'postCreateCommand' to run commands after the container is created.
  // "postCreateCommand": "pip3 install --user -r requirements.txt",

  // Set `remoteUser` to `root` to connect as root instead. More info: https://aka.ms/vscode-remote/containers/non-root.
  "remoteUser": "vscode"
}
```

