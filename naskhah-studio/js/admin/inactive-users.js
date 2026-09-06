/* Naskhah Studio admin module: inactive-user cleanup */
(()=>{
 const oldRenderAdmin=window.renderAdmin||renderAdmin;
 window.renderAdmin=async function(){
   await oldRenderAdmin();
   if(state.profile?.role!=='admin')return;
   const head=$('#main .page-head');
   if(head&&!$('#manageInactiveUsers')){
     const b=document.createElement('button');
     b.id='manageInactiveUsers';
     b.className='btn danger';
     b.textContent='Buang User Tidak Aktif';
     head.appendChild(b);
     b.onclick=async()=>{
       const {data,error}=await sb.from('nv1_profiles').select('id,username,display_name,email,role,status,last_seen_at,created_at').neq('role','admin').order('last_seen_at',{ascending:true,nullsFirst:true});
       if(error)return toast(error.message,true);
       const inactive=(data||[]).filter(u=>u.status!=='active'||!u.last_seen_at||Date.now()-new Date(u.last_seen_at).getTime()>90*86400000);
       modal(`<h2>User Tidak Aktif</h2><p class="muted">Senarai ini termasuk akaun suspended/inactive atau tiada aktiviti melebihi 90 hari. Admin perlu sahkan setiap deletion.</p>${inactive.length?inactive.map(u=>`<div class="version-row"><div><b>${esc(u.display_name||u.username)}</b><div class="muted">@${esc(u.username)} · ${esc(u.email||'—')} · ${u.last_seen_at?'Last active '+new Date(u.last_seen_at).toLocaleDateString('ms-MY'):'Tiada rekod login'}</div></div><button class="btn small danger" data-purge-user="${u.id}">Delete</button></div>`).join(''):'<p>Tiada user tidak aktif.</p>'}<div class="actions"><button class="btn" onclick="closeModal()">Tutup</button></div>`);
       $$('[data-purge-user]').forEach(x=>x.onclick=async()=>{
         const u=inactive.find(y=>y.id===x.dataset.purgeUser);
         if(!confirm('Delete user '+(u?.username||'')+' secara kekal?'))return;
         try{
           await authCall({action:'admin_delete_user',user_id:x.dataset.purgeUser},true);
           toast('User dipadam.');
           closeModal();
           renderAdmin();
         }catch(e){toast(e.message,true)}
       });
     };
   }
 };
})();