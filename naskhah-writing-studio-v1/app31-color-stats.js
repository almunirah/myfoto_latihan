// Colorful professional overview metric cards
(function(){
  function colorize(){
    document.querySelectorAll('.stats').forEach(stats=>{
      const cards=[...stats.children].filter(x=>x.classList.contains('stat'));
      const labels=cards.map(c=>(c.textContent||'').toLowerCase());
      cards.forEach((c,i)=>{
        c.classList.remove('metric-words','metric-progress','metric-sections','metric-deadline');
        const t=labels[i]||'';
        if(/perkataan|words/.test(t)) c.classList.add('metric-words');
        else if(/kemajuan|progress|%/.test(t)) c.classList.add('metric-progress');
        else if(/bahagian|sections/.test(t)) c.classList.add('metric-sections');
        else if(/deadline|due date|tarikh/.test(t)) c.classList.add('metric-deadline');
      });
    });
  }
  const obs=new MutationObserver(colorize);obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',colorize);setTimeout(colorize,0);
  const css=document.createElement('style');css.textContent=`
    .stat.metric-words{background:linear-gradient(135deg,#eef6ff,#dcecff)!important;border-color:#b8d8ff!important;box-shadow:0 8px 24px rgba(59,130,246,.08)}
    .stat.metric-words b{color:#1d4ed8!important}.stat.metric-words span{color:#365b8d!important}
    .stat.metric-progress{background:linear-gradient(135deg,#f3efff,#e7ddff)!important;border-color:#d6c6ff!important;box-shadow:0 8px 24px rgba(124,58,237,.08)}
    .stat.metric-progress b{color:#6d28d9!important}.stat.metric-progress span{color:#634994!important}
    .stat.metric-sections{background:linear-gradient(135deg,#ecfdf5,#d9f8e8)!important;border-color:#b8edd2!important;box-shadow:0 8px 24px rgba(16,185,129,.08)}
    .stat.metric-sections b{color:#047857!important}.stat.metric-sections span{color:#34715c!important}
    .stat.metric-deadline{background:linear-gradient(135deg,#fff7ed,#ffead5)!important;border-color:#ffd1a3!important;box-shadow:0 8px 24px rgba(249,115,22,.08)}
    .stat.metric-deadline b{color:#c2410c!important}.stat.metric-deadline span{color:#8c563b!important}
    .stat.metric-words,.stat.metric-progress,.stat.metric-sections,.stat.metric-deadline{position:relative;overflow:hidden;transition:transform .16s ease,box-shadow .16s ease}
    .stat.metric-words:hover,.stat.metric-progress:hover,.stat.metric-sections:hover,.stat.metric-deadline:hover{transform:translateY(-2px)}
    .stat.metric-words:after,.stat.metric-progress:after,.stat.metric-sections:after,.stat.metric-deadline:after{position:absolute;right:14px;top:12px;font-size:22px;opacity:.28}
    .stat.metric-words:after{content:'✎'}.stat.metric-progress:after{content:'◔'}.stat.metric-sections:after{content:'▦'}.stat.metric-deadline:after{content:'◷'}
  `;document.head.appendChild(css);
})();