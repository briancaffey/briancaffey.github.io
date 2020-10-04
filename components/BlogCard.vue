<template>
  <nuxt-link :to="article.path">
    <li class="rounded article-card">
      <img
        v-if="article.image"
        :src="article.image"
        class="h-32 w-full object-cover rounded-t"
      />
      <div class="py-4 px-4 sm:px-4">
        <h2 class="text-2xl leading-8">{{ article.title }}</h2>
        <p>{{ article.description }}</p>
        <tags v-if="article.tags" :tags="article.tags" />
        <p class="text-gray-600 mb-4">
          Last updated: {{ article.date | formatDate }}
        </p>
      </div>
    </li>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<style scoped></style>
