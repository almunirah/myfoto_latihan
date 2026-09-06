/* Naskhah Studio — Phase 3 Batch H1
 * Admin panel rendering and user-management dialog ownership.
 */
(() => {
  'use strict';

  renderAdmin = async () => {
    if (state.profile?.role !== 'admin') return renderDashboard();
    nav('admin');
    const [{ data: users, error: uErr }, { data: meta, error: mErr }] = await Promise.all([
      sb.from('nv1_profiles')
        .select('id,username,display_name,email,role,status,plan,subscription_status,subscription_expires_at,created_at,last_seen_at')
        .order('created_at', { ascending: false }),
      sb.from('nv1_project_metadata').select('*').order('created_at', { ascending: false })
    ]);
    if (uErr) return toast(uErr.message, true);
    const us = users || [], ps = mErr ? [] : (meta || []);
    $('#main').innerHTML = `<div class="page-head"><div><h1>Admin Panel</h1><p>Urus akaun dan langganan. Kandungan manuskrip pengguna tidak dipaparkan.</p></div><button class="btn primary" id="addUser">+ Add User</button></div><div class="stats"><div class="stat"><b>${us.length}</b><span>Registered Users</span></div><div class="stat sections"><b>${us.filter(x=>x.status==='active').length}</b><span>Active Users</span></div><div class="stat words"><b>${ps.length}</b><span>Projects</span></div><div class="stat progress-card"><b>${us.filter(x=>['pro','premium','business'].includes((x.plan||'').toLowerCase())).length}</b><span>Paid Plans</span></div></div><div class="card"><h2>User Management</h2><div class="table-wrap"><table><thead><tr><th>User</th><th>Email</th><th>Registered</th><th>Plan</th><th>Subscription</th><th>Expiry</th><th>Status</th><th>Action</th></tr></thead><tbody>${us.map(u=>`<tr><td><b>${esc(u.display_name||u.username)}</b><br><small>@${esc(u.username)} · ${esc(u.role)}</small></td><td>${esc(u.email||'—')}</td><td>${u.created_at?new Date(u.created_at).toLocaleDateString('ms-MY'):'—'}</td><td>${esc((u.plan||'free').toUpperCase())}</td><td>${esc(u.subscription_status||'trial')}</td><td>${u.subscription_expires_at?new Date(u.subscription_expires_at).toLocaleDateString('ms-MY'):'—'}</td><td>${esc(u.status||'active')}</td><td><button class="btn small edit-user" data-id="${u.id}">Edit</button>${u.role!=='admin'&&u.status!=='active'?` <button class="btn small danger delete-user" data-id="${u.id}">Delete</button>`:''}</td></tr>`).join('')}</tbody></table></div></div><div class="card"><h2>Project Metadata</h2><div class="table-wrap"><table><thead><tr><th>Project</th><th>Type</th><th>User</th><th>Created</th><th>Status</th></tr></thead><tbody>${ps.map(x=>`<tr><td>${esc(x.title||'')}</td><td>${esc(x.project_type||'')}</td><td>${esc(us.find(u=>u.id===x.user_id)?.username||'—')}</td><td>${x.created_at?new Date(x.created_at).toLocaleDateString('ms-MY'):'—'}</td><td>${esc(x.status||'')}</td></tr>`).join('')||'<tr><td colspan="5">Tiada metadata.</td></tr>'}</tbody></table></div></div>`;
    $('#addUser').onclick = adminCreateDialog;
    $$('.edit-user').forEach(b => b.onclick = () => adminEditDialog(us.find(u => u.id === b.dataset.id)));
    $$('.delete-user').forEach(b => b.onclick = () => adminDeleteDialog(us.find(u => u.id === b.dataset.id)));
  };

  adminCreateDialog = () => {
    modal(`<h2>Add User</h2><div class="grid2"><label>Nama<input id="auName"></label><label>Username<input id="auUser"></label></div><label>Email<input id="auEmail" type="email"></label><div class="grid2"><label>Password sementara<input id="auPass" type="password" value="user123"></label><label>Plan<select id="auPlan"><option>free</option><option>pro</option><option>premium</option><option>business</option></select></label></div><div class="grid2"><label>Status Langganan<select id="auSub"><option>trial</option><option>active</option></select></label><label>Tarikh Tamat<input id="auExpiry" type="date"></label></div><div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn primary" id="createUser">Cipta User</button></div>`);
    $('#createUser').onclick = async () => {
      try {
        await authCall({
          action: 'admin_create_user',
          username: $('#auUser').value.trim().toLowerCase(),
          password: $('#auPass').value,
          display_name: $('#auName').value.trim(),
          email: $('#auEmail').value.trim(),
          plan: $('#auPlan').value,
          subscription_status: $('#auSub').value,
          subscription_expires_at: $('#auExpiry').value ? new Date($('#auExpiry').value + 'T23:59:59').toISOString() : null
        }, true);
        closeModal();
        toast('User berjaya dicipta.');
        renderAdmin();
      } catch (e) {
        toast(e.message, true);
      }
    };
  };

  adminEditDialog = (u) => {
    const exp = u.subscription_expires_at ? new Date(u.subscription_expires_at).toISOString().slice(0, 10) : '';
    modal(`<h2>Edit User</h2><div class="grid2"><label>Nama<input id="euName" value="${esc(u.display_name||'')}"></label><label>Username<input value="${esc(u.username||'')}" disabled></label></div><label>Email<input id="euEmail" type="email" value="${esc(u.email||'')}"></label><div class="grid2"><label>Plan<select id="euPlan"><option>free</option><option>pro</option><option>premium</option><option>business</option></select></label><label>Subscription<select id="euSub"><option>trial</option><option>active</option><option>past_due</option><option>cancelled</option><option>expired</option></select></label></div><div class="grid2"><label>Expiry<input id="euExpiry" type="date" value="${exp}"></label><label>Status<select id="euStatus"><option>active</option><option>suspended</option></select></label></div><div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn primary" id="saveUser">Simpan</button></div>`);
    $('#euPlan').value = u.plan || 'free';
    $('#euSub').value = u.subscription_status || 'trial';
    $('#euStatus').value = u.status || 'active';
    $('#saveUser').onclick = async () => {
      const { error } = await sb.from('nv1_profiles').update({
        display_name: $('#euName').value.trim(),
        email: $('#euEmail').value.trim() || null,
        plan: $('#euPlan').value,
        subscription_status: $('#euSub').value,
        subscription_expires_at: $('#euExpiry').value ? new Date($('#euExpiry').value + 'T23:59:59').toISOString() : null,
        status: $('#euStatus').value,
        updated_at: new Date().toISOString()
      }).eq('id', u.id);
      if (error) return toast(error.message, true);
      closeModal();
      toast('User dikemas kini.');
      renderAdmin();
    };
  };

  adminDeleteDialog = (u) => {
    modal(`<h2>Delete User</h2><p>Akaun <b>${esc(u.username)}</b> akan dipadam. Fungsi ini hanya dipaparkan untuk user yang tidak aktif/suspended.</p><label>Taip DELETE<input id="delConfirm"></label><div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn danger" id="confirmDelete">Delete User</button></div>`);
    $('#confirmDelete').onclick = async () => {
      if ($('#delConfirm').value !== 'DELETE') return toast('Taip DELETE untuk sahkan.', true);
      try {
        await authCall({ action: 'admin_delete_user', user_id: u.id }, true);
        closeModal();
        toast('User dipadam.');
        renderAdmin();
      } catch (e) {
        toast(e.message, true);
      }
    };
  };

  Object.defineProperty(window, 'NaskhahAdminRuntimeModule', {
    value: Object.freeze({ version: '3.0.0-h1' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
