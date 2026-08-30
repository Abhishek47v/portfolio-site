# Milestone 7 — Technical Architecture

How the thing is actually put together. Nothing here is built yet.

---

## 1. Rendering model

**Fully static.** `output: 'static'` — every route is HTML at build time. No
adapter, no SSR, no serverless functions, no runtime environment to configure or
keep patched. The deployed artifact is a folder of files.

This is not a simplification of something grander. There is no server-side
concern in the requirements: no auth, no user input, no per-request data, no
personalisation.

## 2. Repository layout

```
portfolio/
├── README.md               what it is, how to run it
├── RUNBOOK.md              exact commands + last-known-good toolchain (D-019)
├── .nvmrc                  pinned Node, matched in CI
├── astro.config.mjs
├── public/
│   ├── _headers            CSP and security headers (D-018)
│   ├── fonts/              self-hosted, subset — no third-party origin
│   ├── audio/              opt-in track + LICENCE.txt (D-010)
│   ├── resume.pdf
│   └── og/                 generated social cards
├── src/
│   ├── pages/
│   │   ├── index.astro         the seven sections
│   │   ├── work/[slug].astro   case-study route (reserved, D-005)
│   │   └── 404.astro
│   ├── layouts/Base.astro      html shell, head, theme pre-paint, skip link
│   ├── sections/               one component per IA entry — seven files
│   ├── components/             Card, Timeline, Chip, ThemeToggle, AudioToggle,
│   │                           Marker, SectionHeading
│   ├── illustration/
│   │   ├── Sky.astro           gradient + orb + arc + stars
│   │   ├── Ridges.astro        three bands
│   │   ├── spots/              mug, plant, plane, books…
│   │   ├── desk/               the single interior
│   │   ├── plates/             per-project diagrams
│   │   └── primitives/         Node, Ring, Link, Callout, Frame
│   ├── styles/
│   │   ├── tokens.css          both palettes, type scale, spacing, motion
│   │   ├── base.css            reset, elements, layout primitives
│   │   └── motion.css          all keyframes + the reduced-motion variant
│   ├── scripts/
│   │   ├── hours.ts            scroll → sky tokens  (~40 lines)
│   │   ├── theme.ts            pre-paint set + toggle + persistence
│   │   ├── reveal.ts           IntersectionObserver stagger
│   │   └── audio.ts            opt-in, lazy fetch, pause on hidden
│   ├── content/
│   │   ├── config.ts           Zod schemas — the content contract
│   │   ├── projects/
│   │   └── roles/
│   └── data/                   now.ts, shelf.ts, principles.ts, site.ts
├── tests/
│   ├── a11y.spec.ts
│   ├── contrast.spec.ts        sampled across scroll positions, both themes
│   ├── nojs.spec.ts
│   └── budget.spec.ts
└── .github/workflows/
    ├── ci.yml                  build · check · test · lighthouse
    └── rot-check.yml           monthly scheduled build (D-019)
```

## 3. Component boundaries

Four layers, and dependencies only ever point downward.

```
pages  →  sections  →  components  →  illustration/primitives
                  ↘  content + data (read-only)
styles: tokens.css is imported once, by the layout. Nothing else defines colour.
scripts: standalone modules. No script imports another. No script imports a component.
```

**Rules that keep it honest:**

- A **section** owns layout and composition. It contains no colour literals and
  no SVG path data.
- An **illustration component** owns SVG. It reads tokens, never defines them,
  and takes no props that change its colours.
- A **script** touches CSS custom properties and class names. It never generates
  markup and never contains copy.
- **Content is read, never written.** Nothing in `src/` mutates content.

The test for whether this is holding: adding a project should touch exactly one
file in `src/content/projects/`, plus one plate if it is featured.

## 4. The content contract, enforced

`src/content/config.ts` is where D-002 stops being a document and becomes a build
failure. Sketch, not final code:

```ts
projects: {
  title:    string, 2–4 words
  year:     number
  role:     string
  oneLine:  string, 12–18 words        // enforced by word count, not char count
  problem:  string, 25–45 words
  stack:    string[], 3–6 items
  links:    { repo?, live?, writeup? }
  status:   'shipped' | 'experiment' | 'archived'
  plate:    string?                    // id of a diagram in illustration/plates
  featured: boolean
}

roles: {
  org, title, start, end: date | null
  oneLine:    string, 10–20 words
  highlights: string[], 2–4 items × 12–24 words
  stack:      string[], 3–8 items
}
```

A summary that runs to forty words fails the build with a message naming the
file and the field. That is the entire point: the layout's assumptions are
checked mechanically instead of being remembered.

`src/data/` holds the smaller, non-collection content — `now`, shelf objects,
principles, site metadata — as typed TypeScript modules.

## 5. The four scripts, in full

Total shipped JavaScript budget: **< 8 KB compressed**.

