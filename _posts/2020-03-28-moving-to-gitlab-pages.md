---

layout: post
title: Moving this blog from GitHub Pages to GitLab Pages
date: 2020-03-28
comments: true

---

This post is about moving this blog from github pages to gitlab pages.

## Why

I prefer using GitLab pages and GitLab CI. Also, I would like to migrate this site to a Vue.js-based statis site generator, such as VuePress, Nuxt or something similar. This should allow me to use the same markdown files for articles, but it may require changing image links and other static content.

I may only move some articles over from the GitHub Pages site and start fresh with a new blog in GitLab CI.

## Disqus

I currently use Disqus for the comments on my blog. It would be nice if I could get the comments to migrate seemlessly.

## Get Started

1. Create a new repo in GitLab called `briancaffey.gitlab.io`
1. Add a `.gitlab-ci.yml` file to the root of this repo.