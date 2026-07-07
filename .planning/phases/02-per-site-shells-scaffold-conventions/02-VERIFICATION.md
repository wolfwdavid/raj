---
phase: 02-per-site-shells-scaffold-conventions
verified: 2026-07-07T00:00:00Z
status: passed
score: 4/4 must-haves verified
---

# Phase 2: Per-Site Shells + Scaffold Conventions Verification Report

**Phase Goal:** Establish layout/base-path/prerender conventions once and stand up four independent SvelteKit shells, each in its committed design system, so later site work is parallel and pitfall-free.
**Verified:** 2026-07-07
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Each site builds standalone with/without BASE_PATH | ✓ VERIFIED | Locally ran `npm run check` (0 errors), `BASE_PATH=/raj/<site> npm run build`, and `BASE_PATH='' npm run build` for all 4 sites — all succeeded. CI run 28842122570: all 4 matrix build legs green (check → empty-base build → deployed-base build → grep). |
| 2 | Each renders nav/footer shell in its committed design system — four visually distinct looks via palette tokens, font pairing, layout | ✓ VERIFIED | `tokens.css` in each site matches `.planning/design/<site>.md` palette tables verbatim (byte-for-byte hex/token names). `app.html` loads the correct distinct Google Fonts per site (Fredoka+Nunito / Poppins+Open Sans / Lexend+Source Sans 3 / Libre Bodoni+Public Sans). Built `index.html` for each site contains its distinct `family=` link. SiteHeader/SiteFooter/+page.svelte content, copy, and layout differ per site (cart badge ecom vs click-to-call lead-gen vs directory chips vs editorial masthead+region nav). |
| 3 | CI fails build if emitted HTML has hardcoded /raj/ or root-absolute asset paths | ✓ VERIFIED | `deploy.yml` build leg contains the portability guard step (`grep -rnE '(href|src)="/[^/]' build --include="*.html"` → `exit 1` on match). Locally re-ran the grep against all 4 built `build/` dirs post-BASE_PATH build — zero matches ("portable (clean)") in every site. |
| 4 | Every site passes svelte-check with zero errors and shell pages meet baseline a11y (contrast, focus, SVG icons, semantic headings, reduced-motion) | ✓ VERIFIED | `npm run check` = "0 ERRORS 0 WARNINGS 0 FILES_WITH_PROBLEMS" for all 4 sites (fresh local run). All 4 `+layout.svelte` include skip-link→`#main`, `<header>/<nav>/<main id="main">/<footer>` landmarks, global `:focus-visible` 3px ring on `--color-ring`, and a `prefers-reduced-motion` block. All 4 `+page.svelte` have exactly one `<h1>`. Grep across all site source found zero emoji characters and zero TODO/FIXME/placeholder markers. Interactive nav/CTA targets styled `min-height: 44px`. Contrast pairs are pre-verified in each design spec and copied verbatim (not re-derived). |

