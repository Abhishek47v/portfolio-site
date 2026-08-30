/**
 * Lists everything still carrying placeholder copy. Deliberately a report and
 * not a failing build — provisional content is a valid state during a build,
 * but it must never be an invisible one.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const pending = [];

for (const dir of ['projects', 'roles']) {
  const base = join(ROOT, 'src/content', dir);
  for (const file of readdirSync(base)) {
    const source = readFileSync(join(base, file), 'utf8');
    if (/^provisional:\s*true\s*$/m.test(source)) pending.push(`src/content/${dir}/${file}`);
  }
}

// Read whatever is actually in src/data, so deleting a file cannot break this.
for (const file of readdirSync(join(ROOT, 'src/data'))) {
  const source = readFileSync(join(ROOT, 'src/data', file), 'utf8');
  if (source.includes('PROVISIONAL')) pending.push(`src/data/${file}`);
}

if (!pending.length) {
  console.log('content: all real. Nothing provisional left.');
} else {
  console.log(`content: ${pending.length} file(s) still carrying placeholder copy —\n`);
  for (const p of pending) console.log('  ' + p);
  console.log('\nThe site should not go public until this list is empty.');
}
