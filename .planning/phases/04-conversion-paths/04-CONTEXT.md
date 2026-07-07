# Phase 4: Conversion Paths - Context

**Gathered:** 2026-07-07
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire each site's real outbound conversion path so it works the moment real keys are pasted — with NO fake success states anywhere. vfamigos: runes cart + localStorage + Stripe Payment Link checkout + prerendered /thanks/. lipool + lidentist: shared LeadForm posting to a configurable endpoint (quote / appointment) with honeypot + progressive enhancement. NO SEO meta component (Phase 5), no new content. This phase lights up the Phase-4 routes that Phase 2/3 left carrying `rel="external"` (/cart, /quote, /appointment, /thanks).

</domain>

<decisions>
## Implementation Decisions

### vfamigos cart (VFAM-03)
- **D-01:** Cart state in `src/lib/cart.svelte.ts` — a runes module (`$state` on an items array) exporting add/remove/setQty/clear + derived count/subtotal. Persist to localStorage. CRITICAL prerender-safety: guard ALL localStorage access with `import { browser } from '$app/environment'` (only read/write when `browser` true) — localStorage during SSR/prerender crashes the build. Hydrate from localStorage in an `$effect` or onMount, not at module top level.
- **D-02:** Cart badge in SiteHeader shows live count (was static "0" in Phase 2 — now reactive from the store). Add-to-cart button on PDP (inert in Phase 3) now calls the store. Cart page `/cart/` lists line items with qty steppers + remove + subtotal; empty state links back to shop.

### vfamigos checkout (VFAM-04, VFAM-05)
- **D-03:** Checkout = anchor/button to a Stripe Payment Link URL from `src/lib/config.ts` (`STRIPE_PAYMENT_LINK: string` placeholder, e.g. `''` or a documented placeholder; optionally per-product links `Record<slug,string>`). Real-ready: paste a real Payment Link, it works. NO custom checkout, no Stripe.js, no API calls (static hosting).
- **D-04 (NO FAKE SUCCESS):** When the Payment Link placeholder is unset/empty, the checkout button is DISABLED with a visible note ("Checkout not yet configured — add a Stripe Payment Link in config.ts"). Never a simulated "order placed" state in-app. The ONLY success surface is `/thanks/` — a prerendered static page that is the Stripe Payment Link's configured post-payment redirect target (Stripe redirects there after real payment). /thanks/ says thank you + order-confirmation-follows; it does NOT read cart/claim a specific order (it's a static redirect target). Clearing the cart on /thanks/ load is acceptable (browser-guarded).
- **D-05:** Cart → checkout: since Payment Links are fixed-price links, the v1 model is a single "Checkout" that opens the configured Payment Link (documented limitation: real multi-item dynamic pricing needs Stripe Checkout Sessions = a server, out of scope). Keep the cart UX real; the checkout hand-off is the Payment Link. Document this clearly in config.ts comments.

### Shared LeadForm (POOL-03, DENT-04)
- **D-06:** `LeadForm.svelte` DUPLICATED into lipool and lidentist (per PROJECT.md decision — no shared package). Same pattern: native `<form method="POST" action={FORM_ENDPOINT}>` (progressive enhancement — works without JS), enhanced with fetch on submit for inline success/error without navigation. Fields ≤5 (lipool quote: name, phone/email, town, service type, message; lidentist appointment: name, contact, preferred dentist [pre-selectable via ?dentist= query], preferred time, note).
- **D-07:** `FORM_ENDPOINT` in each site's `src/lib/config.ts` — configurable Formspree-style URL placeholder (`VITE_FORM_ENDPOINT` build-time override supported). Endpoint-agnostic (Formspree/Web3Forms/FormSubmit all work).
- **D-08:** Honeypot field (visually hidden via off-screen CSS, `tabindex="-1"`, `aria-hidden="true"`, autocomplete off) — bots fill it, submit is dropped client-side if filled. NOT display:none (some bots skip those).
- **D-09 (NO FAKE SUCCESS):** When FORM_ENDPOINT placeholder is unset, the form still renders and validates but the submit shows a visible "Form endpoint not configured" note rather than faking success. With a real endpoint: real fetch, real success message on 200, real error message on failure. Never a simulated "thanks, we got it" without an actual successful POST.
- **D-10:** lidentist appointment page reads `?dentist=<slug>` to pre-select the dentist (from the detail page CTA). Accessible: visible labels, inline errors below fields, `aria-live` error region, autocomplete attributes, 44px targets, keyboard-operable. lidentist a11y-exemplar bar maintained.

