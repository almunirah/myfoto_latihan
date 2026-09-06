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

## Current runtime ownership

`js/core/runtime.js` owns the shared core contract and `js/core/cutover.js` activates that contract after `app.js` declarations but before downstream feature modules load.

Live core responsibilities delegated through `NaskhahCore`:

- shared application state initialization
- `authCall`
- `setSession`
- `loadProfile`
- `loadProjects`

`js/modules/dashboard.js` now takes live runtime ownership of:

- `projectCard`
- `reminderCentre`
- `renderDashboard`
- `renderProjects`

The existing Supabase client remains single-instance; no backend route, schema, auth rule, table name, project model or manuscript data structure is changed.

## Verification

- Phase 2 strict runtime guard: PASS
- Phase 3 Batch B1 ownership/load-order guard: PASS
- Vercel Preview deployment: SUCCESS
- PR #4 remains mergeable

## Next step

Run browser smoke regression against PR #4 Preview for user/admin login, Dashboard, My Projects, project open/save, Versions and logout. Once green, continue with the next reversible ownership batch: project creation/open lifecycle, followed by writer/editor runtime. Duplicate legacy implementations inside `app.js` will be removed only after the replacement modules are proven stable.
