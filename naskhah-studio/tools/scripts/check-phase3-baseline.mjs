import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
const indexPath = path.join(root, 'index.html');

function fail(message) {
  console.error(`Phase 3 baseline check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(appPath)) fail('app.js is missing');
if (!fs.existsSync(indexPath)) fail('index.html is missing');

const app = fs.readFileSync(appPath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');

const requiredTokens = [
  "createClient",
  "nv1_profiles",
  "nv1_projects",
  "function saveProject",
  "function renderProject",
  "function renderAdmin"
];

for (const token of requiredTokens) {
  if (!app.includes(token)) fail(`required app.js token missing: ${token}`);
}

const expectedScripts = [
  './app.js',
  './js/modules/versions.js',
  './js/admin/inactive-users.js',
  './js/auth/login.js'
];

let last = -1;
for (const src of expectedScripts) {
  const pos = index.indexOf(`src="${src}"`);
  if (pos === -1) fail(`runtime script missing from index.html: ${src}`);
  if (pos <= last) fail(`runtime script order changed around ${src}`);
  last = pos;
}

for (const legacy of ['./updates-v2.js', './login-fix.js']) {
  if (index.includes(`src="${legacy}"`)) fail(`legacy runtime patch is loaded: ${legacy}`);
}

const functionMatches = app.match(/(?:^|\n)(?:async\s+)?function\s+[A-Za-z_$][\w$]*\s*\(/g) || [];
const lineCount = app.split(/\r?\n/).length;
const byteCount = Buffer.byteLength(app, 'utf8');

console.log('Phase 3 baseline is intact.');
console.log(`app.js lines: ${lineCount}`);
console.log(`app.js bytes: ${byteCount}`);
console.log(`named functions detected: ${functionMatches.length}`);
console.log('Next step: extract one responsibility batch at a time and update this guard with the new ownership map.');
