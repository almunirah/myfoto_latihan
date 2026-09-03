// V1.9 — Per-section Article Deadlines + Reminder 1–30 Days
(function(){
  const SECTION_ORDER=['Abstract','Keywords','Introduction','Literature Review','Methodology','Results and Discussion','Conclusion','Acknowledgement','References'];
  function ensureSectionDeadlines(p){
    p.goals=p.goals||{};
    const store=p.goals.section_deadlines||{};
    SECTION_ORDER.forEach(name=>{
      const old=store[name]||{};
      store[name]={due_date:old.due_date||'',reminder_days:Math.min(30,Math.max(1,Number(old.reminder_days||7)))};
    });
    p.goals.section_deadlines=store;
    return store;
  }
  function reminderOpts(current){
    return Array.from({length:30},(_,i)=>{const d=i+1;return `<option value="${d}" ${d===Number(current)?'selected':''}>${d} hari sebelum</option>`}).join('');
  }
  function daysLeft(date){if(!date)return null;const t=new Date();t.setHours(0,0,0,0);const d=new Date(date+'T00:00:00');return Math.ceil((d-t)/86400000)}
  function statusText(date){const n=daysLeft(date);if(n===null)return'Tiada due date';if(n<0)return`${Math.abs(n)} hari lewat`;if(n===0)return'Due hari ini';return`${n} hari lagi`}
  function sectionDeadlinePanel(p){
    const data=ensureSectionDeadlines(p);
    const rows=SECTION_ORDER.map((name,i)=>{const x=data[name];return `<div class="section-deadline-row" data-section="${escapeHtml(name)}"><div class="section-deadline-name"><span>${i+1}</span><div><b>${escapeHtml(name)}</b><small>${statusText(x.due_date)}</small></div></div><label>Due Date<input class="section-due" type="date" value="${escapeHtml(x.due_date||'')}"></label><label>Reminder<select class="section-reminder">${reminderOpts(x.reminder_days)}</select></label></div>`}).join('');
    return `<div class="card" id="sectionDeadlinePlanner"><div class="card-head"><div><h2>Deadline Setiap Bahagian Penulisan</h2><p>Tetapkan due date dan reminder khusus untuk setiap bahagian artikel. Reminder boleh dipilih 1 hingga 30 hari sebelum due date bahagian tersebut.</p></div></div>${rows}<div class="actions"><button class="btn primary" id="saveSectionDeadlines">Simpan Deadline & Reminder</button></div></div>`;
  }
  function mount(p){
    if(!p||p.project_type!=='article'||document.querySelector('#sectionDeadlinePlanner'))return;
    const old=document.querySelector('#articleReminderPanel');if(old)old.remove();
    const anchor=document.querySelector('.planner-editor')||document.querySelector('.smart-deadline')||document.querySelector('.tabs');
    if(!anchor)return;
    anchor.insertAdjacentHTML('afterend',sectionDeadlinePanel(p));
    document.querySelector('#saveSectionDeadlines').onclick=async()=>{
      const store=ensureSectionDeadlines(p);
      document.querySelectorAll('#sectionDeadlinePlanner .section-deadline-row').forEach(row=>{
        const name=row.dataset.section;
        store[name]={due_date:row.querySelector('.section-due').value,reminder_days:Number(row.querySelector('.section-reminder').value)};
      });
      p.goals.section_deadlines=store;
      await saveProject();
      toast('Deadline dan reminder setiap bahagian disimpan.');
      renderProject('overview');
    };
  }
  const prevRender=renderProject;
  renderProject=function(tab){prevRender(tab);if(tab==='overview')setTimeout(()=>mount(state.current),0)};
  const prevWriting=writingView;
  writingView=function(p){
    const html=prevWriting(p);if(!p||p.project_type!=='article')return html;
    const d=ensureSectionDeadlines(p);
    return html.replace(/<button class="([^"]*)" data-section="([^"]+)">([^<]+)<small>([^<]+)<\/small><\/button>/g,(m,cls,name,label,count)=>{
      const x=d[name];if(!x)return m;const meta=x.due_date?`${statusText(x.due_date)} · remind ${x.reminder_days} hari`:'Tiada due date';return `<button class="${cls}" data-section="${name}">${label}<small>${count}</small><small class="section-deadline-mini">${escapeHtml(meta)}</small></button>`;
    });
  };
  const css=document.createElement('style');
  css.textContent=`#sectionDeadlinePlanner{margin-top:18px}.section-deadline-row{display:grid;grid-template-columns:minmax(220px,1fr) 180px 190px;gap:14px;align-items:end;padding:14px 0;border-bottom:1px solid var(--line)}.section-deadline-row label{margin:0}.section-deadline-name{display:flex;align-items:center;gap:12px}.section-deadline-name>span{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#eee9ff;color:#5d3ed6;font-weight:800}.section-deadline-name b,.section-deadline-name small{display:block}.section-deadline-name small,.section-deadline-mini{color:var(--muted);font-size:11px;margin-top:4px}.section-list .section-deadline-mini{white-space:normal;line-height:1.3}@media(max-width:760px){.section-deadline-row{grid-template-columns:1fr}.section-deadline-row label{margin-left:42px}}`;
  document.head.appendChild(css);
})();