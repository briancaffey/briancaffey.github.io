<template>
  <div class="mx-auto max-w-6xl">
    <h1 class="text-center text-3xl py-8">
      {{ $t('projects.projects') }} ({{ projects.length }})
    </h1>
    <div class="lg:px-32 px-2 sm:px-4">
      <ul class="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
        <nuxt-link
          v-for="project of projects"
          :key="project.slug"
          :to="
            localePath({
              name: 'projects-slug',
              params: { slug: project.slug },
            })
          "
        >
          <li class="rounded article-card">
            <img
              v-if="project.image"
              :src="project.image"
              class="h-32 w-full object-cover rounded-t"
            >
            <div class="py-8 px-4 sm:px-4">
              <h2 class="text-2xl leading-8">
                {{ project.title }}
              </h2>
              <p>{{ project.description }}</p>
              <p class="text-gray-600 mb-4">
                {{ $t('common.lastUpdated') }}
                {{ project.date | formatDate($i18n.locale) }}
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
  async asyncData ({ $content, params }) {
    const projects = await $content('projects', params.slug)
      .only([
        'layout',
        'title',
        'comments',
        'permalink',
        'github',
        'image',
        'link',
        'date',
        'slug'
      ])
      .sortBy('date', 'desc')
      .fetch()

    return {
      projects
    }
  },
  methods: {
    formatDate (date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    }
  },
  head () {
    return {
      title: "Brian Caffey's Projects"
    }
  }
}
</script>

<style></style>
