// gray-matter ships no bundled types; a minimal ambient declaration keeps svelte-check green.
// Parsing happens only in the Node prerender pass (build-time), never in shipped client JS.
declare module 'gray-matter';
