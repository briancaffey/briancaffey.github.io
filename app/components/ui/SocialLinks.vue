<template>
  <ul class="social-links">
    <li v-for="link in links" :key="link.brand">
      <a
        class="social-link"
        :data-brand="link.brand"
        :href="link.href"
        target="_blank"
        rel="me noopener noreferrer"
        :aria-label="`${link.label} — ${link.handle}`"
      >
        <component :is="link.icon" class="social-icon" />
        <span class="social-label">{{ link.label }}</span>
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
const links = [
  {
    brand: 'github',
    label: 'GitHub',
    handle: 'briancaffey',
    href: 'https://github.com/briancaffey',
    icon: resolveComponent('GitHubIcon')
  },
  {
    brand: 'linkedin',
    label: 'LinkedIn',
    handle: 'brian-caffey',
    href: 'https://linkedin.com/in/brian-caffey-06b22a18',
    icon: resolveComponent('LinkedInIcon')
  },
  {
    brand: 'x',
    label: 'X',
    handle: '@briancaffey',
    href: 'https://x.com/briancaffey',
    icon: resolveComponent('XIcon')
  },
  {
    brand: 'devto',
    label: 'DEV',
    handle: 'briancaffey',
    href: 'https://dev.to/briancaffey',
    icon: resolveComponent('DevToIcon')
  }
]
</script>

<style scoped>
.social-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.social-link {
  --brand: var(--color-primary);
  --brand-fg: #fff;

  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  background-color: var(--bg-secondary);
  color: var(--color);
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  transition: background-color 0.18s, color 0.18s, border-color 0.18s,
    transform 0.18s, box-shadow 0.18s;
}

.social-link:hover,
.social-link:focus-visible {
  background-color: var(--brand);
  border-color: var(--brand);
  color: var(--brand-fg);
  transform: translateY(-2px);
  box-shadow: 0 6px 18px -8px var(--brand);
}

.social-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.social-label {
  white-space: nowrap;
}

/* Brand colours, tuned per theme so nothing disappears into the background. */
.social-link[data-brand='github'] { --brand: #24292f; }
.social-link[data-brand='linkedin'] { --brand: #0a66c2; }
.social-link[data-brand='x'] { --brand: #0f1419; }
.social-link[data-brand='devto'] { --brand: #0a0a0a; }

:global(.dark-mode) .social-link[data-brand='github'],
:global(.dark-mode) .social-link[data-brand='x'],
:global(.dark-mode) .social-link[data-brand='devto'] {
  --brand: #f1f5f9;
  --brand-fg: #0b1220;
}

:global(.dark-mode) .social-link[data-brand='linkedin'] { --brand: #3b96e8; --brand-fg: #06101c; }

:global(.sepia-mode) .social-link[data-brand='github'],
:global(.sepia-mode) .social-link[data-brand='x'],
:global(.sepia-mode) .social-link[data-brand='devto'] {
  --brand: #433422;
  --brand-fg: #f1e7d0;
}

:global(.sepia-mode) .social-link[data-brand='linkedin'] { --brand: #2f5d86; --brand-fg: #f1e7d0; }

@media (prefers-reduced-motion: reduce) {
  .social-link:hover,
  .social-link:focus-visible { transform: none; }
}
</style>
