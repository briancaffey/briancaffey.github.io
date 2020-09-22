<template>
  <div>
    <h1 class="text-center text-xl py-8">Blog Posts ({{ articles.length }})</h1>
    <div class="lg:px-32 px-4">
      <ul class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        <li
          v-for="article of articles"
          :key="article.slug"
          class="rounded article-card"
        >
          <nuxt-link
            :to="{ name: 'blog-slug', params: { slug: article.slug } }"
          >
            <img
              v-if="article.image"
              :src="article.image"
              class="h-32 w-full object-cover rounded-t"
            />
            <div class="p-8">
              <h2 class="text-2xl">{{ article.title }}</h2>
              <!-- <p>by {{ article.author.name }}</p> -->
              <p>{{ article.description }}</p>
              <p class="text-gray-500 mb-4">
                Last updated: {{ formatDate(article.date) }}
              </p>
            </div>
          </nuxt-link>
        </li>
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
      title: 'Blog',
    }
  },
}
</script>
