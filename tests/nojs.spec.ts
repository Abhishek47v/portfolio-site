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
  await expect(page.locator('.sheet').first()).toBeVisible();
  // Section shortcuts are real anchors, so they work without script.
  await expect(page.locator('a[href="#work"]').first()).toBeVisible();
  await expect(page.locator('#work')).toBeVisible();

  // The sky still paints — the no-JS token values are real, not placeholders.
  const painted = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue('--sky-mid').trim(),
  );
  expect(painted).not.toBe('');

  await expect(page.locator('a.skip')).toHaveAttribute('href', '#main');
});
