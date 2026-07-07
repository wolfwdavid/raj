<script lang="ts">
  import { base } from '$app/paths';
  import { onMount } from 'svelte';
  import { cart } from '$lib/cart.svelte';
  // /thanks/ is the Stripe Payment Link's dashboard-configured post-payment redirect.
  // It's a static page — it does NOT read the cart or claim a specific order. Clearing
  // the cart here is browser-guarded (onMount runs client-side only).
  onMount(() => {
    cart.clear();
  });
</script>

<section class="thanks">
  <h1>Thank you!</h1>
  <p class="lead">
    Your order is confirmed. A receipt and order confirmation will follow by email from Stripe.
  </p>
  <p class="note">Your cart has been cleared.</p>
  <a class="home" href="{base}/products/">Keep collecting the Amigos</a>
</section>

<style>
  .thanks {
    max-width: 640px;
    margin: 0 auto;
    padding: 4rem 1.25rem 5rem;
    text-align: center;
  }
  h1 {
    font-size: 3rem;
    color: var(--color-primary);
    margin: 0 0 1rem;
  }
  .lead {
    font-size: 1.1875rem;
    line-height: 1.7;
    color: var(--color-text);
    margin: 0 0 0.75rem;
  }
  .note {
    font-size: 1rem;
    color: var(--color-text);
    margin: 0 0 2rem;
  }
  .home {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0.875rem 2.5rem;
    border-radius: 999px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.0625rem;
    text-decoration: none;
  }
</style>
