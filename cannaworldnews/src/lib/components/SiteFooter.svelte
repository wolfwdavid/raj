<script lang="ts">
  import { base } from '$app/paths';

  const regions = [
    { label: 'Americas', slug: 'americas' },
    { label: 'Europe', slug: 'europe' },
    { label: 'Africa', slug: 'africa' },
    { label: 'Asia-Pacific', slug: 'asia-pacific' }
  ];
</script>

<footer>
  <div class="inner">
    <p class="about">
      CannaWorldNews reports on cannabis policy, science, and industry shifts from every region —
      Swiss rigor, not head-shop kitsch.
    </p>

    <nav aria-label="Region index">
      <ul>
        {#each regions as r}
          <li><a href="{base}/region/{r.slug}/">{r.label}</a></li>
        {/each}
      </ul>
    </nav>

    <p class="disclaimer">
      CannaWorldNews reports on cannabis policy and industry developments worldwide.
      Informational only — not legal or medical advice.
    </p>
  </div>
</footer>

<style>
  footer {
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    margin-top: 4rem;
  }
  .inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 2rem 1.25rem 2.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .about {
    margin: 0;
    max-width: 65ch;
    font-size: var(--text-base);
    color: var(--color-muted-foreground);
  }
  nav ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 1.5rem;
    margin: 0;
    padding: 0;
    border-top: 1px solid var(--color-border);
    padding-top: 1rem;
  }
  nav a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
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
  .disclaimer {
    margin: 0;
    font-size: var(--text-sm);
    color: var(--color-muted-foreground);
    font-style: italic;
  }
</style>
