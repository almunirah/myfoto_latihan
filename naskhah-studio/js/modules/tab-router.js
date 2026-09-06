/* Naskhah Studio — Phase 3 Batch J1
 * Base project tab-router ownership.
 *
 * This module replaces only the remaining base routing responsibility that
 * downstream Overview / Workspace / Versions wrappers delegate to.
 */
(() => {
  'use strict';

  bindTab = (tab) => {
    if (tab === 'writing') return bindWriter(state.current);
  };

  Object.defineProperty(window, 'NaskhahTabRouterModule', {
    value: Object.freeze({ version: '3.0.0-j1' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
