export interface Service {
  /** URL-safe identifier for the service. */
  slug: string;
  /** Short, homeowner-facing service name. */
  title: string;
  /** One-to-two sentence benefit-led description. */
  blurb: string;
  /** Inline Lucide-style SVG path data (24x24 viewBox) — never emoji. */
  icon: string;
}

/**
 * The six core pool services offered across Nassau & Suffolk County.
 * Icons are hand-authored Lucide-style paths rendered at a 24x24 viewBox.
 */
export const services: Service[] = [
  {
    slug: 'installation',
    title: 'Pool Installation',
    blurb:
      'Custom in-ground gunite and vinyl-liner pools engineered for your Long Island backyard, permitted and built by our own crews.',
    icon: 'M2 20h20M4 20V10l8-6 8 6v10M9 20v-6h6v6'
  },
  {
    slug: 'liner-replacement',
    title: 'Liner Replacement',
    blurb:
      'Fresh vinyl liners that stop leaks and modernize the look of an aging pool, measured and fitted for a wrinkle-free finish.',
    icon: 'M3 7l9-4 9 4-9 4-9-4zM3 7v10l9 4 9-4V7M3 12l9 4 9-4'
  },
  {
    slug: 'openings-closings',
    title: 'Openings & Closings',
    blurb:
      'Seasonal openings that get you swimming by Memorial Day and winterizations that protect your investment through the off-season.',
    icon: 'M12 3v6m0 6v6m-9-9h6m6 0h6M6 6l3 3m6 6l3 3m0-12l-3 3m-6 6l-3 3'
  },
  {
    slug: 'maintenance',
    title: 'Weekly Maintenance',
    blurb:
      'Recurring cleaning, water balancing, and equipment checks so your pool stays crystal clear all summer without the chore list.',
    icon: 'M3 12a9 9 0 0 1 18 0M3 12c3 2 6 2 9 0s6-2 9 0M3 17c3 2 6 2 9 0s6-2 9 0'
  },
  {
    slug: 'repairs',
    title: 'Repairs & Equipment',
    blurb:
      'Fast diagnosis and repair of pumps, filters, heaters, and plumbing to bring a struggling pool back to full performance.',
    icon: 'M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-2.4 2.5-2.5z'
  },
  {
    slug: 'renovation',
    title: 'Renovation & Remodel',
    blurb:
      'Resurfacing, new coping and tile, and modern automation that transform a dated pool into the centerpiece of your yard.',
    icon: 'M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5L12 2z'
  }
];
