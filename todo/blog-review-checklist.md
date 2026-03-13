# Blog Article Review Checklist

**Purpose:** Standardized checklist for reviewing and cleaning up blog articles  
**Version:** 1.0 (2026-03-13)  
**Author:** Klaw (OpenClaw Agent)

Use this checklist when reviewing any article in the blog cleanup project. Check each item as you go through the article systematically.

---

## Quick Reference: What to Look For

| Category | Priority | Description |
|----------|----------|-------------|
| Typos & Grammar | 🔴 CRITICAL | Misspellings, grammar errors, punctuation issues |
| Broken Links | 🔴 CRITICAL | Dead links, archived resources, 404s |
| Code Accuracy | 🔴 CRITICAL | Commands that don't work, outdated APIs |
| Version Drift | 🔴 CRITICAL | Software versions from years ago |
| Security Issues | 🟠 HIGH | Missing disclaimers, insecure practices |
| Incomplete Content | 🟠 HIGH | Cut-off sentences, missing sections |
| Formatting | 🟡 MEDIUM | Markdown issues, inconsistent styling |

---

## Review Checklist Template

### Pre-Review Setup
- [ ] Read the entire article once without making changes (get the big picture)
- [ ] Note any immediate red flags or obvious issues
- [ ] Check the publication date and consider what's likely changed since then

### 1. Typos & Grammar 🔴 CRITICAL
**Priority:** Highest - these affect credibility immediately

- [ ] Scan for misspelled words (e.g., "get go through" → "go through", "caputres" → "captures")
- [ ] Check grammar and sentence structure
- [ ] Verify punctuation usage (commas, apostrophes, quotation marks)
- [ ] Ensure consistent spelling (e.g., "Nuxt" vs "nuxt", "GitHub" vs "github")
- [ ] Look for awkward phrasing that could be clarified

**Example Fixes:**
- "tha new `/app` directory" → "the new `/app` directory"
- "rarranged my folder to match watch" → "rearranged my folder to match what"

---

### 2. Broken Links & References 🔴 CRITICAL
**Priority:** High - broken links frustrate readers and hurt SEO

- [ ] Test all external links (click through or use link checker)
- [ ] Verify GitHub repository URLs are still active
- [ ] Check if referenced APIs/services are still available
- [ ] Look for archived resources (Wayback Machine links where appropriate)
- [ ] Remove or update dead links with notes about what changed

**Pro Tip:** For frequently changing services, consider adding a note like:
> "Note: As of March 2026, this service is still available at [URL]. Check the official documentation for current status."

---

### 3. Code Accuracy & Completeness 🔴 CRITICAL
**Priority:** Critical - broken code frustrates readers and hurts credibility

- [ ] Verify all code commands work as written (test if possible)
- [ ] Check framework/library versions mentioned in code snippets
- [ ] Ensure import statements are correct for current versions
- [ ] Look for deprecated APIs or methods that no longer exist
- [ ] Verify environment variable names and structure
- [ ] Check that file paths and directory structures match current conventions

**Common Issues to Watch For:**
- Python: `pip install` vs `python -m pip`, library API changes (e.g., TensorFlow 1.x → 2.x)
- Django: Version-specific patterns (Django 1.x → 4.x), deprecated middleware
- React: Class components → Hooks, lifecycle method changes
- Docker: Deprecated commands and best practices

---

### 4. Outdated Content 🟠 HIGH
**Priority:** High - outdated content loses reader trust over time

- [ ] Check software versions mentioned in the article (are they still current?)
- [ ] Verify that APIs and services referenced are still available
- [ ] Look for security best practices that may have evolved
- [ ] Identify any dated references (e.g., "2017's best practices")
- [ ] Consider if the topic is still relevant or needs a refresh

**Version Disclaimer Template:**
> **Note:** The version shown ([X.Y.Z]) is current as of [Month Year]. Check official documentation for the latest versions and breaking changes.

---

### 5. Security Best Practices 🟠 HIGH
**Priority:** High - security issues can cause real harm to readers

- [ ] Look for hardcoded credentials, API keys, or secrets in examples
- [ ] Verify that environment variables are used for sensitive data
- [ ] Check if authentication patterns follow current best practices
- [ ] Add disclaimers about security considerations where appropriate
- [ ] Ensure file permissions and access controls are mentioned

**Security Note Template:**
> **Security Note:** This tutorial uses [method] for [purpose], which is good practice. Never commit `.env` files with real credentials to version control. Use [alternative approach] for production deployments.

