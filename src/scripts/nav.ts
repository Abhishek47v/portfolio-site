/** Marks the section currently in view in the header nav. */
export function currentSection(): void {
  const links = new Map<string, HTMLAnchorElement>();
  for (const a of document.querySelectorAll<HTMLAnchorElement>('[data-nav]')) {
    links.set(a.dataset.nav!, a);
  }
  if (!links.size || !('IntersectionObserver' in window)) return;

  const seen = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) seen.add(e.target.id);
        else seen.delete(e.target.id);
      }
      // The topmost visible section wins, so scrolling up feels right too.
      let current = '';
      for (const id of links.keys()) if (seen.has(id)) { current = id; break; }
      for (const [id, a] of links) a.classList.toggle('is-current', id === current);
    },
    { rootMargin: '-60px 0px -55% 0px', threshold: 0 },
  );

  for (const id of links.keys()) {
    const el = document.getElementById(id);
    if (el) io.observe(el);
  }
}
