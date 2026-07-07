# Phase 1: Deploy Pipeline (Walking Skeleton) - Research

**Researched:** 2026-07-06
**Domain:** Multi-site static SvelteKit monorepo → single GitHub Pages deployment (CI matrix → assemble → single deploy)
**Confidence:** HIGH (core toolchain + workflow shape proven by two deployed fleet sites; versions verified against npm registry same day)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Placeholder strategy**
- **D-01:** The four site folders are scaffolded as *minimal real SvelteKit apps* (raj_one toolchain: Kit 2 + Svelte 5 + adapter-static + inline vite.config.ts, own package.json/lockfile) with a single placeholder page each — the pipeline must be proven against real `npm ci` + `BASE_PATH` builds, not hand-copied HTML.
- **D-02:** Placeholder page = site name + "coming soon" one-liner + link back to hub. No design-system styling yet (Phase 2).
- **D-03:** Each placeholder `+layout.ts` already sets the prerender contract (`prerender = true`, `trailingSlash = 'always'`) — never `ssr = false`.

**Hub page + 404**
- **D-04:** Hub `pages-root/index.html` is committed static HTML (no build step): simple styled directory — wordmark "raj", four link cards (site name + one-liner). All links relative (`./vfamigos/`), never root-absolute.
- **D-05:** `pages-root/404.html` shares the hub's look, says "page not found", links the four sites + hub. One root 404 for the whole deployment (Pages constraint).
- **D-06:** `.nojekyll` shipped in the artifact root (harmless insurance).

**Deploy workflow shape**
- **D-07:** `.github/workflows/deploy.yml`: `build` job = matrix over [vfamigos, lipool, lidentist, cannaworldnews], `fail-fast: false`, per-site npm cache via `cache-dependency-path`, `BASE_PATH=/${{ github.event.repository.name }}/${{ matrix.site }}`, upload via plain `actions/upload-artifact@v4` named `site-<name>`.
- **D-08:** `assemble` job: checkout (for pages-root/), `actions/download-artifact@v4` with pattern `site-*` → rename nested dirs into `_site/<site>/` → copy hub/404/.nojekyll → **assert exactly four `<site>/index.html` files exist** (fail loudly otherwise) → single `upload-pages-artifact@v3`.
- **D-09:** `deploy` job: `deploy-pages@v4`, github-pages environment. `concurrency: group: pages, cancel-in-progress: true`. `workflow_dispatch` enabled for manual re-runs.
- **D-10:** `configure-pages@v5` with `enablement: true` in assemble; the known first-enable race is an expected checkpoint — if the first run 404s/errors, manually set Settings→Pages→Source=GitHub Actions and re-run via workflow_dispatch. Document this in the workflow file comments and verify step.

### Claude's Discretion
- Exact hub/404 visual styling (keep it tasteful, dark-neutral, zero dependencies)
- Placeholder page copy
- Node version pin (22, matching raj_one workflow) and action minor versions

### Deferred Ideas (OUT OF SCOPE)
- Design-system shells, CI portability grep, svelte-check gate → Phase 2
- Real content/routes → Phase 3; conversion paths → Phase 4; SEO/compliance → Phase 5
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| **INFRA-01** | A visitor can reach all four sites from one GitHub Pages deployment at `wolfwdavid.github.io/raj/<site>/` after a single push to main | Matrix build → assemble → single `upload-pages-artifact`/`deploy-pages`. Assemble asserts 4 `<site>/index.html` exist (Code Examples §deploy.yml). Post-deploy WebFetch/curl smoke of all four subpaths (Validation Architecture). |
| **INFRA-02** | A visitor can navigate a hub page at `/raj/` linking to all four sites (relative links) | `pages-root/index.html` committed static HTML, copied to `_site/index.html`; relative `./vfamigos/` links resolve correctly because index is always served at `/raj/` (Code Examples §hub). |
| **INFRA-03** | A visitor hitting an unknown URL gets a styled root 404 page linking to the four sites | `pages-root/404.html` copied to `_site/404.html`. **Finding: relative links break in a 404 served from depth** — recommend `<base href="/raj/">` (Open Question 1). Validated by curl of a bad URL expecting 404 + link presence. |

*INFRA-04/05/06/07 (independent builds w/ + w/o BASE_PATH, full prerender, portability grep, deep-link/hard-refresh) are Phase 2–3 per REQUIREMENTS.md traceability — do NOT gate Phase 1 on them, but the scaffold below is chosen so they pass later without rework.*
</phase_requirements>

