<template>
  <article>
    <nuxt-img
      v-if="article?.image"
      :src="article.image"
      :alt="article.description"
      class="pt-2 w-full object-cover"
      style="height: 32rem;"
      format="webp"
    />
    <div class="content-container mt-2">
      <h1 class="prose text-4xl leading-9 py-4 font-bold">
        {{ article?.title }}
      </h1>
      <tags v-if="article?.tags" :tags="article.tags" />
      <external v-if="article?.external" :external="article.external" />
      <p class="blog-date mb-4">
        {{ $t('common.lastUpdated') }}
        {{ formatDate(article?.date, $i18n.locale) }}
      </p>
      <div v-if="article?.draft" class="p-4 my-4 bg-red-300 rounded">
        <p>
          <strong>
            ⚠️ This article is a draft and is not yet complete. ⚠️
          </strong>
        </p>
      </div>
      <ContentRenderer v-if="article" :value="article" class="markdown"/>

      <div class="text-center pb-4 pt-8">
        <button
          v-if="!showComments"
          class="btn-solid"
          @click="showComments = true"
        >
          Show Disqus Comments 💬
        </button>
        <button
          v-else
          class="btn-solid"
          @click="showComments = false"
        >
          Hide Comments
        </button>
      </div>
      <Disqus
        v-if="article?.comments === true && showComments"
        :key="$colorMode.preference"
        shortname="briancaffey"
      />
    </div>
  </article>
</template>

<script setup lang="ts">
defineI18nRoute({
  locales: ['en']
});
const route = useRoute();
const { year, month, day, slug } = route.params;
const page = `/${year}/${month}/${day}/${slug}`;
const { data: article } = await useAsyncData(route.params.slug, () =>
  queryCollection("blog").path(page).first()
);
const showComments = ref(false);
const formatDate = (date, locale) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = new Date(date).toLocaleDateString(locale, options);
  return formattedDate
}
const config = useRuntimeConfig()

useHead(() => ({
  title: article.value?.title,
  meta: [
    {
      name: 'robots',
      content: article.value?.draft ? 'noindex' : 'all',
    },
    {
      property: 'twitter:creator',
      content: '@briancaffey',
    },
    {
      property: 'twitter:site',
      content: '@briancaffey',
    },
    {
      property: 'og:title',
      content: article.value?.title,
    },
    {
      property: 'og:description',
      content: article.value?.description,
    },
    {
      property: 'og:image',
      content: config.public.url + article.value?.image,
    },
    {
      property: 'twitter:image',
      content: config.public.url + article.value?.image,
    },
    {
      property: 'twitter:card',
      content: 'summary_large_image',
    },
  ],
}));
</script>
