import type { Config } from 'tailwindcss'

// Colours are CSS variables defined per colour mode in app/assets/css/main.css.
// Use these names (`bg-surface`, `text-primary`, `border-line`, ...) instead of
// Tailwind's fixed palette so that every mode stays consistent.
export default {
  content: [
    'app/components/**/*.vue',
    'app/layouts/**/*.vue',
    'app/pages/**/*.vue',
    'app/app.vue',
    'content/**/*.md'
  ],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        surface: 'var(--bg)',
        'surface-raised': 'var(--bg-secondary)',
        code: 'var(--bg-code)',
        line: 'var(--border-color)',
        tag: 'var(--color-tag)',
        title: 'var(--color-title)'
      },
      fontFamily: {
        sans: ['Montserrat', 'Arial', 'sans-serif']
      },
      maxWidth: {
        // Reading column: 56rem of content plus the 1rem gutters.
        content: '58rem'
      },
      zIndex: {
        header: 'var(--z-header)',
        popover: 'var(--z-popover)'
      }
    }
  },
  plugins: []
} satisfies Config
