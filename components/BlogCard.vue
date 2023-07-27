<template>
  <li class="rounded-lg article-card">
    <nuxt-link :to="localePath(article.path)">
      <div>
        <img
          v-if="article.image"
          :src="article.image"
          class="h-32 w-full object-cover rounded-t-lg"
        >
      </div>
      <div class="py-4 px-4 sm:px-4">
        <p class="text-2xl leading-8 pb-2">
          {{ article.title }}
        </p>
        <p class="blog-card-description">
          {{ article.description }}
        </p>
      </div>
    </nuxt-link>
    <div class="px-4">
      <tags v-if="article.tags" :tags="article.tags" />
    </div>
    <div class="px-4">
      <external v-if="article.external" :external="article.external" />
    </div>
    <div class="blog-date mb-4 px-4 pb-4">
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
      default: () => {}
    }
  }
}
</script>

<style scoped>
</style>
