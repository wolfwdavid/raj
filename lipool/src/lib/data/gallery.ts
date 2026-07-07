export interface GalleryItem {
  /** URL-safe identifier for the project tile. */
  id: string;
  /** Short visible caption shown under the tile. */
  caption: string;
  /**
   * Descriptive alternative text describing the represented project.
   * Rendered as a real, visible description on the page (POOL-02) since the
   * tiles are CSS placeholders standing in for photography.
   */
  alt: string;
  /** Accent hex used to generate the CSS placeholder tile (no binary images). */
  accent: string;
}

/**
 * Representative project tiles for the gallery. These are CSS-generated
 * placeholders standing in for real photography (Pitfall 10: labeled as
 * representative work, not actual job photos). Every item carries descriptive
 * alt text that is surfaced visibly on the page.
 */
export const gallery: GalleryItem[] = [
  {
    id: 'huntington-gunite',
    caption: 'In-ground gunite pool — Huntington',
    alt: 'In-ground gunite pool with bluestone coping and a paver patio in Huntington',
    accent: '#0284C7'
  },
  {
    id: 'garden-city-vinyl',
    caption: 'Vinyl-liner backyard pool — Garden City',
    alt: 'Rectangular vinyl-liner pool with a fresh blue liner and safety cover in Garden City',
    accent: '#06B6D4'
  },
  {
    id: 'massapequa-freeform',
    caption: 'Freeform pool & spa — Massapequa',
    alt: 'Freeform in-ground pool with an attached raised spa and stone waterfall in Massapequa',
    accent: '#0369A1'
  },
  {
    id: 'smithtown-renovation',
    caption: 'Full resurface & remodel — Smithtown',
    alt: 'Renovated pool with new pebble surface, glass tile waterline, and travertine coping in Smithtown',
    accent: '#0EA5E9'
  },
  {
    id: 'oyster-bay-lap',
    caption: 'Lap pool & auto cover — Oyster Bay',
    alt: 'Long rectangular lap pool with an automatic cover track and modern deck jets in Oyster Bay',
    accent: '#0891B2'
  },
  {
    id: 'babylon-openings',
    caption: 'Spring opening & cleaning — Babylon',
    alt: 'Freshly opened and balanced in-ground pool with crystal-clear water in Babylon',
    accent: '#0284C7'
  },
  {
    id: 'port-washington-spa',
    caption: 'Gunite pool with sun shelf — Port Washington',
    alt: 'Gunite pool featuring a tanning sun shelf, bubblers, and LED lighting in Port Washington',
    accent: '#155E9C'
  },
  {
    id: 'commack-liner',
    caption: 'Vinyl liner replacement — Commack',
    alt: 'Kidney-shaped pool with a newly installed patterned vinyl liner in Commack',
    accent: '#06B6D4'
  },
  {
    id: 'wantagh-closing',
    caption: 'Winterization & closing — Wantagh',
    alt: 'In-ground pool being winterized with a fitted mesh safety cover for the off-season in Wantagh',
    accent: '#0369A1'
  }
];
