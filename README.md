# raj — four-site Svelte monorepo

Four independent [SvelteKit](https://svelte.dev/) websites, each in its own folder, built and deployed together through a **single GitHub Pages deployment**.

**Live:** https://wolfwdavid.github.io/raj/

| Site | Path | Live URL | What it is |
|------|------|----------|------------|
| **Vfamigos** | [`vfamigos/`](vfamigos/) | [/raj/vfamigos/](https://wolfwdavid.github.io/raj/vfamigos/) | VeeFriends-style collectibles character e-commerce |
| **Lipool** | [`lipool/`](lipool/) | [/raj/lipool/](https://wolfwdavid.github.io/raj/lipool/) | Long Island pool-contractor lead generator |
| **Lidentist** | [`lidentist/`](lidentist/) | [/raj/lidentist/](https://wolfwdavid.github.io/raj/lidentist/) | Long Island dentist reviews + appointment lead generator |
| **CannaWorldNews** | [`cannaworldnews/`](cannaworldnews/) | [/raj/cannaworldnews/](https://wolfwdavid.github.io/raj/cannaworldnews/) | Cannabis news from around the world |

A static hub page ([`pages-root/index.html`](pages-root/index.html)) links all four; a shared 404 catches unknown URLs.

> `raj_one/` and `raj_two/` are **separate standalone repos** that happen to live in this directory. They are git-ignored (`raj_*/`) and are **not** part of this monorepo. Never `git add -f` them.

---

## Status

**v1 complete and live** (2026-07-07). All five roadmap phases shipped and verified. See [`.planning/ROADMAP.md`](.planning/ROADMAP.md) for the full phase history and [`tasks/todo.md`](tasks/todo.md) for the milestone review.

Built with [GSD](https://github.com/glamorous-toolkit/get-shit-done) (spec → research → plan → verify → execute per phase), a distinct [UI/UX Pro Max](.planning/design/) design system per site, and multi-agent orchestration. Every phase was adversarially plan-checked and verified against the live site.

---

## Architecture

- **Stack (identical per site):** SvelteKit 2 + Svelte 5 (runes) + `@sveltejs/adapter-static` + Vite 8 + TypeScript. All Kit config is inline in each site's `vite.config.ts` — there is **no `svelte.config.js`**. `paths.base` comes from the `BASE_PATH` env var.
- **Independent packages, no workspaces.** Each site has its own `package.json` + `package-lock.json`. This keeps a future per-domain extraction trivial (copy the folder to a new repo, set `BASE_PATH=''`).
- **Everything is prerendered.** Every route sets `prerender = true` and `trailingSlash = 'always'`; dynamic routes (`/products/[slug]`, `/dentists/[slug]`, `/articles/[slug]`, `/region/[region]`) export `entries()` so adapter-static emits a real `index.html` per record. No `ssr = false` anywhere — these are SEO sites and must ship real HTML.
- **Portable / custom-domain-ready.** Internal links use `{base}` from `$app/paths`; no hardcoded `/raj/`. Canonical/OG URLs derive from a per-site `SITE_URL` config knob (the future custom domain), **never** from `BASE_PATH`.
- **Imagery is CSS/SVG-generated** (character monograms, gallery tiles) — no binary assets, so nothing breaks under a base path.

### Deploy pipeline ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))

One workflow, three jobs:

1. **build** — a matrix over the four sites (`fail-fast: false`). Each leg runs `npm ci`, `svelte-check`, an empty-`BASE_PATH` build (custom-domain readiness), the real `BASE_PATH=/raj/<site>` build, a **portability guard** (fails on root-absolute `href`/`src`), **content/file-count assertions** (built page count == data-record count), and the **compliance gate** (below). Uploads each site's `build/` as `site-<name>`.
2. **assemble** — downloads all four artifacts, lays them out under `_site/<site>/`, copies the hub + 404 + `.nojekyll`, asserts exactly four `index.html`, and does the single `upload-pages-artifact`.
3. **deploy** — one `deploy-pages`.

### Compliance gate (CI, runs every push)

- **No fake success states** anywhere — a grep for fabricated confirmations (`order placed`, `payment successful`, `message sent`, …) fails the build. `/thanks/` is whitelisted because it's the *real* Stripe post-payment redirect target.
- **lidentist** sample-data label (`Sample data for demonstration`) must be present on the directory + every detail page (FTC Reviews Rule).
- **lipool** must **not** emit `aggregateRating` (no visible reviews → Google spam penalty).
- Every built page must have a non-empty `<title>`, meta description, and `https://` canonical.
- **cannaworldnews** must carry its informational-only disclaimer.

---

## Run a site locally

```bash
cd vfamigos            # or lipool / lidentist / cannaworldnews
npm install
npm run dev            # dev server
npm run check          # svelte-check (must be 0 errors)

# production-style build (Git Bash on Windows: prefix with MSYS_NO_PATHCONV=1)
BASE_PATH=/raj/vfamigos npm run build
npm run preview
```

---

## Integration stubs (real-ready — paste a key and go)

Nothing is faked. Each conversion path either does the real thing or visibly says it's not configured — never a simulated success.

| Site | File | Knob | What to paste |
|------|------|------|---------------|
| vfamigos | `vfamigos/src/lib/config.ts` | `STRIPE_PAYMENT_LINK` | A [Stripe Payment Link](https://stripe.com/payments/payment-links) URL. Set its post-payment redirect to `…/vfamigos/thanks/`. (Or `VITE_STRIPE_PAYMENT_LINK` at build time.) |
| lipool | `lipool/src/lib/config.ts` | `FORM_ENDPOINT` | A [Formspree](https://formspree.io/) / [Web3Forms](https://web3forms.com/) / FormSubmit endpoint URL (or `VITE_FORM_ENDPOINT`). |
| lidentist | `lidentist/src/lib/config.ts` | `FORM_ENDPOINT` | Same as lipool. |
| all four | `<site>/src/lib/config.ts` | `SITE_URL` | The real domain at custom-domain cutover (or `VITE_SITE_URL`). Defaults to the live Pages origin so canonical/OG resolve today. |

---

## v2 / follow-ups (out of v1 scope)

- Paste real Stripe Payment Links + form endpoints (see table above).
- **Custom-domain cutover** per site: extract the folder to its own repo, set `BASE_PATH=''`, set `SITE_URL` to the real domain, add a `CNAME`, and 301 from the github.io subpath.
- Real dentist data + real reviews for lidentist (removes the sample-data banner); real project photos for lipool.
- RSS feed + `sitemap.xml` (cannaworldnews), JSON-LD `NewsArticle`, generated `og:image`.
- Legal/regulatory review of the cannabis-news compliance posture before cutover.

---

## Repo map

```
raj/
├── .github/workflows/deploy.yml   # the one pipeline for all four sites
├── pages-root/                    # committed static hub + 404 + .nojekyll
├── vfamigos/  lipool/  lidentist/  cannaworldnews/   # the four sites
├── .planning/                     # GSD: PROJECT, ROADMAP, REQUIREMENTS, research, design, phases
├── tasks/                         # todo.md (review) + lessons.md (SvelteKit gotchas)
└── tools/                         # fleet scripts (unrelated raj_* repo tooling)
```

Gotchas worth reading before touching the build: [`tasks/lessons.md`](tasks/lessons.md).
