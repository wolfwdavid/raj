// Build-time article index for CannaWorldNews.
//
// Markdown articles live in ../content/articles/*.md with YAML frontmatter. They are loaded
// EAGERLY as raw strings via Vite's import.meta.glob, parsed with gray-matter (frontmatter ->
// fields), and rendered to HTML with marked. All of this executes at module load — i.e. during
// the Node prerender pass — so the routes ship ZERO markdown-parsing JS to the client and every
// article page is fully static HTML.
import matter from 'gray-matter';
import { marked } from 'marked';

export interface Article {
  slug: string;
  title: string;
  dek: string;
  region: string;
  date: string;
  author: string;
  html: string; // marked-rendered body
}

// The four fixed regions. `slug` matches the `region:` frontmatter value and the /region/[region]/
// route param; `label` is the display string.
export const REGIONS: { slug: string; label: string }[] = [
  { slug: 'americas', label: 'Americas' },
  { slug: 'europe', label: 'Europe' },
  { slug: 'africa', label: 'Africa' },
  { slug: 'asia-pacific', label: 'Asia-Pacific' }
];

export function regionLabel(slug: string): string {
  return REGIONS.find((r) => r.slug === slug)?.label ?? slug;
}

// Deterministic markdown -> HTML. Synchronous so the module can build `articles` eagerly at load.
marked.setOptions({ gfm: true, breaks: false });

// Eager raw glob: every .md file is inlined as a string at build time.
const rawArticles = import.meta.glob('../content/articles/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
}) as Record<string, string>;

function build(): Article[] {
  const list: Article[] = [];
  for (const [path, raw] of Object.entries(rawArticles)) {
    const { data, content } = matter(raw);
    const fileSlug = path.split('/').pop()!.replace(/\.md$/, '');
    const html = marked.parse(content) as string;
    list.push({
      slug: (data.slug as string) ?? fileSlug,
      title: (data.title as string) ?? fileSlug,
      dek: (data.dek as string) ?? '',
      region: (data.region as string) ?? '',
      date: (data.date as string) ?? '',
      author: (data.author as string) ?? '',
      html
    });
  }
  // Newest-first by ISO date (string compare is correct for YYYY-MM-DD), stable tiebreak by slug.
  list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
  return list;
}

export const articles: Article[] = build();

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function articlesByRegion(region: string): Article[] {
  // `articles` is already newest-first, so the filtered view preserves that order.
  return articles.filter((a) => a.region === region);
}
