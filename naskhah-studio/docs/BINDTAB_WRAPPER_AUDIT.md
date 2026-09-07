# Phase 3 J0 — bindTab / Versions Wrapper Audit

This is a non-runtime preparation gate. It documents the current wrapper chain before J1/J2 changes.

## Current chain

1. `app.js` declares the legacy base `bindTab(tab)` implementation.
2. `js/modules/overview-tracking.js` captures that binding as `legacyBindTab`, handles `overview`, and delegates all other tabs to the captured base.
3. `js/modules/workspace-bindings.js` captures the result as `previousBindTab`, handles `outline`, `checklist`, `notes`, `references`, and `export`, then delegates remaining tabs.
4. `js/modules/versions.js` captures `window.bindTab || bindTab`, wraps it, calls the previous chain first, then installs enhanced `versions` handlers.

## Remaining responsibility in the legacy base

After the Overview and Workspace wrappers intercept their owned tabs, the legacy base is still needed primarily for:

- `writing` → `bindWriter(state.current)`
- the legacy `versions` fallback handlers that are subsequently replaced by `js/modules/versions.js`

The enhanced Versions module owns the actual live Versions UI and handlers after its wrapper runs.

## J1 safe ownership plan

Introduce a small base tab-router module before `overview-tracking.js` that owns only the remaining base routing contract:

- `writing` delegates to `bindWriter(state.current)`
- other unowned tabs are a no-op

Then load order remains deterministic:

`writer → tab-router → overview-tracking → workspace-views → workspace-bindings → ... → versions`

Overview and Workspace wrappers can continue to capture/delegate the lexical `bindTab` binding exactly as they do now. Versions remains the final wrapper until its own cleanup gate.

## J2 physical cleanup gate

Only after J1 passes Phase 2, Phase 3, and a successful Vercel Preview:

- remove the legacy `function bindTab(...)` body from `app.js`
- retain only a mutable compatibility binding such as `let bindTab;`
- add a regression guard that fails if the legacy body returns
- verify `writing`, Overview, Outline, Checklist, Notes, References, Export and Versions ownership tokens

## Versions cleanup must stay separate

Do not combine Versions wrapper cleanup with J2. `js/modules/versions.js` currently uses `window.bindTab || bindTab` and republishes `window.bindTab`. That coupling needs its own gate after the base router is proven in Preview.

## Safety constraints

- no Supabase schema change
- no Edge Function action/route change
- no manuscript/project data-model change
- no second Supabase client
- no permanent user deletion in regression testing
- no PR merge until final authenticated browser smoke passes
