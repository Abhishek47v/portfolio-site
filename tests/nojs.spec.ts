/**
 * Content, navigation and links must work with JavaScript off.
 * What is lost is the sky interpolation, the theme toggle and audio — the site
 * falls back to a static sky and the OS colour preference (05-technical.md §1).
 */
import { test, expect } from '@playwright/test';

test.use({ javaScriptEnabled: false });

test('the site is readable and navigable without JavaScript', async ({ page }) => {
  await page.goto('/');

  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('main')).not.toBeEmpty();
  // The sheet is gone (D-052); what has to be here is a *ground under the
  // text*, which is now a cloud. Without one, every word below the hero sits
  // on bare sky at 2.26:1.
  await expect(page.locator('.rm-cloud').first()).toBeVisible();
  // Section shortcuts are real anchors, so they work without script.
  await expect(page.locator('a[href="#work"]').first()).toBeVisible();
  await expect(page.locator('#work')).toBeVisible();

  // Contact degrades to a readable block: an address that is a real mailto,
  // carrying its own underline because the thread that replaces it is absent.
  const mail = page.locator('#contact [data-mail]');
  await expect(mail).toBeVisible();
  await expect(mail).toHaveAttribute('href', /^mailto:/);
  await expect(page.locator('#contact [data-thread-layer]')).toBeEmpty();
  await expect(page.locator('#contact .ol-open')).toBeHidden();

  // The form is a real form: three named fields, native validation, and a
  // POST that reaches the provider without any script (D-054).
  const form = page.locator('[data-contact-form]');
  await expect(form).toBeVisible();
  for (const field of ['name', 'email', 'message']) {
    await expect(form.locator(`[name="${field}"]`)).toHaveAttribute('required', '');
  }

  // The sky still paints — the no-JS token values are real, not placeholders.
  const painted = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--sky-mid').trim(),
  );
  expect(painted).not.toBe('');

  await expect(page.locator('a.skip')).toHaveAttribute('href', '#main');
});
