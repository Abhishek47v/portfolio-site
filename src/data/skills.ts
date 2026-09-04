/**
 * What I build with, grouped by the part of the system it belongs to (D-056).
 *
 * PROVISIONAL — the grouping is right but the list is mine to confirm, and a
 * few entries below are plausible rather than true. `npm run content:status`
 * lists this file until that word is gone.
 *
 * **Two tiers, and they are the whole hierarchy.** `lead` is what actually
 * gets reached for; it is set in the body face at 600. `rest` is everything
 * else in the group, in mono and smaller. Nothing is hidden — the section
 * shows every entry — so weight is the only thing distinguishing them, and a
 * group with an empty `lead` is perfectly fine (Observability has one).
 *
 * **Groups are data, not structure.** The section renders however many there
 * are, one row each. Adding a ninth costs a row and nothing else, which is the
 * property the whole layout was chosen for. Order is authored: it runs roughly
 * from what a reader meets first to what keeps it running.
 *
 * Keep `lead` to two or three. Four stops being a shortlist.
 */
export interface SkillGroup {
  name: string;
  lead: readonly string[];
  rest: readonly string[];
}

export const skills: readonly SkillGroup[] = [
  {
    name: 'Languages',
    lead: ['TypeScript', 'Python'],
    rest: ['JavaScript', 'SQL', 'Bash'],
  },
  {
    name: 'Frontend',
    lead: ['React', 'Next.js'],
    rest: ['Astro', 'Tailwind', 'Vite', 'Zustand', 'HTML', 'CSS'],
  },
  {
    name: 'Backend & APIs',
    lead: ['Node.js', 'FastAPI'],
    rest: ['Express', 'Django', 'REST', 'WebSockets', 'Celery'],
  },
  {
    name: 'Data & storage',
    lead: ['PostgreSQL', 'MongoDB'],
    rest: ['Redis', 'Prisma', 'SQLAlchemy', 'S3'],
  },
  {
    name: 'Infrastructure',
    lead: ['Docker', 'Linux'],
    rest: ['Nginx', 'AWS', 'CI/CD', 'GitHub Actions'],
  },
  {
    name: 'Testing & quality',
    lead: ['Playwright'],
    rest: ['Pytest', 'Vitest', 'ESLint', 'axe'],
  },
  {
    name: 'Observability',
    lead: [],
    rest: ['Grafana', 'Sentry', 'Structured logging'],
  },
  {
    name: 'Workflow',
    lead: ['Git'],
    rest: ['APIs', 'Postman', 'Figma', 'pnpm'],
  },
];
