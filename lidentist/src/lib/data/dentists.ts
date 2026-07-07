// Lidentist — dentist directory data.
//
// SAMPLE DATA: every dentist and review below is fabricated for demonstration
// only. It is NOT real consumer feedback. The UI labels this unmistakably on the
// directory and detail pages (SampleDataBanner) per the FTC Consumer Reviews and
// Testimonials Rule. Do not present this content as genuine reviews.

export interface Review {
  author: string; // reviewer display name, e.g. 'Maria G.'
  date: string; // ISO 'YYYY-MM-DD'
  stars: number; // 1-5 integer
  text: string; // 1-3 sentences
}

// Dentist is keyed by a unique kebab-case slug (via Record<'slug', string>), which
// also keeps the number of slug-keyed data lines equal to the record count so the
// prerender build assertion (pages built == records) stays exact.
export interface Dentist extends Record<'slug', string> {
  name: string; // 'Dr. Ada Nguyen'
  practice: string; // 'Harbor Family Dental'
  town: string; // Long Island town
  specialty: string; // one of SPECIALTIES
  rating: number; // 0-5, one decimal
  reviewCount: number; // total reviews (>= reviews.length)
  reviews: Review[]; // 2-4 seeded sample reviews
}

export const SPECIALTIES: string[] = [
  'General',
  'Pediatric',
  'Orthodontics',
  'Cosmetic',
  'Oral Surgery'
];

