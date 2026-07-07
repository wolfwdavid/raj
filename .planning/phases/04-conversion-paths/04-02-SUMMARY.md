---
phase: 04-conversion-paths
plan: 02
subsystem: lead-capture
tags: [lipool, lidentist, lead-form, honeypot, progressive-enhancement, a11y]
requires:
  - lipool shell + services.ts (Phase 2/3)
  - lidentist shell + dentists.ts + detail pages (Phase 2/3)
provides:
  - lipool /quote/ route with configurable-endpoint LeadForm
  - lidentist /appointment/ route with dentist pre-select LeadForm
  - FORM_ENDPOINT config (VITE_FORM_ENDPOINT override) per site
affects:
  - lipool SiteHeader + home (rel guards dropped on /quote links)
  - lidentist SiteHeader + dentist detail (rel guards dropped on /appointment links)
tech-stack:
  added: []
  patterns:
    - native <form method=POST action={FORM_ENDPOINT}> + fetch progressive enhancement
    - off-screen honeypot (_gotcha, aria-hidden, tabindex=-1, position:absolute)
    - real-states-only submit (not-configured note / real 200 success / real error)
    - client-side ?dentist= read in an $effect (prerender-safe query params)
key-files:
  created:
    - lipool/src/lib/config.ts
    - lipool/src/lib/components/LeadForm.svelte
    - lipool/src/routes/quote/+page.svelte
    - lidentist/src/lib/config.ts
    - lidentist/src/lib/components/LeadForm.svelte
    - lidentist/src/routes/appointment/+page.svelte
  modified:
    - lipool/src/lib/components/SiteHeader.svelte
    - lipool/src/routes/+page.svelte
    - lidentist/src/lib/components/SiteHeader.svelte
    - lidentist/src/routes/dentists/[slug]/+page.svelte
decisions:
  - Honeypot uses off-screen position:absolute (never display:none) so screen readers skip it without being trapped
  - Query params read client-side in an $effect so /appointment/ prerenders with no query and pre-selects only after mount
  - LeadForm submit logic kept identical across both sites (honeypot-drop / unconfigured-note / real fetch states) so a diff catches drift
metrics:
  duration_min: 7
  tasks: 2
  files: 10
  completed: 2026-07-07
---

# Phase 4 Plan 2: Shared LeadForm (lipool /quote + lidentist /appointment) Summary

Both lead-gen sites now have their real conversion path: a duplicated-pattern `LeadForm.svelte` that submits as a native `<form method="POST" action={FORM_ENDPOINT}>` (works with zero JS) and upgrades with `fetch` for inline success/error. An off-screen `_gotcha` honeypot is the spam defense, and when `FORM_ENDPOINT` is the empty placeholder the form shows a visible "not configured" note — never a fabricated success. lipool gets `/quote/` (name, contact, town, service, message); lidentist gets `/appointment/` (name, contact, preferred dentist pre-selectable via `?dentist=`, preferred time, note) holding the a11y-exemplar bar. All `rel="external"` guards on the now-real /quote and /appointment links were dropped in the same task that created each route, so no build ran with a dangling internal link.

## What Was Built

### Task 1 — lipool (commit 943ca93)
- `config.ts` exporting `FORM_ENDPOINT` from `import.meta.env.VITE_FORM_ENDPOINT ?? ''`.
- `LeadForm.svelte`: literal `method="POST"` + `action={FORM_ENDPOINT}`; off-screen honeypot (`_gotcha`, `aria-hidden`, `tabindex=-1`, `autocomplete=off`, `position:absolute;left:-9999px`); 5 visible labelled fields (name, contact, town, service `<select>`, message); inline field errors + `aria-live="polite"` status region; honeypot-drop / unconfigured-note / real-fetch-states submit logic; water-blue design (deep `#0369A1` CTA, 44px targets, 3px focus rings).
- `/quote/` route: form card + sidebar (click-to-call, hours, Nassau & Suffolk service-area towns), two-column layout stacking on mobile.
- Dropped `rel="external"` from the SiteHeader `.cta`, hero CTA, and every service-card `.service-link` /quote anchor.

