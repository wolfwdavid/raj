# Vfamigos — Design System

**Site type:** Collectibles character e-commerce (VeeFriends-style, original brand)
**Personality:** Playful, warm, collectible, energetic — a cast of original "Amigo" characters

## Style Direction

Bold playful flat with soft depth. (ui-ux-pro-max recommended Liquid Glass; adapted — heavy backdrop blur has moderate-poor performance and text-contrast risk. Keep the *fluid, joyful* spirit via rounded shapes, gentle morphing blobs in hero backgrounds, and springy micro-interactions instead of glass panels.)

- Landing pattern: **Storytelling + Feature-Rich** — Hero (brand story + featured characters) → character/product grid → collection story → CTA. Primary CTA above the fold.
- Big rounded cards (radius 16–24px), sticker-like character framing, chunky buttons.
- One or two SVG blob/confetti accents per view max — never behind body text.

## Color Palette (CSS variables in :root)

| Role | Hex | Token |
|------|-----|-------|
| Primary | `#E11D48` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#FB7185` | `--color-secondary` |
| Accent / CTA | `#2563EB` | `--color-accent` |
| Background | `#FFF1F2` | `--color-background` |
| Surface / Card | `#FFFFFF` | `--color-surface` |
| Foreground | `#881337` | `--color-foreground` |
| Body text on surface | `#3F1220` (or slate-900) | `--color-text` |
| Muted | `#F0ECF2` | `--color-muted` |
| Border | `#FECDD3` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#E11D48` | `--color-ring` |

Vibrant rose brand + engagement-blue CTA. Per-character accent colors allowed on cards (derived per character in products.ts) but text always on white/near-white surfaces at ≥4.5:1.

## Typography

- **Headings:** Fredoka (400/500/600/700) — rounded, toy-like
- **Body:** Nunito (300–700) — friendly, highly readable
- Import: `@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@300;400;500;600;700&display=swap');`
- Base 16px, line-height 1.6 body; type scale 14/16/18/24/32/44.

## Layout Patterns

- Hero: character lineup illustration strip + headline + "Shop the Amigos" CTA.
- Product grid: responsive `repeat(auto-fill, minmax(240px, 1fr))`, card = character art block (solid per-character accent bg), name, series tag, price, add-to-cart.
- Product page: 2-col desktop (art / story+buy panel), character bio + traits list (collectible storytelling), quantity + add to cart + Stripe Payment Link buy button.
- Cart page: line items, totals, checkout anchor (Stripe Payment Link from config.ts), empty state with CTA back to grid.
- Sticky top nav: logo, Shop, About, cart button with count badge.

## Motion

- Card hover/press: scale 1.02 / 0.98, 150–200ms ease-out; springy add-to-cart confirmation.
- Hero blob drift ≤ slow subtle loop, disabled under `prefers-reduced-motion`.
- No animation >400ms; never animate layout properties.

## Accessibility Notes

- All character art gets meaningful `alt` (name + one-line persona).
- Cart count badge has `aria-label` ("Cart, 3 items"); buttons ≥44px targets.
- Rose-on-rose forbidden for text; verify 4.5:1 on all pairs (foreground #881337 on #FFF1F2 passes).
- SVG icons (Lucide-style, inline), never emoji. Focus rings 3px `--color-ring`.

## Anti-patterns

Cheap clip-art visuals; fast/jittery animations; glassmorphism over text; fake checkout success states; VeeFriends trade dress or assets.
