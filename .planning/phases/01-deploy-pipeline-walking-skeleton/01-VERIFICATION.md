---
phase: 01-deploy-pipeline-walking-skeleton
verified: 2026-07-07T00:00:00Z
status: passed
score: 9/9 must-haves verified
---

# Phase 1: Deploy Pipeline Walking Skeleton Verification Report

**Phase Goal:** Prove the single-Pages-deployment CI pattern (matrix build -> assemble -> single deploy) against trivial content. Success criteria: (1) push to main serves hub at wolfwdavid.github.io/raj/ linking four subpaths with relative links; (2) each of /raj/vfamigos/, /raj/lipool/, /raj/lidentist/, /raj/cannaworldnews/ loads a placeholder page; (3) unknown /raj/ URL returns styled root 404 linking back; (4) matrix-build -> assemble -> single-upload-pages-artifact workflow completes green with exactly one Pages deployment.
**Verified:** 2026-07-07
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Hub at `wolfwdavid.github.io/raj/` links four subpaths with relative links | VERIFIED | Live `curl` of hub returns `<h1>raj</h1>` + `href="./vfamigos/"`, `href="./lipool/"`, `href="./lidentist/"`, `href="./cannaworldnews/"`; `pages-root/index.html` committed with identical markup, no `<base>` tag, no root-absolute site hrefs |
| 2 | Each of the four subpaths loads a placeholder page | VERIFIED | Live `curl` of all four subpaths returns HTTP 200; `/raj/vfamigos/` body contains `<h1>vfamigos</h1>`; each `<site>/src/routes/+page.svelte` renders `<h1>{site}</h1>` + "Coming soon." + relative `href="../"` back-link |
| 3 | Unknown `/raj/` URL returns styled root 404 linking back | VERIFIED | Live `curl` of `nonexistent-test-123/` returns HTTP 404; body contains `<base href="/raj/">`, "404", "not found"; `pages-root/404.html` links all four sites + hub, no root-absolute body hrefs |
| 4 | matrix-build -> assemble -> single-upload-pages-artifact workflow completes green with exactly one Pages deployment | VERIFIED | GH Actions run 28840207583: 4 build legs + assemble + deploy all green; artifacts list shows one `github-pages` artifact + four plain `site-<name>` artifacts (no per-leg Pages artifact); `deploy.yml` has exactly one `upload-pages-artifact@v3` and one `deploy-pages@v4` |
| 5 | Build job matrix runs all four sites with fail-fast:false, BASE_PATH derived from repo name | VERIFIED | `deploy.yml` lines 24-27 (`fail-fast: false`, `matrix.site: [vfamigos, lipool, lidentist, cannaworldnews]`), line 40 (`BASE_PATH: /${{ github.event.repository.name }}/${{ matrix.site }}`) — zero hardcoded `/raj/` in build job |
| 6 | Assemble job un-nests artifacts and asserts exactly four `<site>/index.html` | VERIFIED | `deploy.yml` lines 53-71: `download-artifact@v4` with `path: _artifacts`, per-site `test -f "_artifacts/site-$site"` + `cp -r .../.`, per-site `index.html` assertion, `count -eq 4` guard |
| 7 | First-enable Pages race documented as manual checkpoint | VERIFIED | `deploy.yml` header comment lines 1-4 documents the exact manual fallback; corroborated live (Pages was in fact enabled via API `build_type=workflow` after the documented race occurred on the first push) |
| 8 | Every `+layout.ts` sets `prerender=true`/`trailingSlash='always'`, never `ssr=false` | VERIFIED | All four sites' `src/routes/+layout.ts` contain `export const prerender = true;` + `export const trailingSlash = 'always';`; none contain the literal `ssr = false` |
| 9 | Committed smoke script gates hub + four subpaths (200) + bad URL (404) | VERIFIED | `scripts/smoke-deploy.sh` loops `"" vfamigos/ lipool/ lidentist/ cannaworldnews/` expecting 200, then one bad URL expecting 404, exits non-zero on any failure; independently re-run live by this verifier with identical 6/6 pass result |