| Module | Job | Notes |
|---|---|---|
| `theme.ts` | Read stored preference or OS setting, stamp `data-theme` **before first paint**, handle the toggle, persist. | The pre-paint portion is inlined in `<head>` and admitted to the CSP by hash. Everything else defers. |
| ~~`hours.ts`~~ | **Removed (D-027).** The sky is static per theme, so there is no scroll listener at all. |
| `reveal.ts` | IntersectionObserver, adds `.is-in` with a staggered delay, unobserves. | `threshold: 0` — a fractional threshold can strand content taller than the viewport (D-028). Under reduced motion it reveals everything and never observes. |
| `liveliness.ts` | Section handoff marker, and pointer-tracked light on cards. | Both absent under reduced motion; the light is also absent on touch. |
| `audio.ts` | Opt-in toggle, **lazy fetch on first activation**, persist preference, pause on `visibilitychange`. | The audio file is never in the initial payload. |

No module imports another. Any one can be deleted and the site still works —
degraded, but correct. That is the property that makes it maintainable.

## 6. Illustration architecture

Every asset is an Astro component emitting inline SVG. Inline is not a
preference — it is required, because an `<img>` cannot inherit a CSS custom
property, and token inheritance is the entire day/night mechanism (D-001, D-003).

- Assets use `fill="var(--role)"` and `stroke="var(--role)"`. **No literal colour
  appears in any asset**, and that is checkable with a grep in CI.
- Shared geometry lives in `primitives/`. Plates compose primitives; they do not
  redraw them.
- `vector-effect: non-scaling-stroke` keeps the 1.5px line honest at every size.
- Every plate takes a required `description` prop. A plate without one fails the
  build, so the accessibility requirement cannot be quietly skipped.

## 7. Styling architecture

Three files, one direction of flow.

1. `tokens.css` — the two palettes as semantic roles, the type scale, spacing,
   radii, motion durations and easings. Imported once, by the layout.
2. `base.css` — reset, element defaults, layout primitives (`.wrap`, `.veil`,
   grid helpers).
3. `motion.css` — every keyframe, plus one `prefers-reduced-motion` block that
   defines the reduced variant in a single place rather than scattered overrides.

Component styles are scoped by Astro. **No component defines a colour**; it
references a role. Enforced by a CI grep for hex literals outside `tokens.css`.

## 8. Routing and navigation

- `/` — the seven sections, with real anchor IDs. Anchors work without JS.
- `/work/<slug>` — generated from the projects collection for entries that have a
  write-up. Zero routes at launch is a valid state.
- `/404`.
- Cross-document view transitions between `/` and `/work/*` so the sky and header
  persist (D-023). Firefox gets an ordinary navigation, which is correct and
  needs no fallback code.

## 9. Build, CI and deploy

**Build:** `astro build` → static files. Fonts subset at build; SVG minified;
`resume.pdf` copied as-is.

**CI (`ci.yml`), on every push:**

1. `npm ci` with the pinned Node from `.nvmrc`
2. `astro check` — types and content schemas
3. grep gate — no hex literals outside `tokens.css`, no plate without a description
4. `astro build`
5. Playwright: a11y, contrast across scroll positions in both themes, no-JS
6. Lighthouse CI against the §10 budgets — **failing budgets fail the build**

**Rot check (`rot-check.yml`), monthly on a schedule:** `npm ci && astro build`
on an untouched repository. Turns dependency rot into a red email within a month
instead of an archaeology session in two years (D-019).

**Deploy:** Cloudflare Pages, connected to `main`. Preview URL per branch.
`public/_headers` ships the CSP. Custom domain added when purchased; until then
the `.pages.dev` URL is the site.

## 10. Implementation order

Riskiest thing first, so a failure happens in week one rather than week six.

| Phase | What | Why here |
|---|---|---|
| 0 | Repo, tokens, base layout, theme with pre-paint | Nothing works without the token layer |
| **1** | **The sky engine, ridges, and the contrast test** | **The one genuinely risky idea. If text over a moving sky cannot be made legible, the concept changes — and that must be discovered now.** |
| 2 | The seven sections with schema-validated placeholder content | Proves the content contract before assets exist |
| 3 | Illustration: ridges, spots, desk, shelf, avatar placeholder | The long pole for effort |
| 4 | Liveliness layer (D-022) | Additive; needs the sections to exist |
| 5 | Plates, project cards, `/work/<slug>` | Depth |
| 6 | a11y + performance gates in CI | Locks in what phases 1–5 achieved |
| 7 | Real content | The half nobody else can write |
| 8 | Deploy, domain, OSS readiness | Ship |

**Phase 1 is a checkpoint, not a step.** If the contrast test cannot pass across
the full scroll range in both themes, the full-bleed sky is reconsidered before
anything is built on top of it.
