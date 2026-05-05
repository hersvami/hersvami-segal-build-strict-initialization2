import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const ROOT = process.cwd();
const EXTS = new Set(['.ts', '.tsx', '.css', '.html', '.json']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.firebase', '.vite', '.git']);
const SKIP_FILES = new Set(['package-lock.json']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || SKIP_FILES.has(name)) continue;
    const full = join(dir, name);
    const s = statSync(full);
    if (s.isDirectory()) walk(full, out);
    else if (EXTS.has(name.slice(name.lastIndexOf('.')))) out.push(full);
  }
  return out;
}

const files = walk(ROOT).sort();
const dump = files.map(f => {
  const rel = relative(ROOT, f).replaceAll('\\', '/');
  return `\n===== FILE: ${rel} =====\n${readFileSync(f, 'utf8')}`;
}).join('\n');

writeFileSync('segal-dump.txt', dump, 'utf8');
console.log(`Wrote ${files.length} files to segal-dump.txt (${dump.length} chars)`);