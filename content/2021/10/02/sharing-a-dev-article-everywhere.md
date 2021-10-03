---
title: How I write and share technical software development articles in 2021
date: '2021-10-02'
description: This article describes how to write and share technical articles in 2021
tags:
  - nuxt
  - vue
  - publishing
  - writing
external:
  - link: https://news.ycombinator.com/
    site: hn
  - link: https://reddit.com
    site: reddit
  - link: https://dev.to
    site: dev
  - link: https://medium.com
    site: medium
  - link: https://briancaffey.hashnode.com
    site: hashnode
  - link: https://briancaffey.substack.com
    site: substack
  - link: https://hackernoon.com/
    site: hackernoon
draft: true
---

This article describes how I write and share technical articles on my personal website and other websites.

This article is broken into three sections:

1. How I use Nuxt.js to build my personal website
2. How I share my articles on other development article aggregators
3. Bonus content, project plug and conclusion

## Building `briancaffey.github.io` with Nuxt.js

I first started writing my personal website on GitHub pages using a static website builder called [Jekyll](https://jekyllrb.com/docs/github-pages/). Jekyll is a great tool for getting started with building a personal portfolio or technical blog, and it served me well for several years. I eventually changed my static site generation tool from Jekyll to Nuxt since I wanted to learn more about Vue.js. Also, I don't know Ruby very well, and it was difficult for me to use the Jekyll templating language.

### GitHub Pages

I host my website on GitHub pages at the following domain: [briancaffey.github.io](https://briancaffey.github.io). GitHub pages is a great way to host a public site. The subdomain, `briancaffey` in my case, is your GitHub username. GitHub pages will serve content from a specified branch and nested folder. My website use the branch `gh-pages` and the root folder `/`.

### GitHub Actions

I use GitHub actions to deploy my website to GitHub pages. Here's the file that sets up the GitHub action that builds and deploys my site:

```
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

When changes are pushed to the `master` branch, this script runs. It builds the site with `yarn generate` and then the `peaceiris/actions-gh-pages@v3` commits only the build artifacts to the `gh-pages` branch where the content is served on `briancaffey.github.io`.

### Nuxt.js Framework

Nuxt.js is a versatile Vue.js framework. It can be used to build several different types of websites, including Server Side Rendered (SSR) websites, single page applications (SPA) and static websites. I use the last option, also called Server Side Generation (SSG).

### Content API

Nuxt has a module called [Content API](https://nuxtjs.org/api/content-api) that allows you to do the following:

- write articles in Markdown
- Use Vue components in Markdown
- write custom frontmatter that can be used to query Markdown articles using an API

### Articles and Folder Structure

Nuxt uses a folder structure that automatically generates routes. Here is the folder structure for my personal website's repository:

```
$ tree -L 1 .
.
├── README.md
├── assets  <-- compiled assets
├── components <-- Vue components used in the site
├── content  <-- contains Markdown files for articles
├── i18n  <-- contains translations
├── jsconfig.json
├── layouts  <-- layouts used for each page
├── middleware  <-- I'm not using this folder
├── node_modules
├── nuxt.config.js  <-- config file
├── package.json
├── pages  <-- directory structure defines URLs for site pages
├── plugins  <-- plugins
├── static  <-- files in this folder are served as-is
├── store  <-- Vuex store
├── tailwind.config.js
└── yarn.lock
```

The content folder has the following structure:

```
$ tree -L 3 content
content/
├── 2016
│   └── 04
│       └── 07
│           └── my-article.md
├── 2017
│   ├── 01
│   │   └── 01
│           └── my-other-article.md
...
└── projects
│   └── my-project.md
```

This will produce the following routes:

- `/2016/04/07/my-article.html`
- `/2017/01/01/my-other-article.html`
- `/projects/my-project.html`

Here's the folder structure for the `pages` directory:

```
$ tree -L 4 pages
pages
├── README.md
├── _year
│   └── _month
│       └── _day
│           └── _slug.vue
├── blog
│   ├── index.vue
│   └── tags
│       ├── _tag.vue
│       └── index.vue
├── confirm-subscription.vue
├── contact
│   └── index.vue
├── drafts
│   └── index.vue
├── index.vue
├── projects
│   ├── _slug.vue
│   └── index.vue
└── thank-you.vue
```

Directories in side of the `pages` directory starting with an underscore (like `_year`) can be used as URL parameters.

### Markdown and Vue Components

One nice feature of Nuxt and the Nuxt Content module is the ability to use Vue components in Markdown files. Here's an example of a Vue component in a Markdown file:

```
# Markdown with Vue components

This is some content

<my-component />

This is more content.
```

Vue components used in Markdown files must be included in the `components/global` directory.

### Images

Images are an important part of the articles that I write. Each article has an optional cover image. I try to include a cover image for each of the articles I write. I mostly use Gimp to create the cover images.

Including images in the body of an article is pretty simple on my personal site. First I need to add the image to the `static` directory, and then I can reference that image using the following syntax:

```
![alt text](/static/path/to/my-image.png)
```

### frontmatter

Frontmatter is a way to define metadata for a Markdown file. It is used to define the title, description, and other metadata that can be used to query articles.

Here's whe frontmatter for this article on my personal site [briancaffey.github.io/2021/10/02/sharing-a-dev-article-everywhere](https://briancaffey.github.io/2021/10/02/sharing-a-dev-article-everywhere):

```yml
---
title: How I write and share technical development articles in 2021
date: '2021-10-02'
description: This article describes how to write and share technical articles in 2021
tags:
  - nuxt
  - vue
  - publishing
  - writing
draft: true
---
```

- OpenGraph & Social Sharing
- Links to other outlets
- Meta tags
- Article tags

### Nuxt Sitemap

Using the `@nuxt/sitemap` module

### RSS Feed

An RSS Feed is configured using another official Nuxt plugin called `@nuxtjs/feed`. This plugin generates an RSS feed for the site in XML. An RSS feed can be used to automatically publish articles to other sites, I'll show this in the next section of this article.

### Google Analytics

Google Analytics is used to track site traffic. It is an important tool for me to get insights into what content is popular, where my users are visiting from, how long people spend browsing my site and other helpful metrics. It is likely that many readers of my site may have disabled Google Analytics in their browsers.

### Google Search Console

Google Search Console is another tool that is helpful from an SEO perspective.

Here is an report from Google Data Studio showing some some of the metrics that I use to analyze my site's traffic:

<style>
  .google-data-studio {
position: relative;
padding-bottom: 56.25%;
padding-top: 30px; height: 0; overflow: hidden;
}

.google-data-studio iframe,
.google-data-studio object,
.google-data-studio embed {
position: absolute;
top: 0;
left: 0;
width: 100%;
height: 100%;
}
</style>
<div class="google-data-studio">
<iframe width="600" height="450" src="https://datastudio.google.com/embed/reporting/1da052a4-6d61-4dac-b85d-5e9efed870af/page/6zXD" frameborder="0" style="border:0" allowfullscreen></iframe>
</div>


### MailChimp

I use MailChimp to build a newsletter audience. I'll be sending out a newsletter to my current audience with an update about this article. I wrote an article about how to set up MailChimp on Nuxt. I wrote an article on my blog about how I set up a form for guests to sign up for a newsletter using a MailChimp form: [https://briancaffey.github.io/zh/2020/10/10/how-to-add-email-signup-form-to-nuxt-site-with-mailchimp.html](https://briancaffey.github.io/zh/2020/10/10/how-to-add-email-signup-form-to-nuxt-site-with-mailchimp.html)

### formsubmit.co

Site visitors can send me messages through an online form called [formsubmit.co](https://formsubmit.co). I include this form on my site's [Contact](https://briancaffey.github.io/contact) page.

### Drift

Drift is a service that allows site visitors to send messages to you (the site owner) in real time. It's a great way to get in touch with your site visitors, and it can be configured to send messages to the Drift App (mobile app) or to your email address.

### Drafts

One option in the frontmatter for my blog articles is `draft`. If an article has `draft: true`, then the article will not be listed on the main list of blog articles on my site, and the page will not be indexed by Google. Here's where you can find the draft articles for my site: [https://briancaffey.github.io/drafts](https://briancaffey.github.io/drafts). The articles here can be accessed publicly, but I only show them on the `/drafts` page which is not listed anywhere else on my site.

## Publishing on other outlets

Nuxt has a lot of interesting features like embedding Vue components and images. When publishing articles from my personal website on other sites, I make sure that custom content is either removed or replaced with a link or static image that I can upload to the other site while editing the article.

For example, this article includes an embedded Google Data Studio report in the version that is published on `briancaffey.github.io`. This embedded iframe will not work when posted to other platforms, so I can instead link to an anchor tag that corresponds to the location of the custom element on my site.

For this article, I have mostly tried to keep the custom content to a minimum so that it will be easy to cross publish on other sites without having to make lots of edits to the markdown. Most of the tweaking will likely have to do with preview images and other custom frontmatter properties that some site (like DEV.to) support.

### DEV.to

[DEV.to](https://dev.to) is a popular site for sharing technical articles. They allow you to automatically draft articles to publish on their site by adding your site's RSS feed. This article will be published on DEV.to through the RSS feed connection that my account has with DEV.to.

DEV.to articles support their own custom frontmatter properties. Here's what the frontmatter for the DEV.to article looks like:

```
<add DEV.to article frontmatter>
```

### Medium

I haven't published anything on Medium, so one of my goals for this article is to cross publish it on Medium in my first article on that platform.

### Hashnode

Hashnode seems like a newer version of DEV.to.

### Hacker Noon

Hacker Noon is another plaform that I haven't used before as a writer, but one that I'm aiming to publish on with this article!

### Reddit

I have shared a lot of content on different programming subreddits specific to some of the tools and frameworks I use, such as `r/aws` and `r/django`. When sharing on reddit, I like to share links to my personal website with at least on comment that provides a detailed summary of the article. When sharing on

### Facebook

Facebook has very large and active developer communities. Sometimes the communities are more fragmented than the communities on reddit. For example, there are several Nuxt communities on Facebook, but there is just one `r/nuxtjs`. Similar to sharing content on reddit, I like to share links to my personal websites with detailed comments on the content of my article.

### Discord Servers

Discord also has some dedicated servers for software frameworks, such as Nuxt.js. Discord seems to be the official place where Vue.js community members chat in real-time. There are dedicated channels on the server for sharing articles.

## Bonus content, project plug and conclusion

One more great thing about GitHub pages is that you can publish a site on any of your GitHub repositories that will be hosted on a subpath of your GitHub pages blog.

I have been working updating and rewriting my Django + Vue.js + AWS reference project. It contains a documentation site that I am making with VuePress. The repo for this project is here: [github.com/briancaffey/django-step-by-step](https://github.com/briancaffey/django-step-by-step). This repository has it's own GitHub Pages configuration, as well as a GitHub Action to help automate the deployment of this project documentation site to GitHub Pages. The project site is currently hosted on [briancaffey.github.io/django-step-by-step/](https://briancaffey.github.io/django-step-by-step/).

You may want to split a large project's documentation site into its own site, rather than having it live on the nested path of a personal blog. Following this pattern, your GitHub pages blog can become a site that is much larger than one single Nuxt statis site. `briancaffey.github.io` is now a hybrid Nuxt.js and VuePress site, with a subset of routes (starting with /django-step-by-step/) being served by VuePress.

Thanks for reading this article, wherever you may have found it on the internet!