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

## The contact form

The site is static and cannot send mail, so the form posts to a provider that
does. **Which inbox it lands in is configured at the provider, never in this
repository** — the address would otherwise be in the page source of a public
site for every scraper to read (D-054).

Nothing renders as broken while this is unset: the submit is disabled at build
time, the page says *Not connected yet*, `form-action` stays shut in the CSP,
and `tests/contact-form.spec.ts` skips.

### Web3Forms — the recommended one

250 submissions a month, free, and **no account to create**: you give them an
address, they mail you a key.

1. Go to <https://web3forms.com>, enter the destination address, and collect the
   access key from that inbox.
2. Put both values in `src/data/site.ts`:

   ```ts
   contact: {
     endpoint: 'https://api.web3forms.com/submit',
     fields: { access_key: 'the-key-they-mailed-you' },
   },
   ```

3. `npm run build && npm test`. The build prints
   `form origin https://api.web3forms.com` — that is the CSP being opened for
   exactly that host and nothing else — and the two form tests stop skipping.

The access key is public by design and it is not the address: it identifies the
form, and the inbox is bound to it at Web3Forms. Losing it costs you spam, not
your mailbox.

### Formspree — the alternative

50 submissions a month and an account, but nothing at all in the page source:
the form id is the endpoint.

```ts
contact: { endpoint: 'https://formspree.io/f/<id>', fields: {} },
```

### What is already handled

- **A subject and a honeypot**, named the way Web3Forms names them: `subject`
  and `botcheck`. Formspree calls the same two `_subject` and `_gotcha`, so
  switching means renaming them in `Contact.astro`. They are not both shipped:
  Web3Forms copies every field it receives into the email, so the unused pair
  arrived as a duplicated subject line and a blank row in every message.
- **Spam.** A hidden honeypot both providers refuse a submission for; their own
  filtering behind that.
- **No JavaScript.** The form is a real `POST`, so it works with scripts off —
  the visitor lands on the provider's thank-you page instead of staying put.
- **A refusal is not a send.** These providers answer `200` with
  `{ success: false }`; the status line reports that as a failure and keeps
  what was typed.
- **The CSP follows the endpoint.** `scripts/csp-headers.mjs` reads it at build
  time and opens `connect-src` and `form-action` to that origin only. It fails
  the build on a malformed URL.

### If mail stops arriving

Check the provider's dashboard first — the free tiers cap at 250 (Web3Forms) and
50 (Formspree) submissions a month and simply stop. Then check the browser
console for a CSP violation, which means the endpoint changed origin without a
rebuild.

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