### Task 2 — lidentist (commit 9fa501b)
- `config.ts` — identical `FORM_ENDPOINT` pattern (appointment wording).
- `LeadForm.svelte`: duplicated submit logic (honeypot-drop / unconfigured / real fetch states byte-compatible with lipool); accepts a `selectedDentist` prop; 5 fields (name, contact, preferred dentist `<select>` from typed `dentists` as `{name} — {practice}` with a leading "No preference", preferred time, note); a11y-exemplar bar (visible labels, inline errors, `aria-live`, autocomplete, 44px targets, keyboard-operable native selects, 3px focus).
- `/appointment/` route: reads `$page.url.searchParams.get('dentist')` inside an `$effect` (client-side only) and pre-selects the dentist; prerenders cleanly with no query.
- Dropped `rel="external"` from the SiteHeader `.cta` and the dentist-detail `/appointment/?dentist=` CTA.

## Verification

Per-site automated verify (from each task's `<verify>`) all green:
- `npm run check`: 0 errors both sites (lipool 299 files, lidentist 302 files).
- `BASE_PATH=/raj/<site>` build succeeds; `/quote/index.html` and `/appointment/index.html` prerender.
- `BASE_PATH=''` build also succeeds both sites (INFRA-04 custom-domain readiness).
- Honeypot asserted in source: `_gotcha`, `aria-hidden="true"`, `tabindex="-1"` present; `! grep display:\s*none` passes (source comments reworded to avoid tripping the audit grep).
- No-fake-success asserted against BUILT pages: `! grep -i "thanks, we got it|message sent|request received"` (lipool) and `! grep -i "appointment booked|request received|thanks, we got it"` (lidentist) — both zero. Success copy only renders client-side after a real 200.
- `searchParams` present in appointment page; dentist `<option>`s render in built HTML with "No preference" default selected.
- Existing CI assertions intact: lipool gallery prerendered, `HomeAndConstructionBusiness` JSON-LD present, no `aggregateRating`; lidentist dentist page count == records (10==10), "Sample data for demonstration" label present, "out of 5 stars" aria rating present.
- Portability: no `/raj/` in source; no root-absolute non-base href/src in built pages.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Honeypot source comments tripped the `display:none` audit grep**
- **Found during:** Task 1
- **Issue:** The plan's automated `<verify>` runs `! grep -qE 'display:\s*none' src/lib/components/LeadForm.svelte`. My explanatory code comments contained the literal phrase "display:none" (e.g. "NOT display:none"), which matched the grep and failed the assertion even though no such CSS exists.
- **Fix:** Reworded the honeypot comments in both LeadForms to describe the technique ("off-screen via position/left … not the screen-reader-trapping hidden kind") without the literal `display:none` token.
- **Files modified:** lipool/src/lib/components/LeadForm.svelte, lidentist/src/lib/components/LeadForm.svelte (applied at creation for lidentist)
- **Commits:** 943ca93, 9fa501b

**2. [Enhancement within scope] Added client-side inline validation to the submit path**
- **Found during:** Task 1
- **Issue:** The plan's script sketch had honeypot/unconfigured/fetch branches but the acceptance criteria also require "inline field errors below fields for client validation … announced via the aria-live region."
- **Fix:** Added a `validate()` step (name/contact required, plus town/service on lipool) that populates per-field `fieldErrors`, sets `aria-invalid`, and routes a summary message through the `aria-live` region before the fetch. Native `required` still guards the no-JS path.
- **Files modified:** both LeadForm.svelte files.
- **Commits:** 943ca93, 9fa501b

## Known Stubs

**FORM_ENDPOINT is intentionally empty (`''`) — this is the designed integration stub, not a defect.**
- **Files:** lipool/src/lib/config.ts, lidentist/src/lib/config.ts
- **Reason:** Per PROJECT.md ("real-ready stubs only — no fake success states") the endpoint is a placeholder overridable via `VITE_FORM_ENDPOINT` at build time or by pasting a Formspree/Web3Forms/FormSubmit URL. While empty, the form renders and validates but submit shows the visible "not configured" note (asserted, never a fake success). Wiring a real endpoint is a post-build user step — no future plan needed; the form is complete and correct in both configured and unconfigured states.

## Self-Check: PASSED
