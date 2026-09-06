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

## Current runtime ownership

`js/core/runtime.js` owns the shared core contract and `js/core/cutover.js` activates that contract after `app.js` declarations but before downstream feature modules load.

Live core responsibilities delegated through `NaskhahCore`:

- shared application state initialization
- `authCall`
- `setSession`
- `loadProfile`
- `loadProjects`

`js/modules/dashboard.js` owns:

- `projectCard`
- `reminderCentre`
- `renderDashboard`
- `renderProjects`

`js/modules/projects.js` owns:

- `openCreate`
- `createProject`
- `normalizeProject`
- `openProject`

`js/modules/writer.js` owns:

- `writingView`
- `bindWriter`
- autosave/manual save flow
- undo/redo and formatting controls
- focus/tools toggles
- table insertion
- image upload to `naskhah-media`
- signed URL image hydration

The existing Supabase client remains single-instance. No backend route, schema, auth rule, table name, project model, manuscript data structure or storage bucket name is changed.

## Verification gate

Batch C requires all of the following to remain green:

1. Phase 2 strict runtime guard
2. Phase 3 ownership/load-order guard
3. Vercel Preview deployment
4. browser smoke regression for login, Dashboard, project open, writing/autosave/manual save, Versions, admin and logout

## Next step

After Batch C verification is green, remove the now-duplicated writer/editor implementations from `app.js` in a separate reversible cleanup batch. Then continue extracting remaining project tabs and export/profile/admin runtime before final `app.js` reduction.
