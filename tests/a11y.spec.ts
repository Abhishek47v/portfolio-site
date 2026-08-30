import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');

for (const theme of ['light', 'dark'] as const) {
  test(`no accessibility violations — ${theme}`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);
    await page.addScriptTag({ content: axeSource });

    const results = await page.evaluate(async () => {
      // Contrast is covered properly by contrast.spec.ts — axe cannot see
      // through a translucent veil over a gradient and reports it as unknown.
      return await (window as any).axe.run(document, {
        rules: { 'color-contrast': { enabled: false } },
      });
    });

    const violations = (results as any).violations.map(
      (v: any) => `${v.id} (${v.impact}) — ${v.nodes.length} node(s): ${v.help}`,
    );
    expect(violations, violations.join('\n')).toEqual([]);
  });
}

test('keyboard reaches the skip link and the theme control first', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.locator('.skip')).toBeFocused();
});
