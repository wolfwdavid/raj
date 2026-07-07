# Phase 1: Deploy Pipeline (Walking Skeleton) - Context

**Gathered:** 2026-07-06
**Status:** Ready for planning

<domain>
## Phase Boundary

Prove the single-Pages-deployment CI pattern (matrix build → assemble → single deploy) against trivial content. One push to main serves a hub at `wolfwdavid.github.io/raj/` linking four placeholder site subpaths, plus a styled root 404. No site features, no design systems, no content — Phase 2+ owns those.

</domain>

<decisions>
## Implementation Decisions

### Placeholder strategy
- **D-01:** The four site folders are scaffolded as *minimal real SvelteKit apps* (raj_one toolchain: Kit 2 + Svelte 5 + adapter-static + inline vite.config.ts, own package.json/lockfile) with a single placeholder page each — the pipeline must be proven against real `npm ci` + `BASE_PATH` builds, not hand-copied HTML.
- **D-02:** Placeholder page = site name + "coming soon" one-liner + link back to hub. No design-system styling yet (Phase 2).
- **D-03:** Each placeholder +layout.ts already sets the prerender contract (`prerender = true`, `trailingSlash = 'always'`) — never `ssr = false`.

### Hub page + 404
- **D-04:** Hub `pages-root/index.html` is committed static HTML (no build step): simple styled directory — wordmark "raj", four link cards (site name + one-liner). All links relative (`./vfamigos/`), never root-absolute.
- **D-05:** `pages-root/404.html` shares the hub's look, says "page not found", links the four sites + hub. One root 404 for the whole deployment (Pages constraint).
- **D-06:** `.nojekyll` shipped in the artifact root (harmless insurance).

### Deploy workflow shape
- **D-07:** `.github/workflows/deploy.yml`: `build` job = matrix over [vfamigos, lipool, lidentist, cannaworldnews], `fail-fast: false`, per-site npm cache via `cache-dependency-path`, `BASE_PATH=/${{ github.event.repository.name }}/${{ matrix.site }}`, upload via plain `actions/upload-artifact@v4` named `site-<name>`.
- **D-08:** `assemble` job: checkout (for pages-root/), `actions/download-artifact@v4` with pattern `site-*` → rename nested dirs into `_site/<site>/` → copy hub/404/.nojekyll → **assert exactly four `<site>/index.html` files exist** (fail loudly otherwise) → single `upload-pages-artifact@v3`.
- **D-09:** `deploy` job: `deploy-pages@v4`, github-pages environment. `concurrency: group: pages, cancel-in-progress: true`. `workflow_dispatch` enabled for manual re-runs.
- **D-10:** `configure-pages@v5` with `enablement: true` in assemble; the known first-enable race is an expected checkpoint — if the first run 404s/errors, manually set Settings→Pages→Source=GitHub Actions and re-run via workflow_dispatch. Document this in the workflow file comments and verify step.

### Claude's Discretion
- Exact hub/404 visual styling (keep it tasteful, dark-neutral, zero dependencies)
- Placeholder page copy
- Node version pin (22, matching raj_one workflow) and action minor versions

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Architecture & pitfalls
- `.planning/research/ARCHITECTURE.md` — assemble-job design, single-deployment model, anti-patterns (esp. upload-pages-artifact in matrix)
- `.planning/research/PITFALLS.md` — Pages first-enable race, download-artifact@v4 nesting, ssr=false trap, BASE_PATH leakage
- `.planning/research/STACK.md` — validated versions (Kit 2.69.x, Svelte 5.56.x, adapter-static 3.0.10, Vite 8.1.x)

### Working reference implementation
- `raj_one/vite.config.ts` — the inline-config + BASE_PATH pattern to replicate (but NOT raj_one's `ssr = false` in +layout.ts)
- `raj_one/.github/workflows/deploy.yml` — single-site ancestor of the matrix workflow
- `raj_one/package.json` — devDependency set to clone (drop adapter-auto)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- raj_one toolchain (gitignored sibling, reference only): SvelteKit 2 + Svelte 5 runes + adapter-static + inline vite.config.ts with `paths.base` from BASE_PATH — copy the pattern per site.

### Established Patterns
- Repo root `.gitignore` excludes `raj_*/`, `node_modules/`, `build/`, `.svelte-kit/`; `.gitattributes` forces LF. Never `git add -f` raj_one/raj_two.
- GSD commit tooling handles planning-doc commits; site code commits must carry clean messages (no AI mentions).

### Integration Points
- GitHub repo `wolfwdavid/raj` (public, main branch) already pushed; Pages not yet enabled — first workflow run triggers enablement.

</code_context>

<specifics>
## Specific Ideas

- Walking-skeleton spirit: smallest real thing end-to-end; every later phase rides this pipeline unchanged.
- Zero hardcoded `/raj/` anywhere — repo name flows from `github.event.repository.name`, site paths from the matrix.

</specifics>

<deferred>
## Deferred Ideas

- Design-system shells, CI portability grep, svelte-check gate → Phase 2
- Real content/routes → Phase 3; conversion paths → Phase 4; SEO/compliance → Phase 5

</deferred>

---

*Phase: 01-deploy-pipeline-walking-skeleton*
*Context gathered: 2026-07-06*
