// Remove AI Writing Assistant while preserving SaaS admin/privacy features
(function(){
  const cleanTabs=()=>`<div class="tabs">${[['overview','Overview'],['writing','Zon Menulis'],['outline','Pengurus Rangka'],['checklist','Senarai Semak'],['notes','Research Notes'],['references','References'],['versions','Versions'],['export','Export']].map(([k,l])=>`<button data-ptab="${k}" class="${state.current&&state.current._activeTab===k?'active':''}">${l}</button>`).join('')}</div>`;
  const prevTabs=projectTabs;
  projectTabs=function(active){state.current&& (state.current._activeTab=active);return cleanTabs().replace(`data-ptab="${active}" class=""`,`data-ptab="${active}" class="active"`)};
  const prevRender=renderProject;
  renderProject=function(tab){if(tab==='ai')tab='overview';return prevRender(tab)};
  const prevAdmin=renderAdmin;
  renderAdmin=async function(){await prevAdmin();const card=[...document.querySelectorAll('#main .card')].find(c=>/AI & System/i.test(c.querySelector('h2')?.textContent||''));if(card){const h=card.querySelector('h2');if(h)h.textContent='System & Privacy';[...card.querySelectorAll('.admin-setting')].forEach(x=>{if(/AI Writing Assistant/i.test(x.textContent||''))x.remove()})}}
})();