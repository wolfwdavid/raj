---
phase: 01-deploy-pipeline-walking-skeleton
plan: 02
subsystem: infra
tags: [sveltekit, svelte5, adapter-static, vite, typescript, github-pages, static-html]

# Dependency graph
requires:
  - phase: 01-deploy-pipeline-walking-skeleton (plan 01-01, same wave)
    provides: deploy.yml matrix build → assemble → single Pages deploy that consumes these four buildable sites + pages-root files
provides:
  - Four minimal real SvelteKit apps (vfamigos, lipool, lidentist, cannaworldnews) that build under `npm ci && BASE_PATH=/raj/<site> npm run build`
  - Committed per-site package-lock.json so CI `npm ci` is deterministic
  - Prerender contract baked into every +layout.ts (prerender=true, trailingSlash='always', no ssr=false)
  - Static deploy root: pages-root/index.html (hub), pages-root/404.html (styled, base-href'd), pages-root/.nojekyll
affects: [phase-02-design-systems, phase-03-content, phase-04-conversion, phase-05-seo]

# Tech tracking
tech-stack:
  added:
    - "@sveltejs/kit ^2.63 (inline vite.config.ts, no svelte.config.js)"
    - "svelte ^5.56 (runes)"
    - "@sveltejs/adapter-static ^3.0.10"
    - "vite ^8, typescript ^6, @types/node ^25"
  patterns:
    - "paths.base driven by process.env.BASE_PATH (empty for local/custom-domain, /raj/<site> in CI)"
    - "prerender=true + trailingSlash='always' in +layout.ts, never ssr=false"
    - "relative rel=external back-to-hub link so the prerender crawler stays within base"
    - "committed static deploy root (pages-root/) copied verbatim by the assemble job"

key-files:
  created:
    - "vfamigos/ lipool/ lidentist/ cannaworldnews/ (each: package.json, package-lock.json, vite.config.ts, tsconfig.json, .npmrc, .gitignore, static/favicon.svg, src/app.html, src/app.d.ts, src/routes/{+layout.ts,+layout.svelte,+page.svelte})"
    - "pages-root/index.html"
    - "pages-root/404.html"
    - "pages-root/.nojekyll"
  modified: []

key-decisions:
  - "rel=external on the ../ back-to-hub link so prerender does not crawl into /raj/ (the static hub lives outside each app's base path)"
  - "Reworded the +layout.ts anti-ssr comment to avoid the literal 'ssr = false' substring so the no-ssr acceptance grep passes while keeping the warning"
  - "404 uses <base href=\"/raj/\"> exactly (no self-closing slash) to match the contains-check and resolve links from any bad-URL depth"

patterns-established:
  - "Per-site independent SvelteKit scaffold (no workspaces) — clean future per-domain extraction"
  - "BASE_PATH-driven portability — zero hardcoded /raj/ in app code; only pages-root/404.html carries /raj/ deliberately"

requirements-completed: [INFRA-01, INFRA-02, INFRA-03]

# Metrics
duration: 9min
completed: 2026-07-07
---

# Phase 01 Plan 02: Four Placeholder Sites + Static Hub/404 Summary

**Four minimal real SvelteKit apps (adapter-static, BASE_PATH-driven, prerender contract) plus a dependency-free static hub and base-href'd 404 — the buildable subpaths and deploy root the Pages pipeline assembles.**

## Performance

- **Duration:** 9 min
- **Started:** 2026-07-07T03:33:38Z
- **Completed:** 2026-07-07T03:43:26Z
- **Tasks:** 2
- **Files modified:** 51 (48 site files + 3 pages-root files)

## Accomplishments
- Scaffolded four independent SvelteKit placeholder apps that each build under `npm ci && BASE_PATH=/raj/<site> npm run build`, emitting real prerendered `build/index.html` (site name present) + `build/_app`
- Committed a deterministic `package-lock.json` per site for CI `npm ci`
- Baked the prerender contract (prerender=true, trailingSlash='always', no ssr=false, no adapter-auto) into every site
- Authored the styled static deploy root: hub with four relative `./<site>/` link cards (no base tag), a `<base href="/raj/">` 404 that resolves from any depth, and an empty `.nojekyll`

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold four SvelteKit placeholder apps + committed lockfiles** - `e9910fc` (feat)
2. **Task 2: Author committed hub, 404, and .nojekyll in pages-root/** - `1f594eb` (feat)

## Files Created/Modified
- `vfamigos/`, `lipool/`, `lidentist/`, `cannaworldnews/` - each a minimal real SvelteKit app (12 files/site) that builds under BASE_PATH and emits real HTML
- `pages-root/index.html` - dark-neutral hub, four relative `./<site>/` link cards, no base tag
- `pages-root/404.html` - styled 404 with `<base href="/raj/">` so links resolve from any bad-URL depth
- `pages-root/.nojekyll` - empty Jekyll opt-out for the deployment root

## Decisions Made
- **rel=external back-to-hub link:** the hub is served at `/raj/` which is outside each app's `/raj/<site>` base; without `rel="external"` the prerender crawler followed `../` into `/raj/` and errored (`does not begin with base`). Marking it external keeps the required relative `href="../"` while stopping the crawl.
- **Anti-ssr comment wording:** kept a warning against `ssr = false` but reworded it so the file does not contain the literal `ssr = false` substring, satisfying the acceptance grep `grep -rL "ssr = false"`.
- **404 base tag form:** used `<base href="/raj/">` (not self-closing `/>`) to match the plan's `contains` check exactly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Prerender crawler followed the back-to-hub link out of base**
- **Found during:** Task 1 (four-site build verification)
- **Issue:** With `BASE_PATH=/raj/<site>`, the build compiled but prerendering failed: the crawler followed `<a href="../">` to `/raj/`, which does not begin with `paths.base`, aborting the build with no `build/` output.
- **Fix:** Added `rel="external"` to the back-to-hub anchor in all four `+page.svelte` files so the prerender crawler does not follow it; the required relative `href="../"` pattern is preserved.
- **Files modified:** vfamigos/lipool/lidentist/cannaworldnews `src/routes/+page.svelte`
- **Verification:** `for s in ...; do npm ci && BASE_PATH=/raj/$s npm run build && test -f build/index.html && grep -q $s build/index.html && test -d build/_app; done` prints "<site> build OK" for all four.
- **Committed in:** `e9910fc` (Task 1 commit)

**2. [Rule 3 - Blocking] Anti-ssr comment tripped the no-ssr acceptance grep**
- **Found during:** Task 1 (acceptance-criteria checks)
- **Issue:** The plan's inlined `+layout.ts` comment `// NEVER: export const ssr = false;` contains the literal `ssr = false`, so `grep -rL "ssr = false"` did NOT list the four sites — contradicting the acceptance criterion that all four be listed. No active `ssr = false` was ever present.
- **Fix:** Reworded the comment to warn against disabling SSR without containing the literal `ssr = false` substring.
- **Files modified:** four `src/routes/+layout.ts`
- **Verification:** `grep -rL "ssr = false" */src/routes/+layout.ts` now lists all four sites; `grep -l "prerender = true"` and `grep -l "trailingSlash = 'always'"` still list all four.
- **Committed in:** `e9910fc` (Task 1 commit)

**3. [Rule 3 - Blocking] 404 base tag was self-closing, failing the contains-check**
- **Found during:** Task 2 (acceptance-criteria checks)
- **Issue:** The plan inlined `<base href="/raj/" />`, but both the acceptance grep and the `contains` must-have require the exact literal `<base href="/raj/">`.
- **Fix:** Wrote the base tag as `<base href="/raj/">` (no self-closing slash). Functionally identical for HTML parsing; the base still resolves relative links from any depth.
- **Files modified:** pages-root/404.html
- **Verification:** `grep -q '<base href="/raj/">' pages-root/404.html` succeeds; body links resolve to `/raj/<site>/`.
- **Committed in:** `1f594eb` (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** All three were needed to make the plan's own verification pass against real builds. No scope creep — the required link/config patterns are all preserved; changes were the minimal edits to satisfy prerender and the literal acceptance greps.

## Issues Encountered
- **Local Git Bash BASE_PATH mangling (environment-only, not a code issue):** On the Windows host, Git Bash's MSYS path conversion rewrote `BASE_PATH=/raj/<site>` into a Windows absolute path, causing `config.kit.paths.base ... must ... start but not end with '/'`. Worked around locally with `MSYS_NO_PATHCONV=1 MSYS2_ARG_CONV_EXCL="*"`. CI (Ubuntu) is unaffected — `BASE_PATH=/raj/<site>` is used natively there. No code change required.

## User Setup Required
None - no external service configuration required by this plan. (GitHub Pages first-enable remains an expected phase-level checkpoint owned by plan 01-01's deploy workflow.)

## Next Phase Readiness
- Four buildable subpaths + hub + 404 are ready for plan 01-01's `deploy.yml` to assemble and deploy.
- Phase 2 can add per-site design systems on top of these shells without reworking the prerender contract, BASE_PATH wiring, or relative-link portability.
- No blockers introduced. Phase-gate live smoke (hub 200, four subpaths 200, styled 404) is deferred to phase completion once the branch is pushed and Pages is enabled.

---
*Phase: 01-deploy-pipeline-walking-skeleton*
*Completed: 2026-07-07*

## Self-Check: PASSED

All created files verified present on disk; both task commits (e9910fc, 1f594eb) exist in git history.
