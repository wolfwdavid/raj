# raj — 4-Website Svelte Monorepo

## What This Is

A monorepo (`wolfwdavid/raj`) hosting four independent SvelteKit websites, each in its own folder, deployed together through a single GitHub Pages workflow to `wolfwdavid.github.io/raj/<site>/`. The four properties: **Vfamigos.com** (VeeFriends-style e-commerce for an original collectibles character brand), **Lipool.com** (Long Island pool contractor lead generator), **Lidentist.reviews** (Long Island dentist reviews + appointment lead generator), and **Cannaworldnews.com** (cannabis news from around the world).

## Core Value

Four distinct, production-quality, custom-domain-ready websites ship from one repo with one push — each with a real conversion path (checkout link, lead form, or editorial engagement) that works the moment real service keys are pasted in.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] vfamigos: product grid, product detail pages, runes cart persisted to localStorage, checkout via Stripe Payment Link placeholders in config.ts, /thanks/ redirect target, no fake success states
- [ ] lipool: services page, gallery, quote LeadForm posting to configurable Formspree-style FORM_ENDPOINT with honeypot, progressive enhancement (native POST works without JS)
- [ ] lidentist: dentist directory from typed data, dentist detail pages with review cards, appointment request form (duplicated LeadForm pattern)
- [ ] cannaworldnews: 12+ seeded markdown articles with region frontmatter, routes /, /region/[region]/, /articles/[slug]/, marked rendering, editorial layout
- [ ] One GitHub Pages deployment serving all four sites plus a hub index page
- [ ] Distinct ui-ux-pro-max design system per site (playful collectible ecom / local-service trust / medical trust / editorial news)

### Out of Scope

- npm workspaces / shared packages — independent package.json per site keeps future per-domain repo extraction trivial
- Server-side rendering or serverless backends — GitHub Pages is static; conversion paths use external services (Stripe Payment Links, Formspree-style endpoints)
- Custom domains now — sites are built domain-ready (zero hardcoded `/raj/`), cutover happens later per domain
- Real Stripe/Formspree keys — placeholders in config.ts / VITE_ env overrides; wiring real accounts is a post-build user step
- CMS for cannaworldnews — static markdown content in-repo for v1
- VeeFriends assets or trade dress — vfamigos is an original brand, style inspiration only

## Context

- Parent directory already hosts the raj fleet (raj_one, raj_two — standalone repos, gitignored via `raj_*/`, never committed here).
- Proven toolchain cloned from raj_one: SvelteKit 2 (^2.63) + Svelte 5 runes (^5.56) + @sveltejs/adapter-static ^3 + Vite 8 + TypeScript 6; all Kit config inline in vite.config.ts (no svelte.config.js); `paths.base` from `BASE_PATH` env.
- Full architecture pre-approved by the user in plan `~/.claude/plans/eager-questing-parasol.md` (repo layout, deploy pipeline, per-site scope, integration stubs).
- Known gotchas from fleet history: GitHub Pages first-enable race (`configure-pages` `enablement: true` may need manual Settings→Pages fallback), `download-artifact@v4` nests artifact dirs (rename step mandatory), raj_one's `ssr = false` must NOT be copied (SEO sites need real prerendered HTML).

## Constraints

- **Tech stack**: SvelteKit 2 + Svelte 5 runes + adapter-static, TypeScript — matches the proven raj fleet toolchain; Svelte explicitly requested by user
- **Hosting**: GitHub Pages, single deployment per repo — forces matrix build → assemble → single upload-pages-artifact pipeline
- **Package management**: independent package.json + lockfile per site, NO workspaces — preserves clean per-domain repo extraction later
- **Prerendering**: `prerender = true` + `trailingSlash = 'always'` in every +layout.ts; explicit `entries()` for dynamic routes; never `ssr = false`
- **Portability**: zero hardcoded `/raj/` links or root-absolute assets — everything `{base}`-prefixed or Vite-imported (custom-domain readiness)
- **Integrations**: real-ready stubs only — Stripe Payment Link placeholders, configurable form endpoint; no fake success states anywhere
- **Commit hygiene**: no AI-assistant mentions in commit messages or code

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Monorepo at Websites/raj root, 4 site folders | User-selected; .gitignore was pre-staged to exclude raj_*/ standalone repos | — Pending |
| Independent package.json per site (no workspaces) | Clean future extraction to per-domain repos, per-site CI caching, no version coupling | — Pending |
| Single Pages deploy: matrix build → assemble _site → deploy | GitHub Pages allows one deployment per repo; hub index links the four sites | — Pending |
| Duplicate LeadForm/config between lipool and lidentist | ~100 lines; a shared package would force workspaces | — Pending |
| Markdown + marked (not mdsvex) for cannaworldnews | Avoids introducing svelte.config.js; keeps inline vite.config.ts pattern intact | — Pending |
| Real-ready integration stubs | User-selected; everything works the moment real keys are pasted, no fake success states | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-06 after initialization*
