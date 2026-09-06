import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
let lines = fs.readFileSync(appPath, 'utf8').split(/\r?\n/);

const removePrefixes = [
  'async function authCall(',
  'async function setSession(',
  'async function loadProfile(',
  'async function loadProjects('
];

const before = lines.length;
const removed = [];
lines = lines.filter((line) => {
  const hit = removePrefixes.find((prefix) => line.startsWith(prefix));
  if (hit) removed.push(hit);
  return !hit;
});

if (removed.length !== removePrefixes.length) {
  throw new Error(`Expected ${removePrefixes.length} core duplicates, removed ${removed.length}: ${removed.join(', ')}`);
}

const stateIndex = lines.findIndex((line) => line.startsWith('let state='));
if (stateIndex === -1) throw new Error('Shared state declaration not found.');
lines[stateIndex] = 'let state=window.NaskhahCore.createState();';
lines.splice(stateIndex + 1, 0, 'let authCall,setSession,loadProfile,loadProjects;');

const out = lines.join('\n');
if (!out.includes('let authCall,setSession,loadProfile,loadProjects;')) throw new Error('Core binding placeholders missing.');
if (removePrefixes.some((prefix) => out.includes(prefix))) throw new Error('A legacy core implementation remains.');

fs.writeFileSync(appPath, out);
console.log(`app.js core cleanup complete: ${before} -> ${lines.length} lines.`);
