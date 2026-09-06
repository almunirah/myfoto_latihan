import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
const checkPath = path.join(root, 'tools/scripts/check-phase3-baseline.mjs');

let lines = fs.readFileSync(appPath, 'utf8').split(/\r?\n/);
const target = 'async function saveProject(';
const matches = lines.filter((line) => line.startsWith(target));
if (matches.length !== 1) throw new Error(`Expected one legacy saveProject implementation, found ${matches.length}.`);
lines = lines.filter((line) => !line.startsWith(target));

const anchor = 'let projectWords,projectPct,tabs,renderProject;';
const anchorIndex = lines.indexOf(anchor);
if (anchorIndex === -1) throw new Error('Project-shell binding anchor not found.');
if (!lines.includes('let saveProject;')) lines.splice(anchorIndex + 1, 0, 'let saveProject;');

let out = lines.join('\n');
if (out.includes(target)) throw new Error('Legacy saveProject implementation remains.');
if (!out.includes('let saveProject;')) throw new Error('saveProject compatibility binding missing.');
fs.writeFileSync(appPath, out);

let check = fs.readFileSync(checkPath, 'utf8');
check = check.replace("const requiredAppTokens = ['createClient','nv1_profiles','nv1_projects','function saveProject','function renderAdmin'];", "const requiredAppTokens = ['createClient','nv1_profiles','nv1_projects','function renderAdmin'];");
if (!check.includes("Cleanup G2 regression: legacy saveProject implementation returned")) {
  const marker = "const requiredCoreTokens = [\n";
  const guard = "const removedLegacyProjectPersistence = ['async function saveProject('];\nfor (const token of removedLegacyProjectPersistence) if (source.app.includes(token)) fail(`Cleanup G2 regression: legacy saveProject implementation returned: ${token}`);\nif (!source.app.includes('let saveProject;')) fail('Cleanup G2 delegated saveProject binding is missing.');\n\n";
  if (!check.includes(marker)) throw new Error('Phase 3 checker insertion marker missing.');
  check = check.replace(marker, guard + marker);
}
check = check.replace("console.log('Phase 3 Cleanup F2 contract is intact.');", "console.log('Phase 3 Cleanup G2 contract is intact.');");
check = check.replace("console.log('Project shell is module-owned and legacy project-shell implementations are physically absent from app.js.');", "console.log('Project persistence and project shell are module-owned; legacy saveProject/project-shell implementations are physically absent from app.js.');");
check = check.replace("console.log('G1 project persistence ownership is active; next step is separately gated physical removal of legacy saveProject.');", "console.log('Next step: preserve admin runtime and bootstrap/auth until separately owned and gated.');");
fs.writeFileSync(checkPath, check);

console.log('Phase 3 G2 project persistence cleanup complete.');
