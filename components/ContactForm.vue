<template>
  <div class="mx-auto max-w-6xl px-4 w-full sm:w-2/3 lg:px-16">
    <form
      action="https://formsubmit.co/briancaffey2010@gmail.com"
      method="POST"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div>
          <label for="name"
            >{{ $t('contactForm.yourName') }}
            <span class="text-red-600">*</span></label
          >
          <input
            :placeholder="$t('contactForm.sampleName')"
            type="text"
            name="name"
            required
            class="mc"
          />
        </div>
        <div>
          <label for="name">{{ $t('contactForm.yourEmail') }}</label>
          <input
            :placeholder="$t('contactForm.sampleEmail')"
            type="email"
            name="email"
            required
            class="mc"
          />
        </div>
        <div>
          <label for="website">{{ $t('contactForm.yourWebsite') }}</label>
          <input
            :placeholder="$t('contactForm.sampleWebsite')"
            type="url"
            name="website"
            class="mc"
            required="false"
          />
        </div>
      </div>
      <div class="text-left mt-4">
        <label for="message"
          >{{ $t('contactForm.message') }}
          <span class="text-red-600">*</span></label
        >
        <textarea
          :placeholder="$t('contactForm.sampleMessage')"
          type="text"
          name="message"
          required
          class="mc w-full"
        />
      </div>
      <button type="submit" class="mc-btn rounded px-2 py-1 w-full mt-2">
        {{ $t('contactForm.send') }}
      </button>
    </form>
  </div>
</template>

<script>
export default {}
</script>

<style scoped></style>
