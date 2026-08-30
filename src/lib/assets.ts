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
