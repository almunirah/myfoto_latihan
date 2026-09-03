// V1.8 — Always-visible Article Reminder 1–30 Days
(function(){
  function options(days){const current=Math.min(30,Math.max(1,Number(days||7)));return Array.from({length:30},(_,i)=>{const d=i+1;return `<option value="${d}" ${d===current?'selected':''}>${d} hari sebelum due date</option>`}).join('')}
  function ensureReminderPanel(p){
    if(!p||p.project_type!=='article')return;
    const existing=document.querySelector('#articleReminderPanel');
    if(existing)return;
    const anchor=document.querySelector('.smart-deadline')||document.querySelector('.planner-editor')||document.querySelector('.tabs');
    if(!anchor)return;
    const plan=(typeof customPlan==='function'?customPlan(p):(p.deadline_plan||[]));
    const rows=plan.map((m,i)=>`<div class="reminder-row" data-ri="${i}"><div><b>${escapeHtml(m.title||('Fasa '+(i+1)))}</b><small>${m.date?fmtDate(m.date):'Tiada tarikh'}</small></div><select class="reminder-select">${options((m.reminder_days||[7])[0])}</select></div>`).join('');
    const html=`<div class="card" id="articleReminderPanel"><div class="card-head"><div><h2>Reminder Deadline</h2><p>Pilih bila anda mahu diingatkan untuk setiap fasa, dari 1 hingga 30 hari sebelum due date.</p></div></div>${rows||'<div class="empty">Tambah fasa deadline dahulu untuk menetapkan reminder.</div>'}<div class="actions"><button class="btn primary" id="saveArticleReminders">Simpan Reminder</button></div></div>`;
    anchor.insertAdjacentHTML('afterend',html);
    const save=document.querySelector('#saveArticleReminders');
    if(save)save.onclick=async()=>{
      const currentPlan=(typeof customPlan==='function'?customPlan(p):(p.deadline_plan||[]));
      document.querySelectorAll('#articleReminderPanel .reminder-row').forEach(r=>{const i=Number(r.dataset.ri);if(currentPlan[i])currentPlan[i].reminder_days=[Number(r.querySelector('.reminder-select').value)]});
      p.deadline_plan=currentPlan;
      p.reminder_offsets=[...new Set(currentPlan.flatMap(x=>x.reminder_days||[]))];
      await saveProject();
      toast('Reminder 1–30 hari disimpan.');
    };
  }
  const oldRender=renderProject;
  renderProject=function(tab){oldRender(tab);if(tab==='overview')setTimeout(()=>ensureReminderPanel(state.current),0)};
  const css=document.createElement('style');
  css.textContent=`#articleReminderPanel{margin-top:18px}.reminder-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}.reminder-row b,.reminder-row small{display:block}.reminder-row small{color:var(--muted);margin-top:4px}.reminder-row select{width:min(260px,45%)}@media(max-width:650px){.reminder-row{align-items:flex-start;flex-direction:column}.reminder-row select{width:100%}}`;
  document.head.appendChild(css);
})();