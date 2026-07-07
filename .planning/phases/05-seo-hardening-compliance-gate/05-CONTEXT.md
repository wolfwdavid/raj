# Phase 5: SEO Hardening + Compliance Gate - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning (FINAL phase of v1)

<domain>
## Phase Boundary

Make every site custom-domain-ready with correct SITE_URL-driven metadata, and clear the compliance blockers before any cutover. A hand-rolled Seo component gives every page a unique title + meta description + canonical + OG derived from a configurable per-site SITE_URL (NEVER BASE_PATH). cannaworldnews article pages add article:published_time + informational disclaimer. A final audit confirms no fake success states and all lidentist sample data stays unmistakably labeled (FTC gate). This is the LAST v1 phase — no new features, only metadata + compliance.

</domain>

<decisions>
## Implementation Decisions

### SITE_URL config (QUAL-04)
- **D-01:** Each site's `src/lib/config.ts` gains `SITE_URL: string` — the site's canonical origin (the FUTURE custom domain, e.g. `https://vfamigos.com`, `https://lipool.com`, `https://lidentist.reviews`, `https://cannaworldnews.com`), with `VITE_SITE_URL` build-time override. Until custom domains, a sensible default is the production GitHub Pages origin+base (e.g. `https://wolfwdavid.github.io/raj/vfamigos`) so canonical/OG URLs resolve NOW, but the value is a single config knob that flips to the real domain at cutover. CRITICAL: canonical/OG absolute URLs derive from SITE_URL, NOT from BASE_PATH — this is the whole point (BASE_PATH is the Pages subpath; SITE_URL is the indexable identity).

### Hand-rolled Seo component (QUAL-04, NEWS-04)
- **D-02:** A `Seo.svelte` component (duplicated per site, ~zero-dep, uses `<svelte:head>`) taking props `{ title, description, path, type?, publishedTime? }` and emitting: `<title>`, `<meta name="description">`, `<link rel="canonical" href={SITE_URL + path}>`, OG tags (`og:title`, `og:description`, `og:url` = SITE_URL+path, `og:type`, `og:site_name`), and Twitter card basics. Absolute URLs from SITE_URL+path. No external SEO library (keeps inline-config pattern; STACK.md recommended hand-rolled).
- **D-03:** Every page/route across all four sites sets a UNIQUE title + meta description via `<Seo ...>`: home pages, product/dentist/article/region dynamic pages (title from the record), static pages (cart/thanks/gallery/about/quote/appointment/how). Titles follow a per-site pattern (e.g. `<page> — Vfamigos`, `<article> — CannaWorldNews`). Dynamic pages compute title/description from their data.

### cannaworldnews article metadata (NEWS-04)
- **D-04:** Article pages emit `<meta property="article:published_time" content={ISO}>` (from frontmatter date) plus `og:type=article`, via the Seo component's `type`/`publishedTime` props. Canonical + og:url use SITE_URL. Front/region pages get appropriate og:type=website.

### cannaworldnews disclaimer (NEWS-05)
- **D-05:** Footer displays an informational-only disclaimer on every cannaworldnews page: news reporting, not legal or medical advice (e.g. "CannaWorldNews reports on cannabis policy and industry developments worldwide. Informational only — not legal or medical advice."). Phase 2/3 shipped a stub; Phase 5 finalizes the exact compliance copy. Visible in the footer, present in built HTML.

### Final compliance audit (compliance gate — the phase's defining deliverable)
- **D-06:** A final audit pass (documented, grep-driven) confirming across all built HTML:
  - NO fake success states anywhere (no fabricated "order placed"/"payment successful"/"thanks we got it"/"message sent"/"appointment booked"/"request received" — reuse Phase-4 negative grep, extend site-wide).
  - lidentist sample-data labeling INTACT on directory + every dentist detail page (FTC Reviews Rule gate — "Sample data for demonstration").
  - lipool JSON-LD still has NO aggregateRating.
  - cannaworldnews disclaimer present on every page; no health/legal claims in site voice.
  - Every page has a unique non-empty title + meta description; canonical/OG URLs are absolute and SITE_URL-derived (not BASE_PATH, not relative).
  - Add these as CI assertions in deploy.yml where feasible (title/description presence per built HTML, canonical present, disclaimer present, no-fake-success site-wide) so the gate is enforced on every future push, not just once.

