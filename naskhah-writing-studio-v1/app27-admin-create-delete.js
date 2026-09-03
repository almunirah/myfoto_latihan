// Admin create user + safe delete inactive user
(function(){
  const baseRenderAdmin=renderAdmin;
  renderAdmin=async function(){
    await baseRenderAdmin();
    if(state.profile?.role!=='admin')return;
    const rows=[...document.querySelectorAll('.adm-edit-user')];
    rows.forEach(edit=>{
      const tr=edit.closest('tr');if(!tr||tr.querySelector('.adm-delete-user'))return;
      const del=document.createElement('button');del.className='btn small danger adm-delete-user';del.dataset.id=edit.dataset.id;del.textContent='Delete';del.style.marginLeft='5px';edit.parentElement.appendChild(del);
      del.onclick=()=>confirmDeleteUser(edit.dataset.id,tr);
    });
  };

  window.adminCreateUserDialog=function(log){
    modal(`<h2>Tambah User</h2><p>Admin boleh mencipta akaun baharu dan menetapkan plan awal.</p>
      <div class="grid2"><label>Nama<input id="acuName" placeholder="Nama pengguna"></label><label>Username<input id="acuUser" placeholder="contoh: aminah"></label></div>
      <label>Email<input id="acuEmail" type="email" placeholder="nama@email.com"></label>
      <div class="grid2"><label>Password sementara<input id="acuPass" type="password" value="user123"></label><label>Plan<select id="acuPlan"><option value="free">Free</option><option value="pro">Pro</option><option value="premium">Premium</option><option value="business">Business</option></select></label></div>
      <div class="grid2"><label>Status Langganan<select id="acuSub"><option value="trial">Trial</option><option value="active">Active</option></select></label><label>Tarikh Tamat Langganan<input id="acuExpiry" type="date"></label></div>
      <div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn primary" id="acuSave">Cipta User</button></div>`);
    $('#acuSave').onclick=async()=>{
      const username=$('#acuUser').value.trim().toLowerCase(),display_name=$('#acuName').value.trim(),email=$('#acuEmail').value.trim(),password=$('#acuPass').value;
      if(!/^[a-z0-9._-]{3,30}$/.test(username))return toast('Username mesti 3–30 aksara.',true);if(password.length<6)return toast('Password minimum 6 aksara.',true);if(email&&!/^\S+@\S+\.\S+$/.test(email))return toast('Format email tidak sah.',true);
      const session=(await sb.auth.getSession()).data.session;if(!session)return toast('Sesi admin tamat. Login semula.',true);
      const btn=$('#acuSave');btn.disabled=true;btn.textContent='Mencipta...';
      try{const r=await fetch(AUTH_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+session.access_token},body:JSON.stringify({action:'admin_create_user',username,password,display_name:display_name||username,email,plan:$('#acuPlan').value,subscription_status:$('#acuSub').value,subscription_expires_at:$('#acuExpiry').value?new Date($('#acuExpiry').value+'T23:59:59').toISOString():null})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Gagal mencipta user.');closeModal();toast('User berjaya dicipta.');renderAdmin();}catch(e){toast(e.message||'Gagal mencipta user.',true);btn.disabled=false;btn.textContent='Cipta User'}
    };
  };

  async function confirmDeleteUser(id,tr){
    const name=tr.querySelector('td')?.innerText?.split('\n')[0]||'user';
    modal(`<h2>Delete User?</h2><div class="danger-box"><b>${escapeHtml(name)}</b><p>Tindakan ini memadam akaun login pengguna. Gunakan untuk akaun yang benar-benar tidak aktif atau tidak lagi diperlukan.</p></div><label>Taip <b>DELETE</b> untuk sahkan<input id="delConfirm" autocomplete="off"></label><div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn danger" id="delUserNow">Delete User</button></div>`);
    $('#delUserNow').onclick=async()=>{if($('#delConfirm').value!=='DELETE')return toast('Taip DELETE untuk sahkan.',true);const session=(await sb.auth.getSession()).data.session;if(!session)return toast('Sesi admin tamat.',true);const b=$('#delUserNow');b.disabled=true;b.textContent='Deleting...';try{const r=await fetch(AUTH_URL,{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPABASE_KEY,'Authorization':'Bearer '+session.access_token},body:JSON.stringify({action:'admin_delete_user',user_id:id,username:'admin'})});const j=await r.json();if(!r.ok)throw new Error(j.error||'Gagal delete user.');closeModal();toast('User berjaya dipadam.');renderAdmin();}catch(e){toast(e.message||'Gagal delete user.',true);b.disabled=false;b.textContent='Delete User'}};
  }
  const css=document.createElement('style');css.textContent=`.btn.danger{background:#b42318;color:#fff;border-color:#b42318}.danger-box{background:#fff1f0;border:1px solid #f2b8b5;border-radius:10px;padding:12px;margin:10px 0}.danger-box p{margin:5px 0 0;font-size:12px}`;document.head.appendChild(css);
})();