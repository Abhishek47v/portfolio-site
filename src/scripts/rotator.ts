/**
 * The rotating role line.
 *
 * The visible rotator is aria-hidden and a static, visually-hidden sentence
 * carries the full list — a live region that re-announces every few seconds
 * would be hostile to a screen reader. Under reduced motion the first role
 * simply stands still.
 */
const INTERVAL = 2600;
const FADE = 320;

export function rotate(reduce: boolean): void {
  const el = document.querySelector<HTMLElement>('.rotator');
  const word = el?.querySelector<HTMLElement>('.word');
  const roles = el?.dataset.roles?.split('|').filter(Boolean) ?? [];

  if (reduce || !el || !word || roles.length < 2) return;

  let i = 0;
  window.setInterval(() => {
    el.classList.add('is-out');
    window.setTimeout(() => {
      i = (i + 1) % roles.length;
      word.textContent = roles[i];
      el.classList.remove('is-out');
    }, FADE);
  }, INTERVAL);
}