---

### 6. Logical Flow & Clarity 🟡 MEDIUM
**Priority:** Medium - affects readability and user experience

- [ ] Check that the article has a clear introduction, body, and conclusion
- [ ] Verify that steps follow a logical order (can't install before downloading)
- [ ] Look for missing prerequisite information
- [ ] Ensure code examples are explained clearly
- [ ] Check that headings and subheadings guide the reader effectively

---

### 7. SEO & Metadata 🟡 MEDIUM
**Priority:** Medium - affects discoverability

- [ ] Verify front-matter is complete (title, date, description, tags)
- [ ] Check that title is descriptive and includes key terms
- [ ] Ensure description is compelling and under ~160 characters
- [ ] Review tags for relevance and consistency
- [ ] Look for opportunities to add internal links between related articles

---

### 8. Accessibility & Formatting 🟡 MEDIUM
**Priority:** Low - nice-to-have improvements

- [ ] Check that code blocks are properly formatted (fenced with ``` or ~~~)
- [ ] Verify images have alt text (if applicable)
- [ ] Look for proper heading hierarchy (H1 → H2 → H3, not skipping levels)
- [ ] Ensure consistent formatting throughout the article
- [ ] Check that links are descriptive (not "click here")

---

## Post-Review Actions

### If Issues Found:
1. **Document all findings** in a review file (`todo/reviews/YYYY-MM-article-review.md`)
2. **Prioritize fixes** by impact and urgency
3. **Create a PR branch** for the article (e.g., `blog-cleanup/article-name-improvements`)
4. **Write clear commit messages** explaining what was fixed and why

### If No Issues Found:
1. Document this in the review file with "No issues found" or minor notes
2. Consider marking as complete in the task queue
3. Update the article status in `blog-inventory.md`

---

## Review File Template

Create a new file for each article reviewed at: `todo/reviews/YYYY-MM-article-review.md`

```markdown
# Review: [Article Title]

**Date:** 2026-03-13  
**Reviewer:** Klaw (OpenClaw Agent)  
**Original Publish Date:** YYYY-MM-DD  
**Priority Level:** 🔴 CRITICAL / 🟠 HIGH / 🟡 MEDIUM / 🟢 LOW  

## Summary
[Brief summary of the article and overall assessment]

## Issues Found

### Typos & Grammar
- [Issue 1]: Original → Fix
- [Issue 2]: Original → Fix

### Code Accuracy
- [Issue description]: What's wrong, what to do about it

### Version Drift
- [Version mentioned] is from [year]. Current version is [X.Y.Z] as of [date].

### Security Considerations
- Missing security note: Add disclaimer about credentials/secrets
- Outdated auth pattern: Recommend updated approach

## Recommendations

### Quick Wins (Do Now)
1. Fix typos in section X
2. Update version number to current release
3. Add security best practices note

### Medium Priority (Do Soon)
1. Verify all external links still work
2. Check code snippets against current framework versions
3. Improve heading hierarchy for better readability

### Long-term (Nice-to-Have)
1. Consider adding screenshots or diagrams
2. Update SEO metadata with more keywords
3. Add internal links to related articles

## Action Items
- [ ] Create PR branch: `blog-cleanup/article-name-improvements`
- [ ] Commit fixes with clear messages
- [ ] Open pull request with detailed description
- [ ] Link back to this review file in the PR description

---

*This review is part of the OpenClaw blog cleanup project.*
```

---

## Notes for Reviewers

### When to Escalate Issues:
- **Security vulnerabilities** (hardcoded secrets, deprecated auth patterns) → Fix immediately
- **Broken code that won't run** → Document and create PR with working version
- **Major framework changes** (e.g., React class components → hooks) → Consider rewriting or adding prominent disclaimer

### When to Leave As-Is:
- **Historical articles** from 2016-2017 that are clearly outdated but still educational
- **Personal reflection pieces** where the "dated" nature is part of the story
- **Very old tutorials** that can't be easily updated (consider adding a disclaimer at top)

### Best Practices for Updates:
1. **Always add version disclaimers** to technical content
2. **Never commit credentials or secrets** - use environment variables in examples
3. **Document your changes** clearly in commit messages and PR descriptions
4. **Link back to the review file** so future reviewers understand what was fixed

---

*This checklist is part of the OpenClaw blog cleanup project. See [todo/blog-inventory.md](./blog-inventory.md) for the full article list.*
