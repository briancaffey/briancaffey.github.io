<template>
  <li class="rounded article-card">
    <nuxt-link :to="localePath(article.path)">
      <div>
        <img
          v-if="article.image"
          :src="article.image"
          class="h-32 w-full object-cover rounded-t"
        />
      </div>
      <div class="py-4 px-4 sm:px-4">
        <p class="text-2xl leading-8">{{ article.title }}</p>
        <p>{{ article.description }}</p>
      </div>
    </nuxt-link>
    <div class="px-4">
      <tags v-if="article.tags" :tags="article.tags" />
    </div>
    <div class="text-gray-600 mb-4 px-4 pb-4">
      <p>
        {{ $t('common.lastUpdated') }}
        {{ article.date | formatDate($i18n.locale) }}
      </p>
    </div>
  </li>
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
