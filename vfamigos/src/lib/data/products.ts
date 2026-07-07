// Original "Amigo" collectible characters — an original brand (NOT VeeFriends
// names or trade dress). Imagery is CSS/SVG-generated only: each character's art
// is its `accent` field behind the name's monogram (first initial). There are no
// binary image assets and no external image URLs anywhere in this catalog.

export interface Product {
  // Quoted key so the prerender-completeness guard (which counts record slug
  // lines vs prerendered pages) stays exact and never miscounts this type line.
  'slug': string; // kebab-case, unique — e.g. 'pablo-the-brave'
  name: string; // 'Pablo the Brave'
  series: string; // 'Season One'
  price: number; // USD, e.g. 24
  tagline: string; // one-line hook
  bio: string; // 2-3 sentences of character story
  traits: string[]; // e.g. ['Brave', 'Loyal', 'Curious']
  accent: string; // per-character hex for the art block, e.g. '#F59E0B'
}

export const products: Product[] = [
  {
    slug: 'pablo-the-brave',
    name: 'Pablo the Brave',
    series: 'Season One',
    price: 28,
    tagline: 'The little lion who never backs down from a big feeling.',
    bio: "Pablo learned early that being brave isn't about never being scared — it's about showing up anyway. He keeps a tiny pebble in his pocket from the first mountain he ever climbed, and he'll hand it to any Amigo who needs a boost of courage.",
    traits: ['Brave', 'Loyal', 'Encouraging'],
    accent: '#DC2626'
  },
  {
    slug: 'lulu-the-curious',
    name: 'Lulu the Curious',
    series: 'Season One',
    price: 24,
    tagline: 'Asks a hundred questions before breakfast — and finds the good ones.',
    bio: 'Lulu carries a well-worn notebook everywhere, filling it with sketches of things nobody else stopped to notice. Her favorite word is "why," and her second favorite is "let\'s find out."',
    traits: ['Curious', 'Observant', 'Playful', 'Open-minded'],
    accent: '#7C3AED'
  },
  {
    slug: 'milo-the-kind',
    name: 'Milo the Kind',
    series: 'Season One',
    price: 26,
    tagline: 'Keeps a spare umbrella for whoever forgot theirs.',
    bio: 'Milo believes the smallest gestures carry the biggest weight, so he collects little ways to help and gives them away for free. When an Amigo has a rough day, Milo is already halfway there with a warm drink and an open ear.',
    traits: ['Kind', 'Generous', 'Patient'],
    accent: '#0D9488'
  },
  {
    slug: 'nova-the-dreamer',
    name: 'Nova the Dreamer',
    series: 'Season One',
    price: 30,
    tagline: 'Star-charts her ideas before anyone says they can’t be done.',
    bio: 'Nova sees constellations where others see empty sky, connecting far-off dots into plans nobody thought possible. She keeps a jar of "someday" ideas on her shelf and pulls one out whenever the world feels too small.',
    traits: ['Imaginative', 'Optimistic', 'Ambitious', 'Bold'],
    accent: '#2563EB'
  },
  {
    slug: 'theo-the-steady',
    name: 'Theo the Steady',
    series: 'Season Two',
    price: 32,
    tagline: 'Slow is smooth, and smooth is how Theo gets it done.',
    bio: "Theo never rushes and never quits, finishing the long jobs everyone else abandons at the halfway mark. His friends say if you want something built to last, you build it with Theo — and you bring snacks, because he's in no hurry.",
    traits: ['Patient', 'Reliable', 'Focused'],
    accent: '#B45309'
  },
  {
    slug: 'juni-the-joyful',
    name: 'Juni the Joyful',
    series: 'Season Two',
    price: 22,
    tagline: 'Turns a boring Tuesday into a reason to dance.',
    bio: 'Juni measures a day in laughs, not hours, and has never met a puddle she wouldn\'t splash in. Her superpower is finding the fun that was hiding in plain sight the whole time.',
    traits: ['Joyful', 'Energetic', 'Spontaneous', 'Warm'],
    accent: '#DB2777'
  },
  {
    slug: 'ramon-the-clever',
    name: 'Ramon the Clever',
    series: 'Season Two',
    price: 27,
    tagline: 'There’s always another way — Ramon just found three.',
    bio: 'Ramon loves a locked door, because it means there\'s a puzzle on the other side worth solving. He\'d rather be resourceful than right, and he\'ll happily hand you the answer once you\'ve had the fun of almost getting there yourself.',
    traits: ['Clever', 'Resourceful', 'Witty'],
    accent: '#059669'
  },
  {
    slug: 'ivy-the-honest',
    name: 'Ivy the Honest',
    series: 'Season Two',
    price: 25,
    tagline: 'Tells you the truth — and stays to help you fix it.',
    bio: 'Ivy believes honesty is a kindness, not a weapon, so she says the hard thing gently and never walks away after. Amigos trust her with their secrets because she guards them like they\'re her own.',
    traits: ['Honest', 'Trustworthy', 'Grounded', 'Caring'],
    accent: '#4338CA'
  },
  {
    slug: 'gus-the-grateful',
    name: 'Gus the Grateful',
    series: 'Season Three',
    price: 24,
    tagline: 'Keeps a jar of good moments and never lets one go to waste.',
    bio: 'Gus writes down one small good thing every night, and after a year his jar overflowed with reasons to smile. When an Amigo forgets what\'s going right, Gus reads a few out loud until the day looks brighter.',
    traits: ['Grateful', 'Content', 'Thoughtful'],
    accent: '#EA580C'
  },
  {
    slug: 'suki-the-bold',
    name: 'Suki the Bold',
    series: 'Season Three',
    price: 34,
    tagline: 'First to raise a hand, first to try the scary thing.',
    bio: 'Suki treats "I\'ve never done that before" as the best possible reason to start right now. She\'s tumbled off plenty of skateboards, but she\'s always up before her friends can finish gasping.',
    traits: ['Bold', 'Fearless', 'Determined', 'Spirited'],
    accent: '#BE123C'
  }
];
