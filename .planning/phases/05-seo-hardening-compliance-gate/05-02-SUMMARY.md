---
phase: 05-seo-hardening-compliance-gate
plan: 02
subsystem: infra
tags: [svelte, sveltekit, seo, open-graph, article-published-time, compliance, ftc, ci, github-actions, grep-gate]

# Dependency graph
requires:
  - phase: 05-seo-hardening-compliance-gate
    provides: Seo.svelte with type/publishedTime props + SITE_URL-derived canonical/OG (05-01)
  - phase: 04-conversion-paths
    provides: no-fake-success posture + honest /thanks/ Stripe surface to enshrine in CI
  - phase: 03-content-dynamic-routes
    provides: lidentist FTC sample-data banner + lipool no-aggregateRating JSON-LD to re-assert
provides:
  - cannaworldnews article pages emit article:published_time (frontmatter ISO date) + og:type=article (NEWS-04)
  - Finalized cannabis informational-only footer disclaimer on every cannaworldnews page (NEWS-05)
  - CI-enforced Compliance gate in deploy.yml build matrix leg (D-06) auditing every future push
affects: [custom-domain-cutover, compliance-review, milestone-completion]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Compliance is CI-enforced via a grep gate in the build matrix leg, not a one-time manual audit"
    - "no-fake-success grep uses `if grep -qiE ...; then exit 1` so grep's not-found (exit 1) is the success case"
    - "Per-site case block re-asserts FTC/no-aggregateRating literals (intentional redundancy with the Content step) so the gate is self-contained and fails loudly together"

key-files:
  created:
    - .planning/phases/05-seo-hardening-compliance-gate/05-02-SUMMARY.md
  modified:
    - cannaworldnews/src/routes/articles/[slug]/+page.svelte
    - cannaworldnews/src/lib/components/SiteFooter.svelte
    - .github/workflows/deploy.yml

key-decisions:
  - "article.date ('YYYY-MM-DD') passed straight to publishedTime — already valid ISO, no conversion"
  - "vfamigos /thanks/ ('Your order is confirmed.') deliberately excluded from the no-fake-success phrase list — it is the REAL Stripe redirect surface (VFAM-05)"
  - "Compliance gate re-asserts lidentist FTC label + lipool no-aggregateRating even though the Content step already does, so the gate is legible and self-contained"

patterns-established:
  - "Compliance gate step runs per-site in the matrix, site-wide checks (no-fake-success, per-page title/desc/canonical) for all four sites + per-site case specifics"
  - "Grep block dry-run against real built output of all four sites before commit; verified it BITES on injected violations (fake-success string, removed canonical, dropped disclaimer)"

requirements-completed: [NEWS-04, NEWS-05]

# Metrics
duration: 5min
completed: 2026-07-07
---

# Phase 5 Plan 2: Article Metadata + Compliance CI Gate Summary

**cannaworldnews articles now emit article:published_time + og:type=article with a finalized informational-only disclaimer on every page, and deploy.yml carries a CI-enforced Compliance gate auditing no-fake-success, per-page SEO meta, the disclaimer, the lidentist FTC label, and lipool's no-aggregateRating on every future push.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-07-07T07:40:26Z
- **Completed:** 2026-07-07T07:45:09Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- Added `type="article"` + `publishedTime={article.date}` to the cannaworldnews article `<Seo>`, so every built `articles/*/index.html` carries `article:published_time` (real `YYYY-MM-DD`, e.g. `2026-02-24`) and `og:type=article`; front/region pages stay `og:type=website`.
- Finalized the NEWS-05 disclaimer to the compliance copy ("CannaWorldNews reports on cannabis policy and industry developments worldwide. Informational only — not legal or medical advice.") and removed the obsolete shell-stub comment; the footer renders on every layout page, so the exact grep substring `not legal or medical advice` is present in every built `index.html`.
- Inserted a per-site **Compliance gate** step in the deploy.yml build matrix leg (after Content assertions, before upload-artifact): site-wide no-fake-success grep (6 phrases, `/thanks/` intentionally excluded), per-page non-empty `<title>` + meta description + `https://` canonical presence, cannaworldnews disclaimer + article:published_time + og:type=article, lidentist FTC sample-data label, lipool no-aggregateRating.
- Dry-ran the exact grep block against honest builds of all four sites (exit 0 on all) and proved it BITES: injected `payment successful` → fake-success caught; removed canonical → canonical fail; dropped disclaimer → disclaimer fail.

## Task Commits

Each task was committed atomically:

1. **Task 1: article published_time/og:type=article + finalize disclaimer** - `0248fcc` (feat)
2. **Task 2: Compliance gate in deploy.yml (D-06)** - `40454a3` (feat)

**Plan metadata:** (docs: complete plan — see final commit)

## Files Created/Modified
- `cannaworldnews/src/routes/articles/[slug]/+page.svelte` - Added `type="article"` + `publishedTime={article.date}` to the existing `<Seo>` (NEWS-04)
- `cannaworldnews/src/lib/components/SiteFooter.svelte` - Finalized informational-only disclaimer, dropped shell-stub comment (NEWS-05)
- `.github/workflows/deploy.yml` - New per-site Compliance gate step in the build leg (D-06); all prior gates (svelte-check, dual-BASE_PATH build, portability, content) untouched

## Decisions Made
- **`article.date` passed straight to `publishedTime`** — it is already a valid `YYYY-MM-DD` ISO date, no conversion needed.
- **`/thanks/` deliberately excluded** from the no-fake-success phrase list — vfamigos "Your order is confirmed." is the REAL Stripe post-payment redirect surface (VFAM-05), not a fabricated success state.
- **Intentional redundancy** — the gate re-asserts the lidentist FTC label and lipool no-aggregateRating literals already checked in the Content step, keeping the compliance gate self-contained and legible; both fail loudly together, no silent drift.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None — svelte-check clean (0 errors/0 warnings), all four builds succeeded, the compliance grep block passed on every honest build and failed on every injected violation.

## User Setup Required
None - no external service configuration required. The compliance gate runs automatically on every push to `main` via GitHub Actions.

## Next Phase Readiness
- v1 SEO + compliance deliverables complete: NEWS-04, NEWS-05, and the D-06 CI compliance gate are live in deploy.yml.
- Phase 05 (final v1 phase) plans 05-01 and 05-02 are both done; ready for phase verification and `/gsd:complete-milestone`.
- Compliance is now enforced on every future push (not a one-time check). Cannabis/FTC posture remains a MEDIUM-confidence floor per the standing blocker — flag for real legal review before custom-domain cutover.
- No blockers.

## Self-Check: PASSED

---
*Phase: 05-seo-hardening-compliance-gate*
*Completed: 2026-07-07*
