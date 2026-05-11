import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const EXTS = new Set(['.ts', '.tsx', '.css', '.html', '.json']);
const SKIP_DIRS = new Set(['node_modules', 'dist', 'build', '.git', '.firebase', '.vite', '.next']);
const SKIP_FILES = new Set(['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml', 'segal-dump.txt', 'dump.mjs', 'split-dump.mjs']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || SKIP_FILES.has(name) || name.startsWith('segal-dump-chunk-')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (EXTS.has(name.slice(name.lastIndexOf('.')))) out.push(full);
  }
  return out;
}

const files = walk(process.cwd()).sort();
const dump = files.map(f => `\n===== FILE: ${relative(process.cwd(), f).replaceAll('\\', '/')} =====\n${readFileSync(f, 'utf8')}`).join('\n');
writeFileSync('segal-dump.txt', dump, 'utf8');
console.log(`✓ ${files.length} files, ${(dump.length / 1024).toFixed(1)} KB`);
