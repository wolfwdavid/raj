<script lang="ts">
  import { base } from '$app/paths';

  // Region routes now exist (/region/[region]/ prerendered via entries()) so the rel="external"
  // guard is dropped — these are plain crawlable internal links.
  const regions = [
    { label: 'Americas', slug: 'americas' },
    { label: 'Europe', slug: 'europe' },
    { label: 'Africa', slug: 'africa' },
    { label: 'Asia-Pacific', slug: 'asia-pacific' }
  ];
</script>

<header>
  <div class="masthead">
    <a class="wordmark" href="{base}/">CannaWorldNews</a>
    <p class="tagline">Cannabis news from around the world</p>
  </div>
  <nav aria-label="Regions">
    <ul>
      {#each regions as r}
        <li>
          <a href="{base}/region/{r.slug}/">{r.label}</a>
        </li>
      {/each}
    </ul>
  </nav>
</header>

<style>
  header {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }
  .masthead {
    max-width: 1120px;
    margin: 0 auto;
    padding: 1.75rem 1.25rem 1rem;
    text-align: center;
  }
  .wordmark {
    display: inline-block;
    min-height: 44px;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 3rem);
    letter-spacing: -0.01em;
    color: var(--color-foreground);
    text-decoration: none;
    line-height: 1.1;
  }
  .tagline {
    margin: 0.35rem 0 0;
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--color-muted-foreground);
  }
  nav {
    border-top: 1px solid var(--color-border);
  }
  nav ul {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 1.25rem;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.25rem 1.5rem;
  }
  nav a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    /* accent-green uppercase letterspaced region labels (accent for kickers/links only) */
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
    font-size: var(--text-sm);
    text-decoration: none;
  }
  nav a:hover,
  nav a:focus-visible {
    text-decoration: underline;
    text-underline-offset: 4px;
  }
</style>
