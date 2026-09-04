# The Hours

Personal portfolio for Abhishek Verma. A static site whose organising idea is
the passage of time: the sky is the page's ground, and the theme chooses which
hours you are visiting — light runs first light to last light, dark runs dusk
to before dawn. The sky itself is static per theme; day and night are two
authored palettes rather than a scroll animation.

Zero runtime dependencies ship to the browser — no framework runtime, no
animation library, no third-party requests.

## Run it

```bash
nvm use          # or match the version in .nvmrc
npm ci
npm run dev      # http://localhost:4321
```

## Verify it

```bash
npm run verify   # types + tokens gate + build + tests
```

Individually:

| Command | What it proves |
|---|---|
| `npm run check` | Types and content schemas are valid |
| `npm run gate:tokens` | No colour literal exists outside `src/styles/tokens.css` |
| `npm run build` | Static output builds, and the CSP hashes regenerate |
| `npm test` | Accessibility, contrast across the whole scroll range in both themes, and that the site works with JavaScript off |

First run of the tests needs a browser: `npm run test:install`.

## Where things are

| Path | What |
|---|---|
| `src/styles/tokens.css` | **Every colour in the project**, including the four hour stops per theme. Retuning the whole day happens here and nowhere else. |
| `src/scripts/hours.ts` | Maps scroll position onto the arc of a day |
| `src/illustration/` | Every asset, as inline SVG that inherits tokens |
| `docs/` | The full design record — brief, research, concepts, decisions |
| `docs/07-master-spec.md` | The specification this was built from |

## Status

Phase 1 of 8 complete. The home page is a checkpoint build: its job is to give
the sky a full scroll range with text on it, so contrast could be proven before
anything was built on top. The seven real sections arrive in Phase 2.

See `docs/06-architecture.md` §10 for the phase plan.
