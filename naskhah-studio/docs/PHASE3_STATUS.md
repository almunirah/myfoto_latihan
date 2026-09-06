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

## Current gate

`js/core/runtime.js` now owns the shared core contract and `js/core/cutover.js` activates that contract after `app.js` declarations but before the Phase 2 feature modules load.

The A2 cutover currently delegates these live runtime responsibilities through `NaskhahCore` while preserving the legacy names expected by downstream scripts:

- shared application state initialization
- `authCall`
- `setSession`
- `loadProfile`
- `loadProjects`

The existing Supabase client remains single-instance; no backend route, schema, auth rule, table name, project model or manuscript data structure is changed.

## Verification

- Phase 2 strict runtime guard: PASS
- Phase 3 A2 ownership/load-order guard: PASS
- Vercel Preview deployment: SUCCESS
- PR #4 remains mergeable

## Next step

Run browser smoke regression against the PR #4 Preview for user/admin login, project open/save, Versions and logout. After that gate is green, remove the now-duplicated legacy implementations from `app.js` in a separate reversible batch before dashboard/projects modularization.
