/**
 * Marks the section currently in view in the header nav (D-057).
 *
 * The rule is one line long: **the current section is the last one whose top
 * has passed the anchor line** — the same line a clicked shortcut lands on,
 * read straight off `scroll-margin-top` so the two can never drift apart. That
 * is why the anchor is measured from the CSS rather than written here: base.css
 * sets `[id] { scroll-margin-top: calc(var(--bar-h) + var(--s-4)) }`, and
 * --bar-h changes at the 860px breakpoint.
 *
 * This replaces an IntersectionObserver that watched a band from 60px down to
 * 45% of the viewport and highlighted the first section in that band. Clicking
 * a shortcut broke it: the click leaves the *previous* section's last ~20px
 * still inside the band, and being earlier in document order that section won —
 * so clicking Skills left the underline under Projects, every time.
 *
 * Reading five rects per animation frame is cheap and nothing is written unless
 * the answer actually changed; a scroll listener also has the property the
 * observer lacked, which is that it reports where the page came to rest rather
 * than where it crossed a threshold.
 */
export function currentSection(): void {
  const links = new Map<string, HTMLAnchorElement>();
  for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-nav]')) {
    links.set(a.dataset.nav!, a);
  }
  if (!links.size) return;

  /* Document order, because `resolve` walks forward and stops at the first
     section that has not been reached yet. Nav.astro keeps the shortcuts in
     that order for the same reason. */
  const targets: HTMLElement[] = [];
  const ids: string[] = [];
  for (const id of links.keys()) {
    const el = document.getElementById(id);
    if (el) { targets.push(el); ids.push(id); }
  }
  if (!targets.length) return;

  let anchor = 0;
  const measure = (): void => {
    anchor = parseFloat(getComputedStyle(targets[0]).scrollMarginTop) || 0;
  };

  const resolve = (): string => {
    // At the very bottom the last section may be too short to reach the anchor
    // line. It is still the one being read, so the foot of the page picks it.
    const doc = document.documentElement;
    if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
      return ids[ids.length - 1];
    }
    let found = ids[0];
    for (let i = 0; i < targets.length; i++) {
      // +1 absorbs the sub-pixel rounding of a smooth scroll that ends exactly
      // on the anchor line, which is precisely what a click does.
      if (targets[i].getBoundingClientRect().top > anchor + 1) break;
      found = ids[i];
    }
    return found;
  };

  let current = '';
  const apply = (): void => {
    const id = resolve();
    if (id === current) return;
    current = id;
    for (const [key, a] of links) a.classList.toggle('is-current', key === id);
  };

  let queued = false;
  const onScroll = (): void => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; apply(); });
  };

  measure();
  apply();
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); onScroll(); }, { passive: true });
}