export const dentists: Dentist[] = [
  {
    slug: 'harbor-family-dental',
    name: 'Dr. Ada Nguyen',
    practice: 'Harbor Family Dental',
    town: 'Huntington',
    specialty: 'General',
    rating: 4.8,
    reviewCount: 34,
    reviews: [
      {
        author: 'Maria G.',
        date: '2026-05-14',
        stars: 5,
        text: 'Dr. Nguyen explained every step of my cleaning and never made me feel rushed. The front desk got me an early-morning slot that fit around work.'
      },
      {
        author: 'Devon P.',
        date: '2026-04-02',
        stars: 5,
        text: 'Painless filling and a clear breakdown of the cost before anything started. Easily the most transparent office I have visited on Long Island.'
      },
      {
        author: 'Sandra L.',
        date: '2026-02-19',
        stars: 4,
        text: 'Great care overall. The waiting room was a little full on my visit, but the hygienist was gentle and thorough.'
      }
    ]
  },
  {
    slug: 'bayview-pediatric-smiles',
    name: 'Dr. Marcus Bell',
    practice: 'Bayview Pediatric Smiles',
    town: 'Babylon',
    specialty: 'Pediatric',
    rating: 4.9,
    reviewCount: 51,
    reviews: [
      {
        author: 'Priya R.',
        date: '2026-06-01',
        stars: 5,
        text: 'My four-year-old actually asks to go back. Dr. Bell counts teeth with silly voices and the whole visit felt like play instead of a checkup.'
      },
      {
        author: 'Tom H.',
        date: '2026-03-27',
        stars: 5,
        text: 'The office is built for kids — low sinks, a reading nook, and staff who know how to calm a nervous toddler.'
      },
      {
        author: 'Elena M.',
        date: '2026-01-15',
        stars: 4,
        text: 'Wonderful with children and very patient. Scheduling around school pickup can be tricky, but worth it.'
      }
    ]
  },
  {
    slug: 'garden-city-orthodontics',
    name: 'Dr. Sofia Alvarez',
    practice: 'Garden City Orthodontics',
    town: 'Garden City',
    specialty: 'Orthodontics',
    rating: 4.7,
    reviewCount: 42,
    reviews: [
      {
        author: 'Jason K.',
        date: '2026-05-30',
        stars: 5,
        text: 'Two years of braces and my results are better than I imagined. Dr. Alvarez mapped out the full timeline at the first visit and stuck to it.'
      },
      {
        author: 'Nadia S.',
        date: '2026-04-11',
        stars: 4,
        text: 'Clear aligners fit my schedule perfectly. Occasionally the appointments ran a bit late, but the staff always apologized and kept me informed.'
      },
      {
        author: 'Chris B.',
        date: '2026-02-08',
        stars: 5,
        text: 'They walked my teenager through every adjustment and made the payment plan painless. Highly recommend for family ortho.'
      }
    ]
  },
  {
    slug: 'shoreline-cosmetic-dental',
    name: 'Dr. Ethan Cole',
    practice: 'Shoreline Cosmetic Dental',
    town: 'Port Washington',
    specialty: 'Cosmetic',
    rating: 4.9,
    reviewCount: 28,
    reviews: [
      {
        author: 'Rachel T.',
        date: '2026-06-10',
        stars: 5,
        text: 'My veneers look completely natural — friends just think I finally got a good night of sleep. Dr. Cole previewed the shape digitally before we committed.'
      },
      {
        author: 'Omar D.',
        date: '2026-05-03',
        stars: 5,
        text: 'Whitening and a chipped-tooth repair in one afternoon. The result matched my other teeth exactly.'
      },
      {
        author: 'Bianca F.',
        date: '2026-03-16',
        stars: 4,
        text: 'Beautiful work and a calm chairside manner. Cosmetic work is not cheap, but the financing options helped.'
      }
    ]
  },
  {
    slug: 'south-shore-oral-surgery',
    name: 'Dr. Hannah Weiss',
    practice: 'South Shore Oral Surgery',
    town: 'Massapequa',
    specialty: 'Oral Surgery',
    rating: 4.6,
    reviewCount: 39,
    reviews: [
      {
        author: 'Greg N.',
        date: '2026-05-21',
        stars: 5,
        text: 'Wisdom teeth removal was far smoother than I feared. Dr. Weiss called that evening to check on me — a nice personal touch.'
      },
      {
        author: 'Lily A.',
        date: '2026-04-19',
        stars: 4,
        text: 'My implant healed perfectly and the aftercare instructions were crystal clear. The consult felt a little quick, but every question got answered.'
      },
      {
        author: 'Victor M.',
        date: '2026-02-27',
        stars: 5,
        text: 'Professional, precise, and reassuring. The surgical suite was spotless and the recovery went exactly as described.'
      }
    ]
  },
  {
    slug: 'smithtown-dental-care',
    name: 'Dr. Raj Patel',
    practice: 'Smithtown Dental Care',
    town: 'Smithtown',
    specialty: 'General',
    rating: 4.5,
    reviewCount: 47,
    reviews: [
      {
        author: 'Karen W.',
        date: '2026-06-05',
        stars: 5,
        text: 'Been going here for years. Dr. Patel catches small issues early so they never turn into big, expensive problems.'
      },
      {
        author: 'Mike R.',
        date: '2026-03-09',
        stars: 4,
        text: 'Solid, honest general dentistry. He talked me out of a procedure I did not actually need, which earned my trust.'
      }
    ]
  },
  {
    slug: 'farmingdale-braces-co',
    name: 'Dr. Olivia Chen',
    practice: 'Farmingdale Braces Co.',
    town: 'Farmingdale',
    specialty: 'Orthodontics',
    rating: 4.4,
    reviewCount: 23,
    reviews: [
      {
        author: 'Anthony V.',
        date: '2026-05-08',
        stars: 4,
        text: 'Good ortho experience for my daughter. The retainer follow-up was thorough and the staff sent helpful reminders.'
      },
      {
        author: 'Grace L.',
        date: '2026-03-22',
        stars: 5,
        text: 'Dr. Chen is patient and detail-oriented. My bite finally feels even after years of avoiding it.'
      }
    ]
  },
  {
    slug: 'hempstead-gentle-dentistry',
    name: 'Dr. Samuel Ortiz',
    practice: 'Hempstead Gentle Dentistry',
    town: 'Hempstead',
    specialty: 'General',
    rating: 4.3,
    reviewCount: 31,
    reviews: [
      {
        author: 'Denise C.',
        date: '2026-04-28',
        stars: 4,
        text: 'Truly gentle with anxious patients like me. They walked me through numbing options before we started anything.'
      },
      {
        author: 'Paul S.',
        date: '2026-02-14',
        stars: 5,
        text: 'Same-day appointment for a broken tooth and no upsell. Fair pricing and a caring team.'
      }
    ]
  },
  {
    slug: 'north-shore-kids-dental',
    name: 'Dr. Emily Ross',
    practice: 'North Shore Kids Dental',
    town: 'Huntington',
    specialty: 'Pediatric',
    rating: 4.8,
    reviewCount: 44,
    reviews: [
      {
        author: 'Monica J.',
        date: '2026-06-08',
        stars: 5,
        text: 'Dr. Ross turned my son’s first cavity into a calm, no-tears visit. The prize wall did not hurt either.'
      },
      {
        author: 'Derek F.',
        date: '2026-04-16',
        stars: 5,
        text: 'Great with special-needs kids. They gave us extra time and never once seemed rushed.'
      },
      {
        author: 'Aisha B.',
        date: '2026-01-30',
        stars: 4,
        text: 'Friendly and knowledgeable staff. Parking can be tight during after-school hours.'
      }
    ]
  },
  {
    slug: 'crescent-smile-studio',
    name: 'Dr. Nathan Brooks',
    practice: 'Crescent Smile Studio',
    town: 'Rockville Centre',
    specialty: 'Cosmetic',
    rating: 4.6,
    reviewCount: 19,
    reviews: [
      {
        author: 'Vanessa P.',
        date: '2026-05-25',
        stars: 5,
        text: 'A full smile makeover that still looks like me. Dr. Brooks listened carefully instead of pushing a one-size template.'
      },
      {
        author: 'Leo M.',
        date: '2026-03-04',
        stars: 4,
        text: 'Excellent bonding work on my front teeth. The color match was spot on and the visit was quick.'
      }
    ]
  }
];
