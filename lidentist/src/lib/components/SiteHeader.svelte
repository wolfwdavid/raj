<script lang="ts">
  import { base } from '$app/paths';
</script>

<header>
  <nav aria-label="Primary">
    <a class="brand" href="{base}/" aria-label="Lidentist home">
      <!-- tooth mark: inline SVG, never emoji -->
      <svg class="brand-mark" width="28" height="28" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M12 2.5c-2.4 0-3.5 1.2-5 1.2S4.3 3 3.2 4.2C1.9 5.7 2 8.4 2.7 11.4c.6 2.6 1.3 6.4 2.6 8.3.7 1 1.8.6 2.2-.6.4-1.2.8-3.6 1.6-4.5.6-.7 1.2-.7 1.9-.7s1.3 0 1.9.7c.8.9 1.2 3.3 1.6 4.5.4 1.2 1.5 1.6 2.2.6 1.3-1.9 2-5.7 2.6-8.3.7-3 .8-5.7-.5-7.2C17.5 3 16.3 3.7 15 3.7s-2.6-1.2-5-1.2z"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linejoin="round"
        />
      </svg>
      <span class="brand-text">Lidentist</span>
    </a>
    <ul>
      <li><a href="{base}/#directory">Find a Dentist</a></li>
      <li><a href="{base}/#how">How it Works</a></li>
      <li>
        <!-- rel=external: route lands in Phase 3; drop rel then -->
        <a class="cta" href="{base}/appointment/" rel="external">
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <rect x="3" y="4.5" width="18" height="16" rx="2" fill="none" stroke="currentColor" stroke-width="1.7" />
            <path d="M3 9h18M8 2.5v4M16 2.5v4" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
          </svg>
          Appointment
        </a>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    background: var(--color-surface);
    border-bottom: 2px solid var(--color-border);
  }
  nav {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex-wrap: wrap;
  }
  .brand {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 44px;
    color: var(--color-primary);
    text-decoration: none;
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: var(--text-lg);
  }
  .brand-text {
    letter-spacing: -0.01em;
  }
  ul {
    list-style: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0 0 0 auto;
    padding: 0;
    flex-wrap: wrap;
  }
  nav a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0 0.9rem;
    color: var(--color-foreground);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--text-base);
    border-radius: 8px;
  }
  ul li a:not(.cta):hover {
    background: var(--color-muted);
    color: var(--color-primary);
  }
  .cta {
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-weight: 700;
  }
  .cta:hover {
    filter: brightness(0.94);
  }
</style>
