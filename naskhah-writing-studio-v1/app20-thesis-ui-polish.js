// Thesis Chapter Deadline UI polish
(function(){
  const css=document.createElement('style');
  css.textContent=`
    .thesis-planner .thesis-deadline-row{
      display:grid!important;
      grid-template-columns:minmax(300px,1.4fr) 160px 180px 150px!important;
      gap:14px!important;
      align-items:end!important;
      padding:14px 0!important;
    }
    .thesis-planner .thesis-deadline-row label{
      margin:0!important;
      display:flex!important;
      flex-direction:column!important;
      gap:6px!important;
      min-width:0!important;
    }
    .thesis-planner .thesis-deadline-row input,
    .thesis-planner .thesis-deadline-row select{
      width:100%!important;
      max-width:none!important;
      min-width:0!important;
      height:44px!important;
      padding:10px 12px!important;
      border-radius:10px!important;
      line-height:1.2!important;
    }
    .thesis-planner .thesis-sec{
      min-height:44px!important;
      align-items:center!important;
    }
    .thesis-planner .grid2 label{
      max-width:320px!important;
    }
    .thesis-planner .grid2 input,
    .thesis-planner .grid2 select{
      width:100%!important;
      max-width:320px!important;
      height:44px!important;
      padding:10px 12px!important;
      border-radius:10px!important;
    }
    @media(max-width:980px){
      .thesis-planner .thesis-deadline-row{
        grid-template-columns:minmax(250px,1.2fr) 150px 165px 140px!important;
        gap:10px!important;
      }
    }
    @media(max-width:760px){
      .thesis-planner .thesis-deadline-row{
        grid-template-columns:1fr!important;
      }
      .thesis-planner .thesis-deadline-row label{
        margin-left:38px!important;
      }
      .thesis-planner .thesis-deadline-row input,
      .thesis-planner .thesis-deadline-row select,
      .thesis-planner .grid2 input,
      .thesis-planner .grid2 select{
        width:100%!important;
        max-width:100%!important;
      }
    }
  `;
  document.head.appendChild(css);
})();