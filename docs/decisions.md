# Decision Register

Format per decision: Decision / Options / Chosen / Reason / Trade-offs /
Consequences / Status. Superseded decisions stay, marked, with the reason.

Status values: `ACCEPTED` · `PROPOSED` (awaiting owner) · `OPEN` · `SUPERSEDED`

---

## D-001 — Illustration is authored as code

**Options:** hand-drawn by owner · commissioned illustrator · AI-generated raster,
hand-cleaned · code-authored SVG/CSS system · avoid bespoke art entirely.
**Chosen:** code-authored SVG + CSS, designed and written in-repo.
**Reason:** removes the only non-code dependency in the project. Assets become
diffable text, theme by token rather than needing duplicate files, scale to any
viewport without raster sets, and cost kilobytes. Style consistency is enforced by
shared primitives rather than by an artist's memory.
**Trade-offs:** rules out painterly, textured, or highly organic styles. The visual
language must be geometric/flat-to-soft with disciplined line weight and a limited
palette. Complex scenes are slower to author than to draw.
**Consequences:** the illustration system needs documented primitives (shapes, line
weight, palette roles, perspective) so future assets stay coherent. Every colour in
every asset must be a token, never a literal.
**Status:** ACCEPTED (owner, 2026-08-30)

## D-002 — Design against a content contract; real content lands later

**Options:** gather all content first, then design · design with lorem ipsum ·
define a typed content model with length constraints and realistic placeholder.
**Chosen:** typed content model, realistic worst-case placeholder.
**Reason:** owner wants to build before writing. The risk of that order is layouts
that only work at the length the designer imagined. Constraining each field
(min/max words) makes the layout robust to the real text before it exists.
**Trade-offs:** some design decisions get revisited when real content is unusually
long or short. Accepted.
**Consequences:** the content model is a deliverable of Milestone 5, not an
implementation detail. Adding a project must mean editing data only.
**Status:** ACCEPTED (owner, 2026-08-30)

## D-003 — Both themes are first-class designs

