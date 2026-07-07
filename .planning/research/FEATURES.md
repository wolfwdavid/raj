# Feature Research

**Domain:** Four static SvelteKit sites — collectibles/character-brand ecom (vfamigos), local-service lead-gen (lipool), review-directory lead-gen (lidentist), worldwide news publishing (cannaworldnews)
**Researched:** 2026-07-06
**Confidence:** HIGH (well-trodden domains; current-year best practices verified via web search; static-hosting constraints applied throughout)

## Scope Note

This document is organized **per site type** because the four properties have almost no feature overlap beyond cross-cutting web fundamentals (SEO/OG metadata, responsive layout, prerendered HTML, base-path portability). Each site gets its own Table Stakes / Differentiators / Anti-Features block. A final **Cross-Cutting** section covers what all four share (the monorepo's shared infrastructure), followed by dependencies, MVP, and prioritization.

**Hard constraint driving every "complexity" and every anti-feature:** static hosting on GitHub Pages. No server, no database, no auth, no runtime code. Conversion happens through *external* services — Stripe Payment Links for checkout, Formspree-style POST endpoints for forms. "No fake success states" is a project rule: never simulate a purchase or a form success that didn't actually reach a real service.

---

# SITE 1 — vfamigos.com (Collectibles / Character-Brand E-commerce)

Model brand: VeeFriends (shop.veefriends.com) — character universe + seasons/rarity + storytelling-first product pages. vfamigos is an **original** brand; VeeFriends is style inspiration only (no trade dress, no character copying).

## Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Product grid / catalog page | Every shop has a browsable list of what's for sale | LOW | Static grid from typed product data; images Vite-imported |
| Product detail page (PDP) | Users need price, description, images before buying | MEDIUM | Per-product route; `entries()` for prerender; gallery + price + CTA |
| Add-to-cart + cart view | Baseline ecom mental model; users expect a cart even for few SKUs | MEDIUM | Svelte 5 runes store persisted to `localStorage`; no backend |
| Checkout path that actually charges | A "buy" button must lead to real payment | MEDIUM | **Stripe Payment Links** per SKU (URL in `config.ts`); no custom checkout possible statically |
| Product imagery (multiple angles) | Collectibles are visual; buyers scrutinize condition/detail | LOW | Multiple images per product; responsive `srcset` ideal |
| Price + availability display | Non-negotiable purchase info | LOW | Static price; "sold out" as a data flag (see rarity below) |
| Mobile-responsive layout | Majority of collectible/impulse traffic is mobile | LOW | Design-system responsive baseline |
| Order confirmation landing (`/thanks/`) | Post-purchase reassurance | LOW | Stripe Payment Link redirects here after success — real, not faked |

## Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Character bios / lore pages** | The whole VeeFriends thesis: you buy the *story*, not the object | MEDIUM | Each character gets a trait, backstory, personality; drives emotional attachment |
| **Rarity / series / season system** | Scarcity ("sold out, never reprinted") is the core collectible psychology | MEDIUM | Data-modeled: season, edition size, rarity tier badges; "retired" state |
| **"Season" collection landing pages** | Groups drops into narrative waves; encourages set-completion | MEDIUM | Route per season; ties products to lore |
| Character trait / attribute badges | VeeFriends' signature — each character embodies one virtue (e.g. "Patient Pig") | LOW | Metadata field rendered as a badge on grid + PDP |
| Product storytelling video/animation embed | VeeFriends uses QR→3D short films; emotional depth | MEDIUM | Embed hosted video (YouTube/Vimeo) — no self-hosting on Pages |
| Set-completion / "collect them all" UI | Gamifies collecting; shows owned-vs-missing (if local state) | HIGH | Requires cart/collection state; consider deferring |
| Wishlist (localStorage) | Low-friction intent capture without accounts | MEDIUM | Purely client-side; no server sync |

## Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **NFTs / on-chain collectibles** | VeeFriends does it; "web3 hype" | Out of scope; adds wallet/chain complexity; regulatory + trust baggage; impossible to do meaningfully static | Physical/digital collectibles via Stripe; lean into scarcity data, not blockchain |
| Custom on-site checkout / card fields | "Feels more professional" | Impossible without a server; PCI liability; the project forbids fake flows | Stripe Payment Links (Stripe hosts the secure checkout) |
| Real-time inventory counts | "Only 3 left!" urgency | No backend to decrement; would be a lie the moment two people buy | Static "limited to N / season sold out" flags updated at build time |
| User accounts / login / order history | "Every store has accounts" | No auth server; huge scope; unnecessary for Payment-Link flow | localStorage cart/wishlist; Stripe emails the receipt |
| On-site product reviews with submission | Social proof | No backend to accept/store reviews; spam magnet | Curated testimonials as static content, or embed a third-party widget |
| Discount-code engine | Promotions | Codes are validated server-side; Payment Links support only fixed promo codes in Stripe | Configure promo codes inside Stripe, not on-site |

---

# SITE 2 — lipool.com (Long Island Pool Contractor — Local-Service Lead-Gen)

Goal: turn a local homeowner into a phone call or a submitted quote request. Every design decision serves "call now" or "get a quote."

## Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Click-to-call phone, visible on every page** | Homeowners decide fast; if they hunt for the number they call a competitor. ~10-second rule | LOW | `tel:` link in sticky header; highest-leverage element |
| **Quote / contact lead form** | Primary conversion for non-urgent visitors | MEDIUM | Posts to configurable `FORM_ENDPOINT` (Formspree-style); honeypot; **progressive enhancement** (native POST works without JS) |
| Services page (what they do) | Buyers must confirm you do their job (build vs. repair vs. maintenance) | LOW | Static content, per-service sections |
| **Service-area statement (towns/ZIPs served)** | Local intent — "do they serve MY town on Long Island?" | LOW | List of towns; feeds `areaServed` schema |
| Project gallery / portfolio | Pools are a considered, visual, high-ticket purchase — proof of quality | MEDIUM | Image grid, ideally before/after; responsive; lazy-loaded |
| Trust signals — licensed, bonded, insured | Baseline credibility for contractors; its absence kills trust | LOW | Badges/statement; "licensed, bonded, insured" is table stakes (not a differentiator) |
| Reviews / testimonials (social proof) | Google star ratings drive conversion | LOW–MEDIUM | Static curated quotes; or embedded Google reviews widget |
| Above-the-fold headline + primary CTA | Single highest-leverage element on a service landing page | LOW | Value prop + call/quote CTA visible without scrolling |
| Fast load (<2.5s) | Speed is table stakes in 2026; slow = bounce before offer seen | LOW | Prerendered static HTML already fast; optimize images |
| `LocalBusiness` structured data | Local pack + rich-result eligibility | MEDIUM | Use specific subtype (`HomeAndConstructionBusiness`/`GeneralContractor` or `PoolCleaningService`), `areaServed`, consistent NAP |

## Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Service-guarantee statement** | "Licensed" is table stakes; "we respond in 24h / satisfaction guarantee" wins the click | LOW | Copy-level differentiator, high impact |
| Financing / pricing-range transparency | Pools are expensive; ballpark pricing pre-qualifies leads | LOW | Static ranges or "starting at" copy |
| Named case studies with outcomes | Specific results ("15×30 gunite, 6 weeks") beat generic photos | MEDIUM | Structured project write-ups tied to gallery |
| Multi-step / qualifying quote form | Captures project type/budget/timeline for better leads | MEDIUM | Balance against the "3 fields convert 25% better" rule — keep short by default |
| Seasonal / promo hero banner | LI pools are seasonal; drives urgency | LOW | Config-driven banner |
| Interactive service-area map | Visual "we serve here" | MEDIUM | Static embedded map; avoid heavy JS |
| FAQ section | Deflects objections, aids SEO | LOW | Also enables `FAQPage` schema |

## Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Online booking / real scheduling | "Let customers book instantly" | Pools need site visits + custom quotes; no calendar backend; false expectation | Quote form → human follow-up; embed Calendly link if truly needed |
| Instant online price calculator (binding) | "Give me a price now" | Every pool is custom; a binding number statically is a liability | "Ballpark" ranges + quote form for real pricing |
| Live chat / chatbot | "Engage visitors" | No server; third-party widgets tank performance & trust for a local trade | Prominent click-to-call — a phone call converts better here |
| Long, 8+ field forms | "Qualify the lead fully" | Forms >6 fields convert ~25% worse | Name + phone + service; qualify on the call/visit |
| Faked `aggregateRating` schema | "Get stars in search" | Google's spammy-structured-data filter penalizes ratings with no visible reviews on page | Only mark up reviews that are actually shown on the page |
| Blog/CMS at launch | "Content marketing" | No CMS in scope; maintenance burden; not a v1 conversion driver | Static services/FAQ pages carry the SEO; blog is future |

---

# SITE 3 — lidentist.reviews (LI Dentist Reviews + Appointment Lead-Gen — Review Directory)

Hybrid: a **directory/review** site (browse dentists, read ratings) whose conversion is an **appointment-request lead**. Because it *is* a reviews site, review content is genuinely on-page — so review structured data is legitimate here (unlike a faked rating on a single business site).

## Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Dentist directory / listing grid** | The core of any review-directory site | MEDIUM | Cards from typed data: name, photo, rating, specialty, town |
| **Listing cards with star rating + review count** | Users scan ratings first; it's the primary decision signal | LOW | Aggregate rating rendered on card; count shown |
| **Dentist detail page** | Deep-dive: full profile, services, location, reviews | MEDIUM | Per-dentist route; `entries()` for prerender |
| **Review cards on detail page** | Reason the site exists; social proof | LOW | Star + quote + reviewer name/date, from typed data |
| **Appointment-request CTA + form** | The conversion; "request appointment" per dentist | MEDIUM | Duplicated LeadForm pattern → `FORM_ENDPOINT`; honeypot; progressive enhancement |
| Click-to-call per listing | Some users prefer phoning the office directly | LOW | `tel:` per dentist |
| Filter / search by town or specialty | Directories are useless without narrowing | MEDIUM | Client-side filter over static data (no server search) |
| Location / map + address per dentist | "Is it near me?" | LOW–MEDIUM | Address + optional static map embed |
| Structured data: `Dentist` + `AggregateRating` + `Review` | Rich results / stars in SERP; **legitimately backed by visible reviews** | MEDIUM | Use `Dentist` subtype (not generic LocalBusiness); NAP consistency |
| Mobile-responsive, fast | Health-service searches are heavily mobile | LOW | Static baseline |

## Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Comparison / sort (by rating, distance, specialty)** | Helps users choose; keeps them on-site | MEDIUM | Client-side sort of static dataset |
| "Featured / top-rated" ranking | Editorial trust + potential monetization angle | LOW | Data flag + badge |
| Specialty taxonomy (ortho, pediatric, cosmetic, emergency) | Matches high-intent searches | LOW | Tag field powering filters + landing pages |
| Insurance-accepted filter | Huge real-world decision factor for dental | MEDIUM | Data field + filter |
| Per-town landing pages ("Dentists in Huntington") | Local SEO gold for a directory | MEDIUM | Generated routes from town data |
| Rating distribution / breakdown | Depth of social proof (not just an average) | LOW | Static computed from review data |
| "New patient special" callouts | Conversion incentive | LOW | Per-dentist promo field |

## Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **User-submitted reviews** | "Let patients leave reviews" | No backend to accept/moderate; spam/defamation/liability; healthcare review moderation is fraught | Curated/seeded review data at build time; embed a third-party review source later |
| Real appointment booking / calendar | "Book instantly" | No practice-management integration; static can't hold real availability; false promise | Appointment *request* form → office follow-up |
| Faked or purchased ratings | "Look popular fast" | Google penalizes; erodes the site's entire trust premise | Only display ratings you can substantiate; be transparent about sources |
| Star ratings without visible reviews | SERP stars | Spammy-structured-data penalty | This site shows reviews, so keep markup tied 1:1 to on-page reviews |
| Login / patient accounts | "Personalization" | No auth server; PHI/HIPAA risk near health data | Stateless browsing; no personal data stored |
| Collecting health info in the lead form | "Pre-screen patients" | HIPAA exposure through a generic form endpoint | Ask only name, phone, preferred dentist/time — no medical details |

---

# SITE 4 — cannaworldnews.com (Worldwide Cannabis News — Editorial Publishing)

Static markdown-driven editorial site. 12+ seeded articles with region frontmatter, rendered via `marked`. Conversion = editorial engagement (reads, subscribes, shares), not commerce.

## Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Article layout (readable typography)** | Core of a news site; readability is the product | LOW | `marked`-rendered markdown; constrained measure, strong type scale |
| **Homepage feed of latest articles** | Entry point; "what's new" | MEDIUM | Sorted by date from frontmatter |
| **Category / region taxonomy + landing pages** | Global cannabis news is inherently regional (US states, EU, Canada, etc.) | MEDIUM | `/region/[region]/` routes from frontmatter |
| **Byline + publish date (visible)** | Journalistic credibility; Google News wants a clear visible date/time between headline and body | LOW | Author + ISO date in frontmatter; render prominently |
| **`NewsArticle` structured data** | Top Stories / news rich-result eligibility | MEDIUM | `headline`, `datePublished`, `dateModified`, `author`, `publisher` + logo (logo required for Top Stories) |
| **Article slugs / clean permalinks** | Shareable, SEO-friendly URLs | LOW | `/articles/[slug]/`, trailing slash always |
| Related / more articles | Keeps readers on-site; reduces bounce | LOW–MEDIUM | By shared region/tag |
| **SEO + Open Graph / Twitter meta per article** | Social sharing is how news spreads | MEDIUM | Per-article OG title/description/image; article-level `<meta>` |
| Responsive, fast reading experience | Most news traffic is mobile | LOW | Prerendered static = fast |
| Author attribution page (or byline link) | E-E-A-T; Google can't verify authorship without an author entity/URL | LOW–MEDIUM | Even a lightweight author page boosts news trust |

## Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Interactive world/region map or region switcher** | "Cannabis news *from around the world*" — makes the global angle tangible | MEDIUM | Region nav; a static SVG map is a strong signature element |
| **RSS / Atom feed** | Expected by news aggregators & power readers; cheap to generate statically | LOW | Prerender `/rss.xml` from article data; strong differentiator vs. amateur sites |
| Tags + tag pages | Topic depth (legalization, medical, business, culture) | LOW–MEDIUM | Secondary taxonomy beyond region |
| Featured / hero story | Editorial hierarchy signals a "real" publication | LOW | Frontmatter `featured` flag |
| Reading time estimate | Small UX polish readers appreciate | LOW | Computed from word count |
| Newsletter signup | Audience retention | LOW | Static form → external endpoint (Formspree/Buttondown); no server |
| Region/legal-status badges | Editorial value in a legally fragmented space | LOW | Frontmatter-driven |
| Table of contents for long-reads | Navigability for analysis pieces | MEDIUM | Generated from markdown headings |

## Anti-Features (Commonly Requested, Often Problematic)

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **CMS / admin dashboard** | "Editors need to publish easily" | Explicitly out of scope; needs a backend; huge complexity for v1 | Markdown files in-repo; Git *is* the CMS for v1 |
| Comments section | "Engagement" | No backend/moderation; spam & legal risk on a cannabis site; kills performance | Social share links; comments via third-party embed later if wanted |
| User accounts / personalization | "Tailored feed" | No auth server; unnecessary for editorial v1 | Region/tag browsing serves discovery |
| On-site cannabis sales / dispensary storefront | "Monetize" | Legal minefield; payment processors restrict cannabis; not a news function | Keep it strictly editorial; no commerce |
| Auto-scraped / auto-aggregated headlines | "Fill the feed cheaply" | Copyright/quality issues; hurts E-E-A-T and Google News standing | Original seeded articles with real bylines |
| Age-gate splash wall | "Compliance" | Interstitial hurts SEO/UX; news/editorial ≠ sales, generally lower risk | Editorial framing; footer disclaimer if desired (verify per-jurisdiction) |
| Autoplay video / heavy ad stack | "Revenue" | Destroys the <2.5s load & reading experience | Clean reading first; monetize thoughtfully later |

---

# CROSS-CUTTING (Shared Monorepo Infrastructure — All Four Sites)

These are table stakes for *every* site and belong to the shared build/deploy layer, not any single property.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Prerendered static HTML (`prerender = true`) | SEO needs real HTML, not client-rendered blanks; **never `ssr = false`** on these SEO sites | LOW | Per `+layout.ts`; `trailingSlash = 'always'` |
| Base-path portability (zero hardcoded `/raj/`) | Custom-domain readiness; every asset `{base}`-prefixed or Vite-imported | MEDIUM | `BASE_PATH` env; portability constraint |
| Per-site distinct design system (ui-ux-pro-max) | Each brand must *feel* different (playful ecom / trust / medical / editorial) | MEDIUM | Four visual identities |
| SEO meta + OG tags (sitewide baseline) | Discoverability + social sharing | LOW–MEDIUM | Per-route `<svelte:head>`; site-appropriate schema |
| Responsive + accessible baseline | Table stakes everywhere in 2026 | MEDIUM | Semantic HTML, contrast, keyboard nav |
| Hub index linking the four sites | Single deployment needs a landing/router | LOW | Static index at repo root of `_site` |
| Sitemap.xml + robots.txt per site | Crawlability | LOW | Prerendered |
| Config-driven integration stubs | Real-ready: paste keys and it works; no fake success | LOW | `config.ts` + `VITE_` overrides for Stripe links / form endpoints |
| Honeypot + progressive-enhancement forms | Spam resistance + works without JS | LOW | Shared LeadForm pattern (duplicated lipool/lidentist by design) |

---

## Feature Dependencies

```
CROSS-CUTTING FOUNDATION
  Prerender + base-path portability + design system + SEO/OG baseline
      └──required by──> every page on all four sites (build these FIRST)

vfamigos:
  Product data model
      └──requires──> Product grid ──requires──> PDP ──requires──> Cart (runes/localStorage)
                                                        └──requires──> Stripe Payment Link checkout ──requires──> /thanks/ landing
  Rarity/Season data ──enhances──> Product grid + PDP (badges, sold-out, season pages)
  Character bios ──enhances──> PDP (storytelling)
  Set-completion UI ──requires──> Cart/collection state (defer if cutting scope)

lipool:
  FORM_ENDPOINT config
      └──required by──> Quote LeadForm (honeypot + progressive enhancement)
  Service-area data ──required by──> areaServed in LocalBusiness schema
  Gallery ──enhances──> case studies / trust
  Click-to-call ──independent, ship first (highest leverage)──

lidentist:
  Dentist data model
      └──requires──> Directory grid + filters/sort ──requires──> Dentist detail page
                                                          └──requires──> Review cards ──enables──> Dentist+Review+AggregateRating schema
  Appointment LeadForm ──requires──> FORM_ENDPOINT config (SAME pattern as lipool)
  Town/specialty taxonomy ──enables──> per-town/specialty landing pages

cannaworldnews:
  Markdown articles + frontmatter (region/date/author/tags)
      └──requires──> marked rendering ──requires──> Article layout
      └──requires──> Homepage feed + region routes + article routes
  Article data ──enables──> RSS feed, related articles, NewsArticle schema, OG per-article
  Author page ──enhances──> byline (E-E-A-T)

CONFLICTS / TENSIONS:
  Multi-field qualifying form  ~tension~  "3 fields convert 25% better"  → keep short by default
  Faked aggregateRating       ✗conflicts✗   Google spammy-structured-data filter → only mark up visible reviews
  Any real-time/inventory/booking ✗conflicts✗ static hosting → use static flags + external services
```

### Dependency Notes

- **Cross-cutting foundation is a hard prerequisite for everything.** Prerender config, base-path portability, and the per-site design system must land before feature work, or every page is rebuilt twice.
- **vfamigos cart → Stripe → /thanks/ is a chain.** The `/thanks/` route is the *real* Stripe redirect target, not a simulated confirmation. Building cart without the Payment Link wiring produces a dead-end (a forbidden fake success).
- **lipool and lidentist share the LeadForm + config pattern** (duplicated by design decision, no workspaces). Build the pattern once conceptually, instantiate twice.
- **lidentist review schema is legitimate only because reviews are visibly on-page** — the dependency (visible reviews → AggregateRating markup) is what keeps it clear of Google's spam filter. lipool must NOT copy the AggregateRating markup unless it also shows real reviews.
- **cannaworldnews everything derives from frontmatter.** Region routes, RSS, related articles, and NewsArticle schema all read the same article metadata — invest in a clean frontmatter schema first.

---

## MVP Definition

### Launch With (v1) — matches PROJECT.md Active requirements

- [ ] **Cross-cutting:** prerendered static build, base-path portability, 4 distinct design systems, per-site SEO/OG + sitemap, hub index, single Pages deploy — *foundation for all four*
- [ ] **vfamigos:** product grid, PDP, runes cart → localStorage, Stripe Payment Link checkout (placeholders in `config.ts`), `/thanks/` redirect target, character bios + rarity/season badges — *core commerce + brand thesis*
- [ ] **lipool:** services page, project gallery, quote LeadForm (`FORM_ENDPOINT`, honeypot, progressive enhancement), click-to-call header, service-area + trust signals, `LocalBusiness` schema — *lead conversion*
- [ ] **lidentist:** dentist directory from typed data, filter/sort, dentist detail pages with review cards, appointment-request LeadForm, `Dentist`+`Review`+`AggregateRating` schema — *directory + lead*
- [ ] **cannaworldnews:** 12+ seeded markdown articles with region frontmatter, `/`, `/region/[region]/`, `/articles/[slug]/`, `marked` rendering, editorial layout, visible byline/date, `NewsArticle` schema + OG per article — *editorial engagement*

### Add After Validation (v1.x)

- [ ] vfamigos: wishlist (localStorage), season collection landing pages, storytelling video embeds — *once catalog proven*
- [ ] lipool: service-guarantee copy, FAQ (+`FAQPage` schema), named case studies, seasonal promo banner — *once leads flow*
- [ ] lidentist: per-town/specialty landing pages, insurance-accepted filter, rating distribution — *once directory has traffic*
- [ ] cannaworldnews: **RSS feed**, tags + tag pages, newsletter signup, interactive region map, reading time — *RSS is cheap and high-value; prioritize early in v1.x*

### Future Consideration (v2+)

- [ ] vfamigos: set-completion gamification — *needs richer client state; validate demand first*
- [ ] lipool/lidentist: embedded third-party live reviews widget — *when a real Google Business Profile exists*
- [ ] cannaworldnews: CMS migration off in-repo markdown — *only if editorial volume outgrows Git workflow*
- [ ] All: real custom-domain cutover, real Stripe/Formspree keys — *post-build user step per PROJECT.md*

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Cross-cutting prerender + portability + design systems | HIGH | MEDIUM | P1 |
| vfamigos grid/PDP/cart/Stripe/thanks chain | HIGH | MEDIUM | P1 |
| vfamigos character bios + rarity/season | HIGH | MEDIUM | P1 |
| lipool click-to-call + quote LeadForm | HIGH | LOW | P1 |
| lipool services/gallery/trust/service-area + schema | HIGH | MEDIUM | P1 |
| lidentist directory + detail + review cards + appt form | HIGH | MEDIUM | P1 |
| lidentist Dentist/Review/AggregateRating schema | HIGH | MEDIUM | P1 |
| cannaworldnews articles/routes/marked/editorial layout | HIGH | MEDIUM | P1 |
| cannaworldnews NewsArticle schema + OG per article | HIGH | LOW | P1 |
| cannaworldnews RSS feed | MEDIUM | LOW | P2 |
| lipool service-guarantee + FAQ + case studies | MEDIUM | LOW | P2 |
| lidentist filter/sort + per-town landing pages | MEDIUM | MEDIUM | P2 |
| vfamigos wishlist + season landing + video embeds | MEDIUM | MEDIUM | P2 |
| cannaworldnews tags + newsletter + region map | MEDIUM | MEDIUM | P2 |
| vfamigos set-completion gamification | LOW | HIGH | P3 |
| Third-party live-review widgets (lipool/lidentist) | MEDIUM | MEDIUM | P3 |
| CMS migration (cannaworldnews) | LOW | HIGH | P3 |

**Priority key:** P1 = must have for launch · P2 = should have, add when possible · P3 = future consideration

---

## Competitor / Reference Feature Analysis

| Feature | Reference (VeeFriends / typical LI contractor / dentist directory / news site) | Our Static Approach |
|---------|-------------------------------------------------------------------------------|---------------------|
| Checkout (ecom) | Full Shopify/custom cart + hosted checkout | Cart in localStorage → **Stripe Payment Links** (Stripe hosts secure checkout) |
| Rarity/scarcity | VeeFriends "Seasons, never reprinted" | Static season/edition data + "retired/sold-out" flags |
| Character storytelling | QR → 3D animated short films | Character bio pages + embedded (not self-hosted) video |
| Lead capture (service) | Server-backed form + CRM | Formspree-style external `FORM_ENDPOINT` + honeypot + progressive enhancement |
| Reviews (directory) | Yelp/Google user-submitted + moderation backend | Curated seeded review data, visibly on-page (keeps schema legitimate) |
| Booking | Practice-management / Calendly integrations | Appointment **request** form → human follow-up (no fake availability) |
| News publishing | WordPress/CMS + comments + ad stack | In-repo markdown + `marked`, RSS, NewsArticle schema; no CMS/comments in v1 |
| Local SEO | GBP + `LocalBusiness`/`Dentist` schema | Specific subtype schema, `areaServed`, consistent NAP, no faked ratings |

---

## Sources

- VeeFriends — [veefriends.com](https://veefriends.com/), [shop.veefriends.com](https://shop.veefriends.com/), [Collectibles guide](https://blog.veefriends.com/what-is-veefriends-guide-8c5883efe51b) (seasons/rarity, character storytelling, trait model) — HIGH
- [Conversion Rate Optimization for Service Businesses 2026 — bspkn](https://www.bspkn.co/insights/conversion-rate-optimization-service-businesses-2026/) (click-to-call, 3-field forms, trust signals, <2.5s load) — MEDIUM
- [Why Every Contractor Needs a Website in 2026 — contractorgrowth.io](https://contractorgrowth.io/contractor-website-2026/) (contractor table stakes, licensed/bonded/insured) — MEDIUM
- [Website Trust Signal Statistics 2026 — scalify.ai](https://www.scalify.ai/blog/website-trust-signal-statistics-what-makes-visitors-stay-2026) — MEDIUM
- [Local Business Schema Markup 2026 Guide — zumeirah](https://zumeirah.com/local-business-schema-markup-2026-ultimate-guide/), [schema.org/LocalBusiness](https://schema.org/LocalBusiness), [Schema Markup for Local Business 2026 — TheBomb](https://thebomb.ca/blog/schema-markup-local-business-2026/) (specific subtypes, areaServed, NAP, spammy-structured-data filter) — HIGH
- [Google — Article structured data docs](https://developers.google.com/search/docs/appearance/structured-data/article), [Google Publisher Center — article page best practices](https://support.google.com/news/publisher-center/answer/9607104?hl=en), [Structured Data for News Publishers — Barry Adams / SEO for Google News](https://www.seoforgooglenews.com/p/structured-data-for-news-publishers) (NewsArticle, visible date/time, publisher logo, author entity/E-E-A-T) — HIGH
- [How to Optimize for News Results 2026 — topicalmap.ai](https://topicalmap.ai/blog/auto/how-to-optimize-for-news-results-2026-guide) — MEDIUM
- Project constraints — `.planning/PROJECT.md` (static hosting, Stripe Payment Links, Formspree-style endpoints, no fake success, no CMS, original vfamigos brand) — HIGH

---
*Feature research for: four static SvelteKit sites (collectibles ecom / pool contractor lead-gen / dentist review directory / cannabis news)*
*Researched: 2026-07-06*
</content>
</invoke>
