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

Regenerated from the repository as built (D-063). The version this replaced was
the milestone plan and had drifted badly — it listed four scripts that no longer
exist, a case-study route that was never built, and three illustration
directories that were never created.

```
portfolio/
├── README.md               what it is, how to run it
├── RUNBOOK.md              exact commands, toolchain, fonts, CSP, the form
├── .nvmrc                  pinned Node, matched in CI
├── astro.config.mjs        static output, no adapter, dev toolbar off
├── playwright.config.ts    port 4331, no reuse, serves dist (D-045)
├── scripts/                build and gate tooling, plain Node
│   ├── check-tokens.mjs    fails the build on a colour literal (D-013)
│   ├── csp-headers.mjs     inline-script hashes + form origin → dist/_headers
│   ├── content-status.mjs  lists everything still marked PROVISIONAL
│   └── serve.mjs           dependency-free static server for dist
├── public/
│   ├── _headers            CSP template with two placeholders
│   ├── theme-init.js       stamps data-theme before first paint (D-018)
│   └── fonts/              four faces, self-hosted, subset
├── src/
│   ├── pages/
│   │   ├── index.astro     the section order, and the reasoning for it
│   │   └── 404.astro
│   ├── layouts/Base.astro  html shell, head, bar, footer, the one script tag
│   ├── sections/           Hero · Stats · HeroActions · Work · Skills ·
│   │                       Experience · Contact
│   ├── components/         Nav · Social · ThemeToggle · AudioToggle ·
│   │                       OffTheClock
│   ├── illustration/       Sky · Ridges · Character · ProjectShot
│   ├── styles/
│   │   ├── tokens.css      both palettes, type scale, spacing, motion
│   │   ├── fonts.css       the four @font-face rules
│   │   ├── base.css        reset, elements, layout primitives, .rm-cloud
│   │   └── motion.css      all keyframes + the reduced-motion variant
│   ├── scripts/            behaviour — see §5
│   ├── content.config.ts   Zod schemas with word budgets — the contract
│   ├── content/
│   │   ├── projects/       three
│   │   └── roles/          three
│   ├── data/               site.ts · stats.ts · skills.ts · play.ts
│   └── lib/                assets.ts (does this link exist?) · format.ts
├── tests/                  eight specs — see §9
└── .github/workflows/
    ├── ci.yml              check · gate:tokens · build · test
    └── rot-check.yml       monthly scheduled build (D-019)
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

## 5. The scripts, in full

One bundle, one entry: `scripts/main.ts` imports every behaviour and calls it.
Separate `<script>` blocks would mean a bundle and a CSP hash each, on every
build, for behaviour that always runs together (D-035). `ThemeToggle.astro` is
the single exception and keeps its own, because it has to agree with
`public/theme-init.js`, which runs before first paint.

| Module | Job |
|---|---|
| `reveal.ts` | IntersectionObserver stagger; adds `.is-in`, then unobserves. `threshold: 0` — a fractional threshold strands content taller than the viewport (D-028). Under reduced motion it reveals everything and observes nothing. |
| `nav.ts` | The header's active shortcut. The current section is the last one whose top has passed `scroll-margin-top`, read off the CSS at runtime (D-057). |
| `roadmap.ts` | Draws the Experience rail *after* layout, threading a spline through the blocks' measured anchors. Redraws on resize and after web fonts land, debounced once for both (D-063). |
| `shelf.ts` | Work's state only: which leaf is open, which books are off the shelf, what the reading slot says. Creates no elements (D-047). |
| `open-line.ts` | The Contact thread. Starts where the roadmap's `now` marker ended, becomes the address's rule, and hangs its endpoint below when there is no room beside it (D-058, D-059). |
| `contact-form.ts` | Background POST to the form provider, so the reader stays on the page. Marks the form `data-enhanced` when it binds. Reads the provider's `success` field, not just the status code (D-060). |
| `off-the-clock.ts` | The easter egg behind the moon. Resolves a click on the orb by geometry, because the orb is `pointer-events: none` behind every section (D-061). Night only (D-062). |
| `rotator.ts` | The typed role line. Self-rescheduling timeout, four phases, four durations. Absent under reduced motion — the first role is already in the markup. |
| `character.ts` | The figure sleeps off screen and wakes when observed. Awake is the markup default, so this only ever *adds* the sleeping state. |

Deleted along the way: `hours.ts` (D-027, the sky is static per theme, so there
is no scroll listener), `timeline.ts` (D-046), and `pointer-light.ts` (D-063 —
nothing has carried `data-lit` since Work became the book and shelf).

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
