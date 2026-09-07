import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
const phase3Path = path.join(root, 'tools/scripts/check-phase3-baseline.mjs');
const runtimePath = path.join(root, 'tools/scripts/check-runtime.mjs');

let lines = fs.readFileSync(appPath, 'utf8').split(/\r?\n/);
for (const target of ['function bindAuth(', 'async function boot(', "document.addEventListener('DOMContentLoaded',boot);"]) {
  const matches = lines.filter(line => line.startsWith(target));
  if (matches.length !== 1) throw new Error(`Expected one legacy bootstrap target ${target}, found ${matches.length}.`);
  lines = lines.filter(line => !line.startsWith(target));
}
const anchor = 'let renderAdmin,adminCreateDialog,adminEditDialog,adminDeleteDialog;';
const anchorIndex = lines.indexOf(anchor);
if (anchorIndex === -1) throw new Error('Admin binding anchor not found.');
if (!lines.includes('let bindAuth,boot;')) lines.splice(anchorIndex + 1, 0, 'let bindAuth,boot;');
let app = lines.join('\n');
for (const target of ['function bindAuth(', 'async function boot(', "document.addEventListener('DOMContentLoaded',boot);"]) {
  if (app.includes(target)) throw new Error(`Legacy bootstrap implementation remains: ${target}`);
}
fs.writeFileSync(appPath, app);

let phase3 = fs.readFileSync(phase3Path, 'utf8');
phase3 = phase3.replace("  auth: 'js/auth/login.js'\n};", "  auth: 'js/auth/login.js',\n  bootstrap: 'js/core/bootstrap.js'\n};");
phase3 = phase3.replace("const requiredAppTokens = ['createClient','function bindAuth','async function boot'];", "const requiredAppTokens = ['createClient','function enterApp'];");
if (!phase3.includes('Cleanup I2 regression: legacy bootstrap implementation returned')) {
  const marker = 'const requiredCoreTokens = [\n';
  const guard = "const removedLegacyBootstrap = ['function bindAuth(', 'async function boot(', \"document.addEventListener('DOMContentLoaded',boot);\"];\nfor (const token of removedLegacyBootstrap) if (source.app.includes(token)) fail(`Cleanup I2 regression: legacy bootstrap implementation returned: ${token}`);\nif (!source.app.includes('let bindAuth,boot;')) fail('Cleanup I2 delegated bootstrap bindings are missing.');\n\n";
  if (!phase3.includes(marker)) throw new Error('Phase 3 bootstrap guard insertion marker missing.');
  phase3 = phase3.replace(marker, guard + marker);
}
phase3 = phase3.replace("  adminRuntime: ['renderAdmin = async () =>','adminCreateDialog = () =>','adminEditDialog = (u) =>','adminDeleteDialog = (u) =>',\"from('nv1_profiles')\",\"from('nv1_project_metadata')\",\"action: 'admin_create_user'\",\"action: 'admin_delete_user'\",\"window, 'NaskhahAdminRuntimeModule'\"]\n};", "  adminRuntime: ['renderAdmin = async () =>','adminCreateDialog = () =>','adminEditDialog = (u) =>','adminDeleteDialog = (u) =>',\"from('nv1_profiles')\",\"from('nv1_project_metadata')\",\"action: 'admin_create_user'\",\"action: 'admin_delete_user'\",\"window, 'NaskhahAdminRuntimeModule'\"],\n  bootstrap: ['bindAuth = () =>','boot = async () =>',\"document.addEventListener('DOMContentLoaded', boot)\",\"window, 'NaskhahBootstrapModule'\"]\n};");
phase3 = phase3.replace("  './js/auth/login.js'\n];", "  './js/auth/login.js',\n  './js/core/bootstrap.js'\n];");
phase3 = phase3.replace("console.log('Phase 3 Cleanup H2 admin runtime contract is intact.');", "console.log('Phase 3 Cleanup I2 bootstrap/auth orchestration contract is intact.');");
phase3 = phase3.replace("console.log('Admin panel rendering and user-management dialogs are module-owned; duplicated legacy admin implementations are physically absent from app.js.');", "console.log('Admin runtime and bootstrap/auth orchestration are module-owned; duplicated legacy implementations are physically absent from app.js.');");
phase3 = phase3.replace("console.log('Next step: keep bootstrap/auth and bindTab/version wrapper wiring separate until their own ownership gates are proven.');", "console.log('Next step: keep bindTab/version wrapper cleanup separately gated, then run final authenticated browser smoke before merge.');");
fs.writeFileSync(phase3Path, phase3);

let runtime = fs.readFileSync(runtimePath, 'utf8');
runtime = runtime.replace("  'js/auth/login.js'\n];", "  'js/auth/login.js',\n  'js/core/bootstrap.js'\n];");
runtime = runtime.replace("const inactiveUsers = read('js/admin/inactive-users.js');", "const inactiveUsers = read('js/admin/inactive-users.js');\nconst bootstrap = read('js/core/bootstrap.js');");
if (!runtime.includes('Bootstrap owns startup orchestration')) {
  const marker = "  ['Versions module loaded', index.includes('./js/modules/versions.js') && versions.includes('window.versionsView')],";
  const checks = "  ['Bootstrap compatibility bindings exist', /let\\s+[^;]*\\bbindAuth\\b[^;]*\\bboot\\b[^;]*;/.test(app)],\n  ['Bootstrap owns auth form wiring', bootstrap.includes('bindAuth = () =>')],\n  ['Bootstrap owns startup orchestration', bootstrap.includes('boot = async () =>') && bootstrap.includes(\"document.addEventListener('DOMContentLoaded', boot)\")],\n";
  if (!runtime.includes(marker)) throw new Error('Runtime bootstrap check insertion marker missing.');
  runtime = runtime.replace(marker, checks + marker);
}
runtime = runtime.replace("console.log('\\nRuntime stack matches the strict Phase 3 H1 modular contract while preserving Phase 2 behavior.');", "console.log('\\nRuntime stack matches the strict Phase 3 I2 modular contract while preserving Phase 2 behavior.');");
fs.writeFileSync(runtimePath, runtime);

console.log('Phase 3 I2 bootstrap/auth cleanup complete.');
