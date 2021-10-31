---
title: How and why I added AdSense and an AdBlock blocker to my personal blog
date: '2021-10-30'
description: This article describes how I added AdSense and how I request that site visitors not use AdBlock
image: /static/dev-sites.png
tags:
  - nuxt
  - ads
  - adsense
showOnAdblock: true

external:
  - link: https://news.ycombinator.com/item?id=28740415
    site: hn
  - link: https://www.reddit.com/r/webdev/comments/q0qc3l/how_i_write_and_share_technical_software/
    site: reddit
  - link: https://dev.to/briancaffey/how-i-write-and-share-technical-software-development-articles-in-2021-27n2
    site: dev
  - link: https://medium.com/@briancaffey/how-i-write-and-share-technical-software-development-articles-in-2021-8168d3871bf9
    site: medium
  - link: https://briancaffey.hashnode.dev/how-i-write-and-share-technical-software-development-articles-in-2021
    site: hashnode
  - link: https://briancaffey.substack.com/p/how-i-write-and-share-technical-software
    site: substack
  - link: https://hackernoon.com/how-to-get-your-dev-blog-noticed-in-2021
    site: hackernoon

comments: true
---

If you are readying this article on [briancaffey.github.io/2021/10/31/how-and-why-i-added-adsense-and-adblock-blocker-to-my-website](https://briancaffey.github.io/2021/10/31/how-and-why-i-added-adsense-and-adblock-blocker-to-my-website), then you will be prompted to turn off your ad blocker if you are using one.

This article will describe my process of adding ads to my site with AdSense, and how I request that site visitors not use AdBlock.

## How I added AdSense to my site

I have been enjoying using my GitHub Pages website to learn more about static sites, JAMStack and Nuxt.js. I have been able to learn and implement a lot of different components and features, and I have tried to write about them in my blog. Some examples include:

- Adding a Drift chat window so users can message me directly
- Implementing a Contact form with formsubmit.io
- Using Vue.js components in Markdown files to add interactive elements to my articles (such as graphs)
- Adding a custom MailChimp newsletter sign-up form that is included in the footer of each page of my blog

I have also been learning the suite of Google tools for monitoring and measuring traffic to my site, including Google Analytics and Google Search Console. Google Search Console is helpful for understanding the search terms that people are using when searching Google that result in organic traffic to my site.

At one point I found out that another website was using the same Google Tracking code that I had previously hard-coded into an old version of my website, and my Google Analytics started measuring traffic to URLs that I didn't recognize as belonging to my site. I was able to fix this by adding a Hostname filter rule in Google Analytics.

One area that I have not had any experience with until recently is Google AdSense. Google AdSense is an easy way to get started with selling ads on your website. I wanted to get started with AdSense, so I did the following to get started:

- Adding a site in Google Analytics
- Installing the Google AdSense plugin for NuxtJS

## How I built an AdBlock detector for my site