## Summary

This is a **walking-skeleton** phase: the goal is to prove the single-Pages-deployment CI pattern (matrix build → assemble one `_site/` → single deploy) end-to-end against trivial content, so every later phase rides an unchanged pipeline. The architecture is pre-approved and already validated in `.planning/research/ARCHITECTURE.md`; this document resolves the concrete *file-level* questions the planner needs: exact per-site scaffold, Windows lockfile generation, the full `deploy.yml`, local pre-push verification, and how each success criterion is validated.

The toolchain is not speculative — it is **ground truth**. Two deployed sibling sites (`raj_one`, `raj_two`) use this exact stack (Kit 2 + Svelte 5 runes + adapter-static + **inline `sveltekit({...})` config, no `svelte.config.js`**) and deploy successfully to GitHub Pages. The inline-config pattern is a documented SvelteKit feature since Kit 2.62.0 (verified against svelte.dev). The one novel element vs. those single-site ancestors is the **matrix→assemble→single-deploy** shape, because GitHub allows exactly one Pages deployment per repo — you cannot call `upload-pages-artifact` per matrix leg.

Two things the planner must not treat as automatic: (1) the **Pages first-enable race** — the first green workflow can still 404; treat "Settings→Pages→Source=GitHub Actions, then re-run" as a manual checkpoint, not a bug; and (2) **`download-artifact@v4` nests** each artifact under `_artifacts/site-<name>/`, so the assemble step must copy from that exact path and assert four `index.html` files exist before uploading.

**Primary recommendation:** Author four minimal SvelteKit apps by hand (no `create-svelte` CLI) by cloning raj_one's file set minus `ssr=false` and minus `adapter-auto`, generate one committed `package-lock.json` per site with `npm install`, and ship the exact `deploy.yml` in §Code Examples. Gate success on the assemble-job assertions plus a post-deploy curl smoke of `/raj/`, four subpaths, and a bad URL.

## Standard Stack

### Core (per site — versions verified via `npm view`, 2026-07-06)

| Library | Pin (range) | Latest today | Purpose | Why Standard |
|---------|-------------|--------------|---------|--------------|
| `@sveltejs/kit` | `^2.63.0` | 2.69.1 | App framework / router / prerender | Fixed stack; proven by raj_one/raj_two. Kit 3 is `next`-only — do not adopt. |
| `svelte` | `^5.56.1` | 5.56.4 | UI framework (runes) | Fixed stack. Runes forced on via `compilerOptions.runes` in vite.config.ts. |
| `@sveltejs/adapter-static` | `^3.0.10` | 3.0.10 | Prerender whole site to static files | The only correct adapter for Pages. **Not** `adapter-auto`. |
| `@sveltejs/vite-plugin-svelte` | `^7.1.2` | 7.1.4 | Svelte compile in Vite | Ships with Kit 2 on Vite 8 (v7 line). |
| `vite` | `^8.0.16` | 8.1.3 | Build tool | Kit config lives inline here; no `svelte.config.js`. |
| `typescript` | `^6.0.3` | 6.0.3 | Types | Fixed stack. |
| `svelte-check` | `^4.6.0` | 4.7.1 | Type/a11y diagnostics | Present for parity; the `check` gate is Phase 2, but wire the script now. |
| `@types/node` | `^25.9.3` | 26.1.0 | Node types (for `process.env` in vite.config) | Matches fleet; version need not match the CI Node 22 runtime. |

**Drop from the raj_one clone:** `@sveltejs/adapter-auto` (raj_one lists it but never uses it — CONTEXT D-01/D-07 confirm dropping it).

**No supporting libraries this phase.** `marked`, `gray-matter`, `enhanced-img`, form/checkout stubs are all Phase 3+ concerns. The walking skeleton has zero runtime dependencies.

**Installation (per site, run inside each folder):**
```bash
# authored by hand, then:
npm install    # resolves ranges to latest + generates package-lock.json (commit it)
```

**Version verification (done):** `npm view` on 2026-07-06 returned the "Latest today" column above. All core packages match `.planning/research/STACK.md`; `svelte-check` and `@types/node` have floated one minor/major since raj_one was scaffolded — the `^` ranges absorb this cleanly.

### GitHub Actions (pinned per CONTEXT D-07..D-10)

