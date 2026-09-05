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

## The lockfile is cross-platform, and `npm install` on a Mac can break it

`npm install` on darwin/arm64 pruned two Linux-only optional entries
(`@emnapi/core`, `@emnapi/wasi-threads` — peer dependencies of
`@napi-rs/wasm-runtime`, which arrived with wrangler). Everything passed
locally: `npm run verify` never runs `npm ci`, and on a Mac the lockfile was
complete. Every Linux `npm ci` then failed identically:

```
npm error `npm ci` can only install packages when your package.json and
npm error package-lock.json are in sync.
npm error Missing: @emnapi/wasi-threads@1.2.3 from lock file
```

GitHub Actions and the Cloudflare builder both failed; nothing local did.

**The fix is a full regeneration**, not another `npm install`:

```bash
rm -rf node_modules package-lock.json && npm install
```

That restores the entries for every platform. Confirm before pushing:

```bash
node -e "const p=require('./package-lock.json').packages; \
  for (const n of ['node_modules/@emnapi/core','node_modules/@emnapi/wasi-threads']) \
    console.log(n in p ? 'ok '+n : 'MISSING '+n)"
```

**There is no local gate for this, deliberately.** `npm ci --dry-run` diffs
against the installed `node_modules` rather than judging the lockfile alone, so
it reports "added 143 packages" for a *correct* lockfile and exits `0` for a
broken one — a gate that cannot fail. CI is the real check and it works: the
`npm ci` step goes red in about 20 seconds. **After pushing a dependency
change, look at the CI run before assuming it is fine.**

Cloudflare's build image pins **npm 10.9.2** with no override variable
(`NODE_VERSION` exists, an npm equivalent does not), so the lockfile has to
satisfy an npm older than whatever ships with the Node in `.nvmrc`.

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

`astro.config.mjs` reads `SITE_URL`, falling back to `http://localhost:4321`.
Canonical URLs, Open Graph URLs and the sitemap are all built from it, so **the
production deploy must set `SITE_URL`** — a placeholder there publishes wrong
URLs to search engines. `scripts/check-site-url.mjs`, which `npm run deploy`
runs first, turns that from a silent mistake into a failed deploy.

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

**Cloudflare Workers, static assets.** Free, unlimited requests for static
assets, custom domains on the free plan with external DNS allowed, and — the
reason it is not GitHub Pages — it serves `_headers`. GitHub Pages cannot set
response headers at all, so the entire CSP would silently not exist there.

Not Pages, though Pages would also work and this runbook used to say so.
Cloudflare's own Pages landing page now opens with *"Are you sure you want to
use Pages? … It is Cloudflare's primary platform for building applications.
Start new projects with Workers."* See D-064.

`wrangler.jsonc` holds the whole deploy configuration, so the build settings
live in the repository rather than in a dashboard someone has to remember to
re-enter. There is no `main` in it: this is an assets-only Worker, no
server-side code, so Cloudflare serves the files from its edge and never
invokes a script.

### Once, to set it up

1. **Find your `workers.dev` subdomain first.** Cloudflare dashboard →
   *Compute (Workers)*; it is shown as `<subdomain>.workers.dev`. The site will
   be at `https://portfolio.<subdomain>.workers.dev` — you need that string in
   step 4, *before* the first build, or the first deploy publishes the wrong
   canonical URLs.
2. **Point the production branch at the finished work.** Cloudflare builds the
   repository's default branch, which is `main`.
3. Dashboard → *Compute (Workers)* → *Create* → *Import a repository* → this
   repository. Connecting a private repository is fine; the Cloudflare GitHub
   App asks for read access.
4. Build settings:
   - Build command: `npm run build` — it also regenerates the CSP hashes into
     `dist/_headers`, so never replace it with `astro build`
   - Deploy command: `npm run deploy` — **not** the default `npx wrangler
     deploy`. The npm script runs `scripts/check-site-url.mjs` first, which
     refuses to ship a build that still thinks it lives on localhost
   - There is no output-directory field: `assets.directory` in `wrangler.jsonc`
     is the answer, and it is already `./dist`
5. Build variables (Settings → *Build* → *Build variables and secrets*):
   - `SITE_URL` = `https://portfolio.<subdomain>.workers.dev` — **this one
     matters.** Without it every canonical link and sitemap entry says
     `http://localhost:4321`. The deploy command fails loudly rather than
     publishing that, so a missing value costs a red build, not a bad site.
   - `NODE_VERSION` is not needed. The build image reads `.nvmrc`.
6. Deploy.

### Later, when there is a custom domain

1. Add it under the Worker's *Domains & Routes*; Cloudflare issues the
   certificate.
2. Change `SITE_URL` to `https://<the domain>`.
3. **Redeploy**, so the new origin is baked into the build. Nothing rebuilds by
   itself when an environment variable changes.

### Deploying by hand

Rarely needed — the Git integration is the normal path — but it works:

```bash
npx wrangler login                                  # once, opens a browser
SITE_URL=https://<the live origin> npm run build
npm run deploy
```

`npm run deploy:preview` uploads a version without promoting it to production.

### Verify the deployment, not the build

```bash
curl -sI https://<domain> | grep -i content-security-policy   # _headers is live
curl -s  https://<domain>/sitemap-0.xml | head -3             # real origin, not localhost
curl -so /dev/null -w '%{http_code}\n' https://<domain>/nope  # 404, from 404.astro
```

Then, in a browser: submit the contact form once and confirm the message
arrives, and check the console for CSP violations — a blocked request appears
there and nowhere else.

### What each host would break

| Host | `_headers` (the CSP) | Notes |
|---|---|---|
| Cloudflare Workers | yes | unlimited static-asset requests; what this uses |
| Cloudflare Pages | yes | works, but Cloudflare steers new projects to Workers |
| Netlify | yes | 100GB bandwidth on the free tier |
| GitHub Pages | **no** | no custom headers at all; the CSP silently disappears |
| Vercel | via `vercel.json` | `_headers` is ignored; it would need translating |

## Monthly rot check

`.github/workflows/rot-check.yml` builds from cold on the first of each month.
A failure there means the toolchain has drifted, not that anything is broken for
visitors — the deployed site is static and keeps working.