**Options:** light-only · dark-only · light with a mechanical dark inversion ·
two authored themes with a designed transition.
**Chosen:** two authored themes — day (light sky blue) and night (night sky).
**Reason:** owner's stated direction, and it fits an illustrated world where the
theme is diegetic (the world's time of day) rather than a UI setting. Avoids the
"dark background, inverted colours" result the brief explicitly rejects.
**Trade-offs:** every asset needs checking in both themes; contrast must be
verified twice; some elements exist in only one theme (stars, sun).
**Consequences:** palette is defined as semantic tokens with two value sets.
Theme-only elements are a documented concept in the illustration system.
**Status:** ACCEPTED (owner, 2026-08-30)

## D-004 — Illustrated avatar, not a photograph, and never an AI portrait

**Options:** AI-generated photoreal portrait · real photograph · illustrated avatar
· avatar plus one real photo.
**Chosen:** illustrated avatar in the site's visual language. A real photograph may
be added later in exactly one place. AI-generated photoreal portrait rejected.
**Reason:** a portfolio's function is to be trusted; a synthetic face that does not
match the owner's other public profiles undermines that for no gain. A photoreal
portrait also collides stylistically with a flat vector system.
**Trade-offs:** an illustrated avatar is less immediately personal than a photo.
Mitigated by refining it from a real reference photo.
**Consequences:** avatar starts as a generic placeholder built from the system's
primitives and is refined later. Reference photo is an input, not an asset.
**Status:** ACCEPTED (owner, 2026-08-30)

## D-005 — Information architecture: one primary page, real routes for depth

**Options:** pure single-page scroll · fully multi-page · hybrid — one primary
scrolling page plus addressable routes for anything deserving its own URL.
**Chosen:** hybrid.
**Reason:** a single page gives the continuous illustrated experience and suits the
current content volume. Pure single-page costs shareable per-project URLs, per-page
metadata and social previews, and puts a ceiling on depth the owner will hit as
projects accumulate. Retrofitting routing after the fact is disproportionately
painful; reserving the capability now costs almost nothing.
**Trade-offs:** slightly more routing and metadata work up front for capability not
used on day one.
**Consequences:** launch ships the single page with cards linking out to GitHub and
live demos. Internal case-study routes are additive with no restructuring. Section
anchors must be real URLs and must work without JavaScript.
**Status:** ACCEPTED (owner, 2026-08-30)

## D-006 — No implementation before an approved specification

**Chosen:** discovery → research → concepts → experience design → technical
research → architecture → specification → explicit approval → build.
**Reason:** owner's explicit instruction, restated twice.
**Consequences:** no package manifest, framework scaffold, component, route, or
stylesheet is created before Milestone 9 approval. Documentation and static design
artifacts are the only outputs until then.
**Status:** ACCEPTED (owner, 2026-08-30)

## D-007 — No third-party IP in the visual language

**Chosen:** gaming and anime influence expressed only through original composition,
colour, and light. No recognisable characters, logos, or copied artwork.
**Reason:** a public portfolio carrying someone else's IP is a legal and
credibility liability, and borrowed art contradicts D-001's premise.
**Status:** ACCEPTED

## D-008 — The sky is the whole page, not a view through a window

**Options:** illustrated scene contained in a window frame (original Concept A) ·
full-bleed sky as the page's ground, with a persistent horizon.
**Chosen:** full-bleed. The concept is renamed **The Hours**; "The Window" no
longer describes it.
**Reason:** owner's direction. It is also the stronger idea — a framed scene makes
the world an *object on* the page, while a full-bleed sky makes the page *be* the
world. The time-of-day conceit lands harder when it surrounds the reader.
**Trade-offs:** text legibility becomes a real engineering problem rather than a
non-issue. Mitigated, not waved away — see consequences.
**Consequences:**
- Palette must be engineered so the reading band is always the lowest-chroma part
  of the sky. Colour intensity lives above and below the text, never behind it.
- Body copy always sits on a token-defined surface with a guaranteed contrast
  ratio; it never sits directly on a gradient.
- Contrast must be verified at every scroll position in both themes, not just at
  the top of the page. This becomes a test, not a hope.
- The desk/room is not lost — it becomes one scene at the "how I work" moment
  instead of the frame for everything.
- Asset count *drops*: a sky gradient, three horizon bands, and spot objects are
  fewer assets than a room interior.
**Status:** ACCEPTED (owner, 2026-08-30)

## D-009 — No modal dialogs

**Options:** project detail in a modal overlay · dedicated routes · inline
expansion · a mix.
**Chosen:** zero modals. Depth goes to a route; small disclosures expand inline.
**Reason:** a modal has no URL, so nothing inside it can be linked or shared; it
breaks the browser back button, which is the control most people reach for; it
needs focus trapping and restoration to be accessible at all; and on a phone it
becomes a full screen that lies about being an overlay. It also costs JavaScript
for something routing already does correctly and for free.
**Trade-offs:** a route feels heavier than an overlay for very small content. That
is what inline expansion is for.
**Consequences:** the only permitted overlay is a mobile navigation sheet, and the
header should be compact enough not to need one. Inline disclosure uses native
`<details>`, which needs no JavaScript and is accessible by default.
**Status:** ACCEPTED

## D-010 — Audio is opt-in, remembered, and never autoplays

**Options:** autoplaying ambient loop · opt-in ambient loop · audio as content
(discrete players attached to specific things) · no audio.
**Chosen:** opt-in ambient loop, off by default, with the door left open to audio
as content later.
**Reason:** owner wants music. Autoplay is refused outright — browsers block it,
and it is the single most-complained-about pattern on personal sites because it
ambushes people in offices, classrooms and public transport. Opt-in keeps the
thing the owner wants while removing everything that makes visitors hostile to it.
**Notable:** the reference site the owner cited does *not* use background music. It
uses two explicit players with visible durations — audio as content, not
atmosphere. That is the better pattern and is recorded here as the likely evolution.
**Trade-offs:** most visitors will never turn it on. Accepted — the alternative
costs goodwill from everyone to serve a minority.
**Consequences:**
- One small persistent control, discoverable but not demanding.
- Preference persisted; the site does not re-ask on every page.
- Audio pauses when the tab is hidden.
- The audio file is fetched **only after opt-in** — never in the initial payload.
- **Licensing is a hard requirement.** A public site playing a copyrighted track is
  a real liability. The track must be original, licensed, or clearly permissive,
  and the licence recorded in the repo.
**Status:** ACCEPTED

## D-011 — The influence is stillness, not iconography

**Chosen:** the gaming and anime influence enters through *composition, palette and
pacing* — never through characters, references, or recognisable imagery.
**Reason:** the owner's stated taste is slow, contemplative anime (Frieren named)
and story-driven games. What those share is a visual grammar: wide establishing
shots held longer than plot requires, muted natural palettes, soft diffuse light,
large empty space, landscape carrying emotion, and time itself as the subject. That
grammar is not ownable by anyone and maps precisely onto a site whose organising
idea is time passing.
**Consequences — this becomes concrete design constraint, not mood:**
- **Palette:** desaturated and natural. Dusty sky blue, sage, warm sand, muted rose
  at dusk. Low chroma throughout. This also satisfies the owner's stated dislike of
  sites with too many colours.
- **Composition:** wide, horizon-anchored, with far more empty sky than content.
- **Pacing:** long easings, slow ambient motion, nothing bouncy or elastic.
- **Typography:** generous leading and unhurried measure.
- **Restraint:** few interactions, which matches the owner's stated dislike of
  interaction-dense sites.
**Status:** ACCEPTED

## D-012 — Framework: Astro 7

**Options:** no framework · Eleventy · Hugo · Astro · Next.js / Nuxt / SvelteKit.
**Chosen:** Astro 7 (7.2.9 at build time; the research pass had recorded 6, which was already superseded).
**Reason:** one decisive argument. Content collections validate content against a
schema at build time, which converts the content contract in D-002 from a
document someone must remember into a build failure. No other candidate enforces
it. Zero client JS by default, inline SVG components, per-route metadata and
sitemaps are table stakes that Eleventy also provides.
**Trade-offs:** annual major versions with migration work; content collections
have been reorganised more than once; a Node dependency tree is the realistic
long-term failure mode. Cloudflare acquired the project and hired the core team
in January 2026 — MIT licence retained, but a single-vendor steward is recorded.
**Rejected:** hand-written HTML (adding a project would edit markup and each
route would be copy-pasted); app frameworks (client runtime for a site needing
~40 lines of JS); Hugo (best longevity, worst ergonomics for SVG components and
no typed content); Eleventy (genuinely close — loses only on typed schemas).
**Consequences:** dependency-rot mitigation is mandatory, not optional — see
D-019. Built output is plain HTML/CSS/SVG, so the site survives its own build.
**Status:** ACCEPTED

## D-013 — Styling: plain CSS with custom properties

**Options:** Tailwind · Sass · CSS modules · CSS-in-JS · hand-written CSS.
**Chosen:** hand-written CSS, organised tokens → primitives → components.
**Reason:** the illustration system depends on SVG inheriting CSS custom
properties (`fill: var(--ridge-mid)`). That is native custom-property behaviour
and it is the mechanism the entire day/night system rests on. Tailwind works
against it — themed SVG needs arbitrary-value escapes and the theme system fights
the config. Sass adds a compiler for features CSS now has natively.
**Trade-offs:** no utility ergonomics; naming discipline is on us.
**Status:** ACCEPTED

## D-014 — Animation: CSS plus ~40 lines of vanilla JavaScript

**Options:** CSS scroll-driven animations (`animation-timeline`) · GSAP ·
Motion · Web Animations API · a small scroll handler.
**Chosen:** a `requestAnimationFrame`-throttled scroll handler for the sky;
everything else in CSS. `@property` used for the theme cross-fade.
**Reason (verified 2026-08-30):** CSS scroll-driven animations are **Limited
availability, not Baseline** — Chrome/Edge 115 (Jul 2023), Safari 26 (Sep 2025),
**Firefox not shipped by default**, blocking Baseline since September 2025.
Adopting the CSS timeline would not remove the JavaScript, because Firefox would
still need it — it would add a *second* implementation of one effect. `@property`
by contrast reached Baseline on 9 July 2024 and is used freely.
**Consequences:** no animation library is needed; once the sky is arithmetic,
every other motion in the spec is a CSS transition or keyframe. Zero runtime
dependencies ship to the browser. Revisit when Firefox ships scroll timelines —
that single event turns this into a real simplification.
**Status:** ACCEPTED

## D-015 — Content: typed collections, no CMS

**Chosen:** Astro content collections with Zod schemas for projects and roles;
typed TS modules for `now`, shelf and principles; Markdown for case-study prose
when those routes arrive.
**Rejected:** a CMS — the author is the only editor, volume is low, and it would
add an account, an API key, a network dependency and a vendor to a problem that
is five files in a repo. Reassess only if editing from a phone becomes a real
need, in which case Keystatic (git-backed, serverless) is the candidate.
**Rejected:** Markdown frontmatter for structured fields — weaker than a schema
and invites drift.
**Status:** ACCEPTED

## D-016 — Hosting: Cloudflare Pages

**Options:** Cloudflare Pages · Netlify · Vercel · GitHub Pages.
**Chosen:** Cloudflare Pages.
**Reason:** unlimited bandwidth on the free tier where others meter it; a very
large PoP footprint including India; and `_headers` / `_redirects` as committed
files, so the CSP is reviewable in a diff rather than clicked into a dashboard.
That format is shared with Netlify, so lock-in is near zero.
**Rejected:** GitHub Pages — no custom header control, therefore no CSP, which is
disqualifying under D-018. Vercel — free tier is hobby-only, no commercial use.
**Status:** ACCEPTED

## D-017 — Analytics: none at launch

**Chosen:** ship with no analytics. If curiosity wins later, Cloudflare Web
Analytics.
**Reason:** the honest test is whether the numbers would change a decision. For a
portfolio they would not.
**Noted (fact):** Cloudflare Web Analytics is cookieless and needs no consent
banner, but still collects IP address and user agent, which are personal data
under GDPR. "No banner" is a defensible position, not an exemption, and would
need a short privacy note.
**Status:** ACCEPTED

## D-018 — Security headers and no third-party origins

**Chosen:** restrictive CSP via `_headers` — `default-src 'self'`, no third-party
origins at all. Fonts are self-hosted. The only inline script is the pre-paint
theme setter, admitted by hash. Plus `nosniff`, `Referrer-Policy`,
`X-Frame-Options: DENY`, conservative `Permissions-Policy`.
**Reason:** self-hosting fonts removes a request to a third party and an entire
class of privacy question, at the cost of a few kilobytes we can afford. A static
site with no server, no user input and no secrets has almost no attack surface —
the headers protect what remains.
**Consequences:** no embedded third-party widgets, ever, without revisiting this.
**Status:** ACCEPTED

## D-019 — Dependency-rot mitigation is part of the build

**Chosen:** `.nvmrc` pinning Node (same version in CI) · committed lockfile,
`npm ci` only · a **monthly scheduled CI build** on an untouched repository ·
`docs/RUNBOOK.md` recording exact commands and last-known-good versions with a
date.
**Reason:** the realistic failure mode for this project is not traffic or
performance — it is that after eighteen months of neglect the build no longer
runs. A scheduled build turns that into a red email in a month instead of an
archaeology session in two years.
**Consequences:** the output is plain static HTML/CSS/SVG, so even total
toolchain failure leaves a maintainable site. The build is a convenience, not a
hostage.
**Status:** ACCEPTED

## D-020 — Testing: visual and behavioural, not unit

**Chosen:** Playwright + axe for accessibility and for **contrast sampled at
multiple scroll positions in both themes**; Lighthouse CI with hard budgets;
`astro check` and schema validation for content; a Playwright run with
JavaScript disabled. No unit test framework at launch.
**Reason:** there is almost no logic to unit test. What can actually break here
is visual, and the contrast-over-a-moving-sky risk is one this design created —
so it gets an automated test rather than a promise.
**Status:** ACCEPTED

## D-021 — Deferred content decisions, taken by default

Owner approved the design without answering three open questions; defaults taken
and recorded so they can be reversed cheaply:
- **Work before Experience** on the page, with a permanent résumé link in the
  header (keeps the 45-second test passing either way).
- **Résumé PDF included** as a downloadable file.
- **The desk scene kept**, as the single interior, at "How I work".
**Status:** ACCEPTED BY DEFAULT — reversible on request.

## D-022 — The liveliness layer: quiet, but not static

**Context:** owner approved the background and palette, then asked for "some
dynamic feel — in fonts, scroll flow, texts".
**The distinction that resolves it:** *playfulness* stays at 3/10 — nothing winks,
nothing is cute. What increases is *liveliness*: the sense that the page settles
and breathes rather than being stamped onto the screen. These are different dials
and were being conflated.
**Chosen — seven moves, each with a reduced-motion variant:**
1. **Variable-weight settling.** Headings arrive lighter and resolve to final
   weight over ~700ms. Fraunces is variable, so this is one file and one
   animatable property; the letterforms genuinely redraw rather than fading.
2. **Optical sizing wired to rendered size.** Large text is drawn differently from
   body text (`opsz`), which most sites ship a variable font and never enable.
3. **Staggered block reveal.** 10px rise, 55ms apart, once. **Line level, never
   character level** — per-character animation is the gimmicky version and it
   corrupts screen-reader output.
4. **The sun is the progress indicator.** Its position on the arc is the reader's
   position in the page. No separate UI element — the mechanic does both jobs.
5. **Layered depth.** Content 1.0, spot illustrations 0.94, ridges 0.88, sky
   fixed. Capped at 12px so it reads as depth, not as a parallax demonstration.
6. **Section handoff marker.** A small bottom-left label that cross-fades between
   sections. Momentum and orientation from one element.
7. **Light on the surface.** Cards catch a faint warm highlight tracking the
   pointer. Absent on touch, absent under reduced motion.
**Trade-offs:** roughly 2 KB more JavaScript. The performance budget is revised
from < 6 KB to < 8 KB rather than pretending the addition was free.
**Rejected:** character-by-character text animation, scroll-snapping between
sections (it takes control of scrolling away from the reader), text that
scrambles or types itself, and any transform beyond the 12px cap.
**Status:** ACCEPTED

## D-023 — Cross-document view transitions as pure enhancement

**Chosen:** use cross-document view transitions for `/work/<slug>` navigation so
the sky and header persist and a project page feels like moving *within* the
world rather than loading a new one.
**Fact (verified 2026-08-30):** same-document view transitions are **Baseline
newly available** (Chrome 111+, Firefox 133+, Safari 18+). **Cross-document
transitions are not Baseline** — Chrome 126+ and Safari 18.2+ ship them; Firefox
does not yet, though it is an Interop 2026 focus area.
**Why this is accepted while scroll-driven animations were rejected (D-014) —
the asymmetry is the point:** without scroll timelines, Firefox gets a *broken
core mechanic*, so a fallback must be written and maintained, giving two
implementations of one effect. Without cross-document view transitions, Firefox
gets *an ordinary page navigation* — correct, complete, and requiring no fallback
code at all. One is a load-bearing feature with a hole in it; the other is
decoration that degrades to nothing. The rule: **enhance with non-Baseline
features only where absence costs nothing to implement around.**
**Status:** ACCEPTED

## D-024 — CSP hashes are generated from the build, not maintained by hand

**Problem found during Phase 1:** Astro inlines small module scripts into the
HTML. The CSP chosen in D-018 is `script-src 'self'`, which would have blocked
them — the site would have broken under its own security header. Astro offers no
option to force scripts external (`build.inlineStylesheets` covers CSS only).
**Options:** add `'unsafe-inline'` · maintain hashes by hand · move all scripts
to `public/` as plain JS, losing TypeScript and bundling · generate the hashes
from the build output.
**Chosen:** generate them. `scripts/csp-headers.mjs` runs after every build,
hashes the inline scripts Astro actually emitted, and writes `dist/_headers`
from a template in `public/_headers`.
**Reason:** keeps the strict policy with nothing to remember. Edit a script and
the hash follows. `'unsafe-inline'` would have discarded most of the value of
having a CSP at all.
**Residual:** `style-src` retains `'unsafe-inline'`. Astro inlines stylesheets,
and the star field uses `style` attributes, which hashes cannot cover. On a
static site with no user input the risk is low; revisit if user-supplied content
is ever rendered.
**Status:** ACCEPTED — implemented

## D-025 — Ink and veil retuned after the contrast gate failed

**What happened:** the Phase 1 contrast test — the one this design exists to
justify — failed on first honest run. `--ink-faint`, used for small uppercase
labels, measured **3.83:1 in light and 4.27:1 in dark** against the composited
veil. Both are below the 4.5:1 that small text requires.
**Before that, a worse problem:** the first version of the test passed
everything, including a deliberately impossible 21:1 threshold. Its colour
parser handled `rgb()` but not hex, so ink values became `NaN`, and every
`NaN < threshold` comparison is false. **A test that cannot fail is worse than
no test**, because it is trusted.
**Fixed:** the probe parses both forms (tokens are authored as hex and rewritten
as `rgb()` at runtime), and the test now asserts each ratio is finite and that a
minimum exists for every role, so a silent pass is impossible.
**Then retuned**, solving against the worst case over *every* hour stop rather
than the positions that happened to be sampled:

| Token | Was | Now | Worst case |
|---|---|---|---|
| light `--ink-soft` | `#4A5763` | `#414D58` | 6.92:1 |
| light `--ink-faint` | `#78848E` | `#59656F` | 4.78:1 |
| dark `--ink-soft` | `#9AA9B8` | `#B3C0CC` | 6.51:1 |
| dark `--ink-faint` | `#6C7C8C` | `#A4B1BE` | 5.52:1 |
| dark `--surface` | `.62` alpha | `.74` alpha | — |

**Trade-off:** the dark veil is more opaque, so the night sky reads slightly
less through the content. Legibility wins; this was the checkpoint's purpose.
**Verdict on the checkpoint: passed.** Full-bleed sky is viable, with the veil
doing the work — body text holds 12.15:1 in light and 9.47:1 in dark against the
worst sky behind it.
**Status:** ACCEPTED — implemented

## D-026 — Two font axes dropped for a quarter of the page budget

**Chosen:** ship Fraunces with `opsz` and `wght` only. `SOFT` and `WONK` dropped.
**Reason:** measured — the four-axis file is 117 KB, the two-axis file is 66 KB.
52 KB, roughly a quarter of the entire page budget, bought one hover flourish on
the hero. The weight-settling effect that carries the liveliness layer uses
`opsz` and `wght` and is unaffected.
**Consequences:** the hero hover is a weight and optical-size shift rather than a
softness shift. Fonts total 107 KB, self-hosted, latin subset only.
**Status:** ACCEPTED — implemented

## D-027 — The sky is static; the theme is the only thing that changes it

**Supersedes the scroll-driven mechanic in D-008 and part of D-022.**

**Chosen:** two authored skies — day and night — neither reacting to scroll. The
sun/moon sits at a fixed position, always visible, and is never animated. Stars
twinkle and a shooting star crosses occasionally; clouds drift by day.
**Reason:** owner's direction, mid-build. It is also a real simplification, and
worth being clear about what it costs and buys.

**What it buys:**
- **Every scroll listener is gone.** The sky engine, the hour readout and the
  ridge parallax all went with it. What remains is one IntersectionObserver and
  one pointer handler.
- The riskiest idea in the project is removed rather than mitigated. The
  contrast surface shrinks from a continuous range to two fixed states.
- A sun that is always visible is a stronger, calmer image than one that spent
  much of the page off-frame.
- Most visitors never scroll far enough to have seen the arc at all, so the
  payoff was invisible to the people it was meant for.

**What it costs — stated plainly:** "time passing as you read" was the thesis
that made the concept personal (D-011: time as the subject, the Frieren
grammar). That thesis is weakened. What replaces it still holds: **one place,
held still, under two skies** — arguably closer to the stated taste for
stillness, but it is a different idea and the codename no longer describes it.

**Consequences:**
- `src/scripts/hours.ts` deleted. `tokens.css` holds one sky per theme instead
  of four hour stops, so the file got shorter and simpler.
- The sun-as-progress-indicator (D-022 move 4) is gone. The section handoff
  marker now carries wayfinding alone.
- Ridge parallax removed; `--travel` deleted.
- The contrast test still samples scroll positions — the gradient is fixed to
  the viewport, so what sits behind a panel still depends on where it is on
  screen.
- Visibility per theme is handled by tokens that resolve to `transparent`
  (`--star`, `--cloud`, `--glow-shade`), so **no script decides what is drawn.**
**Status:** ACCEPTED — implemented

## D-028 — Three implementation bugs worth recording, because each is a class

1. **`hidden` does not exist on SVG elements.** The theme toggle set
   `svg.hidden = true` from script; `hidden` is defined on `HTMLElement`, and
   `SVGElement` does not inherit it, so the assignment created a meaningless
   property and both icons rendered at once. Visibility is now a class.
2. **A fractional IntersectionObserver threshold can strand tall content.** The
   reveal used `threshold: 0.08`. An element taller than the viewport can never
   reach a fractional ratio, so it would have stayed at `opacity: 0`
   permanently. Now `threshold: 0`.
3. **A gate that cannot fail is worse than no gate** (already recorded in D-025
   for the contrast test, repeated here because it recurred): the content
   schema was verified by deliberately breaking an entry and confirming the
   build failed, naming the file, the field and the budget.
**Status:** ACCEPTED — all three fixed

## D-029 — The contrast gate's blind spot was its selector, not its maths

**Found by looking at a screenshot, not by a failing test.** The footer colophon
was the only text on the site not sitting on a veil — it sat directly on the
near ridge, at roughly 1.3:1. The contrast test passed throughout, because it
sampled `.veil` and `.bar` and the footer was neither.
**Fixed:** the colophon now sits on a veil like every other piece of text, and
the test samples `.veil, .bar, footer p, .card`.
**The general lesson, worth more than the fix:** an automated gate only covers
what its selector reaches. D-025 established that a gate must be able to fail;
this adds that it must also be able to *see*. Any new text-bearing surface that
is not a veil has to be added to that selector, or it is unchecked.
**Status:** ACCEPTED — implemented

## D-030 — One sheet, not a stack of panels

**The critique that prompted it, from the owner:** "most of these designs look
completely AI generated." He was right, and the reason is specific: every
section was an identical translucent rounded rectangle with identical padding
and an identical label → heading → body rhythm. Uniform repeated cards *are* the
generated-design signature.

**Chosen:** a single continuous sheet running from below the hero to the foot of
the page. Sections inside are separated by hairlines and by **changes of
rhythm** — each sets its own vertical measure — never by more boxes. The sky
shows in the margins beside the sheet and behind the hero above it.

**Consequences:**
- **The hero sits on bare sky with no surface at all.** At display sizes the ink
  clears contrast against every sky stop, so a panel there was protecting text
  that did not need protecting — and it was the most card-like element on the page.
- The sheet is continuous, so it can afford more opacity (`--sheet`, .88) than a
  floating veil could. Legibility improved as a side effect.
- Project rows alternate sides. The rhythm is what stops a list of projects
  reading as a grid of identical cards.
- **Removed:** the "How I work" and "Beyond work" sections, at the owner's
  request, with the desk, shelf and principles that served them.
- **Removed:** the floating section marker. The header nav now does wayfinding,
  and two things doing one job is one too many.
- **Added:** header section shortcuts as real anchors, so they work with
  JavaScript off and can be copied and shared. The active state is the only
  scripted part.
- **`Now` is professional only** — building, learning, focused on. What someone
  is playing or watching does not belong on a hiring surface.
**Status:** ACCEPTED — implemented

## D-031 — Instrument Serif, and what it cost

**Chosen:** Instrument Serif (regular + italic) for display, replacing Fraunces.
Karla and IBM Plex Mono unchanged.
**Reason:** the owner asked for a different title face. Instrument Serif is
higher contrast and more editorial, and its italic carries the rotating role
line in the hero properly.
**Cost, stated:** it ships a single weight, so the variable-weight settling from
D-022 is gone. Headings now settle by **letter-spacing** instead — the same
idea, done with what the face actually offers.
**Benefit, measured:** fonts dropped from **107 KB to 71 KB**, and total first
view from 121.6 KB to **83.4 KB**.
**Also:** the rotating role line is `aria-hidden`, with a static visually-hidden
sentence carrying the full list. A live region re-announcing every 2.6 seconds
would be hostile to a screen reader. Under reduced motion it does not rotate.
**Status:** ACCEPTED — implemented

## D-032 — Projects are editorial rows, not diagrams

**Chosen:** each project is a full-width row — screenshot on one side,
description on the other, sides alternating — with stack chips and a link to the
live site. No architecture plate, no case-study route, no "read more".
**Reason:** owner's direction. The plates were the most speculative part of the
design and they demanded write-ups that do not exist yet; a screenshot and a
working link communicate more, immediately.
**Consequences:** `Plate.astro`, the plate primitives and `/work/<slug>` are
deleted. The routing capability reserved in D-005 is unused but intact — the
architecture still supports adding case studies later without restructuring.
`ProjectShot.astro` draws a placeholder frame until a real screenshot is set in
frontmatter; the schema now carries `image` and `imageAlt`.
**Also removed:** this site from its own work section, at the owner's request.
**Status:** ACCEPTED — implemented

## D-033 — A stale dev server was shadowing the static one

**Found while screenshotting:** an `astro-dev-toolbar` element appeared at the
bottom of every capture. The built output contained zero references to it.

**Cause:** a leftover Astro dev/preview daemon was still listening on port 4321
and answering ahead of the static server the tests and screenshots believed they
were using. Astro's preview daemonises (already recorded as a trap in the
project's the project's local notes), so it survives the command that started it.

