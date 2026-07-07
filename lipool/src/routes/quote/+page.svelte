<script lang="ts">
  import LeadForm from '$lib/components/LeadForm.svelte';

  const towns = [
    'Huntington',
    'Smithtown',
    'Babylon',
    'Islip',
    'Hempstead',
    'Oyster Bay',
    'Brookhaven',
    'North Hempstead'
  ];
</script>

<svelte:head>
  <title>Get a free pool quote — Lipool</title>
  <meta
    name="description"
    content="Request a free, no-obligation pool quote for installation, service, or renovation across Nassau & Suffolk County."
  />
</svelte:head>

<section class="quote">
  <div class="quote-main">
    <h1>Get a free pool quote</h1>
    <p class="lede">
      Tell us about your project and a Long Island pro will follow up — no obligation.
    </p>
    <LeadForm />
  </div>

  <aside class="quote-side" aria-label="Contact and service area">
    <div class="side-card">
      <h2>Prefer to call?</h2>
      <a class="side-call" href="tel:+15165550100" aria-label="Call Lipool at (516) 555-0100">
        <svg
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

    <div class="side-card">
      <h2>Hours</h2>
      <ul class="hours">
        <li><span>Mon–Fri</span><span>8:00 AM – 6:00 PM</span></li>
        <li><span>Saturday</span><span>9:00 AM – 2:00 PM</span></li>
        <li><span>Sunday</span><span>Closed</span></li>
      </ul>
    </div>

    <div class="side-card">
      <h2>Service area</h2>
      <p class="side-note">Proudly serving Nassau &amp; Suffolk, including:</p>
      <ul class="towns">
        {#each towns as town (town)}
          <li>{town}</li>
        {/each}
      </ul>
    </div>
  </aside>
</section>

<style>
  .quote {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
    gap: 2rem;
    max-width: 1120px;
    margin: 0 auto;
    padding: 3rem 1.25rem 4rem;
  }
  h1 {
    font-size: 2.25rem;
    color: var(--color-foreground);
    margin: 0 0 0.75rem;
  }
  .lede {
    color: var(--color-muted-foreground);
    font-size: 1.0625rem;
    line-height: 1.6;
    max-width: 52ch;
    margin: 0 0 2rem;
  }
  .quote-side {
    display: grid;
    gap: 1.25rem;
    align-content: start;
  }
  .side-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
  }
  .side-card h2 {
    font-size: 1.125rem;
    color: var(--color-foreground);
    margin: 0 0 0.75rem;
  }
  .side-call {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    color: var(--color-accent);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.125rem;
    text-decoration: none;
  }
  .side-call:hover {
    text-decoration: underline;
  }
  .hours {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.4rem;
  }
  .hours li {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    color: var(--color-muted-foreground);
  }
  .hours li span:first-child {
    color: var(--color-foreground);
    font-weight: 600;
  }
  .side-note {
    color: var(--color-muted-foreground);
    margin: 0 0 0.75rem;
    line-height: 1.6;
  }
  .towns {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .towns li {
    padding: 0.25rem 0.7rem;
    background: var(--color-muted);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    font-size: 0.9375rem;
    color: var(--color-foreground);
  }
  @media (max-width: 820px) {
    .quote {
      grid-template-columns: 1fr;
    }
  }
</style>
