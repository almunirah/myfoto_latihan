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

`js/modules/overview-tracking.js` owns Overview, Writing Goals, deadlines, supervisor/final submission tracking, journal tracking and revision tracking.

`js/modules/workspace-views.js` owns view rendering for Outline, Checklist, Research Notes, References and Export.

`js/modules/workspace-bindings.js` owns Outline, Checklist, Research Notes, References and Export interactions plus workspace-specific `bindTab` delegation.

`js/modules/profile-shell.js` now owns:

- Profile & Subscription rendering
- profile name/email update flow
- password change flow
- global sidebar navigation binding
- mobile navigation / modal shell events
- logout flow
- state reset using `Object.assign(state, NaskhahCore.createState())` so the shared state object captured by core services is preserved instead of being replaced

The existing Supabase client remains single-instance. No backend route, schema, auth rule, table name, project model, manuscript data structure or storage bucket name is changed.

## Latest verification gate

Batch D4 must keep all of these green:

1. Phase 2 strict runtime guard
2. Phase 3 D4 ownership/load-order guard
3. Vercel Preview deployment
4. PR remains mergeable

The Preview static smoke checker now covers every active Phase 3 runtime module in load order. Authenticated browser smoke remains a required gate before final merge because the branch Preview has previously redirected to the production custom domain in some sessions.

## Next step

Begin physical duplicate cleanup in `app.js` in small reversible batches. The first cleanup should remove only implementations already fully replaced by verified modules, while preserving bootstrap, Supabase initialization, shared helper contracts, `saveProject`, `renderProject`, admin runtime and auth/bootstrap wiring until their own cleanup gate is proven. Every cleanup batch must pass Phase 2, Phase 3 and Vercel Preview before the next deletion.
