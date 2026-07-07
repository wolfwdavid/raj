# Architecture Research

**Domain:** Multi-site static SvelteKit monorepo → single GitHub Pages deployment
**Researched:** 2026-07-06
**Confidence:** HIGH

> Scope note: The macro-architecture is pre-approved (see `.planning/PROJECT.md` Key Decisions and
> `~/.claude/plans/eager-questing-parasol.md`). This document **validates** that architecture against the
> proven `raj_one` reference implementation and current (2026) SvelteKit / GitHub Pages behavior, then
> **elaborates** the parts left open: per-site layering, data flow, build order, and a robust assemble job.
> Ground truth: `raj/raj_one/` (a working single-site instance of this exact toolchain, nested + gitignored).

---

## Standard Architecture

### System Overview

The system is three nested scopes: the **repo** (CI + hub), the **four sites** (independent SvelteKit apps),
and **within each site** a routes → lib → data layering. The only shared surface between sites is the CI
pipeline and the hub index — there is deliberately **no shared code** (no workspaces).

```
┌──────────────────────────────────────────────────────────────────────┐
│                     REPO SCOPE  (wolfwdavid/raj)                       │
│  .github/workflows/deploy.yml   +   pages-root/ (hub index, 404)       │
├──────────────────────────────────────────────────────────────────────┤
│                  SITE SCOPE  (4 independent SvelteKit apps)            │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌────────────────────┐  │
│  │ vfamigos  │  │  lipool   │  │ lidentist │  │  cannaworldnews    │  │
│  │  (ecom)   │  │ (leadgen) │  │ (leadgen) │  │   (editorial)      │  │
│  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────────┬──────────┘  │
│        │              │              │                  │             │
│  each = own package.json · lockfile · vite.config.ts · src/ · static/ │
├──────────────────────────────────────────────────────────────────────┤
│                 IN-SITE SCOPE  (layering, per app)                    │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  routes/    +page.svelte, +layout.ts (prerender/trailingSlash)  │  │  presentation
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  lib/       components (LeadForm, cards), config.ts, cart store  │  │  logic / UI
│  ├────────────────────────────────────────────────────────────────┤  │
│  │  lib/data/  products.ts · dentists.ts · content/*.md (glob)      │  │  data
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **CI pipeline** (`deploy.yml`) | Build all 4 sites in a matrix, assemble one `_site/`, deploy once | GitHub Actions: matrix `build` job → single `assemble`/`deploy` job |
| **Hub index** (`pages-root/`) | Landing page at `/raj/` linking to the four sub-sites; shared `404.html` | Committed static HTML (no build step) |
| **Site app** (×4) | A self-contained SvelteKit static app owning its own deps, config, design system | `adapter-static`, inline Kit config in `vite.config.ts`, `paths.base` from `BASE_PATH` |
| **routes/** | URL structure, page composition, prerender directives | `+page.svelte`, `+page.ts` (`entries()`), root `+layout.ts` (`prerender`, `trailingSlash`) |
| **lib/ components** | Reusable UI: `LeadForm`, product/review/article cards, nav/footer | `.svelte` components importing from `lib/data` and `config.ts` |
| **lib/config.ts** | Per-site tunables: Stripe Payment Link URLs, `FORM_ENDPOINT`, brand strings | Plain TS constants, overridable by `VITE_*` env |
| **lib/data/** | Typed content: `products.ts`, `dentists.ts`, markdown articles | Typed arrays/interfaces + `import.meta.glob` for markdown |
| **cart store** (vfamigos only) | Cart state + localStorage persistence | Svelte 5 runes in a `.svelte.ts` module |

---

## Recommended Project Structure

### Repo layout

```
raj/
├── .github/workflows/deploy.yml   # matrix build → assemble → single deploy
├── pages-root/                    # committed, NOT built
│   ├── index.html                 # hub linking /raj/vfamigos/ etc.
│   └── 404.html                   # single shared fallback for the whole /raj/ tree
├── vfamigos/                      # ┐
├── lipool/                        # ├ four independent SvelteKit apps
├── lidentist/                     # │  (each has its own package.json + lockfile)
└── cannaworldnews/                # ┘
```

### Per-site layout (elaborated — this is the part PROJECT.md left open)

```
<site>/
├── package.json                   # independent deps + lockfile (no workspaces)
├── vite.config.ts                 # inline Kit config; paths.base = BASE_PATH; NO svelte.config.js
├── tsconfig.json
├── static/                        # robots.txt, favicon, OG images (Vite copies verbatim)
└── src/
    ├── routes/
    │   ├── +layout.ts             # export const prerender = true; trailingSlash = 'always'
    │   ├── +layout.svelte         # nav + footer shell, {base}-prefixed links
    │   ├── +page.svelte           # home
    │   └── <feature>/[param]/     # e.g. product/[slug], dentist/[id], articles/[slug]
    │       ├── +page.ts           #   export function entries() { … }  (explicit — required)
    │       └── +page.svelte
    └── lib/
        ├── config.ts              # Stripe links / FORM_ENDPOINT / brand — VITE_* overridable
        ├── data/
        │   ├── products.ts        # typed data (vfamigos)
        │   ├── dentists.ts        # typed data (lidentist)
        │   └── content/*.md       # markdown articles (cannaworldnews), read via import.meta.glob
        ├── cart.svelte.ts         # runes store + localStorage (vfamigos only)
        └── components/            # LeadForm.svelte, cards, etc.
```

### Structure Rationale

- **Independent `package.json` per site (validated):** confirmed against `raj_one` — it is a complete standalone
  SvelteKit app. Keeping each site whole means any folder can be `git subtree split` into its own per-domain repo
  later with zero refactor. Workspaces would hoist `node_modules` and couple versions, defeating that goal.
- **Inline Kit config in `vite.config.ts`, no `svelte.config.js` (validated):** `raj_one/vite.config.ts` proves the
  pattern — `sveltekit({ adapter, paths, compilerOptions })` directly. This is the reason the project chose
  `marked` over `mdsvex`: mdsvex requires `svelte.config.js`, which would break this single-config convention.
- **`lib/data/` separate from `lib/components/`:** data is pure typed values (build-time constants); components are
  presentation. Prerendering reads data at build; keeping it isolated makes `entries()` trivial to derive.
- **`pages-root/` is committed, not built:** the hub is plain HTML with no framework — building it would add a 5th
  app for ~1 page. Committing it means the assemble job just copies it in.

---

## Architectural Patterns

### Pattern 1: One Pages deployment, many sites (matrix → assemble → single deploy)

**What:** GitHub allows exactly **one** Pages deployment per repo. So you cannot call `upload-pages-artifact`
per site. Build each site in a **matrix** producing plain artifacts, then a single downstream job assembles them
under subpaths and does **one** `upload-pages-artifact` + `deploy-pages`.

**When to use:** Any time N static apps must share one `github.io/<repo>/` origin.

**Trade-offs:** (+) one atomic deploy, shared 404, one hub. (−) all-or-nothing deploy (a single site failing the
build fails the whole deploy — mitigate with `fail-fast: false` so you at least see all failures).

**Critical distinction from the `raj_one` single-site workflow:** `raj_one` uses `upload-pages-artifact@v3`
directly because it's one site. The monorepo must use **`actions/upload-artifact@v4` with unique names** in the
matrix, and reserve the single `upload-pages-artifact` for the assemble job.

```yaml
jobs:
  build:
    strategy:
      fail-fast: false                       # see all site failures, not just the first
      matrix:
        site: [vfamigos, lipool, lidentist, cannaworldnews]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm, cache-dependency-path: ${{ matrix.site }}/package-lock.json }
      - run: npm ci
        working-directory: ${{ matrix.site }}
      - run: npm run build
        working-directory: ${{ matrix.site }}
        env:
          BASE_PATH: /${{ github.event.repository.name }}/${{ matrix.site }}   # e.g. /raj/vfamigos
      - uses: actions/upload-artifact@v4      # NOT upload-pages-artifact — unique name per site
        with:
          name: site-${{ matrix.site }}
          path: ${{ matrix.site }}/build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: { name: github-pages, url: '${{ steps.deployment.outputs.page_url }}' }
    steps:
      - uses: actions/checkout@v4             # to get pages-root/
      - uses: actions/download-artifact@v4    # downloads ALL site-* artifacts
        with: { path: _artifacts }            # NOTE: nests each under _artifacts/site-<name>/
      - name: Assemble _site
        run: |
          set -euo pipefail
          mkdir -p _site
          cp pages-root/index.html _site/index.html
          cp pages-root/404.html   _site/404.html
          for site in vfamigos lipool lidentist cannaworldnews; do
            test -d "_artifacts/site-$site" || { echo "::error::missing build for $site"; exit 1; }
            mkdir -p "_site/$site"
            cp -r "_artifacts/site-$site/." "_site/$site/"
          done
      - uses: actions/configure-pages@v5      # enablement:true only if first-enable succeeds; see gotcha
      - uses: actions/upload-pages-artifact@v3
        with: { path: _site }
      - id: deployment
        uses: actions/deploy-pages@v4
```

### Pattern 2: Prerender-everything with explicit `entries()` (validated, with one correction)

**What:** Every route is statically generated at build time. Root `+layout.ts` sets `prerender = true` and
`trailingSlash = 'always'`; dynamic routes (`[slug]`, `[id]`, `[region]`) export `entries()` so the crawler knows
every path to emit.

**When to use:** SEO-facing sites (all four here). Static pages = real HTML for crawlers + instant loads.

**⚠️ Correction to the reference:** `raj_one/src/routes/+layout.ts` sets `ssr = false` (it's a JS dashboard).
**Do NOT copy that.** The raj SEO sites must leave SSR at its default (on) so prerender emits fully-rendered HTML.
`ssr = false` would ship empty shells that only fill in via client JS — invisible to crawlers. This is the exact
gotcha flagged in PROJECT.md Context.

**Why `trailingSlash = 'always'` is load-bearing:** GitHub Pages serves `/a/index.html` for a request to `/a/`
but does **not** rewrite `/a` → `/a.html`. `'always'` makes SvelteKit emit `a/index.html`, which Pages serves
correctly. Verified against current adapter-static docs.

```typescript
// src/routes/+layout.ts   (every site)
export const prerender = true;
export const trailingSlash = 'always';
// (do NOT set ssr = false)

// src/routes/product/[slug]/+page.ts
import { products } from '$lib/data/products';
export function entries() {
  return products.map((p) => ({ slug: p.slug }));   // explicit — the crawler needs the full list
}
```

### Pattern 3: Single shared `404.html`, enabled by prerender-completeness

**What:** One `pages-root/404.html` at the artifact root serves as the fallback for the entire `/raj/` tree.

**When to use:** When every real route is prerendered (as here), so 404 is only hit by genuinely bad URLs.

**Trade-offs / why this is correct here:** GitHub Pages serves exactly **one** `404.html` from the site root — you
cannot give each sub-site its own SPA fallback under one deployment. Normally that would be a problem (SvelteKit's
`fallback` option produces a per-app SPA shell). But because all four sites use **`fallback` = none + full
prerender**, there are no unknown dynamic routes needing a client-side SPA fallback. The single hub-styled 404 is
therefore the robust choice. **This makes "prerender everything + explicit `entries()`" load-bearing, not just a
preference** — if any site later needs runtime/SPA routes, the single-404 model breaks and you'd need per-app
handling the one-deployment constraint can't cleanly provide.

### Pattern 4: Config-as-integration-seam (real-ready stubs)

**What:** Every external service (Stripe Payment Links, Formspree-style form endpoint) is referenced only through
`lib/config.ts` constants, overridable by `VITE_*` env vars at build. No fake success states.

**When to use:** When you want to ship domain-ready and wire real keys later as a pure config edit.

```typescript
// src/lib/config.ts
export const STRIPE_PAYMENT_LINK = import.meta.env.VITE_STRIPE_LINK ?? 'https://buy.stripe.com/test_PLACEHOLDER';
export const FORM_ENDPOINT       = import.meta.env.VITE_FORM_ENDPOINT ?? 'https://formspree.io/f/PLACEHOLDER';
```

The LeadForm posts natively to `FORM_ENDPOINT` (works without JS via progressive enhancement) plus a honeypot
field; checkout is an `<a href={STRIPE_PAYMENT_LINK}>` — no fake "order confirmed" UI.

---

## Data Flow

### Build-time flow (this is a static site — the important flow is at build, not request)

```
Typed data (products.ts / dentists.ts / content/*.md)
        │  imported by
        ▼
+page.ts entries()  ──►  SvelteKit prerender crawler  ──►  <site>/build/**/index.html
        │                                                        │
        │  BASE_PATH=/raj/<site> baked into every {base} link    │
        ▼                                                        ▼
   config.ts constants                                   matrix artifact  (site-<name>)
                                                                 │
                                                    assemble job places under _site/<site>/
                                                                 │
                                              _site/  = hub index + 404 + 4 site trees
                                                                 │
                                             upload-pages-artifact → deploy-pages (once)
