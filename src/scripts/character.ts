/**
 * The reclining figure wakes when he comes on screen.
 *
 * Awake is the default in the markup, so this script only ever *adds* the
 * sleeping state — remove the JavaScript and the character is simply awake,
 * which is the point of every script here being additive.
 *
 * Under reduced motion this returns before observing anything: he stays awake,
 * the arm stays up, and nothing waves. That is the designed variant rather than
 * a disabled feature — the character still reads as relaxed and present.
 */
const WAKE = 420;   // let the arm finish swinging up before it starts waving
const WAVING = 1980; // three cycles of the 640ms wave, plus a little slack

export function character(reduce: boolean): void {
  const el = document.querySelector<HTMLElement>('.character');
  if (reduce || !el || !('IntersectionObserver' in window)) return;

  let timer = 0;

  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.classList.remove('is-asleep');
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          el.classList.add('is-waving');
          timer = window.setTimeout(() => el.classList.remove('is-waving'), WAVING);
        }, WAKE);
      } else {
        window.clearTimeout(timer);
        el.classList.remove('is-waving');
        el.classList.add('is-asleep');
      }
    },
    // Generous enough that the sleeping pose is actually seen for a moment on
    // the way out and on the way back in — it is the only time it is visible.
    { threshold: 0.3 },
  );

  io.observe(el);
}
