/**
 * The contact form, enhanced (D-054).
 *
 * The form already works without this: it is a real `<form method="POST">` and
 * a native submit reaches the provider, which answers with its own thank-you
 * page. What this adds is staying on the page — posting in the background and
 * reporting the result in the status line beside the button.
 *
 * The destination address is not here and is not anywhere in this repository.
 * The form posts to `site.contact.endpoint`; which inbox that lands in is
 * configured in the provider's dashboard, so the address is never in the page
 * source for a scraper to harvest. With no endpoint configured there is no
 * `action`, the submit is disabled at build time and this returns immediately —
 * a form that silently swallows what someone typed is worse than one that says
 * it is not ready.
 */

const MESSAGES = {
  sending: 'Sending…',
  sent: 'Thank you — message sent.',
  failed: 'That did not send. Email works.',
} as const;

export function contactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  // getAttribute, not .action: the DOM property helpfully resolves to the
  // current page URL when the attribute is absent, so it is never empty.
  const endpoint = form.getAttribute('action');
  if (!endpoint) return;

  const note = form.querySelector<HTMLElement>('[data-form-note]');
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const say = (text: string): void => {
    if (note) note.textContent = text;
  };

  form.addEventListener('submit', (event) => {
    // Let the browser's own validation run first; only take over a valid form,
    // so a missing field still gets the native message rather than silence.
    if (!form.reportValidity()) return;
    event.preventDefault();

    if (button) button.disabled = true;
    say(MESSAGES.sending);

    /* FormData, not JSON. Every provider in this class accepts a normal form
       post; several do not accept JSON without extra fields. `Accept: json`
       asks the ones that can to answer with a body instead of a redirect. */
    void fetch(endpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        say(MESSAGES.sent);
      })
      .catch(() => say(MESSAGES.failed))
      .finally(() => {
        if (button) button.disabled = false;
      });
  });
}
