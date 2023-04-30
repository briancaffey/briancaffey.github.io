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
