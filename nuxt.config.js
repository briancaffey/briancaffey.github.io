export default {
  env: {
    baseUrl: process.env.BASE_URL || 'https://briancaffey.github.io'
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
  css: ['@/assets/css/main.css', '@/assets/css/transitions.css'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    '~/plugins/disqus',
    '~/plugins/filters',
    { src: '~/plugins/apexcharts', mode: 'client' },
    { src: '~plugins/drift.js', mode: 'client' }
  ],
  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-75060954-1'
      }
    ]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // Doc: https://github.com/nuxt/content
    '@nuxt/content',
    // Doc: https://www.npmjs.com/package/@nuxtjs/sitemap
    '@nuxtjs/sitemap',
    '@nuxtjs/feed',
    'nuxt-i18n'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL:
      process.env.NODE_ENV === 'production'
        ? 'https://briancaffey.github.io'
        : 'http://localhost:3000'
  },
  /*
   ** Content module configuration
   ** See https://content.nuxtjs.org/configuration
   */
  content: {},
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */

  hooks: {
    'content:file:beforeInsert': (document) => {
      // if (document.path.startsWith('/blog/')) {
      //   let date = document.slug.substring(0, 10)
      //   date = date.replace(/-/g, '/')
      //   const url = date + '/' + document.slug.substring(11) + '.html'
      //   document.url = url
      //   document.slug = document.slug + '.html'
      //   document.path = document.path + '.html'
      // }
      if (document.extension === '.md') {
        const raw = document.text
        document.raw = raw
      }
    }
  },
  build: {},

  sitemap: {
    hostname: 'https://briancaffey.github.io',
    routes: async () => {
      const { $content } = require('@nuxt/content')

      const posts = await $content({ deep: true })
        .only(['path', 'draft'])
        .where({ draft: { $ne: true } })
        .fetch()
      const projects = await $content('projects').only(['path']).fetch()

      return []
        .concat(
          ...posts
            .filter(x => !x.path.startsWith('/projects/'))
            .map(w => w.path)
        )
        .concat(...projects.map(p => p.path))
    }
  },

  feed: [
    // A default feed configuration object
    {
      path: '/feed.xml', // The route to your feed.
      async create (feed) {
        feed.options = {
          title: 'briancaffey.github.io',
          link: 'https://briancaffey.github.io/feed.xml',
          description: 'RSS feed for briancaffey.github.io'
        }
        const { $content } = require('@nuxt/content')
        const articles = await $content({ deep: true, text: true })
          .only(['title', 'body', 'date', 'slug', 'description', 'path'])
          .where({ draft: { $ne: true } })
          .sortBy('date', 'desc')
          .fetch()
        articles.forEach((article) => {
          feed.addItem({
            title: article.title,
            id: article.url,
            link: `https://briancaffey.github.io${article.path}`,
            description: article.description
            // content: article.text,
          })
        })

        feed.addCategory('Nuxt.js')

        feed.addContributor({
          name: 'Brian Caffey',
          email: 'briancaffey2010@gmail.com',
          link: 'https://briancaffey.github.io'
        })
      }, // The create function (see below)
      cacheTime: 1000 * 60 * 15, // How long should the feed be cached
      type: 'rss2', // Can be: rss2, atom1, json1
      data: [''] // Will be passed as 2nd argument to `create` function
    }
  ],

  server: {
    port: 3000,
    host: '0.0.0.0'
  },

  generate: {
    dir: 'docs',
    async routes () {
      const { $content } = require('@nuxt/content')

      const posts = await $content({ deep: true }).only(['path']).fetch()
      return posts.map(x => x.path)
    }
  },
  router: {
    extendRoutes (routes, resolve) {
      routes.push({
        path: '/:year/:month/:day/:slug',
        component: resolve(__dirname, 'pages/_year/_month/_day/_slug.vue')
      })
    }
  },
  i18n: {
    vueI18n: {
      fallbackLocale: 'en'
    },
    defaultLocale: 'en',
    parsePages: false,
    detectBrowserLanguage: false,
    seo: false,
    lazy: true,
    vuex: {
      moduleName: 'i18n',
      syncLocale: false,
      syncMessages: false,
      syncRouteParams: true
    },
    langDir: 'i18n/',
    locales: [
      {
        code: 'en',
        emoji: 'flag-us',
        iso: 'en-US',
        file: 'en-US.js',
        name: 'English',
        flag: '🇺🇸'
      },
      {
        code: 'fr',
        emoji: 'flag-fr',
        iso: 'fr-FR',
        file: 'fr-FR.js',
        name: 'Français',
        flag: '🇫🇷'
      },
      {
        code: 'zh',
        emoji: 'flag-cn',
        iso: 'zh-ZH',
        file: 'zh-ZH.js',
        name: '简体中文',
        flag: '🇨🇳'
      },
      {
        code: 'ru',
        emoji: 'flag-ru',
        iso: 'ru-RU',
        file: 'ru-RU.js',
        name: 'Русский',
        flag: '🇷🇺'
      },
      {
        code: 'jp',
        emoji: 'flag-jp',
        iso: 'jp-JP',
        file: 'jp-JP.js',
        name: '日本語',
        flag: '🇯🇵'
      },
      {
        code: 'in',
        emoji: 'flag-in',
        iso: 'hi-IN',
        file: 'hi-IN.js',
        name: 'हिंदी',
        flag: '🇮🇳'
      }
    ]
  }
}
