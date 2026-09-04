/**
 * Identity and links. Change a value and nothing else in the codebase needs
 * to change.
 */
export const site = {
  name: 'Abhishek Verma',
  title: 'Software Engineer',
  location: 'Bangalore, India',
  /** Show the illustrated character above the name. Off leaves a purely
   *  typographic hero — the design works either way. */
  character: true,
  /** The rotating line in the hero. Typed and retyped, one after another. */
  roles: [
    'full-stack development',
    'backend systems',
    'front-end engineering',
    'production debugging',
  ],
  /** PROVISIONAL — needs a sentence only he would write. */
  intro:
    'Software engineer working on production systems. I like the part of the job where the answer is not written down yet — the tracing, the debugging, the moment a system finally explains what it has been doing.',
  links: {
    email: 'heyiamabhishekverma@gmail.com',
    github: 'https://github.com/Abhishek47v',
    linkedin: 'https://www.linkedin.com/in/abhishek-v612/',
    leetcode: 'https://leetcode.com/u/Abhishek_Verma612/',
    /**
     * Either a path in public/ or an external URL (a Drive share link, say).
     * Empty, or a public/ path with no file behind it, hides every résumé
     * control on the page rather than rendering a dead one — see lib/assets.
     */
    resume: 'https://drive.google.com/file/d/1RW7GUuGZJTtKOmPldWIn37lcK1OYtHiv/view?usp=sharing',
  },
  /**
   * The contact form's endpoint.
   *
   * A static site cannot send mail, so the form POSTs `name`, `email` and
   * `message` to a form provider (Formspree, Web3Forms, Formspark, Getform —
   * they all accept the same shape). **The destination address is configured in
   * that provider's dashboard and is deliberately not in this repository**: it
   * would otherwise be in the page source for every scraper to read.
   *
   * Empty disables the form's submit and says so on the page, rather than
   * silently swallowing what someone typed. The build also derives the CSP's
   * form-action and connect-src from this, so pasting a URL here is the only
   * change needed — see scripts/csp-headers.mjs.
   *
   * PROVISIONAL.
   */
  contact: {
    endpoint: '',
  },
  /** Social preview image, e.g. '/og/cover.png'. null omits the tags entirely
   *  rather than promising a card that does not exist. */
  ogImage: null as string | null,
  /** Opt-in ambient track. The control renders only if the file exists at
   *  build time. Record its licence in RUNBOOK.md before adding one. */
  audio: '/audio/ambient.mp3',
  education: {
    degree: 'B.Tech, Computer Science and Engineering',
    school: 'Jain University, Bangalore',
    period: '2021 — 2025',
  },
} as const;
