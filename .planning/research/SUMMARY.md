# Project Research Summary

**Project:** raj — 4-Website Svelte Monorepo (vfamigos, lipool, lidentist, cannaworldnews)
**Domain:** Static multi-site SvelteKit monorepo on GitHub Pages, mixing e-commerce (collectibles), local-service lead-gen, review-directory lead-gen, and editorial news publishing
**Researched:** 2026-07-06
**Confidence:** HIGH

## Executive Summary

This is a static-hosting monorepo that must ship four genuinely different product types from one GitHub Pages deployment, with zero server and zero shared code between sites. The static-hosting constraint collapses all four onto the same underlying pattern: build-time-typed data, prerendered real HTML, and conversion funneled out to external services (Stripe Payment Links for checkout, Formspree-style POST endpoints for leads) rather than any custom backend. The stack itself is fixed (SvelteKit 2 / Svelte 5 runes / adapter-static / Vite 8 / TypeScript 6, no `svelte.config.js`, no workspaces) and research only validates versions and prescribes the thin supporting layer around it.

The recommended approach is to prove the single-deployment CI pipeline first, against minimal content, before investing in any site's feature depth. Once proven, the four sites become independent, parallelizable tracks that each follow the same shell -> data/routes -> conversion-path progression.

The dominant risks are process traps that "look done but aren't": shipping `ssr = false` copied from the sibling `raj_one` project, hardcoding the `/raj/` base path, missing `entries()` for dynamic routes, and violating the explicit "no fake success states" rule, plus real legal exposure on the review-directory site if seeded reviews aren't unmistakably labeled as sample data (FTC Reviews and Testimonials Rule, up to $51,744/violation). Mitigation is procedural: CI greps for base-path leakage and content-in-HTML, explicit `entries()` + file-count assertions, and a "no success without a real outbound request" verification gate.

## Key Findings

### Recommended Stack

Core stack fixed: SvelteKit 2, Svelte 5 runes, adapter-static, Vite 8, TypeScript 6, one independent package.json per site, no svelte.config.js, no workspaces. Supporting libraries: marked + gray-matter (cannaworldnews markdown, chosen over mdsvex to avoid svelte.config.js), enhanced-img for images, hand-rolled Seo component. External conversion via Stripe Payment Links (vfamigos) and Formspree-style endpoints (lipool/lidentist).

**Core technologies:**
- SvelteKit 2 + Svelte 5 runes — fixed, validated against npm
- @sveltejs/adapter-static — only correct adapter for GitHub Pages
- marked + gray-matter — markdown pipeline avoiding svelte.config.js requirement
- Stripe Payment Links / Formspree-style endpoints — conversion without a server

### Expected Features

**Must have (table stakes):**
- vfamigos: product grid, PDP, cart (runes + localStorage), real Stripe checkout, /thanks/ landing
- lipool: click-to-call, quote LeadForm, services page, trust signals, LocalBusiness schema
- lidentist: dentist directory + detail, review cards, appointment LeadForm, Dentist/Review/AggregateRating schema
- cannaworldnews: 12+ seeded markdown articles, homepage feed, region routes, NewsArticle schema
- Cross-cutting: prerendered build, base-path portability, 4 distinct design systems, SEO/OG + sitemap, hub index

**Should have (competitive):**
- vfamigos: character bios/lore, rarity/season system
- lipool: service-guarantee statement, case studies, FAQ
- lidentist: filter/sort, per-town landing pages
- cannaworldnews: RSS feed (prioritize early), tags, newsletter signup

**Defer (v2+):**
- vfamigos set-completion gamification; third-party live-review widgets; cannaworldnews CMS migration; real custom-domain cutover and real service keys (explicit post-build user step)

### Architecture Approach

Three nested scopes with zero shared code between sites: repo scope (CI + hub), site scope (four independent SvelteKit apps), in-site scope (routes -> lib/components -> lib/data). The linchpin pattern is GitHub's one-Pages-deployment-per-repo limit, forcing a matrix-build -> assemble -> single-deploy CI shape.

**Major components:**
1. CI pipeline (deploy.yml) — matrix build (fail-fast:false) -> single assemble/deploy job
2. Hub index (pages-root/) — committed static HTML + shared 404.html
3. Per-site app (x4) — routes/lib/config.ts (integration seam)/lib/data
4. vfamigos cart store — Svelte 5 runes persisted to localStorage, browser-guarded

### Critical Pitfalls

1. **Copying `ssr = false` from raj_one** — ships empty-body HTML to SEO sites; always leave SSR default-on with prerender=true, gate with CI content-in-HTML grep.
2. **BASE_PATH / `/raj/` leakage** — hardcoded links break dev and future custom-domain cutover; use `{base}`-prefixed links/Vite-imported assets, CI grep for literal `/raj/`.
3. **GitHub Pages first-enable race** — green workflow can still 404; treat first-enable as manual Settings->Pages step.
4. **entries() gaps** — orphan dynamic routes silently omitted; use explicit entries() + file-count assertions.
5. **Fake success states / unlabeled demo reviews** — violates explicit no-fake-success rule and creates FTC exposure (up to $51,744/violation) on lidentist; use real Stripe/Formspree calls only, unmistakable sample-data labeling.

## Implications for Roadmap

### Phase 1: Repo Skeleton + Deploy Pipeline (walking skeleton)
**Rationale:** Single-Pages-deployment matrix->assemble->deploy pattern has no local-dev equivalent and blocks every other phase if wrong; prove it first with trivial content.
**Delivers:** Working deploy.yml, committed pages-root/ hub + shared 404.html, all four subpaths live and manually confirmed.
**Addresses:** "One GitHub Pages deployment serving all four sites plus a hub index page."
**Avoids:** Pages first-enable race, download-artifact nesting mis-copy, fail-fast hiding failures.

