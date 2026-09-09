/* Naskhah Studio — Admin user provisioning and account management */
(() => {
  'use strict';

  const generateTemporaryPassword = () => {
    const chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%';
    const bytes=new Uint32Array(14);
    crypto.getRandomValues(bytes);
    return Array.from(bytes,n=>chars[n%chars.length]).join('');
  };

  const bindPasswordTools = (inputId, showId, generateId) => {
    const input=$('#'+inputId), show=$('#'+showId), generate=$('#'+generateId);
    if(show)show.onclick=()=>{
      input.type=input.type==='password'?'text':'password';
      show.textContent=input.type==='password'?'Show':'Hide';
    };
    if(generate)generate.onclick=()=>{
      input.value=generateTemporaryPassword();
      input.type='text';
      if(show)show.textContent='Hide';
      input.focus();
      input.select();
    };
  };

  const showProvisionedCredentials = ({email,password,title='Login Details'}) => {
    modal(`<h2>${esc(title)}</h2><p class="muted">Salin maklumat ini dan berikan kepada pengguna. Password sementara ini tidak disimpan atau dipaparkan semula oleh Admin Panel.</p><label>Email<input id="credentialEmail" value="${esc(email)}" readonly></label><label>Password Sementara<input id="credentialPassword" value="${esc(password)}" readonly></label><div class="actions"><button class="btn" id="copyCredentials">Copy Login Details</button><button class="btn primary" id="closeCredentials">Selesai</button></div>`);
    $('#copyCredentials').onclick=async()=>{
      const text=`Naskhah Studio\nEmail: ${email}\nPassword sementara: ${password}\n\nSila tukar password selepas login pertama.`;
      try{
        await navigator.clipboard.writeText(text);
        toast('Login details disalin.');
      }catch{
        $('#credentialPassword').select();
        toast('Clipboard tidak tersedia. Salin maklumat secara manual.',true);
      }
    };
    $('#closeCredentials').onclick=()=>{closeModal();renderAdmin();};
  };

  renderAdmin = async () => {
    if (state.profile?.role !== 'admin') return renderDashboard();
    nav('admin');
    const [{ data: users, error: uErr }, { data: meta, error: mErr }] = await Promise.all([
      sb.from('nv1_profiles')
        .select('id,username,display_name,email,role,status,plan,subscription_status,subscription_expires_at,created_at,last_seen_at,must_change_password')
        .order('created_at', { ascending: false }),
      sb.from('nv1_project_metadata').select('*').order('created_at', { ascending: false })
    ]);
    if (uErr) return toast(uErr.message, true);
    const us = users || [], ps = mErr ? [] : (meta || []);
    $('#main').innerHTML = `<div class="page-head"><div><h1>Admin Panel</h1><p>Urus akaun dan langganan. Kandungan manuskrip pengguna tidak dipaparkan.</p></div><button class="btn primary" id="addUser">+ Add User</button></div><div class="stats"><div class="stat"><b>${us.length}</b><span>Registered Users</span></div><div class="stat sections"><b>${us.filter(x=>x.status==='active').length}</b><span>Active Users</span></div><div class="stat words"><b>${ps.length}</b><span>Projects</span></div><div class="stat progress-card"><b>${us.filter(x=>['pro','premium','business'].includes((x.plan||'').toLowerCase())).length}</b><span>Paid Plans</span></div></div><div class="card"><h2>User Management</h2><div class="table-wrap"><table><thead><tr><th>User</th><th>Email</th><th>Registered</th><th>Plan</th><th>Subscription</th><th>Expiry</th><th>Status</th><th>Action</th></tr></thead><tbody>${us.map(u=>`<tr><td><b>${esc(u.display_name||u.username)}</b><br><small>@${esc(u.username)} · ${esc(u.role)}</small>${u.role!=='admin'&&u.must_change_password?'<br><small>🔑 Temporary password — change required</small>':''}</td><td>${esc(u.email||'—')}</td><td>${u.created_at?new Date(u.created_at).toLocaleDateString('ms-MY'):'—'}</td><td>${esc((u.plan||'free').toUpperCase())}</td><td>${esc(u.subscription_status||'trial')}</td><td>${u.subscription_expires_at?new Date(u.subscription_expires_at).toLocaleDateString('ms-MY'):'—'}</td><td>${esc(u.status||'active')}</td><td><button class="btn small edit-user" data-id="${u.id}">Edit</button>${u.role!=='admin'&&u.status!=='active'?` <button class="btn small danger delete-user" data-id="${u.id}">Delete</button>`:''}</td></tr>`).join('')}</tbody></table></div></div><div class="card"><h2>Project Metadata</h2><div class="table-wrap"><table><thead><tr><th>Project</th><th>Type</th><th>User</th><th>Created</th><th>Status</th></tr></thead><tbody>${ps.map(x=>`<tr><td>${esc(x.title||'')}</td><td>${esc(x.project_type||'')}</td><td>${esc(us.find(u=>u.id===x.user_id)?.username||'—')}</td><td>${x.created_at?new Date(x.created_at).toLocaleDateString('ms-MY'):'—'}</td><td>${esc(x.status||'')}</td></tr>`).join('')||'<tr><td colspan="5">Tiada metadata.</td></tr>'}</tbody></table></div></div>`;
    $('#addUser').onclick = adminCreateDialog;
    $$('.edit-user').forEach(b => b.onclick = () => adminEditDialog(us.find(u => u.id === b.dataset.id)));
    $$('.delete-user').forEach(b => b.onclick = () => adminDeleteDialog(us.find(u => u.id === b.dataset.id)));
  };

  adminCreateDialog = () => {
    modal(`<h2>Add User</h2><p class="muted">Akaun disediakan oleh admin selepas pembayaran. Pengguna akan diminta menukar password selepas login pertama.</p><div class="grid2"><label>Nama<input id="auName" required></label><label>Username<input id="auUser" required></label></div><label>Email untuk Sign In<input id="auEmail" type="email" required autocomplete="off"></label><label>Password Sementara<input id="auPass" type="password" minlength="8" required autocomplete="new-password" placeholder="Masukkan password sementara"></label><div class="actions"><button class="btn small" type="button" id="auShowPass">Show</button><button class="btn small" type="button" id="auGeneratePass">Generate Password</button></div><div class="grid2"><label>Plan<select id="auPlan"><option>free</option><option>pro</option><option>premium</option><option>business</option></select></label><label>Status Langganan<select id="auSub"><option>trial</option><option>active</option></select></label></div><label>Tarikh Tamat<input id="auExpiry" type="date"></label><div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn primary" id="createUser">Cipta User</button></div>`);
    bindPasswordTools('auPass','auShowPass','auGeneratePass');
    $('#createUser').onclick = async () => {
      const email=$('#auEmail').value.trim().toLowerCase();
      const password=$('#auPass').value;
      if(!/^\S+@\S+\.\S+$/.test(email))return toast('Masukkan email yang sah.',true);
      if(password.length<8)return toast('Password sementara minimum 8 aksara.',true);
      try {
        await authCall({
          action: 'admin_create_user',
          username: $('#auUser').value.trim().toLowerCase(),
          password,
          display_name: $('#auName').value.trim(),
          email,
          plan: $('#auPlan').value,
          subscription_status: $('#auSub').value,
          subscription_expires_at: $('#auExpiry').value ? new Date($('#auExpiry').value + 'T23:59:59').toISOString() : null
        }, true);
        showProvisionedCredentials({email,password,title:'User Berjaya Dicipta'});
        toast('User berjaya dicipta.');
      } catch (e) {
        toast(e.message, true);
      }
    };
  };

  adminEditDialog = (u) => {
    const exp = u.subscription_expires_at ? new Date(u.subscription_expires_at).toISOString().slice(0, 10) : '';
    const passwordSection=u.role==='admin'?'':`<hr><h3>Password Management</h3><p class="muted">Admin tidak boleh melihat password semasa pengguna. Tetapkan password sementara baru jika reset diperlukan.</p><label>Password Sementara Baharu<input id="euPass" type="password" minlength="8" autocomplete="new-password" placeholder="Biarkan kosong jika tidak reset"></label><div class="actions"><button class="btn small" type="button" id="euShowPass">Show</button><button class="btn small" type="button" id="euGeneratePass">Generate Password</button><button class="btn" type="button" id="resetUserPass">Set New Password</button></div>`;
    modal(`<h2>Edit User</h2><div class="grid2"><label>Nama<input id="euName" value="${esc(u.display_name||'')}"></label><label>Username<input value="${esc(u.username||'')}" disabled></label></div><label>Email<input id="euEmail" type="email" value="${esc(u.email||'')}"></label><div class="grid2"><label>Plan<select id="euPlan"><option>free</option><option>pro</option><option>premium</option><option>business</option></select></label><label>Subscription<select id="euSub"><option>trial</option><option>active</option><option>past_due</option><option>cancelled</option><option>expired</option></select></label></div><div class="grid2"><label>Expiry<input id="euExpiry" type="date" value="${exp}"></label><label>Status<select id="euStatus"><option>active</option><option>suspended</option></select></label></div>${passwordSection}<div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn primary" id="saveUser">Simpan Profil</button></div>`);
    $('#euPlan').value = u.plan || 'free';
    $('#euSub').value = u.subscription_status || 'trial';
    $('#euStatus').value = u.status || 'active';

    if(u.role!=='admin'){
      bindPasswordTools('euPass','euShowPass','euGeneratePass');
      $('#resetUserPass').onclick=async()=>{
        const password=$('#euPass').value;
        if(password.length<8)return toast('Password sementara minimum 8 aksara.',true);
        try{
          await authCall({action:'admin_reset_password',user_id:u.id,new_password:password},true);
          showProvisionedCredentials({email:$('#euEmail').value.trim().toLowerCase()||u.email||'',password,title:'Password Berjaya Direset'});
          toast('Password sementara baharu ditetapkan.');
        }catch(e){toast(e.message,true)}
      };
    }

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
    value: Object.freeze({ version: '3.1.0-secure-provisioning' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();