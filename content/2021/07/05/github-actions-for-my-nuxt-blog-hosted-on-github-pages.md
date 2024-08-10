---
title: GitHub Action for my Nuxt.js blog hosted on GitHub Pages
date: '2021-07-05'
image: /static/gha_nuxt/gha_nuxt.png
description: This article shows how to use GitHub Actions to update my Nuxt.js blog hosted on GitHub Pages.
tags:
  - github
  - nuxt
  - github-actions
  - github-pages

# external:
#   - link: https://news.ycombinator.com/
#     site: hn
#   - link: https://reddit.com
#     site: reddit
#   - link: https://dev.to
#     site: dev
#   - link: https://medium.com
#     site: medium
#   - link: https://briancaffey.hashnode.com
#     site: hashnode
#   - link: https://briancaffey.substack.com
#     site: substack
#   - link: https://hackernoon.com/
#     site: hackernoon
# draft: true
---

## GitHub Actions for a Nuxt.js blog hosted on GitHub Pages

To update my blog, I usually build locally and then push changes to GitHub. This makes my git log unreadable. This article will show how to use a GitHub Action to automate the deployment of my blog to GitHub Pages.

In this GitHub repo, the following workflow is triggered on pushes to the main branch which will build and deploy changes to [briancaffey.github.io](https://briancaffey.github.io):

```yaml
name: github pages

on:
  push:
    branches:
      - master
  pull_request:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: "14"

      - name: Cache dependencies
        uses: actions/cache@v2
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - run: yarn
      - run: yarn lint
      - run: yarn generate

      - name: deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

Reference: [https://github.com/marketplace/actions/github-pages-action#%EF%B8%8F-vue-and-nuxt](https://github.com/marketplace/actions/github-pages-action#%EF%B8%8F-vue-and-nuxt)

