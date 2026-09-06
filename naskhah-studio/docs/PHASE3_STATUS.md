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
- Batch H1 admin runtime extraction: completed
- Cleanup H2 legacy admin runtime removal from `app.js`: completed
- Batch I1 bootstrap/auth orchestration extraction: completed
- Cleanup I2 legacy `bindAuth` / `boot` / duplicate `DOMContentLoaded` startup removal: completed
- Batch J0 `bindTab` / Versions wrapper audit: completed
- Batch J1 base tab-router ownership: completed
- Batch J1.5 Versions lexical wrapper hardening: active and guarded

## Current runtime ownership

`js/core/runtime.js` owns the shared core contract and `js/core/cutover.js` activates shared state/session/data services.

`js/modules/project-persistence.js` owns the shared `saveProject` persistence path. `js/modules/project-shell.js` owns project shell rendering and project progress helpers. `js/modules/dashboard.js` and `js/modules/projects.js` own Dashboard / My Projects and project lifecycle. `js/modules/writer.js` owns the editor.

`js/modules/tab-router.js` is the base tab router. It handles `writing` by calling `bindWriter(state.current)`. `js/modules/overview-tracking.js` wraps that router for Overview, and `js/modules/workspace-bindings.js` wraps the result for Outline, Checklist, Notes, References and Export.

`js/modules/versions.js` now wraps the lexical `bindTab` chain explicitly: it captures `const oldBindTab=bindTab`, assigns the enhanced Versions wrapper back to `bindTab`, and mirrors the final binding to `window.bindTab`. This removes the previous dependence on a window/global-property linkage and makes the later J2 physical cleanup safe to gate independently.

`js/modules/profile-shell.js` owns Profile & Subscription plus global app-shell/logout. Logout preserves the shared state reference with `Object.assign(state, NaskhahCore.createState())`.

`js/admin/runtime.js` owns the main admin runtime and `js/admin/inactive-users.js` remains the inactive-user extension. `js/core/bootstrap.js` owns `bindAuth`, `boot`, forgot/reset wiring, session restoration and the app bootstrap `DOMContentLoaded` registration. `js/auth/login.js` remains immediately before bootstrap so its capture-phase login/admin listeners register first.

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
9. `js/modules/tab-router.js`
10. `js/modules/overview-tracking.js`
11. `js/modules/workspace-views.js`
12. `js/modules/workspace-bindings.js`
13. `js/modules/profile-shell.js`
14. `js/admin/runtime.js`
15. `js/modules/versions.js`
16. `js/admin/inactive-users.js`
17. `js/auth/login.js`
18. `js/core/bootstrap.js`

## Latest verification gate

The Vercel build-rate limit has cleared. J0, J1 and J1.5 all produced normal Vercel Preview SUCCESS builds.

J1.5 specifically hardened the Versions wrapper before removing the legacy base `bindTab` function. The strict runtime and Phase 3 guards now validate the lexical Versions wrapper contract.

Required J1.5 final gate on this human-authored status commit:

1. Phase 2 strict runtime guard: PASS
2. Phase 3 J1.5 tab-router / Versions lexical wrapper guard: PASS
3. Vercel Preview deployment: SUCCESS
4. PR #4 remains open and mergeable
5. `main` remains untouched
6. legacy `function bindTab(...)` remains in `app.js` until separately gated J2 cleanup

Authenticated browser smoke remains required before final merge because the branch Preview has previously redirected to the production custom domain in some sessions.

## Next step

If this J1.5 final gate stays green, proceed to J2: physically remove only the legacy `function bindTab(...)` body from `app.js`, retain a mutable `let bindTab;` compatibility binding, strengthen the regression guard, and verify Phase 2 + Phase 3 + Vercel again. After J2, review whether any remaining Versions compatibility surface can be simplified without changing behavior.
