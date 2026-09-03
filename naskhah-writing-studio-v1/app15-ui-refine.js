// UI refinement — keep original tab style with color accents; compact due/reminder fields
(function(){
  function refineTabs(){
    const tabs=document.querySelector('.tabs'); if(!tabs) return;
    [...tabs.querySelectorAll('button')].forEach((b,i)=>b.dataset.tabColor=i%8);
  }
  const wrappers=['renderProject','renderDashboard','renderProjects','renderProfile'];
  if(typeof renderProject==='function'){const old=renderProject;renderProject=function(tab){old(tab);setTimeout(refineTabs,0)}}
  if(typeof renderDashboard==='function'){const old=renderDashboard;renderDashboard=function(){old();setTimeout(refineTabs,0)}}
  const css=document.createElement('style');
  css.textContent=`
    /* restore original tab geometry; use color only */
    .tabs{display:flex;gap:4px;overflow:auto;border-bottom:1px solid var(--line);margin-bottom:20px;padding:0;flex-wrap:nowrap}
    .tabs button{border:0!important;background:none!important;padding:11px 13px!important;white-space:nowrap!important;cursor:pointer;color:var(--muted)!important;font-weight:700!important;border-radius:0!important;box-shadow:none!important;transform:none!important;transition:color .15s ease,background .15s ease,border-color .15s ease}
    .tabs button:hover{transform:none!important;box-shadow:none!important}
    .tabs button[data-tab-color="0"]{color:#6d4aff!important}.tabs button[data-tab-color="1"]{color:#1686b8!important}.tabs button[data-tab-color="2"]{color:#2a8b57!important}.tabs button[data-tab-color="3"]{color:#b9751f!important}.tabs button[data-tab-color="4"]{color:#b34768!important}.tabs button[data-tab-color="5"]{color:#426db7!important}.tabs button[data-tab-color="6"]{color:#7c4db8!important}.tabs button[data-tab-color="7"]{color:#27867b!important}
    .tabs button.active{background:none!important;outline:0!important;box-shadow:none!important;font-weight:800!important;border-bottom:3px solid currentColor!important}

    /* compact deadline fields */
    #coreAcademicWorkflow .section-deadline-row{grid-template-columns:minmax(220px,1fr) 142px 158px 135px!important;column-gap:10px!important}
    #coreAcademicWorkflow .section-deadline-row .sd-date{width:142px!important;max-width:142px!important}
    #coreAcademicWorkflow .section-deadline-row .sd-rem{width:158px!important;max-width:158px!important}
    #coreAcademicWorkflow .section-deadline-row .sd-target{width:135px!important;max-width:135px!important}
    .planner-editor .dp-date{width:142px!important;max-width:142px!important}
    .planner-editor .dp-reminder{width:158px!important;max-width:158px!important}
    .planner-editor .phase-fields{grid-template-columns:142px 90px 158px auto!important;align-items:end!important}
    #coreSupDate,#coreFeedback,#coreJournalDate{width:170px!important;max-width:170px!important}
    #coreSupRem,#coreJournalRem{width:170px!important;max-width:170px!important}
    @media(max-width:760px){
      #coreAcademicWorkflow .section-deadline-row{grid-template-columns:1fr!important}
      #coreAcademicWorkflow .section-deadline-row .sd-date,#coreAcademicWorkflow .section-deadline-row .sd-rem,#coreAcademicWorkflow .section-deadline-row .sd-target,.planner-editor .dp-date,.planner-editor .dp-reminder,#coreSupDate,#coreFeedback,#coreJournalDate,#coreSupRem,#coreJournalRem{width:100%!important;max-width:100%!important}
      .planner-editor .phase-fields{grid-template-columns:1fr!important}
    }
  `;
  document.head.appendChild(css);
  document.addEventListener('DOMContentLoaded',refineTabs);
})();