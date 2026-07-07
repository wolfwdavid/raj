<script lang="ts">
  import { base } from '$app/paths';

  // HomeAndConstructionBusiness structured data for local SEO (POOL-05).
  // Deliberately NO aggregateRating/review — there are no visible on-page reviews,
  // and marking up a rating without them trips Google's spammy-structured-data filter.
  // Every value below matches the visible NAP block 1:1.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HomeAndConstructionBusiness',
    name: 'Lipool',
    telephone: '+1-516-555-0100',
    areaServed: ['Nassau County', 'Suffolk County'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: '120 Sunrise Highway',
      addressLocality: 'Massapequa',
      addressRegion: 'NY',
      postalCode: '11758',
      addressCountry: 'US'
    }
  };
</script>

<footer>
  <div class="inner">
    <div class="nap">
      <p class="brand-line">Lipool — Long Island's Pool People</p>
      <address class="nap-address">
        120 Sunrise Highway, Massapequa, NY 11758
      </address>
      <p class="area">Serving Nassau County &amp; Suffolk County</p>
      <p>
        <a class="call" href="tel:+15165550100" aria-label="Call Lipool at (516) 555-0100"
          >(516) 555-0100</a
        >
      </p>
    </div>
    <nav aria-label="Footer">
      <ul>
        <!-- home services section — {base}-prefixed so it resolves from any page -->
        <li><a href="{base}/#services">Services</a></li>
        <li><a href="{base}/gallery/">Gallery</a></li>
        <!-- rel=external: /quote/ is a Phase-4 route; keep the crawler guard until then -->
        <li><a href="{base}/quote/" rel="external">Get a Quote</a></li>
      </ul>
    </nav>
  </div>
</footer>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted, build-time JSON-LD only -->
{@html `<script type="application/ld+json">${JSON.stringify(jsonLd)}</` + `script>`}

<style>
  footer {
    background: var(--color-muted);
    border-top: 1px solid var(--color-border);
    margin-top: 4rem;
  }
  .inner {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    max-width: 1120px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem;
  }
  .brand-line {
    font-family: var(--font-heading);
    font-weight: 600;
    color: var(--color-foreground);
    margin: 0 0 0.25rem;
  }
  .nap-address {
    display: block;
    font-style: normal;
    color: var(--color-muted-foreground);
    margin: 0 0 0.25rem;
  }
  .area {
    color: var(--color-muted-foreground);
    margin: 0 0 0.25rem;
  }
  .call {
    color: var(--color-primary);
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  nav a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 0.75rem;
    border-radius: 8px;
    font-family: var(--font-heading);
    font-weight: 500;
    color: var(--color-primary);
    text-decoration: none;
  }
  nav a:hover {
    background: var(--color-surface);
  }
</style>