**Score:** 4/4 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.github/workflows/deploy.yml` | svelte-check gate + empty-BASE_PATH build + portability grep in matrix build leg | ✓ VERIFIED | Contains `npm run check`, `BASE_PATH: ''` step, and grep pattern `(href|src)="/[^/]"`; single workflow, one `upload-pages-artifact@v3`, one `deploy-pages@v4`. CI run 28842122570 green on all jobs. |
| `.planning/phases/.../02-CONVENTIONS.md` | Reusable shell skeleton + conventions doc | ✓ VERIFIED | Contains tokens.css template, app.html fonts snippet, +layout/SiteHeader/SiteFooter skeletons, `rel="external"` prerender-safe nav rule, a11y checklist, per-site verify recipe. |
| `vfamigos/src/lib/styles/tokens.css` | vfamigos palette + font tokens | ✓ VERIFIED | `--color-primary: #E11D48`, `--font-heading: 'Fredoka'` present, full palette matches design spec verbatim. |
| `vfamigos/src/lib/components/SiteHeader.svelte` | vfamigos nav (Shop/About/Cart badge) via `{base}` | ✓ VERIFIED | `$app/paths` import, `rel="external"` on Phase-3 routes, `aria-label="Cart, 0 items"` badge, inline SVG cart icon. |
| `lipool/src/lib/styles/tokens.css` | lipool palette + font tokens | ✓ VERIFIED | `--color-primary: #0284C7`, `--font-heading: 'Poppins'` present, matches design spec verbatim. |
| `lipool/src/lib/components/SiteHeader.svelte` | lipool nav + click-to-call | ✓ VERIFIED | `$app/paths`, `rel="external"`, `tel:+15165550100` with `aria-label`, `#services` same-page anchor (no rel). |
| `lidentist/src/lib/styles/tokens.css` | lidentist palette + font tokens | ✓ VERIFIED | `--color-primary: #0891B2`, `--font-heading: 'Lexend'` present, matches design spec verbatim. |
| `lidentist/src/lib/components/SiteHeader.svelte` | lidentist nav via `{base}` | ✓ VERIFIED | `$app/paths`, `rel="external"` on `/appointment/`, `#directory`/`#how` same-page anchors. |
| `cannaworldnews/src/lib/styles/tokens.css` | cannaworldnews palette + font tokens | ✓ VERIFIED | `--color-accent: #15803D`, `--font-heading: 'Libre Bodoni'` present, matches design spec verbatim. |
| `cannaworldnews/src/lib/components/SiteFooter.svelte` | Swiss-editorial footer with disclaimer stub | ✓ VERIFIED | Contains "Informational only — not legal or medical advice." plus region-index echo, all 4 region links `rel="external"`. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `deploy.yml` build job | each site's `build/**/*.html` | portability grep after `npm run build` | ✓ WIRED | Step present, uses correct pattern, runs after the deployed BASE_PATH build (last), CI green. |
| `*/src/routes/+layout.svelte` | `*/src/lib/styles/tokens.css` | `import '$lib/styles/tokens.css'` | ✓ WIRED | Present in all 4 layouts, confirmed by grep. |
| `SiteHeader` nav anchors (all 4 sites) | Phase-3 not-yet-built routes | `{base}/route/` + `rel="external"` | ✓ WIRED | vfamigos: products/about/cart; lipool: gallery/quote (Services is same-page `#services`, correctly no `rel`); lidentist: appointment (directory/how are same-page); cannaworldnews: all 4 region routes. No prerender crawl failures — build succeeded for all 4. |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| INFRA-04 | 02-01 | Each site builds independently with/without BASE_PATH | ✓ SATISFIED | deploy.yml empty-base + deployed-base build steps; verified locally for all 4 sites. |
| INFRA-06 | 02-01 | CI fails on hardcoded /raj/ or root-absolute asset paths in built HTML | ✓ SATISFIED | Portability guard step in deploy.yml; grep clean on all 4 local builds; CI green. |
| QUAL-01 | 02-02, 02-03 | Each site implements its committed design system — four visually distinct sites | ✓ SATISFIED | tokens.css/app.html/fonts/nav/footer/hero verified distinct and verbatim-matched to `.planning/design/<site>.md` for all 4 sites. |
| QUAL-02 | 02-01 | Every site passes `npm run check` with zero errors | ✓ SATISFIED | Fresh local run: 0 errors/0 warnings across all 4 sites. |
| QUAL-03 | 02-02, 02-03 | Baseline a11y: contrast, focus, SVG icons, semantic headings, reduced-motion | ✓ SATISFIED | Skip-link, landmarks, one h1, 3px focus ring, 44px targets, reduced-motion block, inline SVG (no emoji) confirmed in all 4 sites' shells. |

No orphaned requirements — REQUIREMENTS.md traceability table maps exactly these 5 IDs to Phase 2, and all 5 appear in plan frontmatter `requirements` fields.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | none found | — | Scanned all 4 sites' `src/` for TODO/FIXME/XXX/HACK/placeholder/coming-soon/emoji — zero hits. Documented stub comments (`<!-- rel=external: route lands in Phase 3 -->`, `<!-- JSON-LD: Phase 3 -->`, footer disclaimer stubs) are intentional, plan-scoped, and explicitly deferred per REQUIREMENTS.md phase mapping (Phase 3/4/5) — not anti-patterns. |

### Human Verification Required

None blocking. The phase's own 02-VALIDATION.md designates two items as manual-only (visual brand distinction, keyboard/focus/reduced-motion feel) — these are already corroborated: the orchestrator confirmed all four live subpaths render distinct fonts/palettes/headlines matching the design specs, and the code-level artifacts (tokens.css, app.html, built HTML) independently confirm the same distinct values byte-for-byte. No further human action is required to close this phase; a casual live tab-through is good practice but not a gap.

### Gaps Summary

None. All 4 observable truths verified, all artifacts exist/substantive/wired, all key links wired, CI green (run 28842122570), local re-verification of svelte-check + BASE_PATH build + empty-BASE_PATH build + portability grep passed clean on all 4 sites, and requirements INFRA-04/INFRA-06/QUAL-01/QUAL-02/QUAL-03 are all satisfied with direct evidence.

---

*Verified: 2026-07-07*
*Verifier: Claude (gsd-verifier)*
