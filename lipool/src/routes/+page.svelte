<script lang="ts">
  import { base } from '$app/paths';
</script>

<section class="hero">
  <div class="hero-inner">
    <h1>Long Island's Pool People</h1>
    <p class="subhead">
      Free, no-obligation quotes on pool installation, service, and renovation across Nassau
      &amp; Suffolk. Licensed, insured, and local.
    </p>
    <div class="actions">
      <!-- rel=external: route lands in Phase 3; drop rel then -->
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

<section id="services" class="services">
  <h2>Our Services</h2>
  <p class="services-lede">
    Pool installation, liner replacement, openings &amp; closings, maintenance, repairs, and
    renovation. Service details are on the way.
  </p>
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
    margin: 0;
  }
</style>
