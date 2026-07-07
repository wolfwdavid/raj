---
phase: 03-content-dynamic-routes
plan: 04
subsystem: ui
tags: [sveltekit, svelte5, json-ld, local-seo, schema-org, lead-gen, static-prerender]

# Dependency graph
requires:
  - phase: 02-per-site-shells-scaffold-conventions
    provides: lipool shell (SiteHeader/SiteFooter, tokens.css, benefit hero, tel: click-to-call, prerender contract)
provides:
  - Typed lipool services data (6 services) and gallery data (9 project tiles with descriptive alt)
  - Benefit-led home with Long Island trust-signals strip + services grid + gallery teaser
  - /gallery/ route: responsive figure/figcaption grid with visible descriptive alt on every tile
  - Footer HomeAndConstructionBusiness JSON-LD (areaServed + NAP, no aggregateRating) + visible matching NAP
  - {base}-prefixed Services links that resolve the home #services anchor from any page
affects: [04-conversion-wiring, 05-seo-meta-compliance, lipool]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "JSON-LD injected via {@html} with a split </script> literal to survive Svelte compilation"
    - "CSS/SVG-generated imagery (accent-gradient tiles) — zero binary assets, base-path-safe"
    - "Descriptive alt surfaced as visible figcaption text since tiles stand in for photos"

key-files:
  created:
    - lipool/src/lib/data/services.ts
    - lipool/src/lib/data/gallery.ts
    - lipool/src/routes/gallery/+page.svelte
  modified:
    - lipool/src/routes/+page.svelte
    - lipool/src/lib/components/SiteHeader.svelte
    - lipool/src/lib/components/SiteFooter.svelte

key-decisions:
  - "HomeAndConstructionBusiness JSON-LD deliberately omits aggregateRating/review (no visible on-page reviews → spammy-structured-data penalty)"
  - "Bare #services anchors promoted to {base}/#services so they resolve on the new /gallery/ page (prerender missing-id fix)"
  - "Gallery tiles are CSS accent-gradient placeholders labeled 'representative work', with descriptive alt shown as visible text"

patterns-established:
  - "Pattern 1: JSON-LD via {@html} template string with concatenated </script> close tag"
  - "Pattern 2: cross-page section links use {base}/#anchor, not bare #anchor, to stay prerender-safe"

requirements-completed: [POOL-01, POOL-02, POOL-04, POOL-05]

# Metrics
duration: 10min
completed: 2026-07-07
---

# Phase 3 Plan 04: Lipool Services + Gallery + Trust + JSON-LD Summary

**Benefit-led lipool home with a Long Island trust-signals strip and 6-service grid, a /gallery/ project route with descriptive alt on every tile, and a footer HomeAndConstructionBusiness JSON-LD (areaServed + NAP, no aggregateRating).**

## Performance

- **Duration:** 10 min
- **Started:** 2026-07-07T05:37:09Z
- **Completed:** 2026-07-07T05:48:00Z
- **Tasks:** 3
- **Files modified:** 6 (3 created, 3 modified)

## Accomplishments
- Typed `services.ts` (6 services with Lucide-style SVG icons) and `gallery.ts` (9 project tiles with descriptive alt text)
- Home now renders a benefit hero + trust strip (Licensed & Insured · 20+ Years · Nassau & Suffolk · Free Estimates) + services grid + rel-free gallery teaser
- `/gallery/` route prerenders a responsive figure/figcaption grid; descriptive alt is surfaced as visible caption text and `aria-label`
- Footer emits valid `HomeAndConstructionBusiness` JSON-LD (`areaServed`: Nassau County + Suffolk County, telephone, PostalAddress) with a visible NAP block matching 1:1 — and provably NO `aggregateRating`/`review`
- Click-to-call `tel:` confirmed present in header on every page (POOL-04)

## Task Commits

Each task was committed atomically:

1. **Task 1: services.ts + gallery.ts data; home trust strip + services** - `c698453` (feat)
2. **Task 2: /gallery/ project route with descriptive alt + verify tel:** - `753fe05` (feat)
3. **Task 3: Footer HomeAndConstructionBusiness JSON-LD + visible NAP** - `5e34aa7` (feat)

## Files Created/Modified
- `lipool/src/lib/data/services.ts` - 6 typed Service records (installation, liner replacement, openings/closings, maintenance, repairs, renovation) with SVG icon paths
- `lipool/src/lib/data/gallery.ts` - 9 typed GalleryItem records with descriptive alt + accent hex
- `lipool/src/routes/gallery/+page.svelte` - /gallery/ project grid (figure/figcaption, CSS placeholder tiles, representative-work labeling)
- `lipool/src/routes/+page.svelte` - Added trust-signals strip, data-driven services grid, gallery teaser
- `lipool/src/lib/components/SiteHeader.svelte` - Services link now {base}/#services (prerender-safe); tel: unchanged
- `lipool/src/lib/components/SiteFooter.svelte` - HomeAndConstructionBusiness JSON-LD + visible street address; Services link {base}/#services

## Decisions Made
- JSON-LD emitted through `{@html}` with a concatenated `</script>` close tag so the Svelte compiler doesn't misparse the literal script tag.
- Added a concrete placeholder street address (120 Sunrise Highway, Massapequa, NY 11758) so the visible NAP matches the JSON-LD `PostalAddress` 1:1 — required for a legitimate LocalBusiness NAP.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Bare `#services` anchors broke prerender of the new /gallery/ route**
- **Found during:** Task 2 (/gallery/ route)
- **Issue:** The Phase-2 header and footer linked to a bare `#services` fragment. Once `/gallery/` existed, the prerender crawler resolved that fragment against `/raj/lipool/gallery/`, which has no `id="services"`, and failed the build (`handleMissingId`).
- **Fix:** Promoted both links to `{base}/#services` so they always target the home page's services section.
- **Files modified:** lipool/src/lib/components/SiteHeader.svelte, lipool/src/lib/components/SiteFooter.svelte
- **Verification:** `MSYS_NO_PATHCONV=1 BASE_PATH=/raj/lipool npm run build` succeeds; `build/gallery/index.html` present.
- **Committed in:** 753fe05 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to prerender the new route; no scope creep. The `#services` links still behave identically for users.

## Issues Encountered
- None beyond the Rule 3 blocking anchor fix above.

## Known Stubs
These are intentional per plan scope (D-01/D-10) and not blockers:
- **Gallery imagery** — tiles are CSS accent-gradient placeholders standing in for photography, explicitly labeled "representative work". Real photos deferred to v2 per Phase-3 context.
- **Footer NAP address** — 120 Sunrise Highway, Massapequa, NY 11758 is a placeholder for the fictional Lipool business; consistent across visible NAP and JSON-LD. Real address is a post-build user step.

## User Setup Required
None - no external service configuration required this plan. (Quote form endpoint wiring is Phase 4.)

## Next Phase Readiness
- Home services CTAs and the header/footer quote links keep `rel="external"` guarding `/quote/` for Phase 4 to light up.
- `/gallery/` route is real and crawlable; 03-05 handles dropping the gallery `rel="external"` guard on remaining links.
- Verification gates (svelte-check 0 errors, BASE_PATH + empty-base builds, portability grep) all pass.

## Self-Check: PASSED

All 6 source files + SUMMARY.md exist on disk; all 3 task commits (c698453, 753fe05, 5e34aa7) present in git history.

---
*Phase: 03-content-dynamic-routes*
*Completed: 2026-07-07*
