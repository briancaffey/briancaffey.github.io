---
title: "Upgrading my Blog to Nuxt 4"
date: '2025-07-21'
description: "This article details my process of upgrading my static GitHub Pages Blog from Nuxt 3 to Nuxt 4, and an upgrade of the headless CMS that powers my site, Nuxt Content, from v2 to v3"
image: /static/nuxt4/nuxt4.png
tags:
  - nuxt
  - vue
  - blogging
  - cms
  - typescript

draft: false

comments: true
---

This article will share my experience upgrading my Nuxt blog from Nuxt 3 to Nuxt 4. I'm following the official [Upgrade Guide](https://nuxt.com/docs/4.x/getting-started/upgrade) from Nuxt. It will be mostly unfiltered and I'll try to document things as they happen. Let's go!

First, I'll do this on a new branch:

```
git branch -b nuxt4-upgrade
```

The first step in the migration guide says to run:

```
yarn nuxt upgrade
```

This gave me an error.

```
error @nuxt/vite-builder@4.0.0: The engine "node" is incompatible with this module. Expected version "^20.19.0 || >=22.12.0". Got "20.18.0"
error Found incompatible module.
info Visit https://yarnpkg.com/en/docs/cli/add for documentation about this command.

 ERROR  Command failed: yarn add -D nuxt                                                  3:41:22 PM

  at genericNodeError (node:internal/errors:984:15)
  at wrappedFn (node:internal/errors:538:14)
  at checkExecSyncError (node:child_process:891:11)
  at execSync (node:child_process:963:15)
  at Object.run (node_modules/nuxi/dist/chunks/upgrade.mjs:99:5)
  at async runCommand$1 (node_modules/nuxi/dist/shared/nuxi.6aad497e.mjs:1648:16)
  at async runCommand$1 (node_modules/nuxi/dist/shared/nuxi.6aad497e.mjs:1639:11)
  at async runMain$1 (node_modules/nuxi/dist/shared/nuxi.6aad497e.mjs:1777:7)



 ERROR  Command failed: yarn add -D nuxt                                                  3:41:22 PM

error Command failed with exit code 1.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

First, I need to upgrade node. I use nvm, so this is easy. Let's see what node versions I have installed:

```
~/git/briancaffey.github.io$ nvm list
->     v20.18.0
       v22.15.0
