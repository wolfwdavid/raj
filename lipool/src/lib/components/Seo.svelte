<script lang="ts">
  import { SITE_URL } from '$lib/config';

  interface Props {
    title: string;
    description: string;
    path: string; // logical route path, leading + trailing slash, e.g. '/gallery/'
    type?: string; // 'website' (default) | 'article'
    publishedTime?: string; // ISO date; only for type='article'
  }
  let { title, description, path, type = 'website', publishedTime }: Props = $props();

  const SITE_NAME = 'Lipool';
  // Absolute, SITE_URL-derived — NOT BASE_PATH. This is the whole point of QUAL-04.
  // $derived so canonical/OG stay correct across client-side navigation (dynamic routes).
  const url = $derived(SITE_URL + path);
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />

  <meta property="og:type" content={type} />
  <meta property="og:site_name" content={SITE_NAME} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  {#if publishedTime}
    <meta property="article:published_time" content={publishedTime} />
  {/if}

  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
</svelte:head>