**Why it matters beyond the cosmetic:** *the test suite may not have been running
against the artifact being shipped.* Dev output differs from a build — different
CSS inlining, no generated CSP. A green suite against the wrong server proves
nothing about the deployed site.

**Fixed:** killed the stray process, confirmed a single listener and zero
dev-toolbar references in the served HTML, then re-ran the suite against the
genuine static build. All six pass.
**The lesson, which generalises:** verify *what answered*, not just that
something answered. A port responding is not evidence that the right process
responded.
**Status:** ACCEPTED — resolved


## D-034 — The Room was built outside this thread, and has been removed

**What happened:** between sessions, a workspace illustration (`Room.astro`) with
a derived tool rail, pinned role cards and a period-focus interaction was added,
`Hero.astro` was rewritten around it, and a room palette was added to
`tokens.css`. Two decisions were recorded for it.

**Reverted at the owner's direction**, in favour of the design agreed in this
thread: the hero is type on bare sky, and D-030's removal of the desk stands.

**Removed:** `src/illustration/Room.astro`, `src/illustration/Desk.astro` (an
orphan left over from the deleted "How I work" section), `src/lib/derive.ts`,
`src/scripts/room.ts`, twelve room-only colour tokens in both themes, and the
test assertions that depended on them. `Hero.astro` restored.

