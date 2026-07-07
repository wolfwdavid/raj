---
phase: 05-seo-hardening-compliance-gate
plan: 01
subsystem: seo
tags: [svelte, sveltekit, seo, open-graph, canonical, svelte-head, static-site]

# Dependency graph
requires:
  - phase: 03-content-dynamic-routes
    provides: product/dentist/article/region records + dynamic routes to attach per-record metadata to
  - phase: 04-conversion-paths
    provides: cart/thanks/quote/appointment pages that now carry titles + descriptions
provides:
  - Hand-rolled per-site Seo.svelte emitting title/description/canonical/OG/Twitter via <svelte:head>
  - SITE_URL config knob per site (created cannaworldnews/config.ts) driving absolute canonical/OG URLs
  - Unique title + meta description + absolute canonical on all 15 pages/routes across four sites
affects: [05-02, compliance-gate, custom-domain-cutover]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hand-rolled zero-dependency Seo component per site (duplicated, differs only by SITE_NAME)"
    - "canonical/OG absolute URLs derive from SITE_URL config knob, never from BASE_PATH"
    - "$derived(SITE_URL + path) keeps head metadata correct across client-side navigation"

key-files:
  created:
    - vfamigos/src/lib/components/Seo.svelte
    - lipool/src/lib/components/Seo.svelte
    - lidentist/src/lib/components/Seo.svelte
    - cannaworldnews/src/lib/components/Seo.svelte
    - cannaworldnews/src/lib/config.ts
  modified:
    - vfamigos/src/lib/config.ts
    - lipool/src/lib/config.ts
    - lidentist/src/lib/config.ts
    - "15 +page.svelte routes across the four sites"

key-decisions:
  - "SITE_URL defaults to the live Pages origin+subpath so canonical/OG resolve today; VITE_SITE_URL flips to the custom domain at cutover with no code change"
  - "Used $derived(SITE_URL + path) instead of a plain const to keep canonical/OG reactive on client-side route changes and silence the svelte-check reactivity warning"
  - "cannaworldnews article pages get a basic og:type=website Seo here; the type=article + article:published_time upgrade is deferred to plan 05-02 per D-04"

patterns-established:
  - "Every +page.svelte imports Seo from '$lib/components/Seo.svelte' and places <Seo> as the first markup element"
  - "Raw <svelte:head> title/description blocks are replaced by <Seo> (never duplicated) to guarantee a single title source"

requirements-completed: [QUAL-04]

# Metrics
duration: 25min
completed: 2026-07-07
---

# Phase 5 Plan 1: Per-Page SEO + SITE_URL Config Knob Summary

**Hand-rolled per-site Seo.svelte + SITE_URL config gives all 15 pages across four sites a unique title, meta description, and SITE_URL-derived absolute canonical/OG — custom-domain-ready via one config knob, independent of BASE_PATH.**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-07-07T07:12:00Z
- **Completed:** 2026-07-07T07:36:53Z
- **Tasks:** 3
- **Files modified:** 23 (5 created, 18 modified)

## Accomplishments
- Created a zero-dependency `Seo.svelte` in each of the four sites (identical except the `SITE_NAME` constant) emitting `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph (`og:type/site_name/title/description/url` + optional `article:published_time`), and Twitter card tags via `<svelte:head>`.
- Added `SITE_URL` to `vfamigos/lipool/lidentist` config.ts and created `cannaworldnews/config.ts` (none existed) — each defaults to the live Pages origin+subpath and is overridable via `VITE_SITE_URL` for custom-domain cutover.
- Wired `<Seo>` into all 15 pages/routes with unique, non-empty titles + descriptions; dynamic pages (PDP, dentist detail, article, region) compute metadata from their record.
- Replaced the two pre-existing raw `<svelte:head>` blocks (lipool/quote, lidentist/appointment) with `<Seo>` so there is exactly one title source per page.
- Proved SITE_URL independence: `VITE_SITE_URL=https://vfamigos.com` yields `canonical="https://vfamigos.com/"` while assets/nav stay relative/BASE_PATH-driven.

