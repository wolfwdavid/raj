import { error } from '@sveltejs/kit';
import { products } from '$lib/data/products';

// Enumerate every product slug so adapter-static prerenders one page per Amigo
// (D-02 prerender completeness — built page count must equal the record count).
export const entries = () => products.map((p) => ({ slug: p.slug }));

export function load({ params }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) error(404, 'Amigo not found');
  return { product };
}
