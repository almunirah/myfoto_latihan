import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = fileURLToPath(new URL('.', import.meta.url));
const appRoot = resolve(here, '../..');
const required = [
  'index.html',
  'app.js',
  'styles.css',
  'js/auth/login.js',
  'js/modules/versions.js',
  'js/admin/inactive-users.js',
  'assets/logo.svg'
];
const missing = required.filter((file) => !existsSync(resolve(appRoot, file)));

if (missing.length) {
  console.error('Naskhah Studio runtime check FAILED. Missing:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

const read = (file) => readFileSync(resolve(appRoot, file), 'utf8');
const index = read('index.html');
const app = read('app.js');
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

function ordered(indexText, parts) {
  let cursor = -1;
  for (const part of parts) {
    const next = indexText.indexOf(part);
    if (next === -1 || next <= cursor) return false;
    cursor = next;
  }
  return true;
}

function occursOnce(text, needle) {
  const first = text.indexOf(needle);
  return first !== -1 && text.indexOf(needle, first + needle.length) === -1;
}

const checks = [
  ['Syntax: app.js', syntaxOk('app.js')],
  ['Syntax: auth module', syntaxOk('js/auth/login.js')],
  ['Syntax: versions module', syntaxOk('js/modules/versions.js')],
  ['Syntax: admin module', syntaxOk('js/admin/inactive-users.js')],
  ['Supabase JS v2 CDN', index.includes('@supabase/supabase-js@2')],
  ['JSZip 3.10.1 CDN', index.includes('jszip@3.10.1')],
  ['Supabase client initialization', app.includes('createClient')],
  ['Supabase project URL', app.includes('.supabase.co')],
  ['Core setSession exists', /async\s+function\s+setSession\s*\(/.test(app)],
  ['Core enterApp exists', /async\s+function\s+enterApp\s*\(/.test(app)],
  ['Core saveProject exists', /async\s+function\s+saveProject\s*\(/.test(app)],
  ['Core renderProject exists', /function\s+renderProject\s*\(/.test(app)],
  ['Core renderAdmin exists', /async\s+function\s+renderAdmin\s*\(/.test(app) || /function\s+renderAdmin\s*\(/.test(app)],
  ['nv1_profiles usage', app.includes("from('nv1_profiles')") || inactiveUsers.includes("from('nv1_profiles')")],
  ['nv1_projects usage', app.includes("from('nv1_projects')")],
  ['Login Edge Function usage', login.includes('/functions/v1/naskhah-login')],
  ['Login calls setSession', login.includes('await setSession(')],
  ['User suspension guard preserved', login.includes("state.profile.status==='suspended'")],
  ['Admin role guard preserved', login.includes("state.profile?.role!=='admin'")],
  ['Versions module loaded', index.includes('./js/modules/versions.js') && versions.includes('window.versionsView')],
  ['Versions bind hook preserved', versions.includes('window.bindTab=function') && versions.includes("tab==='versions'")],
  ['Versions persistence preserved', versions.includes('await saveProject()')],
  ['Admin module loaded', index.includes('./js/admin/inactive-users.js') && inactiveUsers.includes('window.renderAdmin')],
  ['Inactive threshold preserved', inactiveUsers.includes('90*86400000')],
  ['Admin delete action preserved', inactiveUsers.includes("action:'admin_delete_user'")],
  ['Auth module loaded', index.includes('./js/auth/login.js')],
  ['Runtime load order correct', ordered(index, ['./app.js','./js/modules/versions.js','./js/admin/inactive-users.js','./js/auth/login.js'])],
  ['Versions module loaded once', occursOnce(index, './js/modules/versions.js')],
  ['Admin module loaded once', occursOnce(index, './js/admin/inactive-users.js')],
  ['Auth module loaded once', occursOnce(index, './js/auth/login.js')],
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
console.log('\nRuntime stack matches the strict Phase 2 modular baseline.');
