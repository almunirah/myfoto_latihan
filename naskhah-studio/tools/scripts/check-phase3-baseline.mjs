import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
const indexPath = path.join(root, 'index.html');
const corePath = path.join(root, 'js/core/runtime.js');

function fail(message) {
  console.error(`Phase 3 baseline check failed: ${message}`);
  process.exit(1);
}

function syntaxOk(file) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`syntax error in ${file}: ${(result.stderr || result.stdout || '').trim()}`);
}

if (!fs.existsSync(appPath)) fail('app.js is missing');
if (!fs.existsSync(indexPath)) fail('index.html is missing');
if (!fs.existsSync(corePath)) fail('js/core/runtime.js is missing');

syntaxOk('app.js');
syntaxOk('js/core/runtime.js');
syntaxOk('js/auth/login.js');
syntaxOk('js/modules/versions.js');
syntaxOk('js/admin/inactive-users.js');

const app = fs.readFileSync(appPath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');
const core = fs.readFileSync(corePath, 'utf8');

const requiredAppTokens = [
  'createClient',
  'nv1_profiles',
  'nv1_projects',
  'function saveProject',
  'function renderProject',
  'function renderAdmin'
];

for (const token of requiredAppTokens) {
  if (!app.includes(token)) fail(`required app.js token missing: ${token}`);
}

const requiredCoreTokens = [
  "window, 'NaskhahCore'",
  "supabaseUrl: 'https://nrnrmbjrczmzkgimxdun.supabase.co'",
  "authRoute: '/functions/v1/naskhah-v1-auth'",
  "profiles: 'nv1_profiles'",
  "projects: 'nv1_projects'",
  'escapeHtml(value)',
  'stripHtml(value)',
  'countWords(value)'
];

for (const token of requiredCoreTokens) {
  if (!core.includes(token)) fail(`required core runtime token missing: ${token}`);
}

const expectedScripts = [
  './js/core/runtime.js',
  './app.js',
  './js/modules/versions.js',
  './js/admin/inactive-users.js',
  './js/auth/login.js'
];

let last = -1;
for (const src of expectedScripts) {
  const needle = `src="${src}"`;
  const pos = index.indexOf(needle);
  if (pos === -1) fail(`runtime script missing from index.html: ${src}`);
  if (index.indexOf(needle, pos + needle.length) !== -1) fail(`runtime script loaded more than once: ${src}`);
  if (pos <= last) fail(`runtime script order changed around ${src}`);
  last = pos;
}

for (const legacy of ['./updates-v2.js', './login-fix.js']) {
  if (index.includes(`src="${legacy}"`)) fail(`legacy runtime patch is loaded: ${legacy}`);
}

const functionMatches = app.match(/(?:^|\n)(?:async\s+)?function\s+[A-Za-z_$][\w$]*\s*\(/g) || [];
const lineCount = app.split(/\r?\n/).length;
const byteCount = Buffer.byteLength(app, 'utf8');

console.log('Phase 3 Batch A1 baseline is intact.');
console.log('Core runtime bridge loads before app.js and does not replace existing app ownership yet.');
console.log(`app.js lines: ${lineCount}`);
console.log(`app.js bytes: ${byteCount}`);
console.log(`named functions detected: ${functionMatches.length}`);
console.log('Next step: Batch A2 migrates core ownership out of app.js after Preview verification.');
