# Naskhah Studio — Runtime Map

## Production load order

1. Supabase JS v2 CDN
2. JSZip 3.10.1 CDN
3. `app.js` — core application runtime
4. `js/modules/versions.js` — manuscript version enhancement
5. `js/admin/inactive-users.js` — inactive-user administration enhancement
6. `js/auth/login.js` — login form interception and Edge Function login

All application scripts remain classic deferred browser scripts. Their document order is preserved because later modules depend on globals created by `app.js`.

## Core globals consumed by extracted modules

### Auth module
Uses:
- `SUPABASE_URL`
- `SUPABASE_KEY`
- `sb`
- `state`
- `setSession()`
- `enterApp()`
- `toast()`

Backend route:
- `/functions/v1/naskhah-login`

### Versions module
Uses:
- `state`
- `$()` / `$$()`
- `esc()`
- `countWords()`
- `modal()` / `closeModal()`
- `saveProject()`
- `renderProject()`
- existing `bindTab()`

Overrides/enhances:
- `window.versionsView`
- `window.bindTab`

### Admin inactive-user module
Uses:
- `state`
- `sb`
- `$()` / `$$()`
- `esc()`
- `modal()` / `closeModal()`
- `toast()`
- `authCall()`
- existing `renderAdmin()`

Overrides/enhances:
- `window.renderAdmin`

Backend action currently referenced:
- `admin_delete_user`

This backend action name is preserved from the existing production enhancement. Its server-side implementation must be verified separately before changing it.

## Legacy files

`updates-v2.js` and `login-fix.js` remain in the repository during Phase 2 for rollback/reference, but `index.html` no longer loads them on the Phase 2 branch. Their behavior has been moved into named modules without intentional feature changes.

## Phase 2 boundary

Phase 2 does not split `app.js` itself. The large core file remains the authoritative application runtime. Full decomposition of `app.js` belongs to Phase 3 after this compatibility extraction is tested.