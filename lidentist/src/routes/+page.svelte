<script lang="ts">
  import { base } from '$app/paths';

  // Specialty chips shown in the hero (client-side filter of static data lands in Phase 3 / DENT-01).
  const specialties = ['General', 'Pediatric', 'Orthodontics', 'Cosmetic', 'Oral Surgery'];
</script>

<section class="hero" aria-labelledby="hero-title">
  <div class="hero-inner">
    <p class="eyebrow">Long Island dentist directory</p>
    <h1 id="hero-title">Find a great dentist on Long Island</h1>
    <p class="dek">
      Compare local practices by specialty and town, read patient reviews, and request an
      appointment — an unbiased, accessible public-utility directory.
    </p>
    <a class="cta" href="{base}/appointment/" rel="external">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="4.5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.7" />
        <path d="M3 9h18M8 2.5v4M16 2.5v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
      </svg>
      Request an appointment
    </a>

    <ul class="chips" aria-label="Browse by specialty">
      {#each specialties as s}
        <li><a href="#directory">{s}</a></li>
      {/each}
    </ul>
  </div>
</section>

<section id="directory" class="panel" aria-labelledby="directory-title">
  <div class="panel-inner">
    <h2 id="directory-title">Long Island Dentists</h2>
    <p>
      A searchable directory of local practices with specialty tags, town, and patient ratings is
      coming next. Each listing will include a numeric star rating and review count alongside the
      stars — never color alone.
    </p>
  </div>
</section>

<section id="how" class="panel muted" aria-labelledby="how-title">
  <div class="panel-inner">
    <h2 id="how-title">How it works</h2>
    <ol class="steps">
      <li><strong>Search</strong> by specialty and town to shortlist nearby dentists.</li>
      <li><strong>Compare</strong> practices using transparent ratings and patient reviews.</li>
      <li><strong>Request</strong> an appointment — we pass your details straight to the practice.</li>
    </ol>
  </div>
</section>

<style>
  .hero {
    background: linear-gradient(180deg, var(--color-background), var(--color-surface));
    border-bottom: 2px solid var(--color-border);
  }
  .hero-inner,
  .panel-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 3.5rem 1.25rem;
  }
  .eyebrow {
    margin: 0 0 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
    font-size: var(--text-sm);
    color: var(--color-primary);
  }
  h1 {
    margin: 0 0 1rem;
    font-size: var(--text-2xl);
    line-height: 1.15;
    max-width: 18ch;
  }
  .dek {
    margin: 0 0 1.75rem;
    max-width: 60ch;
    font-size: var(--text-md);
    color: var(--color-foreground);
  }
  .cta {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 48px;
    padding: 0 1.4rem;
    background: var(--color-accent);
    color: var(--color-on-primary);
    text-decoration: none;
    font-weight: 700;
    font-size: var(--text-md);
    border-radius: 10px;
  }
  .cta:hover {
    filter: brightness(0.94);
  }
  .chips {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin: 2rem 0 0;
    padding: 0;
  }
  .chips a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 1rem;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 999px;
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--text-base);
  }
  .chips a:hover {
    background: var(--color-muted);
  }
  .panel.muted {
    background: var(--color-muted);
  }
  h2 {
    margin: 0 0 0.75rem;
    font-size: var(--text-xl);
  }
  .panel p {
    margin: 0;
    max-width: 65ch;
    font-size: var(--text-md);
    color: var(--color-foreground);
  }
  .steps {
    margin: 0;
    padding-left: 1.25rem;
    max-width: 65ch;
    font-size: var(--text-md);
    line-height: 1.7;
    color: var(--color-foreground);
  }
  .steps li {
    margin-bottom: 0.5rem;
  }
</style>
