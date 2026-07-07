# Requirements: raj — 4-Website Svelte Monorepo

**Defined:** 2026-07-06
**Core Value:** Four distinct, production-quality, custom-domain-ready websites ship from one repo with one push — each with a real conversion path that works the moment real service keys are pasted in.

## v1 Requirements

### Infrastructure & Deploy

- [x] **INFRA-01**: A visitor can reach all four sites from one GitHub Pages deployment at `wolfwdavid.github.io/raj/<site>/` after a single push to main
- [x] **INFRA-02**: A visitor can navigate a hub page at `/raj/` linking to all four sites (relative links)
- [x] **INFRA-03**: A visitor hitting an unknown URL gets a styled root 404 page linking to the four sites
- [x] **INFRA-04**: Each site builds independently with its own package.json/lockfile (`npm ci && npm run build` succeeds per folder, with and without BASE_PATH)
- [ ] **INFRA-05**: Every page of every site is fully prerendered — real content visible in built HTML source (prerender=true, trailingSlash='always', explicit entries() for all dynamic routes)
- [x] **INFRA-06**: CI fails if any built HTML contains hardcoded `/raj/` outside BASE_PATH-derived URLs or root-absolute asset paths (portability guard)
- [ ] **INFRA-07**: Deep links and hard refresh work on every prerendered route served by Pages (dir/index.html emitted per route)

### Vfamigos (collectibles e-commerce)

- [x] **VFAM-01**: A shopper can browse a product grid of original Amigo characters (name, series, price, per-character art) on the home page
- [x] **VFAM-02**: A shopper can open a product page per character with story/bio, traits, price, and add-to-cart (`/products/[slug]/`)
- [ ] **VFAM-03**: A shopper can add/remove items and change quantities in a cart that persists across page reloads (runes store + localStorage)
- [ ] **VFAM-04**: A shopper can proceed to checkout via a Stripe Payment Link anchor from config.ts (placeholder URL, real-ready; disabled-with-notice state when placeholder)
- [ ] **VFAM-05**: A shopper returning from Stripe lands on a prerendered `/thanks/` page (the only success state — nothing simulated in-app)
- [x] **VFAM-06**: A shopper sees brand storytelling (hero + about section) consistent with the vfamigos design system

### Lipool (pool contractor lead-gen)

- [x] **POOL-01**: A homeowner sees services, benefit-led hero, and Long Island trust signals (licensed/insured, years, Nassau & Suffolk service areas) on the home page
- [x] **POOL-02**: A homeowner can view a project gallery page with descriptive alt text
- [ ] **POOL-03**: A homeowner can submit a quote request form (≤5 fields, honeypot, visible labels, inline errors) that POSTs to a configurable FORM_ENDPOINT and shows real success/error states only
- [x] **POOL-04**: A homeowner can tap a click-to-call phone link present on every page
- [x] **POOL-05**: The site emits HomeAndConstructionBusiness JSON-LD with areaServed and consistent NAP in the footer (no aggregateRating without visible reviews)

### Lidentist (dentist reviews + appointment lead-gen)

- [x] **DENT-01**: A patient can browse a directory of Long Island dentists (cards: name, practice, town, specialty, star rating + review count)
- [x] **DENT-02**: A patient can filter the directory by specialty and town (client-side over typed static data, results count announced accessibly)
- [x] **DENT-03**: A patient can open a dentist detail page (`/dentists/[slug]/`) with on-page review cards (stars + numeric value + text)
- [ ] **DENT-04**: A patient can request an appointment via a form (dentist pre-selectable) posting to the configurable FORM_ENDPOINT with real states only
- [x] **DENT-05**: All seeded dentists/reviews are unmistakably labeled as sample data (FTC Reviews Rule compliance gate — launch blocker)
- [x] **DENT-06**: The site meets its accessibility-exemplar bar: skip link, landmarks, aria-labeled ratings, 3px focus rings, 44px targets

### CannaWorldNews (global cannabis news)

- [x] **NEWS-01**: A reader sees an editorial front page (lead story + per-region sections) built from 12+ seeded markdown articles with region frontmatter
- [x] **NEWS-02**: A reader can open any article at `/articles/[slug]/` with kicker, headline, byline/date (`<time>` between headline and body), rendered markdown, and related-by-region links
- [x] **NEWS-03**: A reader can browse per-region rivers at `/region/[region]/` (Americas, Europe, Africa, Asia-Pacific)
- [ ] **NEWS-04**: Every article page emits correct meta/OG tags (title, description, article:published_time) with SITE_URL-driven absolute URLs
- [ ] **NEWS-05**: The site displays an informational-only disclaimer (news reporting, not legal/medical advice) in the footer — compliance gate

