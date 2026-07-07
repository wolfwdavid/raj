# Stack Research

**Domain:** Static multi-site monorepo — collectibles e-commerce + local lead-gen + editorial news, SvelteKit 2 / Svelte 5 prerendered to GitHub Pages
**Researched:** 2026-07-06
**Confidence:** HIGH (core versions verified against npm registry; integration patterns verified against official SvelteKit/Stripe docs + multiple ecosystem sources)

> Scope note: the core stack is **user-approved and fixed** (SvelteKit 2, Svelte 5 runes, adapter-static, Vite 8, TypeScript 6, one package.json per site, no `svelte.config.js`, GitHub Pages). This research **validates current versions** and prescribes the **supporting stack around it**: checkout, lead forms, markdown, images, and SEO. No fixed choice is challenged.

---

## Recommended Stack

### Core Technologies (FIXED — versions validated 2026-07-06)

| Technology | Version | Purpose | Why Recommended / Validation |
|------------|---------|---------|------------------------------|
| `svelte` | `^5.56` (latest 5.56.4) | UI framework, runes reactivity | Matches fixed stack. `latest` dist-tag = 5.56.4. Runes (`$state`/`$derived`/`$props`) are the current idiom; use them for the localStorage cart. |
| `@sveltejs/kit` | `^2.63` (latest 2.69.1) | App framework / router / prerender | Matches fixed stack. `latest` = 2.69.1 — a `^2.63` range floats up to it cleanly. Kit 3 exists only as `next` (3.0.0-next.6); **do not** adopt. |
| `@sveltejs/adapter-static` | `^3` (latest 3.0.10) | Prerender whole site to static files for Pages | Matches fixed stack. The only correct adapter for GitHub Pages. Do NOT use `adapter-auto`. |
| `vite` | `^8` (latest 8.1.3) | Build tool / dev server | Matches fixed stack. Kit config lives inline here (no `svelte.config.js`). Vite 8 is current `latest`. |
| `typescript` | `^6` (latest 6.0.3) | Types | Matches fixed stack. TS 6.0.3 is `latest`. |
| `@sveltejs/vite-plugin-svelte` | `^6` or `^7` (transitive via Kit) | Svelte compilation in Vite | Ships with Kit 2 on Vite 8 (v7 line). Called out because `enhanced-img` peer-depends on it (see Version Compatibility). |

**Per-site prerender contract (from PROJECT.md constraints — enforce in every `+layout.ts`):**
```ts
export const prerender = true;
export const trailingSlash = 'always';
// NEVER: export const ssr = false;  ← breaks real HTML for SEO sites (raj_one mistake)
```

### Supporting Libraries — by site concern

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `marked` | `^18` (18.0.5) | Markdown → HTML for cannaworldnews articles | **cannaworldnews only.** Pure ESM, Node ≥20, zero-config — runs fine during Node prerender. Chosen over mdsvex specifically because it needs **no `svelte.config.js`** (fixed-stack constraint). |
| `gray-matter` | `^4` (4.0.3) | Parse `region`/`title`/`date` frontmatter from `.md` | **cannaworldnews only.** De-facto standard frontmatter parser. Pair with `import.meta.glob('...*.md', { query: '?raw', import: 'default' })` to load articles at build time. |
| `@sveltejs/enhanced-img` | `^0.11` (0.11.0) | Build-time responsive/AVIF/WebP images | **Optional, recommended for vfamigos product grid + cannaworldnews hero art.** Add `enhancedImages()` to `vite.config.ts` plugins **before** `sveltekit()`. Static images only (see limitation below). |
| `isomorphic-dompurify` | `^3` (3.18.0) | Sanitize rendered markdown HTML | **cannaworldnews, optional.** Content is author-authored/trusted (in-repo), so sanitization is defense-in-depth, not required. Use this variant (not bare `dompurify`) because it works in the Node prerender pass where there's no browser DOM. |

**SEO / meta:** Recommend a **hand-rolled `<Seo>` component** using `<svelte:head>` (zero dependencies) over a library — see "What NOT to Use" and the SEO pattern below. `svelte-meta-tags@^5` (5.0.1, `peer: svelte ^5.0.0`) is the acceptable library alternative if the team prefers structured JSON-LD helpers.

### Integration Services (external — real-ready stubs, no keys committed)

| Concern | Service | Why | Stub shape |
|---------|---------|-----|-----------|
| Checkout (vfamigos) | **Stripe Payment Links** | Pre-created hosted URLs — **fully static-compatible** (no server/API call at runtime, unlike Stripe Checkout Session API). Per-product link string dropped into `config.ts`. | `PAYMENT_LINKS: Record<sku, 'https://buy.stripe.com/xxx'>` placeholder; `/thanks/` set as the link's after-payment redirect. No fake success state. |
| Lead forms (lipool, lidentist) | **Formspree** (primary) | Standard HTML-form backend; native `<form action={FORM_ENDPOINT} method="POST">` works with **zero JS** (progressive enhancement) and upgrades with `fetch` when JS is present. | `FORM_ENDPOINT` in `config.ts`, overridable via `VITE_FORM_ENDPOINT`; `_gotcha` honeypot field. Duplicated `LeadForm.svelte` per site (workspaces are out of scope). |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `svelte-check` | Type/a11y diagnostics for `.svelte` | Ships in `create-svelte` scaffolds; run in CI per site matrix leg. |
| `@sveltejs/enhanced-img` (dev role) | Image transform at build | Requires `sharp` (auto-installed). Adds build time; worth it for the ecom grid. |
| `prettier` + `prettier-plugin-svelte` | Format | Optional but keeps 4 sites consistent. |
| Vite `import.meta.glob` | Build-time content loading | No library — native Vite. The idiomatic way to enumerate markdown articles and generate `entries()` for `/articles/[slug]/`. |

