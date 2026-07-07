# raj monorepo — 4 websites build

Plan reference: ~/.claude/plans/eager-questing-parasol.md

## Todo

- [ ] 1. Foundation: delete stray package-lock.json, extend .gitignore, add .gitattributes, git init + first commit, create wolfwdavid/raj (public)
- [ ] 2. GSD project init: PROJECT.md + roadmap (~6 phases)
- [ ] 3. Design systems: ui-ux-pro-max specs ×4 (vfamigos / lipool / lidentist / cannaworldnews)
- [ ] 4. Scaffold vfamigos from raj_one template pattern; verify BASE_PATH build locally
- [ ] 5. Ultracode workflow: parallel build of all 4 sites + verify agents (svelte-check, build, /raj-leak grep, entries coverage)
- [x] 6. pages-root hub (index.html + 404.html) + root deploy.yml (matrix build → assemble → deploy) — Phase 1 ✓ LIVE
- [~] 7. Verify & ship: Phase 1 shipped + live-verified (6/6 smoke). Phases 2-5 remaining (shells, content, conversion, SEO/compliance)

## Review

**v1 COMPLETE + LIVE 2026-07-07** — all 5 GSD phases shipped and verified. Repo `wolfwdavid/raj` (public), 79 commits, zero AI mentions, live at `wolfwdavid.github.io/raj/`.

Four websites, each in its own folder, one GitHub Pages deployment:
- **vfamigos/** — collectibles e-commerce: 10 Amigo characters, product grid + PDPs, runes cart (localStorage-persisted), Stripe Payment Link checkout (real-ready stub, honest disabled state), /thanks/ redirect target.
- **lipool/** — LI pool lead-gen: benefit hero + trust strip, 6 services, gallery, quote LeadForm (honeypot, progressive-enhancement POST), HomeAndConstructionBusiness JSON-LD + NAP (no aggregateRating).
- **lidentist/** — LI dentist reviews lead-gen: filterable directory (10 dentists), detail pages with review cards, appointment LeadForm (?dentist= pre-select), FTC sample-data labeling, a11y exemplar.
- **cannaworldnews/** — global cannabis news: 14 markdown articles across 4 regions, front/article/region routes, marked+gray-matter pipeline, article:published_time meta, informational disclaimer.

Cross-cutting: distinct ui-ux-pro-max design system per site; SITE_URL-driven canonical/OG (custom-domain-ready, not BASE_PATH); CI gates in one deploy.yml (svelte-check, portability grep, content/file-count assertions, compliance gate: no-fake-success + FTC label + no-aggregateRating + title/canonical/disclaimer presence). Every route fully prerendered.

**Phases:** 1 deploy pipeline ✓ · 2 shells+conventions ✓ · 3 content+routes ✓ · 4 conversion paths ✓ · 5 SEO+compliance ✓. Every phase verifier-signed-off; plan-checker caught + fixed real prerender sequencing bugs in Phases 3 & 4 (see lessons.md).

**Follow-ups (v2, out of v1 scope):** paste real Stripe Payment Links + Formspree endpoints (KEYS-01); custom-domain cutover per site (extract folder + BASE_PATH='' + CNAME, DOM-01); real dentist data/reviews + real pool photos (CONT-01); RSS/sitemap/JSON-LD Article/og:image; legal review of cannabis compliance posture before cutover.
