/**
 * The stats strip has to land in the first glance.
 *
 * That is a requirement, not a nicety: a number you have to scroll to find is
 * not doing the job a number is on the page to do. It is also the single
 * easiest thing to break by accident — a line of copy, a font-size bump, a
 * change to the header's padding, and the last row of stats slips under the
 * fold on exactly the laptop a recruiter is using. Nothing else in the suite
 * would notice.
 *
 * The header is part of the arithmetic: `--bar-h` must match what `.bar`
 * actually renders, because `.first-screen` subtracts it. That token was wrong
 * by 4.5px at the mobile breakpoint (D-043) and every small viewport failed by
 * exactly that amount, which is what pointed at the cause.
 *
 * 320x568 is deliberately excluded — see the note at the bottom of this file.
 */
import { test, expect } from '@playwright/test';

const VIEWPORTS: [number, number, string][] = [
  [1440, 900, 'desktop'],
  [1280, 800, 'laptop'],
  [1366, 768, 'laptop, shorter'],
  [1512, 700, 'laptop, short'],
  [1024, 600, 'small window'],
  [834, 1112, 'tablet portrait'],
  [768, 1024, 'tablet'],
  [430, 932, 'large phone'],
  [390, 844, 'phone'],
  [360, 740, 'small phone'],
];

for (const [width, height, label] of VIEWPORTS) {
  test(`stats land above the fold — ${label} ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');

    const seen = await page.evaluate(() => {
      const strip = document.querySelector('.stats');
      if (!strip) return null;
      const r = strip.getBoundingClientRect();
      const bar = document.querySelector('.bar')!.getBoundingClientRect();
      const token = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--bar-h'),
      );
      return {
        bottom: r.bottom,
        viewport: window.innerHeight,
        scrolled: window.scrollY,
        barActual: bar.height,
        barToken: token,
        stats: document.querySelectorAll('.stat').length,
      };
    });

    // Guard against the probe passing because it found nothing.
    expect(seen, 'the stats strip is not in the document').not.toBeNull();
    expect(seen!.stats, 'no stat items rendered').toBeGreaterThan(0);
    expect(seen!.scrolled, 'the page should not be scrolled').toBe(0);

    // --bar-h is what .first-screen subtracts, so it has to be the truth. The
    // 1px of slack is the bar's own bottom border.
    expect(
      Math.abs(seen!.barActual - (seen!.barToken + 1)),
      `--bar-h says ${seen!.barToken}px but .bar renders ${seen!.barActual}px`,
    ).toBeLessThanOrEqual(1);

    expect(
      Math.round(seen!.bottom),
      `stats strip ends ${Math.round(seen!.bottom - seen!.viewport)}px below the fold`,
    ).toBeLessThanOrEqual(seen!.viewport);
  });
}

/**
 * Not covered: 320x568 and anything smaller. With a 103px header that leaves
 * 465px for a portrait, a name, a role line, a paragraph, two buttons and five
 * statistics, and no honest amount of trimming fits them. `.first-screen` uses
 * `min-height`, so those viewports scroll normally rather than clipping —
 * which is the correct failure, and is why this is a documented limit rather
 * than a skipped test pretending to pass.
 */
