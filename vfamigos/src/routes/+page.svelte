<script lang="ts">
  import { base } from '$app/paths';
</script>

<section class="hero">
  <div class="blob" aria-hidden="true"></div>
  <div class="hero-inner">
    <h1>Meet the Amigos</h1>
    <p class="subhead">
      A cast of original collectible characters, each with their own story, series, and
      superpower. Start your collection and bring an Amigo home.
    </p>
    <!-- rel=external: route lands in Phase 3; drop rel then -->
    <a class="cta" href="{base}/products/" rel="external">Shop the Amigos</a>
  </div>
</section>

<style>
  .hero {
    position: relative;
    overflow: hidden;
    max-width: 1120px;
    margin: 0 auto;
    padding: 4rem 1.25rem 5rem;
  }
  .hero-inner {
    position: relative;
    z-index: 1;
    max-width: 640px;
  }
  h1 {
    font-size: 2.75rem;
    line-height: 1.1;
    color: var(--color-foreground);
    margin: 0 0 1rem;
  }
  .subhead {
    font-size: 1.125rem;
    line-height: 1.6;
    color: var(--color-text);
    margin: 0 0 2rem;
  }
  .cta {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 44px;
    padding: 0.75rem 2rem;
    border-radius: 999px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.125rem;
    text-decoration: none;
    transition: transform 150ms ease-out;
  }
  .cta:hover {
    transform: scale(1.02);
  }
  .cta:active {
    transform: scale(0.98);
  }
  .blob {
    position: absolute;
    top: -80px;
    right: -120px;
    width: 420px;
    height: 420px;
    z-index: 0;
    background: radial-gradient(circle at 30% 30%, var(--color-secondary), var(--color-primary));
    border-radius: 42% 58% 63% 37% / 41% 44% 56% 59%;
    opacity: 0.25;
    animation: drift 12s ease-in-out infinite;
  }
  @keyframes drift {
    0%,
    100% {
      transform: translate(0, 0) rotate(0deg);
    }
    50% {
      transform: translate(-20px, 20px) rotate(8deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .blob {
      animation: none;
    }
  }
</style>