## Task Commits

Each task was committed atomically:

1. **Task 1: Seo.svelte component + SITE_URL config knob (per site)** - `aaa73fd` (feat)
2. **Task 2: Apply <Seo> to every vfamigos + lipool page** - `bc6f083` (feat)
3. **Task 3: Apply <Seo> to every lidentist + cannaworldnews page** - `5998332` (feat)

**Plan metadata:** (docs: complete plan — see final commit)

## Files Created/Modified
- `*/src/lib/components/Seo.svelte` (×4) - Per-page head meta emitter; canonical/OG = `$derived(SITE_URL + path)`
- `cannaworldnews/src/lib/config.ts` - New file; SITE_URL knob for the news site
- `vfamigos|lipool|lidentist/src/lib/config.ts` - Appended SITE_URL export (kept existing STRIPE_PAYMENT_LINK / FORM_ENDPOINT)
- `vfamigos/src/routes/{+page,products/+page,products/[slug]/+page,about/+page,cart/+page,thanks/+page}.svelte` - Unique `<Seo>`
- `lipool/src/routes/{+page,gallery/+page,quote/+page}.svelte` - Unique `<Seo>` (quote's raw head replaced)
- `lidentist/src/routes/{+page,dentists/[slug]/+page,appointment/+page}.svelte` - Unique `<Seo>` (appointment's raw head replaced; sample-data label intact)
- `cannaworldnews/src/routes/{+page,region/[region]/+page,articles/[slug]/+page}.svelte` - Unique `<Seo>` (article og:type stays website)

## Decisions Made
- **SITE_URL default = live Pages origin+subpath** so canonical/OG resolve immediately; `VITE_SITE_URL` is the single cutover knob (documented inline per site with the future domain).
- **`$derived(SITE_URL + path)`** instead of a plain `const` — makes head metadata correct across SPA navigation and clears the svelte-check `state_referenced_locally` warning (0 warnings on all four sites).
- **Article metadata upgrade deferred** — cannaworldnews article pages ship `og:type=website` here; `type=article` + `article:published_time` is plan 05-02 (D-04), matching the interface-first `type`/`publishedTime` props already wired in the component.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Made canonical/OG url reactive with $derived**
- **Found during:** Task 1 (Seo.svelte creation)
- **Issue:** `const url = SITE_URL + path` triggered svelte-check warning `state_referenced_locally` — `url` captured only the initial `path`, so canonical/OG would go stale across client-side navigation between dynamic routes.
- **Fix:** Changed to `const url = $derived(SITE_URL + path)` in all four Seo.svelte components.
- **Files modified:** vfamigos/lipool/lidentist/cannaworldnews `src/lib/components/Seo.svelte`
- **Verification:** `npm run check` reports 0 errors, 0 warnings on all four sites (was 1 warning).
- **Committed in:** `aaa73fd` (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 bug/correctness)
**Impact on plan:** The fix is a correctness improvement over the plan's literal snippet and keeps svelte-check fully clean. No scope creep.

## Issues Encountered
None — all planned work executed cleanly.

## User Setup Required
None - no external service configuration required. `VITE_SITE_URL` is an optional build-time override for the future custom-domain cutover (v2, DOM-01); the committed defaults resolve on the live Pages origin today.

## Next Phase Readiness
- All 15 pages emit unique title + description + absolute SITE_URL-derived canonical/OG; portability guard clean on all four builds; svelte-check 0 errors/0 warnings each; QUAL-04 met.
- Plan 05-02 can now upgrade cannaworldnews article pages to `type='article'` + `publishedTime` (props already wired) and finalize the NEWS-05 disclaimer + the D-06 compliance CI gate in deploy.yml.
- No blockers.

## Self-Check: PASSED

All 5 created files verified on disk (4× Seo.svelte, cannaworldnews/config.ts, SUMMARY.md). All 3 task commits (aaa73fd, bc6f083, 5998332) present in git history.

---
*Phase: 05-seo-hardening-compliance-gate*
*Completed: 2026-07-07*
