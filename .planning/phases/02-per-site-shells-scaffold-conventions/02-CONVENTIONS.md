# 02 — Shell Conventions (copy-ready)

**Single source of truth for the four site shells.** Plans 02-02 (vfamigos + lipool) and
02-03 (lidentist + cannaworldnews) copy from this document verbatim, substituting the
site-specific values (shown as `<PLACEHOLDER>`) from each site's design spec in
`.planning/design/<site>.md`. Do not re-derive these patterns per site — copy and fill.

**Governing decisions:** D-01…D-11 in `02-CONTEXT.md`. **Guardrails they must pass:** the
`svelte-check` gate + empty-`BASE_PATH` build + built-HTML portability grep now live in
`.github/workflows/deploy.yml` (see 02-01).

**Non-negotiables carried from Phase 1 (do NOT change):**

- `src/routes/+layout.ts` keeps `export const prerender = true;` and
  `export const trailingSlash = 'always';` and **never** `export const ssr = false;`
  (an `ssr=false` layout ships an empty `<body>` and kills SEO — fleet-proven pitfall).
- No `svelte.config.js`; all Kit config stays inline in `vite.config.ts`.
- No Tailwind / no CSS framework — plain scoped Svelte `<style>` + the CSS-variable token
  layer only (D-03).
- Every internal link is `{base}`-prefixed (`$app/paths`) or a Vite-imported asset — zero
  hardcoded `/raj/`, zero root-absolute `href="/…"` / `src="/…"` (portability guard fails
  the build otherwise).

---

## 1. Token layer — `src/lib/styles/tokens.css` (D-01 / D-02 / D-03)

Each site ships one `src/lib/styles/tokens.css` defining its palette as CSS custom
properties on `:root`. Copy the **exact hex values and token names** from the site's palette
table in `.planning/design/<site>.md` — do not invent tokens or reuse another site's colors.
The `--font-heading` / `--font-body` families MUST match the `app.html` `<link>` (section 2).

```css
:root {
  /* palette — copy exact hex + token names verbatim from .planning/design/<site>.md */
  --color-primary: <HEX>;
  --color-on-primary: <HEX>;
  --color-secondary: <HEX>;
  --color-accent: <HEX>;
  --color-background: <HEX>;
  --color-surface: <HEX>;
  --color-foreground: <HEX>;
  --color-text: <HEX>;
  --color-muted: <HEX>;
  --color-border: <HEX>;
  --color-destructive: <HEX>;
  /* ...include every row from the site's palette table... */
  --color-ring: <HEX>;

  /* fonts — families must match the app.html <link> in section 2 */
  --font-heading: '<Heading Family>', system-ui, sans-serif;
  --font-body: '<Body Family>', system-ui, sans-serif;
}
```

**Worked example — vfamigos** (from `.planning/design/vfamigos.md`, illustrative only; each
site fills its own):

```css
:root {
  --color-primary: #E11D48;
  --color-on-primary: #FFFFFF;
  --color-secondary: #FB7185;
  --color-accent: #2563EB;
  --color-background: #FFF1F2;
  --color-surface: #FFFFFF;
  --color-foreground: #881337;
  --color-text: #3F1220;
  --color-muted: #F0ECF2;
  --color-border: #FECDD3;
  --color-destructive: #DC2626;
  --color-ring: #E11D48;
  --font-heading: 'Fredoka', system-ui, sans-serif;
  --font-body: 'Nunito', system-ui, sans-serif;
}
```

Imported once in `+layout.svelte` (section 3) via `import '$lib/styles/tokens.css';`.

**Per-site font families / accents (from the design specs):**

| Site           | Heading        | Body           | Primary hint                       |
| -------------- | -------------- | -------------- | ---------------------------------- |
| vfamigos       | Fredoka        | Nunito         | rose `#E11D48` + blue CTA `#2563EB` |
| lipool         | Poppins        | Open Sans      | water blue `#0284C7` (NOT purple)  |
| lidentist      | Lexend         | Source Sans 3  | cyan `#0891B2` + green CTA         |
| cannaworldnews | Libre Bodoni   | Public Sans    | near-black + green accent `#15803D` |

Always confirm the exact rows against `.planning/design/<site>.md` before copying.

---

## 2. Fonts in `app.html` (D-02)

