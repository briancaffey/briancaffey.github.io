<template>
  <article>
    <div class="px-4 sm:px-4 md:px-4 lg:px-16 xl:pb-16 mt-2 lg:pl-64">
      <img
        v-if="article.image"
        :src="article.image"
        class="h-64 w-full object-cover rounded"
      />
      <h1 class="prose text-3xl">{{ article.title }}</h1>
      <p class="text-gray-500 mb-4">
        Last updated: {{ formatDate(article.date) }}
      </p>
      <nuxt-content class="markdown" :document="article" />
      {{ article }}
      <Narration :utterance="article" />
      <disqus
        v-if="article.comments === true"
        shortname="briancaffey"
        identifier="article.slug"
      ></disqus>
    </div>
  </article>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const article = await $content('articles', params.slug).fetch()

    return { article }
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    },
  },
  head() {
    return {
      title: this.article.title,
    }
  },
}
</script>
