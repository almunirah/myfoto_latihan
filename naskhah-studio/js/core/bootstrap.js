/* Naskhah Studio — Phase 3 Batch I1 bootstrap/auth orchestration */
(() => {
  'use strict';

  const SECURE_LOGIN_URL=SUPABASE_URL+'/functions/v1/naskhah-secure-login';

  async function secureLogin(email,password,turnstileToken){
    const response=await fetch(SECURE_LOGIN_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json',apikey:SUPABASE_KEY},
      body:JSON.stringify({email,password,turnstile_token:turnstileToken})
    });
    const body=await response.json();
    if(!response.ok)throw new Error(body.error||'Login gagal.');
    return body;
  }

  function turnstileToken(){
    return $('#loginForm [name="cf-turnstile-response"]')?.value?.trim()||'';
  }

  function resetTurnstile(){
    try{ if(window.turnstile) window.turnstile.reset(); }catch{}
  }

  bindAuth = () => {
    $('#goAdmin').onclick = () => showPublic('admin');
    $$('.toLogin').forEach(x => x.onclick = () => showPublic('login'));
    $('#forgotLink').onclick = () => showPublic('forgot');

    $('#loginForm').onsubmit = async e => {
      e.preventDefault();
      const token=turnstileToken();
      if(!token)return toast('Sila lengkapkan pengesahan “Are you human?”.',true);
      try {
        const j = await secureLogin($('#loginUser').value.trim().toLowerCase(), $('#loginPass').value, token);
        await setSession(j.access_token, j.refresh_token);
        if (state.profile?.status === 'suspended') throw new Error('Akaun digantung. Hubungi admin.');
        if (j.must_change_password || state.profile?.must_change_password) return showPublic('firstPassword');
        await enterApp();
      } catch (err) {
        resetTurnstile();
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

    $('#firstPasswordForm').onsubmit = async e => {
      e.preventDefault();
      const a=$('#firstPassword').value;
      const b=$('#firstPassword2').value;
      if(a.length<8)return toast('Password baharu minimum 8 aksara.',true);
      if(a!==b)return toast('Password tidak sama.',true);
      try{
        await authCall({action:'change_own_password',new_password:a},true);
        await loadProfile();
        $('#firstPassword').value='';
        $('#firstPassword2').value='';
        toast('Password berjaya ditukar.');
        await enterApp();
      }catch(err){toast(err.message||'Password gagal ditukar.',true)}
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
        if(state.profile?.status==='active' && state.profile?.must_change_password) return showPublic('firstPassword');
        if (state.profile?.status === 'active') return enterApp();
      } catch {}
      await sb.auth.signOut();
    }
    showPublic('login');
  };

  document.addEventListener('DOMContentLoaded', boot);

  Object.defineProperty(window, 'NaskhahBootstrapModule', {
    value: Object.freeze({ version: '3.1.0-secure-login' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();