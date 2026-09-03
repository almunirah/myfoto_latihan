// UI polish — compact fields, resizable/collapsible sidebar, colorful project tabs
(function(){
  function initSidebar(){
    const shell=document.querySelector('.app-shell');
    const sidebar=document.querySelector('.sidebar');
    if(!shell||!sidebar||document.querySelector('#sidebarToggle'))return;
    const toggle=document.createElement('button');toggle.id='sidebarToggle';toggle.className='sidebar-toggle';toggle.type='button';toggle.title='Hide / show sidebar';toggle.textContent='☰';
    sidebar.prepend(toggle);
    const handle=document.createElement('div');handle.id='sidebarResize';handle.className='sidebar-resize';sidebar.appendChild(handle);
    const saved=localStorage.getItem('naskhah_sidebar_width');if(saved)document.documentElement.style.setProperty('--sidebar-w',saved+'px');
    const collapsed=localStorage.getItem('naskhah_sidebar_collapsed')==='1';if(collapsed)shell.classList.add('sidebar-collapsed');
    toggle.onclick=()=>{shell.classList.toggle('sidebar-collapsed');localStorage.setItem('naskhah_sidebar_collapsed',shell.classList.contains('sidebar-collapsed')?'1':'0')};
    let startX=0,startW=0,drag=false;
    handle.addEventListener('pointerdown',e=>{drag=true;startX=e.clientX;startW=sidebar.getBoundingClientRect().width;handle.setPointerCapture(e.pointerId)});
    handle.addEventListener('pointermove',e=>{if(!drag)return;const w=Math.min(360,Math.max(180,startW+(e.clientX-startX)));document.documentElement.style.setProperty('--sidebar-w',w+'px');localStorage.setItem('naskhah_sidebar_width',String(Math.round(w)))});
    handle.addEventListener('pointerup',()=>drag=false);
  }
  function enhanceTabs(){
    const tabs=document.querySelector('.tabs');if(!tabs)return;
    [...tabs.querySelectorAll('button')].forEach((b,i)=>{b.dataset.tabColor=i%8;});
  }
  const oldRenderProject=renderProject;
  renderProject=function(tab){oldRenderProject(tab);setTimeout(()=>{enhanceTabs();initSidebar()},0)};
  const oldDash=renderDashboard;renderDashboard=function(){oldDash();setTimeout(initSidebar,0)};
  const oldProjects=renderProjects;renderProjects=function(){oldProjects();setTimeout(initSidebar,0)};
  const oldProfile=renderProfile;renderProfile=function(){oldProfile();setTimeout(initSidebar,0)};
  if(typeof renderAdmin==='function'){const oldAdmin=renderAdmin;renderAdmin=async function(){await oldAdmin();setTimeout(initSidebar,0)}}
  const css=document.createElement('style');css.textContent=`
  :root{--sidebar-w:250px}
  .app-shell{grid-template-columns:var(--sidebar-w) 1fr;transition:grid-template-columns .22s ease}
  .sidebar{width:var(--sidebar-w);transition:width .22s ease;padding-top:56px}
  .sidebar-toggle{position:absolute;top:14px;right:14px;width:34px!important;height:34px;border:1px solid rgba(255,255,255,.12)!important;background:#24243a!important;color:#fff!important;text-align:center!important;padding:0!important;border-radius:10px!important;z-index:3}
  .sidebar-resize{position:absolute;top:0;right:-4px;width:8px;height:100%;cursor:ew-resize;z-index:4}
  .sidebar-collapsed{grid-template-columns:76px 1fr}
  .sidebar-collapsed .sidebar{width:76px}
  .sidebar-collapsed .sidebar .brand span,.sidebar-collapsed .sidebar .nav-group,.sidebar-collapsed .sidebar button span{display:none}
  .sidebar-collapsed .sidebar button{display:grid;place-items:center;text-align:center;padding-left:0;padding-right:0}
  .sidebar-collapsed .sidebar-toggle{right:20px}
  .sidebar-collapsed .sidebar-resize{display:none}
  #coreAcademicWorkflow .grid2{align-items:start}
  #coreAcademicWorkflow label{max-width:430px}
  #coreAcademicWorkflow input,#coreAcademicWorkflow select,#coreAcademicWorkflow textarea{max-width:430px}
  #coreAcademicWorkflow textarea{min-height:88px}
  #coreAcademicWorkflow .section-deadline-row input,#coreAcademicWorkflow .section-deadline-row select{max-width:100%}
  .planner-editor .deadline-settings label{max-width:360px}.planner-editor .deadline-settings input,.planner-editor .deadline-settings select{max-width:360px}
  .tabs{gap:10px;border-bottom:0;padding:4px 0 12px;flex-wrap:wrap;overflow:visible}
  .tabs button{border:1px solid transparent!important;border-radius:12px!important;padding:11px 15px!important;background:#f3f4f8!important;box-shadow:0 4px 12px rgba(34,38,60,.04);transition:.18s ease;color:#374151!important}
  .tabs button:hover{transform:translateY(-2px);box-shadow:0 8px 18px rgba(34,38,60,.10)}
  .tabs button[data-tab-color="0"]{background:#efeaff!important;border-color:#ded4ff!important}.tabs button[data-tab-color="1"]{background:#e9f7ff!important;border-color:#cbeeff!important}.tabs button[data-tab-color="2"]{background:#ecfbf2!important;border-color:#ccf0dc!important}.tabs button[data-tab-color="3"]{background:#fff5e8!important;border-color:#ffe2b7!important}.tabs button[data-tab-color="4"]{background:#fff0f4!important;border-color:#ffd4df!important}.tabs button[data-tab-color="5"]{background:#eef4ff!important;border-color:#d8e5ff!important}.tabs button[data-tab-color="6"]{background:#f5efff!important;border-color:#e7d8ff!important}.tabs button[data-tab-color="7"]{background:#eefbf9!important;border-color:#d2f1ec!important}
  .tabs button.active{outline:2px solid #6d4aff!important;box-shadow:0 8px 20px rgba(109,74,255,.16)!important;font-weight:800!important}
  .project-card{border:1px solid var(--line);background:linear-gradient(180deg,#fff 0%,#fbfbff 100%);position:relative;overflow:hidden;transition:.18s ease}
  .project-card:before{content:'';position:absolute;left:0;top:0;bottom:0;width:5px;background:linear-gradient(180deg,#6d4aff,#8c6cff)}
  .project-card:hover{transform:translateY(-4px);box-shadow:0 16px 32px rgba(38,44,71,.12)}
  @media(max-width:900px){:root{--sidebar-w:220px}.sidebar-resize{display:none}#coreAcademicWorkflow label,#coreAcademicWorkflow input,#coreAcademicWorkflow select,#coreAcademicWorkflow textarea{max-width:100%}}
  @media(max-width:650px){.app-shell,.sidebar-collapsed{grid-template-columns:1fr}.sidebar{width:auto!important;padding-top:8px}.sidebar-toggle,.sidebar-resize{display:none}.tabs{flex-wrap:nowrap;overflow:auto}.tabs button{flex:0 0 auto}}
  `;document.head.appendChild(css);
  document.addEventListener('DOMContentLoaded',initSidebar);
})();