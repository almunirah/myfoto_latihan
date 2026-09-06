# Naskhah Studio — Phase 3

## Objective

Decompose the large `app.js` runtime into responsibility-based modules without changing the Supabase schema, Edge Function routes, manuscript data model, authentication behavior, or visible product behavior.

Phase 3 is intentionally incremental. Each extraction batch must remain previewable and independently reversible.

## Safety rules

1. Never refactor directly on `main`.
2. Preserve the current classic-script runtime contract until a later, separately tested migration explicitly changes it.
3. Do not rename Supabase tables, Edge Function actions/routes, project fields, manuscript fields, or storage behavior during modularization.
4. Do not mix feature changes with extraction commits.
5. Every extraction batch must pass syntax/runtime checks and Vercel Preview before merge.
6. Permanent user deletion is never used as a routine regression test.
7. If Preview behavior differs from production, stop and rollback the current extraction batch rather than patching production blindly.

## Planned extraction order

### Batch A — Core runtime foundation
- Supabase/client configuration
- DOM/text helpers
- shared state
- shared modal/toast helpers
- auth/session/profile/project-loading helpers

Target module: `js/core/runtime.js`

### Batch B — Dashboard and project list
- navigation helpers
- project word/progress helpers
- dashboard rendering
- reminder centre
- project list rendering

Target module: `js/modules/dashboard.js`

### Batch C — Project lifecycle
- create project
- normalize/open project
- project tabs and top-level project renderer

Target module: `js/modules/projects.js`

### Batch D — Writing workspace
- writing view
- editor binding
- autosave/manual save
- formatting, table, image, undo/redo, focus mode

Target module: `js/modules/writing.js`

### Batch E — Planning and research
- overview/deadlines/submission tracking
- outline
- checklist
- research notes
- references

Target modules under `js/modules/`.

### Batch F — Export, profile and remaining application shell
- export
- profile/account views
- remaining navigation/bootstrap wiring

After this batch `app.js` should become a small application bootstrap, or be retired only after full preview regression passes.

## Regression gate for every batch

- User login
- Admin login and non-admin rejection
- Dashboard/project list
- Project create/open/save
- Writing Zone persistence
- Versions operations
- Admin panel + inactive-user listing
- Logout/login again
- `node tools/scripts/check-runtime.mjs`
- `node tools/scripts/check-phase3-baseline.mjs`
- Vercel Preview deployment success

## Rollback

Each batch is committed separately. If a preview regression appears, revert only that extraction commit or restore the prior script load order. Production `main` remains unchanged until the PR is explicitly merged.
