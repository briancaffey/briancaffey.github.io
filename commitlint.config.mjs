// Conventional Commits. Scopes used in this repo: nav, design, content, assets, ci, deps.
// New articles are `feat(content): ...`; corrections to articles are `fix(content): ...`.
export default {
  extends: ['@commitlint/config-conventional'],
  // Merge commits and commits made by automation are not ours to lint.
  ignores: [message => /^Merge /.test(message)],
  rules: {
    'body-max-line-length': [0],
    'footer-max-line-length': [0]
  }
}