```

### Runtime (client) flow — minimal, per site

```
vfamigos cart:
  [Add to cart] → cart.svelte.ts ($state rune) → $effect persists to localStorage
                                              └─► reactive cart UI updates
  [Checkout]    → <a href={STRIPE_PAYMENT_LINK}>  (leaves the static site entirely)

lipool / lidentist lead form:
  [Submit] → native <form method="POST" action={FORM_ENDPOINT}> + honeypot
           → external form service → redirect/thanks   (works with JS disabled)

cannaworldnews:
  static prerendered article HTML; region filter navigates to prerendered /region/[region]/
```

### State management (vfamigos cart)

```
localStorage ──(init)──► $state cart ──($effect)──► localStorage
                              ▲   │
                    add/remove│   │subscribe (runes auto-reactivity)
                              │   ▼
                          components (grid, cart drawer, badge count)
```

### Key Data Flows

1. **Content → static HTML:** typed data / markdown are imported by routes; `entries()` enumerates dynamic paths;
   the prerender crawler emits one `index.html` per path. All content is resolved at build time.
2. **Markdown ingestion:** `import.meta.glob('$lib/data/content/*.md', { as: 'raw' })` (or `eager`) loads article
   bodies; frontmatter is parsed and `marked` renders HTML. No `svelte.config.js` / mdsvex needed.
3. **Base-path propagation:** `BASE_PATH=/raj/<site>` flows env → `paths.base` → every `{base}`-prefixed link and
   Vite-imported asset, guaranteeing zero hardcoded `/raj/` and custom-domain readiness.
4. **Artifact assembly:** four unique matrix artifacts → one downstream job → one `_site/` → one deployment.

---

## Suggested Build Order (dependency-driven)

The roadmap should sequence work so that the **deploy pipeline is proven end-to-end before content depth**, since
the whole-repo, single-deployment model is the highest-risk novel piece.

```
1. Repo skeleton + pipeline (walking skeleton)
   ├─ 1 trivial site folder (or all 4 as "hello") + pages-root hub + 404
   └─ deploy.yml matrix → assemble → deploy    ◄── prove single-deployment works FIRST
        depends on: nothing   │ de-risks: the one novel architectural element

