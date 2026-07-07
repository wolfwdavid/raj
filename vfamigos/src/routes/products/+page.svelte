<script lang="ts">
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { products } from '$lib/data/products';
</script>

<section class="shop">
  <div class="section-inner">
    <h1>Shop the Amigos</h1>
    <p class="lead">
      The full cast, ready to adopt. Tap any Amigo to hear their story and add them to your
      collection.
    </p>
    <ul class="grid">
      {#each products as product (product.slug)}
        <li><ProductCard {product} /></li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .section-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 3rem 1.25rem 4rem;
  }
  h1 {
    font-size: 2.5rem;
    color: var(--color-foreground);
    margin: 0 0 0.5rem;
  }
  .lead {
    font-size: 1.0625rem;
    line-height: 1.6;
    color: var(--color-text);
    max-width: 640px;
    margin: 0 0 2rem;
  }
  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
</style>
