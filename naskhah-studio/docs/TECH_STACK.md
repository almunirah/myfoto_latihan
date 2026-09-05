# Naskhah Studio — Verified Technology Stack

This document records the technology actually used by the current production application. It is based on the runtime files in this repository and should be updated whenever the architecture changes.

## Frontend
- HTML5: `index.html`
- CSS: `styles.css`
- Vanilla JavaScript: `app.js`, `updates-v2.js`, `login-fix.js`
- Supabase JavaScript client v2 loaded from jsDelivr CDN
- JSZip 3.10.1 loaded from jsDelivr CDN

## Backend services
- Supabase is the application backend platform.
- Authentication/session handling uses Supabase Auth plus project Edge Function endpoints.
- The current frontend references these Edge Function routes:
  - `/functions/v1/naskhah-v1-auth`
  - `/functions/v1/naskhah-login`
- The Edge Function source code is not currently stored inside this frontend repository, so its implementation language/source should not be guessed from this repo alone.

## Database
- Supabase uses PostgreSQL, not MySQL.
- Current application tables referenced by the app/documentation include:
  - `nv1_profiles`
  - `nv1_projects`
  - `nv1_project_metadata`
- Private storage bucket: `naskhah-media`
- Frontend data access currently uses the Supabase JavaScript API rather than raw SQL embedded in browser code.

## Hosting
- Frontend hosting: Vercel
- Production directory: `naskhah-studio/`
- Primary domain: `www.naskhahstudio.com`
- Apex domain: `naskhahstudio.com` redirects to the `www` domain.

## PHP status
PHP is NOT part of the current Naskhah Studio runtime.

Therefore the following are not valid commands for the current application:
- `php artisan serve`
- `php artisan migrate`
- `composer install`

There is currently no Laravel framework, `index.php`, `artisan`, or Composer application manifest in the production app folder.

If PHP/Laravel is introduced in the future, it must be treated as an explicit architecture migration, not documented as if it already exists.

## Node.js status
Node.js is not required by the browser runtime. Phase 1.5 adds isolated development tooling under `tools/` only. Keeping the tooling package outside the application root avoids intentionally changing the current Vercel static deployment model.

## SQL status
SQL remains relevant because the backend database is PostgreSQL. Database schema and migration SQL should be stored and versioned separately from frontend JavaScript when verified against the live Supabase project. Do not invent MySQL syntax or Laravel migrations for the present architecture.