| Action | Version | Role |
|--------|---------|------|
| `actions/checkout` | v4 | source (build legs need site; assemble needs `pages-root/`) |
| `actions/setup-node` | v4 | Node 22 + per-site npm cache |
| `actions/upload-artifact` | v4 | **plain** artifact per matrix leg, `name: site-<site>` |
| `actions/download-artifact` | v4 | pull all `site-*` into assemble (nests — see Pitfall 2) |
| `actions/configure-pages` | v5 | `enablement: true` (idempotent; first run may no-op — Pitfall 1) |
| `actions/upload-pages-artifact` | v3 | the **one** Pages artifact, from `_site/` |
| `actions/deploy-pages` | v4 | single deploy to `github-pages` environment |

## Architecture Patterns

### Recommended repo structure (after this phase)
```
raj/
├── .github/workflows/deploy.yml       # matrix build → assemble → single deploy
├── pages-root/                        # committed, NOT built by SvelteKit
│   ├── index.html                     # hub at /raj/  (relative ./<site>/ links)
│   ├── 404.html                       # single root 404 (use <base href> — Open Q1)
│   └── .nojekyll                       # empty file, belt-and-suspenders
├── vfamigos/                          # ┐
├── lipool/                            # ├ four hand-authored minimal SvelteKit apps
├── lidentist/                         # │  (each: own package.json + package-lock.json)
└── cannaworldnews/                    # ┘
```

### Per-site minimal file set (exact — resolves Open Question 1 of the brief)
```
<site>/
├── package.json          # deps below; scripts dev/build/preview/prepare/check; "type":"module"
├── package-lock.json      # generated by `npm install`, COMMITTED (npm ci needs it)
├── vite.config.ts         # inline sveltekit({adapter, paths.base=BASE_PATH, compilerOptions.runes})
├── tsconfig.json          # extends ./.svelte-kit/tsconfig.json (copy raj_one verbatim)
├── .npmrc                 # engine-strict=true (copy raj_one; optional but parity)
├── .gitignore             # copy raj_one (node_modules,/build,/.svelte-kit) — aids future extraction
├── static/                # OPTIONAL — include static/favicon.svg to avoid a console 404 (see note)
└── src/
    ├── app.html           # minimal — STRIP raj_one's Google-Fonts <link> + dashboard description
    ├── app.d.ts           # standard boilerplate (copy raj_one verbatim)
    └── routes/
        ├── +layout.ts     # prerender=true; trailingSlash='always'  (NO ssr=false)
        ├── +layout.svelte # minimal shell: {@render children()}  (drop favicon import)
        └── +page.svelte   # placeholder: <h1>site</h1> + "coming soon" + <a href="../">hub</a>
```

**Notes on the file set:**
- **No `svelte.config.js`** — config is inline in `vite.config.ts`. Documented since Kit 2.62.0: *"you can pass configuration directly, in which case svelte.config.js is ignored."* Proven by raj_one **and** raj_two.
- **`static/` is optional.** adapter-static builds fine with no `static/` dir. Including `static/favicon.svg` (and referencing it) avoids a browser 404 for `/favicon.ico`; if omitted, add nothing and accept the harmless 404. Git does not track empty dirs — if you want the dir without a favicon, add `static/.gitkeep`.
- **`+layout.svelte` drops the favicon import** raj_one has (`import favicon from '$lib/assets/favicon.svg'`) so no asset is required. If you keep a favicon, put it in `static/` and reference `{base}/favicon.svg` or a Vite import — never root-absolute.
- **The four site folders are plain tracked directories, NOT nested git repos.** raj_one/raj_two are standalone repos and are gitignored via `raj_*/`. The new folders (`vfamigos` etc.) do **not** match `raj_*/`, so they commit normally. **Never `git init` inside them.**

### Pattern 1: One Pages deployment, many sites (matrix → assemble → single deploy)
**What:** Build each site in a `fail-fast: false` matrix producing a **plain** `actions/upload-artifact@v4` named `site-<site>`; a single downstream job assembles them under `_site/<site>/` and does the **one** `upload-pages-artifact` + `deploy-pages`.
**When:** Any time N static apps share one `github.io/<repo>/` origin (GitHub allows exactly one Pages deployment per repo).
**Critical distinction from raj_one:** raj_one uses `upload-pages-artifact@v3` directly because it is one site. The monorepo must reserve that single call for the assemble job. See full YAML in §Code Examples.

