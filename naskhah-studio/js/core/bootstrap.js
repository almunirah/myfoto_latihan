/* Naskhah Studio — secure auth orchestration */
(() => {
  'use strict';

  const SECURE_LOGIN_URL=SUPABASE_URL+'/functions/v1/naskhah-secure-login';
  const recoveryUrl=()=>{
    const hash=new URLSearchParams(location.hash.replace(/^#/,''));
    const query=new URLSearchParams(location.search);
    return hash.get('type')==='recovery'||query.get('type')==='recovery'||query.has('code');
  };
  let recoveryMode=recoveryUrl();

  async function secureLogin(email,password,turnstileToken){
    let response;
    try{
      response=await fetch(SECURE_LOGIN_URL,{
        method:'POST',
        headers:{'Content-Type':'application/json',apikey:SUPABASE_KEY},
        body:JSON.stringify({email,password,turnstile_token:turnstileToken})
      });
    }catch{
      throw new Error('Sambungan login gagal. Sila semak internet dan cuba lagi.');
    }
    let body={};
    try{body=await response.json()}catch{}
    if(!response.ok)throw new Error(body.error||'Login gagal. Sila cuba lagi.');
    return body;
  }

  function turnstileToken(){
    return $('#loginForm [name="cf-turnstile-response"]')?.value?.trim()||'';
  }

  function resetTurnstile(){
    try{if(window.turnstile)window.turnstile.reset()}catch{}
  }

  async function sendRecoveryEmail(email){
    const clean=String(email||'').trim().toLowerCase();
    if(!/^\S+@\S+\.\S+$/.test(clean))throw new Error('Masukkan alamat email yang sah.');
    const redirectTo=location.origin+location.pathname;
    await authCall({action:'forgot',identifier:clean,redirect_to:redirectTo});
  }

  function bindRecoveryListener(){
    sb.auth.onAuthStateChange((event,session)=>{
      if(event!=='PASSWORD_RECOVERY')return;
      recoveryMode=true;
      state.session=session||null;
      setTimeout(()=>showPublic('reset'),0);
    });
  }

  bindAuth = () => {
    $('#goAdmin').onclick=()=>showPublic('admin');
    $$('.toLogin').forEach(x=>x.onclick=()=>showPublic('login'));
    $('#forgotLink').onclick=()=>showPublic('forgot');
    $('#adminForgotLink').onclick=()=>showPublic('forgot');

    $('#loginForm').onsubmit=async e=>{
      e.preventDefault();
      const token=turnstileToken();
      if(!token)return toast('Sila lengkapkan pengesahan “Are you human?”.',true);
      try{
        const j=await secureLogin($('#loginUser').value.trim().toLowerCase(),$('#loginPass').value,token);
        await setSession(j.access_token,j.refresh_token);
        if(state.profile?.status==='suspended')throw new Error('Akaun digantung. Hubungi admin.');
        if(j.must_change_password||state.profile?.must_change_password)return showPublic('firstPassword');
        await enterApp();
      }catch(err){
        resetTurnstile();
        toast(err.message||'Login gagal.',true);
      }
    };

    $('#adminForm').onsubmit=async e=>{
      e.preventDefault();
      try{
        const j=await authCall({action:'login',identifier:$('#adminUser').value.trim(),password:$('#adminPass').value});
        await setSession(j.access_token,j.refresh_token);
        if(state.profile?.role!=='admin'){
          await sb.auth.signOut();
          throw new Error('Akaun ini bukan admin.');
        }
        await enterApp();
      }catch(err){toast(err.message||'Admin login gagal.',true)}
    };

    $('#forgotForm').onsubmit=async e=>{
      e.preventDefault();
      const button=$('#forgotForm button[type="submit"]');
      button.disabled=true;
      try{
        await sendRecoveryEmail($('#forgotUser').value);
        toast('Jika email berdaftar, reset link telah dihantar.');
        showPublic('login');
      }catch(err){
        toast(err.message||'Reset link gagal dihantar.',true);
      }finally{
        button.disabled=false;
      }
    };

    $('#firstPasswordForm').onsubmit=async e=>{
      e.preventDefault();
      const a=$('#firstPassword').value,b=$('#firstPassword2').value;
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

    $('#resetForm').onsubmit=async e=>{
      e.preventDefault();
      const a=$('#resetPass').value,b=$('#resetPass2').value;
      if(a.length<8)return toast('Password baharu minimum 8 aksara.',true);
      if(a!==b)return toast('Password tidak sama.',true);
      const button=$('#resetForm button[type="submit"]');
      button.disabled=true;
      try{
        const {error}=await sb.auth.updateUser({password:a});
        if(error)throw error;
        recoveryMode=false;
        $('#resetPass').value='';
        $('#resetPass2').value='';
        await sb.auth.signOut();
        toast('Password berjaya ditukar. Sila login semula.');
        showPublic('login');
      }catch(err){
        toast(err.message||'Password gagal ditukar.',true);
      }finally{
        button.disabled=false;
      }
    };
  };

  boot = async () => {
    bindGlobal();
    bindRecoveryListener();
    bindAuth();

    // Give Supabase a brief opportunity to consume a password-recovery URL.
    await new Promise(resolve=>setTimeout(resolve,50));
    if(recoveryMode)return showPublic('reset');

    const {data:{session}}=await sb.auth.getSession();
    if(session){
      try{
        state.session=session;
        await loadProfile();
        if(recoveryMode)return showPublic('reset');
        if(state.profile?.status==='active'&&state.profile?.must_change_password)return showPublic('firstPassword');
        if(state.profile?.status==='active')return enterApp();
      }catch{}
      await sb.auth.signOut();
    }
    showPublic('login');
  };

  document.addEventListener('DOMContentLoaded',boot);

  Object.defineProperty(window,'NaskhahBootstrapModule',{
    value:Object.freeze({version:'3.3.2-login-load-fix'}),
    writable:false,
    configurable:false,
    enumerable:true
  });
})();