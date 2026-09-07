/* Naskhah Studio — Phase 3 core runtime bridge
 *
 * Batch A2 preparation: this module now defines the authoritative shared-core
 * contract (config, state factory, helpers and data/session service factories)
 * while app.js still retains its legacy globals until the final cutover edit.
 * This keeps the change reversible and avoids duplicate Supabase clients.
 */
(() => {
  'use strict';

  const config = Object.freeze({
    supabaseUrl: 'https://nrnrmbjrczmzkgimxdun.supabase.co',
    authRoute: '/functions/v1/naskhah-v1-auth',
    tables: Object.freeze({
      profiles: 'nv1_profiles',
      projects: 'nv1_projects',
      projectMetadata: 'nv1_project_metadata'
    })
  });

  const createState = () => ({
    session: null,
    profile: null,
    projects: [],
    current: null,
    currentTab: 'overview',
    activeSection: null,
    focus: false,
    toolsHidden: false
  });

  const dom = Object.freeze({
    one: (selector, root = document) => root.querySelector(selector),
    all: (selector, root = document) => [...root.querySelectorAll(selector)]
  });

  const text = Object.freeze({
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
      const valueText = (el.textContent || el.innerText || '').trim();
      return valueText ? valueText.split(/\s+/).length : 0;
    }
  });

  const createServices = ({ sb, publishableKey, state }) => {
    if (!sb) throw new Error('NaskhahCore.createServices requires a Supabase client.');
    if (!state) throw new Error('NaskhahCore.createServices requires shared state.');

    const authUrl = config.supabaseUrl + config.authRoute;

    return Object.freeze({
      async authCall(payload, admin = false) {
        const headers = { 'Content-Type': 'application/json', apikey: publishableKey };
        if (admin) {
          const session = (await sb.auth.getSession()).data.session;
          if (session) headers.Authorization = 'Bearer ' + session.access_token;
        }
        const response = await fetch(authUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error || 'Ralat');
        return body;
      },

      async setSession(accessToken, refreshToken) {
        const { data, error } = await sb.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        if (error) throw error;
        state.session = data.session;
        return this.loadProfile();
      },

      async loadProfile() {
        const user = (await sb.auth.getUser()).data.user;
        if (!user) return null;
        const { data, error } = await sb
          .from(config.tables.profiles)
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        state.profile = data;
        return data;
      },

      async loadProjects() {
        const { data, error } = await sb
          .from(config.tables.projects)
          .select('*')
          .order('updated_at', { ascending: false });
        if (error) throw error;
        state.projects = data || [];
        return state.projects;
      }
    });
  };

  const core = Object.freeze({
    version: '3.0.0-a2-prep',
    config,
    createState,
    dom,
    text,
    createServices
  });

  Object.defineProperty(window, 'NaskhahCore', {
    value: core,
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
