/**
 * Opening and closing the one thing on this page that is not about work.
 *
 * Everything here is measured at open time: the orb's position is a clamp()
 * of viewport width and height, and the cloud has to find it wherever it is.
 */
export function offTheClock(): void {
  const orb = document.querySelector<HTMLElement>('[data-orb]');
  const panel = document.querySelector<HTMLElement>('[data-oc]');
  const thread = document.querySelector<SVGSVGElement>('[data-oc-thread]');
  const toggle = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');

  if (!orb || !panel || !thread) return;

  const NS = 'http://www.w3.org/2000/svg';
  const CLOSE_ANIM = 240; // --dur-fast; only used to delay `hidden`
  const GAP = 30; // between the orb's edge and the top of the cloud
  let open = false;
  let opener: HTMLElement | null = null;

  /** The site's own notion of the hour, resolved the way ThemeToggle does:
      an explicit choice first, the visitor's preference otherwise. */
  function night(): boolean {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'dark') return true;
    if (attr === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /** The orb is a circle; its box is a square. */
  function onOrb(x: number, y: number): boolean {
    const r = orb!.getBoundingClientRect();
    if (!r.width) return false;
    return Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) <= r.width / 2;
  }

  /** Under the sun, and inside the viewport whatever the sun is doing. */
  function place(): void {
    const o = orb!.getBoundingClientRect();
    const w = panel!.offsetWidth;
    const margin = 12;
    const left = Math.max(
      margin,
      Math.min(o.left + o.width / 2 - w / 2, window.innerWidth - w - margin),
    );
    const top = o.bottom + GAP;
    panel!.style.left = `${Math.round(left)}px`;
    panel!.style.top = `${Math.round(top)}px`;

    // and the thread between them, leaving the disc and arriving at the cloud
    const x1 = o.left + o.width / 2;
    const y1 = o.bottom - 2;
    const x2 = Math.round(left + w / 2);
    const y2 = top + 10;
    thread!.replaceChildren();
    const path = document.createElementNS(NS, 'path');
    path.setAttribute(
      'd',
      `M${x1} ${y1} C${x1} ${y1 + (y2 - y1) * 0.45} ${x2} ${y2 - (y2 - y1) * 0.5} ${x2} ${y2}`,
    );
    thread!.appendChild(path);
  }

  function show(from: HTMLElement | null): void {
    if (open || !night()) return;
    open = true;
    opener = from;
    panel!.hidden = false;
    place(); // fills the thread
    // A frame between `hidden` going away and the class arriving, or there is
    // no earlier value to transition from — the same trap as the theme fade.
    void panel!.offsetWidth;
    panel!.classList.add('is-open');
    thread!.classList.add('is-open');
    toggle?.setAttribute('aria-expanded', 'true');
    panel!.focus({ preventScroll: true });
  }

  function hide(returnFocus = false): void {
    if (!open) return;
    open = false;
    panel!.classList.remove('is-open');
    thread!.classList.remove('is-open');
    // Removed rather than set to false: a control advertising a collapsed
    // something is a control advertising the secret.
    toggle?.removeAttribute('aria-expanded');
    window.setTimeout(() => {
      if (open) return;
      panel!.hidden = true;
      // The thread is an SVG and cannot be `hidden`; emptying it is the
      // equivalent, and it leaves nothing behind to redraw around.
      thread!.replaceChildren();
    }, CLOSE_ANIM);
    if (returnFocus && opener) opener.focus();
    opener = null;
  }

  /* The click. It is resolved by geometry rather than by a hit area, so a
     link that happens to be under the sun still gets its own click — this
     only claims the ones that would otherwise have done nothing. */
  document.addEventListener('click', (e) => {
    const el = e.target as Element | null;
    if (open) {
      if (!el?.closest('[data-oc]')) hide();
      return;
    }
    if (!onOrb(e.clientX, e.clientY)) return;
    if (el?.closest('a, button, input, textarea, select, label, summary')) return;
    if ((window.getSelection()?.toString() ?? '').length) return;
    show(null);
  });

  /* The pointer-free route. The orb cannot be focused without announcing
     itself, so the theme control — the page's other sun and moon — opens it
     when Space is *held*. A tap there is still only a theme change.

     Space and not Enter, and that is not a preference: a button fires its
     click on Enter **keydown**, so a held Enter would have flipped the theme
     the instant the key went down and opened the panel 550ms later. Space
     fires its click on keyup, which is late enough to be swallowed. */
  const HOLD = 550;
  let held = 0;
  let swallow = false;

  toggle?.addEventListener('keydown', (e) => {
    if (e.key !== ' ' || e.repeat || open) return;
    window.clearTimeout(held);
    held = window.setTimeout(() => {
      swallow = true;
      show(toggle);
    }, HOLD);
  });
  for (const ev of ['keyup', 'blur'] as const) {
    toggle?.addEventListener(ev, () => window.clearTimeout(held));
  }

  /* Capture phase, on the document: ThemeToggle's own click listener is on
     the button and this has to run first to stop it. Swallowing here keeps
     that component untouched — it does not need to know this exists. */
  document.addEventListener(
    'click',
    (e) => {
      if (!swallow) return;
      swallow = false;
      if ((e.target as Element | null)?.closest('[data-theme-toggle]')) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true,
  );

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && open) hide(true);
  });

  // The orb's position is a clamp() of the viewport, so it moves when the
  // viewport does. Scrolling never moves it: the sky is fixed (D-027).
  window.addEventListener('resize', () => { if (open) place(); }, { passive: true });

  /* Daybreak closes it, however the day arrives — the theme control, a tool
     setting the attribute, or the visitor's system preference changing under
     the page. Leaving it open in daylight would make the one rule this thing
     has a rule that only applies at the moment it opens. */
  const daybreak = (): void => { if (open && !night()) hide(); };
  new MutationObserver(daybreak).observe(document.documentElement, {
    attributeFilter: ['data-theme'],
  });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', daybreak);
}
