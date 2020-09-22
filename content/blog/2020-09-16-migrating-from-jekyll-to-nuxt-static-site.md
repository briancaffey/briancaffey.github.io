---
layout: post
title: Migrating my personal GitHub pages blog from Jekyll to Nuxt
date: 2020-09-17
comments: true
image: /static/nuxt-app.png
---

Jekyll has served me well for a long time, but I'm going to be moving it Nuxt. This article will hopefully be the first new article in my Nuxt blog, but I'm going to try to bring over most of the old content from my other blog.

I'm going to start off with a `feature-nuxt` feature branch. In the root of my current Jekyll project I'll make a new Nuxt project with the following options:

## Creating a nuxt project

Since I can't create the nuxt project in a non-empty directory, I'll create it in a folder called `nuxt`:

```
brian@x1:~/github/briancaffey.github.io/nuxt$ npx create-nuxt-app .

create-nuxt-app v3.2.0
✨  Generating Nuxt.js project in .
(node:8073) ExperimentalWarning: Conditional exports is an experimental feature. This feature could change at any time
? Project name: brian-caffey
? Programming language: JavaScript
? Package manager: Yarn
? UI framework: Tailwind CSS
? Nuxt.js modules: Axios, Content
? Linting tools: ESLint, Prettier
? Testing framework: None
? Rendering mode: Universal (SSR / SSG)
? Deployment target: Static (Static/JAMStack hosting)
? Development tools: jsconfig.json (Recommended for VS Code if you're not using typescript)
yarn run v1.22.5
$ eslint --ext .js,.vue --ignore-path .gitignore . --fix
Done in 1.57s.

🎉  Successfully created project brian-caffey

  To get started:

        yarn dev

  To build & start for production:

        yarn build
        yarn start
```

Running the following:

```
yarn generate
yarn start
```

I see the following:

![Nuxt app](/static/nuxt-app.png)

## Tricky parts

Here are some of the parts of migrating that I need to think about:

- Disqus comments
- Google analytics
- Converting layouts/includes to Vue components
- Mapping random projects to Nuxt (such as n x n tic-tac-toe in React)
- Static assets
- Safely moving/removing files from the Jekyll site

## Issues

- Tailwind removes markdown styles in blog articles from nuxt/content (solved by adding some extra css with [this](https://github.com/iandinwoodie/github-markdown-tailwindcss/blob/master/markdown.css))

- No support for automatically adding markdown anchors (GitHub Flavored Markdown supports this)

## Things to Add

- Sitemap
- Redirects from old blog for content carried over
