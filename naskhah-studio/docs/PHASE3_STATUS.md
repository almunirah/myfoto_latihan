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

## Current runtime ownership

`js/core/runtime.js` owns the shared core contract and `js/core/cutover.js` activates that contract after `app.js` declarations but before downstream feature modules load.

Live core responsibilities delegated through `NaskhahCore`:

- shared application state initialization
- `authCall`
- `setSession`
- `loadProfile`
- `loadProjects`

`js/modules/dashboard.js` owns Dashboard and My Projects listing.

`js/modules/projects.js` owns project creation, normalization and open lifecycle.

`js/modules/writer.js` owns the writing/editor experience, including autosave, manual save, undo/redo, formatting, table insertion, image upload and image hydration.

`js/modules/overview-tracking.js` now owns:

- `overviewView`
- `deadlinesView`
- `specialSubmissionView`
- overview goal/deadline bindings
- supervisor / final submission tracking bindings
- article journal tracking bindings
- article revision add/delete bindings
- overview-specific `bindTab` delegation while non-overview tabs continue through the preserved legacy binding path

`js/modules/workspace-views.js` owns Outline, Checklist, Research Notes, References and Export views.

The existing Supabase client remains single-instance. No backend route, schema, auth rule, table name, project model, manuscript data structure or storage bucket name is changed.

## Latest verification

- Phase 2 strict runtime guard: PASS
- Phase 3 Batch D2 ownership/load-order guard: PASS
- Vercel Preview deployment: SUCCESS
- PR #4: mergeable
- production `main`: unchanged

Authenticated browser smoke remains a required gate before final merge because the branch Preview has previously redirected to the production custom domain in some sessions.

## Next step

Continue extracting the remaining project-tab bindings and export/profile shell responsibilities. After those replacement modules are proven by CI and Preview, remove the duplicated legacy implementations from `app.js` in small reversible cleanup batches, then perform the final authenticated browser smoke before merge.
