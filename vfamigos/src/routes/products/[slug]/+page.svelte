<script lang="ts">
  import { base } from '$app/paths';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
  const product = $derived(data.product);
  const initial = $derived(product.name.charAt(0).toUpperCase());
</script>

<article class="pdp">
  <a class="back" href="{base}/products/">&larr; Back to all Amigos</a>

  <div class="layout">
    <div class="art" style="background: {product.accent};" aria-hidden="true">
      <span class="monogram">{initial}</span>
    </div>

    <div class="panel">
      <p class="series">{product.series}</p>
      <h1>{product.name}</h1>
      <p class="tagline">{product.tagline}</p>
      <p class="bio">{product.bio}</p>

      <ul class="traits">
        {#each product.traits as trait (trait)}
          <li class="trait">{trait}</li>
        {/each}
      </ul>

      <div class="buy">
        <span class="price">${product.price}</span>
        <button class="add" type="button" disabled aria-describedby="cart-note">
          Add to collection
        </button>
      </div>
      <p id="cart-note" class="cart-note">Cart coming soon — checkout opens in the next release.</p>
    </div>
  </div>
</article>

<style>
  .pdp {
    max-width: 1120px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
  }
  .back {
    display: inline-block;
    margin-bottom: 1.5rem;
    color: var(--color-accent);
    font-weight: 700;
    text-decoration: none;
  }
  .back:hover {
    text-decoration: underline;
  }
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    align-items: start;
  }
  .art {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1 / 1;
    border-radius: 24px;
  }
  .monogram {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 8rem;
    line-height: 1;
    color: var(--color-on-primary);
    text-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
  }
  .panel {
    padding-top: 0.5rem;
  }
  .series {
    font-family: var(--font-body);
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--color-primary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin: 0 0 0.5rem;
  }
  h1 {
    font-size: 2.5rem;
    color: var(--color-foreground);
    margin: 0 0 0.75rem;
  }
  .tagline {
    font-size: 1.1875rem;
    font-style: italic;
    color: var(--color-text);
    margin: 0 0 1.25rem;
  }
  .bio {
    font-size: 1.0625rem;
    line-height: 1.7;
    color: var(--color-text);
    margin: 0 0 1.5rem;
  }
  .traits {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0;
    margin: 0 0 2rem;
  }
  .trait {
    padding: 0.375rem 0.875rem;
    border-radius: 999px;
    background: var(--color-muted);
    color: var(--color-foreground);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 0.875rem;
  }
  .buy {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    flex-wrap: wrap;
  }
  .price {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 2rem;
    color: var(--color-foreground);
  }
  .add {
    min-height: 44px;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 999px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.0625rem;
    cursor: not-allowed;
    opacity: 0.6;
  }
  .cart-note {
    margin: 0.75rem 0 0;
    font-size: 0.875rem;
    color: var(--color-text);
  }
  @media (max-width: 720px) {
    .layout {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    .monogram {
      font-size: 6rem;
    }
  }
</style>
