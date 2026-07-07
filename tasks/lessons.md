# Lessons — raj monorepo

## SvelteKit adapter-static prerender: `rel="external"` sequencing (caught twice by plan-checker)

**Pattern:** When a component links to a dynamic route with a plain `<a href="{base}/thing/{slug}/">` (no `rel`), the adapter-static prerender crawler *follows* that link during `npm run build`. SvelteKit's default `handleHttpError` **throws** on a 404, so if the target route doesn't exist yet the build fails.

**Rule for myself:** In any multi-task plan that (a) renders a card/link to a dynamic route AND (b) creates that route in a *later* task AND (c) runs a full `npm run build` in the earlier task's verify — the earlier build crashes. Fix: give the link a temporary `rel="external"` in the task that creates the link, then STRIP it in the same task that creates the route + `entries()`. That later build is the first legal crawl of the live link. Phase-4-and-beyond routes that genuinely don't exist yet keep `rel="external"` until their phase.

**Why it kept recurring:** it's an intra-plan sequencing hazard, invisible unless you trace which task first runs a build vs which task creates the route. The plan-checker caught it in both Phase 3 (3 plans) and Phase 4 (1 plan) by reading `@sveltejs/kit/src/core/postbuild/crawl.js` directly. Bake the temp-rel-then-strip pattern into card-link plans from the start.

## localStorage crashes prerender unless browser-guarded

Any `localStorage`/`window` access at Svelte module top-level runs during the Node prerender pass and crashes the build. Guard with `import { browser } from '$app/environment'` and hydrate in `onMount`/`$effect`, never at module load. Acceptance criterion = "BASE_PATH build succeeds" (build survival proves the guard).

## Portability grep must target attribute values, not raw `/raj/`

A naive `grep /raj/` over built HTML false-positives on SvelteKit's base-derived hydration JSON (`assets:"/raj/site"`). The correct guard is `(href|src)="/[^/]` — catches root-absolute nav leaks while ignoring `./` relative, `//` protocol-relative, `https://` absolute (canonical/OG), and the hydration JSON. Source-level `/raj/` greps also false-positive on code comments.

## GitHub Pages first-enable race

On a brand-new repo, `configure-pages@v5` with `enablement: true` fails the first run ("Resource not accessible by integration"). Fix without waiting: `gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow`, then re-run via `workflow_dispatch`. Treat as an expected one-time manual checkpoint, not a bug.

## No-fake-success compliance grep must whitelist legitimate success surfaces

The site-wide "no fabricated success" audit grep must EXCLUDE the real Stripe post-payment redirect page (`/thanks/`, which legitimately says "order is confirmed"). Use `if grep -qiE ...; then exit 1; fi` (grep's not-found exit = pass), and exclude the legit page path.

## Windows Git Bash mangles `BASE_PATH=/raj/x`

MSYS path conversion turns `/raj/x` into a Windows path. Prefix builds with `MSYS_NO_PATHCONV=1`. CI (Ubuntu) is unaffected.
