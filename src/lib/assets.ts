import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PUBLIC_DIR = fileURLToPath(new URL('../../public/', import.meta.url));

/**
 * True when a file actually exists in public/ at build time.
 *
 * The site links to two things that arrive later — a résumé and an audio
 * track. Rather than a flag to remember to flip, the build looks: drop the
 * file in and the control appears; no file, no broken link. Nothing to
 * configure and nothing to forget.
 */
export function hasPublicFile(path: string): boolean {
  return existsSync(PUBLIC_DIR + path.replace(/^\//, ''));
}

/**
 * True when a link is worth rendering.
 *
 * A résumé now lives either in public/ or behind an external URL (Drive and
 * the like), and the social links are external by definition. The rule is the
 * same as hasPublicFile's: nothing renders until there is something real
 * behind it, so an unfinished link is an absent control rather than a 404.
 * An absolute URL is taken at face value — the build cannot check it, and a
 * network request at build time to find out is not a trade worth making.
 */
export function hasLink(value: string | null | undefined): boolean {
  if (!value) return false;
  if (/^https?:\/\//i.test(value)) return true;
  return hasPublicFile(value);
}
