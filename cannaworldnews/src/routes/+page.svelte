<script lang="ts">
  // Front-page lead proving the Swiss editorial type system. Real article rivers arrive with
  // the Phase-3 markdown pipeline; a single typographic lead card is enough to prove the aesthetic.
</script>

<div class="front">
  <article class="lead" aria-labelledby="lead-title">
    <p class="kicker">Americas</p>
    <h1 id="lead-title">
      Rescheduling reshapes the map of legal cannabis across the Americas
    </h1>
    <p class="dek">
      As federal policy shifts, growers, regulators, and patients weigh what a new classification
      means for medicine, commerce, and cross-border research — reported region by region.
    </p>
    <p class="byline">
      <span>CannaWorldNews Desk</span>
      <span class="sep" aria-hidden="true">·</span>
      <time datetime="2026-07-07">July 7, 2026</time>
    </p>
  </article>

  <aside class="secondary" aria-label="More coverage">
    <p class="section-rule">Follow the world's cannabis policy shifts</p>
    <ul>
      <li>
        <p class="s-kicker">Europe</p>
        <h2>Pilot programs test regulated adult-use retail in three member states</h2>
      </li>
      <li>
        <p class="s-kicker">Africa</p>
        <h2>Medical export licenses expand as cultivation scales up</h2>
      </li>
      <li>
        <p class="s-kicker">Asia-Pacific</p>
        <h2>Courts revisit possession statutes amid regional reform debate</h2>
      </li>
    </ul>
  </aside>
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
  @media (max-width: 720px) {
    .front {
      display: block;
    }
    .lead {
      border-right: none;
      padding-right: 0;
      margin-bottom: 2rem;
    }
  }
</style>
