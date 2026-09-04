/**
 * The whole introduction has to land in the first glance.
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
 * It measures the *last* element of the first screen, not the stats strip.
 * The call to action moved below the strip (D-045), and a probe still aimed at
 * the strip would have gone on passing while the button it now sits above hung
 * off the bottom of the screen.
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
  test(`the first screen fits — ${label} ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/');
    // The Contact thread is drawn from measurements, so the sideways-scroll
    // check below is only meaningful once it has actually been drawn.
    await page.locator('[data-thread-ready]').waitFor({ state: 'attached' });

    const seen = await page.evaluate(() => {
      const strip = document.querySelector('.stats');
      const cta = document.querySelector('.actions');
      if (!strip || !cta) return null;
      // The lowest *content*, not the container. `.first-screen` carries a
      // min-height of one viewport minus the header, so once it is nudged down
      // at all its own box necessarily ends below the fold — while everything
      // inside it is still perfectly visible. Measuring the box conflated
      // "the block ends at the fold" with "the reader can see the content",
      // and only the second one is the requirement.
      const r = { bottom: Math.max(strip.getBoundingClientRect().bottom,
                                   cta.getBoundingClientRect().bottom) };
      const bar = document.querySelector('.bar')!.getBoundingClientRect();
      const token = parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--bar-h'),
      );
      const figure = document.querySelector('.character');
      const title = document.querySelector('h1')!.getBoundingClientRect();
      const fig = figure ? figure.getBoundingClientRect() : null;

      return {
        // The figure is absolutely positioned and grows upward from the
        // greeting, so it can foul the sticky header above it and the title
        // below it. Both have happened; both are cheap to assert.
        figureClearsHeader: fig ? Math.round(fig.top - bar.bottom) : 0,
        figureOverTitle: fig ? Math.round(fig.bottom - title.top) : 0,
        bottom: r.bottom,
        viewport: window.innerHeight,
        scrolled: window.scrollY,
        barActual: bar.height,
        barToken: token,
        stats: document.querySelectorAll('.stat').length,
        cta: cta.textContent.trim(),
        // Not about the first screen, but this is the file that already knows
        // ten widths. A real 29-character email address pushed the Contact
        // thread's endpoint off the right edge and gave the whole page 82px of
        // horizontal scroll, and nothing in the suite noticed.
        sideways: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });

    // Guard against the probe passing because it found nothing.
    expect(seen, 'the first screen content is not in the document').not.toBeNull();
    expect(seen!.stats, 'no stat items rendered').toBeGreaterThan(0);
    expect(seen!.cta, 'the call to action rendered no text').not.toBe('');
    expect(seen!.scrolled, 'the page should not be scrolled').toBe(0);

    // --bar-h is what .first-screen subtracts, so it has to be the truth. The
    // 1px of slack is the bar's own bottom border.
    expect(
      Math.abs(seen!.barActual - (seen!.barToken + 1)),
      `--bar-h says ${seen!.barToken}px but .bar renders ${seen!.barActual}px`,
    ).toBeLessThanOrEqual(1);

    expect(
      seen!.figureClearsHeader,
      `the figure overlaps the header by ${-seen!.figureClearsHeader}px`,
    ).toBeGreaterThanOrEqual(0);

    // A few px of tolerance: the drawing stops short of the bottom of its own
    // viewBox, so the box may touch the title before the ink does.
    expect(
      seen!.figureOverTitle,
      `the figure overlaps the title by ${seen!.figureOverTitle}px`,
    ).toBeLessThanOrEqual(6);

    expect(
      Math.round(seen!.bottom),
      `first-screen content ends ${Math.round(seen!.bottom - seen!.viewport)}px below the fold`,
    ).toBeLessThanOrEqual(seen!.viewport);

    expect(
      seen!.sideways,
      `the page scrolls sideways by ${seen!.sideways}px`,
    ).toBeLessThanOrEqual(0);
  });
}

/**
 * Not covered: 320x568 and anything smaller. With a 103px header that leaves
 * 465px for a figure, a name, a role line, a paragraph, five statistics and a
 * button, and no honest amount of trimming fits them. `.first-screen` uses
 * `min-height`, so those viewports scroll normally rather than clipping —
 * which is the correct failure, and is why this is a documented limit rather
 * than a skipped test pretending to pass.
 */
