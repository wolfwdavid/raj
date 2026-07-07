import { error } from '@sveltejs/kit';
import { articles, getArticle, articlesByRegion } from '$lib/articles';

// Prerender one page per article slug so adapter-static emits every /articles/<slug>/ (INFRA-05).
export const entries = () => articles.map((a) => ({ slug: a.slug }));

export const load = ({ params }: { params: { slug: string } }) => {
  const article = getArticle(params.slug);
  if (!article) throw error(404, 'Article not found');
  const related = articlesByRegion(article.region)
    .filter((a) => a.slug !== article.slug)
    .slice(0, 4);
  return { article, related };
};
