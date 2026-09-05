# Naskhah Studio — Development Commands

The current application is a static HTML/CSS/JavaScript frontend. Production does not require PHP, Composer, Laravel Artisan, or a Node build step.

## Prerequisites for local development tooling
- Node.js 18 or newer
- npm

From the `naskhah-studio/` directory:

```bash
npm --prefix tools install
```

Start a local development server:

```bash
npm --prefix tools run dev
```

Then open:

```text
http://localhost:4173
```

Run the repository/runtime stack check:

```bash
npm --prefix tools run check
```

Equivalent command:

```bash
npm --prefix tools run stack:check
```

## What the check verifies
- Required runtime files still exist.
- Supabase JS v2 is still referenced.
- JSZip 3.10.1 is still referenced.
- Supabase client initialization is present.
- `nv1_profiles` and `nv1_projects` are still used by the current frontend.
- The login Edge Function route is still referenced.
- No PHP `index.php` or Composer manifest has accidentally appeared in the current static app architecture.

## Production deployment
There is intentionally no `npm run build` command for the current production frontend because no bundling/build system is used by the live application today. Vercel serves the existing static files.

Do not add a fake build step simply to make the project look like Laravel, React, Next.js, or Vite. If a build framework is adopted later, introduce it in a separate migration phase with preview testing first.

## Commands that do NOT apply today

```bash
php artisan serve
php artisan migrate
composer install
npm run build
```

These commands become valid only if the corresponding technology is actually introduced and configured.
