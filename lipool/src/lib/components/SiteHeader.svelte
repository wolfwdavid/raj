<script lang="ts">
  import { base } from '$app/paths';
</script>

<header>
  <nav aria-label="Primary">
    <a class="brand" href="{base}/">Lipool</a>
    <ul>
      <!-- home services section — {base}-prefixed so it resolves from any page -->
      <li><a class="nav-link" href="{base}/#services">Services</a></li>
      <li><a class="nav-link" href="{base}/gallery/">Gallery</a></li>
      <li>
        <a class="call" href="tel:+15165550100" aria-label="Call Lipool at (516) 555-0100">
          <svg
            class="icon"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path
              d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"
            />
          </svg>
          <span class="call-label">(516) 555-0100</span>
        </a>
      </li>
      <li>
        <!-- rel=external: /quote/ is a Phase-4 route; keep the crawler guard until then -->
        <a class="cta" href="{base}/quote/" rel="external">Get Quote</a>
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
    border-bottom: 1px solid var(--color-border);
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
    padding: 0 0.75rem;
    border-radius: 8px;
    font-family: var(--font-heading);
    font-weight: 500;
    color: var(--color-foreground);
    text-decoration: none;
    transition: background-color 150ms ease-out;
  }
  .nav-link:hover {
    background: var(--color-muted);
  }
  .call {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    min-height: 44px;
    padding: 0 0.75rem;
    border-radius: 8px;
    color: var(--color-primary);
    font-family: var(--font-body);
    font-weight: 600;
    text-decoration: none;
    transition: background-color 150ms ease-out;
  }
  .call:hover {
    background: var(--color-muted);
  }
  .icon {
    display: block;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0 1.25rem;
    border-radius: 8px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    text-decoration: none;
    transition: background-color 150ms ease-out;
  }
  .cta:hover {
    background: var(--color-primary);
  }
  @media (max-width: 560px) {
    .call-label {
      display: none;
    }
  }
</style>
