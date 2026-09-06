import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = fileURLToPath(new URL('.', import.meta.url));
const appRoot = resolve(here, '../..');

const runtimeFiles = [
  'js/core/runtime.js',
  'app.js',
  'js/core/cutover.js',
  'js/modules/project-persistence.js',
  'js/modules/project-shell.js',
  'js/modules/dashboard.js',
  'js/modules/projects.js',
  'js/modules/writer.js',
  'js/modules/overview-tracking.js',
  'js/modules/workspace-views.js',
  'js/modules/workspace-bindings.js',
  'js/modules/profile-shell.js',
  'js/admin/runtime.js',
  'js/modules/versions.js',
  'js/admin/inactive-users.js',
  'js/auth/login.js'
];

const required = ['index.html', 'styles.css', 'assets/logo.svg', ...runtimeFiles];
const missing = required.filter((file) => !existsSync(resolve(appRoot, file)));
if (missing.length) {
  console.error('Naskhah Studio runtime check FAILED. Missing:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

const read = (file) => readFileSync(resolve(appRoot, file), 'utf8');
const index = read('index.html');
const app = read('app.js');
const core = read('js/core/runtime.js');
const cutover = read('js/core/cutover.js');
const projectPersistence = read('js/modules/project-persistence.js');
const projectShell = read('js/modules/project-shell.js');
const profileShell = read('js/modules/profile-shell.js');
const adminRuntime = read('js/admin/runtime.js');
const login = read('js/auth/login.js');
const versions = read('js/modules/versions.js');
const inactiveUsers = read('js/admin/inactive-users.js');

function syntaxOk(file) {
  const result = spawnSync(process.execPath, ['--check', resolve(appRoot, file)], { encoding: 'utf8' });
  if (result.status !== 0) {
    console.error(`Syntax error in ${file}:`);
    console.error((result.stderr || result.stdout || '').trim());
    return false;
  }
  return true;
}

function occursOnce(text, needle) {
  const first = text.indexOf(needle);
  return first !== -1 && text.indexOf(needle, first + needle.length) === -1;
}

function exactRuntimeOrder(html, files) {
  let cursor = -1;
  for (const file of files) {
    const needle = `src="./${file}"`;
    const pos = html.indexOf(needle);
    if (pos === -1 || pos <= cursor || !occursOnce(html, needle)) return false;
    cursor = pos;
  }
  return true;
}

const syntaxChecks = runtimeFiles.map((file) => [`Syntax: ${file}`, syntaxOk(file)]);
const checks = [
  ...syntaxChecks,
  ['Supabase JS v2 CDN', index.includes('@supabase/supabase-js@2')],
  ['JSZip 3.10.1 CDN', index.includes('jszip@3.10.1')],
  ['Single app Supabase client initialization', app.includes('createClient')],
  ['Supabase project URL preserved', app.includes('.supabase.co') && core.includes('.supabase.co')],
  ['Core runtime contract loaded', core.includes("window, 'NaskhahCore'") && core.includes('createServices')],
  ['Core cutover contract loaded', cutover.includes('window.NaskhahCore.createServices')],
  ['Core setSession compatibility binding exists', /async\s+function\s+setSession\s*\(/.test(app) || /let\s+[^;]*\bsetSession\b[^;]*;/.test(app)],
  ['Core enterApp exists', /async\s+function\s+enterApp\s*\(/.test(app)],
  ['Project persistence saveProject binding exists', /let\s+[^;]*\bsaveProject\b[^;]*;/.test(app)],
  ['Project persistence owns saveProject', projectPersistence.includes('saveProject = async () =>')],
  ['Project shell renderProject binding exists', /let\s+[^;]*\brenderProject\b[^;]*;/.test(app)],
  ['Project shell owns renderProject', projectShell.includes('renderProject = (tab) =>')],
  ['Project shell owns project word/progress helpers', projectShell.includes('projectWords = (p) =>') && projectShell.includes('projectPct = (p) =>')],
  ['Admin runtime owns renderAdmin', adminRuntime.includes('renderAdmin = async () =>')],
  ['Admin runtime preserves profile and metadata sources', adminRuntime.includes("from('nv1_profiles')") && adminRuntime.includes("from('nv1_project_metadata')")],
  ['Admin create action preserved', adminRuntime.includes("action: 'admin_create_user'")],
  ['Admin delete action preserved in runtime', adminRuntime.includes("action: 'admin_delete_user'")],
  ['Profile shell owns profile rendering', profileShell.includes('renderProfile = async () =>')],
  ['Profile shell owns global shell binding', profileShell.includes('bindGlobal = () =>')],
  ['Logout preserves shared state reference', profileShell.includes('Object.assign(state, window.NaskhahCore.createState())')],
  ['nv1_profiles usage', adminRuntime.includes("from('nv1_profiles')") || inactiveUsers.includes("from('nv1_profiles')") || profileShell.includes("from('nv1_profiles')")],
  ['nv1_projects usage', projectPersistence.includes("from('nv1_projects')")],
  ['Login Edge Function usage', login.includes('/functions/v1/naskhah-login')],
  ['Login calls setSession', login.includes('await setSession(')],
  ['User suspension guard preserved', login.includes("state.profile.status==='suspended'")],
  ['Admin role guard preserved', login.includes("state.profile?.role!=='admin'")],
  ['Versions module loaded', index.includes('./js/modules/versions.js') && versions.includes('window.versionsView')],
  ['Versions bind hook preserved', versions.includes('window.bindTab=function') && versions.includes("tab==='versions'")],
  ['Versions persistence preserved', versions.includes('await saveProject()')],
  ['Inactive-user extension loaded', index.includes('./js/admin/inactive-users.js') && inactiveUsers.includes('window.renderAdmin')],
  ['Inactive threshold preserved', inactiveUsers.includes('90*86400000')],
  ['Inactive-user delete action preserved', inactiveUsers.includes("action:'admin_delete_user'")],
  ['Exact full modular runtime load order', exactRuntimeOrder(index, runtimeFiles)],
  ['Legacy updates patch not loaded', !index.includes('./updates-v2.js')],
  ['Legacy login patch not loaded', !index.includes('./login-fix.js')],
  ['No PHP runtime entry point', !existsSync(resolve(appRoot, 'index.php'))],
  ['No Composer manifest', !existsSync(resolve(appRoot, 'composer.json'))]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FAIL'} - ${name}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);
console.log('\nRuntime stack matches the strict Phase 3 H1 modular contract while preserving Phase 2 behavior.');
