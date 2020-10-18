<template>
  <div class="mx-auto max-w-6xl px-4 w-full sm:w-2/3 lg:px-16">
    <form
      action="https://formsubmit.co/briancaffey2010@gmail.com"
      method="POST"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div>
          <label for="name"
            >Your Name <span class="text-red-600">*</span></label
          >
          <input
            placeholder="J. Appleseed"
            type="text"
            name="name"
            required
            class="mc"
          />
        </div>
        <div>
          <label for="name">Your Email</label>
          <input
            placeholder="j.appleseed@email.com"
            type="email"
            name="email"
            required
            class="mc"
          />
        </div>
        <div>
          <label for="website">Your Website</label>
          <input
            placeholder="https://appleseed.co"
            type="url"
            name="website"
            class="mc"
            required="false"
          />
        </div>
      </div>
      <div class="text-left mt-4">
        <label for="message">Message <span class="text-red-600">*</span></label>
        <textarea
          placeholder="Type your message here"
          type="text"
          name="message"
          required
          class="mc w-full"
        />
      </div>
      <button type="submit" class="mc-btn rounded px-2 py-1 w-full mt-2">
        Send
      </button>
    </form>
  </div>
</template>

<script>
export default {}
</script>

<style scoped></style>
