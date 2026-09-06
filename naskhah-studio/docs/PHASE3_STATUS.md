# Phase 3 Status

- Branch: `naskhah-phase3-app-modularization`
- Production `main`: unchanged by Phase 3 work until PR merge
- Phase 2 modular runtime: preserved
- Phase 3 execution plan: added
- `app.js` responsibility map: added
- Phase 3 baseline guard: added
- Dedicated GitHub Actions baseline workflow: added
- Batch A1 core bridge: completed
- Batch A2 preparation contract: completed
- Batch A2 runtime cutover bridge: completed
- Batch B1 dashboard/project-list runtime extraction: completed
- Batch B2 project lifecycle runtime extraction: completed
- Batch C writer/editor runtime extraction: completed
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

## Current runtime ownership

`js/core/runtime.js` owns the shared core contract and `js/core/cutover.js` activates that contract after `app.js` declarations but before downstream feature modules load.

Live core responsibilities delegated through `NaskhahCore`:

- shared application state initialization
- `authCall`
- `setSession`
- `loadProfile`
- `loadProjects`

Cleanup E1 physically removed the legacy core service implementations from `app.js`; only mutable compatibility bindings remain.

Cleanup E2 physically removed legacy writer/editor implementations from `app.js`; `js/modules/writer.js` owns those live implementations.

Cleanup E3 physically removed extracted Overview/deadline/submission and workspace-view implementations from `app.js`; the live implementations remain in `js/modules/overview-tracking.js` and `js/modules/workspace-views.js`.

Cleanup E4 physically removed the already-replaced Dashboard / My Projects and project lifecycle implementations from `app.js`: `projectCard`, `renderDashboard`, `reminderCentre`, `renderProjects`, `openCreate`, `createProject`, `normalizeProject`, and `openProject`.

Cleanup E5 physically removed the already-replaced Profile / app-shell implementations from `app.js`: `renderProfile` and `bindGlobal`.

Batch F1 introduced `js/modules/project-shell.js`, loaded immediately after core cutover and before Dashboard/Projects. It owns:

- `projectWords`
- `projectPct`
- project tab definitions/rendering
- `tabs`
- `renderProject`

Cleanup F2 then physically removed those legacy project-shell implementations and the old `tabDefs` constant from `app.js`. Only mutable compatibility bindings remain there, while the module owns live behavior.

The live Profile & Subscription rendering, profile update/password flow, global shell navigation and logout remain owned by `js/modules/profile-shell.js`. Logout continues to reset the existing shared state object with `Object.assign(state, NaskhahCore.createState())` so core service references remain valid.

The existing Supabase client remains single-instance. No backend route, schema, auth rule, table name, project model, manuscript data structure or storage bucket name is changed.

## Current runtime order

1. `js/core/runtime.js`
2. `app.js`
3. `js/core/cutover.js`
4. `js/modules/project-shell.js`
5. `js/modules/dashboard.js`
6. `js/modules/projects.js`
7. `js/modules/writer.js`
8. `js/modules/overview-tracking.js`
9. `js/modules/workspace-views.js`
10. `js/modules/workspace-bindings.js`
11. `js/modules/profile-shell.js`
12. `js/modules/versions.js`
13. `js/admin/inactive-users.js`
14. `js/auth/login.js`

## Latest verification gate

Cleanup F2 is green on guard commit `0388d3085ed5c4ca1420420d54ff44519784784a`:

1. Phase 2 strict runtime guard: PASS
2. Phase 3 Cleanup F2 ownership/removal guard: PASS
3. Vercel Preview deployment: SUCCESS
4. PR #4 remains mergeable
5. `main` remains untouched

The strict runtime checker validates every active Phase 3 script in exact load order. The Preview static smoke checker covers the active runtime modules.

Authenticated browser smoke remains a required gate before final merge because the branch Preview has previously redirected to the production custom domain in some sessions.

## Next step

Preserve `saveProject`, admin runtime and bootstrap/auth wiring until their own ownership gates are proven. The next safe extraction candidate is the shared project persistence path (`saveProject`) because all modular feature owners depend on it; it should be moved behind a separately guarded service contract before any physical removal.
