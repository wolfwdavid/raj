# Roadmap: raj — 4-Website Svelte Monorepo

## Overview

This project ships four genuinely different websites — a collectibles e-commerce store (vfamigos), a pool-contractor lead generator (lipool), a dentist-reviews lead generator (lidentist), and a global cannabis-news publication (cannaworldnews) — from one repo through a single GitHub Pages deployment. The journey proves the one-deployment CI pipeline first against trivial content (the only truly novel architectural element and the biggest "looks-done-but-isn't" risk), then establishes shared prerender/portability conventions once so the four sites can build as independent, parallel tracks. With the shell and conventions locked, each site gets its real typed content and routes, then its real outbound conversion path (Stripe Payment Link or Formspree-style POST — never a fake success state), and finally a single late gate hardens SEO/custom-domain-readiness and clears the compliance blockers (FTC sample-data labeling, cannabis disclaimer). Sites share zero code; the design systems in `.planning/design/<site>.md` keep them visually distinct.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Deploy Pipeline (Walking Skeleton)** - One push deploys a live hub linking four placeholder site subpaths on GitHub Pages
- [ ] **Phase 2: Per-Site Shells + Scaffold Conventions** - Four independent SvelteKit apps with correct prerender/portability conventions and distinct design systems
- [ ] **Phase 3: Content + Dynamic Routes** - Every site presents its real typed content across all static and dynamic routes, fully prerendered
- [ ] **Phase 4: Conversion Paths** - Each site's real conversion path (cart/checkout, lead forms) works end-to-end with no fake success states
- [ ] **Phase 5: SEO Hardening + Compliance Gate** - Every site is custom-domain-ready with correct metadata and passes its compliance gates

## Phase Details

### Phase 1: Deploy Pipeline (Walking Skeleton)
**Goal**: Prove the single-Pages-deployment CI pattern (matrix build → assemble → single deploy) against trivial content before any site invests in feature depth.
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03
**Success Criteria** (what must be TRUE):
  1. After a push to main, `wolfwdavid.github.io/raj/` serves a hub page linking to all four site subpaths with relative links.
  2. Each of the four subpaths (`/raj/vfamigos/`, `/raj/lipool/`, `/raj/lidentist/`, `/raj/cannaworldnews/`) loads a placeholder page served by Pages.
  3. Hitting an unknown `/raj/` URL returns a styled root 404 page linking back to the four sites.
  4. The matrix-build → assemble → single-`upload-pages-artifact` workflow completes green and produces exactly one Pages deployment.
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md — deploy.yml: matrix build (fail-fast:false) → assemble _site → single deploy; download-artifact@v4 un-nesting + 4×index.html assertion; first-enable handling; committed live smoke script
- [x] 01-02-PLAN.md — four minimal SvelteKit placeholder apps (committed lockfiles, prerender contract, BASE_PATH-driven base) + committed pages-root/ hub index + shared 404.html + .nojekyll

### Phase 2: Per-Site Shells + Scaffold Conventions
**Goal**: Establish the layout/base-path/prerender conventions once and stand up four independent SvelteKit shells, each in its committed design system, so later site work is parallel and pitfall-free.
**Depends on**: Phase 1
**Requirements**: INFRA-04, INFRA-06, QUAL-01, QUAL-02, QUAL-03
**Success Criteria** (what must be TRUE):
  1. Each site builds standalone (`npm ci && npm run build`) with its own package.json/lockfile, succeeding both with and without BASE_PATH set.
  2. Each site renders a nav/footer shell in its committed design system (`.planning/design/<site>.md`) — four visually distinct looks via palette tokens, font pairing, and layout patterns.
  3. CI fails the build if any emitted HTML contains a hardcoded `/raj/` link or root-absolute asset path (portability guard).
  4. Every site passes `npm run check` (svelte-check) with zero errors, and shell pages meet baseline a11y (4.5:1 contrast, visible focus states, SVG icons, semantic headings, reduced-motion respected).
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Shared scaffold conventions: extend deploy.yml build leg with svelte-check gate + empty-BASE_PATH build + built-HTML portability grep (root-absolute href/src); author 02-CONVENTIONS.md shell exemplar (tokens.css, app.html fonts, SiteHeader/SiteFooter/+layout skeleton, rel=external prerender-safe nav rule, a11y checklist)
- [x] 02-02-PLAN.md — vfamigos + lipool branded shells (design tokens, fonts, nav/footer, real hero, a11y baseline)
- [x] 02-03-PLAN.md — lidentist + cannaworldnews branded shells (design tokens, fonts, nav/masthead + footer, real hero, a11y baseline; lidentist = a11y exemplar)

