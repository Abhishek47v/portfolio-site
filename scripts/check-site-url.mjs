/**
 * Refuse to deploy a build that does not know its own address.
 *
 * `astro.config.mjs` falls back to http://localhost:4321 when SITE_URL is
 * unset, which is right for a local build and catastrophic for a published
 * one: every canonical link and every sitemap entry would point at a machine
 * nobody can reach, and search engines would index it that way.
 *
 * The check is on the artifact rather than on the environment, because that is
 * the thing actually being shipped — an env var can be set and still not reach
 * the build. Wired into `npm run deploy`, which is what Workers Builds runs.
 */
import { readFileSync } from 'node:fs';

const SITEMAP = 'dist/sitemap-0.xml';

let xml;
try {
  xml = readFileSync(SITEMAP, 'utf8');
} catch {
  console.error(
    `\n  ${SITEMAP} is missing. Run \`npm run build\` before deploying.\n`,
  );
  process.exit(1);
}

const origin = xml.match(/<loc>(https?:\/\/[^/<]+)/)?.[1];

if (!origin || origin.includes('localhost')) {
  console.error(
    `\n  This build thinks it lives at ${origin ?? 'nowhere'}.\n\n` +
      `  Set SITE_URL to the deployed origin and build again. On Cloudflare\n` +
      `  that is Settings > Build > Build variables and secrets. Deploying\n` +
      `  now would publish ${origin ?? 'invalid'} as every canonical URL.\n`,
  );
  process.exit(1);
}

console.log(`  site origin ${origin}`);
