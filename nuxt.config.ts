// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      url: 'https://briancaffey.github.io'
    }
  },
  content: {
    build: {
      markdown: {
        highlight: {
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
            default: 'github-light',
            dark: 'github-dark',
            sepia: 'monokai'
          }
        }
      }
    }
  },
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  app: {
    // baseURL: process.env.BASE_URL || 'https://briancaffey.github.io',
    // pageTransition: { name: 'page', mode: 'in-out' }
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      title: 'Brian Caffey',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: "Brian Caffey's personal website"
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/montserrat-latin.woff2', crossorigin: 'anonymous' }
      ]
    },
  },
  site: {
    url: "https://briancaffey.github.io",
    name: "briancaffey.github.io"
  },

  /*
   ** Global CSS
   */
  css: [
    '~/assets/css/main.css',
  ],

  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/disqus',
    { src: '~/plugins/apexcharts', mode: 'client' },
    { src: '~/plugins/drift', mode: 'client' }
  ],

  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: [
    '~/components/ui',
    '~/components/blog',
    '~/components/icons',
    '~/components'
  ],

  /*
   ** Nuxt.js modules
   */
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
    // '@nuxtjs/feed',
  ],

  tailwindcss: {
    // Without this the module looks beside the project root, misses the file
    // under app/, and silently falls back to its built-in stylesheet.
    cssPath: '~/assets/css/tailwind.css'
  },

  gtag: {
    id: 'G-S8TVBBMW66'
  },

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

  devServer: {
    port: 3000,
    host: '0.0.0.0'
  },

  i18n: {
    vueI18n: "./i18n.config.ts",
    strategy: 'no_prefix',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        emoji: 'flag-us',
        language: 'en-US',
        file: 'i18n/en-US.ts',
        name: 'English',
        flag: '🇺🇸'
      },
      {
        code: 'fr',
        emoji: 'flag-fr',
        language: 'fr-FR',
        file: 'i18n/fr-FR.ts',
        name: 'Français',
        flag: '🇫🇷'
      },
      {
        code: 'zh',
        emoji: 'flag-cn',
        language: 'zh-CN',
        file: 'i18n/zh-ZH.ts',
        name: '简体中文',
        flag: '🇨🇳'
      },
      {
        code: 'ru',
        emoji: 'flag-ru',
        language: 'ru-RU',
        file: 'i18n/ru-RU.ts',
        name: 'Русский',
        flag: '🇷🇺'
      },
      {
        code: 'ja',
        emoji: 'flag-jp',
        language: 'ja-JP',
        file: 'i18n/jp-JP.ts',
        name: '日本語',
        flag: '🇯🇵'
      },
      {
        code: 'in',
        emoji: 'flag-in',
        language: 'hi-IN',
        file: 'i18n/hi-IN.ts',
        name: 'हिंदी',
        flag: '🇮🇳'
      }
    ]
  },
  compatibilityDate: '2024-08-08',
})