### Route lighting
- **D-11:** Drop `rel="external"` from the now-real /cart, /quote, /appointment links (and /thanks is reached via Stripe redirect, not internal nav — but the route must prerender). Every new route (/cart, /thanks, /quote, /appointment) exports prerender=true (inherits layout) and must build without crawler 404s. /cart and /thanks read localStorage only browser-side (prerender-safe).

### Claude's Discretion
- Exact form field microcopy, success/error message wording, cart page layout details, qty stepper styling, config.ts placeholder value format — follow design specs + real-ready-stub principle.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Integration patterns & pitfalls
- `.planning/research/STACK.md` — Stripe Payment Links (static-safe, no server) vs Checkout Sessions; Formspree/Web3Forms/FormSubmit endpoint-agnostic LeadForm; native POST progressive enhancement
- `.planning/research/PITFALLS.md` — localStorage-in-prerender crash (browser guard), public form endpoint + honeypot (not a secret), Stripe success-URL configured in Stripe dashboard not code, NO fake success states
- `.planning/research/FEATURES.md` — cart UX, lead-form conversion (≤5 fields, click-to-call already shipped)

### Design specs (conversion UX)
- `.planning/design/vfamigos.md` §Layout Patterns (cart page, checkout, /thanks) + §Integrations principle
- `.planning/design/lipool.md` §quote form + honeypot + progressive enhancement
- `.planning/design/lidentist.md` §appointment form + a11y

### Code to build into
- `vfamigos/src/lib/components/SiteHeader.svelte` (cart badge — make reactive), `vfamigos/src/routes/products/[slug]/+page.svelte` (add-to-cart button — wire to store)
- `lipool/src/routes/+page.svelte` + wherever /quote/ lands; `lidentist/src/routes/dentists/[slug]/+page.svelte` (appointment CTA with ?dentist=)
- `.planning/phases/03-content-dynamic-routes/*` SUMMARYs — current route/nav state + which rel="external" guards remain

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Phase 3 shipped products with add-to-cart button (inert), cart badge (static 0), appointment/quote CTAs (rel="external" placeholders) — Phase 4 activates all of them.
- SvelteKit `$app/environment` `browser` flag is the prerender-safe localStorage guard.
- Svelte 5 runes (`$state`, `$derived`, `$effect`) already the project standard.

### Established Patterns
- prerender=true + trailingSlash='always' inherited by all routes; new routes must be crawler-safe.
- config.ts pattern (real-ready placeholder + VITE_ override) — same shape for STRIPE_PAYMENT_LINK and FORM_ENDPOINT.
- CI gates (svelte-check, portability grep, content assertions) must keep passing.

### Integration Points
- New routes: vfamigos /cart /thanks; lipool /quote (or inline #quote); lidentist /appointment. cart.svelte.ts under vfamigos/src/lib. LeadForm.svelte duplicated into lipool + lidentist src/lib/components.

</code_context>

<specifics>
## Specific Ideas

- "Real-ready stubs, no fake success states" is the load-bearing principle: every path either does the real thing (with a pasted key) or visibly says it's not configured — never a simulated success. This is a Phase-5 audit gate too.
- Cart is real client state; the checkout hand-off is a Payment Link (honest v1 limitation documented in config.ts).
- Honeypot is the only spam defense (endpoint is public by nature — not treated as a secret).

</specifics>

<deferred>
## Deferred Ideas

- SITE_URL-driven SEO/OG/canonical meta component → Phase 5
- cannabis disclaimer full copy + final no-fake-success/FTC compliance audit → Phase 5
- Real Stripe/Formspree accounts + keys → post-build user step (KEYS-01, v2)
- Stripe Checkout Sessions / multi-item dynamic pricing (needs server) → out of scope
- RSS, sitemap, custom domains → v2

</deferred>

---

*Phase: 04-conversion-paths*
*Context gathered: 2026-07-07*
