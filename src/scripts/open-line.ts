/**
 * The Contact section's thread (D-051, simplified by D-052).
 *
 * Draws one line: it enters the sky above the section, wanders with a tapering
 * amplitude, turns through a single elbow into the email address's rule, then
 * breaks into dashes and ends at an open marker. Everything the section says is
 * already in the markup — this adds the line and places one label, so with the
 * script absent Contact is a heading, an invitation, an address and a list of
 * links (tests/nojs.spec.ts).
 *
 * Like the roadmap it is generated *after* layout rather than authored as a
 * fixed path: the address's real position decides where the rule goes, so the
 * text sets the composition and the line follows it. That is also why it
 * redraws on resize and once the web fonts have landed — both move the address.
 *
 * **It starts at the road's end.** Experience sits directly above since D-050,
 * so this reads `.rm-now` — the roadmap's own `now` marker — and begins there,
 * in that marker's exact position. The roadmap's dissolving bottom cap was
 * removed to make room for it: the rail no longer trails off, it continues.
 * The lead (how far above the section the thread starts) is therefore measured
 * rather than assumed, and if the roadmap is not on the page this falls back to
 * a fixed lead and its own dashed entry (D-053).
 *
 * There used to be a great deal more here — a ghost of the same path passing
 * under the sheet, handed over by complementary masks cut at the sheet's top
 * edge. A CSS mask on an SVG child resolves its lengths against that element's
 * own bounding box, and the cut was landing well below where the arithmetic
 * said it would, leaving a hard dark stroke running down through the copy. The
 * section no longer has a panel to pass under, so all of it is gone. If you are
 * ever tempted to reintroduce a masked handover here, measure where the fade
 * actually falls before believing it.
 */

const NS = 'http://www.w3.org/2000/svg';

function el<K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

