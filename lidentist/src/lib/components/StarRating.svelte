<script lang="ts">
  // Accessible star rating. The five stars are decorative (aria-hidden); the
  // accessible name is carried by the container's aria-label, and the numeric
  // value + review count are always visible text — never color alone (DENT-06).
  let { rating, reviewCount }: { rating: number; reviewCount: number } = $props();

  const display = $derived(rating.toFixed(1));
  const pct = $derived(Math.max(0, Math.min(100, (rating / 5) * 100)));
  const stars = [0, 1, 2, 3, 4];
  const starPath = 'M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z';
</script>

<span class="rating" role="img" aria-label="{display} out of 5 stars, {reviewCount} reviews">
  <span class="stars" aria-hidden="true">
    <span class="row row-empty">
      {#each stars as s (s)}
        <svg class="star" viewBox="0 0 24 24" focusable="false"><path d={starPath} /></svg>
      {/each}
    </span>
    <span class="row row-full" style="width: {pct}%">
      <span class="row-inner">
        {#each stars as s (s)}
          <svg class="star star-full" viewBox="0 0 24 24" focusable="false"><path d={starPath} /></svg>
        {/each}
      </span>
    </span>
  </span>
  <span class="value">{display}</span>
  <span class="count">{reviewCount} reviews</span>
</span>

<style>
  .rating {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
  }
  .stars {
    position: relative;
    display: inline-flex;
    line-height: 0;
  }
  .row {
    display: inline-flex;
    gap: 1px;
  }
  .row-full {
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
  }
  .row-inner {
    display: inline-flex;
    gap: 1px;
  }
  .star {
    width: 18px;
    height: 18px;
    display: block;
    flex: 0 0 auto;
  }
  .row-empty .star {
    fill: var(--color-muted);
    stroke: var(--color-muted-foreground);
    stroke-width: 1;
  }
  .star-full {
    fill: var(--color-rating);
  }
  .value {
    font-weight: 700;
    font-size: var(--text-base);
    color: var(--color-foreground);
  }
  .count {
    font-size: var(--text-sm);
    color: var(--color-muted-foreground);
  }
</style>
