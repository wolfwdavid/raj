<script lang="ts">
  import { FORM_ENDPOINT } from '$lib/config';

  const configured = FORM_ENDPOINT.length > 0;
  type Status = 'idle' | 'submitting' | 'success' | 'error' | 'unconfigured';
  let status = $state<Status>('idle');
  let errorMsg = $state('');

  // Inline field errors (client validation). Announced via the aria-live region.
  let fieldErrors = $state<{ name?: string; contact?: string; town?: string; service?: string }>(
    {}
  );

  function validate(fd: FormData): boolean {
    const next: typeof fieldErrors = {};
    if (!(fd.get('name') as string)?.trim()) next.name = 'Please tell us your name.';
    if (!(fd.get('contact') as string)?.trim())
      next.contact = 'Add a phone number or email so we can reach you.';
    if (!(fd.get('town') as string)?.trim()) next.town = 'Which Long Island town is the pool in?';
    if (!(fd.get('service') as string)?.trim()) next.service = 'Choose the service you need.';
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
        errorMsg = 'Something went wrong sending your request. Please call us or try again.';
      }
    } catch {
      status = 'error';
      errorMsg = 'Network error. Please call us or try again.';
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
      autocomplete="email"
      required
      aria-invalid={fieldErrors.contact ? 'true' : undefined}
    />
    {#if fieldErrors.contact}<p class="field-error">{fieldErrors.contact}</p>{/if}
  </div>

  <div class="field">
    <label for="town">Town</label>
    <input
      id="town"
      name="town"
      type="text"
      autocomplete="address-level2"
      placeholder="e.g. Huntington"
      required
      aria-invalid={fieldErrors.town ? 'true' : undefined}
    />
    {#if fieldErrors.town}<p class="field-error">{fieldErrors.town}</p>{/if}
  </div>

  <div class="field">
    <label for="service">Service needed</label>
    <select
      id="service"
      name="service"
      required
      aria-invalid={fieldErrors.service ? 'true' : undefined}
    >
      <option value="">Choose a service…</option>
      <option value="Installation">Pool Installation</option>
      <option value="Liner Replacement">Liner Replacement</option>
      <option value="Openings & Closings">Openings &amp; Closings</option>
      <option value="Maintenance">Weekly Maintenance</option>
      <option value="Repairs">Repairs &amp; Equipment</option>
      <option value="Renovation">Renovation &amp; Remodel</option>
    </select>
    {#if fieldErrors.service}<p class="field-error">{fieldErrors.service}</p>{/if}
  </div>

  <div class="field">
    <label for="message">Anything else? <span class="opt">(optional)</span></label>
    <textarea id="message" name="message" rows="4"></textarea>
  </div>

  <button class="submit" type="submit" disabled={status === 'submitting'}>
    {status === 'submitting' ? 'Sending…' : 'Request my free quote'}
  </button>

  <p id="form-status" class="status" role="status" aria-live="polite">
    {#if status === 'unconfigured'}
      <span class="note"
        >Form endpoint not configured — add FORM_ENDPOINT in src/lib/config.ts to start receiving
        quotes.</span
      >
    {:else if status === 'success'}
      <span class="ok">Thanks — your quote request is on its way. We'll be in touch shortly.</span>
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
    border: 1px solid var(--color-border);
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
    font-size: 1rem;
    color: var(--color-foreground);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
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
  input[aria-invalid='true'],
  select[aria-invalid='true'] {
    border-color: var(--color-destructive);
  }
  .field-error {
    margin: 0;
    color: var(--color-destructive);
    font-size: 0.9375rem;
    font-weight: 600;
  }
  .submit {
    min-height: 44px;
    padding: 0.75rem 1.75rem;
    border: none;
    border-radius: 8px;
    background: var(--color-accent);
    color: var(--color-on-primary);
    font-family: var(--font-heading);
    font-weight: 600;
    font-size: 1.0625rem;
    cursor: pointer;
    transition: background-color 150ms ease-out;
  }
  .submit:hover:not(:disabled) {
    background: var(--color-foreground);
  }
  .submit:disabled {
    opacity: 0.7;
    cursor: default;
  }
  .status {
    margin: 0;
    min-height: 1.2em;
  }
  .status .note {
    color: var(--color-muted-foreground);
    font-weight: 600;
  }
  .status .ok {
    color: var(--color-accent);
    font-weight: 600;
  }
  .status .err {
    color: var(--color-destructive);
    font-weight: 600;
  }
</style>
