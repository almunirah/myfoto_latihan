# Phase 2 — Controlled Modular Runtime Extraction

## Objective
Move compatibility/enhancement code out of root patch files into named responsibility-based modules while preserving current application behavior.

## Changes
- `login-fix.js` behavior moved to `js/auth/login.js`.
- Version-management behavior from `updates-v2.js` moved to `js/modules/versions.js`.
- Inactive-user admin behavior from `updates-v2.js` moved to `js/admin/inactive-users.js`.
- `index.html` now loads the three responsibility-based modules after `app.js`.
- Runtime checker updated for the Phase 2 load map.
- Legacy patch files are retained temporarily for rollback/reference but are no longer loaded by `index.html` on this branch.

## Intentionally unchanged
- `app.js`
- `styles.css`
- Supabase project URL and publishable client key already used by the app
- Supabase table names
- Edge Function routes
- project schemas and manuscript data structure
- Vercel hosting model
- PostgreSQL/Supabase backend model
- domain configuration

## Required regression test before merge
1. User login works.
2. Admin login works and non-admin account cannot enter admin panel.
3. Dashboard and project list load.
4. Create/open/save project works.
5. Writing Zone save works.
6. Versions: create, open/edit, rename, copy, apply, and delete.
7. Admin panel loads.
8. Inactive-user list loads.
9. Permanent deletion is tested only with a disposable non-admin test account after backend `admin_delete_user` action is confirmed.
10. Logout works.
11. `npm --prefix tools run check` passes.

## Rollback
If preview testing shows a regression, do not patch production. Revert the Phase 2 merge or restore the previous `index.html` script references to `updates-v2.js` and `login-fix.js` while investigating the module extraction.