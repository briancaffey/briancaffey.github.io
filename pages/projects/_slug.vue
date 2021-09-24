<template>
  <article>
    <div
      class="
        mx-auto
        max-w-6xl
        px-4
        sm:px-4
        md:px-4
        lg:px-16
        xl:pb-16
        mt-4
        lg:pl-64
      "
    >
      <img :src="project.image" class="h-64 w-full object-cover rounded">
      <h1 class="prose text-3xl">
        {{ project.title }}
      </h1>
      <p class="text-gray-500 mb-4">
        {{ $t('common.lastUpdated') }}
        {{ project.date | formatDate($i18n.locale) }}
      </p>
      <h1 class="text-xl">
        <a v-if="project.link" :href="project.link">GitHub Link 🔗</a>
      </h1>
      <nuxt-content class="markdown" :document="project" />
    </div>
  </article>
</template>

<script>
export default {
  async asyncData ({ $content, params }) {
    const project = await $content('projects', params.slug).fetch()

    return { project }
  },
  methods: {
    formatDate (date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    }
  },
  head () {
    return {
      title: this.project.title
    }
  },
  transition: 'page'
}
</script>