### Pattern 2: BASE_PATH flows from repo name + matrix site (zero hardcoded `/raj/`)
**What:** `BASE_PATH=/${{ github.event.repository.name }}/${{ matrix.site }}` → Vite `paths.base` → every `{base}`-prefixed link and Vite-imported asset. Nothing hardcodes `/raj/`.
**Local dev/custom-domain:** with `BASE_PATH` unset, `paths.base` is `''`. The placeholder's "back to hub" link uses relative `../` (not `{base}`-prefixed, not root-absolute) so it survives both the Pages subpath and the future portability grep (INFRA-06).

### Pattern 3: Prerender contract in every `+layout.ts`
```ts
export const prerender = true;
export const trailingSlash = 'always';   // Pages serves /a/index.html for /a/ but won't rewrite /a → /a.html
// do NOT set ssr = false  (raj_one's dashboard sets it; it ships empty HTML — fatal for SEO sites later)
```
`trailingSlash='always'` makes the root route emit `index.html` (served correctly at `/raj/<site>/`). No dynamic routes exist yet, so **no `entries()` needed** this phase.

### Anti-Patterns to Avoid (from ARCHITECTURE.md, the ones live in Phase 1)
- **`upload-pages-artifact` inside the matrix** — same-named/single Pages artifact clobbers; use plain `upload-artifact@v4` with unique `name`.
- **Copying `ssr = false` from raj_one** — ships an empty `<body>`; forbidden by D-03/CLAUDE.md constraint.
- **`download-artifact` without handling nesting** — copies the wrong level; see Pitfall 2.
- **`fail-fast: true` on the build matrix** — hides which of the four sites failed.
- **Hardcoded `/raj/` or root-absolute assets** — breaks custom-domain cutover; the one *deliberate* exception is the hub/404 (repo infra that never extracts — see Open Question 1).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Static prerender to Pages | A custom HTML copier / manual export | `@sveltejs/adapter-static` | Emits `dir/index.html` per route + handles `paths.base`; hand-rolling misses trailing-slash + asset-base rewriting. |
| Merging N build outputs into one deployment | A bespoke deploy script | `upload-artifact@v4` (per leg) + `download-artifact@v4` + one `upload-pages-artifact@v3`/`deploy-pages@v4` | The official Pages flow provisions the environment, OIDC token, and atomic deploy. Rolling your own re-implements the first-enable + artifact plumbing wrong. |
| Base-path injection | String-replacing `/raj/` at build | `BASE_PATH` env → `paths.base` | Vite rewrites imported assets + `{base}` links automatically and reversibly (custom-domain ready). |
| Scaffolding the app | `create-svelte` interactive CLI | Author the ~10 files by hand (this doc) | CONTEXT requires files authored directly; the CLI is interactive and pulls in ESLint/Playwright/adapter-auto noise this walking skeleton doesn't want. |

**Key insight:** Everything risky in this phase is *plumbing* the official actions already solve. The only bespoke code is the ~15-line assemble shell script (rename + assert) — and its whole job is to fail loudly when the plumbing's known nesting/first-enable quirks bite.

## Runtime State Inventory

> This is a greenfield scaffold, but the deploy target has out-of-git state that a file audit misses. Included because it is load-bearing for INFRA-01.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no databases, no persisted runtime state. | None. |
| Live service config | **GitHub Pages source setting** for `wolfwdavid/raj` is NOT in git and NOT yet enabled. `configure-pages@v5 enablement:true` *should* set it but races on a fresh repo (Pitfall 1). | **Manual checkpoint:** after first push, Settings→Pages→Source = "GitHub Actions", then re-run via `workflow_dispatch`. Verified by curl of live subpaths. |
| OS-registered state | None (no self-hosted runners, no scheduled tasks). | None. |
| Secrets/env vars | Only `BASE_PATH` (injected by the workflow, not a secret). `GITHUB_TOKEN`/OIDC id-token are provided automatically by `permissions: {pages: write, id-token: write}`. No user secrets. | None to provision. |
| Build artifacts | Fresh `package-lock.json` × 4 must be generated locally (`npm install`) and committed before CI can `npm ci`. `build/`, `.svelte-kit/`, `node_modules/` are gitignored (root `.gitignore`, unanchored patterns cover site folders). | Generate + commit 4 lockfiles (see §Code Examples). |

**Verified:** root `.gitignore` ignores `raj_*/`, `node_modules/`, `build/`, `.svelte-kit/`; `.gitattributes` forces `eol=lf`. The four site folders are NOT matched by `raj_*/` and will commit; their lockfiles are NOT ignored.

## Common Pitfalls

