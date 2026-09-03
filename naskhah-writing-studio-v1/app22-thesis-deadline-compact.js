// Compact Thesis Chapter Deadlines UI
(function(){
  const css=document.createElement('style');
  css.textContent=`
    .thesis-planner{overflow-x:auto}
    .thesis-planner .thesis-deadline-row{
      display:grid!important;
      grid-template-columns:minmax(240px,1fr) 128px 145px 120px!important;
      gap:8px!important;
      align-items:center!important;
      padding:9px 0!important;
      min-width:720px!important;
    }
    .thesis-planner .thesis-sec{
      min-height:38px!important;
      gap:8px!important;
    }
    .thesis-planner .thesis-sec span{
      width:24px!important;height:24px!important;font-size:11px!important;
    }
    .thesis-planner .thesis-sec b{
      font-size:13px!important;line-height:1.25!important;
    }
    .thesis-planner .thesis-deadline-row label{
      display:grid!important;
      grid-template-rows:15px 36px!important;
      gap:3px!important;
      margin:0!important;
      font-size:11px!important;
      color:var(--muted)!important;
      min-width:0!important;
    }
    .thesis-planner .thesis-deadline-row input,
    .thesis-planner .thesis-deadline-row select{
      width:100%!important;
      max-width:100%!important;
      height:36px!important;
      min-height:36px!important;
      padding:6px 9px!important;
      font-size:12px!important;
      border-radius:8px!important;
      box-sizing:border-box!important;
    }
    .thesis-planner .grid2{
      grid-template-columns:repeat(2,minmax(280px,360px))!important;
      gap:22px!important;
      justify-content:start!important;
    }
    .thesis-planner .grid2>div{min-width:0!important}
    .thesis-planner .grid2 label{
      max-width:280px!important;
      font-size:12px!important;
      margin-bottom:10px!important;
    }
    .thesis-planner .grid2 input,
    .thesis-planner .grid2 select{
      width:100%!important;
      max-width:280px!important;
      height:38px!important;
      min-height:38px!important;
      padding:7px 10px!important;
      font-size:12px!important;
      border-radius:8px!important;
      box-sizing:border-box!important;
    }
    @media(max-width:760px){
      .thesis-planner{overflow-x:auto!important}
      .thesis-planner .thesis-deadline-row{
        grid-template-columns:minmax(220px,1fr) 125px 140px 115px!important;
        min-width:660px!important;
      }
      .thesis-planner .thesis-deadline-row label{margin-left:0!important}
      .thesis-planner .grid2{grid-template-columns:1fr!important}
      .thesis-planner .grid2 label,
      .thesis-planner .grid2 input,
      .thesis-planner .grid2 select{max-width:100%!important}
    }
  `;
  document.head.appendChild(css);
})();