/**
 * The test that exists because of the design.
 *
 * The sky is static per theme now (D-027), but it is still a full-viewport
 * gradient — so what sits behind a panel depends on where that panel is on
 * screen, and that changes as the page scrolls. This samples the scroll range
 * in both themes, composites the translucent veil over the gradient at each
 * element's actual position, and checks the result against WCAG.
 */
import { test, expect } from '@playwright/test';

const POSITIONS = [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1];
const THEMES = ['light', 'dark'] as const;

/** Body text should clear AAA; supporting text and labels must clear AA. */
const MINIMUM = { ink: 7, 'ink-soft': 4.5, 'ink-faint': 4.5 } as const;

const probe = `(() => {
  const root = document.documentElement;
  const cs = getComputedStyle(root);

  // Tokens are authored as hex, but a computed value may come back in any
  // serialised form. Both have to parse: getting this wrong yields NaN, and
  // NaN comparisons pass silently — which is worse than no test.
  const num = (raw) => {
    const v = String(raw).trim();
    if (v.startsWith('#')) {
      const h = v.length === 4 ? '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3] : v;
      return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16), 1];
    }
    const parts = (v.match(/[\\d.]+/g) || []).map(Number);
    if (parts.length < 3) throw new Error('unparseable colour: ' + v);
    return parts.length === 3 ? [...parts, 1] : parts;
  };

  const sky = ['sky-high','sky-mid','sky-low'].map(r => num(cs.getPropertyValue('--' + r)));
  const inks = {
    ink: num(cs.getPropertyValue('--ink')),
    'ink-soft': num(cs.getPropertyValue('--ink-soft')),
    'ink-faint': num(cs.getPropertyValue('--ink-faint')),
  };

  // The gradient is painted on a fixed, full-viewport layer with stops at
  // 0% / 54% / 100%, so a viewport fraction maps straight onto it.
  const skyAt = (f) => {
    const seg = f <= 0.54 ? [sky[0], sky[1], f / 0.54] : [sky[1], sky[2], (f - 0.54) / 0.46];
    const [a, b, t] = seg;
    return [0,1,2].map(i => a[i] + (b[i] - a[i]) * t);
  };

  const over = (fg, bg) => {
    const alpha = fg.length > 3 ? fg[3] : 1;
    return [0,1,2].map(i => fg[i] * alpha + bg[i] * (1 - alpha));
  };

  // Walk the ancestor chain and composite every translucent layer over the
  // sky. Assuming a single veil was wrong once the hero started sitting on
  // bare sky and sections moved inside one sheet (D-031).
  const effective = (el, base) => {
    const layers = [];
    for (let n = el; n && n !== root; n = n.parentElement) {
      const c = num(getComputedStyle(n).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] === 1) return layers.reduceRight((acc, l) => over(l, acc), [0,0,0]);
    }
    return layers.reduceRight((acc, l) => over(l, acc), base);
  };

  const lum = (c) => {
    const s = c.map(v => { const x = v / 255; return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4); });
    return 0.2126 * s[0] + 0.7152 * s[1] + 0.0722 * s[2];
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1, l2), lo = Math.min(l1, l2); return (hi + 0.05) / (lo + 0.05); };

  // Every surface that carries text.
  const targets = Array.from(document.querySelectorAll(
    '.band, .hero .inner, .bar-inner, .colophon, .project .detail'
  ));
  const results = [];
  for (const el of targets) {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
    const top = Math.max(rect.top, 0);
    const bottom = Math.min(rect.bottom, window.innerHeight);
    const centre = Math.min(1, Math.max(0, ((top + bottom) / 2) / window.innerHeight));
    const bg = effective(el, skyAt(centre));
    for (const [name, ink] of Object.entries(inks)) {
      results.push({ role: name, ratio: +ratio(ink, bg).toFixed(2), where: el.className.split(' ')[0] });
    }
  }
  return results;
})()`;

for (const theme of THEMES) {
  test(`contrast holds across the whole scroll range — ${theme}`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

    const failures: string[] = [];

    for (const p of POSITIONS) {
      await page.evaluate((frac) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.round(max * frac));
      }, p);
      await page.waitForTimeout(120); // let rAF write the tokens

      const samples = (await page.evaluate(probe)) as { role: keyof typeof MINIMUM; ratio: number; where: string }[];
      expect(samples.length, `no panels visible at ${p}`).toBeGreaterThan(0);

      for (const s of samples) {
        const min = MINIMUM[s.role];
        expect(Number.isFinite(s.ratio), `ratio for ${s.role} was not a number`).toBe(true);
        expect(min, `no minimum defined for role ${s.role}`).toBeGreaterThan(0);
        if (s.ratio < min) {
          failures.push(`${theme} @ ${(p * 100).toFixed(0)}% · ${s.where} — ${s.role}: ${s.ratio}:1 (needs ${min}:1)`);
        }
      }
    }

    expect(failures, failures.join('\n')).toEqual([]);
  });
}