default -> 20 (-> v20.18.0)
iojs -> N/A (default)
unstable -> N/A (default)
node -> stable (-> v22.15.0) (default)
stable -> 22.15 (-> v22.15.0) (default)
lts/* -> lts/jod (-> v22.15.0)
lts/argon -> v4.9.1 (-> N/A)
lts/boron -> v6.17.1 (-> N/A)
lts/carbon -> v8.17.0 (-> N/A)
lts/dubnium -> v10.24.1 (-> N/A)
lts/erbium -> v12.22.12 (-> N/A)
lts/fermium -> v14.21.3 (-> N/A)
lts/gallium -> v16.20.2 (-> N/A)
lts/hydrogen -> v18.20.8 (-> N/A)
lts/iron -> v20.19.1 (-> N/A)
lts/jod -> v22.15.0
```

```
~/git/briancaffey.github.io$ nvm install 22.17.1
Downloading and installing node v22.17.1...
Downloading https://nodejs.org/dist/v22.17.1/node-v22.17.1-darwin-arm64.tar.xz...
###################################################################################################################################################################################### 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v22.17.1 (npm v10.9.2)
```

OK, great, now let's run that `yarn nuxt upgrade` again:

```
yarn nuxt upgrade
```

```
~/git/briancaffey.github.io$ yarn nuxt upgrade
yarn run v1.22.22
error Command "nuxt" not found.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

Hmm, I'll try adding nuxt again:

```
yarn add nuxt@^4.0.0

...
✨  Done in 36.03s.
```

OK, great! Now I have Nuxt 4 installed.

The next section is about `Migrating Using Codemods`. I'll try running this:


> This command will execute all codemods in sequence, with the option to deselect any that you do not wish to run. Each codemod is also listed below alongside its respective change and can be executed independently.

```
yarn dlx codemod@latest nuxt/4/migration-recipe
```

```
~/git/briancaffey.github.io$ yarn dlx codemod@latest nuxt/4/migration-recipe
yarn run v1.22.22
error Command "dlx" not found.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

OK, I guess I need to add `dlx` with yarn first:

```
yarn add dlx
```

```
success Saved lockfile.
success Saved 2 new dependencies.
info Direct dependencies
└─ dlx@0.2.1
info All dependencies
├─ dlx@0.2.1
└─ underscore@1.13.7
✨  Done in 2.52s.
```

But I still got the same error about `dlx`, so I asked cursor:

    I'm trying to run this yarn command:

    yarn dlx codemod@latest nuxt/4/migration-recipe


    But I'm getting an error:

    yarn dlx codemod@latest nuxt/4/migration-recipe
    yarn run v1.22.22
    error Command "dlx" not found.
    info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.

    How can I fix this?

---

The issue is that you're using Yarn v1.22.22, which doesn't have the `dlx` command. The `dlx` command was introduced in Yarn v2+ (Berry). Here are several ways to fix this:

## Option 1: Use npx (Recommended)
Since you're using Yarn v1, you can use `npx` instead:

```bash
npx codemod@latest nuxt/4/migration-recipe
```

## Option 2: Use yarn create (Alternative)
You can try using yarn's create command:

```bash
yarn create codemod@latest nuxt/4/migration-recipe
```

## Option 3: Install codemod globally first
```bash
yarn global add codemod
codemod@latest nuxt/4/migration-recipe
```

## Option 4: Use the full path
```bash
yarn exec codemod@latest nuxt/4/migration-recipe
```

## Option 5: Upgrade to Yarn v2+ (Optional)
If you want to use `yarn dlx`, you could upgrade to Yarn v2+:

```bash
# Enable Yarn v2+ for this project
yarn set version berry

# Then you can use dlx
yarn dlx codemod@latest nuxt/4/migration-recipe
```

**I recommend using Option 1 (`npx`)** since it's the most straightforward and doesn't require changing your package manager setup. The `npx` command is available by default with Node.js and will work perfectly for running the codemod.

After running the codemod, you can continue with the manual upgrade steps I outlined in the previous plan.

---

OK, I'll try upgrading yarn later, and for now I'll go with using `npx`:

```
npx codemod@latest nuxt/4/migration-recipe
```

OK, that worked, now I got the list of options to choose from for my Nuxt 4 upgrade:

```
✔ Successfully downloaded "nuxt/4/migration-recipe" from the registry.
? Press Enter to run the selected codemods in order. You can deselect anything you don’t want. (Press
<space> to select, <a> to toggle all, <i> to invert selection, and <enter> to proceed)
❯◉ nuxt/4/absolute-watch-path
 ◉ nuxt/4/default-data-error-value
 ◉ nuxt/4/deprecated-dedupe-value
 ◉ nuxt/4/file-structure
 ◉ nuxt/4/shallow-function-reactivity
 ◉ nuxt/4/template-compilation-changes
```

OK! That seems to work! It ran each codemod, for example:

```
╭──────────────────────────────────────────────────────────────────────────────────────────────────╮
│                                                                                                  │
│                                                                                                  │
│      Codemod: nuxt/4/absolute-watch-path@1.0.3                                                   │
│      Target: /Users/brian/git/briancaffey.github.io                                              │
│                                                                                                  │
│      Using paths provided by codemod settings                                                    │
│      Included patterns: **/*.js, **/*.jsx, **/*.ts, **/*.tsx, **/*.vue                           │
│      Patterns excluded by default: **/*.d.ts, **/node_modules/**/*.*, **/.next/**/*.*,           │
│      **/dist/**/*.*, **/build/**/*.*, **/.git/**/*.*,                                            │
│      **/.svn/**/*.*, **/.hg/**/*.*, **/.bzr/**/*.*,                                              │
│      **/_darcs/**/*.*, **/_MTN/**/*.*, **/_FOSSIL_, **/.fslckout,                                │
│      **/.view/**/*.*                                                                             │
│      Patterns excluded from gitignore: **/.vscode/**/*.*, **/node_modules, /logs, **/*.log,      │
│      **/npm-debug.log*, **/yarn-debug.log*, **/yarn-error.log*,                                  │
│      **/pids, **/*.pid, **/*.seed, **/*.pid.lock, **/lib-cov,                                    │
│      **/coverage, **/.nyc_output, **/.grunt, **/bower_components,                                │
│      **/.lock-wscript, **/build/Release, **/node_modules/**/*.*,                                 │
│      **/jspm_packages/**/*.*, **/typings/**/*.*, **/.npm,                                        │
│      **/.eslintcache, **/.node_repl_history, **/*.tgz,                                           │
│      **/.yarn-integrity, **/.env, **/.cache, **/.next, **/.nuxt,                                 │
│      **/dist, **/.vuepress/dist, **/.serverless, **/.idea,                                       │
│      **/sw.*, **/.DS_Store, **/*.swp, **/notes, **/.output                                       │
│                                                                                                  │
│      Running in 4 threads                                                                        │
│      File formatting disabled                                                                    │
│                                                                                                  │
│                                                                                                  │
╰──────────────────────────────────────────────────────────────────────────────────────────────────╯
```

The big change at this point is that most of the code was moved to the `/app` directory:

```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        app/
        content/2025/07/21/

