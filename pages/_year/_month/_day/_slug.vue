<template>
  <article>
    <img
      v-if="article.image"
      :src="article.image"
      class="h-64 w-full object-cover"
    />
    <div class="px-2 sm:px-4 md:px-4 lg:px-16 xl:pb-16 mt-2 lg:pl-64">
      <h1 class="prose text-3xl leading-9">{{ article.title }}</h1>
      <p class="text-gray-500 mb-4">
        Last updated: {{ formatDate(article.date) }}
      </p>
      <nuxt-content class="markdown" :document="article" />

      <Narration :utterance="article.raw" />
      <disqus
        v-if="article.comments === true"
        shortname="briancaffey"
        :identifier="article.disqus_id || article.slug"
      ></disqus>
      <h1></h1>
    </div>
  </article>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    console.log(params)
    console.log('hmm')
    const file = `${params.year}/${params.month}/${params.day}/${params.slug}`
    const article = await $content(file).fetch()
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
      meta: [
        {
          property: 'og:title',
          content: this.article.title,
        },
        {
          property: 'og:description',
          content: this.article.description,
        },
        {
          property: 'og:image',
          content: process.env.baseUrl + this.article.image,
        },
      ],
    }
  },
}
</script>
