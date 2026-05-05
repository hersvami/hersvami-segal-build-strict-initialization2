// split-dump.mjs
// Splits segal-dump.txt into chunk files, each ≤ MAX_LINES lines,
// always cutting on a "===== FILE: ... =====" boundary so no
// individual file is split across two chunks.

import { readFileSync, writeFileSync } from 'fs';

const INPUT     = 'segal-dump.txt';
const MAX_LINES = 1800;           // safe under the 2000-line read cap
const PREFIX    = 'segal-dump-chunk-';

const text = readFileSync(INPUT, 'utf8');
const lines = text.split('\n');

// Find indices of every file marker line.
const FILE_RE = /^===== FILE: .+ =====$/;
const markerIdx = [];
for (let i = 0; i < lines.length; i++) {
  if (FILE_RE.test(lines[i])) markerIdx.push(i);
}
markerIdx.push(lines.length);   // sentinel = EOF

// Greedy pack file-blocks into chunks of ≤ MAX_LINES.
const chunks = [];      // each entry = [startLine, endLineExclusive]
let chunkStart = 0;
let cursor     = 0;

for (let m = 0; m < markerIdx.length - 1; m++) {
  const blockStart = markerIdx[m];
  const blockEnd   = markerIdx[m + 1];     // start of next file (exclusive)
  const blockLen   = blockEnd - blockStart;

  if (blockLen > MAX_LINES) {
    console.error(
      `WARNING: single source file at line ${blockStart + 1} is ` +
      `${blockLen} lines — larger than MAX_LINES (${MAX_LINES}). ` +
      `It will get its own oversized chunk; AI will need to read it in two passes.`
    );
  }

  // If adding this whole block would exceed the chunk budget, flush current chunk.
  if (cursor > chunkStart && (blockEnd - chunkStart) > MAX_LINES) {
    chunks.push([chunkStart, cursor]);
    chunkStart = cursor;
  }
  cursor = blockEnd;
}
if (cursor > chunkStart) chunks.push([chunkStart, cursor]);

// Write chunk files.
const pad = String(chunks.length).length;
chunks.forEach(([s, e], i) => {
  const name  = `${PREFIX}${String(i + 1).padStart(pad, '0')}.txt`;
  const body  = lines.slice(s, e).join('\n');
  writeFileSync(name, body, 'utf8');

  // Count files contained in this chunk.
  const n = lines.slice(s, e).filter(l => FILE_RE.test(l)).length;
  console.log(
    `${name}: lines ${s + 1}–${e}  (${e - s} lines, ${(body.length/1024).toFixed(1)} KB, ${n} files)`
  );
});

console.log(`\nTotal: ${chunks.length} chunk files written.`);