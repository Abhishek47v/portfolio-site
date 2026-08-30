/**
 * Colour may only be declared in tokens.css. Everything else references a role.
 * This is the gate that keeps the day/night system from drifting (D-013).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const ALLOW = new Set(['src/styles/tokens.css', 'src/styles/fonts.css']);
const EXT = /\.(astro|css|ts|js|mjs)$/;
const COLOUR = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(\s*[\d.]/g;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist' || entry === '.astro') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (EXT.test(entry)) out.push(full);
  }
  return out;
}

const violations = [];
for (const file of [...walk(join(ROOT, 'src')), ...walk(join(ROOT, 'public'))]) {
  const rel = relative(ROOT, file);
  if (ALLOW.has(rel)) continue;
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (line.trimStart().startsWith('*') || line.trimStart().startsWith('//')) return;
    const hits = line.match(COLOUR);
    if (hits) violations.push(`${rel}:${i + 1}  ${hits.join(', ')}`);
  });
}

if (violations.length) {
  console.error('Colour literals found outside tokens.css:\n');
  for (const v of violations) console.error('  ' + v);
  console.error('\nUse a token role instead. See docs/06-architecture.md §7.');
  process.exit(1);
}
console.log('tokens gate: ok — no colour literals outside tokens.css');
