<script lang="ts">
  import { base } from '$app/paths';
  import StarRating from './StarRating.svelte';
  import type { Dentist } from '$lib/data/dentists';

  let { dentist }: { dentist: Dentist } = $props();

  const initials = $derived(
    dentist.name
      .replace(/^Dr\.?\s*/i, '')
      .split(/\s+/)
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  );
</script>

<article class="card">
  <a class="card-link" href="{base}/dentists/{dentist.slug}/">
    <span class="avatar" aria-hidden="true">{initials}</span>
    <span class="body">
      <span class="name">{dentist.name}</span>
      <span class="practice">{dentist.practice}</span>
      <span class="meta">
        <span class="town">
          <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
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
      </span>
      <StarRating rating={dentist.rating} reviewCount={dentist.reviewCount} />
    </span>
  </a>
</article>

<style>
  .card {
    height: 100%;
  }
  .card-link {
    display: flex;
    gap: 1rem;
    height: 100%;
    box-sizing: border-box;
    min-height: 44px;
    padding: 1.1rem;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 12px;
    text-decoration: none;
    color: var(--color-foreground);
    transition: box-shadow 150ms ease, transform 150ms ease;
  }
  .card-link:hover {
    box-shadow: 0 6px 18px rgba(8, 145, 178, 0.15);
    transform: translateY(-2px);
  }
  .avatar {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: var(--color-primary);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: var(--text-md);
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    min-width: 0;
  }
  .name {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: var(--text-md);
    color: var(--color-foreground);
  }
  .practice {
    font-size: var(--text-base);
    color: var(--color-muted-foreground);
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem 0.75rem;
    margin: 0.15rem 0 0.35rem;
  }
  .town {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: var(--text-base);
    color: var(--color-foreground);
  }
  .specialty {
    display: inline-flex;
    align-items: center;
    padding: 0.15rem 0.6rem;
    background: var(--color-muted);
    border: 1px solid var(--color-border);
    border-radius: 999px;
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--color-primary);
  }
</style>
