<script lang="ts">
  import { base } from '$app/paths';
  import { formatDate } from '$lib/articles';

  let { data } = $props();
</script>

<div class="region-page">
  <header class="region-masthead">
    <p class="eyebrow">Region</p>
    <h1>{data.label}</h1>
    <p class="lede">
      Cannabis policy, regulation, and industry developments across {data.label}, reported and
      source-attributed.
    </p>
  </header>

  {#if data.articles.length}
    <div class="river">
      {#each data.articles as a (a.slug)}
        <article class="river-item">
          <time class="river-date" datetime={a.date}>{formatDate(a.date)}</time>
          <h2>
            <a href="{base}/articles/{a.slug}/">{a.title}</a>
          </h2>
          <p class="river-dek">{a.dek}</p>
          <p class="river-byline">{a.author}</p>
        </article>
      {/each}
    </div>
  {:else}
    <p class="empty">No articles in this region yet.</p>
  {/if}
</div>

<style>
  .region-page {
    max-width: 760px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 2rem;
  }
  .region-masthead {
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-foreground);
    margin-bottom: 1.5rem;
  }
  .eyebrow {
    margin: 0 0 0.4rem;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    font-size: var(--text-sm);
  }
  h1 {
    margin: 0 0 0.75rem;
    font-size: var(--text-xl);
    line-height: 1.1;
    letter-spacing: -0.01em;
  }
  .lede {
    margin: 0;
    max-width: 60ch;
    font-size: var(--text-md);
    line-height: 1.5;
    color: var(--color-secondary);
  }
  .river {
    display: flex;
    flex-direction: column;
  }
  .river-item {
    padding: 1.5rem 0;
    border-bottom: 1px solid var(--color-border);
  }
  .river-date {
    display: block;
    margin-bottom: 0.4rem;
    font-size: var(--text-sm);
    color: var(--color-muted-foreground);
  }
  .river-item h2 {
    margin: 0 0 0.5rem;
    font-size: var(--text-lg);
    line-height: 1.15;
    letter-spacing: -0.01em;
    font-weight: 500;
  }
  .river-item h2 a {
    color: var(--color-foreground);
    text-decoration: none;
  }
  .river-item h2 a:hover,
  .river-item h2 a:focus-visible {
    color: var(--color-accent);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .river-dek {
    margin: 0 0 0.5rem;
    max-width: 65ch;
    font-size: var(--text-body);
    line-height: 1.5;
    color: var(--color-secondary);
  }
  .river-byline {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-muted-foreground);
  }
  .empty {
    padding: 2rem 0;
    color: var(--color-muted-foreground);
  }
</style>
