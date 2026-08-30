/** The timeline draws its rule downward once, the first time it is seen. */
export function drawTimeline(): void {
  const timeline = document.querySelector<HTMLElement>('[data-timeline]');
  if (!timeline) return;

  if (!('IntersectionObserver' in window)) {
    timeline.classList.add('is-in');
    return;
  }

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-in');
        obs.disconnect();
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0 },
  );
  io.observe(timeline);
}
