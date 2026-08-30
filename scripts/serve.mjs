/**
 * A static server for tests. `astro preview` daemonises, which makes
 * Playwright think the process exited; this stays in the foreground.
 * Node's http module is enough — no dependency needed for eight lines of MIME.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
const PORT = Number(process.env.PORT ?? 4321);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
};

createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  let path = join(DIST, normalize(url).replace(/^(\.\.[/\\])+/, ''));

  try {
    if ((await stat(path)).isDirectory()) path = join(path, 'index.html');
  } catch {
    path = join(DIST, '404.html');
    res.statusCode = 404;
  }

  try {
    const body = await readFile(path);
    res.setHeader('Content-Type', TYPES[extname(path)] ?? 'application/octet-stream');
    res.end(body);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
}).listen(PORT, () => console.log(`serving dist on http://localhost:${PORT}`));
