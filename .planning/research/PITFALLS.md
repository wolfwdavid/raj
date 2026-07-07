# Pitfalls Research

**Domain:** Static multi-site SvelteKit (Svelte 5 + adapter-static) monorepo on GitHub Pages, mixing e-commerce, lead-gen, and news content, built custom-domain-ready
**Researched:** 2026-07-06
**Confidence:** HIGH (technical pitfalls: fleet-proven + official docs; compliance/SEO: MEDIUM, verified against FTC/state guidance)

## Critical Pitfalls

These cause rewrites, broken production deploys, or legal/credibility exposure. Ordered by blast radius.

### Pitfall 1: GitHub Pages first-enable race (deploy 404s on a repo that "should work")

**What goes wrong:**
The very first Actions run fails or the site 404s even though the workflow is green, because Pages was never actually enabled for the repo. `actions/configure-pages` with `enablement: true` is supposed to turn it on, but on a brand-new repo the API call frequently races the repo's Pages provisioning and silently no-ops, or the deploy environment isn't created yet.

**Why it happens:**
`enablement: true` depends on the repo already having Pages metadata; on a fresh repo that metadata doesn't exist yet, so the "enable" is a soft failure. The deploy job then uploads an artifact to a Pages environment that isn't serving.

**How to avoid:**
Treat first-enable as a **manual step, not an automated one**. After the first push, go to Settings → Pages → Source = "GitHub Actions" by hand, then re-run the workflow. Document this in the repo README as step 1 of "first deploy." Keep `enablement: true` in the workflow for idempotency on later runs, but never assume it worked on run #1.

**Warning signs:**
Green workflow + `wolfwdavid.github.io/raj/` returns 404; the "github-pages" environment missing from repo Environments; deploy-pages step shows a URL but it's dead.

**Phase to address:** Deploy pipeline / first-deploy phase — success criteria must include "manually confirmed Settings→Pages source, re-ran, all four subpaths load."

---

### Pitfall 2: `download-artifact@v4` nests each site's dir — assemble step must rename

**What goes wrong:**
The matrix build uploads one artifact per site; the assemble job downloads them and finds each site's build output nested one directory deeper than expected (e.g. `artifacts/site-vfamigos/…` or a doubled path), so the assembled `_site/vfamigos/` is empty or contains a stray wrapper folder. Result: hub index works, sites 404.

**Why it happens:**
`upload-artifact@v4` / `download-artifact@v4` changed nesting behavior vs v3. Downloading multiple named artifacts without `path` discipline drops each into its own subfolder, and glob/copy steps that assumed v3 flat layout copy the wrong level.

**How to avoid:**
In the assemble job, download with an explicit `path:` per artifact (or `merge-multiple`), then **rename/move deterministically** into `_site/<site>/`. Add a build-time assertion: after assemble, fail the job if any of the four `_site/<site>/index.html` files is missing. Never trust the copy silently.

**Warning signs:**
`_site/` has folders like `vfamigos/vfamigos/` or `_app` missing under a site; only the hub index renders.

**Phase to address:** Deploy pipeline phase — verification step greps for all four `index.html` files and each site's `_app/` dir.

---

### Pitfall 3: Copying raj_one's `ssr = false` — shipping empty-body HTML to SEO sites

**What goes wrong:**
raj_one is an app-shell dashboard where `ssr = false` is fine. Copied into these four sites, it produces prerendered HTML whose `<body>` is essentially empty (content hydrates client-side only). For a news site, a reviews directory, and lead-gen service pages, this is catastrophic: Google/social crawlers, link previews, and no-JS users see a blank page. The whole point of "domain-ready, SEO-real" is defeated.

**Why it happens:**
The toolchain was cloned from raj_one and `ssr = false` rides along in the layout config. It "works" locally so nobody notices the HTML source is empty.

**How to avoid:**
Every `+layout.ts` uses `prerender = true` and **never** `ssr = false`. Explicitly assert in review: `curl` the built HTML and confirm real article text / product names / dentist names appear in the `<body>` source, not just a hydration shell. Add this to CI as a grep against built output for a known content string per site.

**Warning signs:**
View-source shows empty `<body>`; disabling JS shows blank page; social preview cards are empty; content only appears after hydration flash.

**Phase to address:** Toolchain/scaffold phase (config) + every per-site phase (content-in-HTML verification). Highest-priority "looks done but isn't."

---

### Pitfall 4: BASE_PATH leakage — hardcoded `/raj/` or root-absolute assets

