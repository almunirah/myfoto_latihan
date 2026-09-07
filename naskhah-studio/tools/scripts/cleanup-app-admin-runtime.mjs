import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
const checkPath = path.join(root, 'tools/scripts/check-phase3-baseline.mjs');

let lines = fs.readFileSync(appPath, 'utf8').split(/\r?\n/);
const targets = [
  'async function renderAdmin(',
  'function adminCreateDialog(',
  'function adminEditDialog(',
  'function adminDeleteDialog('
];

for (const target of targets) {
  const matches = lines.filter((line) => line.startsWith(target));
  if (matches.length !== 1) throw new Error(`Expected one legacy admin implementation for ${target}, found ${matches.length}.`);
}

lines = lines.filter((line) => !targets.some((target) => line.startsWith(target)));

const anchor = 'let saveProject;';
const anchorIndex = lines.indexOf(anchor);
if (anchorIndex === -1) throw new Error('saveProject compatibility binding anchor not found.');
const binding = 'let renderAdmin,adminCreateDialog,adminEditDialog,adminDeleteDialog;';
if (!lines.includes(binding)) lines.splice(anchorIndex + 1, 0, binding);

const out = lines.join('\n');
for (const target of targets) if (out.includes(target)) throw new Error(`Legacy admin implementation remains: ${target}`);
if (!out.includes(binding)) throw new Error('Admin compatibility binding missing.');
fs.writeFileSync(appPath, out);

let check = fs.readFileSync(checkPath, 'utf8');
check = check.replace(
  "const requiredAppTokens = ['createClient','nv1_profiles','function renderAdmin'];",
  "const requiredAppTokens = ['createClient','function bindAuth','async function boot'];"
);

if (!check.includes('Cleanup H2 regression: legacy admin implementation returned')) {
  const marker = "const requiredCoreTokens = [\n";
  const guard = "const removedLegacyAdmin = [\n  'async function renderAdmin(',\n  'function adminCreateDialog(',\n  'function adminEditDialog(',\n  'function adminDeleteDialog('\n];\nfor (const token of removedLegacyAdmin) if (source.app.includes(token)) fail(`Cleanup H2 regression: legacy admin implementation returned: ${token}`);\nif (!source.app.includes('let renderAdmin,adminCreateDialog,adminEditDialog,adminDeleteDialog;')) fail('Cleanup H2 delegated admin bindings are missing.');\n\n";
  if (!check.includes(marker)) throw new Error('Phase 3 checker insertion marker missing.');
  check = check.replace(marker, guard + marker);
}

check = check.replace(
  "console.log('Phase 3 Batch H1 admin runtime ownership contract is intact.');",
  "console.log('Phase 3 Cleanup H2 admin runtime contract is intact.');"
);
check = check.replace(
  "console.log('Admin panel rendering and user-management dialogs are module-owned while legacy app.js implementations remain as rollback fallback.');",
  "console.log('Admin panel rendering and user-management dialogs are module-owned; duplicated legacy admin implementations are physically absent from app.js.');"
);
check = check.replace(
  "console.log('Next step: verify Preview/CI, then separately gate physical admin cleanup before touching bootstrap/auth wiring.');",
  "console.log('Next step: keep bootstrap/auth and bindTab/version wrapper wiring separate until their own ownership gates are proven.');"
);
fs.writeFileSync(checkPath, check);

console.log('Phase 3 H2 admin runtime cleanup complete.');
