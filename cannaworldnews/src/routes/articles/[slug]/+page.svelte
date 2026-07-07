<script lang="ts">
  import { base } from '$app/paths';
  import { regionLabel, formatDate } from '$lib/articles';
  import Seo from '$lib/components/Seo.svelte';

  let { data } = $props();
  const article = $derived(data.article);
  const related = $derived(data.related);
  const region = $derived(regionLabel(article.region));
</script>

<Seo
  title={`${article.title} — CannaWorldNews`}
  description={article.dek || article.title}
  path={`/articles/${article.slug}/`}
  type="article"
  publishedTime={article.date}
/>

<article class="article">
  <p class="kicker">{region}</p>
  <h1>{article.title}</h1>

  <!-- byline/date block sits BETWEEN the headline and the body (D-08, NEWS-02) -->
  <div class="byline">
    <span class="author">By {article.author}</span>
    <span class="sep" aria-hidden="true">·</span>
    <time datetime={article.date}>{formatDate(article.date)}</time>
  </div>

  {#if article.dek}
    <p class="dek">{article.dek}</p>
  {/if}

  <!-- html-injection only on our own trusted, in-repo marked output (D-09) -->
  <div class="body">
    {@html article.html}
  </div>
</article>

{#if related.length}
  <aside class="related" aria-labelledby="related-title">
    <h2 id="related-title">More from {region}</h2>
    <ul>
      {#each related as a (a.slug)}
        <li>
          <a href="{base}/articles/{a.slug}/">{a.title}</a>
          <time datetime={a.date}>{formatDate(a.date)}</time>
        </li>
      {/each}
    </ul>
  </aside>
{/if}

<p class="back">
  <a href="{base}/region/{article.region}/">← Back to {region}</a>
</p>

<style>
  .article {
    max-width: 680px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 1rem;
  }
  .kicker {
    margin: 0 0 0.75rem;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    font-size: var(--text-sm);
  }
  h1 {
    margin: 0 0 1rem;
    font-size: var(--text-xl);
    line-height: 1.1;
    letter-spacing: -0.01em;
  }
  .byline {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
    padding-bottom: 1.25rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid var(--color-border);
    font-size: var(--text-sm);
    color: var(--color-muted-foreground);
  }
  .author {
    font-weight: 600;
    color: var(--color-secondary);
  }
  .dek {
    margin: 0 0 1.75rem;
    font-family: var(--font-heading);
    font-size: var(--text-md);
    line-height: 1.4;
    color: var(--color-secondary);
  }
  .body {
    font-size: var(--text-body);
    line-height: var(--line-body);
    color: var(--color-foreground);
  }

  /* markdown children rendered from marked output — scoped :global within the article body */
  .body :global(h2) {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    line-height: 1.2;
    letter-spacing: -0.01em;
    margin: 2rem 0 0.75rem;
  }
  .body :global(h3) {
    font-family: var(--font-heading);
    font-size: var(--text-md);
    margin: 1.75rem 0 0.5rem;
  }
  .body :global(p) {
    margin: 0 0 1.25rem;
  }
  .body :global(ul),
  .body :global(ol) {
    margin: 0 0 1.25rem;
    padding-left: 1.5rem;
  }
  .body :global(li) {
    margin: 0 0 0.4rem;
  }
  .body :global(a) {
    color: var(--color-accent);
    text-underline-offset: 3px;
  }
  .body :global(blockquote) {
    margin: 1.5rem 0;
    padding: 0.25rem 0 0.25rem 1.25rem;
    border-left: 3px solid var(--color-accent);
    font-family: var(--font-heading);
    font-size: var(--text-md);
    line-height: 1.4;
    color: var(--color-secondary);
  }
  .body :global(blockquote p) {
    margin: 0;
  }

  .related {
    max-width: 680px;
    margin: 2.5rem auto 0;
    padding: 1.5rem 1.25rem 0;
    border-top: 2px solid var(--color-foreground);
  }
  .related h2 {
    margin: 0 0 1rem;
    font-size: var(--text-md);
  }
  .related ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .related li {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .related a {
    color: var(--color-foreground);
    text-decoration: none;
    font-family: var(--font-heading);
    font-size: var(--text-base);
    font-weight: 500;
  }
  .related a:hover,
  .related a:focus-visible {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .related time {
    font-size: var(--text-sm);
    color: var(--color-muted-foreground);
  }

  .back {
    max-width: 680px;
    margin: 1.5rem auto 2rem;
    padding: 0 1.25rem;
  }
  .back a {
    color: var(--color-accent);
    text-decoration: none;
    font-size: var(--text-sm);
    font-weight: 600;
  }
  .back a:hover,
  .back a:focus-visible {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
</style>
