/**
 * The summary strip under the hero — the 10-second version of the CV, for the
 * reader who will not scroll.
 *
 * Confirmed by the owner. Numbers are the most damaging kind of placeholder —
 * prose that reads as filler is obviously filler, but a
 * precise-looking figure is read as a claim. Replace each one with something
 * you can defend in an interview, or delete the entry — a short honest strip
 * beats a long invented one.
 *
 * Order is deliberate: span, then output, then reliability. Five reads as a
 * summary; past six it starts reading as a dashboard.
 */
export const stats = [
  { value: '4+',    label: 'Years building' },
  { value: '20+',   label: 'Projects' },
  { value: '12',    label: 'Systems shipped' },
  { value: '500+',  label: 'Hours automated' },
  { value: '99.9%', label: 'Uptime held' },
] as const;
