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

## D-035 — The test suite runs on its own port and never reuses a server

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
