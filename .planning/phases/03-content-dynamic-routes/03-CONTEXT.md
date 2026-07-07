# Phase 3: Content + Dynamic Routes - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Give every site its real, typed content across all static and dynamic routes, fully prerendered with real content in the built HTML. This is the content-and-routes phase: product data + PDPs (vfamigos), dentist directory + detail + reviews (lidentist), markdown article pipeline + front/article/region routes (cannaworldnews), services + gallery + trust signals + JSON-LD (lipool). NO conversion wiring (cart logic/Stripe/forms POST = Phase 4), NO SEO meta component (Phase 5). Nav links from Phase 2 shells now "light up" — drop the Phase-2 `rel="external"` placeholders as routes become real and crawlable.

</domain>

<decisions>
## Implementation Decisions

### Data layering (all sites)
- **D-01:** Typed data in `src/lib/data/*.ts` (products.ts, dentists.ts) exporting `const` arrays of typed records; dynamic routes generate `entries()` from them. cannaworldnews articles live as `src/content/articles/*.md` with frontmatter, loaded via `import.meta.glob('../content/articles/*.md', { query: '?raw', import: 'default', eager: true })` + `gray-matter` for frontmatter + `marked` for body → rendered with `{@html}`.
- **D-02:** Every dynamic route (`/products/[slug]`, `/dentists/[slug]`, `/articles/[slug]`, `/region/[region]`) exports `export const entries` deriving the full slug/region set from the data — so adapter-static prerenders every page (INFRA-05/07). Verify built file count == data record count.
- **D-03:** Drop `rel="external"` from Phase-2 nav links whose target routes now exist; internal links use `{base}` from `$app/paths`. Any still-missing route (Phase 4 targets like /cart, /quote, /appointment) keeps `rel="external"` until its phase.

### vfamigos content (VFAM-01, 02, 06)
- **D-04:** 8–12 original "Amigo" characters in products.ts: `{ slug, name, series, price, tagline, bio (2-3 sentences), traits: string[], accent (per-character hex) }`. Home = brand hero + product grid (character art blocks using per-character accent + initial/monogram SVG, no external images). PDP = 2-col art/story + traits list + price + add-to-cart button (button present, cart logic Phase 4 — button can be inert/disabled-noted this phase). About section in hero/home per design spec. Character art = CSS/SVG generated (monogram on accent field), no binary assets.

### lidentist content (DENT-01, 02, 03, 05, 06)
- **D-05:** 8–12 dentists in dentists.ts: `{ slug, name, practice, town (LI town), specialty, rating (number), reviewCount, reviews: [{author, date, stars, text}] }`. Home = directory hero + specialty filter (native `<select>` specialty + town, client-side filter over static data, results count in `aria-live="polite"`). Detail = header + review cards (stars SVG + numeric value + text, `aria-label="X out of 5 stars, N reviews"`). Appointment CTA links to /appointment (Phase 4, keep rel="external").
- **D-06 (COMPLIANCE GATE):** All seeded dentists AND reviews unmistakably labeled sample/demo data — a persistent visible banner or badge on directory + detail pages ("Sample data for demonstration — not real reviews"), not just a footer note. FTC Reviews Rule. This is a launch blocker; Phase 5 re-audits.
- **D-07:** lidentist held to a11y-exemplar bar (already established in Phase 2 shell) — filter keyboard-operable, ratings aria-labeled, landmarks/skip-link intact.

