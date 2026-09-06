/* Naskhah Studio — Phase 3 core runtime bridge
 *
 * Batch A1 deliberately introduces a namespaced core layer before app.js.
 * It does not take ownership of existing globals yet; that migration happens
 * in the next reversible Batch A2 step after preview verification.
 */
(() => {
  'use strict';

  const core = {
    version: '3.0.0-a1',
    config: Object.freeze({
      supabaseUrl: 'https://nrnrmbjrczmzkgimxdun.supabase.co',
      authRoute: '/functions/v1/naskhah-v1-auth',
      tables: Object.freeze({
        profiles: 'nv1_profiles',
        projects: 'nv1_projects',
        projectMetadata: 'nv1_project_metadata'
      })
    }),
    dom: Object.freeze({
      one: (selector, root = document) => root.querySelector(selector),
      all: (selector, root = document) => [...root.querySelectorAll(selector)]
    }),
    text: Object.freeze({
      escapeHtml(value) {
        return String(value ?? '').replace(/[&<>'"]/g, (char) => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        })[char]);
      },
      stripHtml(value) {
        const el = document.createElement('div');
        el.innerHTML = String(value || '');
        return el.textContent || el.innerText || '';
      },
      countWords(value) {
        const el = document.createElement('div');
        el.innerHTML = String(value || '');
        const text = (el.textContent || el.innerText || '').trim();
        return text ? text.split(/\s+/).length : 0;
      }
    })
  };

  Object.defineProperty(window, 'NaskhahCore', {
    value: Object.freeze(core),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
