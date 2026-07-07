<script lang="ts">
  import '$lib/styles/tokens.css';
  import { onMount } from 'svelte';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  import { hydrate as hydrateCart } from '$lib/cart.svelte';
  let { children } = $props();

  // Client-only cart restore — onMount never runs on the server, so localStorage is
  // never touched during prerender. Badge fills in after mount (no empty-flash on repeat visits).
  onMount(() => {
    hydrateCart();
  });
</script>

<a class="skip-link" href="#main">Skip to content</a>
<SiteHeader />
<main id="main">{@render children()}</main>
<SiteFooter />

<style>
  .skip-link {
    position: absolute;
    left: -9999px;
    top: 0;
    z-index: 100;
    background: var(--color-primary);
    color: var(--color-on-primary);
    padding: 0.75rem 1rem;
    border-radius: 0 0 8px 0;
  }
  .skip-link:focus {
    left: 0;
  }
  :global(body) {
    margin: 0;
    font-family: var(--font-body);
    background: var(--color-background);
    color: var(--color-text, var(--color-foreground));
  }
  :global(h1),
  :global(h2),
  :global(h3) {
    font-family: var(--font-heading);
  }
  :global(:focus-visible) {
    outline: 3px solid var(--color-ring);
    outline-offset: 2px;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
</style>
