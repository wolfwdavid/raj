// lidentist integration config — real-ready stub, no fake success states.
//
// FORM_ENDPOINT: endpoint-agnostic form-backend POST URL (Formspree / Web3Forms / FormSubmit —
// all accept a native <form method="POST">). Override at build time with VITE_FORM_ENDPOINT.
// Until a real endpoint is pasted this is '' and the form still renders and validates, but
// submitting shows a visible "not configured" note — NEVER a fake success.
export const FORM_ENDPOINT: string = import.meta.env.VITE_FORM_ENDPOINT ?? '';
