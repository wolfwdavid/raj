# Lidentist — Design System

**Site type:** Long Island dentist reviews + appointment lead generator (Lidentist.reviews)
**Personality:** Calm clinical trust. A public-utility feel — clean, accessible, unbiased.

## Style Direction

**Accessible & Ethical + Marketplace/Directory** (ui-ux-pro-max match — WCAG AAA target): high contrast, large text, semantic structure, generous focus states.

- Landing pattern: **Directory** — Hero with search/filter focus ("Find a great dentist on Long Island") → specialty/category chips (General, Pediatric, Ortho, Cosmetic, Oral Surgery) → featured dentist cards → trust/how-it-works → appointment CTA.
- Directory cards: photo/initials avatar, name, practice, town, specialty tags, star rating + review count, "Request appointment" CTA.

## Color Palette

| Role | Hex | Token |
|------|-----|-------|
| Primary | `#0891B2` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#22D3EE` | `--color-secondary` |
| Accent / CTA | `#059669` | `--color-accent` |
| Background | `#ECFEFF` | `--color-background` |
| Surface / Card | `#FFFFFF` | `--color-surface` |
| Foreground | `#164E63` | `--color-foreground` |
| Muted | `#E8F1F6` | `--color-muted` |
| Muted foreground | `#64748B` | `--color-muted-foreground` |
| Border | `#A5F3FC` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#0891B2` | `--color-ring` |

Calm cyan + health-green CTA. Star ratings amber `#D97706` with numeric value alongside (never color-only).

## Typography

- **Headings:** Lexend (400/500/600/700) — designed for reading proficiency
- **Body:** Source Sans 3 (400/500/600) — clear, professional
- Import: `@import url('https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600;700&display=swap');`
- Base 16px minimum everywhere; line-height 1.6; scale 14/16/18/22/28/36.

## Layout Patterns

- Hero: search-style filter (specialty + town selects; client-side filter of static data) with high-contrast submit.
- Directory grid: `minmax(300px, 1fr)` cards; sort by rating.
- Dentist detail page (`/dentists/[slug]/`): header (name, practice, specialty, town, rating), review cards (reviewer initial, date, stars + numeric, text), practice info sidebar, sticky "Request appointment" CTA → /appointment/?dentist=slug.
- Appointment page: LeadForm (name, contact, preferred dentist pre-filled, preferred time, note) → configurable FORM_ENDPOINT; honeypot; real success/error states only.
- Demo-data integrity: seeded dentists/reviews clearly marked as sample data in footer note until real data lands.

## Motion

Near-none. Card hover elevation 150ms; focus transitions instant. Respect reduced-motion trivially by having almost nothing to reduce.

## Accessibility Notes (this site is the a11y exemplar of the four)

- Semantic landmarks (header/nav/main/footer), skip link, heading hierarchy strict h1→h3.
- Star ratings: `aria-label="4.8 out of 5 stars, 32 reviews"`; SVG stars with text sibling.
- Filters keyboard-operable native `<select>`; results count announced via `aria-live="polite"`.
- 3px focus rings on `--color-ring`; 44px targets; contrast AAA where feasible (#164E63 on #ECFEFF = strong).

## Anti-patterns

Bright neon; motion-heavy anything; AI purple/pink gradients; color-only rating meaning; fake "verified" claims on sample data; dark patterns around appointment CTAs.