**Score:** 9/9 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.github/workflows/deploy.yml` | matrix build -> assemble -> single deploy pipeline, >=60 lines | VERIFIED | 88 lines, valid YAML, three jobs (build/assemble/deploy), all load-bearing values present (fail-fast:false, plain per-leg upload-artifact, BASE_PATH from context, nested-path copy, count==4 assertion, single upload-pages-artifact + deploy-pages, concurrency, workflow_dispatch, first-enable header) |
| `scripts/smoke-deploy.sh` | post-deploy live HTTP smoke, curl-based | VERIFIED | Valid bash, curls all 6 URLs with correct expected codes, exits non-zero on failure, executable bit set (100755) |
| `vfamigos/vite.config.ts` (+ 3 siblings) | `paths.base` from `process.env.BASE_PATH` | VERIFIED | Identical `paths: { base: (process.env.BASE_PATH ?? '') ... }` in all four sites |
| `<site>/src/routes/+layout.ts` (x4) | prerender contract | VERIFIED | `prerender = true` + `trailingSlash = 'always'` in all four, no `ssr = false` |
| `<site>/src/routes/+page.svelte` (x4) | placeholder with relative back-to-hub link | VERIFIED | `<h1>{site}</h1>`, "Coming soon.", `href="../" rel="external"` in all four |
| `<site>/package-lock.json` (x4) | committed lockfile for `npm ci` | VERIFIED | All four tracked in git (`git ls-files` confirms) |
| `pages-root/index.html` | hub linking four sites relatively, no base tag | VERIFIED | 45 lines, four `./<site>/` cards, no `<base>` tag, no root-absolute hrefs |
| `pages-root/404.html` | styled 404, `<base href="/raj/">`, links four sites + hub | VERIFIED | 43 lines, `<base href="/raj/">` present, all five nav links (hub + 4 sites) present, none root-absolute |
| `pages-root/.nojekyll` | empty Jekyll opt-out | VERIFIED | Present, 0 bytes, tracked in git |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| build job `upload-artifact` (name `site-${{ matrix.site }}`) | assemble job `download-artifact` (pattern `site-*`) | artifact name/pattern match | WIRED | Live run artifact list shows `site-vfamigos`, `site-lipool`, `site-lidentist`, `site-cannaworldnews` produced by build legs and consumed by assemble (assemble job succeeded, which requires all four to download) |
| assemble `cp` from `_artifacts/site-$site/.` | `_site/$site/` | explicit nested-path copy + per-site index.html assertion | WIRED | Assemble job green (would fail loudly per `::error::` guards otherwise); live subpaths render correct per-site content, confirming correct un-nesting |
| assemble `upload-pages-artifact@v3` (path `_site`) | deploy job `deploy-pages@v4` | single Pages artifact -> single deployment | WIRED | Live run: one `github-pages` artifact, one deploy job, live hub + 4 subpaths + 404 all serve correct distinct content from the single `_site` tree |
| `vite.config.ts` `paths.base` | `process.env.BASE_PATH` (injected by deploy.yml build leg) | `(process.env.BASE_PATH ?? '')` | WIRED | Live `/raj/vfamigos/` etc. resolve correctly, meaning BASE_PATH flowed through the build into each site's base path |
| `+page.svelte` back-to-hub link | `/raj/` hub | relative `href="../"` | WIRED | Confirmed present verbatim in all four; deliberately `rel="external"` so the prerender crawler (which runs inside build) does not error, without changing the relative href contract |
| `pages-root/index.html` link cards | four site subpaths | relative `./<site>/` links | WIRED | Live-rendered exactly as authored |
| `pages-root/404.html` `<base href="/raj/">` + relative links | four site subpaths + hub from any depth | base tag | WIRED | Live bad-URL request at a nested unknown path returns the 404 body with the base tag intact |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| INFRA-01 | 01-01, 01-02 | Visitor reaches all four sites from one Pages deployment after single push to main | SATISFIED | Live run 28840207583 (workflow_dispatch, same deploy.yml as pushed to main) green; all 4 subpaths return 200 live |
| INFRA-02 | 01-02 | Hub page at `/raj/` links to all four sites via relative links | SATISFIED | `pages-root/index.html` + live hub render confirmed |
| INFRA-03 | 01-02 | Unknown URL gets styled root 404 linking to four sites | SATISFIED | `pages-root/404.html` + live 404 render confirmed |

No orphaned requirements — REQUIREMENTS.md maps only INFRA-01/02/03 to Phase 1, and both plans jointly declare exactly these three IDs across their `requirements` frontmatter fields.

### Anti-Patterns Found

None. Scanned `.github/workflows/deploy.yml`, `scripts/smoke-deploy.sh`, `pages-root/index.html`, `pages-root/404.html`, and one representative site's `+page.svelte`/`vite.config.ts` for TODO/FIXME/placeholder/stub markers — no matches. All four sites' source is materially identical by design (per plan), verified per-site individually above.

### Human Verification Required

None. All observable truths, artifacts, and key links were verifiable programmatically via git history, static file inspection, the live GitHub Actions run, and live HTTP requests against the deployed site.

### Gaps Summary

No gaps. All 9 derived observable truths (5 from plan 01-01 must_haves, 7 from plan 01-02 must_haves, condensed with overlap into 9 distinct checks) are verified against both the committed codebase and the live deployment. The one expected deviation from a clean first run — the GitHub Pages first-enable race — occurred exactly as documented in the workflow header and D-10, was resolved via the documented manual/API fallback, and the workflow was proven green end-to-end via `workflow_dispatch` afterward. The three auto-fixed deviations recorded in the SUMMARY files (a comment reword to avoid a grep string collision, a comment reword to avoid an `ssr = false` substring collision, and a non-self-closing `<base>` tag) are all cosmetic and do not affect any load-bearing behavior — verified directly against the current file contents.

---

*Verified: 2026-07-07*
*Verifier: Claude (gsd-verifier)*