export function openLine(): void {
  const root = document.querySelector<HTMLElement>('[data-line]');
  const svg = document.querySelector<SVGSVGElement>('[data-thread]');
  const layer = document.querySelector<SVGGElement>('[data-thread-layer]');
  const mail = document.querySelector<HTMLElement>('[data-mail]');
  const openLabel = document.querySelector<HTMLElement>('[data-open-label]');
  if (!root || !svg || !layer || !mail) return;

  /** The route's own top. The dashed cap covers everything above it. */
  const START_Y = 78;

  /* How far below its layout position the reveal animation is currently
     holding an element.

     `.reveal` is `translateY(10px)` until it scrolls into view, and
     getBoundingClientRect reports that transform while layout does not. This
     draws long before Contact is on screen, so every rect it measures is 10px
     low — while the SVG it draws into is not, because `.contact` itself is not
     a revealed element. That is why the address's rule sat 10px under the
     address once the block settled. Ancestors are walked because the transform
     is on the block, not on the address inside it. Nothing is visible until
     the reveal finishes, so the settled position is the only correct one. */
  function revealShift(el: Element): number {
    let y = 0;
    for (let n: Element | null = el; n && n !== document.body; n = n.parentElement) {
      const t = getComputedStyle(n).transform;
      if (t && t !== 'none') y += new DOMMatrix(t).f;
    }
    return y;
  }

  function draw(): void {
    const W = root!.clientWidth;
    if (!W) return;

    const mobile = W < 760;
    const rect = root!.getBoundingClientRect();

    /* Where the road ended. `now` is a real element the roadmap drew, so its
       position already accounts for every block height above it — nothing here
       has to know anything about the Experience layout. */
    let entryX: number | null = null;
    let lead = mobile ? 170 : 260;
    const now = document.querySelector('[data-rail] .rm-now');
    if (now) {
      const n = now.getBoundingClientRect();
      const nY = n.top - revealShift(now) + n.height / 2;
      const gap = Math.round(rect.top - nY);
      // sane band only: a collapsed or absent roadmap must not drag the thread
      if (gap > 40 && gap < 1200) {
        lead = gap;
        entryX = Math.round(n.left + n.width / 2 - rect.left);
      }
    }
    root!.style.setProperty('--lead', `${lead}px`);
    const H = Math.round(rect.height + lead);
    svg!.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg!.setAttribute('width', String(W));
    svg!.setAttribute('height', String(H));
    layer!.replaceChildren();

    const m = mail!.getBoundingClientRect();
    const mY = m.bottom - revealShift(mail!);
    // y = 0 is `lead` above the section's top
    const top = rect.top - lead;
    const railY = Math.round(mY - top + 10);
    const x1 = Math.round(m.left - rect.left - 6);
    const x2 = Math.round(m.right - rect.left + 6);
    // the rule reaches a little past the address on the arrival side
    const xa = Math.max(10, x1 - (mobile ? 9 : 34));

    /* All of the sideways travel happens *above* the section. By the time the
       thread reaches the first line of text it is already in the left margin,
       so it never crosses a word — which matters far more now that there is no
       cloud to cross harmlessly. */
    const x0 = entryX ?? xa + (mobile ? 32 : 120);
    const travel = x0 - xa;

    if (entryX === null) {
      // no roadmap above: the line has to arrive from somewhere on its own
      layer!.appendChild(
        el('path', {
          class: 'ol-cap',
          d: `M${x0} -14 C${x0} 22 ${x0 - 6} 40 ${x0 - 8} ${START_Y}`,
        }),
      );
    }

    /* The wander settles: it bows once each way and the amplitude tapers to
       nothing as it arrives. A route still swinging when it reaches its
       destination has not arrived, it has merely stopped. */
    const bow = mobile ? 14 : Math.max(34, Math.min(96, Math.abs(travel) * 0.22));
    const pts = [
      { x: entryX === null ? x0 - 8 : x0, y: entryX === null ? START_Y : 0 },
      { x: Math.round(x0 - travel * 0.42 + bow), y: Math.round(lead * 0.32) },
      { x: Math.round(x0 - travel * 0.86 - bow * 0.7), y: Math.round(lead * 0.7) },
      { x: xa + (mobile ? 8 : 16), y: Math.round(lead * 0.98) },
      { x: xa, y: railY - 56 },
    ];

    // vertical control handles only, so the route can never double back
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dy = (b.y - a.y) * 0.5;
      d += ` C${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y}`;
    }
    // one elbow out of the descent, then the address's rule
    d += ` C${xa} ${railY - 18} ${xa + 10} ${railY} ${x1} ${railY}`;
    d += ` L${x2} ${railY}`;

    const route = el('path', { class: 'ol-route', d });
    layer!.appendChild(route);
    const len = route.getTotalLength().toFixed(1);
    route.style.setProperty('--len', len);
    route.setAttribute('stroke-dasharray', len);

    /* Past the address it breaks back into dashes and drifts off — if there is
       anywhere to drift to.

       The address is real content and can be any length. A 29-character one at
       phone width ends about 60px from the edge of the section, and the tail,
       the ring and the label need roughly 100 more: the endpoint went off the
       right of the page and took 82px of horizontal scroll with it. So the room
       is measured rather than assumed, and when there is none the thread hangs
       instead — it dips below the address's rule and ends one line lower, with
       the same three marks. It never stops early and it never runs off the
       page. `.mail`'s bottom margin is what that lower line is drawn into. */
    const lb = openLabel ? openLabel.getBoundingClientRect() : null;
    const labelW = lb ? Math.ceil(lb.width) : 34;
    const labelH = lb ? lb.height : 11;
    const need = 22 + 8 + labelW; // ring centre + radius and gap, then the word
    /* The room is the address's own column, not the section. Above 900px
       Contact is two columns and the form is the right one: measured against
       the section, the marker ran 44-64px into the form and the word `open`
       sat on top of it. Below that breakpoint `.col` is full width, so this
       also keeps the marker out of the band's padding, where it used to end. */
    const col = root!.querySelector('.col');
    const room = col
      ? Math.round(col.getBoundingClientRect().right - rect.left) - 6
      : W - 6;

    const reach = mobile ? 38 : 62;
    let xe = x2 + reach;
    let ye = railY + (mobile ? 6 : 8);
    let tail =
      `M${x2} ${railY} C${x2 + reach * 0.45} ${railY}` +
      ` ${x2 + reach * 0.62} ${ye - 2} ${xe} ${ye}`;

    if (xe + need > room) {
      /* How far down is measured, not chosen. `.mail`'s bottom margin is the
         slot the marker drops into, and the rule is already 10px into it — a
         fixed 30px put the word on top of the LeetCode link, and a fixed
         anything is wrong the moment that margin's clamp changes. Half the
         remaining slot centres it between the rule and the row below. */
      const list = root!.querySelector('.links');
      const listY = list
        ? Math.round(list.getBoundingClientRect().top - revealShift(list) - top)
        : railY + 44;
      // half the marker: the ring's radius and its stroke, or the word's own
      // half-height, whichever reaches further from the centre line
      const half = Math.max(8.5, labelH / 2);
      ye = Math.max(railY + 9, Math.min(railY + 24, listY - 5 - half));
      xe = Math.max(xa, Math.min(x2 - 8, room - need));
      tail = `M${x2} ${railY} C${x2 + 10} ${railY + 4} ${xe + 26} ${ye - 7} ${xe} ${ye}`;
    }

    layer!.appendChild(el('path', { class: 'ol-tail', d: tail }));

    /* The endpoint: a ring with a gap facing the reader. The line does not
       stop, it stays open. `pathLength` makes the dash pattern a percentage so
       the gap can be closed by interpolating to `100 0`. */
    layer!.appendChild(
      el('circle', { class: 'ol-ring', cx: xe + 16, cy: ye + 2, r: 6.5, pathLength: 100 }),
    );

    /* The label is real text in the document, positioned here — the contrast
       probe reads `color` off DOM nodes and cannot see into an SVG. Its y is in
       section coordinates, so the lead comes back off. */
    if (openLabel) {
      openLabel.style.left = `${xe + 30}px`;
      // centred on the ring rather than offset by a guess at its height
      openLabel.style.top = `${ye - lead - labelH / 2}px`;
    }

    root!.setAttribute('data-thread-ready', '');
  }

  const linked = (on: boolean): void => {
    // Braces, not a concise body: classList.toggle returns a boolean and this
    // is declared void, which `astro check` is right to reject.
    svg.classList.toggle('is-linked', on);
  };
  mail.addEventListener('mouseenter', () => linked(true));
  mail.addEventListener('mouseleave', () => linked(false));
  mail.addEventListener('focus', () => linked(true));
  mail.addEventListener('blur', () => linked(false));

  draw();

  let pending = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(pending);
    pending = window.setTimeout(draw, 120);
  });
  // web fonts change the address's box, and the rule is drawn under it
  void document.fonts?.ready.then(draw);
}
