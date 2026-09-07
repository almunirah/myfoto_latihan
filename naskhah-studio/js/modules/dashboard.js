/* Naskhah Studio — Phase 3 Batch B1
 * Dashboard and project-list runtime ownership.
 * Loaded after core cutover and before Phase 2 feature modules.
 */
(() => {
  'use strict';

  projectCard = (p) => {
    const w = projectWords(p), pct = projectPct(p);
    return `<button class="project-card" data-open="${p.id}"><span class="type-pill">${esc(templates[p.project_type]?.label||p.project_type)}</span><h3>${esc(p.title)}</h3><div class="progress"><i style="width:${pct}%"></i></div><div class="muted">${w.toLocaleString()} / ${Number(p.target_words||0).toLocaleString()} perkataan · ${pct}%</div>${p.deadline?`<div class="muted" style="margin-top:8px">Deadline: ${esc(p.deadline)}</div>`:''}</button>`;
  };

  reminderCentre = () => {
    const now = new Date(), rows = [];
    state.projects.forEach((p) => {
      if (p.deadline) {
        const d = new Date(p.deadline+'T23:59:59'), days = Math.ceil((d-now)/86400000);
        if (days >= 0 && days <= 30) rows.push({title:p.title,label:'Project deadline',days,date:p.deadline});
      }
      const sd = p.goals?.section_deadlines || {};
      Object.entries(sd).forEach(([s,v]) => {
        if (v?.due_date) {
          const d = new Date(v.due_date+'T23:59:59'), days = Math.ceil((d-now)/86400000);
          if (days >= 0 && days <= Number(v.reminder_days||7)) rows.push({title:p.title,label:s,days,date:v.due_date});
        }
      });
    });
    if (!rows.length) return '';
    rows.sort((a,b) => a.days-b.days);
    return `<div class="card"><div class="card-head"><h2>Reminder Deadline</h2><span class="type-pill">${rows.length} upcoming</span></div>${rows.slice(0,8).map(r=>`<div class="health"><span><b>${esc(r.title)}</b><br><small class="muted">${esc(r.label)}</small></span><b>${r.days===0?'Hari ini':r.days+' hari'}</b><em>${esc(r.date)}</em></div>`).join('')}</div>`;
  };

  renderDashboard = () => {
    nav('dashboard');
    state.current = null;
    const words = state.projects.reduce((n,p)=>n+projectWords(p),0);
    const active = state.projects.filter(p=>p.status!=='complete').length;
    const done = state.projects.length-active;
    $('#main').innerHTML = `<div class="page-head"><div><h1>Dashboard</h1><p>Selamat datang, ${esc(state.profile?.display_name||state.profile?.username||'Penulis')}.</p></div><button class="btn primary" id="newProject">+ Projek Baharu</button></div><div class="stats"><div class="stat"><b>${state.projects.length}</b><span>Jumlah Projek</span></div><div class="stat words"><b>${words.toLocaleString()}</b><span>Jumlah Perkataan</span></div><div class="stat progress-card"><b>${done}</b><span>Projek Selesai</span></div><div class="stat sections"><b>${active}</b><span>Projek Aktif</span></div></div>${reminderCentre()}<div class="card"><div class="card-head"><h2>Projek Terkini</h2></div><div class="project-grid">${state.projects.length?state.projects.map(projectCard).join(''):'<div class="muted">Belum ada projek.</div>'}</div></div>`;
    $('#newProject').onclick = openCreate;
    $$('[data-open]').forEach(x=>x.onclick=()=>openProject(x.dataset.open));
  };

  const projectTypes = ['article','thesis','book','ebook'];

  const projectTypeFolder = (type) => `<button class="project-card" data-project-type="${type}" style="min-height:160px;display:flex;align-items:center;justify-content:center;text-align:center"><h3 style="margin:0">${esc(templates[type].label)}</h3></button>`;

  const projectTitleItem = (p, index) => `<button data-open="${p.id}" style="width:100%;display:grid;grid-template-columns:42px 1fr;align-items:center;gap:14px;text-align:left;padding:16px 18px;border:0;border-bottom:1px solid #e7e7ee;background:#fff;cursor:pointer"><span class="muted" style="font-weight:700">${index+1}.</span><span style="font-weight:700;color:#111827">${esc(p.title)}</span></button>`;

  renderProjects = (type = null) => {
    nav('projects');

    if (!type || !templates[type]) {
      $('#main').innerHTML = `<div class="page-head"><div><h1>My Projects</h1></div><button class="btn primary" id="newProject">+ Projek Baharu</button></div><div class="project-grid">${projectTypes.map(projectTypeFolder).join('')}</div>`;
      $('#newProject').onclick = openCreate;
      $$('[data-project-type]').forEach(x=>x.onclick=()=>renderProjects(x.dataset.projectType));
      return;
    }

    const projects = state.projects
      .filter(p=>p.project_type===type)
      .sort((a,b)=>String(a.title||'').localeCompare(String(b.title||''),'ms',{sensitivity:'base',numeric:true}));

    $('#main').innerHTML = `<div class="page-head"><div><button class="btn" id="backProjectTypes">← Kembali</button><h1 style="margin-top:16px">${esc(templates[type].label)}</h1></div><button class="btn primary" id="newProject">+ Projek Baharu</button></div><div class="card" style="padding:0;overflow:hidden">${projects.length?projects.map(projectTitleItem).join(''):'<div class="muted" style="padding:20px">Belum ada projek.</div>'}</div>`;
    $('#backProjectTypes').onclick = ()=>renderProjects();
    $('#newProject').onclick = openCreate;
    $$('[data-open]').forEach(x=>x.onclick=()=>openProject(x.dataset.open));
  };

  Object.defineProperty(window, 'NaskhahDashboardModule', {
    value: Object.freeze({ version: '3.0.0-b1' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
