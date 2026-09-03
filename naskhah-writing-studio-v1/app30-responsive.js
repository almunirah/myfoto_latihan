// Responsive layout for desktop, tablet, Android and mobile
(function(){
  function ensureMobileNav(){
    const app=document.querySelector('#app'),sidebar=document.querySelector('.sidebar');
    if(!app||!sidebar||document.querySelector('#mobileNavToggle'))return;
    const btn=document.createElement('button');btn.id='mobileNavToggle';btn.className='mobile-nav-toggle';btn.type='button';btn.innerHTML='☰';btn.setAttribute('aria-label','Open navigation');document.body.appendChild(btn);
    const shade=document.createElement('div');shade.id='mobileNavShade';shade.className='mobile-nav-shade';document.body.appendChild(shade);
    const close=()=>{app.classList.remove('mobile-nav-open');document.body.classList.remove('nav-lock')};
    btn.onclick=()=>{app.classList.toggle('mobile-nav-open');document.body.classList.toggle('nav-lock',app.classList.contains('mobile-nav-open'))};shade.onclick=close;
    sidebar.addEventListener('click',e=>{if(window.innerWidth<=820&&e.target.closest('button[data-nav],#logout'))close()});
  }
  function patchTables(){document.querySelectorAll('table').forEach(t=>{const p=t.parentElement;if(p&&!p.classList.contains('responsive-table-wrap'))p.classList.add('responsive-table-wrap')})}
  function patchModals(){const m=document.querySelector('#modalContent');if(m)m.classList.add('responsive-modal')}
  const obs=new MutationObserver(()=>{ensureMobileNav();patchTables();patchModals()});obs.observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('DOMContentLoaded',()=>{ensureMobileNav();patchTables();patchModals()});
  const css=document.createElement('style');css.textContent=`
  html,body{max-width:100%;overflow-x:hidden}
  img,svg,video,canvas{max-width:100%;height:auto}
  .main{min-width:0}
  .page-head{gap:14px;flex-wrap:wrap}
  .page-head>div{min-width:0}.page-head h1{overflow-wrap:anywhere}
  .grid2,.stats,.project-grid{min-width:0}
  .card{min-width:0;overflow:hidden}
  .responsive-table-wrap,.table-wrap{width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}
  .responsive-table-wrap table,.table-wrap table{min-width:720px}
  .tabs{overflow-x:auto;white-space:nowrap;-webkit-overflow-scrolling:touch;scrollbar-width:thin}
  .tabs button{flex:0 0 auto}
  .mobile-nav-toggle,.mobile-nav-shade{display:none}
  .auth-card{width:min(100%,520px)}
  .public-shell{min-height:100dvh}
  .responsive-modal{max-height:min(88dvh,820px);overflow:auto}

  @media (min-width:821px) and (max-width:1180px){
    .main{padding:24px 22px!important}
    .stats{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    .grid2{grid-template-columns:1fr 1fr!important}
    .project-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}
    .writer-layout{grid-template-columns:190px minmax(0,1fr)!important}
    .writer-stats{grid-column:1/-1;display:grid!important;grid-template-columns:repeat(3,1fr);gap:10px}
    .thesis-planner{overflow-x:auto}
  }

  @media (max-width:820px){
    .app-shell{display:block!important}
    .sidebar{position:fixed!important;left:0;top:0;bottom:0;width:260px!important;z-index:1002;transform:translateX(-105%);transition:transform .22s ease;box-shadow:8px 0 30px rgba(0,0,0,.18)}
    .mobile-nav-open .sidebar{transform:translateX(0)}
    .mobile-nav-toggle{display:grid;place-items:center;position:fixed;left:12px;top:12px;z-index:1003;width:42px;height:42px;border:0;border-radius:12px;background:#0c2748;color:white;font-size:21px;box-shadow:0 6px 18px rgba(0,0,0,.18)}
    .mobile-nav-shade{position:fixed;inset:0;background:rgba(12,22,38,.4);z-index:1001}
    .mobile-nav-open~.mobile-nav-shade,.mobile-nav-open + .mobile-nav-shade{display:block}
    body.nav-lock{overflow:hidden}
    .main{padding:66px 16px 24px!important;width:100%!important;margin:0!important}
    .page-head{align-items:flex-start!important}.page-head .btn{width:auto}
    .stats{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important}
    .grid2{grid-template-columns:1fr!important}
    .project-grid{grid-template-columns:1fr!important}
    .card{padding:16px!important}
    .tabs{margin-left:-4px;margin-right:-4px;padding-bottom:4px}
    .tabs button{padding:9px 11px!important;font-size:12px!important}
    .writer-layout{display:block!important}
    .section-list{display:flex!important;gap:8px!important;overflow-x:auto;padding-bottom:8px;margin-bottom:10px;position:static!important;max-height:none!important}
    .section-list button{min-width:150px!important;flex:0 0 150px!important}
    .editor-card{min-height:58dvh!important;height:auto!important}
    .rich-editor,#editor{min-height:52dvh!important;font-size:16px!important}
    .writer-stats{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}
    .writer-stats .metric{min-width:0}
    .format-toolbar{overflow-x:auto!important;flex-wrap:nowrap!important;-webkit-overflow-scrolling:touch;padding-bottom:5px}
    .format-toolbar>*{flex:0 0 auto}
    .writer-save-actions{width:100%!important}.writer-save-actions .btn{min-height:40px}
    .thesis-planner{overflow-x:auto!important}.thesis-planner .thesis-deadline-row{min-width:580px!important}
    .profile-grid{grid-template-columns:1fr!important}
    .public-shell{display:block!important;padding:24px 16px!important}
    .hero{text-align:center;padding:20px 8px 8px!important}.hero .brand{justify-content:center}
    .hero h1{font-size:clamp(30px,9vw,46px)!important;line-height:1.08}.hero p{font-size:15px!important}
    .auth-wrap{width:100%!important}.auth-card{margin:18px auto 0!important;padding:22px!important}
    .modal{padding:12px!important;align-items:flex-end!important}.modal-box,.responsive-modal{width:100%!important;max-width:100%!important;border-radius:18px 18px 0 0!important;max-height:88dvh!important}
    input,select,textarea,button{font-size:16px}
  }

  @media (max-width:480px){
    .main{padding-left:12px!important;padding-right:12px!important}
    .stats{grid-template-columns:1fr 1fr!important}.stat{padding:14px!important}.stat b{font-size:24px!important}
    .page-head h1{font-size:28px!important}
    .page-head>.btn,.page-head>button{width:100%!important}
    .writer-stats{grid-template-columns:1fr!important}
    .section-list button{min-width:132px!important;flex-basis:132px!important}
    .editor-head{gap:8px!important}.editor-head>div{min-width:0}
    .writing-focus-btn{margin-left:0!important}
    .writer-save-actions{display:grid!important;grid-template-columns:1fr 1fr!important}.writer-save-actions .primary{grid-column:1/-1}
    .auth-card{padding:18px!important}.brand span{font-size:18px!important}
    .profile-info-row{gap:4px!important}
  }

  @media (min-width:1400px){
    .main{max-width:1500px;margin:0 auto;padding-left:36px!important;padding-right:36px!important}
    .project-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
  }
  `;document.head.appendChild(css);
})();