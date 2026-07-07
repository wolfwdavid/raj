<script lang="ts">
  import { base } from '$app/paths';
  import { articles, REGIONS, articlesByRegion, regionLabel, formatDate } from '$lib/articles';
  import Seo from '$lib/components/Seo.svelte';

  // Newest article leads the front page. The rest fill per-region rivers below.
  const lead = articles[0];
</script>

<Seo
  title="CannaWorldNews — Global Cannabis Policy & Industry News"
  description="Cannabis policy, science, and industry developments from every region. Informational only — not legal or medical advice."
  path="/"
/>

<div class="front">
  {#if lead}
    <article class="lead" aria-labelledby="lead-title">
      <p class="kicker">{regionLabel(lead.region)}</p>
      <h1 id="lead-title">
        <a href="{base}/articles/{lead.slug}/">{lead.title}</a>
      </h1>
      <p class="dek">{lead.dek}</p>
      <p class="byline">
        <span>{lead.author}</span>
        <span class="sep" aria-hidden="true">·</span>
        <time datetime={lead.date}>{formatDate(lead.date)}</time>
      </p>
    </article>

    <aside class="secondary" aria-label="More coverage">
      <p class="section-rule">Follow the world's cannabis policy shifts</p>
      <ul>
        {#each articles.slice(1, 5) as a (a.slug)}
          <li>
            <p class="s-kicker">{regionLabel(a.region)}</p>
            <h2>
              <a href="{base}/articles/{a.slug}/">{a.title}</a>
            </h2>
          </li>
        {/each}
      </ul>
    </aside>
  {/if}
</div>

<div class="regions">
  {#each REGIONS as r (r.slug)}
    {@const list = articlesByRegion(r.slug).slice(0, 3)}
    {#if list.length}
      <section class="region-section" aria-labelledby="region-{r.slug}">
        <h2 class="region-title" id="region-{r.slug}">
          <!-- /region/[region]/ is built in THIS task → no rel, safe to crawl -->
          <a href="{base}/region/{r.slug}/">{r.label}</a>
        </h2>
        <div class="cards">
          {#each list as a (a.slug)}
            <article class="card">
              <p class="s-kicker">{regionLabel(a.region)}</p>
              <h3>
                <a href="{base}/articles/{a.slug}/">{a.title}</a>
              </h3>
              <p class="card-dek">{a.dek}</p>
              <time class="card-date" datetime={a.date}>{formatDate(a.date)}</time>
            </article>
          {/each}
        </div>
      </section>
    {/if}
  {/each}
</div>

<style>
  .front {
    max-width: 1120px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 1rem;
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 2.5rem;
  }
  .lead {
    grid-column: 1 / span 8;
    border-right: 1px solid var(--color-border);
    padding-right: 2.5rem;
  }
  .kicker,
  .s-kicker {
    margin: 0 0 0.6rem;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    font-size: var(--text-sm);
  }
  h1 {
    margin: 0 0 1rem;
    font-size: clamp(2.25rem, 5vw, var(--text-lead));
    line-height: 1.05;
    letter-spacing: -0.01em;
  }
  .dek {
    margin: 0 0 1.25rem;
    max-width: 60ch;
    font-size: var(--text-md);
    line-height: 1.5;
    color: var(--color-secondary);
  }
  .byline {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-muted-foreground);
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }
  .secondary {
    grid-column: 9 / span 4;
  }
  .section-rule {
    margin: 0 0 1rem;
    padding-bottom: 0.6rem;
    border-bottom: 2px solid var(--color-foreground);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: var(--text-base);
  }
  .secondary ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .secondary li {
    padding: 1rem 0;
    border-bottom: 1px solid var(--color-border);
  }
  .secondary h2 {
    margin: 0;
    font-size: var(--text-md);
    line-height: 1.2;
    font-weight: 500;
  }

  .regions {
    max-width: 1120px;
    margin: 0 auto;
    padding: 1rem 1.25rem 2rem;
  }
  .region-section {
    padding-top: 2rem;
    margin-top: 2rem;
    border-top: 1px solid var(--color-border);
  }
  .region-title {
    margin: 0 0 1.25rem;
    font-size: var(--text-lg);
    letter-spacing: -0.01em;
  }
  .cards {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .card h3 {
    margin: 0;
    font-family: var(--font-heading);
    font-size: var(--text-md);
    line-height: 1.2;
    font-weight: 500;
  }
  .card-dek {
    margin: 0;
    font-size: var(--text-base);
    line-height: 1.5;
    color: var(--color-secondary);
  }
  .card-date {
    font-size: var(--text-sm);
    color: var(--color-muted-foreground);
  }

  /* article-card + section links: near-black, accent on hover/focus (Swiss editorial) */
  h1 a,
  .secondary h2 a,
  .card h3 a {
    color: var(--color-foreground);
    text-decoration: none;
  }
  .region-title a {
    color: var(--color-accent);
    text-decoration: none;
  }
  h1 a:hover,
  h1 a:focus-visible,
  .secondary h2 a:hover,
  .secondary h2 a:focus-visible,
  .card h3 a:hover,
  .card h3 a:focus-visible,
  .region-title a:hover,
  .region-title a:focus-visible {
    text-decoration: underline;
    text-underline-offset: 3px;
    color: var(--color-accent);
  }

  @media (max-width: 720px) {
    .front {
      display: block;
    }
    .lead {
      border-right: none;
      padding-right: 0;
      margin-bottom: 2rem;
    }
    .cards {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
</style>
