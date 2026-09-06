/* Naskhah Studio — Phase 3 F1
 * Project shell orchestration ownership.
 * Loaded after core cutover and before dashboard/projects modules.
 */
(() => {
  'use strict';

  const tabDefs = [
    ['overview','Overview'],
    ['writing','Zon Menulis'],
    ['outline','Pengurus Rangka'],
    ['checklist','Senarai Semak'],
    ['notes','Research Notes'],
    ['references','References'],
    ['versions','Versions'],
    ['export','Export']
  ];

  projectWords = (p) => Object.values(p?.content||{}).reduce((n,v)=>n+countWords(v),0);

  projectPct = (p) => Math.min(100,Math.round(projectWords(p)/Math.max(1,Number(p.target_words||1))*100));

  tabs = (active) => `<div class="tabs">${tabDefs.map(([k,l])=>`<button data-tab="${k}" class="${active===k?'active':''}">${l}</button>`).join('')}</div>`;

  renderProject = (tab) => {
    state.currentTab = tab;
    nav('projects');
    const p = state.current;
    const w = projectWords(p);
    const pct = projectPct(p);
    const body = tab==='overview' ? overviewView(p)
      : tab==='writing' ? writingView(p)
      : tab==='outline' ? outlineView(p)
      : tab==='checklist' ? checklistView(p)
      : tab==='notes' ? notesView(p)
      : tab==='references' ? referencesView(p)
      : tab==='versions' ? versionsView(p)
      : exportView(p);

    $('#main').innerHTML = `<div class="page-head"><div><button class="link" id="backProjects">← Semua Projek</button><h1>${esc(p.title)}</h1><p>${esc(templates[p.project_type]?.label)} · ${w.toLocaleString()} / ${Number(p.target_words||0).toLocaleString()} perkataan</p></div><span class="type-pill">${pct}%</span></div>${tabs(tab)}${body}`;
    $('#backProjects').onclick = renderProjects;
    $$('[data-tab]').forEach(x=>x.onclick=()=>renderProject(x.dataset.tab));
    bindTab(tab);
  };

  Object.defineProperty(window, 'NaskhahProjectShellModule', {
    value: Object.freeze({ version: '3.0.0-f1' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
