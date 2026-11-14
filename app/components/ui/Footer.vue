<template>
  <footer class="content-container py-4 text-center">
    <hr class="mt-4">
    <div class="align-center py-4">
      <div class="pb-4">
        {{ $t('newsletter.joinNewsletter') }}
      </div>
      <subscribe />
    </div>
    <hr>
    <div class="py-4">
      {{ $t('footer.thanks') }}
    </div>
    <div class="pb-4">
      © {{ new Date().getFullYear() }} Brian Caffey
    </div>
  </footer>
</template>
