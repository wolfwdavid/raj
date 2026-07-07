<script lang="ts">
  import Seo from '$lib/components/Seo.svelte';
  import { gallery } from '$lib/data/gallery';
</script>

<Seo
  title="Project Gallery — Lipool"
  description="See recent Long Island pool installation, service, and renovation projects across Nassau & Suffolk."
  path="/gallery/"
/>

<section class="gallery">
  <div class="gallery-head">
    <h1>Our Long Island Projects</h1>
    <p class="lede">
      A look at the kind of work we do across Nassau &amp; Suffolk County — from new gunite
      builds to renovations, liner replacements, and seasonal service.
    </p>
    <p class="disclaimer">
      Representative work shown for demonstration. These are illustrative project tiles, not
      photographs of specific jobs.
    </p>
  </div>

  <ul class="grid">
    {#each gallery as item (item.id)}
      <li>
        <figure class="tile" aria-label={item.alt}>
          <div
            class="art"
            style="--tile-accent: {item.accent};"
            role="img"
            aria-label={item.alt}
          >
            <svg
              class="art-mark"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M3 12c3 2 6 2 9 0s6-2 9 0M3 17c3 2 6 2 9 0s6-2 9 0" />
            </svg>
          </div>
          <figcaption>
            <span class="caption">{item.caption}</span>
            <span class="alt-text">{item.alt}</span>
          </figcaption>
        </figure>
      </li>
    {/each}
  </ul>
</section>

<style>
  .gallery {
    max-width: 1120px;
    margin: 0 auto;
    padding: 3.5rem 1.25rem 4.5rem;
  }
  .gallery-head {
    max-width: 60ch;
    margin: 0 0 2.5rem;
  }
  h1 {
    font-size: 2.5rem;
    line-height: 1.15;
    color: var(--color-foreground);
    margin: 0 0 1rem;
  }
  .lede {
    font-size: 1.0625rem;
    line-height: 1.6;
    color: var(--color-muted-foreground);
    margin: 0 0 0.75rem;
  }
  .disclaimer {
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--color-muted-foreground);
    font-style: italic;
    margin: 0;
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .tile {
    display: flex;
    flex-direction: column;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    overflow: hidden;
    margin: 0;
    height: 100%;
  }
  .art {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 4 / 3;
    background: linear-gradient(
      135deg,
      var(--tile-accent),
      color-mix(in srgb, var(--tile-accent) 55%, #ffffff)
    );
    color: var(--color-on-primary);
  }
  .art-mark {
    display: block;
    opacity: 0.85;
  }
  figcaption {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 1rem 1.25rem 1.25rem;
  }
  .caption {
    font-family: var(--font-heading);
    font-weight: 600;
    color: var(--color-foreground);
  }
  .alt-text {
    font-size: 0.9375rem;
    line-height: 1.5;
    color: var(--color-muted-foreground);
  }
</style>
