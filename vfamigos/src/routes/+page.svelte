<script lang="ts">
  import { base } from '$app/paths';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { products } from '$lib/data/products';
</script>

<Seo
  title="Vfamigos — Original Collectible Amigo Characters"
  description="Meet the Amigos: a cast of original collectible characters, each with their own story, series, and superpower. Start your collection."
  path="/"
/>

<section class="hero">
  <div class="blob" aria-hidden="true"></div>
  <div class="hero-inner">
    <h1>Meet the Amigos</h1>
    <p class="subhead">
      A cast of original collectible characters, each with their own story, series, and
      superpower. Start your collection and bring an Amigo home.
    </p>
    <a class="cta" href="{base}/products/">Shop the Amigos</a>
  </div>
</section>

<section id="products" class="grid-section" aria-labelledby="grid-heading">
  <div class="section-inner">
    <h2 id="grid-heading">The Collection</h2>
    <p class="section-lead">Every Amigo is one of a kind — pick the personality that speaks to you.</p>
    <ul class="grid">
      {#each products as product (product.slug)}
        <li><ProductCard {product} /></li>
      {/each}
    </ul>
  </div>
</section>

<section id="about" class="about-teaser" aria-labelledby="about-heading">
  <div class="section-inner">
    <h2 id="about-heading">Why the Amigos?</h2>
    <p>
      The Amigos started as a promise: that a collectible could carry a little courage, kindness,
      or curiosity with it. Each character is drawn from a trait worth celebrating and given a
      name, a season, and a story of their own.
    </p>
    <p>
      We build every Amigo as an original — no borrowed faces, no cheap clip art, just characters
      made to be kept. <a class="about-link" href="{base}/about/">Read the whole story</a>.
    </p>
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

  .section-inner {
    max-width: 1120px;
    margin: 0 auto;
    padding: 0 1.25rem;
  }
  .grid-section {
    padding: 1rem 0 3rem;
  }
  h2 {
    font-size: 2rem;
    color: var(--color-foreground);
    margin: 0 0 0.5rem;
  }
  .section-lead {
    font-size: 1.0625rem;
    color: var(--color-text);
    margin: 0 0 2rem;
  }
  .grid {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
  .about-teaser {
    padding: 2.5rem 0 4rem;
  }
  .about-teaser p {
    font-size: 1.0625rem;
    line-height: 1.6;
    color: var(--color-text);
    max-width: 680px;
    margin: 0 0 1rem;
  }
  .about-link {
    color: var(--color-accent);
    font-weight: 700;
  }
</style>
