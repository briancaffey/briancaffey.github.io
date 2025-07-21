// @ts-check
import withNuxt from '.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    rules: {
        // todo(migration): remove all rules
        'no-console': 'off', // allow console.log in TypeScript files
        'vue/multi-word-component-names': 'off',
        'vue/require-explicit-emits': 'off',
        'prefer-spread': 'off'
      }
    }
)
