/* Naskhah Studio auth module: login form handling */
(()=>{
  const LOGIN_URL=SUPABASE_URL+'/functions/v1/naskhah-login';

  async function login(identifier,password){
    const r=await fetch(LOGIN_URL,{
      method:'POST',
      headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},
      body:JSON.stringify({identifier,password})
    });
    const j=await r.json();
    if(!r.ok)throw new Error(j.error||'Login gagal.');
    return j;
  }

  function attach(){
    const lf=document.querySelector('#loginForm'),af=document.querySelector('#adminForm');

    if(lf&&!lf.dataset.fixed){
      lf.dataset.fixed='1';
      lf.addEventListener('submit',async e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        const identifier=document.querySelector('#loginUser').value.trim(),password=document.querySelector('#loginPass').value;
        try{
          const j=await login(identifier,password);
          await setSession(j.access_token,j.refresh_token);
          if(!state.profile)throw new Error('Profil pengguna tidak ditemui.');
          if(state.profile.status==='suspended')throw new Error('Akaun digantung. Hubungi admin.');
          await enterApp();
        }catch(err){toast(err.message||'Login gagal.',true)}
      },true);
    }

    if(af&&!af.dataset.fixed){
      af.dataset.fixed='1';
      af.addEventListener('submit',async e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        const identifier=document.querySelector('#adminUser').value.trim(),password=document.querySelector('#adminPass').value;
        try{
          const j=await login(identifier,password);
          await setSession(j.access_token,j.refresh_token);
          if(state.profile?.role!=='admin'){
            await sb.auth.signOut();
            throw new Error('Akaun ini bukan admin.');
          }
          await enterApp();
        }catch(err){toast(err.message||'Admin login gagal.',true)}
      },true);
    }
  }

  document.addEventListener('DOMContentLoaded',attach);
  setTimeout(attach,0);
})();