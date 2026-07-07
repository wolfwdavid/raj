// cannaworldnews site config.
//
// SITE_URL: the site's indexable canonical origin. Drives absolute canonical + OG URLs
// (NEVER BASE_PATH). Defaults to the live Pages origin+subpath so URLs resolve today; at
// custom-domain cutover set VITE_SITE_URL='https://cannaworldnews.com' — one knob, no code change.
// No trailing slash (paths passed to <Seo> carry the leading + trailing slash).
export const SITE_URL: string = import.meta.env.VITE_SITE_URL ?? 'https://wolfwdavid.github.io/raj/cannaworldnews';
