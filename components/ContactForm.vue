<template>
  <div class="mx-auto px-4 w-full sm:w-2/3">
    <form
      action="https://formsubmit.co/briancaffey2010@gmail.com"
      method="POST"
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          placeholder="Your name"
          type="text"
          name="name"
          required
          class="mc"
        />
        <input
          placeholder="Your email"
          type="email"
          name="email"
          required
          class="mc"
        />
        <input placeholder="Your website" type="tel" name="phone" class="mc" />
      </div>
      <textarea
        placeholder="Type your message here"
        type="text"
        name="phone"
        required
        class="mc w-full mt-4"
      />
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
