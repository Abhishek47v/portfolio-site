/**
 * The Experience roadmap's rail.
 *
 * The section is real HTML: every role's dates, title, summary, highlights and
 * stack are in the markup and readable with this script absent. What this adds
 * is the line that threads them together — so with JavaScript off the section
 * degrades to a plain, correctly ordered list, which is what nojs.spec.ts
 * checks (D-046).
 *
 * The curve is generated *after* layout rather than authored as a fixed path:
 * the script measures where each block actually landed and threads a spline
 * through those anchors. The text therefore sets the rhythm and the line
 * follows it, instead of text being poured into gaps left by a fixed graphic.
 * That is also why it redraws on resize and after web fonts land — both change
 * block heights.
 */

interface Stop {
  id: string;
  start: number; // months since year 0
  end: number | null;
  side: 'left' | 'right';
  el: HTMLElement;
}

const NS = 'http://www.w3.org/2000/svg';

/** "2025-06" → months since year 0. Matches lib/format's month indexing. */
function mi(value: string): number {
  const [y, m] = value.split('-');
  return Number(y) * 12 + (Number(m || 1) - 1);
}

function nowIndex(): number {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
}

function el<K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string | number>,
): SVGElementTagNameMap[K] {
  const node = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, String(v));
  return node;
}

export function roadmap(): void {
  const root = document.querySelector<HTMLElement>('[data-roadmap]');
  const svg = document.querySelector<SVGSVGElement>('[data-rail]');
  const layer = document.querySelector<SVGGElement>('[data-rail-layer]');
  if (!root || !svg || !layer) return;

  const blocks = Array.from(root.querySelectorAll<HTMLElement>('[data-stop]'));
  const roles: Stop[] = blocks
    .filter((b) => b.dataset.kind !== 'edu')
    .map((b) => ({
      id: b.dataset.stop!,
      start: mi(b.dataset.start!),
      end: b.dataset.end ? mi(b.dataset.end) : null,
      side: (b.dataset.side as 'left' | 'right') ?? 'left',
      el: b,
    }));
  if (!roles.length) return;

  const eduEl = blocks.find((b) => b.dataset.kind === 'edu');

  /* Authored, not generated. Stops lean toward the side carrying their text;
     the waypoints between them bow the other way, so the rail bends *through*
     the section rather than merely kinking at each marker. Random offsets read
     as noise — the house rule is that the wander is designed (D-046). */
  const LEAN = [-0.55, 0.62, -0.48, 0.2];
  const BOW = [0.95, -0.85, 0.72, 0.5];

  function anchorY(node: HTMLElement): number {
    const a = node.querySelector('[data-anchor]') ?? node;
    return a.getBoundingClientRect().top - root!.getBoundingClientRect().top;
  }

  function draw(): void {
    const W = root!.clientWidth;
    const H = root!.clientHeight;
    if (!W || !H) return;

    const mobile = W < 760;
    svg!.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg!.setAttribute('width', String(W));
    svg!.setAttribute('height', String(H));

    /* The channel is measured, not assumed. An earlier version hard-coded the
       block width here, which meant the CSS and the script each held half of
       the same number and had to be kept in sync by hand. Reading the real
       edges lets the layout decide how close the blocks sit and the rail simply
       follows — narrow the column in CSS and this adapts. */
    const rootRect = root!.getBoundingClientRect();
    let leftEdge = 0;
    let rightEdge = W;
    for (const b of blocks) {
      const r = b.getBoundingClientRect();
      const cs = getComputedStyle(b);
      // getBoundingClientRect covers the cloud's padding; the text edge is what
      // the rail must clear, and the cloud may be crossed.
      const x0 = r.left - rootRect.left + parseFloat(cs.paddingLeft || '0');
      const x1 = r.right - rootRect.left - parseFloat(cs.paddingRight || '0');
      if (b.dataset.side === 'right') rightEdge = Math.min(rightEdge, x0);
      else leftEdge = Math.max(leftEdge, x1);
    }

    const CLEAR = 18; // breathing room between the rail and any glyph
    const CX = mobile ? 20 : (leftEdge + rightEdge) / 2;
    const AMP = mobile ? 11 : Math.max(12, (rightEdge - leftEdge) / 2 - CLEAR);

    /* How far the rail may swing *at a given height*. Beside a block it is the
       narrow channel above; in the long empty stretches between stops there is
       nothing to avoid, so it can bow much wider. That is what lets the blocks
       sit close to the rail without flattening it into a straight line — the
       constraint is only where the text actually is. */
    const ampAt = (y: number): number => {
      if (mobile) return 11;
      let left = 0;
      let right = W;
      for (const b of blocks) {
        const r = b.getBoundingClientRect();
        const top = r.top - rootRect.top;
        const bottom = r.bottom - rootRect.top;
        if (y < top - 10 || y > bottom + 10) continue;
        const cs = getComputedStyle(b);
        const x0 = r.left - rootRect.left + parseFloat(cs.paddingLeft || '0');
        const x1 = r.right - rootRect.left - parseFloat(cs.paddingRight || '0');
        if (b.dataset.side === 'right') right = Math.min(right, x0);
        else left = Math.max(left, x1);
      }
      const room = Math.min(CX - left, right - CX) - CLEAR;
      return Math.max(12, Math.min(room, 120));
    };

    /* A marker leans toward the side its block is on, but never closer to that
       block's text than STOP_GAP. The lean is what ties a stop to its own
       column; the gap is what stops the two touching. Both are wanted, so the
       lean is clamped rather than reduced. */
    const STOP_GAP = 46;
    const stopPts = roles.map((r, i) => {
      const lean = CX + (LEAN[i] ?? -0.4) * AMP;
      const x = mobile
        ? CX
        : r.side === 'left'
          ? Math.max(lean, leftEdge + STOP_GAP)
          : Math.min(lean, rightEdge - STOP_GAP);
      return { x, y: anchorY(r.el) + 8 };
    });
    /* `now` must clear the last block, not merely sit near the bottom of the
       container: on a phone the final block runs the full width, and a marker
       placed by container height alone lands on top of its own chips. */
    const lastRole = roles[roles.length - 1].el.getBoundingClientRect();
    const lastBottom = lastRole.bottom - root!.getBoundingClientRect().top;
    const nowY = Math.max(lastBottom + 46, H - 118);
    stopPts.push({ x: CX + 0.2 * AMP, y: nowY });

    /* Where the bow between two stops goes. The anchors sit at each block's top
       line, so the midpoint between two anchors usually still falls *inside* the
       upper block — putting the bow exactly where it has no room. The empty band
       is lower: between one block's bottom and the next block's top. Aim there
       when the gap is worth using, and the bow gets the width it wants. */
    const bandCentre = (i: number): number => {
      const prev = roles[i - 1]?.el.getBoundingClientRect();
      const next = roles[i]?.el.getBoundingClientRect();
      const a = stopPts[i - 1];
      const b = stopPts[i];
      const fallback = a.y + (b.y - a.y) * 0.46;
      if (!prev) return fallback;
      const top = prev.bottom - rootRect.top;
      const bottom = next ? next.top - rootRect.top : b.y;
      if (bottom - top < 60) return fallback;
      return top + (bottom - top) * 0.5;
    };

    const pts: { x: number; y: number }[] = [stopPts[0]];
    for (let i = 1; i < stopPts.length; i++) {
      const wy = bandCentre(i);
      pts.push({ x: CX + (BOW[i - 1] ?? 0.6) * ampAt(wy), y: wy });
      pts.push(stopPts[i]);
    }

    /* Control handles are pure vertical, so the rail can never double back. */
    let d = `M${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1];
      const b = pts[i];
      const dy = (b.y - a.y) * 0.5;
      d += ` C${a.x} ${a.y + dy} ${b.x} ${b.y - dy} ${b.x} ${b.y}`;
    }

    layer!.replaceChildren();

    const route = el('path', { class: 'rm-route', d });
    layer!.appendChild(route);

    const p0 = pts[0];
    const pN = stopPts[stopPts.length - 1];
    layer!.appendChild(
      el('path', {
        class: 'rm-cap rm-cap--top',
        d: `M${p0.x} ${Math.max(0, p0.y - 92)} C${p0.x} ${p0.y - 46} ${p0.x} ${p0.y - 46} ${p0.x} ${p0.y}`,
      }),
    );
    /* No bottom cap any more. The rail used to dissolve into dashes after `now`
       to say "this carries on"; Contact sits directly below since D-050 and its
       thread now literally does carry on, starting from this marker
       (scripts/open-line.ts reads `.rm-now`). Two dissolving tails 200px apart
       read as two lines, not one (D-053). */

    const total = route.getTotalLength();

    /* y along this path only ever increases, so one ordered sample table turns
       a y back into a length. */
    const table: { y: number; L: number }[] = [];
    for (let i = 0; i <= 400; i++) {
      const L = (total * i) / 400;
      table.push({ y: route.getPointAtLength(L).y, L });
    }
    const lenForY = (y: number): number => {
      if (y <= table[0].y) return 0;
      for (let i = 1; i < table.length; i++) {
        if (table[i].y >= y) {
          const a = table[i - 1];
          const b = table[i];
          return a.L + (b.L - a.L) * ((y - a.y) / (b.y - a.y || 1));
        }
      }
      return total;
    };

    const NOW = nowIndex();
    const anchors = roles.map((r, i) => ({ t: r.start, y: stopPts[i].y }));
    anchors.push({ t: NOW, y: nowY });

    const yForDate = (t: number): number => {
      if (t <= anchors[0].t) return anchors[0].y;
      for (let i = 1; i < anchors.length; i++) {
        if (t <= anchors[i].t) {
          const a = anchors[i - 1];
          const b = anchors[i];
          return a.y + (b.y - a.y) * ((t - a.t) / (b.t - a.t || 1));
        }
      }
      return anchors[anchors.length - 1].y;
    };

    /* Education: a duration, so it is a rail running alongside — not a stop. */
    if (eduEl?.dataset.end) {
      const endY = yForDate(mi(eduEl.dataset.end));
      const off = mobile ? -12 : 16;
      let eduD = '';
      for (let i = 0; i <= 40; i++) {
        const y = (endY / 40) * i;
        const x = route.getPointAtLength(lenForY(y)).x + off;
        eduD += `${i ? ' L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
      }
      layer!.appendChild(el('path', { class: 'rm-edu', d: eduD }));
      const ex = route.getPointAtLength(lenForY(endY)).x + off;
      layer!.appendChild(el('path', { class: 'rm-edu-cap', d: `M${ex - 5} ${endY.toFixed(1)} h10` }));
    }

    /* One overlay per role: the months that role actually occupied. */
    for (const r of roles) {
      const s = lenForY(yForDate(r.start));
      const e = lenForY(yForDate(r.end ?? NOW));
      const span = el('path', {
        class: 'rm-span',
        d,
        'stroke-dasharray': `${(e - s).toFixed(2)} ${(total + 10).toFixed(2)}`,
        'stroke-dashoffset': (-s).toFixed(2),
      });
      span.dataset.for = r.id;
      layer!.appendChild(span);
    }

    roles.forEach((r, i) => {
      const pt = stopPts[i];
      /* Reaches to its own block's edge, but only ever a short span now that
         the columns sit close to the rail. A long rule drawn through empty sky
         reads as a table rule and fights the wander. */
      const lx = mobile
        ? pt.x + 20
        : r.side === 'left'
          ? Math.max(leftEdge + 4, pt.x - 30)
          : Math.min(rightEdge - 4, pt.x + 30);
      const leader = el('path', { class: 'rm-leader', d: `M${pt.x} ${pt.y} L${lx} ${pt.y}` });
      leader.dataset.for = r.id;
      layer!.appendChild(leader);

      const halo = el('circle', { class: 'rm-halo', cx: pt.x, cy: pt.y, r: 13 });
      halo.dataset.for = r.id;
      layer!.appendChild(halo);

      const ring = el('circle', { class: 'rm-ring', cx: pt.x, cy: pt.y, r: 5.5 });
      ring.dataset.for = r.id;
      layer!.appendChild(ring);
    });

    if (eduEl) {
      const ey = anchorY(eduEl) + 8;
      const ex = route.getPointAtLength(lenForY(Math.max(ey, 0))).x + (mobile ? -12 : 16);
      layer!.appendChild(el('circle', { class: 'rm-ring rm-ring--edu', cx: ex, cy: ey, r: 4 }));
    }

    layer!.appendChild(el('circle', { class: 'rm-now', cx: pN.x, cy: pN.y, r: 3 }));
    const label = el('text', { class: 'rm-now-label', x: pN.x + 12, y: pN.y + 4 });
    label.textContent = 'now';
    layer!.appendChild(label);

    svg!.classList.add('is-drawn');
  }

  /* Focus and hover are enhancement only — everything is already readable. */
  const mark = (id: string, on: boolean): void => {
    for (const n of Array.from(layer.children) as (SVGElement & { dataset: DOMStringMap })[]) {
      if (n.dataset.for === id) n.classList.toggle('is-on', on);
    }
  };
  for (const r of roles) {
    r.el.addEventListener('mouseenter', () => mark(r.id, true));
    r.el.addEventListener('mouseleave', () => mark(r.id, false));
    r.el.addEventListener('focusin', () => mark(r.id, true));
    r.el.addEventListener('focusout', () => mark(r.id, false));
  }

  draw();
  /* Instrument Serif changes every heading's height when it lands, which moves
     every anchor the rail was drawn through. */
  document.fonts?.ready.then(draw);

  let t: number | undefined;
  window.addEventListener('resize', () => {
    window.clearTimeout(t);
    t = window.setTimeout(draw, 120);
  });
  if ('ResizeObserver' in window) new ResizeObserver(() => draw()).observe(root);
}
