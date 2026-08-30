/**
 * Light that follows the pointer across a project row, as though the sun were
 * on it. Absent under reduced motion, and absent on touch.
 */
export function pointerLight(reduce: boolean): void {
  if (reduce || !window.matchMedia('(hover: hover)').matches) return;

  for (const el of document.querySelectorAll<HTMLElement>('[data-lit]')) {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--lit-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
      el.style.setProperty('--lit-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
    });
  }
}