2. Per-site shell (×4, parallelizable)
   ├─ package.json, vite.config.ts (paths.base), +layout.ts (prerender + trailingSlash, NO ssr:false)
   └─ nav/footer shell, design system tokens
        depends on: (1) for deploy target   │ each site independent → can be built in any order/parallel

3. Data + dynamic routes (per site)
   ├─ typed data (products/dentists) or markdown ingestion (articles)
   └─ [slug]/[id]/[region] routes + entries()
        depends on: (2) shell   │ entries() depends on data existing

4. Conversion paths (per site)
   ├─ vfamigos: runes cart + localStorage + Stripe link
   └─ lipool/lidentist: LeadForm + honeypot + FORM_ENDPOINT (duplicated)
        depends on: (3) data (cart needs products; forms need config.ts)

5. Custom-domain extraction (deferred, per PROJECT.md Out of Scope)
   └─ any site folder → own repo; drop BASE_PATH; add CNAME
        depends on: independent package.json (already true from step 2)
```

**Ordering rationale:** the single-deployment pipeline (step 1) is the only piece with no local-dev equivalent —
it can only be validated in CI, so validate it earliest against a minimal payload. Everything after is
conventional SvelteKit and is **per-site independent** (four parallel tracks), which maps naturally to
per-site roadmap phases.

---

## Anti-Patterns

### Anti-Pattern 1: `upload-pages-artifact` inside the matrix

**What people do:** Call `upload-pages-artifact` in each matrix leg, expecting them to combine.
**Why it's wrong:** Only one Pages artifact/deployment exists per repo; matrix legs overwrite/conflict, and
same-named artifacts silently clobber each other (verified: `actions/upload-artifact#24`).
**Do this instead:** `upload-artifact@v4` with a unique `name: site-<matrix.site>` in the matrix; a single
`upload-pages-artifact` in the assemble job.

