---
phase: 02-per-site-shells-scaffold-conventions
plan: 03
subsystem: ui
tags: [sveltekit, svelte5, css-tokens, a11y, google-fonts, prerender, editorial, directory]

# Dependency graph
requires:
  - phase: 02-01
    provides: 02-CONVENTIONS.md shell exemplar + svelte-check/empty-base/portability CI gates
  - phase: 01-deploy-pipeline-walking-skeleton
    provides: per-site SvelteKit scaffold with prerender contract and BASE_PATH pipeline
provides:
  - lidentist branded shell (calm cyan/green clinical directory, a11y exemplar of the four)
  - cannaworldnews branded shell (Swiss-editorial black-and-paper masthead publication)
  - two more per-site design systems proven (tokens.css + fonts + header/footer/hero) — completes 4/4 shells with 02-02
affects: [phase-03-content-routes, dentist-directory, appointment-form, region-pages, article-pipeline]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-site token layer in src/lib/styles/tokens.css imported once in +layout.svelte"
    - "Google Fonts via <link> in app.html (absolute URL, exempt from portability guard)"
    - "Prerender-safe nav: {base}/ + same-page #anchors crawlable; not-yet-built Phase-3 routes carry rel=external"
    - "Inline SVG icons only (never emoji); skip-link + landmarks + 3px focus ring a11y baseline"

key-files:
  created:
    - lidentist/src/lib/styles/tokens.css
    - lidentist/src/lib/components/SiteHeader.svelte
    - lidentist/src/lib/components/SiteFooter.svelte
    - cannaworldnews/src/lib/styles/tokens.css
    - cannaworldnews/src/lib/components/SiteHeader.svelte
    - cannaworldnews/src/lib/components/SiteFooter.svelte
  modified:
    - lidentist/src/app.html
    - lidentist/src/routes/+layout.svelte
    - lidentist/src/routes/+page.svelte
    - cannaworldnews/src/app.html
    - cannaworldnews/src/routes/+layout.svelte
    - cannaworldnews/src/routes/+page.svelte

key-decisions:
  - "lidentist held to strictest a11y bar: skip-link, strict h1->h2 hierarchy, 3px focus ring, 44px+ targets, visible sample-data note"
  - "cannaworldnews all four region nav links (americas/europe/africa/asia-pacific) guarded with rel=external until Phase-3 routes exist"
  - "Green accent on cannaworldnews restricted to region kickers/links/rules only — never large green fields (matches design spec)"

patterns-established:
  - "Same-page fragment nav (#directory/#how) needs no rel; cross-route Phase-3 links need rel=external"
  - "Footer disclaimer stubs: lidentist 'Sample data...' / cannaworldnews 'Informational only...' — full compliance copy deferred to Phase 5"

requirements-completed: [QUAL-01, QUAL-03]

# Metrics
duration: 7min
completed: 2026-07-07
---

# Phase 02 Plan 03: Lidentist + CannaWorldNews Branded Shells Summary

**Two visually distinct branded shells: lidentist (calm cyan/green Lexend directory, the a11y exemplar) and cannaworldnews (Swiss-editorial Libre Bodoni masthead), each in its committed design system, both prerender-safe and portable.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-07-07T04:31:21Z
- **Completed:** 2026-07-07T04:38:06Z
- **Tasks:** 2
- **Files modified:** 12 (6 per site: tokens.css, app.html, SiteHeader, SiteFooter, +layout, +page)

## Accomplishments
- lidentist shell: cyan/green calm clinical directory (Lexend + Source Sans 3), green appointment CTA, specialty chips, #directory/#how section anchors, visible sample-data footer note — held to the highest a11y bar (skip-link, strict landmarks, exactly one h1, 3px focus ring, 44px targets, reduced-motion honored, inline SVG icons).
- cannaworldnews shell: Swiss-editorial black-and-paper masthead (Libre Bodoni + Public Sans), four accent-green region nav links (rel=external), 12-col front-page lead hero with region kicker + `<time datetime>` block + secondary story stack, informational-only footer disclaimer stub.
- Both sites pass `npm run check` (0 errors), build clean with and without BASE_PATH, and emit zero root-absolute href/src (portability guard clean). Completes 4/4 fleet shells alongside sibling 02-02 (vfamigos + lipool).

## Task Commits

Each task was committed atomically:

1. **Task 1: lidentist shell (a11y exemplar)** - `890bd97` (feat)
2. **Task 2: cannaworldnews Swiss-editorial masthead** - `ae95478` (feat)

## Files Created/Modified
- `lidentist/src/lib/styles/tokens.css` - Cyan/green palette + Lexend/Source Sans 3 font tokens (design-spec hex verbatim)
- `lidentist/src/app.html` - Lexend + Source Sans 3 Google Fonts links
- `lidentist/src/lib/components/SiteHeader.svelte` - Primary nav (Find a Dentist/How it Works/green Appointment CTA), inline SVG tooth + calendar icons
- `lidentist/src/lib/components/SiteFooter.svelte` - Brand line + nav echo + "Sample data for demonstration" note stub
- `lidentist/src/routes/+layout.svelte` - Shell skeleton: skip-link, landmarks, 3px focus ring, reduced-motion
- `lidentist/src/routes/+page.svelte` - Directory hero (one h1, specialty chips, green CTA) + #directory + #how sections
- `cannaworldnews/src/lib/styles/tokens.css` - Near-black + green-accent palette + Libre Bodoni/Public Sans tokens
- `cannaworldnews/src/app.html` - Libre Bodoni + Public Sans Google Fonts links
- `cannaworldnews/src/lib/components/SiteHeader.svelte` - Editorial masthead: wordmark, tagline, four region nav links (rel=external)
- `cannaworldnews/src/lib/components/SiteFooter.svelte` - About note + region index echo + "Informational only" disclaimer stub
- `cannaworldnews/src/routes/+layout.svelte` - Shell skeleton: skip-link, landmarks, focus ring, reduced-motion
- `cannaworldnews/src/routes/+page.svelte` - 12-col editorial lead hero (one h1 in Libre Bodoni, accent kicker, dek, `<time>`) + secondary story stack

## Decisions Made
- lidentist held to strictest a11y bar per its design spec (a11y exemplar of the four): skip-link first in DOM, strict h1->h2 hierarchy, 3px focus ring on --color-ring, 44px+ targets, sample-data integrity note visible in footer.
- All cannaworldnews region links (americas/europe/africa/asia-pacific) carry rel=external so the prerender crawler does not follow them into not-yet-built Phase-3 routes; aria-current wiring deferred to Phase 3.
- Green accent restricted to region kickers/links/section rules on cannaworldnews — never large green fields — matching the "Swiss rigor, not head-shop kitsch" direction.

## Deviations from Plan

None - plan executed exactly as written. Both tasks implemented directly from 02-CONVENTIONS.md and the site design specs; all acceptance criteria and automated verify gates passed on first build.

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required. Google Fonts load from absolute CDN URLs; no keys or env vars needed for the shells.

## Next Phase Readiness
- All four fleet shells now exist (vfamigos + lipool from 02-02; lidentist + cannaworldnews here), each visually distinct in its own design system with CI gates green.
- Phase 3 wires real content routes: lidentist dentist directory + detail + appointment form; cannaworldnews region pages + article markdown pipeline. As each Phase-3 route lights up, drop the `rel="external"` guard from its nav link (appointment, region/*).
- No blockers.

---
*Phase: 02-per-site-shells-scaffold-conventions*
*Completed: 2026-07-07*

## Self-Check: PASSED

All 6 created component/token files present, SUMMARY.md present, both task commits (890bd97, ae95478) verified in git history.