### Portability preserved
- **D-07:** SITE_URL absolute URLs in OG/canonical are the ONLY absolute-origin URLs; internal navigation stays {base}-relative. The portability grep must not flag SITE_URL-based canonical/OG (they're intentional absolute URLs in `<head>`, not root-absolute nav `href`/`src`). Ensure the existing portability grep (which targets `href="/` `src="/` in body) doesn't false-positive on `<link rel="canonical" href="https://...">`.

### Claude's Discretion
- Exact title/description microcopy per page, OG image handling (may omit og:image for v1 or use a generated/site-color placeholder — no binary assets), exact disclaimer wording within the informational-only intent, Twitter card fields.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### SEO & compliance research
- `.planning/research/STACK.md` — hand-rolled `<Seo>` via `<svelte:head>` (zero-dep) recommended over svelte-meta-tags; SITE_URL (not BASE_PATH) for canonical/OG; absolute URLs required
- `.planning/research/PITFALLS.md` — subpath→custom-domain SEO trap (canonical MUST derive from SITE_URL/future domain, not throwaway github.io); FTC Reviews Rule (lidentist labeling); cannabis informational safe-harbor + disclaimer
- `.planning/research/FEATURES.md` — NewsArticle metadata (visible date, article:published_time), no aggregateRating without visible reviews (lipool)

### Prior phases (what to add metadata to + preserve)
- `.planning/phases/04-conversion-paths/04-VERIFICATION.md` — no-fake-success baseline to re-audit
- `.planning/phases/03-content-dynamic-routes/03-02-SUMMARY.md` — lidentist FTC sample-data banner (must stay intact)
- `<site>/src/lib/config.ts` — where SITE_URL joins STRIPE_PAYMENT_LINK/FORM_ENDPOINT
- `<site>/src/routes/**/+page.svelte` — every page needs a <Seo>
- `cannaworldnews/src/routes/articles/[slug]/+page.svelte` — article:published_time + og:type=article
- `cannaworldnews/src/lib/components/SiteFooter.svelte` — disclaimer finalization
- `.github/workflows/deploy.yml` — where the compliance CI assertions extend the existing build-leg gates

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- config.ts pattern (real-ready placeholder + VITE_ override) already used for STRIPE_PAYMENT_LINK/FORM_ENDPOINT — SITE_URL joins it identically.
- Phase-4 negative fake-success grep + Phase-3 FTC banner grep + lipool aggregateRating negative grep already exist in deploy.yml — Phase 5 consolidates/extends them into the compliance gate.
- cannaworldnews already has a disclaimer STUB (Phase 2/3) + article date in frontmatter/`<time>` — Phase 5 wires published_time meta + finalizes disclaimer copy.

### Established Patterns
- `<svelte:head>` for per-page head tags; duplicated-per-site component pattern (like LeadForm).
- SvelteKit relative asset paths + {base} nav — SITE_URL absolute URLs are ONLY in <head> canonical/OG.
- CI build-leg gates (svelte-check, portability, content, no-fake-success) — extend, don't fork.

### Integration Points
- Seo.svelte in each site's src/lib/components; imported by every +page.svelte. SITE_URL in each config.ts. Compliance assertions in deploy.yml build matrix leg.

</code_context>

<specifics>
## Specific Ideas

- The SEO story is custom-domain READINESS: one config knob (SITE_URL) per site flips from github.io to the real domain at cutover, and all canonical/OG follow. Do NOT bake BASE_PATH into indexable URLs.
- The compliance gate is the phase's reason to exist — it must be enforceable (CI), not a one-time manual check. FTC ($51,744/violation) and cannabis informational-safe-harbor are real liabilities.
- No binary OG images in v1 (no assets) — omit og:image or use a text/color placeholder; keep builds fast and portable.

</specifics>

<deferred>
## Deferred Ideas

- Custom-domain cutover (CNAME, 301 from github.io, per-domain repo extraction) → v2 (DOM-01); Phase 5 only makes it READY
- Real Stripe/Formspree keys → post-build user step (KEYS-01)
- RSS feed, sitemap.xml, JSON-LD Article/NewsArticle structured data, og:image generation → v2
- Real dentist data / real reviews (removes the sample-data banner) → v2 (CONT-01)

</deferred>

---

*Phase: 05-seo-hardening-compliance-gate*
*Context gathered: 2026-07-07*
