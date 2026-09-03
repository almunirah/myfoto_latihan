// Fix thesis section order for existing/new projects + force compact deadline controls
(function(){
  const ORDER=[
    'Abstract',
    'Acknowledgement',
    'Chapter 1: Introduction',
    'Chapter 2: Literature Review',
    'Chapter 3: Methodology',
    'Chapter 4: Results / Findings',
    'Chapter 5: Discussion',
    'Chapter 6: Conclusion & Recommendations',
    'References',
    'Appendices'
  ];

  if(templates?.thesis){templates.thesis.sections=[...ORDER]}

  function normalizeThesis(p){
    if(!p||p.project_type!=='thesis')return;
    const old=p.content||{};
    const next={};
    ORDER.forEach(k=>{next[k]=old[k]??''});
    Object.keys(old).forEach(k=>{if(!(k in next))next[k]=old[k]});
    p.content=next;
    if(Array.isArray(p.outline)){
      const map=new Map(p.outline.map(x=>[x.title,x]));
      p.outline=ORDER.map((title,i)=>map.get(title)||{id:crypto.randomUUID(),title,notes:'',order:i});
    }
  }

  const oldRender=renderProject;
  renderProject=function(tab){
    normalizeThesis(state.current);
    oldRender(tab);
    if(state.current?.project_type==='thesis'){
      if(tab==='writing'){
        const list=document.querySelector('.section-list');
        if(list){
          const buttons=[...list.querySelectorAll('button[data-section]')];
          ORDER.forEach(name=>{const b=buttons.find(x=>x.dataset.section===name);if(b)list.appendChild(b)});
        }
      }
    }
  };

  const css=document.createElement('style');
  css.textContent=`
    .thesis-planner .thesis-deadline-row{
      grid-template-columns:minmax(230px,1fr) 112px 128px 104px!important;
      column-gap:7px!important;
      row-gap:4px!important;
      padding:7px 0!important;
      min-width:620px!important;
    }
    .thesis-planner .thesis-deadline-row label{
      grid-template-rows:13px 32px!important;
      gap:2px!important;
      font-size:10px!important;
    }
    .thesis-planner .thesis-deadline-row input,
    .thesis-planner .thesis-deadline-row select{
      height:32px!important;
      min-height:32px!important;
      padding:4px 7px!important;
      font-size:11px!important;
      border-radius:7px!important;
    }
    .thesis-planner .thesis-sec{min-height:32px!important}
    .thesis-planner .thesis-sec span{width:22px!important;height:22px!important;font-size:10px!important}
    .thesis-planner .thesis-sec b{font-size:12px!important}

    .thesis-planner .grid2{
      grid-template-columns:320px 320px!important;
      gap:18px!important;
    }
    .thesis-planner .grid2 label{max-width:230px!important;margin-bottom:8px!important;font-size:11px!important}
    .thesis-planner .grid2 input,
    .thesis-planner .grid2 select{
      width:230px!important;
      max-width:230px!important;
      height:34px!important;
      min-height:34px!important;
      padding:5px 8px!important;
      font-size:11px!important;
      border-radius:7px!important;
    }
    @media(max-width:760px){
      .thesis-planner .thesis-deadline-row{
        grid-template-columns:minmax(210px,1fr) 108px 124px 100px!important;
        min-width:590px!important;
      }
      .thesis-planner .grid2{grid-template-columns:1fr!important}
      .thesis-planner .grid2 label{max-width:230px!important}
      .thesis-planner .grid2 input,.thesis-planner .grid2 select{width:230px!important;max-width:230px!important}
    }
  `;
  document.head.appendChild(css);
})();