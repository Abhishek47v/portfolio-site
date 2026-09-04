import { test, expect } from '@playwright/test';

/**
 * The header's active shortcut (D-057).
 *
 * This exists because the previous implementation failed on the most obvious
 * interaction there is: clicking a shortcut. An IntersectionObserver band left
 * the *previous* section's last few pixels inside it, and that section — being
 * earlier in document order — kept the underline. Clicking Skills highlighted
 * Projects.
 *
 * The click is the test. Anything that resolves the active section by a band
 * rather than by where the page came to rest fails here.
 */
const SHORTCUTS = ['about', 'work', 'skills', 'experience', 'contact'] as const;

test('clicking a shortcut moves the underline to it', async ({ page }) => {
  await page.goto('/');

  for (const id of SHORTCUTS) {
    await page.locator(`[data-nav="${id}"]`).click();
    // Auto-retrying: the scroll is smooth, so the answer arrives a beat later.
    await expect(page.locator(`[data-nav="${id}"]`)).toHaveClass(/is-current/);
    // …and it is the only one. A highlight on two shortcuts is the same defect
    // wearing a different hat.
    await expect(page.locator('[data-nav].is-current')).toHaveCount(1);
  }
});

test('the underline follows the page down and back up', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('[data-nav="about"]')).toHaveClass(/is-current/);

  // Scrolling past a section's top by one pixel is what should switch it, so
  // land exactly there rather than somewhere comfortably inside the section.
  for (const id of SHORTCUTS.slice(1)) {
    await page.evaluate((sec) => {
      const el = document.getElementById(sec)!;
      const line = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - line, behavior: 'instant' });
    }, id);
    await expect(page.locator(`[data-nav="${id}"]`)).toHaveClass(/is-current/);
  }

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(page.locator('[data-nav="about"]')).toHaveClass(/is-current/);
});