Load Google Fonts with `<link>` (not `@import`) inside `<head>` of each site's
`src/app.html`, for performance. Use the same family+weight query string the design spec's
`@import` line uses, with `display=swap`. Keep the existing `%sveltekit.head%` and favicon
line intact.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=<Heading+Family>:wght@<weights>&family=<Body+Family>:wght@<weights>&display=swap" rel="stylesheet" />
```

**Worked example — vfamigos** (weights per its spec; each site fills its own families):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

> These are absolute `https://fonts.googleapis.com/...` URLs, so they do NOT trip the
> portability guard (which only flags root-absolute `href="/…"` / `src="/…"`). Keep them
> absolute; never rewrite font URLs to `{base}`.

The current `app.html` (all four sites, from Phase 1) is:

```html
<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/favicon.svg" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

Insert the three font `<link>`s between the `viewport` meta and `%sveltekit.head%`.

---

## 3. `+layout.svelte` skeleton (D-04 / D-11)

Replaces the Phase-1 placeholder (`<script>let { children } = $props();</script>{@render children()}`).
Imports the token layer, renders the shell around the routed page, and establishes the a11y
baseline (skip-link → `#main`, landmarks, global focus ring, reduced-motion).

```svelte
<script lang="ts">
  import '$lib/styles/tokens.css';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  let { children } = $props();
</script>

<a class="skip-link" href="#main">Skip to content</a>
<SiteHeader />
<main id="main">{@render children()}</main>
<SiteFooter />

<style>
  .skip-link {
    position: absolute; left: -9999px; top: 0; z-index: 100;
    background: var(--color-primary); color: var(--color-on-primary);
    padding: .75rem 1rem; border-radius: 0 0 8px 0;
  }
  .skip-link:focus { left: 0; }
  :global(body) {
    margin: 0; font-family: var(--font-body);
    background: var(--color-background); color: var(--color-text, var(--color-foreground));
  }
  :global(h1), :global(h2), :global(h3) { font-family: var(--font-heading); }
  :global(:focus-visible) { outline: 3px solid var(--color-ring); outline-offset: 2px; }
  @media (prefers-reduced-motion: reduce) {
    :global(*) { animation: none !important; transition: none !important; scroll-behavior: auto !important; }
  }
</style>
```

**Leave `+layout.ts` untouched** — the prerender contract (`prerender = true`,
`trailingSlash = 'always'`, no `ssr = false`) is already correct from Phase 1.

---

## 4. `SiteHeader.svelte` skeleton (D-04 / D-05 / D-07)

`<header>` containing `<nav aria-label="Primary">`. **Every internal link uses `{base}` from
`$app/paths`** — never a hardcoded path, never a bare `/route/`. Icons are inline SVG
(Lucide-style hand-authored paths), **never emoji** (D-07). Interactive targets ≥44px.

```svelte
<script lang="ts">
  import { base } from '$app/paths';
</script>

<header>
  <nav aria-label="Primary">
    <a class="brand" href="{base}/"><!-- wordmark / logo (inline SVG or text) --></a>
    <ul>
      <!-- see section 5 (Nav rule) for when rel="external" is required -->
      <li><a href="{base}/<route>/" rel="external"><!-- label --></a></li>
    </ul>
  </nav>
</header>

<style>
  /* scoped styles use the tokens: var(--color-primary), var(--font-heading), etc. */
  nav a { min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; }
</style>
```

**Per-site nav content (D-05, from the design specs):**

| Site           | Nav items                                                        |
| -------------- | --------------------------------------------------------------- |
| vfamigos       | logo · Shop · About · Cart (count badge, `aria-label`)          |
| lipool         | logo · Services · Gallery · Get Quote · click-to-call `tel:`    |
| lidentist      | logo · Find a Dentist · How it Works · Appointment              |
| cannaworldnews | wordmark · region nav: Americas / Europe / Africa / Asia-Pacific |

The click-to-call `tel:` link (lipool) is an absolute `tel:` URL — not root-absolute, so it
does not trip the guard and needs no `{base}`.

---

## 5. Nav rule — PRERENDER-SAFE (critical, D-04) — SIGN-OFF

The SvelteKit prerender crawler follows every same-origin `<a href>` it finds. If it follows
a link to a route that does not exist yet, the build **fails**. Classify every nav link:

