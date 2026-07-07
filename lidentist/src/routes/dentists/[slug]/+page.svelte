<script lang="ts">
  import { base } from '$app/paths';
  import StarRating from '$lib/components/StarRating.svelte';
  import SampleDataBanner from '$lib/components/SampleDataBanner.svelte';

  let { data } = $props();
  const dentist = $derived(data.dentist);

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // Deterministic date format (no locale) so prerender and hydration agree.
  function formatDate(iso: string): string {
    const [y, m, d] = iso.split('-').map(Number);
    return `${MONTHS[m - 1]} ${d}, ${y}`;
  }
</script>

<SampleDataBanner />

<article class="detail">
  <p class="back"><a href="{base}/">← Back to the directory</a></p>

  <header class="head">
    <div class="head-main">
      <h1>{dentist.name}</h1>
      <p class="practice">{dentist.practice}</p>
      <p class="meta">
        <span class="town">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
              fill="none"
              stroke="currentColor"
              stroke-width="1.7"
              stroke-linejoin="round"
            />
            <circle cx="12" cy="10" r="2.4" fill="none" stroke="currentColor" stroke-width="1.7" />
          </svg>
          {dentist.town}
        </span>
        <span class="specialty">{dentist.specialty}</span>
      </p>
      <div class="rating-row">
        <StarRating rating={dentist.rating} reviewCount={dentist.reviewCount} />
      </div>
    </div>

    <!-- rel="external": /appointment/ is a Phase-4 route; keep the crawler guard. -->
    <a class="cta" href="{base}/appointment/?dentist={dentist.slug}" rel="external">
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <rect x="3" y="4.5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.7" />
        <path d="M3 9h18M8 2.5v4M16 2.5v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
      </svg>
      Request an appointment
    </a>
  </header>

  <section class="reviews" aria-labelledby="reviews-title">
    <h2 id="reviews-title">Patient reviews</h2>
    <ul class="review-list">
      {#each dentist.reviews as review (review.author + review.date)}
        <li class="review-card">
          <div class="review-head">
            <h3 class="reviewer">{review.author}</h3>
            <time class="date" datetime={review.date}>{formatDate(review.date)}</time>
          </div>
          <span class="review-stars" role="img" aria-label="{review.stars} out of 5 stars">
            <span class="stars" aria-hidden="true">
              {#each [0, 1, 2, 3, 4] as i (i)}
                <svg
                  class="star {i < review.stars ? 'star-full' : ''}"
                  viewBox="0 0 24 24"
                  focusable="false"
                >
                  <path
                    d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z"
                  />
                </svg>
              {/each}
            </span>
            <span class="star-value">{review.stars.toFixed(1)}</span>
          </span>
          <p class="review-text">{review.text}</p>
        </li>
      {/each}
    </ul>
  </section>
</article>

<style>
  .detail {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 1.25rem 3rem;
  }
  .back {
    margin: 0 0 1.25rem;
  }
  .back a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    color: var(--color-primary);
    font-weight: 600;
    text-decoration: none;
  }
  .back a:hover {
    text-decoration: underline;
  }
  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.25rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--color-border);
  }
  .head-main {
    min-width: 0;
  }
  h1 {
    margin: 0 0 0.35rem;
    font-size: var(--text-2xl);
    line-height: 1.15;
  }
  .practice {
    margin: 0 0 0.6rem;
    font-size: var(--text-md);
    color: var(--color-muted-foreground);
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 1rem;
    margin: 0 0 0.75rem;
  }
  .town {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    font-size: var(--text-base);
    color: var(--color-foreground);
  }
  .specialty {
    display: inline-flex;
    align-items: center;
    padding: 0.15rem 0.7rem;
    background: var(--color-muted);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-primary);
  }
  .rating-row {
    margin-top: 0.25rem;
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
  .reviews {
    margin-top: 2rem;
  }
  h2 {
    margin: 0 0 1rem;
    font-size: var(--text-xl);
  }
  .review-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 1rem;
  }
  .review-card {
    padding: 1.25rem;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 12px;
  }
  .review-head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.35rem 1rem;
    margin-bottom: 0.5rem;
  }
  .reviewer {
    margin: 0;
    font-size: var(--text-md);
    font-weight: 600;
  }
  .date {
    font-size: var(--text-sm);
    color: var(--color-muted-foreground);
  }
  .review-stars {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 0.5rem;
  }
  .review-stars .stars {
    display: inline-flex;
    gap: 1px;
    line-height: 0;
  }
  .star {
    width: 17px;
    height: 17px;
    display: block;
    flex: 0 0 auto;
    fill: var(--color-muted);
    stroke: var(--color-muted-foreground);
    stroke-width: 1;
  }
  .star-full {
    fill: var(--color-rating);
    stroke: none;
  }
  .star-value {
    font-weight: 700;
    font-size: var(--text-base);
    color: var(--color-foreground);
  }
  .review-text {
    margin: 0;
    font-size: var(--text-md);
    line-height: 1.6;
    color: var(--color-foreground);
  }
</style>
