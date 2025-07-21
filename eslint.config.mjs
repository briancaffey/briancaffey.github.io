// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue']
        }
      }
    },
    rules: {
        // todo(migration): remove all rules
        'no-console': 'off', // allow console.log in TypeScript files
        'vue/multi-word-component-names': 'off',
        'vue/require-explicit-emits': 'off',
        'prefer-spread': 'off',
        'no-duplicates': 'off',
        'no-self-import': 'off',
        'import/no-duplicates': 'off',
        'import/no-self-import': 'off'
      }
    }
)
