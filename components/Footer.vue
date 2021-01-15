<template>
  <div class="mx-auto max-w-6xl p-4 lg:px-16 text-center">
    <hr class="mt-4" />
    <div class="mx-auto py-4">
      <div class="pb-4">
        {{ $t('newsletter.joinNewsletter') }}
      </div>
      <subscribe />
    </div>
    <hr />
    <div class="py-4">{{ $t('footer.thanks') }}</div>
    <div class="pb-4">© 2020 Brian Caffey</div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped></style>
