# Phase 2: Per-Site Shells + Scaffold Conventions - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Turn the four placeholder apps into real styled **shells** — each a nav + footer + landing skeleton in its committed design system — and establish the scaffold conventions once (design-token pattern, CI portability grep, svelte-check gate). NO real content/data/routes yet (Phase 3), no conversion paths (Phase 4), no SEO metadata component (Phase 5). This phase makes the four sites look like four distinct brands and locks the guardrails.

</domain>

<decisions>
## Implementation Decisions

### Design token implementation
- **D-01:** Each site ships a `src/lib/styles/tokens.css` (or `app.css`) defining its palette as CSS custom properties in `:root` — exact hex values + token names come verbatim from `.planning/design/<site>.md` (e.g. vfamigos `--color-primary: #E11D48`). Import once in `+layout.svelte`.
- **D-02:** Google Fonts loaded via `<link>` in `src/app.html` per site using the exact families/weights from the design spec (Fredoka+Nunito / Poppins+Open Sans / Lexend+Source Sans 3 / Libre Bodoni+Public Sans), `display=swap`. `--font-heading` / `--font-body` tokens reference them.
- **D-03:** No Tailwind, no CSS framework — plain scoped Svelte `<style>` + the CSS-variable token layer. Keeps each site independent and dependency-light (matches raj_one convention).

### Shell structure (per site)
- **D-04:** Each site gets `src/lib/components/SiteHeader.svelte` (nav) + `SiteFooter.svelte`, rendered in `+layout.svelte` wrapping `{@render children()}`. Nav links use `{base}` from `$app/paths` — never hardcoded paths. Nav targets are the site's Phase-3 routes (may be placeholder `#` or real route paths that 404 until Phase 3 — link to real paths, they light up in Phase 3).
- **D-05:** Nav content per site (from design specs): vfamigos = logo/Shop/About/Cart(badge); lipool = logo/Services/Gallery/Get Quote + click-to-call; lidentist = logo/Find a Dentist/How it Works/Appointment; cannaworldnews = wordmark + region nav (Americas/Europe/Africa/Asia-Pacific). Footer per site carries brand line + nav echo (lipool/lidentist NAP-ready footer stub; cannaworldnews disclaimer stub — full compliance copy is Phase 5).
- **D-06:** Landing `+page.svelte` becomes a real hero per design spec (headline + subhead + primary CTA styled), enough to prove the design system visually. Deeper content sections are Phase 3.
- **D-07:** SVG icons inline (Lucide-style paths hand-authored or minimal inline `<svg>`), never emoji. One shared icon approach per site.

### Shared conventions / CI guardrails
- **D-08:** Add a CI portability guard job/step: after each site builds, grep the emitted `build/**/*.html` for hardcoded `/raj/` and root-absolute asset paths (`href="/` or `src="/` that aren't `//` protocol or the site's own base); fail the build on any hit. Runs in deploy.yml (new step in the matrix build leg or a dedicated check).
- **D-09:** Add a `svelte-check` gate: each site's CI build leg runs `npm run check` and fails on any error. (package.json already has the `check` script.)
- **D-10:** These guardrail steps live in the existing `.github/workflows/deploy.yml` matrix build job (extend it) — do not create a second workflow.

### Accessibility baseline (all shells)
- **D-11:** Semantic landmarks (`<header>`/`<nav>`/`<main>`/`<footer>`), one `<h1>` per page, skip-link to `#main`, visible focus rings (min 3px, design-token ring color), 44px touch targets, `prefers-reduced-motion` honored, all interactive elements keyboard-operable, contrast ≥4.5:1 (design specs pre-verified). lidentist held to the highest bar (its design spec is the a11y exemplar).

### Claude's Discretion
- Exact hero copy per site, icon path choices, spacing scale specifics, how nav collapses on mobile (hamburger vs wrap) — follow design specs + standard responsive patterns.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design systems (one per site — palette, fonts, layout, a11y)
- `.planning/design/vfamigos.md` — playful collectible ecom: Fredoka+Nunito, rose #E11D48 + blue CTA
- `.planning/design/lipool.md` — LI pool trust: Poppins+Open Sans, water blues #0284C7 (NOT the generator's purple)
- `.planning/design/lidentist.md` — medical trust / a11y exemplar: Lexend+Source Sans 3, cyan #0891B2 + green CTA
- `.planning/design/cannaworldnews.md` — Swiss editorial: Libre Bodoni+Public Sans, near-black + green accent #15803D

### Conventions & prior work
- `.planning/phases/01-deploy-pipeline-walking-skeleton/01-CONTEXT.md` — scaffold conventions locked in Phase 1 (inline vite.config.ts, prerender contract, no ssr=false)
- `.github/workflows/deploy.yml` — the matrix workflow to EXTEND with grep + check gates (do not fork)
- `vfamigos/src/routes/+layout.svelte` + `+page.svelte` — current placeholder shells to replace
- `.planning/research/PITFALLS.md` — BASE_PATH leakage guard rationale (D-08)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Four buildable SvelteKit apps already scaffolded (Phase 1) with prerender contract, inline vite.config.ts, committed lockfiles, `$app/paths` base wiring, `check` script present.
- `pages-root/` hub already uses the visual language of "four distinct sites" — shells should feel consistent with their hub cards.

### Established Patterns
- SvelteKit emits RELATIVE asset paths (`./_app/`) — the portability grep (D-08) must allow relative `./` and reject root-absolute `/` and literal `/raj/`.
- `{base}` from `$app/paths` is the only correct way to build internal links.

### Integration Points
- Shells rendered via each site's `+layout.svelte`; CI guards extend `deploy.yml`'s build matrix leg.

</code_context>

<specifics>
## Specific Ideas

- Four sites must look like four different companies — no shared component library, no shared look. The design specs are prescriptive; follow their palettes/fonts/layout patterns exactly.
- Link nav to the real Phase-3 route paths now so Phase 3 "lights them up" rather than rewiring nav.

</specifics>

<deferred>
## Deferred Ideas

- Real content, product/dentist/article data, dynamic routes → Phase 3
- Cart badge live count, forms → Phase 4
- SITE_URL-driven SEO/meta component, full cannabis disclaimer + FTC labeling copy → Phase 5

</deferred>

---

*Phase: 02-per-site-shells-scaffold-conventions*
*Context gathered: 2026-07-07*