**What goes wrong:**
Links written as `/raj/vfamigos/products/` or assets referenced as `/images/hero.png` (root-absolute). These break in three ways: (a) dev server (base is empty) 404s, (b) future custom-domain cutover breaks (base becomes empty again, but `/raj/` is baked in), (c) assets load from the wrong origin. The constraint "zero hardcoded `/raj/`" exists precisely because this is the #1 portability killer.

**Why it happens:**
Developers hardcode the deployed path they see in the browser, or use root-absolute asset paths out of habit. It "works" on Pages so it survives review, then silently breaks on domain cutover months later.

**How to avoid:**
Every internal link uses `{base}` from `$app/paths`. Every static asset is either Vite-imported (`import hero from '$lib/hero.png'`) or `{base}`-prefixed. Add a **CI grep that fails the build** on any occurrence of `/raj/` in source and on root-absolute `href="/` or `src="/` outside of `{base}` interpolation. Test both `BASE_PATH=/raj/…` and `BASE_PATH=''` builds.

**Warning signs:**
Links work on Pages but 404 in `npm run dev`; images missing in dev; grep finds literal `/raj/` in `.svelte`/`.ts` files.

**Phase to address:** Scaffold phase (lint rule/CI grep) + every per-site phase. Custom-domain readiness is a stated constraint — this is the gate.

---

### Pitfall 5: `trailingSlash` mismatch with adapter-static → redirect loops or 404s

**What goes wrong:**
Pages serves `/a/index.html` for a request to `/a/` but does **not** rewrite `/a` → `/a.html`. If `trailingSlash` isn't `'always'`, SvelteKit generates `/a.html` files and/or emits client-side redirects that Pages can't honor, producing 404s or redirect flicker. Internal links that omit the trailing slash then bounce.

**Why it happens:**
Default trailingSlash behavior differs from what static hosts need; the mismatch only manifests on the deployed host, not locally.

**How to avoid:**
Set `trailingSlash = 'always'` in every root `+layout.ts` (already a stated constraint — enforce it). Write all internal links with the trailing slash. Verify on the deployed URL, not just dev.

**Warning signs:**
Deep links 404 on Pages but work in dev; brief redirect flash; `/site/page` works but `/site/page/` doesn't or vice-versa.

**Phase to address:** Scaffold phase (layout config template shared across sites) + deploy verification.

---

### Pitfall 6: Prerender `entries()` gaps — dynamic routes silently not built

**What goes wrong:**
`/articles/[slug]/`, `/region/[region]/`, `/dentist/[id]/`, `/products/[id]/` are dynamic. Prerendering only emits pages the crawler can reach from links **or** that are declared in `entries()`. If an article/product/region isn't linked from a prerendered page and isn't in `entries()`, it's silently omitted — no error, just a missing page that 404s in production.

**Why it happens:**
The prerender crawler discovers routes by following links. Orphan detail pages (e.g. a region with no article linking to it, or a product only reachable via search) are never visited. adapter-static can be configured to error on this, but often isn't.

**How to avoid:**
Export explicit `entries()` from every dynamic route returning the full known ID/slug list from typed data. Set `prerender.handleMissingId`/`handleHttpError` to `'fail'` so the build errors instead of silently dropping. Assert built-file count equals data-record count (e.g. 12+ articles in → 12+ article HTML files out).

**Warning signs:**
Some detail pages 404 in production; built HTML file count < data record count; no build error but pages missing.

**Phase to address:** Each content-driven per-site phase (cannaworldnews, lidentist, vfamigos). Verification = file-count assertion.

---

### Pitfall 7: `localStorage` / `window` access during prerender/SSR → build crash or hydration break

**What goes wrong:**
The vfamigos runes cart persists to `localStorage`. Any top-level or module-load access to `localStorage`/`window`/`document` runs during prerender (Node, no DOM) and throws `ReferenceError: localStorage is not defined`, failing the build — or worse, is swallowed and produces a broken cart on first paint.

**Why it happens:**
Runes state initialized from `localStorage` at module scope executes on the server during prerender. Svelte 5 runes make this easy to write in a way that runs eagerly.

**How to avoid:**
Guard every browser-API access with `import { browser } from '$app/environment'` and only read/write storage inside `if (browser)` or inside `onMount`/effects that run client-side. Initialize cart state to empty, then hydrate from `localStorage` in an effect after mount. Never touch storage at module top level.

