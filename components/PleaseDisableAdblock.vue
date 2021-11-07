<template>
  <div class="mx-auto max-w-6xl">
    <div class="px-4 lg:px-32">
      <div class="sm:p-16 text-center py-4">
        <div class="p-3 rounded border border-white hero">
          <img
            class="m-4 object-cover mx-auto rounded"
            src="/static/stop.png"
            style="height: 150px;"
            alt="AdBlock"
          >
          <strong>{{ $t('pleaseDisableAdblock') }}</strong>
        </div>
        <div class="text-left hero">
          <div class="text-lg ">
            <div class="py-4 font-bold">
              <i>If you do not wish to pause AdBlock, please consider either:</i>
            </div>
            </h2>
            <div>
              Reading my blog directly <a target="_blank" style="text-decoration: underline; cursor: pointer;" href="https://github.com/briancaffey/briancaffey.github.io/tree/master/content">on GitHub</a>.
            </div>
            <div>
              or
            </div>
            <div>
              <a target="_blank" style="text-decoration: underline; cursor: pointer;" href="https://github.com/briancaffey/briancaffey.github.io">Forking or cloning my site's public repo</a> and running it locally following these steps:
            </div>
            <br>
            <pre>
# install dependencies

$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
          </pre>
          </div>

          <div>
            If you are curious about how I built this AdBlock detection feature on my website, I wrote an in-depth article about it which can be read once you disable AdBlock. Alternatively, you can read the raw Markdown file for my AdSense / AdBlock article on GitHub <a target="_blank" style="text-decoration: underline; cursor: pointer;" href="https://github.com/briancaffey/briancaffey.github.io/blob/master/content/2021/10/31/how-and-why-i-added-adsense-and-adblock-blocker-to-my-website.md">here</a>.
          </div>
          <div class="pt-4">
            Finally, if you are curious about how much I am making with Google AdSense on my blog and want to keep up with my projects and experiments, please join my MailChimp newsletter for monthly updates and new articles.
          </div>
        </div>
        <div class="my-4 p-3 rounded border border-white hero">
          <img
            class="m-4 object-cover mx-auto rounded"
            src="/static/JBC_PA.jpg"
            style="height: 350px;"
            alt="AdBlock"
          >
          <div>
            <strong>Thank you!</strong>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