### Anti-Pattern 2: Copying `ssr = false` from `raj_one`

**What people do:** Clone `raj_one`'s `+layout.ts` verbatim.
**Why it's wrong:** `ssr = false` ships an empty HTML shell hydrated only by JS — kills SEO for content sites.
**Do this instead:** `prerender = true` + `trailingSlash = 'always'`, leave `ssr` default (on). Flagged in PROJECT.md.

### Anti-Pattern 3: Hardcoded `/raj/` links or root-absolute assets

**What people do:** `<a href="/raj/vfamigos/product/x">` or `<img src="/logo.png">`.
**Why it's wrong:** breaks the moment the site moves to its own custom domain (base becomes `''`).
**Do this instead:** `{base}`-prefix every internal link; import assets through Vite so the base is rewritten.

### Anti-Pattern 4: Reaching for npm workspaces / a shared component package

**What people do:** Deduplicate `LeadForm`/`config` into a shared workspace package.
**Why it's wrong:** workspaces hoist `node_modules` and couple versions, destroying clean per-domain extraction —
the explicit reason PROJECT.md chose duplication (~100 lines) over sharing.
**Do this instead:** duplicate the ~100-line LeadForm/config between lipool and lidentist. Keep sites hermetic.

### Anti-Pattern 5: `download-artifact` without handling directory nesting

