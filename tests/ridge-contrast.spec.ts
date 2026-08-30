/**
 * The test that exists because the other contrast test cannot see.
 *
 * `contrast.spec.ts` composites ink over the *sky gradient*. It has no model of
 * `Ridges`, which is `position: fixed` and sits above the sky at the foot of
 * every viewport. Anything on bare sky below the hero scrolls across that band,
 * and a gate that models only the sky will pass it while it is illegible —
 * which is exactly what happened when the stats strip was first placed there
 * (D-039).
 *
 * So this does not model the ridges: it asks them. The three bands are real SVG
 * paths, so `isPointInFill` gives the actual fill behind any point, and the
 * mapping from screen to user space is a plain linear scale because the svg is
 * `preserveAspectRatio="none"` over a fixed viewBox.
 *
 * Scope is deliberately narrow — the elements that sit on bare sky below the
 * hero. Everything else is on the sheet and is covered by the other spec.
 */
import { test, expect } from '@playwright/test';

const POSITIONS = [0, 0.06, 0.12, 0.2, 0.3];
const THEMES = ['light', 'dark'] as const;

/** WCAG: large text clears at 3:1, body and small text at 4.5:1. */
const LARGE_PX = 24;

const probe = `(() => {
  const num = (raw) => {
    const v = String(raw).trim();
    if (v.startsWith('#')) {
      const h = v.length === 4 ? '#' + v[1] + v[1] + v[2] + v[2] + v[3] + v[3] : v;
      return [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16), 1];
    }
    const parts = (v.match(/[\\d.]+/g) || []).map(Number);
    if (parts.length < 3) throw new Error('unparseable colour: ' + v);
    return parts.length === 3 ? [...parts, 1] : parts;
  };

  const cs = getComputedStyle(document.documentElement);
  const sky = ['sky-high','sky-mid','sky-low'].map(r => num(cs.getPropertyValue('--' + r)));
  const skyAt = (f) => {
    const seg = f <= 0.54 ? [sky[0], sky[1], f/0.54] : [sky[1], sky[2], (f-0.54)/0.46];
    const [a,b,t] = seg;
    return [0,1,2].map(i => a[i] + (b[i]-a[i])*t);
  };

  const svg = document.querySelector('.ridges');
  const box = svg.getBoundingClientRect();
  // Painted last is on top, so probe near -> mid -> far.
  const bands = ['.r-near', '.r-mid', '.r-far']
    .map(sel => svg.querySelector(sel))
    .filter(el => el && getComputedStyle(el).display !== 'none')
    .map(el => ({ el, fill: num(getComputedStyle(el).fill), ctm: el.getScreenCTM().inverse() }));

  /** The real colour painted behind a viewport point.
   *
   *  The screen -> user-space mapping comes from each band's own inverted
   *  getScreenCTM, never from a hand-rolled scale off the viewBox. The bands
   *  are translated by the scroll camera (D-044), and a manual mapping would
   *  keep sampling where the hill *used* to be — reporting a real ratio
   *  against the wrong background, which is the precise failure this file was
   *  written to catch in the first place. The CTM carries the transform, so
   *  this stays correct however the camera moves them. */
  const behind = (x, y) => {
    if (y >= box.top && y <= box.bottom) {
      const screen = new DOMPoint(x, y);
      for (const b of bands) {
        if (b.el.isPointInFill(screen.matrixTransform(b.ctm))) return b.fill.slice(0, 3);
      }
    }
    return skyAt(Math.min(1, Math.max(0, y / window.innerHeight)));
  };

  const over = (fg, bg) => {
    const a = fg.length > 3 ? fg[3] : 1;
    return [0,1,2].map(i => fg[i]*a + bg[i]*(1-a));
  };
  const lum = (c) => {
    const s = c.map(v => { const x = v/255; return x <= 0.03928 ? x/12.92 : Math.pow((x+0.055)/1.055, 2.4); });
    return 0.2126*s[0] + 0.7152*s[1] + 0.0722*s[2];
  };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); const hi = Math.max(l1,l2), lo = Math.min(l1,l2); return (hi+0.05)/(lo+0.05); };

  const out = [];
  for (const el of document.querySelectorAll('.stats .value, .stats .label')) {
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight || r.width === 0) continue;
    const st = getComputedStyle(el);
    const ink = num(st.color);
    const large = parseFloat(st.fontSize) >= ${LARGE_PX};

    // Sample the glyph band, not the whole box: a 3x5 grid inset from the edges.
    let worst = Infinity, at = null;
    for (let ix = 0; ix < 5; ix++) {
      for (let iy = 0; iy < 3; iy++) {
        const x = r.left + r.width * (0.1 + 0.2*ix);
        const y = r.top + r.height * (0.25 + 0.25*iy);
        const v = ratio(over(ink, behind(x, y)), behind(x, y));
        if (v < worst) { worst = v; at = [Math.round(x), Math.round(y)]; }
      }
    }
    out.push({ text: el.textContent.trim(), large, ratio: +worst.toFixed(2), at });
  }
  return out;
})()`;

for (const theme of THEMES) {
  test(`stats stay legible over the ridges — ${theme}`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

    const failures: string[] = [];
    let sampled = 0;

    for (const pos of POSITIONS) {
      await page.evaluate((frac) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo(0, Math.round(max * frac));
      }, pos);
      await page.waitForTimeout(80);

      const rows = (await page.evaluate(probe)) as
        { text: string; large: boolean; ratio: number; at: [number, number] }[];
      sampled += rows.length;

      for (const r of rows) {
        const min = r.large ? 3 : 4.5;
        if (r.ratio < min) {
          failures.push(`${theme} @${pos}: "${r.text}" ${r.ratio}:1 < ${min}:1 at ${r.at.join(',')}`);
        }
      }
    }

    // The failure this whole file exists to prevent is a probe that sees
    // nothing and reports success.
    expect(sampled, 'the probe never found the stats strip').toBeGreaterThan(0);
    expect(failures, failures.join('\n')).toEqual([]);
  });
}
