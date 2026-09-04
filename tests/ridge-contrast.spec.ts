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
 * Scope is the elements that sit on bare sky below the hero: the stats strip,
 * the Experience roadmap since it left the sheet (D-046), and Work since it
 * left too (D-047). Everything else is on the sheet and is covered by the
 * other spec.
 *
 * The roadmap forced one extension. Its text is not on bare sky — it is on
 * clouds of --sheet *over* the ridges — so the ground is a composite of two
 * things neither existing gate modelled together: this file knew the ridges but
 * not the element's own background, and contrast.spec.ts knew backgrounds but
 * not the ridges. `groundAt` now walks the ancestor chain the way that spec
 * does and composites those layers over the real ridge fill underneath.
 */
import { test, expect } from '@playwright/test';

/* Must reach the *bottom* of the page. Contact is the last section, so at 0.8
   it is still below the fold and every selector in it was being skipped — the
   probe stayed green with the label deliberately set to a failing colour. That
   is the exact failure this file was written to prevent, so the list now ends
   at 1. */
const POSITIONS = [0, 0.06, 0.12, 0.2, 0.3, 0.42, 0.55, 0.68, 0.8, 0.9, 1];
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

  /** Ancestor background layers composited over whatever is really behind the
   *  point — a ridge band if one is there, otherwise the sky. An opaque layer
   *  ends the walk; nothing below it can show through. */
  const groundAt = (el, x, y) => {
    const layers = [];
    /* Stops at body, and that is the whole correctness of this function.
       body carries an opaque --surface-solid as the no-sky fallback, while the
       real sky and ridges are fixed layers painted *over* it. Walking into body
       finds an opaque light ground, ends the walk there and reports every
       element as sitting on pale grey — which is how "open" measured 5.26:1
       against a body background it never actually touches, while the true value
       over the sky was 3.5:1. A gate that cannot see the surface it is judging
       is worse than no gate (D-029), and for a while this was that gate. */
    for (let n = el; n && n !== document.body; n = n.parentElement) {
      const c = num(getComputedStyle(n).backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] === 1) return layers.reduceRight((acc, l) => over(l, acc), [0,0,0]);
    }
    return layers.reduceRight((acc, l) => over(l, acc), behind(x, y));
  };

  const out = [];
  const SELECTOR = [
    '.stats .value', '.stats .label',
    // the roadmap, which is on bare sky below the hero since D-046
    '.exp .when', '.exp .org', '.exp h3', '.exp .one-line',
    '.exp .highlights li', '.exp .chip',
    '.exp .label', '.exp h2',
    // Work left the sheet too (D-047). Its labels sit on bare sky; the book's
    // own text sits on pages of --sheet, which groundAt composites for us.
    '.work .label', '.work h2', '.work .shelf-head h3', '.work .shelf-count',
    '.work .corner-caption', '.work .corner-title', '.work .more-shots',
    '.work .eyebrow', '.work .one-line',
    '.work .problem', '.work .chip', '.work .leaf h3',
    // Skills puts only its heading in a cloud (D-057); the index below it is on
    // bare sky. The separators are punctuation and aria-hidden, but they are
    // still painted text, so they are sampled too.
    '.skills .label', '.skills h2', '.skills .sub',
    '.skills .group-name', '.skills .t', '.skills .sep',
    // Contact left the sheet in D-052, so every word of it is out here too.
    // .ol-open is the end of the thread and the smallest text on bare sky:
    // it is real DOM text precisely so this probe can measure it.
    '.contact .label', '.contact h2', '.contact .sub',
    '.contact .mail a', '.contact .links a', '.contact .ol-open',
    // the form is on bare sky as well — its labels, its typed value colour,
    // its status line and the filled button (whose own ground groundAt reads)
    '.contact .field label', '.contact .field input', '.contact .field textarea',
    '.contact .form-note', '.contact .form button',
    '.colophon', '.colophon a',
    // The easter egg's cloud (D-061). It is fixed, so it is on screen at every
    // scroll position below, and it puts .62rem labels over the sky — exactly
    // what this file exists for. The test opens it before sampling.
    '.oc .label', '.oc-intro', '.oc-row dt', '.oc-row dd', '.oc-hours span'
  ].join(', ');
  for (const el of document.querySelectorAll(SELECTOR)) {
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
        if (y < 0 || y > window.innerHeight) continue;
        const g = groundAt(el, x, y);
        const v = ratio(over(ink, g), g);
        if (v < worst) { worst = v; at = [Math.round(x), Math.round(y)]; }
      }
    }
    if (worst === Infinity) continue;
    out.push({
      text: el.textContent.trim().slice(0, 42),
      // So the assertion below can prove this probe actually reached the one
      // thing on the page that has to be opened before it can be measured.
      egg: !!el.closest('[data-oc]'),
      large, ratio: +worst.toFixed(2), at,
    });
  }
  return out;
})()`;

for (const theme of THEMES) {
  test(`bare-sky text stays legible over the ridges — ${theme}`, async ({ page }) => {
    await page.goto('/');
    await page.evaluate((t) => document.documentElement.setAttribute('data-theme', t), theme);

    /* Open the easter egg (D-061), which is otherwise never on the page. It is
       reached by clicking the orb, and the orb is behind every section, so the
       click is resolved by geometry — which means clicking its centre is the
       real interaction and not a shortcut around one.

       Night only (D-062): by day there is nothing behind the sun, so there is
       nothing here to measure and the assertion below is not made. */
    if (theme === 'dark') {
      const orb = await page.evaluate(() => {
        const r = document.querySelector('[data-orb]')!.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
      await page.mouse.click(orb.x, orb.y);
      await expect(page.locator('[data-oc]')).toBeVisible();
    }

    const failures: string[] = [];
    let sampled = 0;
    let sampledEgg = 0;

    for (const pos of POSITIONS) {
      /* `behavior: 'instant'`, and it matters. base.css sets
         `scroll-behavior: smooth` on html, so a plain scrollTo *animates* — and
         this probe samples 80ms later, long before the page has arrived. At
         frac 1 on a 5100px page it had travelled 827px of 4304, so every
         selector in the last section was off-screen and silently skipped. The
         probe stayed green with a label deliberately set to a failing colour,
         which is the precise failure this file exists to prevent. */
      await page.evaluate((frac) => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: Math.round(max * frac), behavior: 'instant' });
      }, pos);
      await page.waitForTimeout(90);

      const rows = (await page.evaluate(probe)) as
        { text: string; egg: boolean; large: boolean; ratio: number; at: [number, number] }[];
      sampled += rows.length;
      sampledEgg += rows.filter((r) => r.egg).length;

      for (const r of rows) {
        const min = r.large ? 3 : 4.5;
        if (r.ratio < min) {
          failures.push(`${theme} @${pos}: "${r.text}" ${r.ratio}:1 < ${min}:1 at ${r.at.join(',')}`);
        }
      }
    }

    // The failure this whole file exists to prevent is a probe that sees
    // nothing and reports success.
    expect(sampled, 'the probe never found any bare-sky text').toBeGreaterThan(0);
    // A gate that silently stops seeing something is the failure this file was
    // written about twice over. The egg is the one element here behind an
    // interaction, so it is the one most able to disappear unnoticed.
    if (theme === 'dark') {
      expect(sampledEgg, 'the easter egg panel was never sampled').toBeGreaterThan(0);
    }
    expect(failures, failures.join('\n')).toEqual([]);
  });
}
