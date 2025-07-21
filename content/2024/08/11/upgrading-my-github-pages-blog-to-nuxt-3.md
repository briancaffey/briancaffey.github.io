---
title: "Upgrading my GitHub Pages blog to Nuxt 3"
date: '2024-08-11'
description: "An overview of my newly upgraded GitHub Pages blog powered by Nuxt 3"
image: /static/nuxt/new-site.png
tags:
  - vue
  - nuxt
  - github
  - pinia

# draft: true

# external:
#   - link: https://x.com/briancaffey/
#     site: x

comments: true
---

## Blog history

My personal website has always lived on GitHub Pages at [`briancaffey.github.io`](https://briancaffey.github.io). The first version was built with the Jekyll framework. I started learning about Vue, and Nuxt seemed like an interesting alternative to Jekyll that would allow me to practice frontend development. In September 2020 I deployed the first version of the new site using Nuxt 2 and Vue 2.

I recently went through the process of upgrading from Nuxt 2 to Nuxt 3. This upgrade path also included an upgrade from Vue 2 to Vue 3. My previous attempts to upgrade this site from Nuxt 2 to Nuxt 3 failed because of error messages that I couldn't work through. This time, with a big help from AI, I got through the entire upgrade and learned a lot in the process. I'm happy to share my new blog that is powered by Vue 3, Nuxt 3 and Nuxt Content v2!

This article will go over the features of my site, how I'm using Nuxt and Vue and some of the changes I had to make when doing the upgrade. Let's go!

![New site powered by Nuxt 3, Tailwind and Pinia](/static/nuxt/nuxt3.png)

## Features of my blog

### Modules and plugins overview

Here are the modules and plugins I use on my site defined in `nuxt.config.js`:

```javascript
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxt/image',
    'nuxt-gtag',
    // '@nuxtjs/feed', --> this module is not yet supported in Nuxt 3!
  ],

  plugins: [
    '~/plugins/disqus',
    { src: '~/plugins/apexcharts', mode: 'client' },
    { src: '~/plugins/drift', mode: 'client' }
  ]
})
```

### Nuxt Content

The Nuxt Content module is a powerful git-based CMS. Articles on my site are written in Markdown files that contains frontmatter like the following:

```yaml
---
title: "Upgrading my GitHub Pages blog to Nuxt 3" # used on the page and in the <head> metadata
date: '2024-08-11'
description: "An overview of my newly upgraded GitHub Pages blog powered by Nuxt 3"
image: /static/nuxt/nuxt3.png # cover image and og:image + twitter:image
tags: # tags are used to categorize and navigate content
  - vue
  - nuxt
  - github
  - pinia

draft: true # drafts are publicly available but not displayed in the list of blog articles and not indexed

external: # a list of external links where the article has been shared or republished
  - link: https://x.com/briancaffey/status/abc123
    site: x

comments: true # shows disqus comments
---
```

Files for articles are stored in `/content/[year]/[month]/[day]/[slug].md`, and the URLs for the articles are `/${year}/${month}/${day}/${slug}`. This URL scheme was used in the Jekyll blog on my GitHub Pages site and kept this URL structure when I switched to Nuxt.

`contentQuery` is used for getting content from Nuxt Content. Here's a comparison of the old and new way of fetching data from Nuxt content.

Old way using `asyncData`:

```html
<script>
export default {
  async asyncData ({ $content, params }) {
    const file = `${params.year}/${params.month}/${params.day}/${params.slug}`
    const article = await $content(file).fetch()
    return { article }
  }
}
</script>
```

Here's the new way of fetching content using `useAsyncData` with `<script setup>` syntax:

```html
<script setup>
const route = useRoute();
const { year, month, day, slug } = route.params;
const page = `/${year}/${month}/${day}/${slug}`;
const { data: article } = await useAsyncData(route.params.slug, () =>
  queryCollection(page).findOne()
);
</script>
```

Note: using `route.param.slug` as the first argument for `useAsyncData` is important when using `useAsyncData`. I initially misunderstood the statement about this needing to be a unique value and I gave it a value of `article`, but this caused a strange cache issue when I viewed different articles. The problem didn't show when I was developing with `yarn dev`, it only showed up when I built the site and served in locally with `yarn generate && yarn serve`. Since it is used in a dynamic page `[slug].vue`, it needs to have a unique value for every individual page for the dynamic route.

I learned about this from [an example](https://nuxt.com/docs/getting-started/upgrade#shared-prerender-data) on the Nuxt 3 site about migration to Nuxt 4:

```javascript
// This would be unsafe in a dynamic page (e.g. `[slug].vue`) because the route slug makes a difference
// to the data fetched, but Nuxt can't know that because it's not reflected in the key.
const route = useRoute()
const { data } = await useAsyncData(async () => {
  return await $fetch(`/api/my-page/${route.params.slug}`)
})
// Instead, you should use a key that uniquely identifies the data fetched.
const { data } = await useAsyncData(route.params.slug, async () => {
  return await $fetch(`/api/my-page/${route.params.slug}`)
})
```

Wow, there is already a Nuxt 4 in the works! Hopefully the upgrade process from Nuxt 3 to 4 is easier than Nuxt 2 to 3.

### Development process

- `yarn dev`
- `yarn clean && yarn generate && yarn serve`

When I want to run the site locally I run `yarn dev` which is an alias for `nuxt dev --host`. Adding the `--host` option is important for when you want to view the site on a mobile device. It provides a QR code that links directly to the local IP:

```
~/git/github/briancaffey.github.io$ yarn dev
yarn run v1.22.21
$ nuxt dev --host
Nuxt 3.12.4 with Nitro 2.9.7                                                   8:04:47 AM
                                                                               8:04:47 AM

              █▀▀▀▀▀▀▀█▀██▀▀███▀█▀▀▀▀▀▀▀█
              █ █▀▀▀█ ██▄ █▀  ███ █▀▀▀█ █
              █ █   █ ██▀█▀▄ ▄▄▄█ █   █ █
              █ ▀▀▀▀▀ █▀█ █ █▀█▀█ ▀▀▀▀▀ █
              █▀▀█▀▀█▀█▄▀  █▄▄▀▄█▀█████▀█
              █▀ ▄▀ ▄▀▄▄▄▀▀▄ ▀ ▄ ▀▀  ▄▄▀█
              █▄▄  ▀▀▀██ ▄  █▀▄▀ ▀█▄▄▄▄ █
              █ ▀▀▄▀█▀▄█ █▀▀▄█ ▀▀█▄▄▀▀ ▀█
              █ █▀▄▀▄▀ █▀▀▄▀▀▀█ ▀▀▀ █ ▀▄█
              █▀▀▀▀▀▀▀█▄ █ ▄▀ ▄ █▀█ ▀█▄▀█
              █ █▀▀▀█ █▀ ▀ ▀▄▄▀ ▀▀▀ ▀█▄▄█
              █ █   █ █▄▄█  █▀███▄▄▀▄▀  █
              █ ▀▀▀▀▀ █ ██ ▄█▀ ▀▄ ▄▄▀▄▄ █
              ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  ➜ Local:    http://localhost:3000/
  ➜ Network:  http://192.168.5.98:3000/ [QR code]

ℹ Using Tailwind CSS from ~/assets/css/tailwind.css          nuxt:tailwindcss 8:04:49 AM
  ➜ DevTools: press Shift + Option + D in the browser (v1.3.9)                 8:04:50 AM

ℹ Tailwind Viewer: http://localhost:3000/_tailwind/          nuxt:tailwindcss 8:04:50 AM
✔ Vite client built in 32ms                                                   8:04:51 AM
✔ Vite server built in 1286ms                                                 8:04:52 AM
✔ Nuxt Nitro server built in 1895 ms                                                            nitro 8:05:05 AM
ℹ Vite client warmed up in 0ms                                                                        8:05:05 AM
ℹ Vite server warmed up in 2186ms                                                                     8:05:07 AM
```

### Nuxt Dev Tools

[Nuxt DevTools](https://devtools.nuxt.com/guide/getting-started) is amazing! This is one of the best benefits of upgrading to Nuxt 3 for me.

![png](/static/nuxt/nuxt_dev_tools.png)

It is available in Nuxt 3.9.0 or higher.

### Vue 3 and Script setup

Vue 3 allows for a much more streamlined single file component syntax with `<script setup>`. For most of the component I did some minimal cleanup and then asked ChatGPT to convert the component script tag to use the new script setup syntax, and that worked very well!

### CI/CD

My blog is update using the following GitHub Action:

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
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Cache dependencies
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.os }}-node-

      - run: yarn
      - run: yarn build
      - run: yarn lint
      - run: yarn generate

      - name: deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: dist
```

When I upgraded to Nuxt 3, I needed to add the `yarn build` (`nuxt build`) step in order to run `yarn lint` (`eslint .`).

It takes about 3 minutes to build the site, most of that time is for building the HTML files for each route:

![GitHub Action for deploying briancaffey.github.io](/static/nuxt/gha.png)

```
[log] [nitro]   ├─ /sitemap.xml (26ms)
[info] [nitro] Prerendered 525 routes in 67.595 seconds
[success] [nitro] Generated public .output/public
[success] [nitro] You can preview this build using `npx serve .output/public`
[success] You can now deploy `.output/public` to any static hosting!
Done in 81.09s.
```

Shout out to GitHub user `peaceiris` for maintaining the `peaceiris/actions-gh-pages@v4` GitHub Action. `dist` is a symbolic link that links to `.output/public` where the static build files from `yarn generate` are stored.

![GitHub Action for deploying briancaffey.github.io](/static/nuxt/gha_deploy.png)

## Data-heavy articles

### Migrating from Vuex to Pinia

Most of my blog articles only include text and images. In some articles I include dynamic content through iframes to other projects on my GitHub that are deployed on subdomains of `briancaffey.github.io`. Another way to add dynamic content it to write Vue components and then embed those directly in the Nuxt Content Markdown files. I wrote [an article about data from YC's Work at a Startup jobs page](https://briancaffey.github.io/2021/01/16/i-scraped-analyzed-and-generated-yc-companies-founders-and-work-at-a-startup-job-postings) and made components that get data from a data store and then render that data using Apex Charts.

Previoulsy I had used Vuex to do this, but I switched to using Pinia which is Vue's new module for managing state. I use LLMs to convert the store module from Vuex to Pinia and also used LLMs to update the components that use the store, and it worked!

Setting up the plugin for Apex Charts looks like this:

```javascript
import VueApexCharts from 'vue3-apexcharts'

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(VueApexCharts)
});
```

## Lessons learned

### Embedding Tweets in Nuxt Content

The upgrade from Nuxt 2 to Nuxt 3 broke some twitter embeds that were working in Nuxt 2 (directly copy and pasting the embed code into a Nuxt Content Markdown file). Here's how I got it working for now:

- create a new global component in `components/content` ([example](https://github.com/briancaffey/briancaffey.github.io/blob/master/components/content/aoi/AgentsOfInferenceTweet.vue))
- convert the `<script>` tag in the embed code to a `<component>` tag and include the `:is="'script'"` (ES Lint will throw an error if you do not have the `v-bind:is`)
- include the component in your Markdown like this: `<MyComponent></MyComponent>` (`<MyComponent />` will not work, for me it would not render and also cut off the rest of the content from the page)
- The same process works for video embeds from 𝕏
- [This post on my GitHub Pages blog](https://briancaffey.github.io/2024/06/24/agents-of-inference-speed-of-light-nvidia-langchain-generative-ai-agents-developer-contest-update) uses an embedded tweet.

### Internationalization (i18n)

I added i18n to my site mostly to learn how it works. Nuxt i18n has different strategies for how different locales are displayed. Previously I used a URL prefix for all locales other than the default locale (English). Switching to other locales would switch from `/contact-me` to `/zh/contact-me` for example.

In this upgrade I switched to the `no_prefix` option which instead stores the locale in a cookie. This makes generating my site easier because it does not require generating a locale for each blog tag or blog article.

I currently do not have i18n for the articles on my blog, but I'm hoping to add this in a future update once there is better support for it in Nuxt Content.

## Lighthouse

I made a number of improvements to the site to get an almost-perfect Lighthouse score for the home page of my site:

![Lighthouse results for briancaffey.github.io](/static/nuxt/lighthouse.png)

- using `@nuxt/image` for optimized image formats (`webp`)
- adjust colors for improved contrast (measured using [webaim.org](https://webaim.org/resources/contrastchecker/))
- fixes for `head` metadata

## Interactivity

I use a few plugins for interactity on my site. These plugins needed some slight modifications and upgrades

### Drift

Drift is a chat box that lets users send me message. When someone sends me a message I can see what page of my website they are on and I can also see their location (based on their IP address). I get messages in the Drift app on my phone. In total I have had 320 conversations since I initially added the plugin a few years ago.

### MailChimp email list

I have an email list of 55 people that I manage through MailChimp. Occasionally I send out emails about new articles on my blog and other updates. It is a fun way to practice email marketing! It uses a global component in the `content/components` directory so I can use the `<Subscribe>` component here in the Markdown file where I am writing this article:

<br>
<Subscribe></Subscribe>
<br>

I also use this component in the footer of the site. Feel free to sign up to get updates about what I'm doing on this site!


### FormSubmit

FormSubmit is a free service that lets people send me a message through a form on my site's [Contact](/contact) page.

### Disqus

Disqus is a comments plugin that I use on my blog articles. I don't get a lot of comments, but comments are always welcome!

## TODO

### feed.xml

I need to find a way to automate `feed.xml` generation. [The feed module](https://nuxt.com/modules/feed) is not yet compatible with Nuxt 3. I do use the RSS feed with DEV.to which allows me to set up canonical links back to my GitHub Pages site.

For now I am going to copy the `feed.xml` to a file in the public directory and update it manually. Here's the entry I'll make for this article:

```html
		<item>
			<title>
				<![CDATA[ Upgrading my GitHub Pages blog to Nuxt 3 ]]>
			</title>
			<link>
				https://briancaffey.github.io/2024/08/11/upgrading-my-github-pages-blog-to-nuxt-3
			</link>
			<guid>
				https://briancaffey.github.io/2024/08/11/upgrading-my-github-pages-blog-to-nuxt-3
			</guid>
			<description>
				<![CDATA[ An overview of my newly upgraded GitHub Pages blog powered by Nuxt 3 ]]>
			</description>
		</item>
```

### Console errors

I have tried to clean up as many of the errors as I could, but there are stil some that I see in the dev console. Here is one of the issues that puzzles me:

`Hydration completed but contains mismatches.`: I only see this error on the production build; I don't see it when running `yarn dev`. As I understand, this error message means that the HTML that was built during prerendering is not the same as the HTML on the site once the Javascript has all been loaded.

### Build errors

I recently got some errors in my CI/CD pipeline related to the `string-width` package, and I was able to add the following to `package.json` to fix the build pipeline:

```javascript
  "resolutions": {
      "string-width": "4.2.3"
  }
```

I'm still not exactly sure what this is about.

### Refactoring

I like using TailwindCSS, and I was able to use it to build a responsive design for my site. After upgrading to Nuxt 3, I feel like most of the technical debt is now in the design. I also don't change the design that often, but I think I could do a lot to refactor the use of Tailwind, such as using `@apply` in CSS to make classes more DRY across the different components I use to build this site.

Please let me know if you have any questions, suggestions or tips for using Nuxt and Vue to build static prerendered sites. Thanks for reading!