### Pitfall 1: GitHub Pages first-enable race (green workflow, live 404)
**What goes wrong:** The first Actions run is green but `wolfwdavid.github.io/raj/` 404s; the `github-pages` environment may be missing. `enablement: true` soft-no-ops on a brand-new repo because Pages metadata doesn't exist yet.
**How to avoid:** Treat first-enable as a **manual step** (D-10): Settings→Pages→Source="GitHub Actions", then re-run via `workflow_dispatch`. Keep `enablement: true` for idempotency on later runs. Document this in the workflow header comment and in the phase's verify step.
**Warning signs:** green run + dead `page_url`; `github-pages` absent from repo Environments.

### Pitfall 2: `download-artifact@v4` nests each site one dir deeper
**What goes wrong:** With `pattern: site-*` + `path: _artifacts`, each artifact lands at `_artifacts/site-<name>/` (v4 changed nesting vs v3). A naive flat `cp` misses files → hub renders, sites 404 or you get `_site/vfamigos/vfamigos/`.
**How to avoid:** Copy from the exact nested path `cp -r "_artifacts/site-$site/." "_site/$site/"` and **assert** `_site/$site/index.html` exists per site + assert the count is 4. Fail the job otherwise (D-08).
**Warning signs:** doubled dir names; `_app/` missing under a site; only the hub renders.

### Pitfall 3: `upload-artifact@v4` excludes hidden files by default
**What goes wrong:** Since `upload-artifact@v4.4`, `include-hidden-files` defaults to `false`. SvelteKit's static output uses `_app/` (underscore, not hidden — safe), so this rarely bites the build legs, but any dotfile in `build/` would be silently dropped.
**How to avoid:** Set `include-hidden-files: true` and `if-no-files-found: error` on the build-leg upload as cheap insurance. The `.nojekyll` at `_site/` root is added by the assemble script and preserved by `upload-pages-artifact@v3` (which tars the dir, dotfiles included).
**Warning signs:** a file present in local `build/` missing after download.

### Pitfall 4: `ssr = false` copied from raj_one → empty `<body>`
**What goes wrong:** raj_one is a JS dashboard with `ssr=false`; copied verbatim it ships a hydration shell with no server-rendered content. Fatal for the SEO sites in later phases; even the placeholder should have real HTML.
**How to avoid:** `+layout.ts` sets **only** `prerender=true` + `trailingSlash='always'`. Never `ssr=false` (D-03, CLAUDE.md constraint). Verify: view-source of `build/index.html` shows the placeholder text in `<body>`.

### Pitfall 5: `trailingSlash` mismatch → deep-link 404 on Pages
**What goes wrong:** Without `trailingSlash='always'`, Kit may emit `/a.html` or client redirects Pages can't honor. Only manifests on the deployed host.
**How to avoid:** `trailingSlash='always'` in every `+layout.ts`; write internal links with a trailing slash (hub uses `./vfamigos/`). Verify on the live URL, not just dev.

### Pitfall 6: `npm ci` fails — lockfile missing or out of sync
**What goes wrong:** CI runs `npm ci`, which **requires** a committed `package-lock.json` in sync with `package.json`. If you forget to `npm install` locally, or edit `package.json` after generating the lockfile, `npm ci` errors.
**How to avoid:** `npm install` in each folder to generate the lockfile, commit all four, and never hand-edit `package.json` without re-running `npm install`. `.gitattributes eol=lf` keeps Windows-generated lockfiles from churning in CI.
**Warning signs:** `npm ci` error "package-lock.json ... is not in sync".

## Code Examples