**Worth recording, because it will recur:** the work had already been
`git add`-ed, so the index carried it too and there was no clean state to
restore from — the revert had to be done by hand, file by file. **A staged
change is not a saved one.** With no commits in the repository, the index was
the only history, and it had been overwritten.

**Two defects came back with it and have been fixed rather than reverted:**
`tokens.css` had a duplicated `--sheet` declaration and a mis-indented `--ink`
in the dark block. Both were harmless; both are gone.
**Status:** ACCEPTED — reverted

## D-045 — The test suite runs on its own port and never reuses a server

**Context:** `playwright.config.ts` used `baseURL: http://localhost:4321` with
`reuseExistingServer: !process.env.CI`. Port 4321 is also `astro dev`'s default.

**The failure:** a leftover `astro dev` was listening on `[::1]:4321`. The static
server bound `*:4321` without error — both can listen — and `localhost` resolved
to the dev server first. Playwright reused it. Six tests passed **against a dev
server rather than the built artifact**, so the suite proved nothing about what
would actually ship. Nothing failed; there was no bind conflict and no warning.

**Options:**
- *Kill whatever holds 4321 before testing.* Rejected — it fights the developer's
  own dev server, and only works when someone remembers.
- *Keep 4321, set `reuseExistingServer: false`.* Rejected — Playwright's server
  would still bind the wildcard alongside the dev server's loopback socket, and
  which one answers `localhost` stays a race.
- *Chosen: a dedicated port (4331) that dev never uses, plus no reuse.* The
  suite starts its own `npm run serve` over `dist/` every run.

**Trade-off:** one more port to know about, and the tests can no longer be
pointed at a running dev server for a quick check. That was never a capability
worth having — it is precisely the thing that produced a false green.

**Consequence:** `PORT` is honoured by both `scripts/serve.mjs` and the config,
so CI or a conflicting machine can move it in one place.

**The general lesson:** a test that silently accepts whatever answers a port is
not testing a build, it is testing an address. Verified after the fix by
confirming the served HTML contains hashed `_astro/` assets and no HMR client.

## D-035 — Pre-push cleanup: what the codebase review found

A read of the whole tree before the first push. Findings in severity order, all
fixed.

**Would have broken on push**

1. **`npm run check` could not run.** `@astrojs/check` and `typescript` were
   never declared as dependencies. The command prompts to install them, so in
   CI — where it runs on every push — it would have hung or failed. Installed,
   and it now surfaces real errors (below).
2. **Two type errors, hidden by that.** `reveal.ts` and `liveliness.ts` had no
   imports or exports, so TypeScript treated them as *global scripts* rather
   than modules and their top-level `const reduce` declarations collided. It
   worked at runtime only because Astro bundles them as modules.
3. **A dead font preload.** The layout preloaded `fraunces-300600.woff2`, which
   was deleted with D-031 — a guaranteed 404 on every page load. Worse, the
   replacement display face was *not* preloaded, so it was discovered late.
4. **`site` was a placeholder** (`example.pages.dev`). Canonical URLs, Open
   Graph URLs and the sitemap are all derived from it, so the first deploy would
   have published wrong URLs. Now `SITE_URL` / `CF_PAGES_URL` with a localhost
   fallback.
5. **Anchor targets landed under the sticky header.** Every nav shortcut put the
   section heading behind the 60px bar. One line: `[id] { scroll-margin-top }`.
6. **`twitter:card: summary_large_image` with no `og:image`** renders as a blank
   rectangle. The card type is now chosen by whether an image exists.
7. **Broken links to files that do not exist** — `/resume.pdf` in three places.

**Dead code removed**

`.veil`, `.stack`, `.scroll-x`; `--shadow`, `--dur-slow`, `--step--1`; the
`featured` and `status` schema fields, read by nothing; `month()` exported from
`format.ts` but only used inside it; a `localStorage` restore in the audio
control that set a value to what it already was; a deprecated `z.string().url()`;
an unused `RGB` type in the contrast test; `404.astro` borrowing `.band`, a
class belonging to sections inside the sheet, which gave it double horizontal
padding and a stray hairline.

**Flow changed**

- **Four script entries became one.** `main.ts` imports the rest, reads
  `prefers-reduced-motion` once and passes it down, so the page agrees with
  itself. Four bundles and four CSP hashes became two; `nav.ts` no longer does
  two unrelated jobs, and the timeline lives in its own file.
- **Optional assets are detected, not configured.** `src/lib/assets.ts` checks
  `public/` at build time. Drop in `resume.pdf` and the link appears in three
  places; drop in the audio track and the control appears. No file means no
  link, no dead control, and — because the parent decides whether to render the
  component at all — **no shipped JavaScript for it either**. Astro hoists a
  component's script whenever the component is *used*, so an internal guard
  would still have bundled it.
- `reveal.ts` counted each element's index with `indexOf` against its parent's
  children; a per-group counter says the same thing without the lookup.

**After:** 0 type errors, 0 warnings, 6 tests passing, first view 83.0 KB.
**Status:** ACCEPTED — implemented

## D-036 — The theme change is interpolated, not cut

**Chosen:** every colour role in `tokens.css` is registered with `@property` as
`syntax: '<color>'`, and `:root.is-theming` transitions all of them.

**Reason:** a plain custom property is a token substitution — it has no type, so
there is nothing to interpolate and a theme change lands as a hard cut. Two
things follow from registering them instead:

1. The sky is a `linear-gradient`, and `background-image` is not transitionable
   in any browser. Animating the *stops* is the only way to dissolve the largest
   surface on the page. Registration makes the stops animatable.
2. One declaration at the root covers everything downstream. Because the values
   inherit, every consumer — SVG `fill`, the veil, the ink, the avatar — follows
   automatically, with no transition on any component and no `*` selector.

**Why it is armed by a class rather than always on.** Two reasons, both learned
the hard way rather than guessed:

- `contrast.spec.ts` and `a11y.spec.ts` set `data-theme` directly and read
  computed colour immediately afterwards. An always-on transition would have
  them sampling half-blended values — an intermittently failing gate is worse
  than no gate.
- An OS-level `prefers-color-scheme` flip delivers the event in the same style
  pass that changes the palette, so there is no frame in which to arm a
  transition. That path stays an honest instant switch.

**The trap it creates.** `ThemeToggle.astro` reads `root.offsetWidth` between
adding the class and setting the attribute. It looks like a line doing nothing.
It forces the style recalculation that separates the two, and without it both
land in one pass, there is no earlier value to interpolate from, and the switch
silently goes back to cutting. Anyone tidying it away removes the feature.

**Cost:** browsers without `@property` (none current) keep the old instant
switch. That is the whole fallback, and it is the previous behaviour.

## D-037 — The hero gains a portrait, and the role line is typed

**Chosen:** an optional illustrated avatar — hoodie, modern crop — above the
greeting, and the rotating role line rewritten from a crossfade to a typewriter
that types, holds, erases and types the next role.

**Reason:** owner's direction. The crossfade was doing very little: two words
dissolving into each other at the same width reads as a rendering glitch as
easily as an effect. Typing is legible as an intention.

**What holds it together.**

- The avatar is inline SVG referencing token roles, never an `<img>` — the same
  rule as every other illustration here, and for the same reason (D-013). It is
  themed: the hoodie darkens and the skin warms down at night.
- It is optional. `site.avatar` decides whether it renders; off, the hero is
  purely typographic exactly as it was.
- It is decorative and `aria-hidden`. The hero already says who this is in text,
  so the portrait adds nothing to the accessible name.
