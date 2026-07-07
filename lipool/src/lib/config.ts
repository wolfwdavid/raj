// lipool integration config — real-ready stub, no fake success states.
//
// FORM_ENDPOINT: a form-backend POST URL (Formspree / Web3Forms / FormSubmit — all accept
// a native <form method="POST">, so this is endpoint-agnostic). Override at build time with
// VITE_FORM_ENDPOINT. Until a real endpoint is pasted this is '' and the form still renders
// and validates, but submitting shows a visible "not configured" note — NEVER a fake success.
export const FORM_ENDPOINT: string = import.meta.env.VITE_FORM_ENDPOINT ?? '';

// SITE_URL: the site's indexable canonical origin. Drives absolute canonical + OG URLs
// (NEVER BASE_PATH). Defaults to the live Pages origin+subpath so URLs resolve today; at
// custom-domain cutover set VITE_SITE_URL='https://lipool.com' — one knob, no code change.
// No trailing slash (paths passed to <Seo> carry the leading + trailing slash).
export const SITE_URL: string = import.meta.env.VITE_SITE_URL ?? 'https://wolfwdavid.github.io/raj/lipool';
