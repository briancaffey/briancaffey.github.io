<template>
  <div class="mx-auto max-w-6xl px-4 w-full sm:w-2/3 lg:px-16">
    <form
      action="https://formsubmit.co/briancaffey2010@gmail.com"
      method="POST"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div>
          <label
            for="name"
          >{{ $t('contactForm.yourName') }}
            <span class="text-red-600">*</span></label>
          <input
            id="name"
            :placeholder="$t('contactForm.sampleName')"
            type="text"
            name="name"
            required
            class="mc"
            autocomplete="on"
          >
        </div>
        <div>
          <label for="email">{{ $t('contactForm.yourEmail') }}</label>
          <input
            id="email"
            :placeholder="$t('contactForm.sampleEmail')"
            type="email"
            name="email"
            required
            class="mc"
            autocomplete="on"
          >
        </div>
        <div>
          <label for="website">{{ $t('contactForm.yourWebsite') }}</label>
          <input
            id="website"
            :placeholder="$t('contactForm.sampleWebsite')"
            type="url"
            name="website"
            class="mc"
            required="false"
            autocomplete="on"
          >
        </div>
      </div>
      <div class="text-left mt-4">
        <label
          for="message"
        >{{ $t('contactForm.message') }}
          <span class="text-red-600">*</span></label>
        <textarea
          id="message"
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
