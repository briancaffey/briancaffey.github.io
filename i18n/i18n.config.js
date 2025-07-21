export default defineI18nConfig(() => {
  return {
    lazy: {
      skipNuxtState: true,
    },
    langDir: "app/i18n/",
    strategy: "prefix_except_default",
    defaultLocale: "en",
    vueI18n: {
      legacy: false,
      fallbackLocale: "en",
    }
  }
})
