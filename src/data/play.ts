/**
 * Off the clock — the one thing on this site that is not about work (D-061).
 *
 * Reached by pressing and holding the sun/moon in the header. Nothing links to
 * it and nothing announces it; it is meant to be found, not presented.
 *
 * PROVISIONAL — every title below is invented. Replace them with what is
 * actually installed; `npm run content:status` lists this file until the word
 * above is gone.
 *
 * **Editing this is the whole point.** Change a title, add a line, drop a
 * section by emptying its array — the panel renders what is here and lays out
 * around whatever is missing. Keep it short: this is a hidden aside in a
 * header, not a page. Three favourites and three counts is the shape it was
 * drawn for; much more and it stops being an aside.
 */
export interface Sunk {
  title: string;
  /** Whole hours. Formatted with separators when it renders. */
  hours: number;
}

export const play = {
  /** One sentence. It sets the tone for the whole panel, so it is worth writing. */
  intro: 'Most of what I do outside work involves a controller.',

  /** What is installed right now. `note` is optional — empty prints nothing. */
  now: {
    title: 'Elden Ring — Shadow of the Erdtree',
    note: '',
  },

  /** The ones that stay installed. Empty, so the panel skips that row entirely
   *  — put three titles back here and it returns. Three is the shape it was
   *  drawn for. */
  favourites: [] as readonly string[],

  /** Where the hours actually went. Sorted highest first when it renders. */
  sunk: [
    { title: 'Valorant', hours: 1200 },
    { title: 'GTA V', hours: 780 },
    { title: 'Minecraft', hours: 640 },
  ] as readonly Sunk[],
} as const;
