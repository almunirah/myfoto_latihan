# Naskhah Studio Architecture

## Current production runtime
The live application currently uses the existing root runtime files (`index.html`, `app.js`, `styles.css`, `login-fix.js`, `updates-v2.js`). Phase 1 does not move, rename, import, or modify those files.

## Target structure

- `assets/branding/` — brand assets
- `css/` — future split stylesheets
- `js/core/` — app bootstrap, config, state, routing
- `js/auth/` — login, session, permissions
- `js/modules/` — writing modules
- `js/projects/` — article, thesis, book, ebook definitions
- `js/admin/` — admin dashboard and user/subscription management
- `js/services/` — Supabase, auth API, storage, export
- `js/utils/` — shared helpers
- `archive/` — retired compatibility patches after migration
- `docs/` — architecture, security, database and deployment documentation

## Migration rule
Refactoring must preserve production behaviour. Modules are migrated and tested one at a time. Runtime file movement starts only in Phase 2/3 after dependency mapping and regression tests.
