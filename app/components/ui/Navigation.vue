<template>
  <header ref="header" class="site-header">
    <div class="site-header__bar site-container">
      <NuxtLink
        to="/"
        class="site-header__home nav-link"
        :aria-current="route.path === '/' ? 'page' : undefined"
        :aria-label="$t('common.name')"
      >
        <span class="hidden text-2xl sm:inline">{{ $t('common.name') }}</span>
        <span class="text-xl sm:hidden">JBC</span>
      </NuxtLink>

      <div class="site-header__pickers">
        <ColorModePicker />
        <LocalePicker />
      </div>

      <div class="site-header__links">
        <nav class="hidden md:block" :aria-label="$t('nav.menu')">
          <ul class="flex items-center gap-8 text-lg">
            <li v-for="link in links" :key="link.to">
              <NuxtLink
                :to="link.to"
                class="nav-link"
                :aria-current="isCurrent(link) ? 'page' : undefined"
              >
                {{ $t(link.label) }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <button
          ref="toggle"
          type="button"
          class="menu-button flex items-center md:hidden"
          aria-controls="site-menu"
          :aria-expanded="open"
          :aria-label="$t('nav.menu')"
          @click="open = !open"
        >
          <svg
            class="h-4 w-4 fill-current"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              v-if="open"
              d="M4.3 2.9 10 8.6l5.7-5.7 1.4 1.4-5.7 5.7 5.7 5.7-1.4 1.4-5.7-5.7-5.7 5.7-1.4-1.4L8.6 10 2.9 4.3z"
            />
            <path
              v-else
              d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"
            />
          </svg>
        </button>
      </div>
    </div>

    <nav
      v-if="open"
      id="site-menu"
      class="site-menu md:hidden"
      :aria-label="$t('nav.menu')"
    >
      <ul class="py-4 text-center text-2xl">
        <li v-for="link in [home, ...links]" :key="link.to">
          <NuxtLink
            :to="link.to"
            class="nav-link block py-2"
            :aria-current="isCurrent(link) ? 'page' : undefined"
            @click="close()"
          >
            {{ $t(link.label) }}
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { onClickOutside, onKeyStroke } from '@vueuse/core'

type NavLink = { to: string, label: string, matches: (path: string) => boolean }

const route = useRoute()

const home: NavLink = { to: '/', label: 'nav.home', matches: path => path === '/' }
const links: NavLink[] = [
  // Articles live at /YYYY/MM/DD/slug and belong to the blog section.
  { to: '/blog/1', label: 'nav.blog', matches: path => path.startsWith('/blog') || /^\/\d{4}\//.test(path) },
  { to: '/projects', label: 'nav.projects', matches: path => path.startsWith('/projects') },
  { to: '/contact', label: 'nav.contact', matches: path => path.startsWith('/contact') }
]
const isCurrent = (link: NavLink) => link.matches(route.path)

const open = ref(false)
const header = ref<HTMLElement | null>(null)
const toggle = ref<HTMLButtonElement | null>(null)

function close(returnFocus = false) {
  if (!open.value) return
  open.value = false
  if (returnFocus) toggle.value?.focus()
}

watch(() => route.fullPath, () => close())
onClickOutside(header, () => close())
onKeyStroke('Escape', () => close(true))
</script>

<style scoped>
.site-header {
  position: relative;
  z-index: var(--z-header);
}

/* Three zones: the outer two share the leftover space equally, which keeps
   the pickers centred on the page whatever the width of the name or links. */
.site-header__bar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  column-gap: 0.5rem;
  min-height: var(--header-height);
}

.site-header__home {
  justify-self: start;
  white-space: nowrap;
}

.site-header__pickers {
  display: flex;
  align-items: center;
}

.site-header__links {
  justify-self: end;
}

.menu-button {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  color: var(--color);
  background-color: var(--border-color);
}

.site-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: 0 12px 24px -12px rgb(0 0 0 / 0.35);
}

/* Weight without reflow: a real bold would change the width of the link. */
.nav-link[aria-current='page'] {
  text-shadow: 0.6px 0 0 currentColor;
}
</style>