no changes added to commit (use "git add" and/or "git commit -a")
```

Is that it? Let's try running `yarn dev`

```
yarn dev
...
 ERROR  Cannot start nuxt:  ENOENT: no such file or directory, open '/Users/brian/git/briancaffey.github.io/app/i18n/en-US.js'                           4:12:36 PM
```

OK, we have an error related to i18n. I have struggled with i18n a fair bit when doing major changes to my site.

It looks like Nuxt 4 expects the i18n folder to be under tha new `/app` directory, but it is still in the root directory, so let's move that and try running `yarn dev` again.

Cool, no errors:

```
~/git/briancaffey.github.io$ yarn dev
yarn run v1.22.22
$ nuxi dev --host
Nuxt 4.0.0 with Nitro 2.12.0                                              nuxi 4:16:03 PM
                                                                               4:16:03 PM

              █▀▀▀▀▀▀▀██▀▀▀█▀██▀█▀▀▀▀▀▀▀█
              █ █▀▀▀█ ██▀▀ ▄▄██▀█ █▀▀▀█ █
              █ █   █ █ █ ▄▀▄ ▄▄█ █   █ █
              █ ▀▀▀▀▀ █▀▄ █▀▄▀█ █ ▀▀▀▀▀ █
              █▀▀███▀▀▀█ ▀█ ▀█▀ ███▀▀████
              ██ ▄ ▄▀▀▀█▀▄▀▀▀▀ ▄▄▀▀▄ ▄ ▀█
              █▀█▄▀▀ ▀▀ ▀ ▄▀█▀▄ ▀▀█▄▄██ █
              █ ▄██ █▀█▀▀▄█▄ ▄ █▀█▀█▀█ ▀█
              █ █▀█  ▀▄▄█▄ ▀▀▄█ ▀▀▀ █ █▄█
              █▀▀▀▀▀▀▀█ ▀▄  █ ▄ █▀█ ▀▄█▀█
              █ █▀▀▀█ █▄ ▀█▄▀▄▀ ▀▀▀ ▀▀███
              █ █   █ ██▄▀▄ ████▀▄▄█▄▀▄ █
              █ ▀▀▀▀▀ █ ▀ ▀▄█▀  █ ▄▄▀██ █
              ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀

  ➜ Local:    http://localhost:3000/
  ➜ Network:  http://192.168.5.226:3000/ [QR code]

ℹ Using default Tailwind CSS file                            nuxt:tailwindcss 4:16:04 PM

