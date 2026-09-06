import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const files = {
  app: 'app.js',
  index: 'index.html',
  core: 'js/core/runtime.js',
  cutover: 'js/core/cutover.js',
  dashboard: 'js/modules/dashboard.js',
  projects: 'js/modules/projects.js',
  writer: 'js/modules/writer.js',
  overview: 'js/modules/overview-tracking.js',
  workspace: 'js/modules/workspace-views.js',
  workspaceBindings: 'js/modules/workspace-bindings.js',
  profileShell: 'js/modules/profile-shell.js',
  versions: 'js/modules/versions.js',
  admin: 'js/admin/inactive-users.js',
  auth: 'js/auth/login.js'
};

function fail(message) {
  console.error(`Phase 3 baseline check failed: ${message}`);
  process.exit(1);
}

function read(file) {
  const full = path.join(root, file);
  if (!fs.existsSync(full)) fail(`${file} is missing`);
  return fs.readFileSync(full, 'utf8');
}

function syntaxOk(file) {
  const result = spawnSync(process.execPath, ['--check', path.join(root, file)], { encoding: 'utf8' });
  if (result.status !== 0) fail(`syntax error in ${file}: ${(result.stderr || result.stdout || '').trim()}`);
}

const source = {};
for (const [key, file] of Object.entries(files)) source[key] = read(file);
for (const file of Object.values(files).filter(x => x.endsWith('.js'))) syntaxOk(file);

const requiredAppTokens = ['createClient','nv1_profiles','nv1_projects','function saveProject','function renderProject','function renderAdmin'];
for (const token of requiredAppTokens) if (!source.app.includes(token)) fail(`required app.js token missing: ${token}`);

const removedLegacyCore = [
  'async function authCall(',
  'async function setSession(',
  'async function loadProfile(',
  'async function loadProjects('
];
for (const token of removedLegacyCore) if (source.app.includes(token)) fail(`Cleanup E1 regression: legacy core implementation returned: ${token}`);
if (!source.app.includes('let state=window.NaskhahCore.createState();')) fail('Cleanup E1 shared state initialization is missing.');
if (!source.app.includes('let authCall,setSession,loadProfile,loadProjects;')) fail('Cleanup E1 delegated core bindings are missing.');

const removedLegacyWriter = [
  'function writingView(',
  'function bindWriter(',
  'function openTableDialog(',
  'async function uploadImage(',
  'async function hydrateImages('
];
for (const token of removedLegacyWriter) if (source.app.includes(token)) fail(`Cleanup E2 regression: legacy writer implementation returned: ${token}`);
if (!source.app.includes('let writingView,bindWriter,openTableDialog,uploadImage,hydrateImages;')) fail('Cleanup E2 delegated writer bindings are missing.');

const requiredCoreTokens = [
  "window, 'NaskhahCore'",
  "supabaseUrl: 'https://nrnrmbjrczmzkgimxdun.supabase.co'",
  "authRoute: '/functions/v1/naskhah-v1-auth'",
  "profiles: 'nv1_profiles'",
  "projects: 'nv1_projects'",
  'createState','createServices','escapeHtml(value)','stripHtml(value)','countWords(value)'
];
for (const token of requiredCoreTokens) if (!source.core.includes(token)) fail(`required core runtime token missing: ${token}`);

const requiredCutoverTokens = [
  'state = window.NaskhahCore.createState()',
  'window.NaskhahCore.createServices',
  'authCall = (...args) => services.authCall(...args)',
  'setSession = (...args) => services.setSession(...args)',
  'loadProfile = (...args) => services.loadProfile(...args)',
  'loadProjects = (...args) => services.loadProjects(...args)',
  "window, 'NaskhahCoreServices'"
];
for (const token of requiredCutoverTokens) if (!source.cutover.includes(token)) fail(`required A2 cutover token missing: ${token}`);

const moduleChecks = {
  dashboard: ['projectCard = (p) =>','reminderCentre = () =>','renderDashboard = () =>','renderProjects = () =>',"window, 'NaskhahDashboardModule'"],
  projects: ['openCreate = () =>','createProject = async () =>','normalizeProject = (p) =>','openProject = (id) =>',"window, 'NaskhahProjectsModule'"],
  writer: ['writingView = (p) =>','bindWriter = (p) =>','openTableDialog = (ed) =>','uploadImage = async (p, ed, file) =>','hydrateImages = async (ed) =>',"from('naskhah-media')","document.execCommand('undo')","document.execCommand('redo')","window, 'NaskhahWriterModule'"],
  overview: ['overviewView = (p) =>','deadlinesView = (p) =>','specialSubmissionView = (p) =>','const bindOverview = (p) =>','bindTab = (tab) =>',"window, 'NaskhahOverviewTrackingModule'"],
  workspace: ['outlineView = (p) =>','checklistView = (p) =>','notesView = (p) =>','referencesView = (p) =>','exportView = (p) =>',"window, 'NaskhahWorkspaceViewsModule'"],
  workspaceBindings: ['const bindOutline = (p) =>','const bindChecklist = (p) =>','const bindNotes = (p) =>','const bindReferences = (p) =>','const bindExport = (p) =>','bindTab = (tab) =>',"window, 'NaskhahWorkspaceBindingsModule'"],
  profileShell: ['renderProfile = async () =>','bindGlobal = () =>','Object.assign(state, window.NaskhahCore.createState())',"window, 'NaskhahProfileShellModule'"]
};
for (const [name, tokens] of Object.entries(moduleChecks)) {
  for (const token of tokens) if (!source[name].includes(token)) fail(`required ${name} token missing: ${token}`);
}

const expectedScripts = [
  './js/core/runtime.js',
  './app.js',
  './js/core/cutover.js',
  './js/modules/dashboard.js',
  './js/modules/projects.js',
  './js/modules/writer.js',
  './js/modules/overview-tracking.js',
  './js/modules/workspace-views.js',
  './js/modules/workspace-bindings.js',
  './js/modules/profile-shell.js',
  './js/modules/versions.js',
  './js/admin/inactive-users.js',
  './js/auth/login.js'
];
let last = -1;
for (const src of expectedScripts) {
  const needle = `src="${src}"`;
  const pos = source.index.indexOf(needle);
  if (pos === -1) fail(`runtime script missing from index.html: ${src}`);
  if (source.index.indexOf(needle, pos + needle.length) !== -1) fail(`runtime script loaded more than once: ${src}`);
  if (pos <= last) fail(`runtime script order changed around ${src}`);
  last = pos;
}
for (const legacy of ['./updates-v2.js','./login-fix.js']) if (source.index.includes(`src="${legacy}"`)) fail(`legacy runtime patch is loaded: ${legacy}`);

const functionMatches = source.app.match(/(?:^|\n)(?:async\s+)?function\s+[A-Za-z_$][\w$]*\s*\(/g) || [];
console.log('Phase 3 Cleanup E2 contract is intact.');
console.log('Legacy core and writer implementations are physically absent from app.js and delegated to modules.');
console.log(`app.js lines: ${source.app.split(/\r?\n/).length}`);
console.log(`app.js bytes: ${Buffer.byteLength(source.app, 'utf8')}`);
console.log(`named functions detected: ${functionMatches.length}`);
console.log('Next step: remove the next verified duplicate ownership group in a separate reversible cleanup batch.');
