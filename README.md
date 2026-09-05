# The Hours

**Live: <https://my-portfolio.iamabhishekverma.workers.dev>**

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
| `src/scripts/` | Ten small behaviours, all additive — remove them and the site still reads and navigates |
| `src/illustration/` | Every asset, as inline SVG that inherits tokens |
| `docs/06-architecture.md` | File layout, boundaries, and the phases it was built in |
| `RUNBOOK.md` | How to run it, regenerate the fonts, and deploy it |

## Status

Built and deployed. The page runs hero → projects → skills → experience →
contact, all of it on bare sky. Twenty-eight tests cover accessibility,
contrast across the scroll range in both themes, the first screen across ten
viewports, keyboard order, and the no-JavaScript path.

Deployed to Cloudflare Workers as static assets, built from `main` on every
push. `wrangler.jsonc` holds the deploy configuration and `public/_headers`
ships the Content-Security-Policy. See `RUNBOOK.md` § Deploy.

Still open: a custom domain, and Lighthouse budgets in CI.

There is one thing on the site that has nothing to do with work. It only
exists after dark.
