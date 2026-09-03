// Enhanced user profile: editable email + registration/subscription information
(function(){
  const oldRenderProfile=renderProfile;
  renderProfile=function(){
    setActiveNav('profile');
    const pf=state.profile||{};
    const registered=pf.created_at?new Date(pf.created_at).toLocaleString('ms-MY'):'—';
    const expiry=pf.subscription_expires_at?new Date(pf.subscription_expires_at).toLocaleDateString('ms-MY'):'—';
    const lastSeen=pf.last_seen_at?new Date(pf.last_seen_at).toLocaleString('ms-MY'):'—';
    $('#main').innerHTML=`<div class="page-head"><div><h1>Profile & Subscription</h1><p>Urus maklumat akaun, email, keselamatan dan rekod langganan anda.</p></div></div>
    <div class="grid2 profile-grid">
      <div class="card"><h2>Maklumat Profil</h2>
        <label>Nama paparan<input id="pfName" value="${escapeHtml(pf.display_name||'')}"></label>
        <label>Username<input value="${escapeHtml(pf.username||'')}" disabled></label>
        <label>Email<input id="pfEmail" type="email" value="${escapeHtml(pf.email||'')}" placeholder="nama@email.com"></label>
        <p class="muted profile-note">Jika email login ditukar, sistem mungkin meminta pengesahan melalui email baharu sebelum perubahan berkuat kuasa.</p>
        <button class="btn primary" id="saveProfileEnhanced">Simpan Perubahan</button>
      </div>
      <div class="card"><h2>Rekod Akaun & Langganan</h2>
        <div class="profile-info-row"><span>Tarikh mula daftar</span><b>${registered}</b></div>
        <div class="profile-info-row"><span>Plan semasa</span><b class="profile-plan">${escapeHtml((pf.plan||'free').toUpperCase())}</b></div>
        <div class="profile-info-row"><span>Status langganan</span><b>${escapeHtml(pf.subscription_status||'trial')}</b></div>
        <div class="profile-info-row"><span>Tarikh tamat langganan</span><b>${expiry}</b></div>
        <div class="profile-info-row"><span>Status akaun</span><b>${escapeHtml(pf.status||'active')}</b></div>
        <div class="profile-info-row"><span>Aktiviti terakhir direkod</span><b>${lastSeen}</b></div>
        <p class="muted profile-note">Maklumat ini disimpan untuk rekod langganan, pembaharuan plan dan sejarah akaun. Kandungan manuskrip kekal private.</p>
      </div>
    </div>
    <div class="grid2 profile-grid">
      <div class="card"><h2>Tukar Password</h2><label>Password Baharu<input id="newPass" type="password" minlength="6"></label><button class="btn primary" id="changePassEnhanced">Tukar Password</button></div>
      <div class="card"><h2>Keselamatan Akaun</h2><p>Email recovery yang aktif membantu proses reset password dan notifikasi akaun.</p><div class="profile-info-row"><span>Role</span><b>${escapeHtml(pf.role||'user')}</b></div><div class="profile-info-row"><span>User ID</span><code>${escapeHtml(pf.id||'')}</code></div></div>
    </div>`;

    $('#saveProfileEnhanced').onclick=async()=>{
      const name=$('#pfName').value.trim(),email=$('#pfEmail').value.trim();
      if(email&&!/^\S+@\S+\.\S+$/.test(email))return toast('Format email tidak sah.',true);
      const currentEmail=(state.profile?.email||'').trim().toLowerCase();
      try{
        if(email&&email.toLowerCase()!==currentEmail){
          const {error:authErr}=await sb.auth.updateUser({email});
          if(authErr)throw authErr;
        }
        const {error}=await sb.from('nv1_profiles').update({display_name:name,email:email||null,last_seen_at:new Date().toISOString(),updated_at:new Date().toISOString()}).eq('id',pf.id);
        if(error)throw error;
        state.profile={...state.profile,display_name:name,email:email||null,last_seen_at:new Date().toISOString()};
        toast(email&&email.toLowerCase()!==currentEmail?'Profil disimpan. Semak email baharu untuk pengesahan jika diminta.':'Profil disimpan.');
        renderProfile();
      }catch(e){toast(e.message||'Gagal mengemas kini profil.',true)}
    };
    $('#changePassEnhanced').onclick=async()=>{const p=$('#newPass').value;if(p.length<6)return toast('Minimum 6 aksara.',true);const {error}=await sb.auth.updateUser({password:p});if(error)return toast(error.message,true);$('#newPass').value='';toast('Password berjaya ditukar.')};
  };

  const css=document.createElement('style');css.textContent=`.profile-grid{align-items:start}.profile-info-row{display:flex;justify-content:space-between;gap:18px;padding:11px 0;border-bottom:1px solid var(--line);align-items:center}.profile-info-row span{color:var(--muted);font-size:13px}.profile-info-row b,.profile-info-row code{text-align:right;word-break:break-word}.profile-plan{color:#5d3ed6}.profile-note{font-size:12px;line-height:1.5;margin-top:8px}@media(max-width:650px){.profile-info-row{align-items:flex-start;flex-direction:column;gap:4px}.profile-info-row b,.profile-info-row code{text-align:left}}`;document.head.appendChild(css);
})();