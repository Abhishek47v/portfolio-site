/**
 * The site's only script entry.
 *
 * One module rather than four: four separate `<script>` blocks meant four
 * bundles and four CSP hashes to regenerate on every build, for behaviour that
 * always runs together. It also fixes a real defect — the previous files had
 * no imports or exports, so TypeScript treated them as global scripts and
 * their top-level `const reduce` declarations collided (D-035).
 *
 * `prefers-reduced-motion` is read once here and passed down, so the whole
 * page agrees about it.
 */
import { reveal } from './reveal';
import { currentSection } from './nav';
import { drawTimeline } from './timeline';
import { pointerLight } from './pointer-light';
import { rotate } from './rotator';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

reveal(reduce);
currentSection();
drawTimeline();
pointerLight(reduce);
rotate(reduce);
