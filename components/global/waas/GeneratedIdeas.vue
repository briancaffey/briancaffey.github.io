<template>
  <div>
    <div class="flex-1 text-center">
      <button
        :disabled="$store.getters['waas/getIdeaIndex'] == 0"
        class=""
        @click="decrementIdeasIndex"
      >
        Previous Idea
      </button>
      <div>Idea #{{ this.$store.getters['waas/getIdeaIndex'] + 1 }}</div>
      <button class="" @click="incrementIdeasIndex">
        Next Idea
      </button>
    </div>

    <br>
    <div class="text-center">
      <div class="p-3 rounded border border-white hero">
        {{
          this.$store.getters['waas/getGeneratedIdeas'](
            this.$store.getters['waas/getIdeaIndex']
          )
        }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('waas/fetchGeneratedIdeas')
  },
  methods: {
    incrementIdeasIndex () {
      this.$store.dispatch('waas/changeIdeasIndex', 1)
    },
    decrementIdeasIndex () {
      this.$store.dispatch('waas/changeIdeasIndex', -1)
    }
  }
}
</script>

<style scoped></style>
