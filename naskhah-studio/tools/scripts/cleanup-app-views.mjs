import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
let lines = fs.readFileSync(appPath, 'utf8').split(/\r?\n/);

const removePrefixes = [
  'function overviewView(',
  'function deadlinesView(',
  'function specialSubmissionView(',
  'function outlineView(',
  'function checklistView(',
  'function notesView(',
  'function referencesView(',
  'function exportView('
];

const removed = [];
lines = lines.filter((line) => {
  const hit = removePrefixes.find((prefix) => line.startsWith(prefix));
  if (hit) removed.push(hit);
  return !hit;
});

if (removed.length !== removePrefixes.length) {
  throw new Error(`Expected ${removePrefixes.length} view duplicates, removed ${removed.length}: ${removed.join(', ')}`);
}

const anchor = lines.findIndex((line) => line.startsWith('let writingView,bindWriter,openTableDialog,uploadImage,hydrateImages;'));
if (anchor === -1) throw new Error('Writer binding placeholder anchor not found.');
const placeholder = 'let overviewView,deadlinesView,specialSubmissionView,outlineView,checklistView,notesView,referencesView,exportView;';
if (!lines.includes(placeholder)) lines.splice(anchor + 1, 0, placeholder);

const out = lines.join('\n');
if (!out.includes(placeholder)) throw new Error('View binding placeholders missing.');
if (removePrefixes.some((prefix) => out.includes(prefix))) throw new Error('A legacy view implementation remains.');

fs.writeFileSync(appPath, out);
console.log(`app.js view cleanup complete. Removed ${removed.length} duplicate implementations.`);
