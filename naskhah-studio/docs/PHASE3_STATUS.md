# Phase 3 Status

- Branch: `naskhah-phase3-app-modularization`
- Production `main`: unchanged by Phase 3 work until PR merge
- Phase 2 modular runtime: preserved
- Phase 3 execution plan / module map / CI guards: active
- Batch A1/A2 core bridge + shared state/service cutover: completed
- Batch B1 dashboard/project-list extraction: completed
- Batch B2 project lifecycle extraction: completed
- Batch C writer/editor extraction: completed
- Batch D1 secondary workspace views extraction: completed
- Batch D2 overview/deadlines/submission tracking extraction: completed
- Batch D3 workspace tab bindings extraction: completed
- Batch D4 profile/app-shell extraction: completed
- Cleanup E1 core duplicate removal from `app.js`: completed
- Cleanup E2 writer duplicate removal from `app.js`: completed
- Cleanup E3 extracted view duplicate removal from `app.js`: completed
- Cleanup E4 dashboard/project lifecycle duplicate removal from `app.js`: completed
- Cleanup E5 profile/app-shell duplicate removal from `app.js`: completed
- Batch F1 project-shell orchestration extraction: completed
- Cleanup F2 project-shell duplicate removal from `app.js`: completed
- Batch G1 project persistence extraction: completed
- Cleanup G2 legacy `saveProject` removal from `app.js`: completed
- Batch H1 admin runtime extraction: completed
- Cleanup H2 legacy admin runtime removal from `app.js`: completed
- Batch I1 bootstrap/auth orchestration extraction: completed
- Cleanup I2 legacy `bindAuth` / `boot` / duplicate `DOMContentLoaded` startup removal: completed

## Current runtime ownership

`js/core/runtime.js` owns the shared core contract and `js/core/cutover.js` activates shared state/session/data services.

`js/modules/project-persistence.js` owns the shared `saveProject` persistence path. It preserves the existing `nv1_projects` update payload, updated timestamp handling and in-memory `state.projects` synchronization. Cleanup G2 physically removed the old `async function saveProject(...)` implementation from `app.js`; only `let saveProject;` remains for the classic-script compatibility contract.

`js/modules/project-shell.js` owns `projectWords`, `projectPct`, project tab definitions/rendering, `tabs`, and `renderProject`.

`js/modules/dashboard.js` owns Dashboard and My Projects listing. `js/modules/projects.js` owns create/normalize/open lifecycle. `js/modules/writer.js` owns the editor. `js/modules/overview-tracking.js`, `js/modules/workspace-views.js`, and `js/modules/workspace-bindings.js` own the project workspace. `js/modules/profile-shell.js` owns Profile & Subscription plus global app-shell/logout. Logout preserves the shared state object reference with `Object.assign(state, NaskhahCore.createState())`.

`js/admin/runtime.js` owns the main admin runtime: `renderAdmin`, Add User / `admin_create_user`, Edit User profile/subscription flow, Delete User / `admin_delete_user`, `nv1_profiles` user-management query and `nv1_project_metadata` metadata-only project listing. `js/admin/inactive-users.js` remains the inactive-user extension and wraps the lexical `renderAdmin` binding.

`js/core/bootstrap.js` now owns the remaining startup/auth orchestration: `bindAuth`, `boot`, forgot/reset form wiring, session restoration, active-profile startup check and the sole app bootstrap `DOMContentLoaded` registration. `app.js` retains only `let bindAuth,boot;` for classic-script compatibility. The legacy `bindAuth`, `boot` and old `document.addEventListener('DOMContentLoaded',boot)` registration are physically absent from `app.js`.

`js/auth/login.js` remains loaded immediately before `js/core/bootstrap.js`. Its capture-phase login/admin listeners are therefore registered before bootstrap startup while preserving the Phase 2 login guards and `/functions/v1/naskhah-login` route.

The existing Supabase client remains single-instance. No backend route, schema, auth rule, table name, project model, manuscript data structure or storage bucket name changed.

## Current runtime order

1. `js/core/runtime.js`
2. `app.js`
3. `js/core/cutover.js`
4. `js/modules/project-persistence.js`
5. `js/modules/project-shell.js`
6. `js/modules/dashboard.js`
7. `js/modules/projects.js`
8. `js/modules/writer.js`
9. `js/modules/overview-tracking.js`
10. `js/modules/workspace-views.js`
11. `js/modules/workspace-bindings.js`
12. `js/modules/profile-shell.js`
13. `js/admin/runtime.js`
14. `js/modules/versions.js`
15. `js/admin/inactive-users.js`
16. `js/auth/login.js`
17. `js/core/bootstrap.js`

## Latest verification gate

Cleanup I2 has completed physically on the branch. The one-shot cleanup commit is followed by this human-authored status commit so normal PR checks can run on the final I2 tree.

Required final I2 gate:

1. Phase 2 strict runtime guard: PASS
2. Phase 3 Cleanup I2 ownership/removal guard: PASS
3. Vercel Preview deployment: SUCCESS
4. Legacy `bindAuth`, `boot` and duplicate app bootstrap registration physically absent from `app.js`
5. `js/core/bootstrap.js` is the guarded bootstrap owner and loads after `js/auth/login.js`
6. PR #4 remains open and mergeable
7. `main` remains untouched

Authenticated browser smoke remains required before final merge because the branch Preview has previously redirected to the production custom domain in some sessions.

## Next step

After the I2 gates are green, keep the legacy `bindTab` / Versions wrapper-chain cleanup as a separately gated batch. Then perform the final authenticated browser smoke before considering PR #4 for merge.
