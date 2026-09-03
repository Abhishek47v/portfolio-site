import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The content contract (D-002), enforced rather than remembered.
 *
 * The word budgets below are the lengths the layouts were designed to hold.
 * Content outside them fails the build with the file and field named, which is
 * the whole point: a layout's assumptions are checked, not trusted.
 */
const words = (min: number, max: number) =>
  z.string().refine(
    (v) => {
      const n = v.trim().split(/\s+/).filter(Boolean).length;
      return n >= min && n <= max;
    },
    { message: `must be ${min}–${max} words` },
  );

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: words(1, 4),
    year: z.number().int().min(2015).max(2100),
    role: z.string(),
    oneLine: words(12, 18),
    problem: words(25, 45),
    stack: z.array(z.string()).min(3).max(6),
    links: z
      .object({ repo: z.url().optional(), live: z.url().optional() })
      .default({}),
    /** Path under /shots. Absent means the placeholder frame is drawn instead. */
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    /** Further shots beyond `image`. The control under the plate appears only
     *  when a project actually has more than one, so a project with a single
     *  screenshot shows no affordance at all (D-048). */
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string() }))
      .default([]),
    order: z.number().int().default(99),
    /** True while the copy is placeholder. `npm run content:status` lists these. */
    provisional: z.boolean().default(false),
  }),
});

const roles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/roles' }),
  schema: z.object({
    org: z.string(),
    title: z.string(),
    start: z.string(),
    end: z.string().nullable().default(null),
    oneLine: words(10, 20),
    highlights: z.array(words(12, 24)).min(2).max(4),
    stack: z.array(z.string()).min(3).max(8),
    order: z.number().int().default(99),
    provisional: z.boolean().default(false),
  }),
});

export const collections = { projects, roles };
