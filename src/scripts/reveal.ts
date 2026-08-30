/**
 * Staggered arrival.
 *
 * Line level, never character level: per-character animation is the gimmicky
 * version and it corrupts what a screen reader announces (D-022).
 */
const STAGGER = 55; // ms between siblings

export function reveal(reduce: boolean): void {
  const groups = document.querySelectorAll<HTMLElement>('[data-reveal]');
  const targets: HTMLElement[] = [];

  // Counting per group beats asking each element for its own index — the
  // parent already knows the order.
  for (const group of groups) {
    let i = 0;
    for (const el of Array.from(group.children) as HTMLElement[]) {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', `${i++ * STAGGER}ms`);
      targets.push(el);
    }
  }

  if (reduce || !('IntersectionObserver' in window)) {
    for (const el of targets) el.classList.add('is-in');
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    // threshold 0, deliberately: an element taller than the viewport can never
    // reach a fractional threshold, and would stay invisible for good (D-028).
    { rootMargin: '0px 0px -6% 0px', threshold: 0 },
  );

  for (const el of targets) io.observe(el);
}
