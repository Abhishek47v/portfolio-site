import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

/**
 * The easter egg on the sun (D-061).
 *
 * Three things have to stay true at once, and they pull against each other: it
 * must open when someone clicks the celestial object at night, it must do
 * nothing at all by day, and it must be invisible to everything else on the
 * page. The orb is `pointer-events: none` behind every section, so the click
 * is resolved by geometry — cheap, correct, and exactly the kind of thing that
 * silently stops working.
 */
const orbCentre = (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const r = document.querySelector('[data-orb]')!.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, d: r.width };
  });

test('clicking the moon opens it, and does not change the theme', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));

  const orb = await orbCentre(page);
  await page.mouse.click(orb.x, orb.y);

  const panel = page.locator('[data-oc]');
  await expect(panel).toBeVisible();
  await expect(panel).toContainText('Now playing');
  // The moon is not the theme control. Clicking it must not switch the palette.
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  // and the thread is drawn between the two
  await expect(page.locator('[data-oc-thread] path')).toHaveCount(1);

  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
});

test('there is nothing behind the sun by day', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));

  const orb = await orbCentre(page);
  await page.mouse.click(orb.x, orb.y);
  // Not "hidden after a moment" — it must never have opened.
  await expect(page.locator('[data-oc]')).toBeHidden();

  // Opened at night, it closes when the day comes back, however it arrives.
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.mouse.click(orb.x, orb.y);
  await expect(page.locator('[data-oc]')).toBeVisible();
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await expect(page.locator('[data-oc]')).toBeHidden();
});

test('it stays out of the way of the rest of the page', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  const orb = await orbCentre(page);
  const panel = page.locator('[data-oc]');

  // Just outside the disc: the hit test is a circle, not the element's box.
  await page.mouse.click(orb.x + orb.d * 0.75, orb.y + orb.d * 0.75);
  await expect(panel).toBeHidden();

  // A nav link is a link first. Nothing here may claim a click that belongs to
  // the page.
  await page.locator('[data-nav="work"]').click();
  await expect(panel).toBeHidden();
});

test('a held Space on the theme control opens it; a tap still switches theme', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  const toggle = page.locator('[data-theme-toggle]');
  const panel = page.locator('[data-oc]');

  // A tap is a theme change and nothing else — and it is what puts the page
  // into night, which is the only time the panel exists.
  await toggle.focus();
  await page.keyboard.press(' ');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(panel).toBeHidden();

  // Held: the panel opens and the click that follows the release is swallowed,
  // so the theme must be exactly where the tap above left it.
  await page.keyboard.down(' ');
  await page.waitForTimeout(750);
  await page.keyboard.up(' ');
  await expect(panel).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  // Escape returns focus to where it came from.
  await page.keyboard.press('Escape');
  await expect(panel).toBeHidden();
  await expect(toggle).toBeFocused();
});

test('the panel fits the viewport it opens in', async ({ page }) => {
  for (const [w, h] of [[360, 740], [390, 844], [1440, 900]] as const) {
    await page.setViewportSize({ width: w, height: h });
    await page.goto('/');
    await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
    const orb = await orbCentre(page);
    await page.mouse.click(orb.x, orb.y);
    await expect(page.locator('[data-oc]')).toBeVisible();

    const fit = await page.evaluate(() => {
      const r = document.querySelector('[data-oc]')!.getBoundingClientRect();
      return {
        left: Math.round(r.left),
        right: Math.round(innerWidth - r.right),
        bottom: Math.round(innerHeight - r.bottom),
        sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    expect(fit.left, `${w}x${h}: off the left edge`).toBeGreaterThanOrEqual(0);
    expect(fit.right, `${w}x${h}: off the right edge`).toBeGreaterThanOrEqual(0);
    expect(fit.bottom, `${w}x${h}: hangs below the fold`).toBeGreaterThanOrEqual(0);
    expect(fit.sideways, `${w}x${h}: the page scrolls sideways`).toBeLessThanOrEqual(0);
  }
});

// Only one theme: by day there is nothing to open. `no-JS` and the light
// palette are covered by a11y.spec.ts, which runs over the page without it.
for (const theme of ['dark'] as const) {
  test(`no accessibility violations with it open — ${theme}`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    const orb = await orbCentre(page);
    await page.mouse.click(orb.x, orb.y);
    await expect(page.locator('[data-oc]')).toBeVisible();

    await page.addScriptTag({ content: axeSource });
    const results = await page.evaluate(async () =>
      // Contrast is covered by ridge-contrast.spec.ts, which composites the
      // cloud over the sky; axe cannot see through a translucent ground.
      await (window as any).axe.run(document, { rules: { 'color-contrast': { enabled: false } } }),
    );
    const violations = (results as any).violations.map(
      (v: any) => `${v.id} (${v.impact}) — ${v.nodes.length} node(s): ${v.help}`,
    );
    expect(violations, violations.join('\n')).toEqual([]);
  });
}
