<template>
  <article>
    <img
      v-if="article.image"
      :src="article.image"
      class="h-64 w-full object-cover"
    />
    <div class="mx-auto max-w-5xl px-2 sm:px-4 md:px-4 lg:px-16 mt-2">
      <h1 class="prose text-3xl leading-9">{{ article.title }}</h1>
      <tags v-if="article.tags" :tags="article.tags" />
      <p class="text-gray-500 mb-4">
        Last updated: {{ formatDate(article.date) }}
      </p>
      <nuxt-content class="markdown" :document="article" />

      <Narration :utterance="article.raw" />
      <div class="text-center pb-4 pt-8">
        <button
          v-if="!showComments"
          class="mc-btn rounded py-1 px-2"
          @click="showComments = true"
        >
          Show Disqus Comments 💬
        </button>
        <button
          v-else
          class="mc-btn rounded py-1 px-2"
          @click="showComments = false"
        >
          Hide Comments
        </button>
      </div>
      <disqus
        v-if="article.comments === true && showComments"
        :key="$colorMode.preference"
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
    const file = `${params.year}/${params.month}/${params.day}/${params.slug}`
    const article = await $content(file).fetch()
    return { article }
  },
  data() {
    return {
      showComments: false,
    }
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
