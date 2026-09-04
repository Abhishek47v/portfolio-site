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
  /** The introduction. One sentence, in his own voice. */
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
   */
  contact: {
    endpoint: 'https://api.web3forms.com/submit',
    /**
     * Hidden fields the provider requires, rendered as `<input type="hidden">`.
     *
     * Web3Forms identifies a form by a public `access_key` sent with the post:
     * `fields: { access_key: '…' }`. Formspree needs none — the id is in the
     * endpoint — so this stays empty for it. Either way the **inbox is bound to
     * the key at the provider and is never written here**, which is the rule
     * this whole arrangement exists to keep (D-054).
     *
     * A key here is not a secret. It is public by design, it identifies the
     * form rather than authorising anything, and the worst it permits is
     * someone posting to your form — which the honeypot and the provider's own
     * spam filtering are for.
     */
    fields: { access_key: '568dfca8-a771-45da-8a52-2569b61c4755' } as Readonly<Record<string, string>>,
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
