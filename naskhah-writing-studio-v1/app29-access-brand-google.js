// Naskhah Studio access model + logo + Google sign-in
(function(){
  const LOGIN_URL=SUPABASE_URL+'/functions/v1/naskhah-login';
  function brand(){
    document.title='Naskhah Studio';
    document.querySelectorAll('.brand').forEach(b=>{
      let logo=b.querySelector('.logo');
      if(logo){logo.innerHTML='<img src="naskhah-studio-logo.svg" alt="Naskhah Studio">';logo.classList.add('brand-logo-img')}
      const span=b.querySelector('span');if(span)span.textContent='Naskhah Studio';
    });
    const hero=document.querySelector('.hero');if(hero){const h=hero.querySelector('h1');if(h)h.textContent='Tulis dengan struktur. Siap dengan yakin.';const p=hero.querySelector('p');if(p)p.textContent='Workspace penulisan untuk artikel jurnal, tesis, buku dan eBook — dari idea hingga siap diterbitkan.'}
  }
  function lockRegistration(){
    document.querySelector('#goRegister')?.remove();
    document.querySelector('#registerPanel')?.remove();
    const sw=document.querySelector('#loginPanel .auth-switch');if(sw){const note=document.createElement('div');note.className='access-note';note.innerHTML='Akaun Naskhah Studio disediakan oleh pentadbir selepas pembelian.';sw.prepend(note)}
  }
  function enhanceLogin(){
    const form=document.querySelector('#loginForm');if(!form||form.dataset.nsEnhanced)return;form.dataset.nsEnhanced='1';
    const label=form.querySelector('label');if(label){label.childNodes[0].nodeValue='Email atau Username';const inp=document.querySelector('#loginUser');if(inp)inp.placeholder='email@domain.com atau username'}
    form.addEventListener('submit',async e=>{e.preventDefault();e.stopImmediatePropagation();const identifier=document.querySelector('#loginUser')?.value.trim()||'',password=document.querySelector('#loginPass')?.value||'';if(!identifier||password.length<6)return toast('Masukkan email/username dan password.',true);const btn=form.querySelector('button[type="submit"],button:not([type])');if(btn){btn.disabled=true;btn.textContent='Log masuk...'}try{const r=await fetch(LOGIN_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY},body:JSON.stringify({identifier,password})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Login gagal.');await setSession(j.access_token,j.refresh_token);if(!state.profile)throw new Error('Akaun belum diaktifkan. Hubungi pentadbir.');await enterApp()}catch(err){toast(err.message||'Login gagal.',true)}finally{if(btn){btn.disabled=false;btn.textContent='Log In'}}},true);
    if(!document.querySelector('#googleSignIn')){const divider=document.createElement('div');divider.className='auth-divider';divider.innerHTML='<span>atau</span>';const g=document.createElement('button');g.id='googleSignIn';g.type='button';g.className='btn google-login block';g.innerHTML='<span class="google-g">G</span> Log masuk dengan Google';form.insertAdjacentElement('afterend',divider);divider.insertAdjacentElement('afterend',g);g.onclick=googleLogin}
  }
  async function googleLogin(){
    try{localStorage.setItem('naskhah_google_attempt','1');const {error}=await sb.auth.signInWithOAuth({provider:'google',options:{redirectTo:location.origin+location.pathname}});if(error)throw error}catch(e){localStorage.removeItem('naskhah_google_attempt');toast('Google Login belum dikonfigurasi sepenuhnya. '+(e.message||''),true)}
  }
  async function validateOAuthSession(session){
    if(!session)return;state.session=session;await loadProfile();if(!state.profile){await sb.auth.signOut();showPublic('login');toast('Akaun Google ini belum didaftarkan oleh pentadbir Naskhah Studio.',true);return}if(state.profile.status==='suspended'){await sb.auth.signOut();showPublic('login');toast('Akaun digantung. Hubungi pentadbir.',true);return}await enterApp();localStorage.removeItem('naskhah_google_attempt')
  }
  async function bootOAuth(){
    const {data:{session}}=await sb.auth.getSession();if(session&&localStorage.getItem('naskhah_google_attempt')==='1')await validateOAuthSession(session);
    sb.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_IN'&&session&&localStorage.getItem('naskhah_google_attempt')==='1')setTimeout(()=>validateOAuthSession(session),0)})
  }
  function init(){brand();lockRegistration();enhanceLogin();bootOAuth()}
  document.addEventListener('DOMContentLoaded',init);setTimeout(init,0);
  const css=document.createElement('style');css.textContent=`.brand-logo-img{background:transparent!important;width:54px!important;height:54px!important;border-radius:0!important;display:grid!important;place-items:center!important;overflow:visible!important}.brand-logo-img img{width:54px;height:44px;object-fit:contain}.hero .brand-logo-img{width:68px!important;height:68px!important}.hero .brand-logo-img img{width:68px;height:58px}.access-note{font-size:12px;line-height:1.45;color:var(--muted);padding:10px 12px;background:#f7f8fb;border-radius:10px;margin:8px 0 10px}.auth-divider{display:flex;align-items:center;gap:10px;margin:14px 0;color:var(--muted);font-size:12px}.auth-divider:before,.auth-divider:after{content:'';height:1px;background:var(--line);flex:1}.google-login{background:#fff!important;color:#1f2937!important;border:1px solid #d9dee8!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:10px!important}.google-g{font-weight:900;font-size:17px;color:#4285f4}.google-login:hover{background:#f8fafc!important}`;document.head.appendChild(css);
})();