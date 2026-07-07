---
phase: 3
slug: content-dynamic-routes
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-07
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — `svelte-check` + `vite build` (prerender) + built-HTML assertions + entries()/file-count check (no unit runner; prerendered output IS the test surface) |
| **Config file** | none — Wave 0 not required |
| **Quick run command** | per touched site: `npm run check && BASE_PATH=/raj/<site> npm run build` |
| **Full suite command** | all four: check + build + assert built file count == data record count per dynamic route + grep built HTML for real content + portability grep |
| **Estimated runtime** | ~30–90 s per site (cannaworldnews slower — markdown pass) |

---

## Sampling Rate

- **After every task commit:** `npm run check` + BASE_PATH build for the touched site; if the task added a dynamic route, assert built page count matches data
- **After every plan wave:** all four check+build; assert every dynamic route prerendered a dir/index.html per record; grep for real content (no empty shells); portability grep clean
- **Before `/gsd:verify-work`:** all four green locally + CI green + live deep-link + hard-refresh smoke on one dynamic route per site
- **Max feedback latency:** ~150 s local

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| (filled by planner) | 03-01 | 1 | VFAM-01/02/06 | build+count | build; `ls vfamigos/build/products/*/index.html \| wc -l` == products.ts length | ✅ | ⬜ pending |
| (filled by planner) | 03-02 | 1 | DENT-01/02/03/05/06 | build+grep | build; grep detail HTML for review cards + sample-data banner text | ✅ | ⬜ pending |
| (filled by planner) | 03-03 | 1 | NEWS-01/02/03 | build+count | build; article + region dir count == data; grep article HTML for `<time datetime` | ✅ | ⬜ pending |
| (filled by planner) | 03-04 | 1 | POOL-01/02/04/05 | build+grep | build; grep footer for `application/ld+json` + HomeAndConstructionBusiness + NO aggregateRating; `tel:` in header | ✅ | ⬜ pending |
| (filled by planner) | 03-05 | 2 | INFRA-05/07 | build+CI | CI content-in-HTML + file-count/deep-link assertions across all four sites | ✅ CI | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements — validation is `svelte-check`, prerender `vite build`, built-file-count assertions, and content greps. No test framework install.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Deep-link + hard refresh on dynamic routes | INFRA-07 | Real Pages serving behavior | After deploy, load a `/products/<slug>/`, `/dentists/<slug>/`, `/articles/<slug>/`, `/region/<r>/` directly and hard-refresh — expect 200 + real content |
| Content believability + sample-data clarity | DENT-05 | Editorial/compliance judgment | Confirm lidentist sample-data banner is unmistakable on directory + detail; cannaworldnews reads as informational news |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none)
- [x] No watch-mode flags
- [x] Feedback latency < 150s local
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-07 (content phase; prerender-output validation + file-count assertions + compliance grep, manual deep-link/believability pass documented)
