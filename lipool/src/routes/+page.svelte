<script lang="ts">
  import { base } from '$app/paths';
  import { services } from '$lib/data/services';
</script>

<section class="hero">
  <div class="hero-inner">
    <h1>Long Island's Pool People</h1>
    <p class="subhead">
      Free, no-obligation quotes on pool installation, service, and renovation across Nassau
      &amp; Suffolk. Licensed, insured, and local.
    </p>
    <div class="actions">
      <!-- rel=external: /quote lands in Phase 4; keep the guard -->
      <a class="cta" href="{base}/quote/" rel="external">Get a Free Quote</a>
      <a class="call" href="tel:+15165550100" aria-label="Call Lipool at (516) 555-0100">
        <svg
          class="icon"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
          />
        </svg>
        (516) 555-0100
      </a>
    </div>
  </div>
</section>

<section class="trust" aria-label="Why Long Island homeowners choose Lipool">
  <ul class="trust-strip">
    <li class="trust-item">
      <svg
        class="trust-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
      <span>Licensed &amp; Insured</span>
    </li>
    <li class="trust-item">
      <svg
        class="trust-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="6" />
        <path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5" />
      </svg>
      <span>20+ Years</span>
    </li>
    <li class="trust-item">
      <svg
        class="trust-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span>Nassau &amp; Suffolk</span>
    </li>
    <li class="trust-item">
      <svg
        class="trust-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 15l2 2 4-4" />
      </svg>
      <span>Free Estimates</span>
    </li>
  </ul>
</section>

<section id="services" class="services">
  <h2>Our Services</h2>
  <p class="services-lede">
    From a brand-new gunite build to a weekly cleaning, our Long Island crews handle every
    stage of pool ownership.
  </p>
  <ul class="service-grid">
    {#each services as service (service.slug)}
      <li class="service-card">
        <svg
          class="service-icon"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d={service.icon} />
        </svg>
        <h3>{service.title}</h3>
        <p>{service.blurb}</p>
        <!-- rel=external: /quote lands in Phase 4; keep the guard -->
        <a class="service-link" href="{base}/quote/" rel="external">
          Get a quote
          <span aria-hidden="true">&rarr;</span>
        </a>
      </li>
    {/each}
  </ul>
</section>

<section class="gallery-teaser">
  <div class="teaser-inner">
    <div>
      <h2>See our Long Island work</h2>
      <p>
        Browse representative pool builds, renovations, and seasonal work from across Nassau
        &amp; Suffolk County.
      </p>
    </div>
    <!-- internal link: /gallery/ is built this phase, so no rel guard -->
    <a class="teaser-link" href="{base}/gallery/">
      View the gallery
      <span aria-hidden="true">&rarr;</span>
    </a>
  </div>
</section>

<style>
  .hero {
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    color: var(--color-on-primary);
  }
  .hero-inner {
    max-width: 720px;
    margin: 0 auto;
    padding: 4.5rem 1.25rem 5rem;
  }
  h1 {
    font-size: 2.75rem;
    line-height: 1.15;
    margin: 0 0 1rem;
  }
  .subhead {
    font-size: 1.125rem;
    line-height: 1.6;
    margin: 0 0 2rem;
    max-width: 40ch;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0.75rem 1.75rem;
    border-radius: 8px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.0625rem;
    text-decoration: none;
    transition: background-color 150ms ease-out;
  }
  .cta:hover {
    background: var(--color-foreground);
  }
  .call {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 44px;
    padding: 0.5rem 0.75rem;
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    text-decoration: none;
  }
  .call:hover {
    text-decoration: underline;
  }
  .icon {
    display: block;
  }

  /* Trust strip */
  .trust {
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
  }
  .trust-strip {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem 2.5rem;
    max-width: 1120px;
    margin: 0 auto;
    padding: 1.5rem 1.25rem;
    list-style: none;
  }
  .trust-item {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    font-family: var(--font-heading);
    font-weight: 600;
    color: var(--color-foreground);
  }
  .trust-icon {
    display: block;
    color: var(--color-primary);
    flex-shrink: 0;
  }

  /* Services */
  .services {
    max-width: 1120px;
    margin: 0 auto;
    padding: 4rem 1.25rem;
  }
  .services h2 {
    font-size: 2rem;
    color: var(--color-foreground);
    margin: 0 0 1rem;
  }
  .services-lede {
    color: var(--color-muted-foreground);
    font-size: 1.0625rem;
    line-height: 1.6;
    max-width: 60ch;
    margin: 0 0 2.5rem;
  }
  .service-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .service-card {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 1.5rem;
  }
  .service-icon {
    display: block;
    color: var(--color-primary);
  }
  .service-card h3 {
    font-size: 1.25rem;
    color: var(--color-foreground);
    margin: 0;
  }
  .service-card p {
    color: var(--color-muted-foreground);
    line-height: 1.6;
    margin: 0;
    flex-grow: 1;
  }
  .service-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-height: 44px;
    color: var(--color-accent);
    font-family: var(--font-heading);
    font-weight: 600;
    text-decoration: none;
  }
  .service-link:hover {
    text-decoration: underline;
  }

  /* Gallery teaser */
  .gallery-teaser {
    background: var(--color-muted);
    border-top: 1px solid var(--color-border);
  }
  .teaser-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    max-width: 1120px;
    margin: 0 auto;
    padding: 3rem 1.25rem;
  }
  .teaser-inner h2 {
    font-size: 1.75rem;
    color: var(--color-foreground);
    margin: 0 0 0.5rem;
  }
  .teaser-inner p {
    color: var(--color-muted-foreground);
    line-height: 1.6;
    margin: 0;
    max-width: 48ch;
  }
  .teaser-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-height: 44px;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 150ms ease-out;
  }
  .teaser-link:hover {
    background: var(--color-primary);
  }
</style>
