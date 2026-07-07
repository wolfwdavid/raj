// vfamigos integration config — real-ready stubs, no fake success states.
//
// STRIPE_PAYMENT_LINK: a Stripe Payment Link URL (https://buy.stripe.com/...).
// v1 checkout hand-off is a SINGLE fixed-price hosted Payment Link — static-hosting
// safe (no Stripe.js, no API call, no server). The link's post-payment redirect is
// configured to /thanks/ in the STRIPE DASHBOARD (not in code).
//
// LIMITATION (documented, in scope for v1): a Payment Link is fixed-price, so it does
// not carry the exact cart contents/total. Real dynamic multi-item pricing needs Stripe
// Checkout Sessions = a server, which is out of scope for static Pages hosting. The cart
// UX is real; the checkout hand-off is this single link.
//
// Until a real link is pasted (or VITE_STRIPE_PAYMENT_LINK is set at build time), this is
// '' and the /cart/ checkout button renders DISABLED with a visible "not yet configured"
// note — NEVER a simulated success.
export const STRIPE_PAYMENT_LINK: string = import.meta.env.VITE_STRIPE_PAYMENT_LINK ?? '';
