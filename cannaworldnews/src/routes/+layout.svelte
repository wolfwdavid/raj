<script lang="ts">
  import '$lib/styles/tokens.css';
  import SiteHeader from '$lib/components/SiteHeader.svelte';
  import SiteFooter from '$lib/components/SiteFooter.svelte';
  let { children } = $props();
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
    font-weight: 600;
  }
  .skip-link:focus {
    left: 0;
  }
  :global(body) {
    margin: 0;
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: var(--line-body, 1.7);
    background: var(--color-background);
    color: var(--color-foreground);
    -webkit-font-smoothing: antialiased;
  }
  :global(h1),
  :global(h2),
  :global(h3) {
    font-family: var(--font-heading);
    color: var(--color-foreground);
  }
  /* print-like stillness: 2px offset underline + 3px ring; reduced-motion irrelevant by design */
  :global(:focus-visible) {
    outline: 3px solid var(--color-ring);
    outline-offset: 2px;
    transition: none;
  }
  @media (prefers-reduced-motion: reduce) {
    :global(*) {
      animation: none !important;
      transition: none !important;
      scroll-behavior: auto !important;
    }
  }
</style>
