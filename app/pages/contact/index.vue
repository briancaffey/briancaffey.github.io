<template>
  <div class="content-container pt-8 pb-12 text-center">
    <PortraitLab />

    <section class="pt-12">
      <h2 class="text-2xl font-bold pb-4">
        {{ $t('contactForm.followMe') }}
      </h2>
      <SocialLinks />
    </section>

    <section class="pt-12">
      <h2 class="text-2xl font-bold pb-4">
        {{ $t('contactForm.contactMe') }}
      </h2>
      <contact-form />
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Contact Brian Caffey'
})
</script>
