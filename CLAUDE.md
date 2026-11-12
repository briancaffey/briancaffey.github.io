# Working in this repository

Personal site and blog of Brian Caffey: a statically generated Nuxt 4 site
(Nuxt Content 3, Tailwind 3, Vue 3) published to GitHub Pages from `master`.
The repository is public.

## Commands

| Task | Command |
|---|---|
| Install | `yarn install --frozen-lockfile` (Node version in `.nvmrc`, Yarn 1) |
| Dev server | `yarn dev` (port 3000) |
| Static build | `yarn generate` (output in `.output/public`, takes a few minutes) |
| Lint | `yarn lint` (needs `.nuxt/`, so run `yarn generate` or `yarn dev` once first) |
| End-to-end tests | `yarn generate && yarn test:e2e` |
| Visual comparison | see below |

## Layout

- `app/` holds the application: `pages/`, `layouts/`, `components/` (`ui/` for
  site chrome; the header is `ui/Navigation.vue`, `blog/` for listings, `content/` for components embedded in
  articles), `assets/css/`, `plugins/`, `stores/`.
- `content/YYYY/MM/DD/slug.md` holds the articles. The path is the URL.
  Frontmatter is validated by the schema in `content.config.ts`
  (`title`, `date`, `description`, optional `image`, `tags`, `draft`,
  `comments`, `external`).
- `public/static/` holds article images and media, one directory per article
  or project. These files are large; do not add media without checking size.
- `i18n/` holds interface strings for six locales. Articles are English only.
- `tests/e2e/` holds the Playwright tests.

## Verifying changes

Layout and component changes are verified with Playwright against the
generated site, at 390, 768 and 1440 px wide.

- `yarn test:e2e` runs the structural checks (pages render, nothing scrolls
  sideways, the header does not overlap, the menu and pickers work). These
  must pass.
- `yarn test:visual` compares screenshots between two builds. Baselines are
  not committed. To compare a branch with `master`:

  ```bash
  git worktree add ../base master && (cd ../base && yarn install --frozen-lockfile && yarn generate)
  SITE_DIR=../base/.output/public yarn test:visual --update-snapshots   # record
  yarn generate && yarn test:visual                                      # compare
  ```

  CI does the same on every pull request and uploads the report as the
  `visual-diff-report` artifact. That job is informational; attach the
  relevant before/after images to the pull request when layout changes.

- `BASE_URL=http://localhost:3000 yarn test:e2e` runs the tests against a
  running `yarn dev` for quick iteration. The dev server is slow enough to
  cause timeouts, so treat the static build as the real check.
- After changing interface strings in `i18n/`, run `yarn clean` before
  `yarn generate`. A cached build keeps serving the old translation files.

- A test marked `test.fixme` names a known gap and the issue that tracks it.
  Turn it into a real test in the pull request that closes the issue.

## Commits, pull requests and releases

- Conventional Commits, enforced in CI for commit messages and PR titles.
  Scopes in use: `nav`, `design`, `content`, `assets`, `ci`, `deps`.
  A new article is `feat(content): ...`; a correction is `fix(content): ...`.
- Work happens on a branch and lands through a pull request that references
  its issue. Work is tracked in GitHub issues and milestones, not in files.
- release-please maintains `CHANGELOG.md` and the version in `package.json`
  through a release pull request. Do not edit either by hand.
- Every push to `master` deploys the site.

## Rules of the road

- Keep the existing look. Structural and consistency changes are welcome;
  a visible redesign needs to be argued for in an issue first.
- Do not put private network details (addresses, hostnames, cluster
  inventory) in issues, pull requests, commits or content.
- Do not rewrite git history.
- Article text is the author's voice. Fix errors and add clearly marked
  update sections; do not restyle the prose.