- **Home / current-site link `{base}/`** — the route EXISTS today → normal anchor, crawlable,
  **no `rel`**.
- **Same-page section anchors** (`#services`, `#directory`, `#how`, `#region`) — same page,
  crawler-safe → **no `rel`**.
- **Cross-route links to Phase-3 routes that do NOT exist yet** (`{base}/products/`,
  `{base}/gallery/`, `{base}/appointment/`, `{base}/dentists/`, `{base}/region/americas/`,
  `{base}/articles/…/`, etc.) — MUST carry **`rel="external"`** so the prerender crawler does
  not follow them into a missing route and fail the build.

Mark each guarded link so Phase 3 knows to remove the guard:

```svelte
<li>
  <!-- rel=external: route lands in Phase 3; drop rel then -->
  <a href="{base}/products/" rel="external">Shop</a>
</li>
```

This is the exact pattern Phase 1 proved on the hub back-link (the hub lives at `/raj/`,
outside each app's `/raj/<site>` base). **DECISION CONFIRMED:** use real route hrefs now (NOT
`#` stubs), each not-yet-built route guarded by `rel="external"`; Phase 3 removes
`rel="external"` from each link as its route lights up.

---

## 6. `SiteFooter.svelte` skeleton (D-05)

`<footer>` with a brand line + a nav echo. Per-site stubs (full copy is later phases):

```svelte
<script lang="ts">
  import { base } from '$app/paths';
</script>

<footer>
  <p class="brand-line"><!-- <SITE> — one-line brand / tagline --></p>
  <nav aria-label="Footer">
    <!-- echo the primary nav; same rel="external" rule as section 5 applies -->
  </nav>
  <!-- per-site stub block: -->
  <!-- lipool / lidentist: NAP-ready block (Name / Address / Phone placeholders) -->
  <!-- lidentist: "Sample data — not real reviews" note stub (full FTC labeling = Phase 3/5) -->
  <!-- cannaworldnews: "Informational only — not legal or medical advice" disclaimer stub -->
  <!--                  (full cannabis/FTC compliance copy = Phase 5) -->
</footer>
```

Footer nav links obey the same section-5 `rel="external"` rule for not-yet-built routes.

---

## 7. A11y checklist (D-11) — every shell must satisfy

- Semantic landmarks: `<header>` / `<nav aria-label="…">` / `<main id="main">` / `<footer>`.
- Exactly **one `<h1>` per page**.
- **Skip-link** first in the DOM, targeting `#main` (`href="#main"`), visible on focus.
- Visible **3px focus ring** on `--color-ring` via `:focus-visible` (see section 3).
- **≥44px** interactive touch targets (nav links, buttons).
- **`prefers-reduced-motion: reduce`** honored — animations/transitions/smooth-scroll disabled.
- All interactive elements keyboard-operable (native `<a>` / `<button>`; no div-clicks).
- Contrast **≥4.5:1** for text (design-spec palettes are pre-verified; keep text on
  surface/near-white, never rose-on-rose etc.).
- Inline **SVG icons, never emoji** (D-07).

**lidentist is held to the highest bar** — its design spec is the a11y exemplar for the fleet.

---

## 8. Per-site verify recipe (Windows Git Bash)

Run from the repo root, once per site, before committing that site's shell.
`MSYS_NO_PATHCONV=1` stops Git Bash from mangling `BASE_PATH=/raj/<site>` into a Windows path.

```bash
cd <site> && npm run check && MSYS_NO_PATHCONV=1 BASE_PATH=/raj/<site> npm run build \
  && grep -rE '(href|src)="/[^/]' build --include="*.html" && echo "LEAK (fail)" || echo "portable"
```

Interpretation: `npm run check` must exit 0 (svelte-check gate). The build must succeed. The
final `grep` should print **nothing** and the `|| echo "portable"` branch should run — meaning
no root-absolute `href`/`src` leaked. (The base-derived hydration `assets: "/raj/<site>"` JSON
is NOT an `href=`/`src=` attribute, so it is correctly ignored — do not "fix" it.) These are
the same three gates CI enforces in `deploy.yml`; passing locally means the CI leg passes.

Also sanity-check the empty-base build (custom-domain readiness, mirrors the CI step):

```bash
cd <site> && BASE_PATH='' npm run build && echo "empty-base build OK"
```
