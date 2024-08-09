import en from './i18n/en-US.js';
import fr from './i18n/fr-FR.js';

export default defineI18nConfig(() => {
  return {
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
    ],
    lazy: {
      skipNuxtState: true,
    },
    messages: {
      en: en,
      fr: fr
    },
    langDir: "i18n/",
    strategy: "prefix_and_default",
    defaultLocale: "en",
    vueI18n: {
      legacy: false,
      fallbackLocale: "en",
    }
  }
})
