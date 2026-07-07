# Lipool — Design System

**Site type:** Long Island pool contractor lead generator
**Personality:** Trustworthy local pro. Clean, sunny, water-fresh. Conversion-first.

## Style Direction

**Trust & Authority** (ui-ux-pro-max match — WCAG AAA capable, excellent performance): license/insured badges, years-in-business stat, service-area coverage, before/after gallery, testimonial metrics.

- Landing pattern: **Lead Magnet + Form** — Hero (benefit headline: "Long Island's Pool People" + free-quote promise) → trust badges strip → services → gallery preview → quote form. Quote form CTA visible above fold (hero button anchors to /quote/ or inline form).
- Form: ≤5 fields (name, phone/email, town, service type, message), clean white card, visible labels, submission progress + real error/success states.

## Color Palette (curated: water blues, not the generator's AI-purple)

| Role | Hex | Token |
|------|-----|-------|
| Primary | `#0284C7` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#06B6D4` | `--color-secondary` |
| Accent / CTA | `#0369A1` | `--color-accent` |
| Background | `#F0F9FF` | `--color-background` |
| Surface / Card | `#FFFFFF` | `--color-surface` |
| Foreground | `#0F172A` | `--color-foreground` |
| Muted | `#EFF7FB` | `--color-muted` |
| Muted foreground | `#64748B` | `--color-muted-foreground` |
| Border | `#E0F0F8` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#0284C7` | `--color-ring` |

Refreshing sky/water blues; deep `#0369A1` for high-contrast CTAs; warm sun-amber `#D97706` allowed sparingly for star ratings/badges only.

## Typography

- **Headings:** Poppins (500/600/700) — geometric, confident
- **Body:** Open Sans (400/500/600) — humanist, effortless to read
- Import: `@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap');`
- Base 16px, line-height 1.6; scale 14/16/18/22/28/40.

## Layout Patterns

- Hero: full-width water-gradient band, headline + subhead + phone click-to-call (`tel:`) + "Get a Free Quote" CTA.
- Trust strip: 4 badges (Licensed & Insured · 20+ Years · Nassau & Suffolk · Free Estimates) — SVG icons + label.
- Services: 3–6 cards (installation, liner replacement, openings/closings, maintenance, repairs, renovation) with icon, blurb, "Get quote" link.
- Gallery: responsive masonry/grid of project photos with descriptive alts; lazy-loaded.
- Quote page: form card + sidebar (phone, hours, service areas list of LI towns).
- Footer: NAP block (name/address/phone) for local SEO + service-area towns; LocalBusiness JSON-LD.

## Motion

Minimal. Stat/badge fade-up on first view (≤300ms, staggered 40ms), button hover 150ms. Nothing decorative beyond that.

## Accessibility Notes

- Form: visible labels, inline errors below fields, `aria-live` error region, autocomplete attributes, honeypot field visually hidden but not `display:none` trickery that traps screen readers (use `aria-hidden` + tabindex −1).
- Click-to-call links labeled ("Call Lipool at ..."). All touch targets ≥44px.
- Contrast: #0F172A on #F0F9FF and white — passes AAA.

## Anti-patterns

Hidden contact info; stock-photo cheese without local specifics; purple/pink SaaS gradients; fake review counts; forms that pretend to submit.
