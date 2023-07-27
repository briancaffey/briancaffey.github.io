<template>
  <div class="flex align-center justify-center">
    <!-- Begin Mailchimp Signup Form -->
    <div id="mc_embed_signup" class="w-full md:w-1/2 flex-shrink justify-center">
      <form
        id="mc-embedded-subscribe-form"
        action="https://github.us2.list-manage.com/subscribe/post?u=43a795784ca963e25903a0da6&amp;id=9937fe4fc5"
        method="post"
        name="mc-embedded-subscribe-form"
        class="validate"
        target="_blank"
        novalidate
      >
        <div
          id="mc_embed_signup_scroll"
          class="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            id="mce-EMAIL"
            type="email"
            value=""
            name="EMAIL"
            :placeholder="$t('newsletter.enterEmail')"
            class="rounded mc text-center"
          >
          <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->
          <div style="position: absolute; left: -5000px" aria-hidden="true">
            <input
              type="text"
              name="b_43a795784ca963e25903a0da6_9937fe4fc5"
              tabindex="-1"
              value=""
            >
          </div>
          <div class="text-right" style="width: 100%">
            <input
              id="mc-embedded-subscribe"
              type="submit"
              :value="$t('newsletter.subscribe')"
              name="subscribe"
              class="mc-btn rounded px-2 py-1 w-full"
            >
          </div>
        </div>
      </form>
    </div>

    <!--End mc_embed_signup-->
  </div>
</template>

<script>
export default {}
</script>

<style scoped></style>
