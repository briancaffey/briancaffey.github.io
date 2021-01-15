// plugins/filters.js

import Vue from 'vue'

Vue.filter('formatDate', (date, locale) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString(locale, options)
})
