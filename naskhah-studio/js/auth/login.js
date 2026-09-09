/* Naskhah Studio auth module: secure user login + separate admin login */
(()=>{
  'use strict';

  const LOGIN_URL=SUPABASE_URL+'/functions/v1/naskhah-login';
  const SECURE_LOGIN_URL=SUPABASE_URL+'/functions/v1/naskhah-secure-login';

  async function request(url,payload){
    const r=await fetch(url,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},
      body:JSON.stringify(payload)
    });
    const j=await r.json();
    if(!r.ok)throw new Error(j.error||'Login gagal.');
    return j;
  }

  async function adminLogin(identifier,password){
    return request(LOGIN_URL,{identifier,password});
  }

  async function secureUserLogin(email,password,turnstileToken){
    return request(SECURE_LOGIN_URL,{email,password,turnstile_token:turnstileToken});
  }

  function getTurnstileToken(){
    return document.querySelector('#loginForm [name="cf-turnstile-response"]')?.value?.trim()||'';
  }

  function resetTurnstile(){
    try{ if(window.turnstile) window.turnstile.reset(); }catch{}
  }

  async function continueAfterUserLogin(j){
    await setSession(j.access_token,j.refresh_token);
    if(!state.profile)throw new Error('Profil pengguna tidak ditemui.');
    if(state.profile.status==='suspended')throw new Error('Akaun digantung. Hubungi admin.');
    if(j.must_change_password||state.profile.must_change_password){
      showPublic('firstPassword');
      return;
    }
    await enterApp();
  }

  function attach(){
    const lf=document.querySelector('#loginForm'),af=document.querySelector('#adminForm'),pf=document.querySelector('#firstPasswordForm');

    if(lf&&!lf.dataset.fixed){
      lf.dataset.fixed='1';
      lf.addEventListener('submit',async e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        const email=document.querySelector('#loginUser').value.trim().toLowerCase();
        const password=document.querySelector('#loginPass').value;
        const token=getTurnstileToken();
        if(!token)return toast('Sila lengkapkan pengesahan “Are you human?”.',true);
        try{
          const j=await secureUserLogin(email,password,token);
          await continueAfterUserLogin(j);
        }catch(err){
          resetTurnstile();
          toast(err.message||'Login gagal.',true);
        }
      },true);
    }

    if(af&&!af.dataset.fixed){
      af.dataset.fixed='1';
      af.addEventListener('submit',async e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        const identifier=document.querySelector('#adminUser').value.trim(),password=document.querySelector('#adminPass').value;
        try{
          const j=await adminLogin(identifier,password);
          await setSession(j.access_token,j.refresh_token);
          if(state.profile?.role!=='admin'){
            await sb.auth.signOut();
            throw new Error('Akaun ini bukan admin.');
          }
          await enterApp();
        }catch(err){toast(err.message||'Admin login gagal.',true)}
      },true);
    }

    if(pf&&!pf.dataset.fixed){
      pf.dataset.fixed='1';
      pf.addEventListener('submit',async e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        const a=document.querySelector('#firstPassword').value;
        const b=document.querySelector('#firstPassword2').value;
        if(a.length<8)return toast('Password baharu minimum 8 aksara.',true);
        if(a!==b)return toast('Password tidak sama.',true);
        try{
          await authCall({action:'change_own_password',new_password:a},true);
          await loadProfile();
          document.querySelector('#firstPassword').value='';
          document.querySelector('#firstPassword2').value='';
          toast('Password berjaya ditukar.');
          await enterApp();
        }catch(err){toast(err.message||'Password gagal ditukar.',true)}
      },true);
    }
  }

  document.addEventListener('DOMContentLoaded',attach);
  setTimeout(attach,0);
})();