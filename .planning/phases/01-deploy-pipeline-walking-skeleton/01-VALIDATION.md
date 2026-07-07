---
phase: 1
slug: deploy-pipeline-walking-skeleton
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-06
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — build/CI assertions + live HTTP smoke (no test runner by design; see 01-RESEARCH.md Validation Architecture) |
| **Config file** | none — Wave 0 not required |
| **Quick run command** | `BASE_PATH=/raj/<site> npm run build` (per touched site) + `test -f build/index.html` |
| **Full suite command** | all four: `for s in vfamigos lipool lidentist cannaworldnews; do (cd $s && BASE_PATH=/raj/$s npm run build); done` + grep built HTML for content |
| **Estimated runtime** | ~30–60 s per site build |

---

## Sampling Rate

- **After every task commit:** Run the quick build for each site folder the task touched
- **After every plan wave:** Run the full four-site build + hub/404 file existence checks
- **Before `/gsd:verify-work`:** Full builds green locally AND GitHub Actions run green AND live URLs return 200
- **Max feedback latency:** ~120 s (local); CI/live feedback gated on Actions run (~2–4 min)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| (filled by planner per task) | 01/02 | 1 | INFRA-01 | build+CI assert | matrix build green; assemble asserts 4× `<site>/index.html` | ✅ CI | ⬜ pending |
| (filled by planner per task) | 02 | 1 | INFRA-02 | file+HTTP | `test -f pages-root/index.html`; live `curl -s https://wolfwdavid.github.io/raj/` contains 4 site links | ✅ | ⬜ pending |
| (filled by planner per task) | 02 | 1 | INFRA-03 | file+HTTP | `test -f pages-root/404.html`; live unknown URL returns styled 404 | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements — no test framework installation; validation is build assertions, CI workflow assertions, and live HTTP smoke checks.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| GitHub Pages first enablement | INFRA-01 | One-time GitHub settings state outside git; `configure-pages enablement:true` may race on first run | If first Actions run fails at configure-pages or site 404s: Settings → Pages → Source = GitHub Actions, then re-run workflow via workflow_dispatch |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (none)
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s local
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
