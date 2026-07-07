import { error } from '@sveltejs/kit';
import { dentists } from '$lib/data/dentists';

// Enumerate every dentist slug so adapter-static prerenders a page for each record
// (entries() completeness — the build asserts pages built == records).
export const entries = () => dentists.map((d) => ({ slug: d.slug }));

export function load({ params }: { params: { slug: string } }) {
  const dentist = dentists.find((d) => d.slug === params.slug);
  if (!dentist) error(404, 'Dentist not found');
  return { dentist };
}