### Cross-cutting Quality

- [x] **QUAL-01**: Each site implements its committed design system (.planning/design/<site>.md): palette tokens, font pairing, layout patterns — four visually distinct sites
- [x] **QUAL-02**: Every site passes `npm run check` (svelte-check) with zero errors
- [x] **QUAL-03**: Every page meets baseline a11y: 4.5:1 text contrast, visible focus states, SVG icons (no emoji icons), semantic headings, reduced-motion respected
- [ ] **QUAL-04**: Every site has per-page titles + meta descriptions; canonical/OG URLs derive from a configurable SITE_URL (never BASE_PATH)

## v2 Requirements

### Deferred

- **RSS-01**: cannaworldnews prerendered RSS feed (highest-value v2 pull-forward)
- **DOM-01**: Custom-domain cutover per site (extract folder to own repo, BASE_PATH='', CNAME, 301 strategy)
- **KEYS-01**: Wire real Stripe Payment Links + Formspree endpoints (user supplies accounts)
- **CONT-01**: Real dentist data / real reviews sourcing for lidentist; real project photos for lipool
- **IMG-01**: @sveltejs/enhanced-img responsive image pipeline once real photography exists
- **SMAP-01**: Per-site sitemap.xml emission (meaningful once custom domains are live)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Custom checkout / cart API | Static hosting; Stripe Payment Links cover v1 |
| User-submitted reviews or accounts | No backend; FTC-sensitive; static seeded data only |
| Booking calendar integration | Lead form suffices for v1 conversion |
| CMS / admin for news | Markdown in-repo is the v1 content pipeline |
| Age gate on cannaworldnews | Editorial/informational content; disclaimer instead |
| NFTs / crypto anything on vfamigos | Style inspiration is VeeFriends aesthetics, not web3 mechanics |
| npm workspaces / shared packages | Preserves per-domain repo extraction |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01 | Phase 1 | Complete |
| INFRA-02 | Phase 1 | Complete |
| INFRA-03 | Phase 1 | Complete |
| INFRA-04 | Phase 2 | Complete |
| INFRA-06 | Phase 2 | Complete |
| QUAL-01 | Phase 2 | Complete |
| QUAL-02 | Phase 2 | Complete |
| QUAL-03 | Phase 2 | Complete |
| INFRA-05 | Phase 3 | Pending |
| INFRA-07 | Phase 3 | Pending |
| VFAM-01 | Phase 3 | Complete |
| VFAM-02 | Phase 3 | Complete |
| VFAM-06 | Phase 3 | Complete |
| POOL-01 | Phase 3 | Complete |
| POOL-02 | Phase 3 | Complete |
| POOL-04 | Phase 3 | Complete |
| POOL-05 | Phase 3 | Complete |
| DENT-01 | Phase 3 | Complete |
| DENT-02 | Phase 3 | Complete |
| DENT-03 | Phase 3 | Complete |
| DENT-05 | Phase 3 | Complete |
| DENT-06 | Phase 3 | Complete |
| NEWS-01 | Phase 3 | Complete |
| NEWS-02 | Phase 3 | Complete |
| NEWS-03 | Phase 3 | Complete |
| VFAM-03 | Phase 4 | Pending |
| VFAM-04 | Phase 4 | Pending |
| VFAM-05 | Phase 4 | Pending |
| POOL-03 | Phase 4 | Pending |
| DENT-04 | Phase 4 | Pending |
| NEWS-04 | Phase 5 | Pending |
| NEWS-05 | Phase 5 | Pending |
| QUAL-04 | Phase 5 | Pending |

**Coverage:**
- v1 requirements: 33 total (note: prior footer said 28 — corrected after enumerating INFRA×7, VFAM×6, POOL×5, DENT×6, NEWS×5, QUAL×4)
- Mapped to phases: 33
- Unmapped: 0 ✓

---
*Requirements defined: 2026-07-06*
*Last updated: 2026-07-06 after roadmap creation (traceability populated, count corrected 28→33)*
