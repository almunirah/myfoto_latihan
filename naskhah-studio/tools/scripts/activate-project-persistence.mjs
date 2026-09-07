import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const indexPath = path.join(root, 'index.html');
const checkPath = path.join(root, 'tools/scripts/check-phase3-baseline.mjs');

let index = fs.readFileSync(indexPath, 'utf8');
const persistenceSrc = './js/modules/project-persistence.js';
if (!index.includes(`src="${persistenceSrc}"`)) {
  const anchor = '<script defer src="./js/core/cutover.js"></script><script defer src="./js/modules/project-shell.js"></script>';
  if (!index.includes(anchor)) throw new Error('index.html cutover/project-shell anchor not found.');
  index = index.replace(anchor, `<script defer src="./js/core/cutover.js"></script><script defer src="${persistenceSrc}"></script><script defer src="./js/modules/project-shell.js"></script>`);
}
fs.writeFileSync(indexPath, index);

let check = fs.readFileSync(checkPath, 'utf8');
if (!check.includes("projectPersistence: 'js/modules/project-persistence.js'")) {
  check = check.replace("  cutover: 'js/core/cutover.js',\n", "  cutover: 'js/core/cutover.js',\n  projectPersistence: 'js/modules/project-persistence.js',\n");
}
if (!check.includes("projectPersistence: ['saveProject = async () =>")) {
  check = check.replace("const moduleChecks = {\n", "const moduleChecks = {\n  projectPersistence: ['saveProject = async () =>',\"from('nv1_projects')\",\"window, 'NaskhahProjectPersistenceModule'\"],\n");
}
if (!check.includes("  './js/modules/project-persistence.js',\n")) {
  check = check.replace("  './js/core/cutover.js',\n", "  './js/core/cutover.js',\n  './js/modules/project-persistence.js',\n");
}
check = check.replace("console.log('Next step: preserve saveProject, admin runtime and bootstrap/auth until separately owned and gated.');", "console.log('G1 project persistence ownership is active; next step is separately gated physical removal of legacy saveProject.');");
fs.writeFileSync(checkPath, check);

console.log('Phase 3 G1 project persistence activation complete.');
