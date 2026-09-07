# app.js Responsibility Map

Current `app.js` is a monolithic browser runtime. Phase 3 will reduce it in controlled batches rather than performing a single rewrite.

| Responsibility | Current location | Planned module | Risk |
| --- | --- | --- | --- |
| Supabase/client config | `app.js` | `js/core/runtime.js` | High — auth/data dependency |
| DOM/text helpers | `app.js` | `js/core/runtime.js` | Medium — used everywhere |
| Shared state | `app.js` | `js/core/runtime.js` | High — cross-module dependency |
| Toast/modal helpers | `app.js` | `js/core/runtime.js` | Medium |
| Auth/session/profile/project loading | `app.js` + `js/auth/login.js` | `js/core/runtime.js` + existing auth module | High |
| Navigation/dashboard | `app.js` | `js/modules/dashboard.js` | Medium |
| Project creation/open/normalize | `app.js` | `js/modules/projects.js` | High |
| Project tab shell | `app.js` | `js/modules/projects.js` | High |
| Overview/deadlines/submission | `app.js` | `js/modules/overview.js` | Medium |
| Writing editor | `app.js` | `js/modules/writing.js` | Very High |
| Outline/checklist | `app.js` | `js/modules/planning.js` | Medium |
| Research notes/references | `app.js` | `js/modules/research.js` | Medium |
| Versions | `js/modules/versions.js` | keep existing module | Already extracted |
| Admin inactive users | `js/admin/inactive-users.js` | keep existing module | Already extracted |
| Login patch | `js/auth/login.js` | keep existing module | Already extracted |
| Export/profile/app shell | `app.js` | later Phase 3 modules | Medium |

## Runtime order during migration

The current Phase 2 contract remains authoritative. New Phase 3 modules must be introduced only when their dependencies are already loaded and their old declarations have been removed from `app.js` in the same extraction batch.

No duplicate runtime ownership is allowed. A responsibility is either still owned by `app.js` or by its extracted module, never both.

## Completion criteria

Phase 3 is complete when `app.js` is reduced to a small bootstrap/orchestrator, all extracted modules pass syntax and dependency checks, and the full authenticated preview regression passes before merge.
