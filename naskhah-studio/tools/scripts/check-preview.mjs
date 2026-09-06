const base = process.env.PREVIEW_URL;
if (!base) {
  console.error('PREVIEW_URL is required, e.g. PREVIEW_URL=https://example.vercel.app npm --prefix tools run preview:check');
  process.exit(2);
}

const origin = base.replace(/\/$/, '');
const paths = [
  '/',
  '/app.js',
  '/styles.css',
  '/js/auth/login.js',
  '/js/modules/versions.js',
  '/js/admin/inactive-users.js',
  '/assets/logo.svg'
];

let failed = false;
for (const path of paths) {
  try {
    const r = await fetch(origin + path, { redirect: 'follow' });
    const ok = r.ok;
    console.log(`${ok ? 'OK' : 'FAIL'} ${r.status} - ${path}`);
    if (!ok) failed = true;
  } catch (error) {
    console.log(`FAIL - ${path} - ${error.message}`);
    failed = true;
  }
}

if (!failed) {
  const html = await (await fetch(origin + '/')).text();
  const order = ['./app.js','./js/modules/versions.js','./js/admin/inactive-users.js','./js/auth/login.js'];
  let cursor = -1;
  for (const src of order) {
    const pos = html.indexOf(src);
    const ok = pos > cursor;
    console.log(`${ok ? 'OK' : 'FAIL'} - HTML load order ${src}`);
    if (!ok) failed = true;
    cursor = pos;
  }
  const legacyOk = !html.includes('./updates-v2.js') && !html.includes('./login-fix.js');
  console.log(`${legacyOk ? 'OK' : 'FAIL'} - legacy patches are not loaded by preview HTML`);
  if (!legacyOk) failed = true;
}

if (failed) process.exit(1);
console.log('\nPreview static smoke check passed. Authenticated user/admin flows still require a disposable test account and browser regression test.');
