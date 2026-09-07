/* Naskhah Studio — Phase 3 Batch I1 bootstrap/auth orchestration */
(() => {
  'use strict';

  bindAuth = () => {
    $('#goAdmin').onclick = () => showPublic('admin');
    $$('.toLogin').forEach(x => x.onclick = () => showPublic('login'));
    $('#forgotLink').onclick = () => showPublic('forgot');

    $('#loginForm').onsubmit = async e => {
      e.preventDefault();
      try {
        const j = await authCall({ action: 'login', identifier: $('#loginUser').value.trim(), password: $('#loginPass').value });
        await setSession(j.access_token, j.refresh_token);
        if (state.profile?.status === 'suspended') throw new Error('Akaun digantung. Hubungi admin.');
        await enterApp();
      } catch (err) {
        toast(err.message, true);
      }
    };

    $('#adminForm').onsubmit = async e => {
      e.preventDefault();
      try {
        const j = await authCall({ action: 'login', identifier: $('#adminUser').value.trim(), password: $('#adminPass').value });
        await setSession(j.access_token, j.refresh_token);
        if (state.profile?.role !== 'admin') {
          await sb.auth.signOut();
          throw new Error('Akaun ini bukan admin.');
        }
        await enterApp();
      } catch (err) {
        toast(err.message, true);
      }
    };

    $('#forgotForm').onsubmit = async e => {
      e.preventDefault();
      try {
        await authCall({ action: 'forgot', identifier: $('#forgotUser').value.trim(), redirect_to: location.origin + location.pathname });
        toast('Jika email recovery wujud, reset link telah dihantar.');
        showPublic('login');
      } catch (err) {
        toast(err.message, true);
      }
    };

    $('#resetForm').onsubmit = async e => {
      e.preventDefault();
      const a = $('#resetPass').value;
      const b = $('#resetPass2').value;
      if (a !== b) return toast('Password tidak sama.', true);
      const { error } = await sb.auth.updateUser({ password: a });
      if (error) return toast(error.message, true);
      toast('Password berjaya ditukar.');
      showPublic('login');
    };
  };

  boot = async () => {
    bindGlobal();
    bindAuth();
    const { data: { session } } = await sb.auth.getSession();
    if (session) {
      try {
        state.session = session;
        await loadProfile();
        if (state.profile?.status === 'active') return enterApp();
      } catch {}
      await sb.auth.signOut();
    }
    showPublic('login');
  };

  document.addEventListener('DOMContentLoaded', boot);

  Object.defineProperty(window, 'NaskhahBootstrapModule', {
    value: Object.freeze({ version: '3.0.0-i1' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
