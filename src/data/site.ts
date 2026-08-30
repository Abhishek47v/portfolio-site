/**
 * Identity and links. Change a value and nothing else in the codebase needs
 * to change.
 */
export const site = {
  name: 'Abhishek Verma',
  title: 'Software Engineer',
  location: 'Bangalore, India',
  /** The rotating line in the hero. Professional only. */
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
    email: 'hello@example.com', // PROVISIONAL — needs a personal address, not the work one
    github: 'https://github.com/Abhishek47v',
    linkedin: 'https://www.linkedin.com/in/abhishek-v612/',
    /** Rendered only if public/resume.pdf exists at build time — see lib/assets. */
    resume: '/resume.pdf',
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