**What people do:** assume artifacts land flat in the target path.
**Why it's wrong:** `download-artifact@v4` nests each artifact under `<path>/<artifact-name>/` — flagged in
PROJECT.md fleet gotchas. Naive `cp` then misses files.
**Do this instead:** copy from `_artifacts/site-<name>/.` explicitly (as in the assemble script), and assert the
directory exists before copying so a missing build fails loudly.

### Anti-Pattern 6: `fail-fast: true` on the build matrix

**What people do:** leave matrix default (`fail-fast: true`).
**Why it's wrong:** one site's build error cancels the others, hiding whether the rest are healthy.
**Do this instead:** `fail-fast: false` — surface all four sites' status every run.

---

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| Stripe Payment Links | `<a href={STRIPE_PAYMENT_LINK}>` from `config.ts` | Static-safe (no SDK, no server); placeholder URL until real link pasted; `/thanks/` is the Stripe redirect target |
| Formspree-style form endpoint | native `<form method="POST" action={FORM_ENDPOINT}>` + honeypot | Progressive enhancement — posts without JS; no fake success UI |
| GitHub Pages | `configure-pages@v5` → `upload-pages-artifact@v3` → `deploy-pages@v4` | First-enable race: `enablement: true` may fail → fall back to Settings→Pages manual enable (PROJECT.md gotcha) |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| CI ↔ sites | env var (`BASE_PATH`) + build artifact | only coupling between repo scope and site scope |
| assemble job ↔ sites | filesystem (`_site/<site>/`) | sites never know about each other; assemble is the only integrator |
| routes ↔ lib/data | ES import at build time | data is pure constants; `entries()` reads it to enumerate paths |
| components ↔ config.ts | ES import | single seam for all external-service wiring |
| site ↔ site | **none (by design)** | zero shared code → clean future per-domain extraction |

---

## Scaling Considerations

This is static hosting; "scale" means content volume and site count, not concurrent users (GitHub Pages CDN
handles traffic).

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 4 sites / dozens of pages (now) | Current model is ideal; single matrix build < a few minutes |
| ~10 sites / hundreds of pages | Add matrix legs; consider `paths` filters so only changed sites rebuild (path-scoped CI); watch the 10-min-ish Pages build ceiling |
| Content-heavy (1000s of articles) | Prerender time grows linearly; move `import.meta.glob` to lazy/streamed reads; consider incremental content or a real CMS for cannaworldnews (currently Out of Scope) |
| Any site outgrows the shared origin | Extract that folder to its own repo + custom domain — already trivial thanks to independent `package.json` |

### Scaling Priorities

1. **First bottleneck:** total CI build time (all sites rebuild every push). Fix with path-filtered matrix so only
   changed site folders build.
2. **Second bottleneck:** cannaworldnews prerender time as article count grows. Fix with lazy markdown loading or,
   past v1, a CMS/pagination strategy.

---

## Sources

- `raj/raj_one/` — proven single-site reference (workflow, `vite.config.ts`, `package.json`, `+layout.ts`) — HIGH (ground truth)
- [SvelteKit adapter-static docs](https://svelte.dev/docs/kit/adapter-static) — `trailingSlash: 'always'`, `fallback: '404.html'`, `BASE_PATH` subpath — HIGH
- [actions/upload-artifact merge README](https://github.com/actions/upload-artifact/blob/main/merge/README.md) — v4 unique-name + merge model — HIGH
- [actions/upload-artifact#24](https://github.com/actions/upload-artifact/issues/24) — same-name artifacts clobber — MEDIUM
- [SvelteKit issue #7725](https://github.com/sveltejs/kit/issues/7725) — trailing-slash 404 behavior on direct load — MEDIUM
- [Managing GitHub Actions Artifacts (2026)](https://oneuptime.com/blog/post/2026-01-25-github-actions-artifacts/view) — matrix→merge deploy pattern — MEDIUM
- `.planning/PROJECT.md` + `~/.claude/plans/eager-questing-parasol.md` — pre-approved decisions & fleet gotchas — HIGH

---
*Architecture research for: multi-site static SvelteKit monorepo on GitHub Pages*
*Researched: 2026-07-06*
