<script lang="ts">
  import { base } from '$app/paths';
</script>

<footer>
  <div class="inner">
    <p class="brand-line">Lidentist — find a great dentist on Long Island</p>

    <nav aria-label="Footer">
      <ul>
        <li><a href="{base}/#directory">Find a Dentist</a></li>
        <li><a href="{base}/#how">How it Works</a></li>
        <!-- rel=external: route lands in Phase 3; drop rel then -->
        <li><a href="{base}/appointment/" rel="external">Request an appointment</a></li>
      </ul>
    </nav>

    <!-- shell stub: full FTC labeling copy is Phase 5 / DENT-05 -->
    <p class="sample-note" role="note">
      Sample data for demonstration — not real dentists or reviews.
    </p>
  </div>
</footer>

<style>
  footer {
    background: var(--color-surface);
    border-top: 2px solid var(--color-border);
    margin-top: 3rem;
  }
  .inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 1.75rem 1.25rem 2.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
  .brand-line {
    margin: 0;
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: var(--text-md);
    color: var(--color-foreground);
  }
  nav ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.25rem;
    margin: 0;
    padding: 0;
  }
  nav a {
    min-height: 44px;
    display: inline-flex;
    align-items: center;
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 600;
    font-size: var(--text-base);
  }
  nav a:hover {
    text-decoration: underline;
  }
  .sample-note {
    margin: 0;
    padding: 0.75rem 1rem;
    background: var(--color-muted);
    border-left: 4px solid var(--color-accent);
    border-radius: 4px;
    color: var(--color-foreground);
    font-size: var(--text-base);
    font-weight: 500;
  }
</style>
