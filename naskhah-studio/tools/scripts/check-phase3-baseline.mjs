import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
const indexPath = path.join(root, 'index.html');
const corePath = path.join(root, 'js/core/runtime.js');
const cutoverPath = path.join(root, 'js/core/cutover.js');
const dashboardPath = path.join(root, 'js/modules/dashboard.js');
const projectsPath = path.join(root, 'js/modules/projects.js');
const writerPath = path.join(root, 'js/modules/writer.js');

function fail(message) {
  console.error(`Phase 3 baseline check failed: ${message}`);
  process.exit(1);
}

function syntaxOk(file) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`syntax error in ${file}: ${(result.stderr || result.stdout || '').trim()}`);
}

for (const [file, full] of [
  ['app.js', appPath],
  ['index.html', indexPath],
  ['js/core/runtime.js', corePath],
  ['js/core/cutover.js', cutoverPath],
  ['js/modules/dashboard.js', dashboardPath],
  ['js/modules/projects.js', projectsPath],
  ['js/modules/writer.js', writerPath]
]) {
  if (!fs.existsSync(full)) fail(`${file} is missing`);
}

for (const file of [
  'app.js',
  'js/core/runtime.js',
  'js/core/cutover.js',
  'js/modules/dashboard.js',
  'js/modules/projects.js',
  'js/modules/writer.js',
  'js/auth/login.js',
  'js/modules/versions.js',
  'js/admin/inactive-users.js'
]) syntaxOk(file);

const app = fs.readFileSync(appPath, 'utf8');
const index = fs.readFileSync(indexPath, 'utf8');
const core = fs.readFileSync(corePath, 'utf8');
const cutover = fs.readFileSync(cutoverPath, 'utf8');
const dashboard = fs.readFileSync(dashboardPath, 'utf8');
const projects = fs.readFileSync(projectsPath, 'utf8');
const writer = fs.readFileSync(writerPath, 'utf8');

const requiredAppTokens = [
  'createClient',
  'nv1_profiles',
  'nv1_projects',
  'function saveProject',
  'function renderProject',
  'function renderAdmin'
];
for (const token of requiredAppTokens) if (!app.includes(token)) fail(`required app.js token missing: ${token}`);

const requiredCoreTokens = [
  "window, 'NaskhahCore'",
  "supabaseUrl: 'https://nrnrmbjrczmzkgimxdun.supabase.co'",
  "authRoute: '/functions/v1/naskhah-v1-auth'",
  "profiles: 'nv1_profiles'",
  "projects: 'nv1_projects'",
  'createState',
  'createServices',
  'escapeHtml(value)',
  'stripHtml(value)',
  'countWords(value)'
];
for (const token of requiredCoreTokens) if (!core.includes(token)) fail(`required core runtime token missing: ${token}`);

const requiredCutoverTokens = [
  'state = window.NaskhahCore.createState()',
  'window.NaskhahCore.createServices',
  'authCall = (...args) => services.authCall(...args)',
  'setSession = (...args) => services.setSession(...args)',
  'loadProfile = (...args) => services.loadProfile(...args)',
  'loadProjects = (...args) => services.loadProjects(...args)',
  "window, 'NaskhahCoreServices'"
];
for (const token of requiredCutoverTokens) if (!cutover.includes(token)) fail(`required A2 cutover token missing: ${token}`);

const requiredDashboardTokens = [
  'projectCard = (p) =>',
  'reminderCentre = () =>',
  'renderDashboard = () =>',
  'renderProjects = () =>',
  "window, 'NaskhahDashboardModule'"
];
for (const token of requiredDashboardTokens) if (!dashboard.includes(token)) fail(`required Batch B1 dashboard token missing: ${token}`);

const requiredProjectTokens = [
  'openCreate = () =>',
  'createProject = async () =>',
  'normalizeProject = (p) =>',
  'openProject = (id) =>',
  "window, 'NaskhahProjectsModule'"
];
for (const token of requiredProjectTokens) if (!projects.includes(token)) fail(`required Batch B2 project token missing: ${token}`);

const requiredWriterTokens = [
  'writingView = (p) =>',
  'bindWriter = (p) =>',
  'openTableDialog = (ed) =>',
  'uploadImage = async (p, ed, file) =>',
  'hydrateImages = async (ed) =>',
  "from('naskhah-media')",
  "document.execCommand('undo')",
  "document.execCommand('redo')",
  "window, 'NaskhahWriterModule'"
];
for (const token of requiredWriterTokens) if (!writer.includes(token)) fail(`required Batch C writer token missing: ${token}`);

const expectedScripts = [
  './js/core/runtime.js',
  './app.js',
  './js/core/cutover.js',
  './js/modules/dashboard.js',
  './js/modules/projects.js',
  './js/modules/writer.js',
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
console.log('Phase 3 Batch C writer/editor ownership contract is intact.');
console.log('Core, dashboard, projects and writer modules load before downstream Phase 2 feature modules.');
console.log(`app.js lines: ${app.split(/\r?\n/).length}`);
console.log(`app.js bytes: ${Buffer.byteLength(app, 'utf8')}`);
console.log(`named functions detected: ${functionMatches.length}`);
console.log('Next step: Preview regression, then remove duplicate writer implementations from app.js in a separate reversible cleanup batch.');