- The role line reserves the *longest* role (`--roles-ch`, derived in
  `Hero.astro`) rather than a guessed constant. The typewriter erases to
  nothing, so without a reserve the line collapses and reflows on every cycle.
- The caret is CSS, applied by `.is-typing`, which only `rotate()` adds. With
  JavaScript off or under reduced motion the line is a finished sentence with no
  caret — a caret blinking beside static text would be a lie about what is
  happening.

## D-038 — Now is removed; About anchors the hero; Experience precedes Work

**Supersedes the ordering rationale in `04-experience.md` §2 and the Now section
in the content model.**

**Chosen:** the Now section is deleted, along with `src/data/now.ts`. The nav
gains **About**, pointing at the hero. Experience now comes before Work.

**Reason:** owner's direction, and both halves stand up on their own.

*Now* was a maintenance liability disguised as a feature: a dated block whose
whole value is being current, on a site that is updated rarely. Stale, it says
the opposite of what it was there to say. The hero already answers "is this
person active" without a timestamp to keep honest.

The reversal of Work and Experience overturns a rationale recorded earlier —
that for an early-career engineer the projects are the more interesting
evidence. The counter-argument is that the roles establish who is speaking, and
the projects then read as evidence rather than as a list of side work. The
Résumé link in the header still means nobody has to scroll for the credential
path, which is what the original argument actually rested on.

**Note for whoever maintains `nav.ts`:** the nav list is in document order on
purpose. The active-section highlight resolves by taking the first key that is
on screen, so a nav array out of step with the page makes the highlight lag.

## D-039 — The stats strip, and why it is not on bare sky

**Chosen:** a six-figure summary strip — years, projects, systems, hours
automated, events/day, uptime — as the **first band of the sheet**, directly
below the hero's `See the work` button and above Experience.

**Reason:** owner's direction. It answers "is this person any good" in the two
seconds before anyone decides to scroll, which is the one job the hero cannot do
with prose alone.

**Two things it is deliberately not.**

*Not a row of cards.* Six identical bordered tiles is precisely the shape D-030
removed from this page for reading as machine-generated — and a stats row is the
most tempting place in any portfolio to reintroduce it. These are separated by
space and by the band's own hairline. No borders, no per-item background.

*Not on bare sky.* It was first placed between the hero and the sheet, which is
where it belongs by reading order. It is unusable there, and the reason
generalises: **`Ridges` is `position: fixed`, so anything below the hero scrolls
through the ridge band.** The labels are `--ink-faint` by design and spent part
of the scroll sitting on dark green hills. The hero survives on bare sky only
because it is high enough to stay above the ridges; nothing below it can rely on
that. Bare sky is a hero-only privilege on this page.

**The part worth remembering: the contrast suite passed the whole time.** The
probe composites ink over the *sky gradient* — `skyAt(fraction)` — and has no
model of the ridge layer at all. It was not sampling a wrong value; it was
confidently sampling the wrong background. A screenshot caught it, exactly as
the note in the project's local notes says it will. This is the third time on this project
that green has meant "the gate did not look" rather than "the design is sound".

**Follow-up:** closed by D-041. The strip was subsequently moved back onto bare
sky at the owner's direction, which made a ridge-aware gate mandatory rather
than optional — `tests/ridge-contrast.spec.ts` now asks the ridge paths
directly instead of modelling them.

**Numbers are placeholders, and marked.** `src/data/stats.ts` carries
`PROVISIONAL`, so `npm run content:status` lists it and the file blocks going
public alongside the other invented copy. Numbers are the most damaging kind of
placeholder: filler prose reads as filler, but a precise-looking figure reads as
a claim.

## D-040 — Headings are set open, not tight

**The critique, from the owner:** the titles "look too compressed and too italic
in some places."

**Chosen:** neutral-to-open tracking on all headings, looser leading, and the
one italic on the page removed.

**What was actually causing it.** Three things compounding, none of them the
typeface on its own:

1. `h1` carried `letter-spacing: -.025em` and every heading `-.015em`. Instrument
   Serif is already a narrow, high-contrast display face; negative tracking on
   top of a condensed face is what reads as "compressed".
2. `line-height: 1.06` closed up any heading that ran to two lines.
3. **The reveal animation settled *into* the tight state.** `h1.reveal` animated
   letter-spacing from `-.005em` to `-.025em`, so every heading visibly
   compressed itself as it arrived. The motion was working against the
   typography. It now resolves open — same designed settle, opposite direction.

The italic was `.rotator` in the hero, the only italic on the site. At display
size in a high-contrast serif it read as decorative rather than emphatic, and
the accent colour was already doing the work of separating the role from the
sentence. Now roman.

**What this does not do.** If the titles still read too narrow, that is the
typeface itself, and the fix is a wider display face — not more tracking.
Instrument Serif is a condensed design and there is a floor to how open it can
be made. Swapping it means a new self-hosted woff2 (`font-src 'self'`, D-018)
and a pass through RUNBOOK § fonts; the italic `@font-face` is now unused but
left declared, since an unreferenced `@font-face` never downloads.

## D-041 — The near ridge is lightened so bare sky can carry small text

**Chosen:** the stats strip moves out of the sheet onto bare sky, and day
`--ridge-near` is lightened `#697F75` → `#7E948A` to make that legible.

**Reason:** owner's direction, and it forced the honest version of D-039's
problem. On bare sky the strip scrolls across the fixed ridge band. The labels
are small mono text, so WCAG asks 4.5:1, and against the old near ridge even
`--ink` — the darkest role in the palette — reached only **3.54:1**. No colour
choice fixed it: there was nothing darker to reach for. Either the background
moved or the strip went back in a box.

