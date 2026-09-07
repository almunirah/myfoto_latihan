import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const runtimePath = path.join(root, 'tools/scripts/check-runtime.mjs');
const phase3Path = path.join(root, 'tools/scripts/check-phase3-baseline.mjs');

let runtime = fs.readFileSync(runtimePath, 'utf8');
if (!runtime.includes("'js/modules/tab-router.js'")) {
  runtime = runtime.replace("  'js/modules/writer.js',\n  'js/modules/overview-tracking.js',", "  'js/modules/writer.js',\n  'js/modules/tab-router.js',\n  'js/modules/overview-tracking.js',");
}
if (!runtime.includes("const tabRouter = read('js/modules/tab-router.js');")) {
  runtime = runtime.replace("const projectShell = read('js/modules/project-shell.js');", "const projectShell = read('js/modules/project-shell.js');\nconst tabRouter = read('js/modules/tab-router.js');");
}
if (!runtime.includes("Tab router owns base writing route")) {
  runtime = runtime.replace("  ['Project shell owns project word/progress helpers', projectShell.includes('projectWords = (p) =>') && projectShell.includes('projectPct = (p) =>')],", "  ['Project shell owns project word/progress helpers', projectShell.includes('projectWords = (p) =>') && projectShell.includes('projectPct = (p) =>')],\n  ['Tab router owns base writing route', tabRouter.includes('bindTab = (tab) =>') && tabRouter.includes(\"tab === 'writing'\") && tabRouter.includes('bindWriter(state.current)')],\n  ['Tab router contract marker', tabRouter.includes(\"window, 'NaskhahTabRouterModule'\")],");
}
runtime = runtime.replace('Runtime stack matches the strict Phase 3 I2 modular contract while preserving Phase 2 behavior.', 'Runtime stack matches the strict Phase 3 J1 modular contract while preserving Phase 2 behavior.');
fs.writeFileSync(runtimePath, runtime);

let phase3 = fs.readFileSync(phase3Path, 'utf8');
if (!phase3.includes("tabRouter: 'js/modules/tab-router.js'")) {
  phase3 = phase3.replace("  writer: 'js/modules/writer.js',\n  overview:", "  writer: 'js/modules/writer.js',\n  tabRouter: 'js/modules/tab-router.js',\n  overview:");
}
if (!phase3.includes("tabRouter: ['bindTab = (tab) =>'")) {
  phase3 = phase3.replace("  writer: ['writingView = (p) =>','bindWriter = (p) =>','openTableDialog = (ed) =>','uploadImage = async (p, ed, file) =>','hydrateImages = async (ed) =>',\"from('naskhah-media')\",\"document.execCommand('undo')\",\"document.execCommand('redo')\",\"window, 'NaskhahWriterModule'\"],", "  writer: ['writingView = (p) =>','bindWriter = (p) =>','openTableDialog = (ed) =>','uploadImage = async (p, ed, file) =>','hydrateImages = async (ed) =>',\"from('naskhah-media')\",\"document.execCommand('undo')\",\"document.execCommand('redo')\",\"window, 'NaskhahWriterModule'\"],\n  tabRouter: ['bindTab = (tab) =>',\"tab === 'writing'\",'bindWriter(state.current)',\"window, 'NaskhahTabRouterModule'\"],");
}
if (!phase3.includes("'./js/modules/tab-router.js'")) {
  phase3 = phase3.replace("  './js/modules/writer.js',\n  './js/modules/overview-tracking.js',", "  './js/modules/writer.js',\n  './js/modules/tab-router.js',\n  './js/modules/overview-tracking.js',");
}
phase3 = phase3.replace("console.log('Phase 3 Cleanup I2 bootstrap/auth orchestration contract is intact.');", "console.log('Phase 3 J1 tab-router ownership contract is intact.');");
phase3 = phase3.replace("console.log('Admin runtime and bootstrap/auth orchestration are module-owned; duplicated legacy implementations are physically absent from app.js.');", "console.log('Base writing-tab routing is module-owned while the legacy bindTab body remains temporarily available for separately gated J2 cleanup.');");
phase3 = phase3.replace("console.log('Next step: keep bindTab/version wrapper cleanup separately gated, then run final authenticated browser smoke before merge.');", "console.log('Next step: verify J1 in Preview, then perform separately gated J2 legacy bindTab removal before Versions wrapper cleanup.');");
fs.writeFileSync(phase3Path, phase3);

console.log('Phase 3 J1 tab-router guard activation complete.');
