---
phase: 5
slug: seo-hardening-compliance-gate
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-07
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — `svelte-check` + `vite build` + built-HTML meta/compliance greps (title/description/canonical/OG/published_time/disclaimer + negative fake-success + FTC label + no-aggregateRating), enforced in CI |
| **Config file** | none — Wave 0 not required |
| **Quick run command** | per touched site: `npm run check && BASE_PATH=/raj/<site> npm run build` |
| **Full suite command** | all four: check + build + grep every built index.html for `<title>` + `meta name="description"` + `rel="canonical"` + og tags; cannaworldnews articles for `article:published_time`; disclaimer; site-wide negative fake-success; lidentist FTC label; lipool no aggregateRating |
| **Estimated runtime** | ~40–90 s per site |

---

## Sampling Rate

- **After every task commit:** `npm run check` + BASE_PATH build for touched site; grep a representative built page for the new meta tags
- **After every plan wave:** all four check+build; run the full compliance grep suite (the audit gate) locally
- **Before `/gsd:verify-work`:** all four green locally + CI compliance assertions green + live spot-check of canonical/OG/published_time/disclaimer on representative pages
- **Max feedback latency:** ~120 s local

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| (filled by planner) | 05-01 | 1 | QUAL-04 | build+grep | Seo.svelte per site; SITE_URL in config.ts; every built index.html has unique `<title>` + `meta name="description"` + `rel="canonical" href="https://..."` (SITE_URL-derived, absolute) | ✅ | ⬜ pending |
| (filled by planner) | 05-02 | 2 | NEWS-04, NEWS-05 | build+grep+audit | article HTML has `article:published_time`; cannaworldnews footer disclaimer present every page; deploy.yml compliance gate (no-fake-success site-wide + FTC label + no aggregateRating + title/canonical presence) | ✅ CI | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements — validation is `svelte-check`, `vite build`, and built-HTML meta/compliance greps wired into CI. No test framework install.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Canonical/OG URLs are custom-domain-ready | QUAL-04 | Judgment: URLs derive from SITE_URL not BASE_PATH | Inspect built `<head>` canonical/og:url — absolute, SITE_URL-based; flipping VITE_SITE_URL changes them, BASE_PATH does not |
| Compliance posture holistically sound | NEWS-05/DENT-05 | Regulatory judgment | Confirm cannabis disclaimer reads as informational-only; lidentist sample-data unmistakable; no fake success anywhere |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none)
- [x] No watch-mode flags
- [x] Feedback latency < 120s local
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-07 (final SEO+compliance phase; meta/compliance greps enforced in CI, custom-domain-readiness + regulatory posture manual)
