---
phase: 2
slug: per-site-shells-scaffold-conventions
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-07
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — `svelte-check` + `vite build` + CI portability grep (no unit-test runner; UI shells validated by build success, type-check, HTML assertions) |
| **Config file** | none — Wave 0 not required |
| **Quick run command** | per touched site: `npm run check && BASE_PATH=/raj/<site> npm run build` |
| **Full suite command** | all four: check + BASE_PATH build + grep built HTML for design tokens/nav/footer + portability grep (no `/raj/` or root-absolute assets) |
| **Estimated runtime** | ~30–60 s per site |

---

## Sampling Rate

- **After every task commit:** `npm run check` + BASE_PATH build for the touched site
- **After every plan wave:** all four check+build; grep built HTML for per-site brand markers (font family link, palette token, nav landmarks)
- **Before `/gsd:verify-work`:** all four green locally + CI (svelte-check gate + portability grep) green on push
- **Max feedback latency:** ~120 s local

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| (filled by planner) | 02-01 | 1 | INFRA-04, INFRA-06, QUAL-02 | build+CI | deploy.yml adds `npm run check` gate + portability grep; both fail-on-error | ✅ CI | ⬜ pending |
| (filled by planner) | 02-02/03 | 2 | QUAL-01, QUAL-03 | build+grep | built HTML contains site font link + palette token + `<header>/<nav>/<main>/<footer>` + skip-link | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements — validation is `svelte-check`, `vite build`, and CI grep assertions. No test framework install.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Four sites look like four distinct brands | QUAL-01 | Visual brand distinction is subjective | Load each live subpath; confirm distinct palette + fonts + layout match `.planning/design/<site>.md` |
| Keyboard/focus/reduced-motion a11y feel | QUAL-03 | Interaction feel needs manual pass | Tab through nav, confirm visible focus rings, skip-link works, reduced-motion honored |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none)
- [x] No watch-mode flags
- [x] Feedback latency < 120s local
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-07 (UI shell phase; build/type/CI-grep validation, manual visual+a11y pass documented)