[4:16:04 PM]  WARN  Locales en-US, fr-FR, zh-ZH, ru-RU, ja-JP, hi-IN uses deprecated iso property, this will be replaced with language in v9

  ➜ DevTools: press Shift + Option + D in the browser (v2.6.2)                 4:16:04 PM

✔ Vite client built in 45ms                                                   4:16:05 PM
✔ Vite server built in 30ms                                                   4:16:05 PM
✔ Nuxt Nitro server built in 1071ms                                     nitro 4:16:07 PM
ℹ Vite client warmed up in 1ms                                                4:16:07 PM
ℹ Vite server warmed up in 63ms                                               4:16:07 PM
[4:16:25 PM] ℹ ✨ new dependencies optimized: @vue/devtools-core, @vue/devtools-kit, vue-disqus, vue3-apexcharts, pinia, @intlify/shared, is-https, @intlify/core-base
ℹ ✨ optimized dependencies changed. reloading                                4:16:25 PM
```
But I am getting a big `500` error in the browser:

```
500
orgTransform.apply is not a function

Customize this page
at createError (/Users/brian/git/briancaffey.github.io/node_modules/h3/dist/index.mjs:71:15)
at /Users/brian/git/briancaffey.github.io/node_modules/@nuxt/vite-builder/dist/index.mjs:403:21)
at async processMessage (/Users/brian/git/briancaffey.github.io/node_modules/@nuxt/vite-builder/dist/index.mjs:386:30)
```

Searching GitHub's code, I it looks like `orgTransform.apply` comes from `rdhainaut/unplugin-vue-i18n · lib/index.mjs`, so this is likely another i18n issue.

```
"@nuxtjs/i18n@^8.3.3":
  version "8.5.6"
  resolved "https://registry.yarnpkg.com/@nuxtjs/i18n/-/i18n-8.5.6.tgz#d65b375fba5244d83fc6833a604e2b532a64bef2"
  integrity sha512-L+g+LygKNoaS/AXExk7tzS9wSNn9QdP1T9VdTjjEGYftpeFgv2U8AQsY0dQAhgPIbXXhIAkNYxTk4YcINj9CfA==
  dependencies:
    "@intlify/h3" "^0.5.0"
    "@intlify/shared" "^9.14.1"
    "@intlify/unplugin-vue-i18n" "^3.0.1"
```

Let's make sure that I'm on the latest version of Nuxt's i18n:

```
npx nuxi module add i18n
```

```
yarn add @nuxtjs/i18n@^10.0.0
```

After upgrading `@nuxtjs/i18n` to v10.0.0 I got another i18n error when running `yarn dev`:

```
[4:26:12 PM]  ERROR  Cannot start nuxt:  ENOENT: no such file or directory, open '/Users/brian/git/briancaffey.github.io/i18n/locales/i18n/en-US.js'

    at readFileSync (node:fs:441:20)
    at getLocaleType (node_modules/@nuxtjs/i18n/dist/module.mjs:143:34)
    at resolveLocales (node_modules/@nuxtjs/i18n/dist/module.mjs:128:20)
    at resolveLocaleInfo (node_modules/@nuxtjs/i18n/dist/module.mjs:1511:20)
    at async node_modules/@nuxtjs/i18n/dist/module.mjs:1926:7
    at async initNuxt (node_modules/nuxt/dist/index.mjs:5613:3)
    at async NuxtDevServer._load (node_modules/@nuxt/cli/dist/chunks/index.mjs:211:5)
    at async NuxtDevServer.load (node_modules/@nuxt/cli/dist/chunks/index.mjs:139:7)
    at async NuxtDevServer.init (node_modules/@nuxt/cli/dist/chunks/index.mjs:130:5)
    at async initialize (node_modules/@nuxt/cli/dist/chunks/index.mjs:426:3)
