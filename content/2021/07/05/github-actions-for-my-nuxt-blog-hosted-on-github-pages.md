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

**Version Note:** This article was published in July 2021 and references Nuxt 2, Node.js 14, and older GitHub Action versions. While the core workflow concepts remain valid, specific action versions (e.g., `actions/checkout@v2`, `peaceiris/actions-gh-pages@v3`) and Node.js versions have been updated since publication. Check official documentation for current best practices when implementing similar workflows today.

To update my blog, I usually build locally and then push changes to GitHub. This makes my git log unreadable because every deployment commit is mixed in with feature commits. This article shows how to use a GitHub Action to automate the deployment of my Nuxt.js blog to GitHub Pages, keeping the git history clean while ensuring continuous integration.

In this GitHub repo, the following workflow is triggered on pushes to the `master` branch (or `main` for newer repos) which will build and deploy changes to [briancaffey.github.io](https://briancaffey.github.io):

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

### How It Works

1. **Trigger**: The workflow runs on every push to `master` (or PRs for testing)
2. **Checkout**: Downloads the repository code
3. **Node Setup**: Installs Node.js 14 (as configured in 2021; newer projects might use v18 or v20)
4. **Caching**: Speeds up builds by caching `node_modules` and npm cache
5. **Build Steps**: 
   - `yarn`: Installs dependencies
   - `yarn lint`: Checks code quality (optional but recommended)
   - `yarn generate`: Builds the static site (for Nuxt 2; Nuxt 3 uses `nuxt build` + `nuxt generate`)
6. **Deploy**: Uses `peaceiris/actions-gh-pages` to push the built files to GitHub Pages

### Important Notes for Modern Projects

- **Nuxt 3 Migration**: If you're using Nuxt 3, the `publish_dir` is typically `dist` instead of `docs`, and the build command might be `nuxt generate` or `yarn build`.
- **Node.js Versions**: Node 14 reached end-of-life in April 2023. Modern projects should use LTS versions (e.g., v18, v20).
- **Action Updates**: Consider updating to newer action versions (`actions/checkout@v4`, `peaceiris/actions-gh-pages@v4`) for improved security and features.
- **Branch Names**: Newer repositories often default to `main` instead of `master`; adjust the trigger accordingly.

