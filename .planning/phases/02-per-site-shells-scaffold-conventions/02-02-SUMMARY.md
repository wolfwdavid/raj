---
phase: 02-per-site-shells-scaffold-conventions
plan: 02
subsystem: ui
tags: [sveltekit, svelte5, design-tokens, a11y, fonts, base-path, vfamigos, lipool, ecommerce, lead-gen]

# Dependency graph
requires:
  - phase: 02-per-site-shells-scaffold-conventions
    provides: "02-CONVENTIONS.md copy-ready shell exemplar (tokens.css, app.html fonts, +layout/SiteHeader/SiteFooter skeletons, prerender-safe rel=external nav rule, a11y checklist); CI svelte-check + empty-base build + portability guard"
  - phase: 01-deploy-pipeline-walking-skeleton
    provides: "four scaffolded SvelteKit apps with prerender contract, BASE_PATH-driven base, npm run check script"
provides:
  - "vfamigos branded shell: rose #E11D48 + Fredoka/Nunito, sticky nav (Shop/About/Cart badge), footer, hero with blue Shop the Amigos CTA"
  - "lipool branded shell: water-blue #0284C7 + Poppins/Open Sans, nav (Services/Gallery/Get Quote + click-to-call), NAP-ready footer, water-gradient hero with Get a Free Quote CTA and #services anchor"
  - "Two proven design systems locking the shell pattern for Phase 3 content routes"
affects: [02-03-lidentist-cannaworldnews-shells, 03-content-dynamic-routes, 04-vfamigos-commerce, 04-lipool-leadform]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-site tokens.css CSS custom properties imported once in +layout.svelte; no Tailwind/framework"
    - "Google Fonts via <link> preconnect+stylesheet in app.html (absolute URLs, do not {base}-rewrite)"
    - "Inline Lucide-style SVG icons (cart, phone), never emoji"
    - "Prerender-safe nav: rel=external on {base}/products|about|cart|gallery|quote links to not-yet-built Phase-3 routes; same-page #services anchor carries no rel"
    - "A11y shell baseline: skip-link to #main, header/nav/main/footer landmarks, one h1, 3px focus ring, 44px targets, reduced-motion honored"

key-files:
  created:
    - vfamigos/src/lib/styles/tokens.css
    - vfamigos/src/lib/components/SiteHeader.svelte
    - vfamigos/src/lib/components/SiteFooter.svelte
    - lipool/src/lib/styles/tokens.css
    - lipool/src/lib/components/SiteHeader.svelte
    - lipool/src/lib/components/SiteFooter.svelte
  modified:
    - vfamigos/src/app.html
    - vfamigos/src/routes/+layout.svelte
    - vfamigos/src/routes/+page.svelte
    - lipool/src/app.html
    - lipool/src/routes/+layout.svelte
    - lipool/src/routes/+page.svelte

key-decisions:
  - "vfamigos CTA uses engagement-blue --color-accent #2563EB (per design spec) not the rose primary, for contrast against the rose brand"
  - "lipool click-to-call uses placeholder LI number tel:+15165550100 (real number is v2/KEYS); footer carries a <!-- JSON-LD: Phase 3 --> marker only"
  - "lipool Services nav is a same-page #services anchor (no rel) with an on-page section stub so the link always lands; Gallery/Quote are cross-route rel=external"

patterns-established:
  - "Shell = tokens.css + app.html fonts + SiteHeader/SiteFooter + layout skeleton + real hero, copied verbatim from 02-CONVENTIONS.md and filled with the site's design spec"
  - "Cart badge / phone label degrade gracefully; badge is static 0 now (live count is Phase 4)"

requirements-completed: [QUAL-01, QUAL-03]

# Metrics
duration: 6min
completed: 2026-07-07
---

# Phase 2 Plan 02: vfamigos + lipool Branded Shells Summary

