---
phase: 02-per-site-shells-scaffold-conventions
plan: 01
subsystem: infra
tags: [github-actions, sveltekit, adapter-static, svelte-check, ci, base-path, a11y, design-tokens]

# Dependency graph
requires:
  - phase: 01-deploy-pipeline-walking-skeleton
    provides: "deploy.yml matrix build → assemble → single deploy; four scaffolded SvelteKit apps with prerender contract, BASE_PATH-driven base, check script; rel=external hub link pattern"
provides:
  - "CI svelte-check gate (npm run check) on every site build leg"
  - "CI empty-BASE_PATH build step proving custom-domain readiness (INFRA-04)"
  - "CI portability guard grepping built HTML for root-absolute href/src incl. hardcoded /raj/ (INFRA-06)"
  - "02-CONVENTIONS.md: copy-ready shell exemplar (tokens.css, app.html fonts, +layout/SiteHeader/SiteFooter skeletons, prerender-safe rel=external nav rule, a11y checklist, per-site verify recipe)"
affects: [02-02-vfamigos-lipool-shells, 02-03-lidentist-cannaworldnews-shells, 03-content-dynamic-routes]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Attribute-scoped portability grep '(href|src)=\"/[^/]' — flags root-absolute assets/links but ignores base-derived hydration assets: JSON, relative ./ , protocol-relative //, and absolute https:// URLs"
    - "svelte-check as a hard CI gate per matrix site leg"
    - "Dual-base build in CI (empty BASE_PATH then deployed BASE_PATH last) so the shipped artifact is base-correct"
    - "Design-token layer: per-site src/lib/styles/tokens.css CSS custom properties, imported once in +layout.svelte; no Tailwind/framework"
    - "Prerender-safe nav: rel=external on links to not-yet-built Phase-3 routes so the crawler does not fail the build"

key-files:
  created:
    - .planning/phases/02-per-site-shells-scaffold-conventions/02-CONVENTIONS.md
  modified:
    - .github/workflows/deploy.yml

key-decisions:
  - "Guard greps ATTRIBUTE VALUES (href=/src=) not raw /raj/ — the base-derived hydration `assets: \"/raj/<site>\"` JSON is correct and must not trip the build; a source-level /raj/ grep would false-positive on the Phase-1 placeholder comment"
  - "Deployed BASE_PATH build runs LAST of the two builds so build/ holds the base-correct artifact for upload-artifact"
  - "Real route hrefs now (not # stubs), guarded by rel=external until Phase 3 lights each route up"

patterns-established:
  - "Portability guard: attribute-scoped grep on built HTML, run after the deployed build"
  - "Shell convention document is the single source of truth Wave-2 shells copy from verbatim"

requirements-completed: [INFRA-04, INFRA-06, QUAL-02]

# Metrics
duration: 5min
completed: 2026-07-07
---

# Phase 2 Plan 01: Shared Scaffold Conventions Summary

**CI now enforces svelte-check, an empty-BASE_PATH build, and an attribute-scoped built-HTML portability guard on every site leg; 02-CONVENTIONS.md gives Wave-2 shells a copy-ready tokens/app.html/layout/header/footer skeleton with a prerender-safe nav rule and a11y checklist.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-07T04:21:33Z
- **Completed:** 2026-07-07T04:26:31Z
- **Tasks:** 2
- **Files modified:** 2 (1 modified, 1 created)

## Accomplishments
- Extended the single `deploy.yml` matrix build leg (no second workflow) with three gates: `npm run check` (svelte-check), an empty-`BASE_PATH` build (custom-domain readiness), and a built-HTML portability grep that fails on root-absolute `href`/`src` including hardcoded `/raj/`.
- Proved all three gates locally against a real vfamigos build: `check` = 0 errors, clean build passes the guard, a synthetic `href="/products/"` + `src="/raj/vfamigos/a.png"` is caught, and the base-derived hydration `assets: "/raj/vfamigos"` JSON is correctly ignored.
- Authored `02-CONVENTIONS.md` — the copy-ready shell exemplar (tokens.css palette layer, app.html Google-Fonts links, `+layout.svelte`/`SiteHeader.svelte`/`SiteFooter.svelte` skeletons, prerender-safe `rel="external"` nav rule, D-11 a11y checklist, and a per-site Windows Git Bash verify recipe).

## Task Commits

Each task was committed atomically:

1. **Task 1: Add svelte-check gate + empty-base build + portability grep to deploy.yml** - `0382e31` (ci)
2. **Task 2: Author 02-CONVENTIONS.md — the copy-ready shell skeleton** - `c9f0b4e` (docs)

**Plan metadata:** committed separately (docs: complete plan)

## Files Created/Modified
- `.github/workflows/deploy.yml` - Build matrix leg now runs svelte-check, an empty-BASE_PATH build, the deployed BASE_PATH build (last), and the portability guard; assemble/deploy jobs untouched; still one workflow, one upload-pages-artifact@v3, one deploy-pages@v4.
- `.planning/phases/02-per-site-shells-scaffold-conventions/02-CONVENTIONS.md` - Single-source-of-truth shell skeleton and conventions for plans 02-02 and 02-03.

## Decisions Made
- Guard scopes to `(href|src)="/[^/]` attribute values (per the plan's empirically-verified interfaces) rather than a raw `/raj/` search — this precisely satisfies INFRA-06 on built HTML without false-positiving on the legitimate base-derived hydration `assets:` JSON or the Phase-1 placeholder's `/raj/` code comment.
- Ordered the deployed-BASE_PATH build after the empty-base build so `build/` holds the base-correct artifact that `upload-artifact` ships and that the guard greps.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. Git Bash `MSYS_NO_PATHCONV=1` was used per the environment note to keep `BASE_PATH=/raj/vfamigos` from being mangled into a Windows path during the local build proof.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Both guardrails and the shell convention are locked before any shell is built, exactly as the Wave-1 → Wave-2 dependency requires.
- 02-02 (vfamigos + lipool) and 02-03 (lidentist + cannaworldnews) can now copy `02-CONVENTIONS.md` verbatim and self-verify against the same three gates CI enforces.
- No site source was touched, so the Wave-1-only push stays green on the existing Phase-1 placeholders.

## Self-Check: PASSED

- FOUND: `.github/workflows/deploy.yml`
- FOUND: `.planning/phases/02-per-site-shells-scaffold-conventions/02-CONVENTIONS.md`
- FOUND: `.planning/phases/02-per-site-shells-scaffold-conventions/02-01-SUMMARY.md`
- FOUND commit: `0382e31` (Task 1)
- FOUND commit: `c9f0b4e` (Task 2)

---
*Phase: 02-per-site-shells-scaffold-conventions*
*Completed: 2026-07-07*
