# CannaWorldNews — Design System

**Site type:** Global cannabis news / editorial publication
**Personality:** Serious international journalism about cannabis — Swiss rigor, not head-shop kitsch.

## Style Direction

**Swiss Modernism 2.0** (ui-ux-pro-max match — WCAG AAA, excellent performance): strict 12-column grid, mathematical spacing, rational hierarchy, generous whitespace, content-first.

- Landing pattern: **Content First** — masthead → lead story (large) → region-sectioned article rivers → all-articles grid. No fake newsletter counts; a simple inline "Follow the world's cannabis policy shifts" intro instead.
- Editorial black-and-paper canvas with a single restrained accent.

## Color Palette (accent curated: nature green replaces the generator's pink — fits the beat without being cliché)

| Role | Hex | Token |
|------|-----|-------|
| Primary | `#18181B` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#3F3F46` | `--color-secondary` |
| Accent | `#15803D` | `--color-accent` |
| Background | `#FAFAFA` | `--color-background` |
| Surface / Card | `#FFFFFF` | `--color-surface` |
| Foreground | `#09090B` | `--color-foreground` |
| Muted | `#E8ECF0` | `--color-muted` |
| Muted foreground | `#52525B` | `--color-muted-foreground` |
| Border | `#E4E4E7` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#18181B` | `--color-ring` |

Accent green used for: region tags, links/hover, section rules, kickers. Never large green fields.

## Typography

- **Headings:** Libre Bodoni (400/500/600/700) — classic newspaper serif
- **Body:** Public Sans (400/500/600) — neutral, legible
- Import: `@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&display=swap');`
- Base 17px article body, line-height 1.7, measure 65–72ch; scale 14/16/17/21/28/40/56 (lead headline).

## Layout Patterns

- Masthead: wordmark (Libre Bodoni), tagline "Cannabis news from around the world", region nav (Americas · Europe · Africa · Asia-Pacific) with active state.
- Front page: 12-col grid — lead story spans 8 cols (headline, dek, region kicker, date), secondary stack 4 cols; then per-region sections with 3-up article cards; hairline rules between sections.
- Article card: region kicker (accent, uppercase, letterspaced), serif headline, dek, date. No images required for v1 — typographic cards keep it fast and elegant.
- Article page (`/articles/[slug]/`): centered measure, kicker + h1 + byline/date block, rendered markdown (styled h2/h3, blockquote with accent rule, lists, links), "More from [Region]" related list, back to region.
- Region page (`/region/[region]/`): region masthead + chronological river.
- Footer: about note, region index, sample-content disclaimer, "Informational only — not legal or medical advice" line.

## Motion

Essentially none. Link underline/color 150ms. Print-like stillness is the aesthetic.

## Accessibility Notes

- Strict heading hierarchy; article dates in `<time datetime>`; region nav `aria-current="page"`.
- Contrast is trivially AAA (near-black on near-white); accent green #15803D on white = 5.0:1, used at ≥16px semibold or non-text.
- Focus visible on all links (2px offset underline + ring); reduced-motion irrelevant by design.
- OG/meta per article (title, description, article:published_time) for shareability.

## Anti-patterns

Weed-leaf wallpaper/stoner kitsch; poor typography (the whole site IS typography); pink SaaS accents; autoplaying anything; medical/legal claims — report, don't advise; slow loading (target near-zero JS on article pages).
