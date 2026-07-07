<script lang="ts">
  import { FORM_ENDPOINT } from '$lib/config';
  import { dentists } from '$lib/data/dentists';

  let { selectedDentist = '' }: { selectedDentist?: string } = $props();

  const configured = FORM_ENDPOINT.length > 0;
  type Status = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured';
  let status = $state<Status>('idle');
  let errorMsg = $state('');

  // Inline field errors (client validation). Announced via the aria-live region.
  let fieldErrors = $state<{ name?: string; contact?: string }>({});

  function validate(fd: FormData): boolean {
    const next: typeof fieldErrors = {};
    if (!(fd.get('name') as string)?.trim()) next.name = 'Please tell us your name.';
    if (!(fd.get('contact') as string)?.trim())
      next.contact = 'Add a phone number or email so the office can reach you.';
    fieldErrors = next;
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(event: SubmitEvent) {
    const form = event.currentTarget as HTMLFormElement;
    const fd = new FormData(form);
    // Honeypot: real users never fill it. If present, silently drop.
    if ((fd.get('_gotcha') as string)?.length) {
      event.preventDefault();
      return;
    }
    // No endpoint configured -> do NOT fake success. Show the not-configured note.
    if (!configured) {
      event.preventDefault();
      status = 'unconfigured';
      return;
    }
    // Client validation for inline feedback (native required also guards the no-JS path).
    if (!validate(fd)) {
      event.preventDefault();
      status = 'error';
      errorMsg = 'Please fix the highlighted fields and try again.';
      return;
    }
    // Progressive enhancement: intercept for inline feedback. (Without JS, the native
    // POST to FORM_ENDPOINT proceeds unmodified — this handler simply never runs.)
    event.preventDefault();
    status = 'submitting';
    errorMsg = '';
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        status = 'success';
        fieldErrors = {};
        form.reset();
      } else {
        status = 'error';
        errorMsg = 'Something went wrong sending your request. Please call the office or try again.';
      }
    } catch {
      status = 'error';
      errorMsg = 'Network error. Please call the office or try again.';
    }
  }
</script>

<form
  class="lead-form"
  method="POST"
  action={FORM_ENDPOINT}
  onsubmit={handleSubmit}
  aria-describedby="form-status"
>
  <!-- Honeypot: off-screen via position/left (the off-screen technique, not the
       screen-reader-trapping hidden kind), aria-hidden + tabindex -1 so screen
       readers and keyboard users skip it. Bots fill it; a filled value drops the submit. -->
  <div class="hp" aria-hidden="true">
    <label for="company">Company</label>
    <input id="company" name="_gotcha" type="text" tabindex="-1" autocomplete="off" />
  </div>

  <div class="field">
    <label for="name">Your name</label>
    <input
      id="name"
      name="name"
      type="text"
      autocomplete="name"
      required
      aria-invalid={fieldErrors.name ? 'true' : undefined}
    />
    {#if fieldErrors.name}<p class="field-error">{fieldErrors.name}</p>{/if}
  </div>

  <div class="field">
    <label for="contact">Phone or email</label>
    <input
      id="contact"
      name="contact"
      type="text"
      autocomplete="tel"
      required
      aria-invalid={fieldErrors.contact ? 'true' : undefined}
    />
    {#if fieldErrors.contact}<p class="field-error">{fieldErrors.contact}</p>{/if}
  </div>

  <div class="field">
    <label for="dentist">Preferred dentist</label>
    <select id="dentist" name="dentist" value={selectedDentist}>
      <option value="">No preference</option>
      {#each dentists as d (d.slug)}
        <option value={d.slug}>{d.name} — {d.practice}</option>
      {/each}
    </select>
  </div>

  <div class="field">
    <label for="time">Preferred time</label>
    <select id="time" name="time">
      <option value="">No preference</option>
      <option value="Morning (8am–12pm)">Morning (8am–12pm)</option>
      <option value="Afternoon (12pm–4pm)">Afternoon (12pm–4pm)</option>
      <option value="Evening (4pm–7pm)">Evening (4pm–7pm)</option>
    </select>
  </div>

  <div class="field">
    <label for="note">Anything else? <span class="opt">(optional)</span></label>
    <textarea id="note" name="note" rows="4"></textarea>
  </div>

  <button class="submit" type="submit" disabled={status === 'submitting'}>
    {status === 'submitting' ? 'Sending…' : 'Request appointment'}
  </button>

  <p id="form-status" class="status" role="status" aria-live="polite">
    {#if status === 'unconfigured'}
      <span class="note"
        >Form endpoint not configured — add FORM_ENDPOINT in src/lib/config.ts to start receiving
        appointment requests.</span
      >
    {:else if status === 'success'}
      <span class="ok"
        >Thanks — your appointment request has been sent. The office will reach out to confirm.</span
      >
    {:else if status === 'error'}
      <span class="err">{errorMsg}</span>
    {/if}
  </p>
</form>

<style>
  .lead-form {
    display: grid;
    gap: 1.25rem;
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 12px;
    padding: 1.75rem;
  }
  /* Honeypot: off-screen via position/left — never the hidden kind that traps some screen readers. */
  .hp {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
  .field {
    display: grid;
    gap: 0.4rem;
  }
  label {
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: var(--text-base);
    color: var(--color-foreground);
  }
  .opt {
    font-weight: 400;
    color: var(--color-muted-foreground);
  }
  input,
  select,
  textarea {
    min-height: 44px;
    padding: 0.6rem 0.75rem;
    font-family: var(--font-body);
    font-size: var(--text-base);
    color: var(--color-foreground);
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 8px;
  }
  textarea {
    min-height: 96px;
    resize: vertical;
  }
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 3px solid var(--color-ring);
    outline-offset: 2px;
  }
  input[aria-invalid='true'] {
    border-color: var(--color-destructive);
  }
  .field-error {
    margin: 0;
    color: var(--color-destructive);
    font-size: var(--text-base);
    font-weight: 600;
  }
  .submit {
    min-height: 48px;
    padding: 0.75rem 1.75rem;
    border: none;
    border-radius: 10px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: var(--text-md);
    cursor: pointer;
    transition: filter 150ms ease-out;
  }
  .submit:hover:not(:disabled) {
    filter: brightness(0.94);
  }
  .submit:disabled {
    opacity: 0.7;
    cursor: default;
  }
  .status {
    margin: 0;
    min-height: 1.2em;
    font-size: var(--text-base);
  }
  .status .note {
    color: var(--color-muted-foreground);
    font-weight: 600;
  }
  .status .ok {
    color: var(--color-accent);
    font-weight: 700;
  }
  .status .err {
    color: var(--color-destructive);
    font-weight: 700;
  }
</style>
