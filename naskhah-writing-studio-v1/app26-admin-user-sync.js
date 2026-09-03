// Admin/User profile alignment — editable account & subscription details
(function(){
  const previousAdmin=renderAdmin;
  renderAdmin=async function(){
    if(state.profile?.role!=='admin')return renderDashboard();
    setActiveNav('admin');
    const [{data:users},{data:meta},{data:audit}]=await Promise.all([
      sb.from('nv1_profiles').select('id,username,display_name,email,role,status,plan,subscription_status,subscription_expires_at,created_at,last_seen_at,updated_at').order('created_at',{ascending:false}),
      sb.from('nv1_project_metadata').select('project_id,user_id,title,project_type,status,created_at,updated_at').order('created_at',{ascending:false}),
      sb.from('nv1_admin_audit_log').select('id,admin_id,action,target_user_id,details,created_at').order('created_at',{ascending:false}).limit(20)
    ]);
    const us=users||[],ps=meta||[];
    const active=us.filter(x=>x.status==='active').length;
    const paid=us.filter(x=>['pro','premium','business'].includes((x.plan||'').toLowerCase())).length;
    $('#main').innerHTML=`<div class="page-head"><div><h1>Admin SaaS Dashboard</h1><p>Maklumat akaun diselarikan dengan Profile User. Admin hanya mengurus akaun dan metadata projek, bukan kandungan manuskrip.</p></div><button class="btn primary" id="adminCreateUser">+ Cipta User</button></div>
    <div class="privacy-banner"><b>🔒 Privacy by design</b><span>Admin tidak boleh membaca manuskrip, Research Notes, References atau supervisor notes pengguna.</span></div>
    <div class="stats"><div class="stat"><b>${us.length}</b><span>Registered Users</span></div><div class="stat"><b>${active}</b><span>Active</span></div><div class="stat"><b>${ps.length}</b><span>Projects</span></div><div class="stat"><b>${paid}</b><span>Paid Plans</span></div></div>
    <div class="card"><div class="card-head"><div><h2>User Management</h2><p>Nama, email, tarikh daftar, plan, langganan dan status akaun.</p></div></div><div class="table-wrap"><table><thead><tr><th>User</th><th>Email</th><th>Daftar</th><th>Plan</th><th>Subscription</th><th>Tamat</th><th>Status</th><th>Action</th></tr></thead><tbody>${us.map(u=>`<tr><td><b>${escapeHtml(u.display_name||u.username||'—')}</b><small class="cell-sub">@${escapeHtml(u.username||'')} · ${escapeHtml(u.role||'user')}</small></td><td>${escapeHtml(u.email||'—')}</td><td>${u.created_at?new Date(u.created_at).toLocaleDateString('ms-MY'):'—'}</td><td>${escapeHtml((u.plan||'free').toUpperCase())}</td><td>${escapeHtml(u.subscription_status||'trial')}</td><td>${u.subscription_expires_at?new Date(u.subscription_expires_at).toLocaleDateString('ms-MY'):'—'}</td><td><span class="status-chip ${u.status==='active'?'ok':'off'}">${escapeHtml(u.status||'active')}</span></td><td><button class="btn small adm-edit-user" data-id="${u.id}">Edit</button></td></tr>`).join('')}</tbody></table></div></div>
    <div class="card"><div class="card-head"><div><h2>Project Metadata</h2><p>Admin nampak nama projek, jenis dan tarikh sahaja.</p></div></div><div class="table-wrap"><table><thead><tr><th>Project</th><th>Type</th><th>User</th><th>Created</th><th>Updated</th><th>Status</th></tr></thead><tbody>${ps.map(p=>{const u=us.find(x=>x.id===p.user_id);return `<tr><td>${escapeHtml(p.title)}</td><td>${escapeHtml(p.project_type)}</td><td>${escapeHtml(u?.username||'—')}</td><td>${new Date(p.created_at).toLocaleDateString('ms-MY')}</td><td>${new Date(p.updated_at).toLocaleDateString('ms-MY')}</td><td>${escapeHtml(p.status||'—')}</td></tr>`}).join('')||'<tr><td colspan="6">Belum ada project.</td></tr>'}</tbody></table></div></div>
    <div class="card"><h2>Recent Admin Audit</h2>${(audit||[]).map(a=>`<div class="audit-row"><b>${escapeHtml(a.action)}</b><small>${new Date(a.created_at).toLocaleString('ms-MY')}</small></div>`).join('')||'<div class="empty">Belum ada audit action.</div>'}</div>`;

    const log=async(action,target,details={})=>sb.from('nv1_admin_audit_log').insert({admin_id:state.profile.id,action,target_user_id:target||null,details});
    $$('.adm-edit-user').forEach(btn=>btn.onclick=()=>openAdminUserEditor(us.find(x=>x.id===btn.dataset.id),log));
    $('#adminCreateUser').onclick=()=>adminCreateUserDialog(log);
  };

  function openAdminUserEditor(u,log){
    if(!u)return;
    const expiry=u.subscription_expires_at?new Date(u.subscription_expires_at).toISOString().slice(0,10):'';
    modal(`<h2>Edit User</h2><p>Kemas kini maklumat akaun dan langganan. Tarikh mula daftar dikunci sebagai rekod asal.</p>
      <div class="grid2"><label>Nama<input id="aeName" value="${escapeHtml(u.display_name||'')}"></label><label>Username<input value="${escapeHtml(u.username||'')}" disabled></label></div>
      <label>Email / Recovery Email<input id="aeEmail" type="email" value="${escapeHtml(u.email||'')}"></label>
      <div class="grid2"><label>Plan<select id="aePlan"><option value="free">Free</option><option value="pro">Pro</option><option value="premium">Premium</option><option value="business">Business</option></select></label><label>Status Langganan<select id="aeSub"><option value="trial">Trial</option><option value="active">Active</option><option value="past_due">Past Due</option><option value="cancelled">Cancelled</option><option value="expired">Expired</option></select></label></div>
      <div class="grid2"><label>Tarikh Tamat Langganan<input id="aeExpiry" type="date" value="${expiry}"></label><label>Status Akaun<select id="aeStatus"><option value="active">Active</option><option value="suspended">Suspended</option></select></label></div>
      <div class="grid2"><label>Role<select id="aeRole"><option value="user">User</option><option value="admin">Admin</option></select></label><label>Tarikh Mula Daftar<input value="${u.created_at?new Date(u.created_at).toLocaleString('ms-MY'):'—'}" disabled></label></div>
      <label>Aktiviti Terakhir<input value="${u.last_seen_at?new Date(u.last_seen_at).toLocaleString('ms-MY'):'—'}" disabled></label>
      <p class="muted">Perubahan email di sini mengemas kini rekod profil/recovery. Untuk keselamatan, perubahan email autentikasi pengguna perlu disahkan oleh pengguna melalui Profile jika diperlukan.</p>
      <div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn primary" id="aeSave">Simpan Perubahan</button></div>`);
    $('#aePlan').value=u.plan||'free';$('#aeSub').value=u.subscription_status||'trial';$('#aeStatus').value=u.status||'active';$('#aeRole').value=u.role||'user';
    $('#aeSave').onclick=async()=>{
      const payload={display_name:$('#aeName').value.trim(),email:$('#aeEmail').value.trim()||null,plan:$('#aePlan').value,subscription_status:$('#aeSub').value,subscription_expires_at:$('#aeExpiry').value?new Date($('#aeExpiry').value+'T23:59:59').toISOString():null,status:$('#aeStatus').value,role:$('#aeRole').value,updated_at:new Date().toISOString()};
      if(payload.email&&!/^\S+@\S+\.\S+$/.test(payload.email))return toast('Format email tidak sah.',true);
      const {error}=await sb.from('nv1_profiles').update(payload).eq('id',u.id);if(error)return toast(error.message,true);
      await log('user_profile_updated',u.id,{plan:payload.plan,subscription_status:payload.subscription_status,status:payload.status,role:payload.role,email_changed:payload.email!==u.email,expiry:payload.subscription_expires_at});
      closeModal();toast('Maklumat user berjaya dikemas kini.');renderAdmin();
    };
  }

  const css=document.createElement('style');css.textContent=`.btn.small{padding:6px 9px;font-size:11px}.table-wrap td{vertical-align:middle}.table-wrap th{white-space:nowrap}`;document.head.appendChild(css);
})();