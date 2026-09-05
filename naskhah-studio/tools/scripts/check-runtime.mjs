import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

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

const index = readFileSync(resolve(appRoot, 'index.html'), 'utf8');
const app = readFileSync(resolve(appRoot, 'app.js'), 'utf8');
const login = readFileSync(resolve(appRoot, 'js/auth/login.js'), 'utf8');
const versions = readFileSync(resolve(appRoot, 'js/modules/versions.js'), 'utf8');
const inactiveUsers = readFileSync(resolve(appRoot, 'js/admin/inactive-users.js'), 'utf8');

const checks = [
  ['Supabase JS v2 CDN', index.includes('@supabase/supabase-js@2')],
  ['JSZip 3.10.1 CDN', index.includes('jszip@3.10.1')],
  ['Supabase client initialization', app.includes('createClient')],
  ['Supabase project URL', app.includes('.supabase.co')],
  ['nv1_profiles usage', app.includes("from('nv1_profiles')") || inactiveUsers.includes("from('nv1_profiles')")],
  ['nv1_projects usage', app.includes("from('nv1_projects')")],
  ['Login Edge Function usage', login.includes('/functions/v1/naskhah-login')],
  ['Versions module loaded', index.includes('./js/modules/versions.js') && versions.includes('window.versionsView')],
  ['Admin module loaded', index.includes('./js/admin/inactive-users.js') && inactiveUsers.includes('window.renderAdmin')],
  ['Auth module loaded', index.includes('./js/auth/login.js')],
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
console.log('\nRuntime stack matches the documented Phase 2 modular baseline.');
