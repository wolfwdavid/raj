---
phase: 01-deploy-pipeline-walking-skeleton
plan: 01
subsystem: infra
tags: [github-actions, github-pages, sveltekit, matrix-build, adapter-static, ci-cd]

# Dependency graph
requires: []
provides:
  - "Single-source-of-truth deploy pipeline: matrix build (4 sites) -> assemble one _site tree -> exactly one GitHub Pages deployment"
  - "Portable BASE_PATH derivation (github.event.repository.name + matrix.site) — zero hardcoded /raj/"
  - "download-artifact@v4 un-nesting + per-site index.html + count==4 assertions gating deploy"
  - "Post-deploy live HTTP smoke script (hub + 4 subpaths 200, bad URL 404) usable as a phase gate"
  - "First-enable manual checkpoint documented in the workflow header (D-10)"
affects: [01-02, 02, 03, 04, 05, custom-domain-cutover]

# Tech tracking
tech-stack:
  added: [actions/upload-artifact@v4, actions/download-artifact@v4, actions/configure-pages@v5, actions/upload-pages-artifact@v3, actions/deploy-pages@v4]
  patterns:
    - "Matrix build with plain per-leg upload-artifact named site-<site>, then a separate assemble job — NEVER upload-pages-artifact inside the matrix (GitHub allows one Pages deployment per repo)"
    - "Assemble job un-nests download-artifact@v4 output from _artifacts/site-<name>/. and fails loudly unless exactly four <site>/index.html exist"
    - "BASE_PATH from repo-name context, never hardcoded — custom-domain readiness"

key-files:
  created:
    - .github/workflows/deploy.yml
    - scripts/smoke-deploy.sh
  modified: []

key-decisions:
  - "Reworded a build-job comment to remove a literal upload-pages-artifact string collision so the single-Pages-artifact grep gate reads exactly 1 (functional shape unchanged)"

patterns-established:
  - "Single Pages deploy pipeline: matrix build -> assemble _site -> one upload-pages-artifact + one deploy-pages"
  - "Loud CI assertions (per-site index.html + total count==4) gate the deploy step"
  - "Live post-deploy smoke as the phase gate instrument, base-URL overridable for future custom domains"

requirements-completed: [INFRA-01]

# Metrics
duration: 3min
completed: 2026-07-07
---

# Phase 01 Plan 01: Deploy Pipeline Walking Skeleton Summary

**Single GitHub Actions workflow that builds four SvelteKit sites in a fail-fast:false matrix, assembles them into one `_site/` tree with loud per-site assertions, and performs exactly one GitHub Pages deployment — plus a live six-URL smoke gate.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-07-07T03:32:51Z
- **Completed:** 2026-07-07T03:36:20Z
- **Tasks:** 2
- **Files modified:** 2 (both created)

## Accomplishments
- `.github/workflows/deploy.yml`: three-job pipeline (build matrix / assemble / deploy) proving the matrix->assemble->single-deploy shape — the only novel architectural element and the biggest looks-done-but-isn't risk.
- Build job iterates `[vfamigos, lipool, lidentist, cannaworldnews]` with `fail-fast: false`, per-site npm cache, `BASE_PATH` derived from repo-name context (zero hardcoded `/raj/`), and a plain `upload-artifact@v4` named `site-<site>` (never `upload-pages-artifact` per leg).
- Assemble job un-nests `download-artifact@v4` output from `_artifacts/site-<name>/.`, copies hub/404/.nojekyll, and fails loudly unless exactly four `<site>/index.html` exist (count==4 assertion).
- Exactly one `upload-pages-artifact@v3` + one `deploy-pages@v4`; concurrency group `pages` + `workflow_dispatch` + first-enable manual checkpoint documented in the header (D-07..D-10).
- `scripts/smoke-deploy.sh`: live HTTP gate curling the hub + four subpaths (expect 200) and a bad URL (expect 404), exiting non-zero on any failure, base-URL overridable for custom-domain cutover. Committed with exec bit (100755).

## Task Commits

Each task was committed atomically:

1. **Task 1: Author deploy.yml (matrix build -> assemble -> single deploy)** - `d34e2d9` (feat)
2. **Task 2: Commit the post-deploy live smoke script** - `1879493` (feat)

**Plan metadata:** see final docs commit.

## Files Created/Modified
- `.github/workflows/deploy.yml` - Matrix build -> assemble -> single Pages deploy pipeline (87 lines).
- `scripts/smoke-deploy.sh` - Post-deploy live HTTP smoke over hub + 4 subpaths + 404 (executable, 100755).

## Decisions Made
- Kept the workflow content verbatim from 01-RESEARCH.md except one non-functional comment reword (see Deviations). Every load-bearing value (action versions, matrix, BASE_PATH derivation, nested-path copy, assertions, single upload/deploy, concurrency, workflow_dispatch, first-enable header) preserved exactly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Reworded a build-job comment to satisfy the single-Pages-artifact grep gate**
- **Found during:** Task 1 (Author deploy.yml)
- **Issue:** The verbatim comment `# plain artifact — NOT upload-pages-artifact` contains the literal string `upload-pages-artifact`, so the plan's own acceptance criterion `grep -c "upload-pages-artifact" == 1` read 2 (one real action usage + the comment mention). The functional shape was already correct — exactly one real `upload-pages-artifact@v3` usage.
- **Fix:** Changed the comment to `# plain artifact — NOT the Pages-specific uploader`. No behavioral change; the single real Pages-artifact usage and all other load-bearing values are untouched.
- **Files modified:** .github/workflows/deploy.yml
- **Verification:** `grep -c "upload-pages-artifact"` now returns 1; YAML still valid; all other grep criteria still pass.
- **Committed in:** d34e2d9 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking / verification-gate reconciliation)
**Impact on plan:** Cosmetic comment change only; the pipeline shape and every load-bearing value match the plan exactly. No scope creep.

## Issues Encountered
None beyond the deviation above. Author-time verification is fully local (YAML parse + bash -n + greps); the true CI/live verification is deferred to the phase gate after plan 01-02 lands the site folders and pages-root/, the branch is pushed to main, and the first-enable manual step is performed.

## User Setup Required
None at author time. A one-time manual step is expected at first deploy (documented in the workflow header): if the first green run 404s, set Settings -> Pages -> Source = "GitHub Actions" and re-run via workflow_dispatch (GitHub Pages first-enable race, D-10). This is expected on a brand-new repo, not a bug.

## Next Phase Readiness
- Pipeline is authored and committed; it consumes site folders (`<site>/package-lock.json`, `<site>/build/`) and `pages-root/` (index.html, 404.html, .nojekyll) that plan 01-02 (same wave) creates. The workflow does not need them to exist at author time.
- Phase gate (deferred): push to main -> matrix runs four legs -> assemble assertions gate the single deploy -> run `bash scripts/smoke-deploy.sh` for six green checks before `/gsd:verify-work`.
- Blocker/reminder carried forward: GitHub Pages first-enable race and download-artifact@v4 nesting are handled in-workflow.

---
*Phase: 01-deploy-pipeline-walking-skeleton*
*Completed: 2026-07-07*

## Self-Check: PASSED

- FOUND: .github/workflows/deploy.yml
- FOUND: scripts/smoke-deploy.sh
- FOUND: .planning/phases/01-deploy-pipeline-walking-skeleton/01-01-SUMMARY.md
- FOUND commit: d34e2d9 (Task 1)
- FOUND commit: 1879493 (Task 2)
