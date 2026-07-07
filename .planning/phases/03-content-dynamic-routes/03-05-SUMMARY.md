---
phase: 03-content-dynamic-routes
plan: 05
subsystem: infra
tags: [sveltekit, prerender, ci, github-actions, deploy, rel-external, deep-links, verification]

# Dependency graph
requires:
  - phase: 03-content-dynamic-routes
    provides: Wave-1 routes (vfamigos /products /about, lipool /gallery, lidentist /dentists, cannaworldnews /region /articles) all built + prerendered
provides:
  - Now-real Phase-3 routes internally linked (rel=external dropped) so the crawler follows them and Pages deep-links/hard-refresh resolve
  - deploy.yml per-site content-in-HTML + dynamic-route file-count == data-record-count + deep-link assertions (INFRA-05/07 enforcement)
affects: [04-conversion-cart-forms, 05-seo-compliance-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CI build-matrix assertion: built dir/index.html count == data record count (entries() completeness) with per-site case switch"
    - "Content sentinel grep against built HTML proves real content, not an empty shell (defeats ssr=false / stub regressions)"
    - "Phase-gated rel=external: guard dropped exactly when the route lands; Phase-4 routes stay guarded"

key-files:
  created: []
  modified:
    - vfamigos/src/lib/components/SiteHeader.svelte
    - vfamigos/src/lib/components/SiteFooter.svelte
    - vfamigos/src/routes/+page.svelte
    - lipool/src/lib/components/SiteHeader.svelte
    - lipool/src/lib/components/SiteFooter.svelte
    - .github/workflows/deploy.yml

key-decisions:
  - "Derived counts dynamically in CI (grep -c slug / ls *.md | wc -l) rather than hardcoding, so the assertion tracks the data source and never drifts"
  - "cannaworldnews region rel=external was already dropped in 03-03 (route-lighting done at route-creation time); 03-05 only needed vfamigos + lipool rel drops"
  - "Updated the now-misleading /cart/ and /quote/ guard comments to name Phase 4 explicitly instead of the stale 'route lands in Phase 3; drop rel then'"

patterns-established:
  - "Verification-centerpiece plan: CI enforces prerender completeness + real content for every dynamic route across all four sites"

requirements-completed: [INFRA-05, INFRA-07]

# Metrics
duration: 14min
completed: 2026-07-07
---

# Phase 3 Plan 05: Route-Lighting rel Sweep + CI Content/File-Count Assertions Summary

**Dropped the stale `rel="external"` guards from every now-real Phase-3 route (vfamigos /products+/about, lipool /gallery) so the prerender crawler follows them and Pages deep-links resolve, and added a per-site deploy.yml step asserting built dir/index.html count == data record count plus a real-content grep — failing CI on any entries() gap or empty shell. Phase-4 routes (/cart, /quote, /appointment) stay guarded.**

## Performance

- **Duration:** ~14 min
- **Tasks:** 2
- **Files modified:** 6 (0 created, 6 modified)

## Accomplishments
- vfamigos: unguarded `/products/` and `/about/` in SiteHeader, SiteFooter, and the home hero "Shop the Amigos" CTA; kept `/cart/` guarded for Phase 4.
- lipool: unguarded `/gallery/` in SiteHeader and SiteFooter; kept `/quote/` guarded for Phase 4.
- cannaworldnews required no change — its region `rel="external"` was already dropped in 03-03 when the region route was created (D-03 route-lighting-at-creation).
- Both edited sites still pass `npm run check` (0 errors / 0 warnings) and build clean under `BASE_PATH=/raj/<site>` — proving the crawler now follows the un-guarded routes without a 404 (entries()/static coverage holds).
- Added a `Content + dynamic-route assertions (INFRA-05/07)` step to the deploy.yml build matrix, placed after the portability guard and before upload-artifact, with a `case "${{ matrix.site }}"` switch:
  - **vfamigos:** `build/products/*/index.html` count == `grep -c 'slug:' products.ts` (10) + PDP body has real add-to-cart content.
  - **lidentist:** `build/dentists/*/index.html` count == `grep -c 'slug:' dentists.ts` (10) + FTC sample-data label + aria rating.
  - **cannaworldnews:** `build/articles/*/index.html` count == `.md` count (14), region count == 4, `<time datetime>` present.
  - **lipool:** `/gallery/` prerendered + `HomeAndConstructionBusiness` JSON-LD present + NEGATIVE guard failing if `aggregateRating` ever appears.
- Dry-ran all four assertion branches locally against fresh builds before wiring CI — every branch passed (products 10==10, dentists 10==10, articles 14==14, regions 4, all sentinels found, no aggregateRating).

## Task Commits

Each task was committed atomically:

1. **Task 1: Drop stale rel="external" from now-real Phase-3 routes (keep Phase-4 guards)** - `968cae0` (feat)
2. **Task 2: Content-in-HTML + dynamic-route file-count + deep-link assertions in deploy.yml** - `8bbbc2b` (feat)

## Files Created/Modified
- `vfamigos/src/lib/components/SiteHeader.svelte` - Dropped rel on /products/ + /about/; clarified /cart/ Phase-4 guard comment.
- `vfamigos/src/lib/components/SiteFooter.svelte` - Dropped rel on /products/ + /about/.
- `vfamigos/src/routes/+page.svelte` - Dropped rel on the hero /products/ CTA.
- `lipool/src/lib/components/SiteHeader.svelte` - Dropped rel on /gallery/; clarified /quote/ Phase-4 guard comment.
- `lipool/src/lib/components/SiteFooter.svelte` - Dropped rel on /gallery/; clarified /quote/ Phase-4 guard comment.
- `.github/workflows/deploy.yml` - New per-site content + file-count + deep-link assertion step (INFRA-05/07).

## Decisions Made
- **Counts derived dynamically in CI**, not hardcoded — `grep -c 'slug:'` and `ls *.md | wc -l` track the data source so the assertion can never drift from reality (only the fixed 4-region structural constant is a literal).
- **cannaworldnews needed no rel edit** — 03-03 already dropped the region guard at route-creation time; the plan's route-lighting map listed it, but the work was already banked. Verified header/footer carry plain crawlable links.
- **Guard comments updated to name Phase 4** — the surviving `/cart/` and `/quote/` comments said "route lands in Phase 3; drop rel then", which is now false; rewrote them to "Phase-4 route; keep the crawler guard until then".

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Correctness] cannaworldnews rel already dropped upstream — no-op instead of a redundant edit**
- **Found during:** Task 1
- **Issue:** The plan's route-lighting map listed cannaworldnews SiteHeader/SiteFooter region links for a rel drop, but 03-03 had already removed those guards when it created the /region/ route.
- **Fix:** Verified both files carry plain `href="{base}/region/{r.slug}/"` links (no rel) and left them untouched — avoided a churn commit. All rel-drop acceptance criteria for cannaworldnews are already satisfied.
- **Files modified:** none (cannaworldnews already correct)
- **Verification:** grep for `region/.*rel="external"` in cannaworldnews/src returns only an explanatory comment, no live link.

