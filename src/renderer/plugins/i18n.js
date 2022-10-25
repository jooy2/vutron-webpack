import { createI18n } from 'vue-i18n'
import en from '../../locales/en.json'
import ko from '../../locales/ko.json'
import { getCurrentLocale } from '../assets/js/utils'

export default createI18n({
  legacy: false,
  locale: getCurrentLocale(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    ko
  }
})
