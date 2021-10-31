<template>
  <div />
</template>

<script>
export default {
  mounted () {
    const vm = this
    setInterval(() => {
      vm.detectAdBlock()
    }, 5000)
  },
  methods: {
    async  detectAdBlock () {
      const googleAdUrl = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
      await fetch(new Request(googleAdUrl)).then((_) => {
        this.$store.commit('adblock/setAdblockEnabled', false)
      }).catch((_) => {
        this.$store.commit('adblock/setAdblockEnabled', true)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
