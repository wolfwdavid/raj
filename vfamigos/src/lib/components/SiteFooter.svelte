<script lang="ts">
  import { base } from '$app/paths';
</script>

<footer>
  <div class="inner">
    <p class="brand-line">vfamigos — collect the Amigos</p>
    <nav aria-label="Footer">
      <ul>
        <!-- rel=external: route lands in Phase 3; drop rel then -->
        <li><a href="{base}/products/" rel="external">Shop</a></li>
        <!-- rel=external: route lands in Phase 3; drop rel then -->
        <li><a href="{base}/about/" rel="external">About</a></li>
      </ul>
    </nav>
  </div>
</footer>

<style>
  footer {
    background: var(--color-muted);
    border-top: 2px solid var(--color-border);
    margin-top: 4rem;
  }
  .inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    max-width: 1120px;
    margin: 0 auto;
    padding: 2rem 1.25rem;
  }
  .brand-line {
    font-family: var(--font-heading);
    font-weight: 600;
    color: var(--color-foreground);
    margin: 0;
  }
  ul {
    display: flex;
    gap: 0.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 1rem;
    border-radius: 16px;
    font-family: var(--font-heading);
    font-weight: 600;
    color: var(--color-primary);
    text-decoration: none;
  }
  a:hover {
    background: var(--color-surface);
  }
</style>