```

OK! So I rarranged my `i18n` folder to match watch it was looking for:

```
~/git/briancaffey.github.io$ tree i18n -L 3
i18n
├── i18n.config.js
└── locales
    └── i18n
        ├── en-US.js
        ├── fr-FR.js
        ├── hi-IN.js
        ├── jp-JP.js
        ├── ru-RU.js
        └── zh-ZH.js
```

Now I have my language files duplicated, however. But at least I'm able to visit my site in the browser! And I can see in the NuxtDevTools window that I am using `v4.0.0`!

![NuxtDevTools](/static/nuxt4/nuxt-dev-tools.png)

```
  ➜ Local:    http://localhost:3000/
  ➜ Network:  http://192.168.5.226:3000/ [QR code]

ℹ Using default Tailwind CSS file                                                    nuxt:tailwindcss 4:31:24 PM
  ➜ DevTools: press Shift + Option + D in the browser (v2.6.2)                                         4:31:24 PM

ℹ Re-optimizing dependencies because lockfile has changed                                             4:31:25 PM
✔ Vite client built in 61ms                                                                           4:31:25 PM
✔ Vite server built in 42ms                                                                           4:31:26 PM
✔ Nuxt Nitro server built in 1422ms                                                             nitro 4:31:27 PM
ℹ Vite client warmed up in 1ms                                                                        4:31:27 PM
ℹ Vite server warmed up in 164ms                                                                      4:31:27 PM
[4:31:38 PM]  WARN  [@nuxtjs/mdc] Language "Dockerfile" is not loaded to the Shiki highlighter, fallback to plain text. Add the language to "mdc.highlight.langs" to fix this.
[4:31:38 PM]  WARN  [@nuxtjs/mdc] Language "Dockerfile" is not loaded to the Shiki highlighter, fallback to plain text. Add the language to "mdc.highlight.langs" to fix this.
[4:31:38 PM]  WARN  [@nuxtjs/mdc] Language "vue" is not loaded to the Shiki highlighter, fallback to plain text. Add the language to "mdc.highlight.langs" to fix this.
[4:31:48 PM] ℹ ✨ new dependencies optimized: @vue/devtools-core, @vue/devtools-kit, vue-disqus, vue3-apexcharts, pinia
ℹ ✨ optimized dependencies changed. reloading                                                        4:31:48 PM
ℹ ✨ new dependencies optimized: @vueuse/components                                                   4:31:50 PM
ℹ ✨ optimized dependencies changed. reloading                                                        4:31:50 PM
```

I went through each of my project dependencies and updated them to the latest versions. After doing this and resolving some small issues, I got the following when running `yarn dev`:

```
[@nuxt/content 7:10:17 PM]  WARN  No content configuration found, falling back to default collection. In order to have full control over your collections, create the config file in project root. See: https://content.nuxt.com/docs/getting-started/installation

ℹ Using default Tailwind CSS file                                                                 nuxt:tailwindcss 7:10:17 PM
  ➜ DevTools: press Shift + Option + D in the browser (v2.6.2)                                                      7:10:17 PM


 ERROR  Nuxt Content requires better-sqlite3 module to operate.                                       @nuxt/content 7:10:18 PM

                                                                                                                    7:10:18 PM
                                                                                                                    7:10:18 PM
❯ Do you want to install better-sqlite3 package?
● Yes / ○ No
```

After installing this I got another error!

Upgrading from Nuxt Content v2 to v3 introduced some breaking changes, so I had to work through those. [https://content.nuxt.com/docs/getting-started/migration](https://content.nuxt.com/docs/getting-started/migration)

This is one of the errors I got after upgrading Nuxt Content from v2 to v3.

```
 ERROR  [request error] [unhandled] [GET] http://localhost:3000/blog/1                                                                                                                      7:14:09 PM


ℹ Error: Cannot read properties of undefined (reading 'length')

 ⁃ at _sfc_ssrRender (app/pages/blog/[number].vue:78:62)

   37 ┃
   38 ┃  const { data: paginatedItems } = await useAsyncData(route.path, () =>
   39 ┃    queryCollection("/")
   40 ┃      .where({ draft: { $ne: true } })
   41 ┃      .sort({'date': -1})
   42 ┃      .limit(10)
   43 ┃      .skip(9 * (pageNo - 1))
   44 ┃      .find()
   45 ┃  )
   46 ┃  </script>
   47 ┃