### Phase 3: Content + Dynamic Routes
**Goal**: Give every site its real, typed content across all static and dynamic routes, fully prerendered with real content in the built HTML.
**Depends on**: Phase 2
**Requirements**: INFRA-05, INFRA-07, VFAM-01, VFAM-02, VFAM-06, POOL-01, POOL-02, POOL-04, POOL-05, DENT-01, DENT-02, DENT-03, DENT-05, DENT-06, NEWS-01, NEWS-02, NEWS-03
**Success Criteria** (what must be TRUE):
  1. vfamigos shows a product grid of original Amigo characters on the home page and a per-character product page at `/products/[slug]/` (story/bio, traits, price), plus brand hero + about storytelling.
  2. lidentist shows a directory of Long Island dentists filterable by specialty and town (results count announced accessibly) and per-dentist detail pages at `/dentists/[slug]/` with on-page review cards — with all seeded dentists/reviews unmistakably labeled as sample data, and skip link, landmarks, aria-labeled ratings, 3px focus rings, and 44px targets present.
  3. cannaworldnews shows an editorial front page (lead story + per-region sections), article pages at `/articles/[slug]/` (kicker, headline, byline/date, related-by-region), and per-region rivers at `/region/[region]/`, all built from 12+ seeded markdown articles.
  4. lipool shows a benefit-led home with Long Island trust signals, a project gallery with descriptive alt text, a click-to-call phone link on every page, and HomeAndConstructionBusiness JSON-LD with consistent footer NAP.
  5. Built HTML for every route (including dynamic routes) contains real content, and deep links plus hard refresh work on every prerendered route (dir/index.html emitted per route via explicit `entries()`).
**Plans**: 5 plans

Plans (Wave 1 = 03-01..03-04 run in parallel; Wave 2 = 03-05 depends on all four):
- [x] 03-01-PLAN.md — vfamigos: products.ts + home grid + /products/ listing + /products/[slug]/ PDP + /about/ (Wave 1)
- [x] 03-02-PLAN.md — lidentist: dentists.ts + filterable directory + /dentists/[slug]/ detail + review cards + FTC sample-data banner + a11y-exemplar bar (Wave 1)
- [x] 03-03-PLAN.md — cannaworldnews: marked+gray-matter pipeline + 12+ markdown articles + front page + /articles/[slug]/ + /region/[region]/ (Wave 1)
- [x] 03-04-PLAN.md — lipool: services + LI trust strip + /gallery/ + click-to-call + HomeAndConstructionBusiness JSON-LD/NAP (no aggregateRating) (Wave 1)
- [x] 03-05-PLAN.md — cross-cutting: drop stale rel=external on now-real routes + CI content-in-HTML + dynamic-route file-count/deep-link assertions (Wave 2)

### Phase 4: Conversion Paths
**Goal**: Wire each site's real outbound conversion path so it works the moment real keys are pasted — with no fake success states anywhere.
**Depends on**: Phase 3
**Requirements**: VFAM-03, VFAM-04, VFAM-05, POOL-03, DENT-04
**Success Criteria** (what must be TRUE):
  1. A vfamigos shopper can add/remove items and change quantities in a cart that persists across page reloads (runes store + localStorage), then proceed to checkout via a Stripe Payment Link anchor from config.ts (disabled-with-notice state while the placeholder URL is set).
  2. A vfamigos shopper returning from Stripe lands on a prerendered `/thanks/` page — the only success state, with nothing simulated in-app.
  3. A lipool homeowner can submit a ≤5-field quote form (honeypot, visible labels, inline errors, native POST without JS) to the configurable FORM_ENDPOINT and sees only real success/error states.
  4. A lidentist patient can request an appointment via a form with the dentist pre-selectable, posting to the configurable FORM_ENDPOINT with real states only.
**Plans**: 2 plans

Plans (Wave 1 = 04-01 and 04-02 run in parallel — disjoint site file sets):
- [x] 04-01-PLAN.md — vfamigos: runes cart.svelte.ts + browser-guarded localStorage + reactive badge + wired PDP add + /cart/ + STRIPE_PAYMENT_LINK checkout (disabled-when-placeholder) + prerendered /thanks/ (Wave 1)
- [x] 04-02-PLAN.md — shared LeadForm for lipool /quote/ + lidentist /appointment/ (?dentist= pre-select): FORM_ENDPOINT config, native POST + fetch progressive enhancement, off-screen honeypot, real states only (Wave 1)

### Phase 5: SEO Hardening + Compliance Gate
**Goal**: Make every site custom-domain-ready with correct SITE_URL-driven metadata and clear the compliance blockers before any cutover.
**Depends on**: Phase 4
**Requirements**: NEWS-04, NEWS-05, QUAL-04
**Success Criteria** (what must be TRUE):
  1. Every page across all four sites has a unique title and meta description, with canonical/OG URLs derived from a configurable SITE_URL (never BASE_PATH).
  2. cannaworldnews article pages emit correct meta/OG tags including `article:published_time` with SITE_URL-driven absolute URLs.
  3. cannaworldnews displays an informational-only disclaimer (news reporting, not legal/medical advice) in the footer.
  4. A final audit confirms no fake success states exist and all lidentist sample data remains unmistakably labeled (FTC Reviews Rule gate cleared).
**Plans**: 2 plans

Plans:
- [ ] 05-01: Hand-rolled Seo component — SITE_URL-driven titles/meta/canonical/OG across all four sites
- [ ] 05-02: cannaworldnews article OG/published_time + cannabis disclaimer + final no-fake-success / demo-label compliance audit

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Deploy Pipeline | 0/2 | Not started | - |
| 2. Per-Site Shells | 0/3 | Not started | - |
| 3. Content + Routes | 3/5 | In Progress|  |
| 4. Conversion Paths | 0/2 | Planned | - |
| 5. SEO + Compliance | 0/2 | Not started | - |