**Warning signs:**
Build fails with `localStorage/window/document is not defined`; cart empty-flashes then populates; hydration mismatch warnings.

**Phase to address:** vfamigos e-commerce phase (cart). Add a "builds clean with no browser-API errors" gate.

---

### Pitfall 8: Fake success states / mislabeled placeholder integrations

**What goes wrong:**
Stripe checkout that shows a "Payment successful!" screen without a real Payment Link; a lead form that shows "Thanks!" without actually POSTing anywhere. This is explicitly out of scope ("no fake success states") but is the path of least resistance when the real key isn't wired yet. It ships a demo that lies to the user/buyer.

**Why it happens:**
Placeholder integrations tempt developers to stub the *happy path UI* rather than the *service call*. The success screen is easy; wiring a real redirect target is slightly harder.

**How to avoid:**
Stripe: use real Payment **Links** — the success URL and `/thanks/` redirect are configured **in the Stripe dashboard, not in code** (common misconception is trying to set success_url client-side; Payment Links own that). Until a real link exists, the checkout button must link to the placeholder link ID from `config.ts` and, if unset, be visibly disabled or point to a "configure me" state — never a fabricated success. Forms: native POST to the real `FORM_ENDPOINT`; the "thanks" state is the endpoint's redirect or a post-submit route, not a JS-only fake.

**Warning signs:**
Success screen appears without a network request; `/thanks/` reachable without any real transaction; grep finds hardcoded "success" toggles.

**Phase to address:** vfamigos checkout phase + lipool/lidentist form phases. Verification = "no success state without a real outbound request."

---

### Pitfall 9: Public Formspree-style endpoint → spam flood

**What goes wrong:**
A publicly-visible form `action` endpoint gets scraped by bots and flooded with spam submissions, burning the free-tier quota and drowning real leads (this is a lead-gen product — spam directly attacks the core value).

**Why it happens:**
Static sites can't do server-side validation; the endpoint is in the HTML for anyone to see. No CAPTCHA by default.

