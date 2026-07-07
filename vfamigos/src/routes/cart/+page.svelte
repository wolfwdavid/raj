<script lang="ts">
  import { base } from '$app/paths';
  import { cart } from '$lib/cart.svelte';
  import { STRIPE_PAYMENT_LINK } from '$lib/config';
  const configured = $derived(STRIPE_PAYMENT_LINK.length > 0);
</script>

<section class="cart-page">
  <h1>Your cart</h1>

  {#if cart.items.length === 0}
    <div class="empty">
      <p class="empty-msg">Your cart is empty.</p>
      <a class="shop-cta" href="{base}/products/">Shop the Amigos</a>
    </div>
  {:else}
    <ul class="lines">
      {#each cart.items as item (item.slug)}
        <li class="line">
          <span class="swatch" style="background:{item.accent}" aria-hidden="true"></span>
          <span class="line-name">{item.name}</span>
          <span class="unit">${item.price}</span>
          <div class="stepper" role="group" aria-label="Quantity for {item.name}">
            <button
              class="step"
              type="button"
              onclick={() => cart.setQty(item.slug, item.qty - 1)}
              aria-label="Decrease quantity of {item.name}"
            >
              &minus;
            </button>
            <span class="qty">{item.qty}</span>
            <button
              class="step"
              type="button"
              onclick={() => cart.setQty(item.slug, item.qty + 1)}
              aria-label="Increase quantity of {item.name}"
            >
              +
            </button>
          </div>
          <span class="line-total">${item.price * item.qty}</span>
          <button
            class="remove"
            type="button"
            onclick={() => cart.remove(item.slug)}
            aria-label="Remove {item.name} from cart"
          >
            Remove
          </button>
        </li>
      {/each}
    </ul>
  {/if}

  <!-- Summary + checkout render regardless of cart contents. The checkout control is
       gated on STRIPE_PAYMENT_LINK (config), never on a fabricated success. When the link
       is empty the button is disabled and the not-configured note is shown — this is the
       honest hand-off surfaced in the prerendered HTML, not a simulated order. -->
  <div class="summary">
    <p class="subtotal">Subtotal: <strong>${cart.subtotal}</strong></p>

    {#if configured}
      <a class="checkout" href={STRIPE_PAYMENT_LINK}>Checkout</a>
    {:else}
      <button class="checkout" type="button" disabled aria-describedby="checkout-note">
        Checkout
      </button>
      <p id="checkout-note" class="checkout-note">
        Checkout is not yet configured — add a Stripe Payment Link (STRIPE_PAYMENT_LINK) in
        src/lib/config.ts to enable it.
      </p>
    {/if}
  </div>
</section>

<style>
  .cart-page {
    max-width: 840px;
    margin: 0 auto;
    padding: 2rem 1.25rem 4rem;
  }
  h1 {
    font-size: 2.5rem;
    color: var(--color-foreground);
    margin: 0 0 1.5rem;
  }
  .empty {
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 24px;
    padding: 3rem 2rem;
    text-align: center;
  }
  .empty-msg {
    font-size: 1.1875rem;
    color: var(--color-text);
    margin: 0 0 1.5rem;
  }
  .shop-cta {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0.75rem 2rem;
    border-radius: 999px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.0625rem;
    text-decoration: none;
  }
  .lines {
    list-style: none;
    margin: 0 0 2rem;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  .line {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 16px;
    padding: 0.875rem 1.125rem;
  }
  .swatch {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    flex: none;
  }
  .line-name {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.0625rem;
    color: var(--color-foreground);
    flex: 1 1 8rem;
  }
  .unit {
    color: var(--color-text);
    font-weight: 600;
  }
  .stepper {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }
  .step {
    min-width: 44px;
    min-height: 44px;
    border: 2px solid var(--color-border);
    border-radius: 12px;
    background: var(--color-surface);
    color: var(--color-foreground);
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.25rem;
    line-height: 1;
    cursor: pointer;
    transition: background-color 150ms ease-out;
  }
  .step:hover {
    background: var(--color-muted);
  }
  .qty {
    min-width: 2rem;
    text-align: center;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.0625rem;
    color: var(--color-foreground);
  }
  .line-total {
    font-family: var(--font-heading);
    font-weight: 700;
    color: var(--color-foreground);
    min-width: 3.5rem;
    text-align: right;
  }
  .remove {
    min-height: 44px;
    padding: 0 1rem;
    border: 2px solid var(--color-destructive);
    border-radius: 12px;
    background: transparent;
    color: var(--color-destructive);
    font-family: var(--font-heading);
    font-weight: 600;
    cursor: pointer;
    transition: background-color 150ms ease-out;
  }
  .remove:hover {
    background: rgba(220, 38, 38, 0.08);
  }
  .summary {
    border-top: 2px solid var(--color-border);
    padding-top: 1.5rem;
    text-align: right;
  }
  .subtotal {
    font-size: 1.25rem;
    color: var(--color-text);
    margin: 0 0 1.25rem;
  }
  .subtotal strong {
    font-family: var(--font-heading);
    color: var(--color-foreground);
  }
  .checkout {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0.75rem 2.5rem;
    border: none;
    border-radius: 999px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.0625rem;
    text-decoration: none;
    cursor: pointer;
  }
  .checkout:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  .checkout-note {
    margin: 0.875rem 0 0;
    font-size: 0.875rem;
    color: var(--color-text);
    text-align: right;
  }
  @media (max-width: 560px) {
    .line {
      gap: 0.625rem;
    }
    .summary,
    .checkout-note {
      text-align: left;
    }
  }
</style>
