<script lang="ts">
  import { base } from '$app/paths';
  import Seo from '$lib/components/Seo.svelte';
</script>

<Seo
  title="Our Story — Vfamigos"
  description="Why the Amigos? Every character is an original, built to carry a little courage, kindness, or curiosity — no borrowed faces."
  path="/about/"
/>

<section class="about">
  <div class="section-inner">
    <h1>The Story of the Amigos</h1>

    <p class="lead">
      Vfamigos began with a simple idea: a collectible should mean something. Not just a shelf
      trophy, but a small companion that carries a good trait with it — courage, kindness,
      curiosity — and reminds you of it every time you see it.
    </p>

    <p>
      Every Amigo is an original character, drawn by hand and given a name, a season, and a
      personality all their own. Pablo is brave. Lulu is endlessly curious. Milo is kinder than a
      Tuesday deserves. We release them in seasons, so the cast keeps growing and every collection
      tells a slightly different story.
    </p>

    <p>
      We care about the craft. No borrowed likenesses, no bargain-bin clip art, and never a
      character we wouldn't be proud to keep ourselves. Each Amigo is built to be held onto — the
      kind of thing you pass down, not throw away.
    </p>

    <p>
      Ready to meet them? <a class="link" href="{base}/products/">Browse the full collection</a> and
      find the Amigo that feels like you.
    </p>
  </div>
</section>

<style>
  .section-inner {
    max-width: 760px;
    margin: 0 auto;
    padding: 3rem 1.25rem 4rem;
  }
  h1 {
    font-size: 2.5rem;
    color: var(--color-foreground);
    margin: 0 0 1rem;
  }
  .lead {
    font-size: 1.1875rem;
    line-height: 1.6;
    color: var(--color-text);
    margin: 0 0 1.5rem;
  }
  p {
    font-size: 1.0625rem;
    line-height: 1.7;
    color: var(--color-text);
    margin: 0 0 1.25rem;
  }
  .link {
    color: var(--color-accent);
    font-weight: 700;
  }
</style>
