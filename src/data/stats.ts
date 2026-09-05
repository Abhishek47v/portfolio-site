/**
 * The summary strip under the hero — the 10-second version of the CV, for the
 * reader who will not scroll.
 *
 * Every figure here is confirmed by the owner and defensible. Keep it that
 * way: prose that reads as filler is obviously filler, but a precise-looking
 * number is read as a claim, so anything that cannot be defended in an
 * interview belongs out of this file rather than softened inside it.
 *
 * Order is deliberate: span, then output, then reliability. Five reads as a
 * summary; past six it starts reading as a dashboard.
 */
export const stats = [
  { value: '4+',    label: 'Years building' },
  { value: '20+',   label: 'Projects' },
  { value: '11',    label: 'Systems shipped' },
  { value: '500+',  label: 'Hours automated' },
  { value: '99.9%', label: 'Uptime held' },
] as const;
