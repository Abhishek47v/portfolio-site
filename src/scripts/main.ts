/**
 * Every behaviour on the site, in one module.
 *
 * The one exception is `ThemeToggle.astro`, which keeps its own script: it is
 * the only behaviour that has to agree with `public/theme-init.js`, the file
 * that runs before first paint (D-018), and keeping the two together is worth
 * one more bundle.
 *
 * One module rather than one per feature: separate `<script>` blocks mean a
 * bundle and a CSP hash each, on every build, for behaviour that always runs
 * together. It also fixes a real defect — the previous files had
 * no imports or exports, so TypeScript treated them as global scripts and
 * their top-level `const reduce` declarations collided (D-035).
 *
 * `prefers-reduced-motion` is read once here and passed down, so the whole
 * page agrees about it.
 */
import { reveal } from './reveal';
import { currentSection } from './nav';
import { roadmap } from './roadmap';
import { shelf } from './shelf';
import { openLine } from './open-line';
import { contactForm } from './contact-form';
import { offTheClock } from './off-the-clock';
import { rotate } from './rotator';
import { character } from './character';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

reveal(reduce);
currentSection();
roadmap();
shelf(reduce);
openLine();
contactForm();
offTheClock();
rotate(reduce);
character(reduce);
