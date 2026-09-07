import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const runtimePath = path.join(root, 'tools/scripts/check-runtime.mjs');
const phase3Path = path.join(root, 'tools/scripts/check-phase3-baseline.mjs');

let runtime = fs.readFileSync(runtimePath, 'utf8');
runtime = runtime.replace(
  "['Versions bind hook preserved', versions.includes('window.bindTab=function') && versions.includes(\"tab==='versions'\")],",
  "['Versions lexical bind hook preserved', versions.includes('const oldBindTab=bindTab;') && versions.includes('bindTab=function(tab)') && versions.includes('window.bindTab=bindTab;') && versions.includes(\"tab==='versions'\")],"
);
runtime = runtime.replace(
  'Runtime stack matches the strict Phase 3 J1 modular contract while preserving Phase 2 behavior.',
  'Runtime stack matches the strict Phase 3 J1.5 modular contract while preserving Phase 2 behavior.'
);
fs.writeFileSync(runtimePath, runtime);

let phase3 = fs.readFileSync(phase3Path, 'utf8');
if (!phase3.includes("versions: ['window.versionsView=enhancedVersionsView'")) {
  phase3 = phase3.replace(
    "  adminRuntime: ['renderAdmin = async () =>','adminCreateDialog = () =>','adminEditDialog = (u) =>','adminDeleteDialog = (u) =>',\"from('nv1_profiles')\",\"from('nv1_project_metadata')\",\"action: 'admin_create_user'\",\"action: 'admin_delete_user'\",\"window, 'NaskhahAdminRuntimeModule'\"],",
    "  adminRuntime: ['renderAdmin = async () =>','adminCreateDialog = () =>','adminEditDialog = (u) =>','adminDeleteDialog = (u) =>',\"from('nv1_profiles')\",\"from('nv1_project_metadata')\",\"action: 'admin_create_user'\",\"action: 'admin_delete_user'\",\"window, 'NaskhahAdminRuntimeModule'\"],\n  versions: ['window.versionsView=enhancedVersionsView','const oldBindTab=bindTab;','bindTab=function(tab)',\"tab==='versions'\",'window.bindTab=bindTab;'],"
  );
}
phase3 = phase3.replace(
  "console.log('Phase 3 J1 tab-router ownership contract is intact.');",
  "console.log('Phase 3 J1.5 tab-router and Versions lexical wrapper contract is intact.');"
);
phase3 = phase3.replace(
  "console.log('Base writing-tab routing is module-owned while the legacy bindTab body remains temporarily available for separately gated J2 cleanup.');",
  "console.log('Base writing-tab routing is module-owned and Versions now wraps the lexical bindTab chain explicitly; the legacy app.js bindTab body remains only for separately gated J2 cleanup.');"
);
fs.writeFileSync(phase3Path, phase3);

console.log('Phase 3 J1.5 Versions lexical wrapper guard activation complete.');