### deploy.yml (full — resolves Open Question 3)
```yaml
# .github/workflows/deploy.yml
# FIRST DEPLOY: enablement:true below often no-ops on a brand-new repo (Pages first-enable race).
# If the first green run 404s, set Settings -> Pages -> Source = "GitHub Actions" by hand,
# then re-run this workflow via the "Run workflow" button (workflow_dispatch).
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false                       # surface all four sites' status every run
      matrix:
        site: [vfamigos, lipool, lidentist, cannaworldnews]
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
          cache-dependency-path: ${{ matrix.site }}/package-lock.json
      - run: npm ci
        working-directory: ${{ matrix.site }}
      - run: npm run build
        working-directory: ${{ matrix.site }}
        env:
          BASE_PATH: /${{ github.event.repository.name }}/${{ matrix.site }}   # e.g. /raj/vfamigos
      - uses: actions/upload-artifact@v4       # plain artifact — NOT upload-pages-artifact
        with:
          name: site-${{ matrix.site }}
          path: ${{ matrix.site }}/build
          if-no-files-found: error
          include-hidden-files: true

  assemble:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4              # for pages-root/
      - uses: actions/download-artifact@v4     # nests each under _artifacts/site-<name>/
        with:
          path: _artifacts
          pattern: site-*
      - name: Assemble _site
        run: |
          set -euo pipefail
          mkdir -p _site
          cp pages-root/index.html _site/index.html
          cp pages-root/404.html   _site/404.html
          cp pages-root/.nojekyll  _site/.nojekyll
          for site in vfamigos lipool lidentist cannaworldnews; do
            test -d "_artifacts/site-$site" || { echo "::error::missing artifact for $site"; exit 1; }
            mkdir -p "_site/$site"
            cp -r "_artifacts/site-$site/." "_site/$site/"
            test -f "_site/$site/index.html" || { echo "::error::missing index.html for $site"; exit 1; }
          done
          count=$(ls -1 _site/*/index.html | wc -l)
          test "$count" -eq 4 || { echo "::error::expected 4 site index.html, got $count"; exit 1; }
      - uses: actions/configure-pages@v5
        with:
          enablement: true                     # idempotent; may no-op on first run (see header)
      - uses: actions/upload-pages-artifact@v3 # the ONE Pages artifact
        with:
          path: _site

  deploy:
    needs: assemble
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### vite.config.ts (per site — copy raj_one; only the comment changes)
```ts
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    sveltekit({
      compilerOptions: {
        runes: ({ filename }) =>
          filename.split(/[/\\]/).includes('node_modules') ? undefined : true
      },
      adapter: adapter(),
      // '/raj/<site>' when built by the Pages workflow, '' for local dev/preview + custom domain
      paths: { base: (process.env.BASE_PATH ?? '') as '' | `/${string}` }
    })
  ]
});
```

### src/routes/+layout.ts (per site)
```ts
export const prerender = true;
export const trailingSlash = 'always';
// NEVER: export const ssr = false;
```

### src/routes/+layout.svelte (per site — minimal, no asset needed)
```svelte
<script lang="ts">
  let { children } = $props();
</script>

{@render children()}
```

### src/routes/+page.svelte (placeholder — copy is Claude's discretion, D-02)
```svelte
<script lang="ts">
  // "back to hub" is relative — resolves to /raj/ from /raj/<site>/, no hardcoded /raj/
</script>

<main>
  <h1>vfamigos</h1>
  <p>Coming soon.</p>
  <a href="../">&larr; raj hub</a>
