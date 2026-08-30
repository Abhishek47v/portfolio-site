/**
 * The rotating role line, typed.
 *
 * Each role is typed a character at a time, held, erased, and the next one
 * typed in its place. The visible rotator is aria-hidden and a static,
 * visually-hidden sentence carries the full list — a live region re-announcing
 * a half-typed word every few frames would be hostile to a screen reader.
 *
 * The first role is already complete in the markup, so with JavaScript off (or
 * under reduced motion, where this returns early) the line simply reads as a
 * finished sentence. Nothing here is load-bearing.
 *
 * A self-rescheduling timeout rather than setInterval: the four phases have
 * four different durations, and an interval cannot express that without a
 * state machine on top of it anyway.
 */
const TYPE = 62;    // per character, typing
const ERASE = 34;   // per character, erasing — deleting reads faster than typing
const HOLD = 1800;  // the complete role stands
const PAUSE = 380;  // empty, before the next role starts

export function rotate(reduce: boolean): void {
  const el = document.querySelector<HTMLElement>('.rotator');
  const word = el?.querySelector<HTMLElement>('.word');
  const roles = el?.dataset.roles?.split('|').filter(Boolean) ?? [];

  if (reduce || !el || !word || roles.length < 2) return;

  // The caret belongs to the animation, not to the markup — it appears only
  // once something is actually driving the line.
  el.classList.add('is-typing');

  let i = 0;
  let n = roles[0].length; // the markup ships role 0 already typed out
  let erasing = true;

  const step = (): void => {
    if (erasing) {
      word.textContent = roles[i].slice(0, --n);
      if (n > 0) return void window.setTimeout(step, ERASE);
      erasing = false;
      i = (i + 1) % roles.length;
      return void window.setTimeout(step, PAUSE);
    }

    word.textContent = roles[i].slice(0, ++n);
    if (n < roles[i].length) return void window.setTimeout(step, TYPE);
    erasing = true;
    window.setTimeout(step, HOLD);
  };

  window.setTimeout(step, HOLD);
}
