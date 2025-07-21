/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  theme: {
    extend: {
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Montserrat', 'sans-serif']
      }
    }
  },

  variants: {},
  plugins: [],
  // https://tailwindcss.com/docs/upgrade-guide#configure-content-sources
  content: [
    'components/**/*.vue',
    'layouts/**/*.vue',
    'pages/**/*.vue',
    'content/**/*.md',
    'plugins/**/*.js',
    'nuxt.config.js'
  ]
}
