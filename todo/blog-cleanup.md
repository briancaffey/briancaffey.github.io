# Blog Cleanup Project - Master Task Queue

**Project:** Brian Caffey's Personal Blog Cleanup  
**Framework:** OpenClaw (Multi-Agent Orchestration System)  
**Last Updated:** 2026-03-13  
**Status:** Phase 1 Complete, Moving to Phase 2  

---

## Project Overview

This task queue tracks the systematic review and improvement of **57 articles** spanning from 2016 to March 2026. The project uses OpenClaw's multi-agent orchestration system to:

- Review each article for issues (typos, broken links, outdated content)
- Document findings in structured review files
- Create pull requests with fixes
- Track progress across phases

### Current Status Summary

| Phase | Description | Progress | Target Date |
|-------|-------------|----------|-------------|
| **Phase 1** | Quick Wins (HIGH priority recent articles) | ✅ Complete: 4/57 | March 2026 |
| **Phase 2** | Deep Dives (older CRITICAL articles, major updates) | 🔄 In Progress | April-June 2026 |
| **Phase 3** | Link Validation & Archive | ⬜ Pending | July-Sept 2026 |
| **Phase 4** | Image Generation System | ⬜ Planned | Oct-Dec 2026 |

---

## Article Review Queue (Prioritized)

### 🔴 CRITICAL Priority - Start Here!
Articles with major version drift, likely broken code, or outdated infrastructure.

#### Phase 1: Quick Wins (COMPLETED ✅)

