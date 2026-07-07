<script lang="ts">
  import { base } from '$app/paths';
  import type { Product } from '$lib/data/products';

  let { product }: { product: Product } = $props();

  const initial = $derived(product.name.charAt(0).toUpperCase());
</script>

<!--
  TEMPORARY rel="external": the /products/[slug]/ route is created in Task 3 of this
  plan. Until then, this per-product link would be a dangling internal link and the
  prerender crawler (which renders this card on both the home grid and /products/)
  would follow it, 404, and fail the build. Task 3 strips this rel once the PDP route
  and its entries() exist, making these plain crawlable internal links.
-->
<a class="card" href="{base}/products/{product.slug}/" rel="external">
  <span class="art" style="background: {product.accent};" aria-hidden="true">
    <span class="monogram">{initial}</span>
  </span>
  <span class="body">
    <span class="name">{product.name}</span>
    <span class="series">{product.series}</span>
    <span class="price">${product.price}</span>
  </span>
</a>

<style>
  .card {
    display: flex;
    flex-direction: column;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 20px;
    overflow: hidden;
    text-decoration: none;
    color: var(--color-text);
    transition: transform 150ms ease-out;
  }
  .card:hover {
    transform: scale(1.02);
  }
  .card:active {
    transform: scale(0.98);
  }
  .art {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 4 / 3;
    width: 100%;
  }
  .monogram {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 4rem;
    line-height: 1;
    color: var(--color-on-primary);
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
  }
  .body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.875rem 1rem 1.125rem;
  }
  .name {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.125rem;
    color: var(--color-foreground);
  }
  .series {
    font-family: var(--font-body);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .price {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1rem;
    color: var(--color-text);
    margin-top: 0.25rem;
  }
</style>
