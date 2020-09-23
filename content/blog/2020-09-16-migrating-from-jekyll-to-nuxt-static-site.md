---
layout: post
title: Migrating my personal GitHub pages blog from Jekyll to Nuxt
date: 2020-09-17
comments: true
image: /static/nuxt-app.png
---

Jekyll has served me well for a long time, but I've decided to switch the static site generator I use for my personal blog from Jekyll to Nuxt. This article will hopefully be the first new article in my Nuxt blog.

Here are some goals for what I want to do with this new site:

- Learn more about Nuxt and Nuxt Content, JAM Stack and static site generation
- Master TailwindCSS for building responsive layouts
- Better understand and measure SEO for my site and the content I publish on it

## Creating a nuxt project

I'm going to start off with a `feature-nuxt` feature branch. Since I can't create the nuxt project in a non-empty directory, I'll create a new nuxt project in a folder called `nuxt`:

```txt
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

Starts my project on `localhost:3000`:

![Nuxt app](/static/nuxt-app.png)

## Tricky parts

Here are some of the parts of migrating that I need to think about:

- **Disqus comments**: I previously based the `disqus_identifier` used to link Disqus threads to specific pages on Jekyll's page URLs (of the form `/YYYY/MM/DD/name-of-article.html`). I could transform the slug value with a hook in `nuxt.config.js`, or manually add a `disqus_identifier` value to the frontmatter of markdown files.
- **Static Content**: In Jekyll I had static content in a few different places. With Nuxt, all static content will live under the top level folder `/static` that is mapped to the root URL where my site is hosted. Since I had lots of content under `/static` in my Jekyll site, such as `/static/my-image.png`, I ended up putting conent in `/static/static`, hopefully this won't be too confusing.

## Nuxt Community

There are a lot of great packages from the [`nuxt-community`](https://github.com/nuxt-community) GitHub organization that are widely used in many Nuxt projects. Here are a few of the Nuxt community plugins and other Nuxt extensions that I have used so far:

- [nuxt/content](https://content.nuxtjs.org/): an official Nuxt project that provides a Git-based Headless CMS
- `@nuxtjs/tailwindcss`
- `@nuxtjs/color-mode`
- `@nuxtjs/google-analytics`
- `@nuxtjs/sitemap`
- `@nuxtjs/feed`

## Issues

- Tailwind removes markdown styles in blog articles from nuxt/content (solved by adding some extra css with [this](https://github.com/iandinwoodie/github-markdown-tailwindcss/blob/master/markdown.css))
- No support for automatically adding markdown anchors (GitHub Flavored Markdown supports this)
- Not able to do true server-side redirects, but you can do something like this: [https://github.com/nuxt-community/redirect-module/issues/1#issuecomment-615070920](https://github.com/nuxt-community/redirect-module/issues/1#issuecomment-615070920)

## TODO

- Add tags, categories, search to blog
