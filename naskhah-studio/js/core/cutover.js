/* Naskhah Studio — Phase 3 Batch A2 core cutover
 *
 * This bridge executes after app.js has declared the legacy globals but before
 * the Phase 2 feature modules load. It delegates shared state/session/data
 * responsibilities to NaskhahCore while preserving the existing public names
 * expected by login.js, versions.js and inactive-users.js.
 */
(() => {
  'use strict';

  if (!window.NaskhahCore) throw new Error('NaskhahCore is required before core cutover.');

  // Replace the pre-boot legacy state literal with the authoritative core state
  // shape. DOMContentLoaded/boot has not fired yet at this point.
  state = window.NaskhahCore.createState();

  const services = window.NaskhahCore.createServices({
    sb,
    publishableKey: SUPABASE_KEY,
    state
  });

  // Preserve existing global function names so downstream classic scripts and
  // existing app.js call sites continue to work unchanged during this batch.
  authCall = (...args) => services.authCall(...args);
  setSession = (...args) => services.setSession(...args);
  loadProfile = (...args) => services.loadProfile(...args);
  loadProjects = (...args) => services.loadProjects(...args);

  Object.defineProperty(window, 'NaskhahCoreServices', {
    value: services,
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
