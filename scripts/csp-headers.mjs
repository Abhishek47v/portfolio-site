/**
 * Astro inlines small module scripts into the HTML, and the CSP is
 * script-src 'self' (D-018) — which would block them. Rather than weakening
 * the policy with 'unsafe-inline', the hashes are computed from the actual
 * build output and written into dist/_headers. Nothing to maintain by hand:
 * edit a script, the hash follows.
 */
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const TEMPLATE = join(ROOT, 'public', '_headers');
const PLACEHOLDER = '{{SCRIPT_HASHES}}';

function html(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...html(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const hashes = new Set();
const INLINE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;

for (const file of html(DIST)) {
  const source = readFileSync(file, 'utf8');
  for (const match of source.matchAll(INLINE)) {
    const body = match[1];
    if (!body.trim()) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
}

const template = readFileSync(TEMPLATE, 'utf8');
if (!template.includes(PLACEHOLDER)) {
  console.error(`csp: ${PLACEHOLDER} missing from public/_headers`);
  process.exit(1);
}

writeFileSync(join(DIST, '_headers'), template.replace(PLACEHOLDER, [...hashes].join(' ')));
console.log(`csp: ${hashes.size} inline script hash(es) written to dist/_headers`);
