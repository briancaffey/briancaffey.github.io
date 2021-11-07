<template>
  <div />
</template>

<script>
export default {
  mounted () {
    // if adblock is detected through a value that is set local storage, then show the AdBlock message
    // the `adblockEnabled` value is set in the catch block of the `detectAdBlock` method
    // (see adblock/setAdblockEnabled mutation)
    if (JSON.parse(localStorage.getItem('adblockEnabled')) === true) {
      this.$store.commit('adblock/setAdblockEnabled', true)
    }
    // check to see if the URL can be accessed on a 5 second interval
    setInterval(() => {
      this.detectAdBlock()
    }, 5000)
  },
  methods: {
    async  detectAdBlock () {
      // this is a URL that should be blocked by AdBlock
      const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      // make a request to the above URL
      await fetch(new Request(googleAdUrl)).then((_) => {
        // isAdblockEnabled is false by default
        // Check to see if isAblockEnabled was set to true by a previous request
        if (this.$store.getters['adblock/isAdblockEnabled'] === true) {
          // if the request was successful, then the user does not have AdBlock enabled,
          // so we can set isAdblockEnabled to false using the setAdblockEnabled mutation
          // this mutation will also set the `adblockEnabled` value in local storage to "false"
          // `adblockEnabled` be `JSON.parse`d since it is saved in localStorage as a string
          this.$store.commit('adblock/setAdblockEnabled', false)
          window.localStorage.setItem('adblockEnabled', 'false')
          // do a full reload of the page
          window.location.reload()
        }
      }).catch((_) => {
        // if the request was unsuccessful, then the user has AdBlock enabled.
        // we can set isAdblockEnabled to true using the setAdblockEnabled mutation
        // this will also set the `adblockEnabled` value in local storage to "true"
        this.$store.commit('adblock/setAdblockEnabled', true)
        window.localStorage.setItem('adblockEnabled', 'true')
      })
    }
  }
}
</script>
