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

## Current runtime ownership

`js/core/runtime.js` owns the shared core contract and `js/core/cutover.js` activates shared state/session/data services.

`js/modules/project-persistence.js` now owns the shared `saveProject` persistence path. It preserves the existing `nv1_projects` update payload, updated timestamp handling and in-memory `state.projects` synchronization. Cleanup G2 physically removed the old `async function saveProject(...)` implementation from `app.js`; only `let saveProject;` remains for the classic-script compatibility contract.

`js/modules/project-shell.js` owns `projectWords`, `projectPct`, project tab definitions/rendering, `tabs`, and `renderProject`.

`js/modules/dashboard.js` owns Dashboard and My Projects listing. `js/modules/projects.js` owns create/normalize/open lifecycle. `js/modules/writer.js` owns the editor. `js/modules/overview-tracking.js`, `js/modules/workspace-views.js`, and `js/modules/workspace-bindings.js` own the project workspace. `js/modules/profile-shell.js` owns Profile & Subscription plus global app-shell/logout. Logout preserves the shared state object reference with `Object.assign(state, NaskhahCore.createState())`.

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
13. `js/modules/versions.js`
14. `js/admin/inactive-users.js`
15. `js/auth/login.js`

## Latest verification gate

Cleanup G2 is green on human-authored guard commit `9c3181e9190700b2796b5abbd093cae0ff4e4b27`:

1. Phase 2 strict runtime guard: PASS
2. Phase 3 Cleanup G2 ownership/removal guard: PASS
3. Vercel Preview deployment: SUCCESS
4. `saveProject` legacy implementation is physically absent from `app.js`
5. `nv1_projects` persistence is guarded in `project-persistence.js`

The initial G2 one-shot attempt correctly stopped before commit when the strict guard still expected `nv1_projects` inside `app.js`. The guard was then updated to validate the new module ownership, the cleanup was rerun, and both Phase 2 and Phase 3 checks passed.

Authenticated browser smoke remains required before final merge because the branch Preview has previously redirected to the production custom domain in some sessions.

## Next step

Preserve admin runtime and bootstrap/auth wiring until separately extracted and gated. The next conservative target is admin runtime ownership; `bindTab`/versions cleanup should remain separate because its wrapper chain has additional runtime coupling.
