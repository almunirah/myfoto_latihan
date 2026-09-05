import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const appRoot = resolve(here, '../..');
const required = ['index.html', 'app.js', 'styles.css', 'login-fix.js', 'updates-v2.js', 'assets/logo.svg'];
const missing = required.filter((file) => !existsSync(resolve(appRoot, file)));

if (missing.length) {
  console.error('Naskhah Studio runtime check FAILED. Missing:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

const index = readFileSync(resolve(appRoot, 'index.html'), 'utf8');
const app = readFileSync(resolve(appRoot, 'app.js'), 'utf8');
const loginFix = readFileSync(resolve(appRoot, 'login-fix.js'), 'utf8');

const checks = [
  ['Supabase JS v2 CDN', index.includes('@supabase/supabase-js@2')],
  ['JSZip 3.10.1 CDN', index.includes('jszip@3.10.1')],
  ['Supabase client initialization', app.includes('createClient')],
  ['Supabase project URL', app.includes('.supabase.co')],
  ['nv1_profiles usage', app.includes("from('nv1_profiles')")],
  ['nv1_projects usage', app.includes("from('nv1_projects')")],
  ['Login Edge Function usage', loginFix.includes('/functions/v1/naskhah-login')],
  ['No PHP runtime entry point', !existsSync(resolve(appRoot, 'index.php'))],
  ['No Composer manifest', !existsSync(resolve(appRoot, 'composer.json'))]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FAIL'} - ${name}`);
  if (!ok) failed = true;
}

if (failed) process.exit(1);
console.log('\nRuntime stack matches the documented Phase 1.5 baseline.');
