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

## Current gate

The shared core contract now lives in `js/core/runtime.js` and defines:

- authoritative Supabase URL / Edge Function route / table map
- a shared application state factory
- DOM and text helpers
- session/profile/project service factories that accept the existing Supabase client

This preparation intentionally creates **no second Supabase client** and does **not** remove the legacy globals from `app.js` yet. That cutover is the next reversible edit, after the A2-prep guard and Vercel Preview remain green.

## Next step

Batch A2 cutover will replace the matching `app.js` core globals with references to `NaskhahCore`, then rerun:

1. Phase 2 strict runtime guard
2. Phase 3 ownership/load-order guard
3. Vercel Preview deployment
4. user/admin login + project save + Versions smoke regression

Only after those gates pass will work move to dashboard/projects modularization.
