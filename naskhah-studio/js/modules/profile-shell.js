/* Naskhah Studio — Phase 3 Batch D4
 * Profile and application-shell runtime ownership.
 */
(() => {
  'use strict';

  renderProfile = async () => {
    nav('profile');
    const p = state.profile;
    const registered = p.created_at ? new Date(p.created_at).toLocaleString('ms-MY') : '—';
    const expiry = p.subscription_expires_at ? new Date(p.subscription_expires_at).toLocaleDateString('ms-MY') : '—';

    $('#main').innerHTML = `<div class="page-head"><div><h1>Profile & Subscription</h1><p>Urus profil, email, password dan rekod langganan.</p></div></div><div class="grid2"><div class="card"><h2>Maklumat Profil</h2><label>Nama<input id="pfName" value="${esc(p.display_name||'')}"></label><label>Username<input value="${esc(p.username||'')}" disabled></label><label>Email<input id="pfEmail" type="email" value="${esc(p.email||'')}"></label><button class="btn primary" id="saveProfile" style="margin-top:14px">Simpan Perubahan</button></div><div class="card"><h2>Rekod Akaun & Langganan</h2><div class="profile-row"><span>Tarikh mula daftar</span><b>${registered}</b></div><div class="profile-row"><span>Plan semasa</span><b>${esc((p.plan||'free').toUpperCase())}</b></div><div class="profile-row"><span>Status langganan</span><b>${esc(p.subscription_status||'trial')}</b></div><div class="profile-row"><span>Tarikh tamat</span><b>${expiry}</b></div><div class="profile-row"><span>Status akaun</span><b>${esc(p.status||'active')}</b></div></div></div><div class="card" style="max-width:620px"><h2>Tukar Password</h2><label>Password Baharu<input id="newPass" type="password" minlength="6"></label><button class="btn primary" id="changePass" style="margin-top:14px">Tukar Password</button></div>`;

    $('#saveProfile').onclick = async () => {
      const name = $('#pfName').value.trim();
      const email = $('#pfEmail').value.trim();
      if (email && !/^\S+@\S+\.\S+$/.test(email)) return toast('Format email tidak sah.', true);
      try {
        if (email && email.toLowerCase() !== (p.email || '').toLowerCase()) {
          const { error } = await sb.auth.updateUser({ email });
          if (error) throw error;
        }
        const { error } = await sb.from('nv1_profiles').update({
          display_name: name,
          email: email || null,
          updated_at: new Date().toISOString()
        }).eq('id', p.id);
        if (error) throw error;
        p.display_name = name;
        p.email = email || null;
        toast('Profil disimpan.');
      } catch (e) {
        toast(e.message, true);
      }
    };

    $('#changePass').onclick = async () => {
      const pw = $('#newPass').value;
      if (pw.length < 6) return toast('Minimum 6 aksara.', true);
      const { error } = await sb.auth.updateUser({ password: pw });
      if (error) return toast(error.message, true);
      $('#newPass').value = '';
      toast('Password berjaya ditukar.');
    };
  };

  bindGlobal = () => {
    document.addEventListener('click', e => {
      const n = e.target.closest('[data-nav]');
      if (!n) return;
      const v = n.dataset.nav;
      if (v === 'dashboard') renderDashboard();
      if (v === 'projects') renderProjects();
      if (v === 'profile') renderProfile();
      if (v === 'admin') renderAdmin();
    });

    $('#mobileNavToggle').onclick = () => toggleNav();
    $('#mobileShade').onclick = () => toggleNav(false);
    $('#modal').onclick = e => { if (e.target.id === 'modal') closeModal(); };
    $('#logout').onclick = async () => {
      await sb.auth.signOut();
      Object.assign(state, window.NaskhahCore.createState());
      showPublic('login');
    };
  };

  Object.defineProperty(window, 'NaskhahProfileShellModule', {
    value: Object.freeze({ version: '3.0.0-d4' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
