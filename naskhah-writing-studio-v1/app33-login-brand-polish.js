// Login branding polish: simple User/Admin access + larger logo/brand/tagline
(function(){
  function polish(){
    document.querySelectorAll('.access-note').forEach(el=>el.remove());
    const login=document.querySelector('#loginPanel');
    if(login){
      const h=login.querySelector('h2'); if(h) h.textContent='User Sign In';
      const p=login.querySelector('p'); if(p && /selamat datang/i.test(p.textContent||'')) p.remove();
      const sw=login.querySelector('.auth-switch');
      if(sw){
        [...sw.querySelectorAll('button')].forEach(b=>{if(b.id!=='goAdmin')b.remove()});
      }
    }
    document.querySelectorAll('.brand').forEach(b=>{
      if(b.querySelector('.brand-tagline'))return;
      const span=b.querySelector('span');
      if(span){
        const wrap=document.createElement('div');wrap.className='brand-copy';
        span.parentNode.insertBefore(wrap,span);wrap.appendChild(span);
        const q=document.createElement('small');q.className='brand-tagline';q.textContent='From Idea to Publication';wrap.appendChild(q);
      }
    });
  }
  document.addEventListener('DOMContentLoaded',polish);
  const obs=new MutationObserver(polish);obs.observe(document.documentElement,{subtree:true,childList:true});
  setTimeout(polish,0);
  const css=document.createElement('style');css.textContent=`
    .brand{gap:14px!important;align-items:center!important}
    .brand-copy{display:flex;flex-direction:column;line-height:1.05}
    .brand-copy>span{font-size:24px!important;font-weight:800!important;letter-spacing:-.02em}
    .brand-tagline{margin-top:5px;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);font-weight:700}
    .hero .brand{justify-content:flex-start!important;margin-bottom:24px!important}
    .hero .brand-logo-img{width:92px!important;height:92px!important}
    .hero .brand-logo-img img{width:92px!important;height:78px!important}
    .hero .brand-copy>span{font-size:34px!important}
    .hero .brand-tagline{font-size:13px!important;color:#596579!important;letter-spacing:.09em}
    .sidebar .brand-logo-img{width:62px!important;height:62px!important}
    .sidebar .brand-logo-img img{width:62px!important;height:52px!important}
    .sidebar .brand-copy>span{font-size:20px!important}
    .sidebar .brand-tagline{font-size:9px!important;letter-spacing:.04em}
    #loginPanel .auth-switch{justify-content:flex-end!important;margin-top:12px!important}
    #loginPanel .auth-switch #goAdmin{font-size:12px!important}
    @media(max-width:820px){
      .hero .brand{justify-content:center!important}
      .hero .brand-logo-img{width:82px!important;height:82px!important}
      .hero .brand-logo-img img{width:82px!important;height:70px!important}
      .hero .brand-copy>span{font-size:30px!important}
      .hero .brand-tagline{font-size:11px!important}
    }
  `;document.head.appendChild(css);
})();