# Runbook

Operational notes. Update the dates when something is re-verified.

## Toolchain last known good

| | Version | Verified |
|---|---|---|
| Node | 24.10.0 (`.nvmrc`) | 2026-08-30 |
| npm | 11.6.0 | 2026-08-30 |
| Astro | 7.2.9 | 2026-08-30 |
| @astrojs/check + typescript | required by `npm run check` | 2026-08-30 |
| Playwright | 1.62.1 | 2026-08-30 |

If `npm ci` fails after a long gap, that is the expected failure mode (D-019).
Start by matching the Node version above, then bump Astro one major at a time.

## Commands

```bash
npm run dev        # develop
npm run verify     # everything CI runs
npm run serve      # foreground static server on dist (tests use this)
npm run build      # build + regenerate CSP hashes
```

`astro preview` daemonises and will look like a crashed process to any tool
waiting on it. Use `npm run serve` instead. To stop a stray daemon:
`npx astro preview stop`.

## Fonts

Self-hosted, latin subset only, no third-party origin (D-018). All three
families are SIL Open Font License 1.1.

| File | Axes | Size | Used by |
|---|---|---|---|
| `karla-300600.woff2` | `wght` 300–600 | 31 KB | body text |
| `karla-300600-italic.woff2` | `wght` 300–600, italic | 32 KB | Experience role titles (D-055) |
| `instrument-serif-400.woff2` | static 400 | 15 KB | headings |
| `instrument-serif-400-italic.woff2` | static 400, italic | 15 KB | **nothing — see below** |
| `ibm-plex-mono-400.woff2` | static 400 | 10 KB | labels, chips, dates |

Fraunces was replaced by Instrument Serif in D-040 and its file is gone; this
table said otherwise for some time.

**`instrument-serif-400-italic.woff2` is declared in `fonts.css` and used by
nothing.** D-040 removed the only italic it was for. `font-display: swap` means
a declared-but-unused face is never fetched, so it costs a reader nothing — but
it is 15 KB in the repo and in every deploy. Delete both the file and its
`@font-face` when someone is sure nothing wants it back.

**The role titles' italic is a real face, not a skew.** A synthesised oblique
slants the roman outlines; the letterforms never change shape. If you ever drop
`karla-300600-italic.woff2`, the titles will still *look* italic and will
quietly be a fake (D-055).

To regenerate: request the families from the Google Fonts CSS2 API with a modern
browser user-agent, keep only the `U+0000-00FF` latin blocks, download each
woff2 into `public/fonts/`, and rewrite the `src` URLs in `src/styles/fonts.css`.

## Content Security Policy

`public/_headers` is a template containing `{{SCRIPT_HASHES}}`.
`scripts/csp-headers.mjs` runs after every build, hashes the inline scripts Astro
emitted, and writes the real `dist/_headers`.

`style-src` keeps `'unsafe-inline'`. Astro inlines stylesheets, and the star
field uses `style` attributes, which hashes cannot cover. On a static site with
no user input the residual risk is low; revisit if user-supplied content is ever
rendered.

## The site origin

`astro.config.mjs` reads `SITE_URL`, falling back to `CF_PAGES_URL` and then to
`http://localhost:4321`. Canonical URLs, Open Graph URLs and the sitemap are all
built from it, so **the production deploy must set `SITE_URL`** — a placeholder
there publishes wrong URLs to search engines.

## Optional assets

Two things the site links to only when they exist. `src/lib/assets.ts` checks
`public/` at build time, so there is no flag to remember:

| Drop in | What appears |
|---|---|
| `public/resume.pdf` | Résumé link in the header, the hero and the contact list |
| `public/audio/ambient.mp3` | The audio control (record the licence below first) |

No file means no link and no shipped JavaScript for it — the audio component is
not rendered at all, so its script is never bundled.

## Deploy

Cloudflare Pages, connected to `main`.

- Build command: `npm run build`
- Output directory: `dist`
- Node version: from `.nvmrc`

`dist/_headers` ships the CSP. Set `site` in `astro.config.mjs` to the real
origin when the domain is bought — the canonical URL and sitemap depend on it.

## Monthly rot check

`.github/workflows/rot-check.yml` builds from cold on the first of each month.
A failure there means the toolchain has drifted, not that anything is broken for
visitors — the deployed site is static and keeps working.