### cannaworldnews content (NEWS-01, 02, 03)
- **D-08:** 12+ markdown articles across 4 regions (Americas, Europe, Africa, Asia-Pacific), frontmatter `{ title, dek, region, date (ISO), author, slug }`. Front page = lead story (most recent) + per-region sections (3-up cards). Article page = kicker (region) + h1 + byline + `<time datetime>` between headline and body + rendered markdown + "More from [Region]" related list. Region page = region masthead + chronological river. Body content is realistic-but-clearly-informational cannabis-policy news (report, don't advise; no health/legal claims in site voice).
- **D-09:** marked configured safely (no raw HTML injection beyond our own trusted markdown); `{@html}` only on marked output of our own committed content.

### lipool content (POOL-01, 02, 04, 05)
- **D-10:** Home = benefit hero + LI trust signals strip (Licensed & Insured, 20+ Years, Nassau & Suffolk, Free Estimates) + services section (6 service cards: installation, liner replacement, openings/closings, maintenance, repairs, renovation — icon + blurb). Gallery page = grid of project "photos" (CSS-generated placeholder tiles with descriptive alt text until real photos, clearly captioned; lazy-loaded). Click-to-call `tel:` link in header on every page (already in Phase 2 shell — verify present).
- **D-11:** Footer emits `HomeAndConstructionBusiness` JSON-LD (`<script type="application/ld+json">`) with name, areaServed (Nassau County, Suffolk County), telephone, consistent NAP. NO `aggregateRating` (no visible on-page reviews → Google spammy-structured-data penalty). NAP block visible in footer matches JSON-LD.

### Route lighting + build safety
- **D-12:** As each site's routes become real, the prerender crawler will follow the now-internal nav links — ensure every linked route has an `entries()` (dynamic) or exists (static), or the build fails. This is the phase's core risk: `entries()` completeness.

### Claude's Discretion
- Exact character names/bios, dentist names/towns/review text, article headlines/bodies, service blurb copy, gallery tile treatment, spacing — follow design specs + realistic domain content. Number of records within the stated ranges.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Content & feature landscape
- `.planning/research/FEATURES.md` — per-site table-stakes vs differentiators (product storytelling, directory patterns, news schema, local-service trust); the aggregateRating/visible-reviews SEO trap (lipool)
- `.planning/research/PITFALLS.md` — FTC Reviews Rule (DENT sample-data labeling, $51,744/violation), entries() gaps, localStorage-in-prerender, cannabis informational-safe-harbor
- `.planning/research/STACK.md` — marked@18 + gray-matter@4 (cannaworldnews pipeline), no mdsvex (keeps inline vite.config.ts)

### Design systems (layout/content patterns per site)
- `.planning/design/vfamigos.md` §Layout Patterns (product grid, PDP 2-col, character art)
- `.planning/design/lidentist.md` §Layout Patterns (directory cards, detail, review cards, sample-data integrity)
- `.planning/design/cannaworldnews.md` §Layout Patterns (front grid, article page, region river)
- `.planning/design/lipool.md` §Layout Patterns (trust strip, services, gallery, NAP/JSON-LD)

### Conventions & shells to extend
- `.planning/phases/02-per-site-shells-scaffold-conventions/02-CONVENTIONS.md` — token/shell/nav conventions
- `<site>/src/routes/+layout.svelte`, `+page.svelte`, `src/lib/components/Site*.svelte` — Phase-2 shells to build content into
- `.planning/phases/01-deploy-pipeline-walking-skeleton/01-CONTEXT.md` — prerender contract, entries() requirement

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Four branded shells (Phase 2) with tokens.css, SiteHeader/SiteFooter, hero — content builds INTO these, don't rebuild the shell.
- Prerender contract (prerender=true, trailingSlash='always') already in every +layout.ts — dynamic routes just add entries().
- CI portability grep + svelte-check gate live in deploy.yml — content must keep passing them ({base}-prefixed links, no root-absolute assets, 0 check errors).

### Established Patterns
- `{base}` from $app/paths for all internal links; `rel="external"` only for not-yet-existent routes.
- SvelteKit emits relative `./` asset paths — CSS/SVG-generated imagery avoids binary-asset base-path issues entirely.
- marked + gray-matter run in the Node prerender pass (eager glob), producing static HTML — zero client JS needed for article rendering.

### Integration Points
- New routes under each site's src/routes/; data under src/lib/data/ or src/content/; article deps (marked, gray-matter) added to cannaworldnews/package.json only.

</code_context>

<specifics>
## Specific Ideas

- Imagery is CSS/SVG-generated (character monograms, gallery tiles) — no binary assets, keeps builds fast and base-path-safe; real photos are a v2/Phase-later concern.
- Content must be believable and domain-appropriate but clearly non-production where it matters (lidentist sample-data banner, cannaworldnews informational framing).
- Each dynamic route's entries() MUST cover every record or the prerender build fails — this is the verification centerpiece (built file count == data count).

</specifics>

<deferred>
## Deferred Ideas

- Cart add/remove logic + localStorage + Stripe checkout + /thanks/ → Phase 4
- lipool quote form + lidentist appointment form POST → Phase 4
- SITE_URL-driven SEO/OG/canonical meta component → Phase 5
- cannabis footer disclaimer full copy + FTC final compliance audit → Phase 5 (Phase 3 ships the sample-data banner per D-06, Phase 5 audits)
- Real photography, RSS feed, sitemap → v2

</deferred>

---

*Phase: 03-content-dynamic-routes*
*Context gathered: 2026-07-07*