**2. [Rule 1 - Correctness] Rewrote stale Phase-4 guard comments**
- **Found during:** Task 1
- **Issue:** The surviving `/cart/` (vfamigos) and `/quote/` (lipool) links kept the comment "rel=external: route lands in Phase 3; drop rel then" — misleading now that Phase 3 is closing and those routes are Phase 4.
- **Fix:** Rewrote each to "rel=external: /<route>/ is a Phase-4 route; keep the crawler guard until then".
- **Files modified:** vfamigos/src/lib/components/SiteHeader.svelte, lipool/src/lib/components/SiteHeader.svelte, lipool/src/lib/components/SiteFooter.svelte
- **Verification:** Phase-4 guard greps still return the intact `rel="external"` links; builds pass.

---

**Total deviations:** 2 auto-fixed (2 correctness). No architectural changes; no scope creep.
**Impact on plan:** Both keep the codebase truthful — one avoids a redundant edit, one removes misleading comments. All acceptance criteria met.

## Issues Encountered
None. All builds passed on first run; all four CI assertion branches passed a local dry-run before being wired into deploy.yml.

## User Setup Required
None.

## Next Phase Readiness
- INFRA-05 (every route prerendered with real content in built HTML) and INFRA-07 (dir/index.html per record → deep-links + hard-refresh work) are now CI-enforced across all four sites.
- Phase-4 route guards (/cart, /quote, /appointment) remain in place; Phase 4 lights each up and drops its guard when its route lands, matching the established route-lighting pattern.
- The deploy.yml assertion step will need its per-site case extended when Phase-4 dynamic routes (e.g. cart contents) or Phase-5 SEO artifacts (sitemap/canonical) add new count/content contracts.

## Self-Check: PASSED

Both task commits (968cae0, 8bbbc2b) verified in git history; deploy.yml assertion step present + valid YAML; rel drops verified in built output (both sites build clean); Phase-4 guards verified intact.

---
*Phase: 03-content-dynamic-routes*
*Completed: 2026-07-07*