**Article #6:** NVIDIA NIM on Google Cloud GCP  
- **Date:** 2026-02-20  
- **Issues Fixed:** Typos, security notes added, version disclaimer included  
- **PR Status:** ✅ Merged (#8)  
- **Review File:** `todo/reviews/2026-02-nvidia-nim-review.md` (create after PR merge)

**Article #3:** Upgrading My Static Nuxt Blog from Nuxt 3 to Nuxt 4  
- **Date:** 2025-07-21  
- **Issues Fixed:** 2 typos corrected  
- **PR Status:** ✅ Merged (#9)  
- **Review File:** `todo/reviews/2025-07-nuxt4-upgrade-review.md` (create after PR merge)

**Article #9:** hnfm: OpenAI GPT-OSS Hackathon Project - Hacker News AI Podcast App  
- **Date:** 2025-09-09  
- **Issues Fixed:** Completed cut-off sentence, formatting fixes  
- **PR Status:** ✅ Merged (#10)  
- **Review File:** `todo/reviews/2025-09-hnfm-review.md` (create after PR merge)

**Article #50:** Behind the Scenes: AI-Assisted Blog Cleanup with OpenClaw  
- **Date:** 2026-03-09  
- **Issues Fixed:** Cover image temporarily commented out to fix build  
- **PR Status:** 🔄 On branch `blog-cleanup/openclaw-meta-article-v2` (merged by Brian)  
- **Review File:** N/A (meta article about the project itself)

---

#### Phase 2: Deep Dives - Next Up! 🔴 CRITICAL Priority

**Article #4:** Flux Plugin for Project G-Assist Hackathon  
- **Date:** 2025-07-17  
- **Why Critical:** AI/Artistic content, may need model version updates  
- **Recommended Actions:**
  - Verify image generation models still work
  - Check if API endpoints have changed
  - Update any deprecated parameters or methods

**Article #5:** Mediation Simulator Project for NVIDIA Agent Intelligence Toolkit  
- **Date:** 2025-05-27  
- **Why Critical:** Technical simulation content, needs verification  
- **Recommended Actions:**
  - Test code snippets work with current toolkit versions
  - Verify agent intelligence API endpoints still valid
  - Check if simulation parameters have changed

**Article #14:** Ad-hoc Developer Environments for Django with AWS ECS, Terraform, GitHub Actions  
- **Date:** 2022-03-27  
- **Why Critical:** Cloud infrastructure has changed significantly since 2022  
- **Recommended Actions:**
  - Verify Terraform provider versions still compatible
  - Check if AWS ECS patterns have evolved (task definitions, service discovery)
  - Update GitHub Actions workflows to latest syntax

**Article #18:** How and Why I Added AdSense and Adblock Detector to My Website  
- **Date:** 2021-10-31  
- **Why Critical:** Monetization services change frequently  
- **Recommended Actions:**
  - Test current AdSense integration code
  - Verify adblock detection methods still work
  - Check if Google's policies have changed

**Article #29:** Digital Ocean Docker Swarm Django Traefik Nginx  
- **Date:** 2020-08-09  
- **Why Critical:** Docker Swarm is deprecated, infrastructure completely outdated  
- **Recommended Actions:**
  - Consider rewriting with Kubernetes or Docker Compose
  - Update Traefik version and configuration syntax
  - Verify Nginx reverse proxy settings still valid

---

### 🟠 HIGH Priority - Next Batch After Phase 2

**Article #37:** Setting Up Flask CLI with Docker  
- **Date:** 2017-12-09  
- **Why High:** Flask has evolved, Docker best practices changed  

**Article #45:** Moving from GNOME to i3 on Arch Linux  
- **Date:** 2017-10-17  
- **Why High:** Desktop environment configurations may have shifted

**Article #16:** GitHub Actions for My Nuxt Blog Hosted on GitHub Pages  
- **Date:** 2021-07-05  
- **Why High:** CI/CD workflows need verification

---

### 🟡 MEDIUM Priority - Optional Improvements

**Article #38:** The Twelve-Factor App and My Experience Developing Web Apps  
- **Date:** 2017-12-03  
- **Why Medium:** Principles still relevant, just needs updates

**Article #49:** My First Attempt at Photogrammetry  
- **Date:** 2017-05-09  
- **Why Medium:** Process article, may still be relevant as-is

---

### 🟢 LOW Priority - Nice-to-Have Updates

**Article #43:** A Binary Clock Written in Bash  
- **Date:** 2017-10-31  
- **Why Low:** Simple script that likely still works

---

## Task Queue Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Completed and merged to main branch |
| 🔄 | In progress (PR created, awaiting review) |
| ⬜ | Not started or pending manual review |
| 🔴 | CRITICAL priority - major version drift, likely broken |
| 🟠 | HIGH priority - typos, missing best practices |
| 🟡 | MEDIUM priority - minor improvements needed |
| 🟢 | LOW priority - nice-to-have updates |

---

## How to Use This Queue

### For Each Article:

1. **Read the full article** without making changes (get context)
2. **Apply the review checklist** (see `todo/blog-review-checklist.md`)
3. **Document findings** in a new review file at `todo/reviews/YYYY-MM-article-name-review.md`
4. **Create a PR branch**: `blog-cleanup/article-name-improvements`
5. **Commit fixes** with clear messages:
   ```bash
   git commit -m "fix(blog): correct typos and update version in article name"
   ```
6. **Push to remote**: `git push origin blog-cleanup/article-name-improvements`
7. **Create PR via GitHub CLI or UI** with detailed description linking back to review file

### Example Commit Messages:

```bash
# For typos and grammar
fix(blog): correct typos in [article name] - "get go through" → "go through"

# For security improvements  
feat(blog): add security best practices note about environment variables

# For version updates
chore(blog): update framework versions to current releases (2017 → 2026)

# For link fixes
fix(blog): replace broken external links with Wayback Machine archives
```

---

## Review File Naming Convention

Create review files at: `todo/reviews/YYYY-MM-article-name-review.md`

**Examples:**
- `todo/reviews/2026-02-nvidia-nim-review.md`
- `todo/reviews/2025-07-nuxt4-upgrade-review.md`
- `todo/reviews/2025-09-hnfm-review.md`

---

## Progress Tracking

### Completed (Phase 1)
- ✅ **Article #6:** NVIDIA NIM on GCP - Security notes added, version disclaimer included
- ✅ **Article #3:** Nuxt 4 Upgrade - Typos fixed
- ✅ **Article #9:** hnfm Hackathon - Formatting and completeness fixes
- ✅ **Article #50:** OpenClaw Meta Article - Published (cover image commented out temporarily)

### In Progress
- 🔄 **Article #4:** Flux Plugin - Ready to review next
- 🔄 **Article #5:** Mediation Simulator - Following Flux Plugin
- 🔄 **Article #14:** Ad-hoc Developer Environments - Terraform/AWS patterns need update

### Pending Review (Next Batch)
- ⬜ Article #37: Flask CLI with Docker
- ⬜ Article #45: GNOME to i3 migration
- ⬜ Article #16: GitHub Actions for Nuxt Blog
- ⬜ Article #29: Digital Ocean Docker Swarm (likely needs major rewrite)

---

## Tools & Commands Used

```bash
# Create new review file
touch todo/reviews/YYYY-MM-article-name-review.md

# Check current branch status
git status --porcelain -b

# Create PR branch for fixes
git checkout -b blog-cleanup/article-name-improvements

# Commit with clear message
git add -A && git commit -m "fix(blog): [description of changes]"

# Push to remote
git push origin blog-cleanup/article-name-improvements:blog-cleanup/article-name-improvements

# Open PR via GitHub CLI (if configured)
gh pr create --title "Blog cleanup: Fix in article name" --body "See todo/reviews/YYYY-MM-article-review.md for full details"
```

---

## Next Steps

1. **Review Article #4** (Flux Plugin Hackathon) using the checklist template
2. **Create review file** at `todo/reviews/2025-07-flux-plugin-review.md`
3. **Document all issues found** and prioritize fixes
4. **Create PR branch** with improvements
5. **Update this task queue** with completion status

---

*This task queue is part of the OpenClaw blog cleanup project. For the full article inventory, see [todo/blog-inventory.md](./blog-inventory.md). For the review checklist template, see [todo/blog-review-checklist.md](./blog-review-checklist.md).*
