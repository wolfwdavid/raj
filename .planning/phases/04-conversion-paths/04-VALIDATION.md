---
phase: 4
slug: conversion-paths
status: approved
nyquist_compliant: true
wave_0_complete: false
created: 2026-07-07
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none — `svelte-check` + `vite build` (prerender must survive localStorage guard) + built-HTML assertions + live interaction spot-check (no unit runner) |
| **Config file** | none — Wave 0 not required |
| **Quick run command** | per touched site: `npm run check && BASE_PATH=/raj/<site> npm run build` |
| **Full suite command** | vfamigos + lipool + lidentist: check + build; assert /cart /thanks /quote /appointment prerender; assert disabled-state notes present when placeholders unset; grep no fabricated success strings |
| **Estimated runtime** | ~40–90 s per site |

---

## Sampling Rate

- **After every task commit:** `npm run check` + BASE_PATH build for the touched site (build MUST survive — proves localStorage is browser-guarded, not crashing prerender)
- **After every plan wave:** vfamigos + lipool + lidentist check+build; grep built HTML for "not configured" disabled-state notes (proves no fake success); confirm new routes prerendered
- **Before `/gsd:verify-work`:** all green locally + CI green + live: add-to-cart increments badge, cart persists across reload, checkout button disabled-with-note (placeholder), form submit shows not-configured note (placeholder) — never a fake success
- **Max feedback latency:** ~120 s local

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| (filled by planner) | 04-01 | 1 | VFAM-03/04/05 | build+grep | build survives (localStorage browser-guarded); /cart + /thanks prerender; checkout disabled-note present when STRIPE_PAYMENT_LINK empty; no fabricated "order placed" string | ✅ | ⬜ pending |
| (filled by planner) | 04-02 | 1 | POOL-03, DENT-04 | build+grep | LeadForm in lipool+lidentist; native form method=POST action; honeypot field present (aria-hidden/off-screen); not-configured note when FORM_ENDPOINT empty; no fabricated "thanks we got it" string; appointment reads ?dentist= | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements — validation is `svelte-check`, prerender `vite build` (localStorage-guard survival), built-HTML greps, and manual live interaction. No test framework install.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Add-to-cart → badge increments → cart persists across reload | VFAM-03 | Client runtime interaction | Live: add product, see badge count, reload page, cart still populated |
| Checkout hand-off is real-ready, no fake success | VFAM-04/05 | Requires real Stripe key to fully exercise | With placeholder: checkout disabled + visible note; /thanks/ loads as static page; NO simulated order state |
| Form submit is real-ready, no fake success | POOL-03/DENT-04 | Requires real endpoint to fully exercise | With placeholder: submit shows not-configured note; with real endpoint: real POST + real success/error |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none)
- [x] No watch-mode flags
- [x] Feedback latency < 120s local
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-07 (conversion phase; build-survival + disabled-state/no-fake-success greps automated, real-key interaction manual)
