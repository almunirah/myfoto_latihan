import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
let lines = fs.readFileSync(appPath, 'utf8').split(/\r?\n/);

const removePrefixes = [
  'async function renderProfile(',
  'function bindGlobal('
];

const removed = [];
lines = lines.filter((line) => {
  const hit = removePrefixes.find((prefix) => line.startsWith(prefix));
  if (hit) removed.push(hit);
  return !hit;
});

if (removed.length !== removePrefixes.length) {
  throw new Error(`Expected ${removePrefixes.length} profile/app-shell duplicates, removed ${removed.length}: ${removed.join(', ')}`);
}

const anchor = lines.findIndex((line) => line.startsWith('let projectCard,renderDashboard,reminderCentre,renderProjects,openCreate,createProject,normalizeProject,openProject;'));
if (anchor === -1) throw new Error('Dashboard/project binding placeholder anchor not found.');
const placeholder = 'let renderProfile,bindGlobal;';
if (!lines.includes(placeholder)) lines.splice(anchor + 1, 0, placeholder);

const out = lines.join('\n');
if (!out.includes(placeholder)) throw new Error('Profile/app-shell binding placeholders missing.');
if (removePrefixes.some((prefix) => out.includes(prefix))) throw new Error('A legacy profile/app-shell implementation remains.');

fs.writeFileSync(appPath, out);
console.log(`app.js profile/app-shell cleanup complete. Removed ${removed.length} duplicate implementations.`);
