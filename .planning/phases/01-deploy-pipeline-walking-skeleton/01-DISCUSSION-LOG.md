# Phase 1: Deploy Pipeline (Walking Skeleton) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-06
**Phase:** 01-deploy-pipeline-walking-skeleton
**Mode:** --auto (recommended defaults selected without user prompts)
**Areas discussed:** Placeholder strategy, Hub page design, First-enable handling, Workflow ergonomics

---

## Placeholder strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal real SvelteKit apps | One-page placeholder per site; pipeline proven against real npm ci + BASE_PATH builds | ✓ |
| Plain HTML placeholders | Hand-copied HTML into _site; faster but proves nothing about the real build path | |

**Choice rationale:** The pipeline IS the risk; fake HTML would defer the real risk to Phase 2.

## Hub page design

| Option | Description | Selected |
|--------|-------------|----------|
| Styled static directory cards | Committed pages-root/index.html, inline CSS, relative links | ✓ |
| Bare link list | Unstyled anchors | |
| Built hub (5th SvelteKit app) | Overkill for 4 links; adds a matrix leg | |

## First-enable handling

| Option | Description | Selected |
|--------|-------------|----------|
| enablement:true + documented manual fallback | Expected checkpoint; workflow_dispatch re-run after manual enable | ✓ |
| Manual-only enablement | Requires user action before any deploy | |

## Workflow ergonomics

| Option | Description | Selected |
|--------|-------------|----------|
| fail-fast:false + per-site cache + assemble assertions | One broken site doesn't hide others; four index.html asserted | ✓ |
| Default matrix behavior | fail-fast hides sibling status | |

## Claude's Discretion

- Hub/404 visual styling, placeholder copy, Node pin (22), action minor versions

## Deferred Ideas

- Design shells / CI portability grep / svelte-check gate (Phase 2); content (Phase 3); conversion (Phase 4); SEO/compliance (Phase 5)
