# [briancaffey.github.io](https://briancaffey.github.io)

My personal site and blog. Statically generated with [Nuxt](https://nuxt.com)
and [Nuxt Content](https://content.nuxt.com), published to GitHub Pages.

```bash
yarn install --frozen-lockfile   # Node version is in .nvmrc
yarn dev                         # http://localhost:3000
yarn generate                    # static build in .output/public
yarn lint
yarn test:e2e                    # Playwright, against the static build
```

Articles live in `content/YYYY/MM/DD/slug.md`. Conventions for contributors
and coding agents are in [CLAUDE.md](CLAUDE.md). Changes are recorded in
`CHANGELOG.md`, which is maintained by release-please.
