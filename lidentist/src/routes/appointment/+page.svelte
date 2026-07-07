<script lang="ts">
  import { page } from '$app/stores';
  import LeadForm from '$lib/components/LeadForm.svelte';
  import Seo from '$lib/components/Seo.svelte';

  // ?dentist= is only present client-side (prerender has no query) — read it in an effect
  // so the route still prerenders cleanly and the selection applies after mount.
  let selectedDentist = $state('');
  $effect(() => {
    selectedDentist = $page.url.searchParams.get('dentist') ?? '';
  });
</script>

<Seo
  title="Request an Appointment — Lidentist"
  description="Request a dental appointment on Long Island. Choose a dentist or leave it open — the office will reach out to confirm."
  path="/appointment/"
/>

<section class="appointment">
  <h1>Request an appointment</h1>
  <p class="lede">Choose a dentist (or leave it open) and we'll help you get booked.</p>
  <LeadForm {selectedDentist} />
</section>

<style>
  .appointment {
    max-width: 640px;
    margin: 0 auto;
    padding: 2.5rem 1.25rem 3.5rem;
  }
  h1 {
    margin: 0 0 0.5rem;
    font-size: var(--text-2xl);
    line-height: 1.15;
  }
  .lede {
    margin: 0 0 2rem;
    font-size: var(--text-md);
    line-height: var(--line-body);
    color: var(--color-muted-foreground);
    max-width: 52ch;
  }
</style>