---

## Installation

```bash
# Per SITE (run inside each site folder — independent package.json, no workspaces)

# Core (fixed stack) — scaffold usually provides these
npm install -D @sveltejs/kit@^2.63 @sveltejs/adapter-static@^3 \
  svelte@^5.56 vite@^8 typescript@^6 svelte-check

# --- vfamigos (ecom): images only; Stripe Payment Links need NO package ---
npm install -D @sveltejs/enhanced-img@^0.11

# --- lipool / lidentist (lead-gen): NO package — native <form> + Formspree endpoint ---

# --- cannaworldnews (editorial): markdown pipeline ---
npm install marked@^18 gray-matter@^4
npm install -D @sveltejs/enhanced-img@^0.11        # optional, hero images
npm install isomorphic-dompurify@^3                # optional, sanitize author markdown
```

---

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Stripe Payment Links | **Snipcart** | If vfamigos needs a real cart-with-server-validated-pricing, inventory, discount codes, or abandoned-cart recovery. Snipcart is JAMstack-native but costs ~2% on top of gateway fees and adds a runtime script — overkill for a placeholder-driven v1. |
| Stripe Payment Links | Stripe Checkout **Session API** | Only if you add a serverless function. **Out of scope** — GitHub Pages is static; Session API needs a server. |
| Formspree | **Web3Forms** | Most generous free tier (250 subs/mo, no account, access-key only). Good if you want zero-signup; downside: no webhooks, 30-day retention on free. |
| Formspree | **FormSubmit** | HTML-purist, no signup at all, webhooks on free tier. Good for throwaway/demo. Because the endpoint is just a config string, swapping Formspree↔Web3Forms↔FormSubmit is a one-line change — keep the `LeadForm` service-agnostic. |
| `marked` | **mdsvex** | Only if articles need embedded Svelte components. **Rejected** — mdsvex requires a preprocessor registered in `svelte.config.js`, violating the fixed no-`svelte.config.js` constraint. |
| `marked` | **markdown-it** | If you need a rich plugin ecosystem (footnotes, containers). `marked` is lighter and sufficient for editorial articles. |
| Hand-rolled `<Seo>` | `svelte-meta-tags@^5` | If you want typed OpenGraph/Twitter/JSON-LD structured-data helpers out of the box (good for the news site's article schema). Adds a dependency; the hand-rolled component is ~40 lines and dependency-free. |
| `gray-matter` | `front-matter@^4` | Leaner (fewer transitive deps) if frontmatter stays simple. `gray-matter` chosen for ecosystem familiarity and YAML flexibility. |
| `@sveltejs/enhanced-img` | `vite-imagetools@^10` | If you need finer-grained transform directives. `enhanced-img` is the first-party SvelteKit wrapper and simpler; prefer it. |

---

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@sveltejs/adapter-auto` | Guesses the platform; on Pages it won't reliably produce a pure static export. | `@sveltejs/adapter-static` (fixed). |
| `export const ssr = false` | Documented fleet gotcha — ships an empty HTML shell, killing SEO for lead-gen and news sites. | `prerender = true` (real HTML at build time). |
| **mdsvex** | Requires a Svelte preprocessor in `svelte.config.js` — directly breaks the fixed "config inline in `vite.config.ts`, no `svelte.config.js`" constraint. | `marked` + `gray-matter`. |
| Stripe **Checkout Session / PaymentIntents API** | Needs a server call at checkout time — impossible on static Pages. | Stripe **Payment Links** (pre-created hosted URLs). |
| Root-absolute asset paths (`/img/x.png`, `<img src="/logo.svg">`) | Break under the `/raj/<site>/` BASE_PATH and again on custom-domain cutover. | Vite asset **imports** (`import logo from '$lib/logo.svg'`) or `{base}`-prefixed URLs — Vite rewrites imports to respect `paths.base` automatically. |
| Dynamic `src` with `<enhanced:img>` | enhanced-img transforms at build time only; a runtime/dynamic `src` yields an empty image. | Static Vite imports for enhanced images; plain `<img>` (with `{base}` or imported src) for anything dynamic. |
| `npm` **workspaces** / shared packages | Explicitly out of scope — couples the four sites and blocks clean per-domain repo extraction. | Independent `package.json` + duplicated `LeadForm`/`config` (~100 lines is acceptable). |
| Bare `dompurify` in the markdown pipeline | No DOM during Node prerender → throws. | `isomorphic-dompurify` (or skip; content is trusted). |

---

## Stack Patterns by Variant

**If site is vfamigos (e-commerce):**
- Svelte 5 runes `$state` cart persisted to `localStorage` (client-only; guard with `browser` from `$app/environment`).
- Product data as typed TS array; product pages via `entries()` in `+page.ts` for prerender.
- Checkout = link out to `PAYMENT_LINKS[sku]`; success = Stripe's redirect to `/thanks/`. No client-side "order placed" fabrication.
- `@sveltejs/enhanced-img` for the product grid (AVIF/WebP + intrinsic sizing = no layout shift, faster LCP).

**If site is lipool / lidentist (lead-gen):**
- `<form method="POST" action={FORM_ENDPOINT}>` first; enhance with `fetch` for inline success without navigation.
- Honeypot field (`_gotcha` / hidden input) for spam; no CAPTCHA needed at this scale.
- lidentist directory + `/dentist/[slug]/` detail via typed data + `entries()`.
- Duplicate the `LeadForm.svelte` + `config.ts` between the two sites (no shared package).

**If site is cannaworldnews (editorial):**
- `import.meta.glob('$lib/articles/*.md', { query: '?raw', import: 'default', eager: true })` → build the article index.
- `gray-matter` splits `region`/`title`/`date` frontmatter; `marked.parse(body)` renders HTML; inject via `{@html ...}`.
- Generate `entries()` for `/articles/[slug]/` and `/region/[region]/` from the glob keys so prerender covers every route.
- Optional `isomorphic-dompurify` pass on the rendered HTML.

**SEO pattern (all four sites — prerendered = real crawlable HTML):**
- Reusable `<Seo title description image canonical>` writing `<title>`, `<meta name="description">`, OpenGraph + Twitter tags via `<svelte:head>`.
- OG/canonical URLs must be **absolute** → drive them from a configurable `SITE_URL` (e.g. `VITE_SITE_URL`) that differs between `wolfwdavid.github.io/raj/<site>/` and the future custom domain. Do **not** hardcode.
- Add `<link rel="canonical">` per page and a build-time `sitemap.xml` (emit via a prerendered `+server.ts` or a static file) — cheap wins for the news + lead-gen SEO goals.

---

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `@sveltejs/enhanced-img@0.11` | `vite ^6.3 \|\| >=7`, `svelte ^5`, `@sveltejs/vite-plugin-svelte ^6 \|\| ^7` | **Verified peers.** Vite 8 satisfies `>=7`; Kit 2 on Vite 8 brings vite-plugin-svelte v7 → compatible. Must load `enhancedImages()` **before** `sveltekit()` in the plugins array. |
| `marked@18` | Node ≥ 20 | Pure ESM (`"type":"module"`). Runs in the Node prerender pass. `marked` no longer sanitizes — pair with DOMPurify if untrusted content (here it's trusted). |
| `svelte-meta-tags@5` | `svelte ^5.0.0` | Peer verified — Svelte 5 ready if chosen over the hand-rolled component. |
| `gray-matter@4` | Any Node; pulls `js-yaml@3` | Older transitive `js-yaml` but battle-tested and build-only (never shipped to client). |
| `@sveltejs/kit@2.69` | `svelte ^5`, `vite ^8` | Current `latest`; a `^2.63` range resolves up to it. Kit `3.x` is `next`-only — avoid. |

---

## Sources

- npm registry (`npm view`) — **HIGH**: verified `latest` for svelte 5.56.4, @sveltejs/kit 2.69.1, adapter-static 3.0.10, vite 8.1.3, typescript 6.0.3, marked 18.0.5, gray-matter 4.0.3, @sveltejs/enhanced-img 0.11.0, svelte-meta-tags 5.0.1, isomorphic-dompurify 3.18.0; and peerDependencies for enhanced-img and svelte-meta-tags.
- SvelteKit official docs — Images (`https://svelte.dev/docs/kit/images`) & adapter-static (`https://svelte.dev/docs/kit/adapter-static`) — **HIGH**: enhanced-img build-time/static-only constraint, plugin ordering, prerender-to-`build` behavior.
- Snipcart blog / StackShare — Stripe Checkout vs Snipcart (`https://snipcart.com/blog/stripe-checkout-form-integration-vs-snipcart`) — **MEDIUM**: confirmed Stripe Checkout *API* needs a server (hence Payment Links for static), Snipcart is the JAMstack cart alternative and its cost model.
- Un-static / splitforms / Web3Forms comparisons (`https://un-static.com/alternative/formspree/`, `https://splitforms.com/blog/web3forms-vs-formspree-vs-splitforms`) — **MEDIUM**: 2026 free-tier limits for Formspree, Web3Forms (250/mo), FormSubmit; endpoint-swappable pattern.
- PROJECT.md + pre-approved plan constraints — **HIGH**: no-`svelte.config.js`, no-workspaces, prerender contract, BASE_PATH portability, integration-stub requirements.

---
*Stack research for: static SvelteKit multi-site monorepo (ecom + lead-gen + editorial) on GitHub Pages*
*Researched: 2026-07-06*
