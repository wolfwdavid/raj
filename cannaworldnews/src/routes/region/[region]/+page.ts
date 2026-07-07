import { error } from '@sveltejs/kit';
import { REGIONS, articlesByRegion, regionLabel } from '$lib/articles';

// Prerender one page per fixed region so adapter-static emits every /region/<slug>/ (INFRA-05).
export const entries = () => REGIONS.map((r) => ({ region: r.slug }));

export const load = ({ params }: { params: { region: string } }) => {
  const region = REGIONS.find((r) => r.slug === params.region);
  if (!region) throw error(404, 'Unknown region');
  return {
    region: region.slug,
    label: regionLabel(region.slug),
    articles: articlesByRegion(region.slug)
  };
};
