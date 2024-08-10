import { defineNuxtConfig } from 'nuxt/config'
import { queryContent } from '@nuxt/content';
const { resolve } = require('path');

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      url: 'https://briancaffey.github.io'
    }
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  env: {
    baseUrl: process.env.BASE_URL || 'https://briancaffey.github.io'
  },
  // app: {
  //   pageTransition: { name: 'page', mode: 'in-out' }
  // },
  site: {
    url: 'https://briancaffey.github.io',
    name: "Brian Caffey's personal website"
  },

  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'static',

  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    htmlAttrs: {
      lang: 'en'
    },
    title: 'Brian Caffey',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: "Brian Caffey's personal website"
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/main.css',
    // '~/assets/css/transitions.css'
  ],

  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/disqus',
    { src: '~/plugins/apexcharts', mode: 'client' },
    // { src: '~plugins/drift.js', mode: 'client' }
  ],

  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: [
    '~/components/icons',
    '~/components'
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // [
    //   '@nuxtjs/google-analytics',
    //   {
    //     id: 'UA-75060954-1'
    //   }
    // ]
  ],

  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    // '@nuxtjs/axios',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@nuxt/eslint',
    'nuxt-gtag',
    // Doc: https://www.npmjs.com/package/@nuxtjs/sitemap
    '@nuxtjs/sitemap',
    // '@nuxtjs/feed',
    // 'nuxt-i18n'
    // ['@nuxtjs/google-adsense', {
    //   id: 'ca-pub-4924597640144289'
    // }]
  ],

  /*
   ** Content module configuration
   ** See https://content.nuxtjs.org/configuration
   */
  content: {
    highlight: {
      // https://shiki.matsu.io/languages#bundled-languages
      langs: [
        "py",
        "python",
        "bash",
        "cpp",
        "yaml",
        "yml",
        "powershell",
        "json",
        "sql",
        "html",
        "vue-html",
        "javascript",
        "js",
        "php",
        "dockerfile",
        "docker",
        "make",
        "makefile",
        "typescript",
        "ts",
        "terraform"

      ],
      theme: {
        // Default theme (same as single string)
        default: 'github-light',
        // Theme used if `html.dark`
        dark: 'github-dark',
        // Theme used if `html.sepia`
        sepia: 'monokai'
      }
    }

  },

  gtag: {
    id: 'G-S8TVBBMW66'
  },

  hooks: {
    'content:file:beforeInsert': (document) => {
      if (document.extension === '.md') {
        const raw = document.text
        document.raw = raw
      }
    },
    // 'pages:extend' (routes) {
    //   routes.push({
    //     path: '/:year/:month/:day/:slug',
    //     component: resolve(__dirname, 'pages/[year]/[month]/[day]/[slug].vue')
    //   })
    // }
  },

  build: { transpile: ['emoji-mart-vue-fast'] },

  // todo(migration): add feed when it is supported by nuxt 3
  // for now, the feed is manually configured in public/feed.xml
  // https://nuxt.com/modules/feed
  // feed: [
  //   // A default feed configuration object
  //   {
  //     path: '/feed.xml', // The route to your feed.
  //     async create (feed) {
  //       feed.options = {
  //         title: 'briancaffey.github.io',
  //         link: 'https://briancaffey.github.io/feed.xml',
  //         description: 'RSS feed for briancaffey.github.io'
  //       }
  //       const { $content } = require('@nuxt/content')
  //       const articles = await $content({ deep: true, text: true })
  //         .only(['title', 'body', 'date', 'slug', 'description', 'path'])
  //         .where({ draft: { $ne: true } })
  //         .sortBy('date', 'desc')
  //         .fetch()
  //       articles.forEach((article) => {
  //         feed.addItem({
  //           title: article.title,
  //           id: article.url,
  //           link: `https://briancaffey.github.io${article.path}`,
  //           description: article.description
  //           // content: article.text,
  //         })
  //       })

  //       feed.addCategory('Nuxt.js')

  //       feed.addContributor({
  //         name: 'Brian Caffey',
  //         email: 'briancaffey2010@gmail.com',
  //         link: 'https://briancaffey.github.io'
  //       })
  //     }, // The create function (see below)
  //     cacheTime: 1000 * 60 * 15, // How long should the feed be cached
  //     type: 'rss2', // Can be: rss2, atom1, json1
  //     data: [''] // Will be passed as 2nd argument to `create` function
  //   }
  // ],

  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  i18n: {
    vueI18n: "./i18n.config.js",
    strategy: 'prefix_except_default',
    defaultLocale: 'en',
    locale: 'en',
    locales: [
      {
        code: 'en',
        emoji: 'flag-us',
        iso: 'en-US',
        file: 'i18n/en-US.js',
        name: 'English',
        flag: '🇺🇸'
      },
      {
        code: 'fr',
        emoji: 'flag-fr',
        iso: 'fr-FR',
        file: 'i18n/fr-FR.js',
        name: 'Français',
        flag: '🇫🇷'
      },
      {
        code: 'zh',
        emoji: 'flag-cn',
        iso: 'zh-ZH',
        file: 'i18n/zh-ZH.js',
        name: '简体中文',
        flag: '🇨🇳'
      },
      {
        code: 'ru',
        emoji: 'flag-ru',
        iso: 'ru-RU',
        file: 'i18n/ru-RU.js',
        name: 'Русский',
        flag: '🇷🇺'
      },
      {
        code: 'jp',
        emoji: 'flag-jp',
        iso: 'jp-JP',
        file: 'i18n/jp-JP.js',
        name: '日本語',
        flag: '🇯🇵'
      },
      {
        code: 'in',
        emoji: 'flag-in',
        iso: 'hi-IN',
        file: 'i18n/hi-IN.js',
        name: 'हिंदी',
        flag: '🇮🇳'
      }
    ]
  },
  compatibilityDate: '2024-08-08'
})
