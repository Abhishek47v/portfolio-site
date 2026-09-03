/**
 * The Work / Projects shelf (D-047).
 *
 * Every book, every spine and every project's detail is already in the markup —
 * Work.astro renders all of it at build time. This adds only the state: which
 * leaf is open, which two books are off the shelf, and what the reading slot
 * says. It creates no elements, so nothing here can hit the scoped-CSS trap
 * that stripped the Experience rail of its styling (D-046), and it removes an
 * entire class of bug: the shelf's geometry is fixed at build, so it cannot
 * reshuffle itself when a selection changes.
 *
 * With this script absent the section is a plain list of projects, which is
 * what nojs.spec.ts checks.
 */

export function shelf(reduce: boolean): void {
  const root = document.querySelector<HTMLElement>('[data-book]');
  if (!root) return;

  const leaves = Array.from(root.querySelectorAll<HTMLElement>('[data-leaf]'));
  if (!leaves.length) return;

  const spines = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-spine]'));
  const corner = root.querySelector<HTMLButtonElement>('[data-corner]');
  // an HTML span over the cover, not SVG <text> — a cover title reads across
  const cornerLabel = root.querySelector<HTMLElement>('[data-corner-label]');
  const note = root.querySelector<HTMLElement>('[data-shelf-note]');
  const announce = root.querySelector<HTMLElement>('[data-announce]');

  const ids = leaves.map((l) => l.dataset.leaf!);
  let open = ids[0];
  let desk = ids[1];

  const titleOf = (id: string): string =>
    root.querySelector<HTMLElement>(`[data-leaf="${id}"] h3`)?.textContent?.trim() ?? id;

  function paint(settle: boolean): void {
    for (const leaf of leaves) {
      const isOpen = leaf.dataset.leaf === open;
      leaf.toggleAttribute('data-open', isOpen);
      leaf.classList.remove('is-settling');
      if (isOpen && settle && !reduce) {
        // restart the animation rather than relying on the class being absent
        void leaf.offsetWidth;
        leaf.classList.add('is-settling');
      }
    }

    /* A pulled book keeps its slot and its shape and is drawn as an absence, so
       the shelf never reflows when the selection changes. */
    for (const spine of spines) {
      const id = spine.dataset.spine!;
      const pulled = id === open || id === desk;
      spine.toggleAttribute('data-pulled', pulled);
      spine.setAttribute(
        'aria-label',
        pulled
          ? `${spine.dataset.title} — off the shelf, ${id === desk ? 'closed on the desk' : 'open above'}`
          : `Open ${spine.dataset.title}`,
      );
    }

    if (cornerLabel && desk) cornerLabel.textContent = titleOf(desk);
    if (corner && desk) corner.setAttribute('aria-label', `Open ${titleOf(desk)}`);
    if (announce) announce.textContent = `Now open: ${titleOf(open)}`;
  }

  /* The corner book and the open spread swap seats. Each element is measured
     before and after and animates the delta to the other's old box, so this is
     one move rather than a crossfade between two states that have to be kept
     in sync. */
  function swap(): void {
    if (!corner || !desk) return;
    const book = root!.querySelector<HTMLElement>('.book');
    if (!book) return;

    const bookBefore = book.getBoundingClientRect();
    const cornerBefore = corner.getBoundingClientRect();

    const previous = open;
    open = desk;
    desk = previous;
    paint(false);

    if (reduce || typeof book.animate !== 'function') return;

    const bookAfter = book.getBoundingClientRect();
    const cornerAfter = corner.getBoundingClientRect();
    const ease = 'cubic-bezier(.22,.61,.36,1)';

    book.animate(
      [
        {
          transform: `translate(${cornerBefore.left - bookAfter.left}px, ${cornerBefore.top - bookAfter.top}px) scale(${cornerBefore.width / (bookAfter.width || 1)})`,
          opacity: 0.35,
        },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 520, easing: ease },
    );

    corner.animate(
      [
        {
          transform: `translate(${bookBefore.left - cornerAfter.left}px, ${bookBefore.top - cornerAfter.top}px) scale(${bookBefore.width / (cornerAfter.width || 1)})`,
          opacity: 0.35,
        },
        { transform: 'none', opacity: 1 },
      ],
      { duration: 520, easing: ease },
    );
  }

  const setNote = (html: string): void => {
    if (note) note.innerHTML = html;
  };
  const clearNote = (): void => setNote('');

  for (const spine of spines) {
    const id = spine.dataset.spine!;

    spine.addEventListener('click', () => {
      if (id === open) return;
      if (id === desk) {
        swap();
        return;
      }
      open = id;
      paint(true);
    });

    const describe = (): void => {
      const where = id === desk ? 'on the desk' : id === open ? 'open above' : String(spine.dataset.year);
      setNote(`<b>${spine.dataset.title}</b> · ${where}`);
    };
    spine.addEventListener('mouseenter', describe);
    spine.addEventListener('focus', describe);
    spine.addEventListener('mouseleave', clearNote);
    spine.addEventListener('blur', clearNote);
  }

  corner?.addEventListener('click', swap);

  /* Extra photos. The control only exists where a project has more than one
     shot, so there is nothing to wire up for the rest — and with this script
     absent every shot is simply visible and the control stays hidden. */
  for (const plate of Array.from(root.querySelectorAll<HTMLElement>('[data-plate]'))) {
    const shots = Array.from(plate.querySelectorAll<HTMLElement>('[data-shot]'));
    const button = plate.parentElement?.querySelector<HTMLButtonElement>('[data-more]');
    if (shots.length < 2 || !button) continue;

    const counter = button.querySelector<HTMLElement>('[data-more-count]');
    let at = 0;

    button.addEventListener('click', () => {
      at = (at + 1) % shots.length;
      shots.forEach((shot, k) => shot.toggleAttribute('data-shot-open', k === at));
      if (counter) counter.textContent = `${at + 1} / ${shots.length}`;
      if (announce) announce.textContent = `Photo ${at + 1} of ${shots.length}`;
    });
  }

  paint(false);
  root.setAttribute('data-ready', '');
}