```

The API changed and it uses a SQL-like query language. The migration docs mentioned this:

> The new API is backed by SQL and content queries happens within a specific collection.


Now the above query is written more like this with the new version of Nuxt Content:

```js
const { data: paginatedItems } = await useAsyncData(route.path, () =>
  queryCollection("blog")
    .order("date", "DESC")
    .limit(10)
    .skip(9 * (pageNo - 1))
    .all()
)
```

## `yarn generate`

After fixing the Nuxt Content query syntax for Nuxt Content v3, I tried running `yarn generate` to build my static site. This can often uncover issues that you won't see when just running `yarn dev`. Right away I found an issue with my Pinia Store. It couldn't find the file for my store. The codemod migration tool did not move my `store` folder into the `/app` directory, so I had to do that manually.

OK! After fixing the Pinia Store issues I was able to run `yarn generate` successfully!


```
ℹ Prerendered 785 routes in 93.991 seconds
✔ Generated public .output/public
✔ You can preview this build using npx serve .output/public
✔ You can now deploy .output/public to any static hosting!
✨  Done in 105.98s.
```

## CI/CD

To deploy my blog to `briancaffey.github.io` I just have to push my working changes to the `master` branch of my GitHub repository. GitHub Actions builds the site and pushes the build assets to GitHub Pages for me. To avoid any issues I need to make sure I'm using the correct version of `node`.

```
- name: Setup Node
  uses: actions/setup-node@v4
  with:
    node-version: "20"
```

I updated `"20"` to `"22.17.1"`


## `.data/content/contents.sqlite`

Something else I noticed is this new sqlite file. This is just for debugging, so we can add `.data` to `.gitignore` ([https://content.nuxt.com/docs/advanced/tools#locate-your-sqlite-database](https://content.nuxt.com/docs/advanced/tools#locate-your-sqlite-database))


## `yarn lint` error

I forgot to see if the code would properly lint, so on pushing to the master branch I got a failed deployment pipeline. Running `yarn lint` from my Mac I get the same error:

```
~/git/briancaffey.github.io$ yarn lint
yarn run v1.22.22
$ eslint .

Oops! Something went wrong! :(

ESLint: 9.31.0

TypeError [ERR_INVALID_MODULE_SPECIFIER]: Invalid module ".nuxt/eslint.config.mjs" is not a valid package name imported from /Users/brian/git/briancaffey.github.io/eslint.config.mjs
    at parsePackageName (node:internal/modules/package_json_reader:211:11)
    at Object.getPackageJSONURL (node:internal/modules/package_json_reader:222:53)
    at packageResolve (node:internal/modules/esm/resolve:768:81)
    at moduleResolve (node:internal/modules/esm/resolve:854:18)
    at defaultResolve (node:internal/modules/esm/resolve:984:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:780:12)
    at #cachedDefaultResolve (node:internal/modules/esm/loader:704:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:687:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:305:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:175:49)
error Command failed with exit code 2.
info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.
```

The error seems to be related to the file `eslint.config.mjs`. I'm not familiar with what `.mjs` files are, so I asked cursor:

> What are .mjs files?
>
> .mjs stands for "Module JavaScript" and is a file extension that explicitly tells Node.js to treat the file as an ES module, regardless of your project's configuration.


I was able to fix the error by making a small change to the input line that was throwing the error:

```
import withNuxt from '.nuxt/eslint.config.mjs'
```

changed to

```
import withNuxt from './.nuxt/eslint.config.mjs'
```

Now running `yarn lint` gave me small error in one of my components. Fixing that resulted in a successful `yarn lint`! OK, it should work this time!

## TypeScript

I also migrated this site from JavaScript to TypeScript, something I have been meaning to do for a while now. I was able to work down to 0 Problems in the VS Code/Cursor terminal toolbar.