**Two visually distinct branded shells shipped: vfamigos (playful rose #E11D48 / Fredoka+Nunito ecom with a blue Shop the Amigos CTA and cart-badge nav) and lipool (trust water-blue #0284C7 / Poppins+Open Sans lead-gen with a water-gradient hero, Get a Free Quote CTA, and click-to-call) — both landmark-complete, one-h1, skip-linked, and portable with/without BASE_PATH.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-07T04:31:09Z
- **Completed:** 2026-07-07T04:37:22Z
- **Tasks:** 2
- **Files modified:** 12 (6 created, 6 modified)

## Accomplishments
- vfamigos shell: full rose palette + Fredoka/Nunito tokens, sticky SiteHeader (Shop/About/Cart with inline SVG cart icon + aria-labeled 0-badge), rose-tinted SiteFooter, layout skeleton (skip-link, focus ring, reduced-motion), and a hero with exactly one h1 "Meet the Amigos", a soft reduced-motion-disabled blob accent, and a blue "Shop the Amigos" CTA.
- lipool shell: water-blue palette + Poppins/Open Sans tokens, SiteHeader (Services same-page anchor, Gallery, deep-accent Get Quote CTA, click-to-call SVG phone), NAP-ready SiteFooter with tel link + Phase-3 JSON-LD marker, and a water-gradient hero with one h1 "Long Island's Pool People", Get a Free Quote CTA, click-to-call, and an on-page #services anchor stub (h2 "Our Services").
- Both sites: `npm run check` = 0 errors/0 warnings, BASE_PATH=/raj/<site> build succeeds, empty-BASE_PATH build succeeds, portability grep finds no root-absolute href/src, and built HTML carries header/nav/main/footer + the correct distinct font (Fredoka vs Poppins).

## Task Commits

Each task was committed atomically:

1. **Task 1: vfamigos shell — playful rose ecom (Fredoka+Nunito)** - `31850cb` (feat)
2. **Task 2: lipool shell — trust-blue LI pool lead-gen (Poppins+Open Sans)** - `18bee4a` (feat)

**Plan metadata:** committed separately (docs: complete plan)

## Files Created/Modified
- `vfamigos/src/lib/styles/tokens.css` - Rose palette + Fredoka/Nunito font tokens
- `vfamigos/src/app.html` - Fredoka+Nunito Google Fonts preconnect + stylesheet links
- `vfamigos/src/lib/components/SiteHeader.svelte` - Sticky nav, brand, Shop/About, Cart with SVG icon + aria-labeled badge, all {base}+rel=external
- `vfamigos/src/lib/components/SiteFooter.svelte` - Brand line "collect the Amigos" + nav echo
- `vfamigos/src/routes/+layout.svelte` - Token import, header/footer, skip-link, focus ring, reduced-motion
- `vfamigos/src/routes/+page.svelte` - Hero: one h1, subhead, blue Shop the Amigos CTA, reduced-motion blob
- `lipool/src/lib/styles/tokens.css` - Water-blue palette + Poppins/Open Sans font tokens
- `lipool/src/app.html` - Poppins+Open Sans Google Fonts links
- `lipool/src/lib/components/SiteHeader.svelte` - Nav, brand, #services anchor, Gallery, Get Quote CTA, click-to-call SVG phone
- `lipool/src/lib/components/SiteFooter.svelte` - NAP-ready block (name/area/tel) + nav echo + Phase-3 JSON-LD marker
- `lipool/src/routes/+layout.svelte` - Same shell skeleton as vfamigos with lipool tokens
- `lipool/src/routes/+page.svelte` - Water-gradient hero (one h1, Get a Free Quote CTA, click-to-call) + #services section stub

## Decisions Made
- vfamigos CTA rendered in engagement-blue `--color-accent` #2563EB (per design spec) against the rose brand for contrast, not the rose primary.
- lipool click-to-call uses placeholder `tel:+15165550100` (real number deferred to v2/KEYS); full LocalBusiness JSON-LD + real NAP left as a `<!-- JSON-LD: Phase 3 -->` marker per POOL-05.
- lipool Services is a same-page `#services` anchor (no rel, crawler-safe) with an on-page section stub so the link always lands; Gallery/Quote are cross-route `rel="external"` until Phase 3.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- A duplicate `max-width` declaration was introduced in lipool `.hero-inner` during authoring and immediately corrected before build/commit (kept the intended 720px content width). Not a plan deviation — caught during self-review.
- Git Bash `MSYS_NO_PATHCONV=1` used per the environment note so `BASE_PATH=/raj/<site>` is not mangled into a Windows path during local build verification.

## User Setup Required
None - no external service configuration required. (lipool's real phone number is a later user/KEYS step; placeholder is intentional.)

## Next Phase Readiness
- Two of four design systems are now proven visually and the shell pattern is locked, exactly matching 02-CONVENTIONS.md.
- 02-03 (lidentist + cannaworldnews) runs in parallel on disjoint folders and follows the same convention.
- Phase 3 lights up the guarded routes (/products/, /about/, /cart/, /gallery/, /quote/) and drops each `rel="external"` as its route exists; vfamigos cart badge goes live in Phase 4.
- No shared files touched, so this plan does not collide with the sibling 02-03 executor.

## Known Stubs
- **vfamigos cart badge** (`vfamigos/src/lib/components/SiteHeader.svelte`) — static `0`; live cart count is Phase 4 (runes cart), intentional per plan.
- **lipool footer NAP + JSON-LD** (`lipool/src/lib/components/SiteFooter.svelte`) — placeholder phone and a `<!-- JSON-LD: Phase 3 -->` marker; full LocalBusiness JSON-LD + real NAP is Phase 3 (POOL-05), intentional per plan.
- **lipool #services section** (`lipool/src/routes/+page.svelte`) — heading + lede only; service cards are Phase 3, intentional per plan (anchor target must exist now so the nav link lands).

These stubs are all explicitly scoped to later phases by the plan and do not block this plan's goal (two distinct branded shells).

## Self-Check: PASSED

- FOUND: all 12 site files (vfamigos + lipool: tokens.css, SiteHeader, SiteFooter, +layout.svelte, +page.svelte, app.html)
- FOUND: `.planning/phases/02-per-site-shells-scaffold-conventions/02-02-SUMMARY.md`
- FOUND commit: `31850cb` (Task 1 — vfamigos)
- FOUND commit: `18bee4a` (Task 2 — lipool)
- Both sites: `npm run check` 0 errors, BASE_PATH and empty-base builds pass, portability grep clean

---
*Phase: 02-per-site-shells-scaffold-conventions*
*Completed: 2026-07-07*
