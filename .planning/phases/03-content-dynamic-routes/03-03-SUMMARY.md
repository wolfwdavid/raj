---
phase: 03-content-dynamic-routes
plan: 03
subsystem: ui
tags: [sveltekit, svelte5, marked, gray-matter, markdown, prerender, adapter-static, entries]

# Dependency graph
requires:
  - phase: 02-per-site-shells-scaffold-conventions
    provides: cannaworldnews shell (tokens.css, SiteHeader/SiteFooter, +layout, front-page placeholder), prerender contract, rel=external nav guards
provides:
  - marked@18 + gray-matter@4 markdown pipeline scoped to cannaworldnews only
  - build-time article index (src/lib/articles.ts) via import.meta.glob raw eager
  - 14 informational cannabis-policy articles across 4 regions
  - editorial front page (lead + secondary stack + per-region 3-up sections)
  - /region/[region]/ rivers prerendered via entries() (4 regions)
  - /articles/[slug]/ pages prerendered via entries() (kicker, h1, byline, time element, rendered markdown, related-by-region)
affects: [cannaworldnews-seo-meta, cannaworldnews-compliance-audit, phase-05]

# Tech tracking
tech-stack:
  added: [marked@^18, gray-matter@^4]
  patterns:
    - "import.meta.glob raw+eager loads markdown at build/prerender pass — zero markdown JS shipped to client"
    - "gray-matter frontmatter + marked.parse body rendered to static HTML, injected via {@html} on trusted in-repo content"
    - "entries() derived from the article/region data set so adapter-static prerenders every dynamic route"

key-files:
  created:
    - cannaworldnews/src/lib/articles.ts
    - cannaworldnews/src/gray-matter.d.ts
    - cannaworldnews/src/content/articles/ (14 .md files)
    - cannaworldnews/src/routes/region/[region]/+page.ts
    - cannaworldnews/src/routes/region/[region]/+page.svelte
    - cannaworldnews/src/routes/articles/[slug]/+page.ts
    - cannaworldnews/src/routes/articles/[slug]/+page.svelte
  modified:
    - cannaworldnews/package.json
    - cannaworldnews/package-lock.json
    - cannaworldnews/src/routes/+page.svelte
    - cannaworldnews/src/lib/components/SiteHeader.svelte
    - cannaworldnews/src/lib/components/SiteFooter.svelte

key-decisions:
  - "Added formatDate + regionLabel helpers to articles.ts to avoid date/label duplication across the three consuming routes"
  - "Dropped stale region-nav rel=external in SiteHeader/SiteFooter once /region/ route existed (D-03 route-lighting)"
  - "14 articles (Americas 4 / Europe 4 / Africa 3 / Asia-Pacific 3), all source-attributed informational framing — no health/legal claims in site voice"

patterns-established:
  - "Markdown content pipeline: src/content/articles/*.md + import.meta.glob('?raw', eager) + gray-matter + marked, all at module-load/prerender"
  - "Build-order guard: article-card links carry temporary rel=external until the /articles/ route lands, then stripped from every consuming page"

requirements-completed: [NEWS-01, NEWS-02, NEWS-03]

# Metrics
duration: 12min
completed: 2026-07-07
---

# Phase 3 Plan 3: CannaWorldNews Content + Dynamic Routes Summary

**Build-time marked+gray-matter markdown pipeline feeding an editorial front page, 4 prerendered region rivers, and 14 fully-prerendered article pages (kicker/h1/byline/time-element/rendered markdown/related) — all crawlable, portable, zero client markdown JS.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-07-07T05:37:00Z
- **Completed:** 2026-07-07T05:48:33Z
- **Tasks:** 3
- **Files modified:** 12 (7 created, 5 modified) + 14 markdown articles

## Accomplishments
- Wired `marked@18` + `gray-matter@4` into cannaworldnews ONLY (verified no sibling package.json changed) and regenerated its lockfile
- `src/lib/articles.ts` builds a newest-first article index at the Node prerender pass via `import.meta.glob('../content/articles/*.md', { query: '?raw', import: 'default', eager: true })` → gray-matter frontmatter → `marked.parse` body → `html`
- 14 realistic, source-attributed, informational cannabis-POLICY articles across all 4 regions (no health/legal claims in site voice — Pitfall 11 / D-08)
- Editorial front page: newest-article lead (single `<h1>`), secondary stack, and per-region 3-up card sections
- `/region/[region]/` rivers for all 4 regions, prerendered via `entries()`
- `/articles/[slug]/` pages with region kicker, `<h1>`, byline, `<time datetime>` verified to sit between headline and body, `{@html}` rendered markdown, and "More from [Region]" related list
- Built article-page count (14) == `.md` count (14); region-page count == 4 (entries() completeness, INFRA-05)

