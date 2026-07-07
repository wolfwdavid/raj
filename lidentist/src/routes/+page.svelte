<script lang="ts">
  import { base } from '$app/paths';
  import { dentists, SPECIALTIES } from '$lib/data/dentists';
  import DentistCard from '$lib/components/DentistCard.svelte';
  import SampleDataBanner from '$lib/components/SampleDataBanner.svelte';

  const towns = [...new Set(dentists.map((d) => d.town))].sort();

  let selectedSpecialty = $state('All');
  let selectedTown = $state('All');

  const filtered = $derived(
    dentists.filter(
      (d) =>
        (selectedSpecialty === 'All' || d.specialty === selectedSpecialty) &&
        (selectedTown === 'All' || d.town === selectedTown)
    )
  );
</script>

<SampleDataBanner />

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
      {#each SPECIALTIES as s (s)}
        <li><a href="#directory">{s}</a></li>
      {/each}
    </ul>
  </div>
</section>

<section id="directory" class="panel" aria-labelledby="directory-title">
  <div class="panel-inner">
    <h2 id="directory-title">Long Island Dentists</h2>
    <p class="directory-lead">
      Filter by specialty and town. Every listing shows a numeric star rating and review count
      alongside the stars — never color alone.
    </p>

    <div class="filters">
      <div class="field">
        <label for="filter-specialty">Specialty</label>
        <select id="filter-specialty" bind:value={selectedSpecialty}>
          <option value="All">All specialties</option>
          {#each SPECIALTIES as s (s)}
            <option value={s}>{s}</option>
          {/each}
        </select>
      </div>
      <div class="field">
        <label for="filter-town">Town</label>
        <select id="filter-town" bind:value={selectedTown}>
          <option value="All">All towns</option>
          {#each towns as t (t)}
            <option value={t}>{t}</option>
          {/each}
        </select>
      </div>
    </div>

    <p class="results-count" aria-live="polite" role="status">
      {filtered.length}
      {filtered.length === 1 ? 'dentist' : 'dentists'}
    </p>

    {#if filtered.length > 0}
      <ul class="grid">
        {#each filtered as d (d.slug)}
          <li><DentistCard dentist={d} /></li>
        {/each}
      </ul>
    {:else}
      <p class="empty">No dentists match those filters. Try widening your search.</p>
    {/if}
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
  .directory-lead {
    margin: 0 0 1.5rem;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 1.5rem;
    margin-bottom: 1.25rem;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 220px;
  }
  .field label {
    font-weight: 600;
    font-size: var(--text-base);
    color: var(--color-foreground);
  }
  .field select {
    min-height: 48px;
    padding: 0 0.9rem;
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--color-foreground);
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 10px;
  }
  .results-count {
    margin: 0 0 1.25rem;
    font-weight: 600;
    font-size: var(--text-md);
    color: var(--color-foreground);
  }
  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  .empty {
    margin: 0;
    font-size: var(--text-md);
    color: var(--color-muted-foreground);
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