### Phase 2: Per-Site Shell + Shared Scaffold Conventions (x4, parallelizable)
**Rationale:** Independent per-site shells can build in parallel, but layout/base-path conventions must be established once to prevent recurring pitfalls.
**Delivers:** package.json/vite.config.ts per site, correct +layout.ts prerender contract, nav/footer shell, 4 design systems, CI grep for base-path leakage.
**Uses:** Config-as-integration-seam pattern.
**Avoids:** ssr=false copy-paste, BASE_PATH leakage, trailingSlash mismatch.

### Phase 3: Content + Dynamic Routes (per site)
**Rationale:** Typed data must exist before entries() can enumerate dynamic routes; naturally per-site.
**Delivers:** vfamigos product data+PDP; lidentist dentist data+directory/detail+reviews; cannaworldnews 12+ articles+routes; lipool services/gallery.
**Addresses:** Table-stakes features and schema markup (LocalBusiness, Dentist/Review/AggregateRating, NewsArticle).
**Avoids:** entries() gaps; review-authenticity/FTC exposure (label demo reviews now, not later).

### Phase 4: Conversion Paths (per site)
**Rationale:** Cart/checkout and lead forms depend on the data model; highest scrutiny given "no fake success states."
**Delivers:** vfamigos runes cart+localStorage+Stripe link+/thanks/; lipool/lidentist LeadForm with honeypot+progressive enhancement.
**Uses:** Stripe Payment Links / Formspree-style stubs; config-as-integration-seam.
**Avoids:** localStorage prerender crash, fake success states, public-endpoint spam.

### Phase 5: SEO/Domain-Readiness Hardening + Compliance Gate
**Rationale:** Canonical/sitemap correctness and compliance only matter at cutover; one clear late checkpoint beats scattered per-site debt.
**Delivers:** Per-site SITE_URL-driven canonical/OG/sitemap, robots.txt, cannabis disclaimer, final demo-data-labeling audit.
**Addresses:** SEO/OG requirements; cannabis compliance requirement.
**Avoids:** Subpath SEO/canonical mismatch at cutover, cannabis health-claims exposure.

### Phase Ordering Rationale

- Pipeline before content: validates the one novel architectural element before any site invests in feature depth.
- Shell conventions before parallel site work: prevents the two most consequential pitfalls (ssr=false, base leakage) from needing four separate fixes.
- Conversion after content: cart/forms have a real dependency on data/config; sequencing after content prevents a dishonest-looking demo.
- Compliance/SEO-hardening as a distinct late gate: matches the pre-cutover gate PITFALLS.md explicitly calls for.

### Research Flags

Needs research:
- Phase 1 — GitHub Actions artifact nesting + Pages first-enable race: subtle enough to warrant a focused verification pass.
- Phase 4 — Stripe Payment Links dashboard-side success-URL configuration: confirm against current Stripe docs before writing checkout UI.
- Phase 5 — Cannabis marketing compliance and FTC Reviews Rule: researched at MEDIUM confidence; re-check against current guidance before this phase given regulatory exposure is the highest-cost pitfall.

Standard patterns (skip research-phase):
- Phase 2 — SvelteKit prerender/trailingSlash/adapter-static conventions are well-documented and validated against the raj_one reference.
- Phase 3 — Standard entries() + typed-data patterns; no novel technology.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Versions verified against npm registry; integration patterns verified against official docs |
| Features | HIGH | Well-trodden domains; current-year best practices verified via multiple sources |
| Architecture | HIGH | Validated against working raj_one reference plus official docs; one correction documented (ssr=false must not be copied) |
| Pitfalls | HIGH (technical) / MEDIUM (compliance) | Technical pitfalls fleet-proven; cannabis/FTC compliance guidance is MEDIUM (industry summaries, not legal counsel) |

**Overall confidence:** HIGH

### Gaps to Address

- Cannabis compliance specifics are a state-by-state patchwork researched via industry guides, not legal counsel — treat Phase 5 guidance as a floor and flag for real legal review before cutover.
- FTC Reviews Rule labeling UX (badge text, placement) wasn't specified — resolve during Phase 3 planning with a concrete design decision.
- GitHub Actions artifact/Pages behavior can drift — re-verify against current docs at Phase 1 implementation time.
- SEO subpath-to-custom-domain cutover mechanics (301s, reindexing) are explicitly deferred — needs its own research pass when a domain-cutover milestone is scheduled.

## Sources

### Primary (HIGH confidence)
- npm registry (`npm view`) — verified latest versions for svelte, @sveltejs/kit, adapter-static, vite, typescript, marked, gray-matter, enhanced-img, svelte-meta-tags, isomorphic-dompurify
- SvelteKit official docs (Images, adapter-static)
- raj/raj_one/ proven single-site reference implementation
- actions/upload-artifact merge README + issue #24
- FTC Consumer Reviews and Testimonials Rule Q&A
- Google Article structured data docs + Publisher Center best practices
- .planning/PROJECT.md + pre-approved plan

### Secondary (MEDIUM confidence)
- Snipcart blog / StackShare — Stripe Checkout API vs Snipcart
- Un-static / splitforms / Web3Forms comparisons
- Conversion Rate Optimization for Service Businesses 2026 (bspkn.co)
- Local Business Schema Markup guides (zumeirah, TheBomb)
- Cannabis Marketing Compliance Guide (influenceflow.io), Cannabis/THC Marketing Guidelines by State
- sveltejs/kit issues #3393, #2143, #7725

### Tertiary (LOW confidence)
- None flagged — all sources reached at least MEDIUM confidence

---
*Research completed: 2026-07-06*
*Ready for roadmap: yes*