## Task Commits

Each task was committed atomically:

1. **Task 1: marked+gray-matter, articles.ts loader, 14 markdown articles** - `7488b8d` (feat)
2. **Task 2: editorial front page + /region/[region]/ rivers with entries()** - `16b6702` (feat)
3. **Task 3: /articles/[slug]/ with entries(), time element, rendered markdown; strip temp rel** - `fb01e6a` (feat)

**Plan metadata:** (docs commit — final)

## Files Created/Modified
- `cannaworldnews/src/lib/articles.ts` - Build-time article index + REGIONS + getArticle/articlesByRegion + formatDate/regionLabel helpers
- `cannaworldnews/src/gray-matter.d.ts` - Minimal ambient module declaration keeping svelte-check green (QUAL-02)
- `cannaworldnews/src/content/articles/*.md` - 14 region-tagged informational articles
- `cannaworldnews/src/routes/+page.svelte` - Editorial front page (lead + secondary + per-region sections)
- `cannaworldnews/src/routes/region/[region]/+page.ts` + `+page.svelte` - Region rivers with entries()
- `cannaworldnews/src/routes/articles/[slug]/+page.ts` + `+page.svelte` - Article pages with entries(), time element, rendered markdown, related
- `cannaworldnews/src/lib/components/SiteHeader.svelte` / `SiteFooter.svelte` - Dropped stale region-nav rel=external
- `cannaworldnews/package.json` / `package-lock.json` - marked + gray-matter dependencies

## Decisions Made
- Added `formatDate` (timezone-safe, parses YYYY-MM-DD parts directly) and `regionLabel` helpers to `articles.ts` — reused by all three routes, avoids duplication.
- Dropped `rel="external"` from the SiteHeader/SiteFooter region links as part of Task 2 (the region route lit up), matching the shell's own "drop rel then" comments and D-03 route-lighting. Directly caused by this plan creating `/region/`.
- Article-card links used a temporary `rel="external"` guard in Task 2 (front + region pages) so the full `npm run build` stayed green before the article route existed, then stripped in Task 3.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Dropped stale region-nav rel=external in SiteHeader/SiteFooter**
- **Found during:** Task 2 (region route creation)
- **Issue:** The Phase-2 shell guarded `/region/[region]/` nav links with `rel="external"` and comments saying "route lands in Phase 3; drop rel then". Creating the region route in this plan made those guards stale (per D-03 route-lighting).
- **Fix:** Removed `rel="external"` (and updated the guiding comments) from the region links in SiteHeader.svelte and SiteFooter.svelte so they became plain crawlable internal links. Region pages remain prerendered via `entries()` regardless.
- **Files modified:** cannaworldnews/src/lib/components/SiteHeader.svelte, cannaworldnews/src/lib/components/SiteFooter.svelte
- **Verification:** `npm run check` 0 errors; BASE_PATH build succeeds with 4 region pages; portability grep clean.
- **Committed in:** `16b6702` (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking/route-lighting)
**Impact on plan:** The rel-drop is the explicit D-03 intent and directly tied to this plan creating the region route. No scope creep; scoped to cannaworldnews only.

## Issues Encountered
None. All three task verifications and both BASE_PATH modes (`/raj/cannaworldnews` and empty) passed on first build.

## User Setup Required
None - no external service configuration required. Markdown content is in-repo and rendered at build time.

## Next Phase Readiness
- NEWS-01/02/03 met: front page from 14 region-tagged articles, article route with kicker/headline/byline/time-element/rendered markdown/related, and 4 region rivers — all prerendered.
- Ready for Phase 5 SEO meta (per-article OG/canonical via SITE_URL) and the full cannabis/FTC compliance audit. The Phase-2 footer disclaimer stub ("Informational only — not legal or medical advice") remains; full compliance copy is deferred to Phase 5 per 03-CONTEXT deferred list.
- No blockers.

## Self-Check: PASSED

---
*Phase: 03-content-dynamic-routes*
*Completed: 2026-07-07*
