<template>
  <div>
    <h1 class="text-center text-xl py-4">Blog Posts ({{ articles.length }})</h1>
    <div class="lg:px-32 px-2 sm:px-4">
      <ul class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        <nuxt-link
          v-for="article of articles"
          :key="article.slug"
          :to="{ name: 'blog-slug', params: { slug: article.slug } }"
        >
          <li class="rounded article-card">
            <img
              v-if="article.image"
              :src="article.image"
              class="h-32 w-full object-cover rounded-t"
            />
            <div class="py-4 px-4 sm:px-4">
              <h2 class="text-2xl leading-8">{{ article.title }}</h2>
              <p>{{ article.description }}</p>
              <p class="text-gray-600 mb-4">
                Last updated: {{ formatDate(article.date) }}
              </p>
            </div>
          </li>
        </nuxt-link>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const articles = await $content('blog', params.slug)
      .only(['title', 'description', 'image', 'slug', 'author', 'date'])
      .sortBy('date', 'desc')
      .fetch()

    return {
      articles,
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
      title: "Brian Caffey's Blog",
    }
  },
}
</script>

<style></style>