</main>
```

### package.json (per site — raj_one minus adapter-auto)
```json
{
  "name": "vfamigos",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "prepare": "svelte-kit sync || echo ''",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.10",
    "@sveltejs/kit": "^2.63.0",
    "@sveltejs/vite-plugin-svelte": "^7.1.2",
    "@types/node": "^25.9.3",
    "svelte": "^5.56.1",
    "svelte-check": "^4.6.0",
    "typescript": "^6.0.3",
    "vite": "^8.0.16"
  }
}
```
`tsconfig.json`, `app.d.ts`, `.npmrc`, `.gitignore` — copy raj_one verbatim. `app.html` — copy raj_one but delete the two `<link ... fonts.googleapis>` lines and the dashboard `<meta name="description">`.

### Lockfile generation on Windows (resolves Open Question 2)
```powershell
# PowerShell, from repo root — run once per site to produce the committed package-lock.json
foreach ($s in "vfamigos","lipool","lidentist","cannaworldnews") {
  Push-Location $s; npm install; Pop-Location
}
# then commit the four package-lock.json files
```
- `npm install` (not `npm ci`) generates the lockfile; CI then uses `npm ci`.
- Local npm 11 writes `lockfileVersion: 3`, which CI's Node 22 npm 10 reads fine.
- `.gitattributes` (`* text=auto eol=lf`) normalizes the lockfiles to LF so they don't churn between Windows and Ubuntu CI.

### Local pre-push verification (resolves Open Question 4)
```powershell
# PowerShell — per site: build with the Pages base and assert output
cd vfamigos
npm ci
$env:BASE_PATH = "/raj/vfamigos"; npm run build; Remove-Item Env:\BASE_PATH
Test-Path build/index.html                                   # -> True
Select-String -Path build/index.html -Pattern "vfamigos"     # placeholder text present in <body>
Test-Path build/_app                                         # hydration assets present
npm run build                                                 # base='' build also succeeds (Phase-2 INFRA-04 smoke)
```
```bash
# bash equivalent
cd vfamigos && npm ci
BASE_PATH=/raj/vfamigos npm run build
test -f build/index.html && grep -q vfamigos build/index.html && test -d build/_app && echo OK
```

### hub / 404 (pages-root/, committed static — D-04/D-05)
```html
<!-- pages-root/index.html : always served at /raj/, so relative ./<site>/ links are correct -->
<a href="./vfamigos/">vfamigos — coming soon</a>
<!-- ...lipool/, lidentist/, cannaworldnews/ ... -->
```
```html
<!-- pages-root/404.html : served for ANY bad URL, so a bare relative link breaks from depth. -->
<!-- Put <base href="/raj/"> in <head> so ./vfamigos/ resolves to /raj/vfamigos/ regardless. -->
<head><base href="/raj/"> ... </head>
<body> ... <a href="vfamigos/">vfamigos</a> <a href="./">raj hub</a> ... </body>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `svelte.config.js` for adapter/paths | Inline `sveltekit({ adapter, paths, compilerOptions })` in `vite.config.ts` | Kit 2.62.0 | Keeps the single-config convention; `svelte.config.js` is ignored if inline config is passed. |
| Branch-based Pages (`gh-pages` push, Jekyll) | Actions Pages flow (`configure-pages`→`upload-pages-artifact`→`deploy-pages`) | Pages Actions GA | No Jekyll (so `_app/` is safe); OIDC-token deploy; `.nojekyll` is belt-and-suspenders only. |
| `upload-artifact@v3` (flat, mutable) | `@v4` (immutable, **nests** on download, hidden-files excluded by default) | v4 (2024) | Assemble must handle nesting + set `include-hidden-files: true`. |
| `adapter-auto` | `adapter-static` (explicit) | project constraint | Deterministic static export for Pages; drop `adapter-auto` from the clone. |

**Deprecated/outdated:** `ssr = false` for content sites (ships empty HTML); `adapter-auto` for Pages; assuming `upload-pages-artifact` can run per matrix leg.

## Open Questions

1. **404.html relative-link fragility (mild conflict with D-05).**
   - What we know: D-05 says the 404 uses relative links ("never root-absolute"). GitHub Pages serves the custom `404.html` at the *originally requested* (bad) URL with no redirect — so a bare relative `./vfamigos/` from `/raj/foo/bar/` resolves to `/raj/foo/bar/vfamigos/` and breaks.
   - What's unclear: whether D-05's "relative" intent forbids a `<base>` tag.
   - **Recommendation:** Add `<base href="/raj/">` to the 404's `<head>` and keep the links relative to that base. This honors "no root-absolute `href`s in body" while being robust from any depth. The `/raj/` in `<base>` is acceptable here because the hub/404 are repo infrastructure that never extract to a custom domain (unlike the four sites). The hub `index.html` needs no `<base>` (it's only ever served at `/raj/`). Flag this to the planner as a small deviation to confirm.

2. **`static/` dir per site — include or omit?**
   - What we know: adapter-static builds without a `static/` dir; a missing favicon only costs a harmless `/favicon.ico` 404.
   - **Recommendation:** Include `static/favicon.svg` (tiny, zero-dep) and reference it via a Vite import or `{base}` in `app.html` — cleaner and forward-compatible with Phase 2 branding. Acceptable to defer to Phase 2 and ship no `static/` now; do not add a root-absolute favicon link.

3. **Node types vs runtime.** `@types/node@^25` (fleet) vs CI Node 22. No functional impact for this trivial build (only `process.env` is touched). Keep `^25.9.3` for fleet parity; not worth pinning to `^22`.

## Validation Architecture

> Nyquist validation is enabled (`config.json workflow.nyquist_validation: true`). This phase has **no unit-test runner** — a deploy skeleton is validated by build-output assertions, CI job assertions, and live-URL smoke checks, not by a test framework. That is the honest, correct sampling instrument here.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (no jest/vitest/playwright). Validation = shell assertions + `curl`/WebFetch smoke. |
| Config file | None — see Wave 0. |
| Quick run command | `BASE_PATH=/raj/<site> npm run build` then assert `build/index.html` + `build/_app` (per site) |
| Full suite command | Push to main → workflow green (assemble asserts 4× `index.html`) → post-deploy `curl` smoke script |