**How to avoid:**
Add a **honeypot** field (hidden input bots fill, humans don't — reject if non-empty). Formspree supports `_gotcha`. Consider a time-to-submit check. Keep the endpoint configurable so it can be rotated if abused. Document that CAPTCHA (hCaptcha/Turnstile) is the escalation if honeypot proves insufficient. Progressive enhancement means the honeypot must work with native POST too.

**Warning signs:**
Form quota exhausted; inbox full of gibberish; submissions with the honeypot filled.

**Phase to address:** lipool + lidentist lead-form phases. Honeypot is table-stakes, not optional.

---

### Pitfall 10: Review-site content authenticity — FTC fake-review rule exposure

**What goes wrong:**
Lidentist.reviews ships with **seeded/demo review cards** that read as real consumer reviews. Under the FTC's Rule on Consumer Reviews and Testimonials (effective Oct 21, 2024), fabricated or AI-generated reviews presented as genuine are prohibited, with penalties up to **$51,744 per violation**. Placeholder reviews that aren't clearly labeled as samples create real legal exposure the moment the site goes to a real domain.

**Why it happens:**
Demo data makes the site look populated and finished. Nobody labels it because "it's just a placeholder" — but the placeholder is what ships publicly.

**How to avoid:**
All seeded reviews must be **unmistakably labeled as sample/demo content** (visible badge or notice), OR the directory ships empty with a "reviews coming soon" state until real, verifiable reviews exist. Never present fabricated reviews as genuine consumer testimonials. When real reviews are added, disclose any incentivized/insider relationships. Same principle applies to vfamigos testimonials and lipool gallery ("representative work" labeling if not the contractor's own jobs).

**Warning signs:**
Review cards with realistic names/dates but no provenance; no "sample data" labeling; reviewer relationships undisclosed.

**Phase to address:** lidentist phase (content), and a cross-site "demo-data labeling" gate before any custom-domain cutover. This is a launch-blocker for the reviews property.

---

### Pitfall 11: Cannabis content compliance — health claims, age, and jurisdiction

**What goes wrong:**
Cannaworldnews is informational (permitted), but drifts into (a) unverified **medical/health claims** ("cannabis cures X"), (b) content that appeals to minors, or (c) presenting product/sales content in regions where it's illegal. Cannabis marketing is a state-by-state patchwork; even informational sites carry disclaimer expectations, and health claims are the single most common compliance failure.

**Why it happens:**
News aggregation naturally surfaces medical-benefit angles; editorial tone slips from "reporting on a study" to "asserting a benefit." No age gate or disclaimer because "it's just news."

**How to avoid:**
Editorial content only — report on developments, cite sources, **do not make or endorse health claims** in the site's own voice. Include a site-wide disclaimer (informational only, not medical/legal advice, 21+). Avoid imagery/tone appealing to minors. Do not feature purchasable product or dispensary CTAs (out of scope anyway — keep it that way). Keep frontmatter/content factual and source-attributed. Note this is informational-news, not advertising, which is the safer category — stay in it.

**Warning signs:**
Articles asserting medical benefits in the site's voice; product-buy CTAs; cartoonish/youth-appealing art; no disclaimer.

**Phase to address:** cannaworldnews phase — disclaimer component + editorial content guidelines in the seeding task.

---

### Pitfall 12: SEO of subpath hosting destined for custom domains

**What goes wrong:**
While on `wolfwdavid.github.io/raj/<site>/`, the four sites share one origin and one subpath tree. If canonical URLs, `sitemap.xml`, `robots.txt`, and Open Graph URLs are generated against the Pages subpath, then at custom-domain cutover every canonical/OG/sitemap URL is wrong, and search engines may have indexed the throwaway github.io URLs — splitting ranking signal and requiring redirects that GitHub Pages subpaths can't cleanly provide.

**Why it happens:**
Canonical/sitemap generation hardcodes the current deployed origin. The temporary host gets indexed because nothing tells crawlers it's temporary.

**How to avoid:**
Drive canonical/OG/sitemap base URL from the **same config that will hold the real domain** (per-site `SITE_URL` in config.ts), not from `BASE_PATH`. While on github.io, consider `robots.txt` discouraging indexing of the temporary subpath (or accept it and plan 301s at cutover). Each site owns its own `sitemap.xml` and `robots.txt` scoped to its subtree. Ensure per-site canonical tags so the four sites aren't seen as one duplicate-content property.

**Warning signs:**
Canonical tags point to github.io; one sitemap covering all four sites; OG preview URLs are github.io; github.io/raj indexed in Google.

**Phase to address:** Each per-site phase (canonical/OG) + a shared SEO-scaffold decision early. Flag for deeper research at the custom-domain cutover milestone.

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Duplicate LeadForm/config between lipool & lidentist | No workspaces needed; clean per-domain extraction | Two places to fix a form bug/honeypot change | Acceptable now (stated decision, ~100 lines) — but keep them literally identical so a diff catches drift |
| `marked` + manual markdown pipeline instead of mdsvex | Keeps inline vite.config.ts, no svelte.config.js | No Svelte-in-markdown; must sanitize HTML yourself | Acceptable (stated decision) — but see security note on sanitizing |
| Seeded/demo review & product data | Site looks populated for demo | FTC exposure if unlabeled; looks fake if labeled | Only with unmistakable "sample data" labeling |
| Single Pages deploy for four sites | One push ships everything | One site's build failure blocks all four; shared blast radius | Acceptable (constraint) — mitigate with per-site build assertions so a failure is legible |
| Skipping per-site sitemap/robots until "later" | Faster to first deploy | SEO signal lands on throwaway github.io URLs | Never for the two lead-gen/SEO-critical sites; defer only for a pure demo |
| No CAPTCHA (honeypot only) | Zero friction, no third-party JS | Honeypot alone may not stop targeted spam | Acceptable at launch; plan Turnstile as escalation |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| Stripe Payment Links | Trying to set `success_url`/`/thanks/` in client code | Success + redirect URL are configured in the Stripe dashboard per Payment Link; code only holds the link ID in config.ts |
| Stripe (unconfigured) | Faking a success screen when no real link exists | Disabled/"configure me" state; never a fabricated success |
| Formspree-style endpoint | Relying on JS fetch only (breaks with no JS) | Native `<form method="POST" action={FORM_ENDPOINT}>` + progressive enhancement; JS is optional polish |
| Formspree-style endpoint | Public endpoint with no spam guard | Honeypot (`_gotcha`) field, rejected server-side by the provider |
| GitHub Pages (Actions deploy) | Assuming Jekyll strips `_app/` (underscore dir) | The Actions `upload-pages-artifact`→`deploy-pages` flow does **not** run Jekyll, so `_app/` is safe; still ship `.nojekyll` as belt-and-suspenders in case of branch-based fallback |
| GitHub Pages | Expecting server redirects (`/a`→`/a.html`) | Pages won't rewrite; use `trailingSlash: 'always'` so every route is `…/index.html` |
| localStorage (cart) | Reading storage at module scope during prerender | Guard with `browser` from `$app/environment`; hydrate in an effect after mount |

## Performance Traps

At this scale (four small static sites, seeded content) performance is mostly a non-issue — but a few patterns bite even small static sites.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Unoptimized hero/product/gallery images | Slow LCP, huge artifact, slow deploy | Vite-import images so they're hashed/optimized; use appropriately sized assets; lazy-load below-fold gallery images | Any image-heavy page (vfamigos grid, lipool gallery) on mobile |
| Shipping full marked + unsanitized HTML per article at runtime | Larger bundle, XSS surface | Render markdown at build time (prerender), sanitize output | cannaworldnews as article count grows |
| Client-side filtering/search over full dataset loaded eagerly | Slow first load if data grows | Data is small now; keep per-region/per-slug prerendered pages as the primary path | If article/dentist counts reach thousands (not v1) |
| Four sites' `_app` chunks with no shared caching | Larger total deploy | Independent per-site builds are fine at this scale; don't prematurely optimize | Not a v1 concern |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Rendering markdown HTML from `marked` without sanitizing | Stored XSS if any content includes raw HTML/scripts | Sanitize marked output (e.g. DOMPurify at build, or `marked` with HTML disabled); content is in-repo now but harden anyway |
| Committing real Stripe/Formspree keys | Key leak, quota abuse, chargeback exposure | Keys live in `VITE_` env / config placeholders only; real keys pasted post-build by user; never commit real keys |
| Trusting client-only form validation | Spam/injection to the endpoint | Provider-side validation + honeypot; treat all form input as untrusted |
| No age/disclaimer gating on cannabis content | Regulatory exposure | Site-wide 21+ disclaimer; no youth-appealing content; informational-only voice |
| Presenting fabricated reviews as genuine | FTC penalty up to $51,744/violation | Label sample data unmistakably or ship empty-state |
| Leaking the parent fleet's standalone repos (`raj_*/`) into this repo | Nested-repo corruption, accidental publish | `.gitignore` `raj_*/` is pre-staged; **never** `git add -f`; verify `git status` before commits |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Same design system across all four sites | Sites feel like one templated product, erodes per-brand trust | Distinct ui-ux-pro-max system per site (playful ecom / local-service trust / medical trust / editorial) — a stated requirement, treat as a gate |
| Cart state lost on refresh or empty-flash | Buyer loses selections, distrust | localStorage persistence hydrated cleanly post-mount (no empty flash), guarded for prerender |
| Lead form with no confirmation/next-step | User unsure if request went through | Real post-submit `/thanks/` or provider redirect; never a silent or fake success |
| Trailing-slash link inconsistency | Redirect flash / occasional 404 | All internal links trailing-slashed to match `trailingSlash: 'always'` |
| No-JS users see blank pages | Crawlers + accessibility failure | `prerender=true`, real content in HTML body, progressive enhancement |
| Broken social/link previews | Poor sharing, lost lead-gen reach | Correct per-site OG tags with real (future-domain) canonical URLs and prerendered content |

## "Looks Done But Isn't" Checklist

- [ ] **Prerendered content:** View-source shows real article/product/dentist text in `<body>`, not an empty hydration shell (verify per site, JS disabled).
- [ ] **All four sites deploy:** `_site/vfamigos/`, `/lipool/`, `/lidentist/`, `/cannaworldnews/` each have `index.html` + `_app/` after assemble.
- [ ] **Dynamic routes complete:** Built HTML file count == data-record count for articles, regions, dentists, products (entries() gaps closed).
- [ ] **No `/raj/` in source:** CI grep passes; both `BASE_PATH=/raj/…` and `BASE_PATH=''` builds succeed.
- [ ] **Trailing slashes:** Deep links work on the deployed host, not just dev.
- [ ] **Cart survives prerender:** Build has zero `localStorage/window is not defined` errors; no empty-flash on load.
- [ ] **Checkout is honest:** No success screen without a real Stripe Payment Link redirect; unconfigured state is visibly disabled, not faked.
- [ ] **Forms work without JS:** Native POST submits; honeypot present; `/thanks/` reachable only after a real submit.
- [ ] **Demo data labeled:** Every seeded review/testimonial/gallery item is unmistakably marked as sample content.
- [ ] **Cannabis disclaimer:** 21+/informational-only disclaimer present; no health claims in site voice.
- [ ] **SEO domain-ready:** Canonical/OG/sitemap URLs derive from per-site `SITE_URL`, not the github.io subpath.
- [ ] **First deploy enabled by hand:** Settings→Pages source confirmed = GitHub Actions, workflow re-run, subpaths verified live.

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Pages first-enable race | LOW | Set Settings→Pages source manually, re-run workflow, verify subpaths |
| `ssr = false` shipped (empty HTML) | LOW-MEDIUM | Remove `ssr=false`, set `prerender=true`, rebuild, re-verify HTML body per site |
| `/raj/` hardcoded throughout | MEDIUM | Grep all occurrences, replace with `{base}`; add CI guard so it can't recur; retest both base modes |
| entries() gap (missing pages) | LOW | Add explicit `entries()` per dynamic route; set prerender to fail on missing; rebuild |
| localStorage prerender crash | LOW | Wrap accesses in `browser` guard / move to onMount; rebuild |
| Fabricated reviews shipped to a real domain | HIGH (legal) | Take down or relabel immediately; replace with verifiable reviews or empty-state; document provenance going forward |
| github.io URLs indexed before cutover | MEDIUM | Set canonical to real domain pre-cutover; submit removal / rely on 301s where possible; expect ranking-signal reset |
| Nested raj_* repo accidentally committed | MEDIUM | `git rm --cached -r` the nested repo, confirm `.gitignore`, rewrite history if pushed |

## Pitfall-to-Phase Mapping

Phase names are indicative (roadmap TBD); map by topic.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Pages first-enable race | Deploy pipeline / first-deploy | All four subpaths load after manual enable + re-run |
| download-artifact nesting | Deploy pipeline | Assemble asserts four `index.html` present |
| `ssr=false` empty HTML | Scaffold + every per-site | View-source body has real content, JS off |
| `/raj/` / base leakage | Scaffold (CI grep) + every per-site | Grep clean; both base-mode builds pass |
| trailingSlash mismatch | Scaffold (shared layout) | Deep links load on host |
| entries() gaps | Each content site phase | Built-file count == record count |
| localStorage in prerender | vfamigos cart phase | Build clean of browser-API errors |
| Fake success states | vfamigos checkout + form phases | No success without real outbound request |
| Form spam | lipool + lidentist form phases | Honeypot present + provider-side reject |
| Fabricated reviews (FTC) | lidentist phase + pre-cutover gate | Sample data labeled or empty-state |
| Cannabis health claims | cannaworldnews phase | Disclaimer present; editorial-voice review |
| Subpath SEO / canonical | Per-site + custom-domain milestone | Canonical/OG/sitemap use SITE_URL |

## Sources

- FTC — Consumer Reviews and Testimonials Rule Q&A (effective Oct 21, 2024; $51,744/violation): https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers — HIGH
- FTC — Endorsements, Influencers, and Reviews: https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews — HIGH
- 16 CFR Part 255 (Endorsement Guides): https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255 — HIGH
- SvelteKit adapter-static docs (trailingSlash, base, prerender, .nojekyll): https://svelte.dev/docs/kit/adapter-static — HIGH
- sveltejs/kit #3393 "prerendering broken when using a base path": https://github.com/sveltejs/kit/issues/3393 — MEDIUM
- sveltejs/kit #2143 default appDir `_app` incompatibilities: https://github.com/sveltejs/kit/issues/2143 — MEDIUM
- metonym/sveltekit-gh-pages reference setup: https://github.com/metonym/sveltekit-gh-pages — MEDIUM
- Dynamic routes on GitHub Pages (entries/404 handling): https://irshadpi.me/deploying-sveltekit-dynamic-routes-github-pages — MEDIUM
- Cannabis Marketing Compliance Guide (health claims, 21+, jurisdiction): https://influenceflow.io/resources/cannabis-marketing-compliance-guide-stay-legal-in-2026/ — MEDIUM
- Cannabis and THC Marketing Guidelines by State: https://www.acadiacontentsolutions.com/cannabis/cannabis-and-thc-marketing-guidelines-by-state — MEDIUM
- Fleet history (raj_one/raj_two): Pages first-enable race, download-artifact@v4 nesting, ssr=false pitfall — HIGH (direct project experience)

---
*Pitfalls research for: static multi-site SvelteKit / GitHub Pages monorepo (e-commerce + lead-gen + news)*
*Researched: 2026-07-06*
