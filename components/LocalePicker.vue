<template>
  <div class="grid items-center justify-center">
    <!-- {{ $i18n.locales }} -->
    <ul>
      <li
        class="md:px-4 px-1 cursor-pointer"
        @click="showOptions = !showOptions"
      >
        {{ availableLocales.find((x) => x['code'] === $i18n.locale).flag }}
      </li>
    </ul>
    <div class="relative rounded-md -ml-3">
      <div
        v-show="getShowOptions"
        class="
          absolute
          left-0
          bg-white
          shadow-md
          rounded
          px-4
          py-2
          w-32
          text
          mt-4
          -ml-20
        "
      >
        <nuxt-link
          v-for="locale in availableLocales"
          :key="`${locale.code}-option`"
          :to="switchLocalePath(locale.code)"
          @click.native="toggleShowOptions"
        >
          {{ locale.flag }} {{ locale.name }}
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showOptions: false
    }
  },
  computed: {
    currentLocaleObject () {
      const currentLocale = this.$i18n.locale

      return this.$i18n.locales.find((obj) => {
        return (obj.code = currentLocale)
      })
    },
    availableLocales () {
      return this.$i18n.locales
    },
    getShowOptions () {
      return this.showOptions
    }
  },
  methods: {
    toggleShowOptions () {
      // alert(this.$i18n.locale)
      this.showOptions = !this.showOptions
    }
  }
}
</script>