### Phase Requirements → Validation Map
| Req ID | Behavior | Type | Automated Command | Exists? |
|--------|----------|------|-------------------|---------|
| INFRA-01 | Four sites reachable at `/raj/<site>/` from one deploy | build-assert + live smoke | assemble job: `test -f _site/$site/index.html` ×4 + `count -eq 4`; then `curl -sf .../raj/<site>/` ×4 | ❌ Wave 0 (assemble script + smoke script) |
| INFRA-02 | Hub at `/raj/` links four sites | live smoke | `curl -sf https://wolfwdavid.github.io/raj/` and assert body contains `vfamigos`…`cannaworldnews` | ❌ Wave 0 (smoke script) |
| INFRA-03 | Styled 404 for unknown URL, links four sites | live smoke | `curl -s -o /dev/null -w '%{http_code}' https://wolfwdavid.github.io/raj/nonexistent/` → `404`; fetch body, assert links | ❌ Wave 0 (smoke script) |

### Sampling Rate
- **Per task / local (quick):** `BASE_PATH=/raj/<site> npm run build` + assert `index.html` contains the placeholder text and `_app/` exists (per site touched).
- **Per push (full):** workflow runs; the **assemble job's built-in assertions** are the CI gate — a missing or extra site `index.html` fails the deploy loudly.
- **Phase gate (once, after first-enable):** run the post-deploy smoke script below; all six checks green before `/gsd:verify-work`.

```bash
# post-deploy smoke — run after manual Pages enable + green workflow
BASE=https://wolfwdavid.github.io/raj
for p in "" vfamigos/ lipool/ lidentist/ cannaworldnews/; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/$p"); echo "$code  $BASE/$p"   # expect 200
done
code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/nonexistent/"); echo "$code  (expect 404)"
```

### Wave 0 Gaps
- [ ] Assemble-job assertion block in `deploy.yml` (4× `index.html` + count == 4) — covers INFRA-01
- [ ] `pages-root/index.html` + `404.html` + `.nojekyll` — covers INFRA-02, INFRA-03
- [ ] Post-deploy smoke script (curl the six URLs) — covers INFRA-01/02/03 against the live host
- [ ] Manual first-enable checkpoint documented in workflow header + phase verify step (Pitfall 1)
- [ ] No test-framework install needed — do not add jest/vitest/playwright this phase

*(A `check` script is wired into each `package.json` for Phase 2's svelte-check gate, but running it is not a Phase-1 gate.)*

## Sources

### Primary (HIGH confidence)
- `raj/raj_one/` and `raj/raj_two/` — two deployed sibling sites proving the exact toolchain + inline-config pattern (workflow, `vite.config.ts`, `package.json`, scaffold) — ground truth.
- `npm view` (2026-07-06) — verified latest: kit 2.69.1, adapter-static 3.0.10, svelte 5.56.4, vite 8.1.3, typescript 6.0.3, vite-plugin-svelte 7.1.4, svelte-check 4.7.1, @types/node 26.1.0.
- svelte.dev/docs/kit/configuration — inline `sveltekit()` config since Kit 2.62.0; `svelte.config.js` ignored when inline config passed.
- svelte.dev/docs/kit/adapter-static — `trailingSlash`, `paths.base`, prerender-to-`build`, `.nojekyll` behavior.
- `.planning/research/{ARCHITECTURE,PITFALLS,STACK}.md` — pre-validated design, pitfalls, versions.
- Repo `.gitignore` / `.gitattributes` / `git remote` inspected directly.

### Secondary (MEDIUM confidence)
- `actions/upload-artifact` v4 nesting + `include-hidden-files` default-false behavior — established v4 change, cross-referenced with ARCHITECTURE.md and PITFALLS.md.
- GitHub Pages first-enable race — fleet-proven (raj_one/raj_two history) + STATE.md blocker.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified same day; two deployed reference sites use the identical toolchain.
- Architecture / workflow shape: HIGH — pre-validated in ARCHITECTURE.md; inline-config confirmed by docs + ground truth.
- Pitfalls: HIGH — first-enable race and download-artifact nesting are fleet-proven and independently documented.
- 404 relative-link finding: MEDIUM — Pages 404 serving behavior is well-established; the `<base href>` recommendation slightly deviates from D-05 and needs planner sign-off.

**Research date:** 2026-07-06
**Valid until:** ~2026-08-06 (stable toolchain; re-verify action major versions and Kit line if revisited later).
