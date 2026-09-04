import { test, expect } from '@playwright/test';

/**
 * The contact form's submit path (D-060).
 *
 * The provider is never contacted: the endpoint's origin is intercepted and
 * answered here, so this tests our half — that the right fields are posted,
 * that the reader stays on the page, and that a refusal is reported as a
 * refusal. What the provider then does with a valid submission is its problem,
 * and testing it would mean spending someone's real quota on every commit.
 *
 * With no endpoint configured the form has no `action` and nothing to test, so
 * these skip rather than pretending. Paste one into `site.contact.endpoint` and
 * they start running — which is the point at which they matter.
 */
const fill = async (page: import('@playwright/test').Page): Promise<void> => {
  await page.locator('#cf-name').fill('Ada Lovelace');
  await page.locator('#cf-email').fill('ada@example.org');
  await page.locator('#cf-message').fill('Saw the roadmap. Can we talk?');
};

async function endpointOf(page: import('@playwright/test').Page): Promise<string | null> {
  await page.goto('/');
  const form = page.locator('[data-contact-form]');
  const endpoint = await form.getAttribute('action');
  // Wait for the script to take over. Without this, a submit that lands first
  // is a *native* POST — the browser leaves the page for the provider's reply
  // and every assertion below is about a document that is no longer there.
  if (endpoint) await expect(form).toHaveAttribute('data-enhanced', '');
  return endpoint;
}

test('a message reaches the provider with every field it needs', async ({ page }) => {
  const endpoint = await endpointOf(page);
  test.skip(!endpoint, 'no contact endpoint configured — see RUNBOOK § the contact form');

  let posted = '';
  await page.route(endpoint!, async (route) => {
    posted = route.request().postData() ?? '';
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'Email sent successfully' }),
    });
  });

  await fill(page);
  await page.locator('.form button[type="submit"]').click();

  await expect(page.locator('[data-form-note]')).toHaveText(/message sent/i);
  // Still here: the whole point of the script is not handing the reader over
  // to a provider's thank-you page.
  expect(new URL(page.url()).pathname).toBe('/');
  await expect(page.locator('#cf-name')).toHaveValue('');

  for (const field of ['Ada Lovelace', 'ada@example.org', 'Saw the roadmap']) {
    expect(posted, `the provider never received "${field}"`).toContain(field);
  }
  // An unchecked honeypot is not submitted at all. If this name ever appears
  // in the payload, something checked it — and the provider will bin the
  // message as spam.
  expect(posted, 'the honeypot was submitted').not.toContain('botcheck');
  // The subject is what makes the mail findable in an inbox.
  expect(posted).toContain('New message from');
});

test('a refusal is not reported as a send', async ({ page }) => {
  const endpoint = await endpointOf(page);
  test.skip(!endpoint, 'no contact endpoint configured — see RUNBOOK § the contact form');

  // 200 with success:false is how these providers refuse — a status-code-only
  // check calls that a success and tells someone their message went through.
  await page.route(endpoint!, (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Invalid access key' }),
    }),
  );

  await fill(page);
  await page.locator('.form button[type="submit"]').click();

  await expect(page.locator('[data-form-note]')).toHaveText(/did not send/i);
  // and what they typed is still there to try again with
  await expect(page.locator('#cf-message')).toHaveValue(/Saw the roadmap/);
});
