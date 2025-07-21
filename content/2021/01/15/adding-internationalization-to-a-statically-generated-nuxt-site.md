---
title: Adding internationalization to a statically generated Nuxt site
date: '2021-01-15'
description: This article will summarize my experience implementing internationalization (i18n) for a statically-generated Nuxt.js site
image: /static/emoji_flags.png
tags:
  - i18n
  - vue
  - nuxt
---

This article will give an overview of my experience adding internationalization to my statically-generated Nuxt website.

Since I migrated my site from Jekyll to Nuxt, I have had issues with my blog post URLs. My Jekyll site automatically generated URLs that included the date:

```
https://my-site.com/2021/01/01/my-first-blog-post-of-2021
```

To replicate this URL pattern with Nuxt, I have had to use some advanced features of the content API and Nuxt configuration options, as well as an awkward folder structure.

Because of this, I will be implementing internationalization in to phases: first I'll work on translating the core pages, next I'll work on setting up translations for individual blog posts. I don't plan on translating most of my blog posts, and in some cases I might only be providing translations for some of the locales that my site supports, falling back to the English version where a given locale is not available.
