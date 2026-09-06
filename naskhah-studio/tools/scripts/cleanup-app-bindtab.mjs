import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const appPath = path.join(root, 'app.js');
const runtimePath = path.join(root, 'tools/scripts/check-runtime.mjs');
const phase3Path = path.join(root, 'tools/scripts/check-phase3-baseline.mjs');

let lines = fs.readFileSync(appPath, 'utf8').split(/\r?\n/);
const startMatches = lines.map((line, i) => line.startsWith('function bindTab(') ? i : -1).filter(i => i >= 0);
if (startMatches.length !== 1) throw new Error(`Expected one legacy bindTab implementation, found ${startMatches.length}.`);
const start = startMatches[0];
const end = lines.findIndex((line, i) => i > start && line.startsWith('function manuscriptText('));
if (end === -1) throw new Error('Could not find manuscriptText boundary after legacy bindTab.');
lines.splice(start, end - start);

const saveAnchor = lines.indexOf('let saveProject;');
if (saveAnchor === -1) throw new Error('saveProject binding anchor not found.');
if (!lines.includes('let bindTab;')) lines.splice(saveAnchor + 1, 0, 'let bindTab;');

const app = lines.join('\n');
if (app.includes('function bindTab(')) throw new Error('Legacy bindTab implementation remains after cleanup.');
if (!app.includes('let bindTab;')) throw new Error('bindTab compatibility binding missing after cleanup.');
fs.writeFileSync(appPath, app);

let runtime = fs.readFileSync(runtimePath, 'utf8');
if (!runtime.includes('Legacy bindTab implementation absent')) {
  runtime = runtime.replace(
    "  ['Tab router contract marker', tabRouter.includes(\"window, 'NaskhahTabRouterModule'\")],",
    "  ['Tab router contract marker', tabRouter.includes(\"window, 'NaskhahTabRouterModule'\")],\n  ['Base bindTab compatibility binding exists', /let\\s+bindTab\\s*;/.test(app)],\n  ['Legacy bindTab implementation absent', !/function\\s+bindTab\\s*\\(/.test(app)],"
  );
}
runtime = runtime.replace(
  'Runtime stack matches the strict Phase 3 J1.5 modular contract while preserving Phase 2 behavior.',
  'Runtime stack matches the strict Phase 3 J2 modular contract while preserving Phase 2 behavior.'
);
fs.writeFileSync(runtimePath, runtime);

let phase3 = fs.readFileSync(phase3Path, 'utf8');
if (!phase3.includes('Cleanup J2 regression: legacy bindTab implementation returned')) {
  const marker = 'const requiredCoreTokens = [\n';
  const guard = "const removedLegacyBindTab = ['function bindTab('];\nfor (const token of removedLegacyBindTab) if (source.app.includes(token)) fail(`Cleanup J2 regression: legacy bindTab implementation returned: ${token}`);\nif (!source.app.includes('let bindTab;')) fail('Cleanup J2 delegated bindTab binding is missing.');\n\n";
  if (!phase3.includes(marker)) throw new Error('Phase 3 checker insertion marker missing.');
  phase3 = phase3.replace(marker, guard + marker);
}
phase3 = phase3.replace(
  "console.log('Phase 3 J1.5 tab-router and Versions lexical wrapper contract is intact.');",
  "console.log('Phase 3 Cleanup J2 bindTab contract is intact.');"
);
phase3 = phase3.replace(
  "console.log('Base writing-tab routing is module-owned and Versions now wraps the lexical bindTab chain explicitly; the legacy app.js bindTab body remains only for separately gated J2 cleanup.');",
  "console.log('Base writing-tab routing and Versions lexical wrapper are module-owned; the legacy app.js bindTab body is physically absent.');"
);
phase3 = phase3.replace(
  "console.log('Next step: verify J1 in Preview, then perform separately gated J2 legacy bindTab removal before Versions wrapper cleanup.');",
  "console.log('Next step: run J2 Preview regression, then perform final authenticated browser smoke before merge.');"
);
fs.writeFileSync(phase3Path, phase3);

console.log('Phase 3 J2 bindTab cleanup complete.');
