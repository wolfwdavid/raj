<script lang="ts">
  import { base } from '$app/paths';
</script>

<footer>
  <!-- JSON-LD: Phase 3 -->
  <div class="inner">
    <div class="nap">
      <p class="brand-line">Lipool — Long Island's Pool People</p>
      <p class="area">Serving Nassau &amp; Suffolk County</p>
      <p>
        <a class="call" href="tel:+15165550100" aria-label="Call Lipool at (516) 555-0100"
          >(516) 555-0100</a
        >
      </p>
    </div>
    <nav aria-label="Footer">
      <ul>
        <!-- home services section — {base}-prefixed so it resolves from any page -->
        <li><a href="{base}/#services">Services</a></li>
        <!-- rel=external: route lands in Phase 3; drop rel then -->
        <li><a href="{base}/gallery/" rel="external">Gallery</a></li>
        <!-- rel=external: route lands in Phase 3; drop rel then -->
        <li><a href="{base}/quote/" rel="external">Get a Quote</a></li>
      </ul>
    </nav>
  </div>
</footer>

<style>
  footer {
    background: var(--color-muted);
    border-top: 1px solid var(--color-border);
    margin-top: 4rem;
  }
  .inner {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    max-width: 1120px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem;
  }
  .brand-line {
    font-family: var(--font-heading);
    font-weight: 600;
    color: var(--color-foreground);
    margin: 0 0 0.25rem;
  }
  .area {
    color: var(--color-muted-foreground);
    margin: 0 0 0.25rem;
  }
  .call {
    color: var(--color-primary);
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  nav a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 0.75rem;
    border-radius: 8px;
    font-family: var(--font-heading);
    font-weight: 500;
    color: var(--color-primary);
    text-decoration: none;
  }
  nav a:hover {
    background: var(--color-surface);
  }
</style>