**The options that were weighed:** a soft haze behind the strip (rejected — a
surface behind text is the thing the owner asked to remove); accepting 3.54:1
(rejected — the whole contrast suite exists to prevent exactly that, and passing
it would have meant lowering the gate's own threshold); back on the sheet
(rejected — it is the placement the owner ruled out).

**The cost, stated plainly.** Near and mid hills now sit closer in tone, so the
horizon reads slightly flatter. That is a real loss of depth, accepted
deliberately in exchange for the placement. Night is untouched: its ridges are
near-black under light ink and were never at risk.

**The gate this required.** `tests/ridge-contrast.spec.ts`. It does not model the
ridges — modelling is what failed in D-039. The bands are real SVG paths, so it
asks them: `isPointInFill` returns the actual fill behind any sampled point, and
screen→user mapping is a plain linear scale because the svg is
`preserveAspectRatio="none"` over a fixed viewBox. It samples a grid across each
glyph band at five scroll positions in both themes and takes the worst ratio.

It was verified the only way a gate can be: **it failed first.** Before the
palette change it reported all five labels at 3.54:1 against the 4.5:1 bar. A
contrast gate that has never been seen to fail is not evidence of anything.

## D-042 — Weight belongs to the numbers, and only the numbers

**Chosen:** the stat values are set in Karla 600. Everything else keeps the
weight it had; the hero's role line stays Instrument Serif at 400.

**The constraint behind it:** Instrument Serif ships a single weight. There is
no bold to ask for, and a synthetic bold smears a high-contrast serif badly at
display size. So "make it bolder" is not a weight change on that face — it is a
change of face, to the body sans at 600.

**What was tried and reverted.** The hero's `and I do <role>` line was set in
sans-semibold first, at the owner's request, then reverted at the owner's
request once it was on screen. The reason it did not work is worth keeping: it
put a second heavy element directly under the name and the two competed, and
the accent colour was already doing the job of separating the role from the
sentence around it. Weight is the loudest signal on this page and there is only
enough room for one thing to use it.

The numbers keep it because they are the one element whose entire purpose is to
land in the first glance.

## D-043 — The introduction and the numbers share the first screen

**Chosen:** `.first-screen` wraps the hero and the stats strip at
`min-height: calc(100svh - var(--bar-h) - 1px)`. The hero flexes to fill
whatever the strip leaves, and every size in it is capped against viewport
*height* as well as width.

**Reason:** owner's direction — a statistic you have to scroll to find is not
doing the job a statistic exists for.

**Three things that make it work, none of them obvious.**

1. **`svh`, not `vh`.** On mobile `vh` resolves against the largest viewport —
   browser chrome retracted — so a `100vh` first screen is taller than what is
   actually visible and pushes the strip under the fold on exactly the devices
   where the fold is tightest.
2. **`min-height`, not `height`.** On a viewport too short to hold both, the
   block overflows and scrolls normally instead of clipping the numbers off.
3. **Height-capped type.** `min(var(--step-4), 12vh)` and friends. Width-based
   clamps have no idea the viewport is shallow, and a 768px-tall laptop is where
   this breaks first.

**`--bar-h` was wrong, and that is what the failures were pointing at.** Every
viewport at or below 860px overflowed by *exactly* 5px — a constant, so not
content. Below that width `.bar-inner` switches to `height: auto` with its own
padding and wraps the nav onto a second row, measuring **102.5px** while the
token still said `98px`. The token is not decoration: `[id]` scroll-margin
clears it and `.first-screen` subtracts it, so understating it had also been
landing every anchor jump ~5px under the header. Now `103px`. **If the bar's
padding changes, this number has to move with it.**

**A second bug the measuring caught.** The strip was never actually centred: the
`.row` rule reset `margin: 0` for the list, and the scoped class outranks
`.wrap`, so `margin-inline: auto` was being killed. It only looked centred at
exactly `--wrap` width. Now `margin-block: 0` plus an explicit
`margin-inline: auto`.

**The gate:** `tests/first-screen.spec.ts`, across ten viewports from 1440x900
to 360x740. It asserts the strip's bottom clears the fold, that the page is not
scrolled, that stats actually rendered — and that `--bar-h` matches what `.bar`
measures, so the token can never drift from the layout again.

**Documented limit:** 320x568 and smaller are not covered and do not fit. With a
103px header that leaves 465px for a portrait, a name, a role line, a paragraph,
two buttons and five statistics. `min-height` means those viewports scroll
rather than clip, which is the correct failure. Note also that the intro copy is
still `PROVISIONAL` — it is the tallest element above the fold, so the real copy
changes this budget in whichever direction it is written.

## D-046 — Experience is a roadmap on clouds, outside the sheet

**Context:** the Experience section was a vertical timeline — a hairline rule, a
dot per role, text in a column. It worked and it looked like every other
timeline. The ask was a route through a professional journey: curving, bending,
wandering, with varying distances between milestones, and reading as designed
rather than generated.

**What was built.** A rail runs down the section and each role sits beside its
own stop, carrying its whole description — dates, org, title, summary,
highlights, stack, duration. Two prototypes preceded it and both were published
for review before any of this was written.

**Options considered for the route's form**, judged against the site's existing
line language (1.5px, round caps, `fill:none`, quadratic curves, three paths for
a whole paper plane):
- *Hand-drawn path.* Rejected — fights a line vocabulary this precise.
- *Illustrated road.* Rejected — lanes and pins are Maps, explicitly out.
- *Contour map.* Rejected — turns a career into a topographic poster.
- *Chosen: a cartographic traverse.* Technical, but wandering. It belongs
  because `Ridges` already pans terrain against a fixed sky so that scrolling
  reads as travel across a landscape (D-044); the section was already headed
  *The road so far*. The route is the next sentence of a metaphor the site had
  already started, not a new one bolted on.

**Horizontal first, then vertical.** The first prototype ran left-to-right with
a true time axis: distance along the line was measured elapsed months. It had to
page sideways on a phone, which was not shippable. Vertical is the axis the page
already scrolls in, so the roadmap *is* the section rather than a widget inside
it; below 760px the rail pins to the left gutter and the blocks stack beside it,
same curve and same code.

**What that cost, stated plainly.** Putting the descriptions on the map destroys
the measured axis. Once a stop carries six lines and a chip row, the height of
the *text* decides how far the rail travels — the five-month internship occupies
about as much rail as the sixteen months since. So the axis is not a scale and
nothing on it claims to be one. What survives is weaker but true: the gap before
Hakimo is authored from elapsed months and is the longest on the rail, and the
two Hakimo roles nearly touch because they are continuous. Exact durations are
printed in words under each stop, which is now the only place they are precise.

**The rail is generated after layout,** not authored as a fixed path.
`roadmap.ts` measures where each block landed and threads a spline through those
anchors, so the text sets the rhythm and the line follows it. It redraws on
resize and on `document.fonts.ready` — Instrument Serif changes every heading's
height when it lands, which moves every anchor.

**Education is a rail, not a stop.** A degree is a duration. The old timeline
listed it below the jobs, which quietly implied it came after them.

**Outside the sheet, on clouds.** The section floats on sky so the ridges pass
behind it. Bare sky cannot carry small type: measured against the tokens,
`--ink-faint` on unwashed day sky is **2.26:1** where 4.5 is required, and the
section scrolls through the whole gradient. So each block sits in a cloud — a
real `background-color` dissolved by a mask of overlapping lobes. Real colour,
not a gradient, because the contrast gate reads `backgroundColor` off the
ancestor chain and is blind to gradients, and because a flat colour is the only
kind whose contrast can be computed rather than guessed.

The alpha is `--sheet`'s .88, not `--surface`'s .74, because the clouds cross
the fixed ridge band. Over the near ridge by day, .74 puts `--ink-faint` at
4.31:1 and `--accent` at 4.15:1 — both under. At .88 they are 5.11 and 4.92.

**The gates had to be taught to see it.** `contrast.spec.ts` gained `.rm-cloud`
and excludes `.band--free`, which carries no text of its own.
`ridge-contrast.spec.ts` gained the roadmap selectors and a `groundAt` that
walks the ancestor chain — it knew the ridges but not element backgrounds, while
the other spec knew backgrounds but not the ridges, and this section is the
first thing that needs both. Verified by deleting the cloud and confirming the
suite goes red at 4.2:1, then restoring it.

**Five bugs, each a class:**
- **Astro scopes CSS at build time.** `roadmap.ts` creates the rail at runtime,
  so those elements never carry the scope attribute and scoped selectors do not
  match them. The paths fell back to the SVG default — black fill, no stroke —
  and rendered the route as a solid blob. Every rail rule is `:global()`.
- **`radial-gradient()` takes radii, not diameters.** Every mask lobe was twice
  the intended size, so the union covered the whole box opaquely and the clouds
  rendered as hard rectangles. The mask was silently doing nothing.
- **A class name collision with `Sky.astro`.** It already owns `.cloud` for the
  drifting sky shapes, so the contrast probe matched an SVG whose `className` is
  an `SVGAnimatedString`, not a string, and the spec crashed. Renamed `rm-cloud`.
- **`#000` in a mask tripped the token gate** — correctly. A mask reads only
  alpha, so `currentColor` carries no literal.
- **`now` placed from container height** landed on the last block's own chips on
  a phone, where that block runs the full width. It is placed from the last
  block's bottom instead.

**And one worth keeping separate:** every manual screenshot in this session was
taken against a stale `astro dev` still holding `[::1]:4321`, because `localhost`
resolves to the IPv6 loopback first and the static server binds the wildcard.
This is exactly D-045, hit by hand minutes after fixing it for the suite. The
test suite was unaffected — it runs on 4331 — but two edits appeared not to
apply for several cycles. **Use a port no dev server uses for manual checks too**,
not only for tests.

**Amendment — the blocks sit close, and the rail still wanders.** The first
build left the columns at the section's outer edges, ~60px from their own
markers, which read as two lists with a line between them rather than as stops
on a route. Three changes, in order of how much each mattered:

1. **The channel is measured, not assumed.** The script had hard-coded the block
   width, so the CSS and the script each held half of the same number and had to
   be kept in sync by hand. It now reads the real text edges — padding excluded,
   because the cloud may be crossed and only glyphs must be cleared — and
   derives the centre line and the swing from them. Narrowing the column in CSS
   is now the single place the spacing is decided.
2. **`.stops` gained a max-width** and the columns moved inward. Marker-to-block
   distance went from ~60px to 29–33px.
3. **The swing is per-height, not global.** Tightening the channel had flattened
   the rail from 146px of travel to 50 — the wander was the price of proximity.
   But the constraint only exists *where the text is*: in the long stretch
   between one block's bottom and the next block's top, both columns are empty.
   So the amplitude is computed at each waypoint's own height, and the bow is
   placed in that empty band rather than at the midpoint between anchors — which
   usually still falls inside the upper block, which is precisely where there is
   no room for it. Swing came back to 138px with the blocks left close.

4. **A floor under the gap.** 29–33px turned out to be too close — the columns
   read as crowding the rail. Rather than weaken the lean (which is what ties a
   stop to its own column), the lean is now *clamped*: a marker moves toward its
   block's side but never nearer than `STOP_GAP` to that block's text. Both
   properties are wanted, so both are kept and the conflict is resolved by a
   limit rather than a compromise. `.stops` widened to 51rem to leave room for
   the gap and the lean together.

Measured after: markers 46–49px from their blocks, 165px of rail travel, and a
minimum clearance of 36px between the rail and any glyph column at 300 sampled
points along the path — stable at 1024px and 1280px viewports, since the whole
geometry is derived from measured edges rather than fixed numbers.

**Also fixed here:** `.band--free` had never been defined in the component — it
existed only in the published prototype. The section was therefore running the
full page width while every other section is constrained by the sheet to 64rem,
and `.band`'s top hairline was ruling a line across bare sky. Both corrected;
Experience now measures 1024px, exactly matching the sheet.

## D-047 — Work is a book and a shelf, and it left the sheet

**Context:** Work was a list of alternating image/text rows — the same shape as
every other portfolio's project list. The brief asked for two featured projects
as books (one open, one closed beside it) above an illustrated shelf holding the
rest, with the two featured books leaving visible gaps in that shelf.

**Prototyped first.** Two rounds of a standalone artifact were reviewed before
any of this was written, which is where every shape decision below was settled.

**The section is transparent; only the books are not.** No sheet, no panel: the
sky and the fixed ridges run straight through it, and the only opaque things are
the ones that should be — the open book's two pages, the closed book beside it,
and the shelf's own spines. Books are made of paper, so paper is the one thing
that gets a fill. The sheet now begins at Contact and continues into the
colophon, so the page still settles onto paper at the end.

That costs what bare sky always costs here. `--ink-faint` over the day sky is
about **2.26:1** where 4.5 is required, so this section's labels are `--ink` and
cannot be softened or shrunk. Measured at the worst ground each one crosses:
**4.70:1** by day over the near ridge — the exact margin D-041 created — and
9.82:1 at night. A wash behind each label (the Experience roadmap's answer) was
considered and rejected: these labels are few and short, and the palette already
has a colour that survives bare sky. A wash you do not need is a tile with soft
edges.

**Everything is rendered at build time; the script only moves attributes.** The
prototype built the shelf in JavaScript and paid for it twice — the section
vanished entirely with scripts off, and re-running the geometry generator on
every selection gave every book a new height, width and lean (a check found **0
of 18 slots** unchanged after one click, so the whole shelf visibly reshuffled
whenever anything was clicked). Here the spines, the leaves and the geometry are
real markup seeded once at build. A pulled book keeps its slot and its shape and
is drawn as an *absence* rather than removed, so the shelf never reflows on a
selection. Nothing is created at runtime, which also means none of this needed
`:global()` — the trap that stripped the Experience rail of its styling (D-046).

**No-JS is a plain project list.** The book chrome and the shelf are hidden
until the script sets `data-ready`; without it every leaf shows at once, which
is a readable list of projects. Dead buttons are not left behind.

**The book is not one shape.** A single SVG scaled behind both pages warped, or
grew tall enough to arc over the text, as soon as one project's problem
statement ran longer than another's. Each page now draws only a short,
fixed-height curl at its own top edge and is otherwise a plain bordered box,
however tall its content makes it; the spine is one straight line the height of
the book, never a scaled shape.

**Five bugs, each worth naming:**
- **`.band--free` was defined in a component.** Astro scopes component styles,
  so Experience's copy did nothing for Work and the section rendered full-bleed
  at 1280px while every other section sits at 1024px. It is a layout primitive
  used by two sections now, so it lives in `base.css`.
- **`role="listitem"` is not allowed on a `<button>`** — axe caught three nodes.
  The shelf is a labelled `role="group"`; each spine already carries its name.
- **The corner book sat on the right page's chips and links.** Positioned at
  `right: 4%` of the section, it covered the text it is meant to sit beside. The
  section now reserves a strip for it and the overlap is a measured 20px of the
  book's bottom-right corner, verified against every text node in the open page.
- **The spine label ran off the bottom of the cover** — anchored near the foot,
  a nineteen-character title overflowed. Centred on the cover instead.
- **"1 more projects."** Pluralised.

**Consequence worth stating plainly:** with three projects in the collection the
shelf holds one book beside two gaps. The design is built for ten or more and
will not look like a shelf until the content is there. That is a content
problem, not a layout one — the section takes any number without changing.

**Also in this change:** the nav shortcut reads *Projects*, the section label
reads *Work / Projects*, and the shelf heading reads *The rest of my projects
shelf*, per the owner's wording.

## D-048 — The cover reads across, the heading gets the cloud, and extra photos are opt-in

Three refinements to D-047, in the owner's order.

**The closed book sits lower and its title reads horizontally.** It was set in
SVG `<text>` rotated −90°, running up the board like a shelf spine — but this
book is shown face-on, and a cover title reads across. SVG text also does not
wrap, so a longer project name simply ran off the board. The title is now an
HTML span positioned over the cover: it wraps, it uses real type, and it sizes
with the rest of the page. It sits *below* the ribbon rather than beside it —
set alongside, it had only a narrow column to wrap in and its second line ran
under the bookmark. The ribbon ends at 31% of the cover's height, so the title
starts under it and gets the full width of the board. Verified against the
ribbon's and the cover's own boxes: no overlap, fully inside.

**The heading takes the same cloud as Experience's.** `.rm-cloud` was defined
inside `Experience.astro`, and Astro scopes component styles — so it would have
done nothing for Work, exactly as `.band--free` did nothing an hour earlier
(D-047). It is now in `base.css`, where a class shared by two sections belongs.
That is twice in one session that the same mistake produced the same silent
failure; the rule is in the project's local notes as a trap.

**Extra photos are a content capability, not a fixed slot.** `gallery` is a new
optional field on the project schema: an array of `{ src, alt }` beyond the
primary `image`. Below the plate, a single mono control reads `1 / 3 · more
photos →` and advances in place — no lightbox, no modal, no second surface,
which keeps it inside D-030. It appears **only** when a project actually has
more than one shot; a project with one screenshot shows no affordance at all,
and one with none still gets the drawn placeholder.

Verified by temporarily giving a project a three-shot gallery, since with the
current content the control is invisible by design: with scripts on, exactly one
control rendered, labelled `1 / 3`, advancing to `2 / 3` and swapping to the
right image; with scripts off, the control was hidden and all three shots were
visible stacked. Restored afterwards, and confirmed the control count returns to
zero against the real content.

## D-049 — Profile marks and a résumé that is reachable from anywhere

**Context:** the only ways to reach the accounts were four text links at the
bottom of Contact, and the résumé was a single button below the stats that
appeared only if `public/resume.pdf` existed. Someone who wanted the CV a
screen and a half into the page had to scroll to the end to find it.

**Decision:**

**Three marks and a pill sit above the introduction.** GitHub, LinkedIn and
LeetCode as their own silhouettes, plus a résumé button. These are the one
place on the site where the drawing is not ours: a brand mark redrawn in the
house line stops being recognisable, and recognition is the only reason to use
an icon instead of a word. They are inline SVG filled with `currentColor`, so
they still take the theme from the tokens — no colour literal, no `<img>`, no
request. Paths are Simple Icons (CC0).

**A second résumé button sits in the header, directly left of the theme
toggle.** It is the one thing a reader may want at any point on the page, so it
belongs with the persistent controls rather than at the far end of the bar. It
is a pill rather than an underlined word because it sits between two bordered
square controls, where an underline read as a fourth nav item.

**The third copy was removed.** `HeroActions` used to carry a résumé link
beside "See my works". With buttons in the header and in the hero's own row,
a third copy 200px below the second is noise, not emphasis; the call to action
now carries one control.

**Nothing renders until there is something behind it.** `lib/assets` gains
`hasLink`: an absolute URL is taken at face value, a `public/` path is checked
on disk, and anything empty renders nothing at all. `site.links.leetcode` and
`site.links.resume` are empty, so those two controls are currently absent
across the whole page — the résumé button, the hero pill and the Contact row
entry all appear together the moment a URL is pasted in. An unfinished link is
an absent control, never a 404.

**Consequences, which were not free.** The row costs height on the first
screen, and `tests/first-screen.spec.ts` failed at 360x740 by 6px the moment it
was added — exactly the gate's purpose. Paid for by:

- `.action` moved from `HeroActions` into `base.css`, because the hero uses it
  too. This is the fourth time a shared class has had to be promoted out of a
  component (`.band--free`, `.rm-cloud`, D-047/D-048); the rule stands.
- `.action` given an explicit `line-height: 1.1`. It was inheriting the body's
  1.68, which is prose leading on a control — 6px taller than the text inside
  it needs, twice over on the first screen.
- The marks and the small pill were both sitting *under* the 24px WCAG 2.2 AA
  minimum target size (23px and 22px). Both were sized up rather than down, and
  the remaining pixels came from `.first-screen`'s top margin and the call to
  action's bottom padding on phones.

Measured with the résumé button forced on at every viewport, since it is
currently hidden: all ten pass, and the tightest — 360x740 — clears the fold by
4px. That is thin, and the intro copy is still provisional; anything added
above the fold comes out of that 4px first.

## D-050 — Experience is retitled, reweighted and shortened, and Projects goes first

**Context:** four separate complaints about the same section, plus one about
the page's order.

**Decision:**

**The section is "Experience & Education".** It has always carried the degree
as a stop on the same rail; the eyebrow now says so.

**The exact duration is gone from every block.** `span()` and the `.dur` line
under each stop are deleted. The dates are already at the top of every block
and the rail's own overlay shows the stretch each role occupied; a third
statement of the same fact, in the smallest type in the section, was the least
useful line in it.

**Role titles are set in Karla 600, not Instrument Serif.** This amends D-042
("weight belongs to the numbers, and only the numbers"). At 1.24rem the display
face is doing display work at reading size: it is narrow, high-contrast and
calligraphic enough to read as italic even though it is not — which is exactly
what the owner reported. The job title is the single thing a skimming reader is
looking for in each block, so it gets the body face and the weight. The display
face keeps the section heading above.

**Gaps grow with the square root of the pause, not proportionally.** A
two-month job followed by a seventeen-month gap put 227px of empty sky in the
middle of a three-stop road, and the road then read as being mostly about the
gap. Under `30 + 24·√months` that pause is 129px: still visibly the longest,
still correctly ordered against every other gap, but no longer the largest
single element in the section. Ordinal truth is what a roadmap needs; a scale
bar is what it does not have. With the durations gone and 20px off the trailing
road, the section is about 10% shorter — "a little, not a lot", as asked.

**Projects now comes before Experience.** This reverses D-038, which had put
Experience first so that the roles would establish who was speaking before the
projects were read as evidence. The counter-argument won: leading with three
job titles asks a reader to take the credentials on trust before they have seen
anything that was built. It also happens to help D-051 — the roadmap's rail now
dissolves directly above the Contact thread, so the two read as one line.

## D-051 — Contact is the open line

**Context:** Contact was a heading, a paragraph, a link grid and a small paper
plane. It was the one section that did not belong to the page's own visual
argument — nothing about it said "this is where the route ends".

**Decision:** one thread, entering from the sky above the sheet and ending
inside the section. It is not a new metaphor: it is the Experience rail,
arriving. Five moves:

1. **It arrives already in motion.** The first 90px are the same dashed stroke
   the roadmap dissolves into after `now`, fading up out of nothing. Same dash,
   same weight, same token, so it reads as the continuation of a line the
   reader has already met.
2. **The wander settles.** Amplitude tapers 110 → 84 → 26 → nothing. A route
   still swinging when it reaches its destination has not arrived, it has
   stopped; the taper is the whole argument for putting a line here.
3. **It becomes the address's rule.** One soft elbow, then a horizontal run
   under the email — which therefore carries no underline of its own while the
   thread is drawn. The destination of the journey *is* the thing to be
   clicked, and the geometry says so without a word of copy.
4. **It does not stop; it opens.** Past the address the stroke breaks back into
   dashes and ends in a ring with a gap facing the reader, labelled `open` —
   the same one-word mono device the road ends on with `now`. Hovering or
   focusing the address closes the ring. That is the only interaction in the
   section.
5. **It goes under the paper.** The thread passes *beneath* the sheet as a
   ghost of itself and surfaces 90px before the address.

**Why move 5 exists.** The only text-free corridor inside the sheet is the
65px left gutter, and a solid line down it runs parallel to the sheet's own
border for 300px. Two near-parallel verticals read as a bracket around the copy
rather than as a route arriving — the first build did exactly that and the
screenshot showed why it could not stay.

**The ghost is drawn, not inherited.** The obvious implementation is to put the
thread behind the sheet and let its `backdrop-filter` mute it. It does not
work: .88 alpha plus a 14px blur spreads a 1.5px stroke until nothing survives,
and the line simply vanished at the sheet's edge with no handover at all. It is
now one geometry drawn twice, the crisp and ghost halves cut by complementary
masks at the sheet's top edge, so the ghost's weight is a number that can be
tuned rather than a side effect of blur.

**What it reuses, unchanged:** the roadmap route's exact stroke (1.5px, round
cap, `--ink-faint` at .72); `rm-cap`'s `3 7` dash with a gradient mask; the
stops' ring size and `--accent`; and `rm-now-label`'s mono 11px at .16em. The
ground is the sheet, not a cloud — clouds exist because Experience and Work sit
on bare sky, and Contact does not. `illustration/Plane.astro` went with the old
section.

**Degradation, verified:** with scripts off the thread has zero children, the
`data-thread-ready` flag is absent and the address gets its ordinary underline
back, leaving a heading, an invitation, an address and a list of links. Under
`prefers-reduced-motion` the line is already drawn rather than half-animated,
and the ring still closes — it just does not travel to get there.

## D-052 — The sheet is gone, and two gates were not gating

**Context:** three complaints about Contact, one of which turned into a much
larger finding.

**The panel goes.** Contact was the last section still riding a sheet, and the
sheet was also what carried the colophon. Both now float on bare sky with their
text on clouds, exactly like Experience (D-046) and Work (D-047). `.sheet` and
`.sheet--foot` were deleted from `base.css` rather than left behind for
something to pick up by accident; `--sheet` the *colour token* stays, because it
is what the clouds are filled with. The colophon's hairline went too — a rule
ruled across the sky is the thing `.band--free` exists to avoid.

**That deleted the most fragile thing in the section.** With a sheet in the way,
the thread had to pass *under* it as a drawn ghost, handed over by complementary
masks cut at the sheet's top edge. A CSS mask on an SVG child resolves its
lengths against that element's own bounding box, and the cut was landing well
below where the arithmetic said — so a hard dark stroke ran down through the
copy, which is what "the line is showing something in black" was. With no panel
to pass under there is no ghost, no cut and no mask: one continuous stroke from
the sky into the address's rule. The endpoint ring is `--ink` while open and
takes `--accent` only when it closes, because `--accent` on the near ridge by
day is far too weak for a mark that small to survive on bare sky.

**The address is bigger** — `clamp(1.5rem, 1.05rem + 1.7vw, 2.35rem)`, 37.6px at
1360 against 27.2px before. Worth recording that the prototype and the built
section measured *identically* at 27.2px beforehand; the request was right, the
premise was not.

**Two gates were not gating, and both were mine.**

1. `groundAt` walked the ancestor chain for background layers and stopped at the
   first opaque one — which is always `body`, carrying `--surface-solid` as the
   no-sky fallback. The real sky and ridges are fixed layers painted *over* that.
   So every element this spec has judged since `groundAt` was added was measured
   against a pale grey ground it never touches: `open` reported 5.26:1 where the
   truth over the sky was 3.5:1. The walk now stops at `body`.
2. `POSITIONS` ended at 0.8, so the last section was never on screen — and
   `window.scrollTo` *animates*, because `base.css` sets `scroll-behavior:
   smooth`, while the probe samples 80ms later. At frac 1 on a 5100px page it
   had travelled 827px of 4304. The list now ends at 1 and the scroll is
   `behavior: 'instant'`.

Proven rather than assumed: with the label deliberately set to `--ink-faint` the
spec now fails at 1.85:1, and passes at 9.11:1 with `--ink` restored. Before both
fixes it stayed green either way.

**What the honest gate then found — reported, not fixed.** The tech chips in
Experience and Work measure **4.37–4.48:1** in light mode against a 4.5:1
requirement. `--accent` on `--accent-soft` over a cloud is marginally too weak,
and the broken ground was hiding it. Dark mode is clean. Reducing
`--accent-soft` from `.13` to `.06` alpha makes the whole spec pass — measured,
then reverted, because it is a palette change to already-delivered work and that
is the owner's call.

## D-053 — One line, and Contact loses its cloud too

**Context:** with Projects moved ahead of Experience (D-050), the roadmap now
ends directly above Contact — and the two lines were still drawn as if they had
nothing to do with each other.

**They are one line now.** The roadmap's dissolving bottom cap is gone: the rail
no longer trails off after `now`, because Contact's thread continues from that
marker. `open-line.ts` reads `.rm-now` — a real element the roadmap already drew,
whose position accounts for every block height above it — and starts its route
at that exact point, deriving its own lead from the measured gap. Verified: the
marker's centre and the route's first point both land on page (692, 4236). If
the roadmap is ever absent, the thread falls back to a fixed lead and its own
dashed entry, so neither section depends on the other existing.

The sideways travel all happens *above* the section now. By the first line of
text the thread is already in the left margin, which matters far more without a
cloud to cross harmlessly.

**No cloud on Contact, and none on the colophon.** The section sits directly on
the sky. The cost is that nothing in it may be soft: bare sky puts `--ink-faint`
at 2.26:1 by day (D-041), so the eyebrow, the invitation, the link captions and
the colophon are all `--ink`, and the hierarchy is carried by size, tracking and
space instead of by lightness. Measured after the change: every element in the
section clears its threshold, the smallest — `open` at 10.6px — at 9.11:1.

**The right half is deliberately empty.** A message form goes there next; the
left column is already sized for it. Not built yet, by request.

**Still open from D-052:** the tech chips in Experience and Work measure
4.37–4.48:1 in light mode against 4.5:1. Unchanged by any of this, and still a
palette decision rather than a layout one.

## D-054 — A form that posts, an address that is not in the page, and a footer

**Decision, in four parts.**

**Two lines of copy removed.** The invitation is one sentence now, and the
colophon — "built as a static site, no framework runtime…" — is gone entirely.
It was the site explaining its own build to a reader who did not ask.

**The address is smaller again**, `clamp(1.32rem, .98rem + 1.15vw, 1.95rem)` →
31.2px at 1360. It went 27.2 → 37.6 → 31.2; the middle value overshot.

**A real footer.** `© <year> — developed by Abhishek`, the name linking to
LinkedIn, at the very foot of the page on bare sky. It carries `data-reveal`, so
it arrives as you reach the bottom rather than sitting there the whole way down;
with scripts off it is simply present.

**The dev toolbar is off.** `devToolbar: { enabled: false }`. Astro injects a
floating menu into every page under `astro dev` — never in a production build,
but it sits over the bottom of the design for the entire time you are looking at
it. Proven by A/B: `<astro-dev-toolbar>` is in the DOM with it enabled and
absent with it off.

**The contact form.** Name, email, message, in the right-hand column of a
two-column Contact. Ruled lines rather than boxes — a field here is an underline
and a label, the same way everything else on this page is a line.

**Where the destination address lives, and why not here.** A static site cannot
send mail, so the form POSTs to a provider (Formspree, Web3Forms, Formspark,
Getform — they take the same shape). The inbox is configured in *that
provider's dashboard*: the address is deliberately absent from this repository,
because anything in `site.ts` is in the page source for every scraper that asks.
`site.contact.endpoint` holds only the endpoint URL, which is not a secret.

**It degrades, and the CSP moves with it.** The form is a real
`<form method="POST">`: with scripts off a native submit reaches the provider —
verified end to end against a stub, all three fields arriving intact. With
scripts on, `contact-form.ts` posts in the background and reports in a
`role="status"` line beside the button, keeping the reader on the page —
also verified: POST received, "Thank you — message sent.", fields cleared, no
navigation. `scripts/csp-headers.mjs` derives `form-action` and `connect-src`
from the configured endpoint, so pasting a URL is the only change needed and an
unset endpoint leaves the policy shut (`form-action 'self'`).

**With no endpoint the submit is disabled and the form says "Not connected
yet".** A form that accepts what someone typed and drops it is worse than one
that admits it is not ready. This is the same rule as `hasLink` (D-049): nothing
pretends to work before it does.

## D-055 — A real italic, a centred footer, and About means the top

**Role titles are italic as well as 600.** The title is the one line in each
block a skimming reader is hunting for, and italic plus weight separates it from
the mono organisation above and the roman prose below without changing its size.

This needed a **real face**. Karla was self-hosted as a roman-only variable
file, so `font-style: italic` would have produced a synthesised oblique — a skew
of the roman outlines, in which the letterforms never actually change. That is
precisely the kind of fake D-042 refused for Instrument Serif's missing bold, so
`karla-300600-italic.woff2` was added: same family, same OFL, same latin subset,
32 KB. Verified rather than assumed — `document.fonts.check('italic 600 17.6px
Karla')` returns true and the browser really requests the italic file.

This is now the only italic on the site. D-040 removed the last one, which was
Instrument Serif at display size and read as a flourish; this is a sans at
reading size and reads as emphasis. The distinction is the point.

**The footer is centred and sits far lower** — `clamp(4.5rem, 10vw, 8rem)` above
it, 128px clear of Contact. The page has ended; the line that ends it should not
look like the last row of the section above.

**About goes to the top of the page, not the top of the hero.** `.first-screen`
carries a margin and `.hero` its own padding, so `#about` landed short of the
document top by exactly that much — which is what "it scrolls a bit down" was.
The link is now `#top`: the HTML spec defines that fragment as the top of the
document when no element matches it, so this needs no element, no script and no
magic scroll-margin. `Nav.astro` gained an optional `watch` field so the active
highlight still observes the real `#about` element. Verified: `scrollY` is 0
after clicking it from 2500px down.
