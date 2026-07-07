<script lang="ts">
  import { base } from '$app/paths';
</script>

<header>
  <nav aria-label="Primary">
    <a class="brand" href="{base}/">vfamigos</a>
    <ul>
      <li><a class="nav-link" href="{base}/products/">Shop</a></li>
      <li><a class="nav-link" href="{base}/about/">About</a></li>
      <li>
        <!-- rel=external: /cart/ is a Phase-4 route; keep the crawler guard until then -->
        <a class="cart" href="{base}/cart/" rel="external">
          <svg
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          <span class="cart-badge" aria-label="Cart, 0 items">0</span>
        </a>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    position: sticky;
    top: 0;
    z-index: 50;
    background: var(--color-surface);
    border-bottom: 2px solid var(--color-border);
  }
  nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 1120px;
    margin: 0 auto;
    padding: 0.5rem 1.25rem;
  }
  .brand {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--color-primary);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 0.25rem;
  }
  ul {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-link {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    min-width: 44px;
    justify-content: center;
    padding: 0 1rem;
    border-radius: 16px;
    font-family: var(--font-heading);
    font-weight: 600;
    color: var(--color-foreground);
    text-decoration: none;
    transition: background-color 150ms ease-out;
  }
  .nav-link:hover {
    background: var(--color-muted);
  }
  .cart {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    min-width: 44px;
    padding: 0 0.75rem;
    border-radius: 16px;
    color: var(--color-primary);
    text-decoration: none;
    transition: background-color 150ms ease-out;
  }
  .cart:hover {
    background: var(--color-muted);
  }
  .icon {
    display: block;
  }
  .cart-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    min-width: 18px;
    height: 18px;
    padding: 0 4px;
    border-radius: 9px;
    background: var(--color-primary);
    color: var(--color-on-primary);
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 700;
    line-height: 18px;
    text-align: center;
  }
</style>
