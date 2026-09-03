// Writing Zone focus mode: collapse toolbar/panels for larger editor space
(function(){
  function enhanceFocus(){
    const layout=document.querySelector('.writer-layout');
    const editorCard=document.querySelector('.editor-card');
    const toolbar=document.querySelector('.format-toolbar');
    if(!layout||!editorCard||!toolbar||document.querySelector('#writingFocusToggle'))return;

    const head=editorCard.querySelector('.editor-head');
    const btn=document.createElement('button');
    btn.id='writingFocusToggle';
    btn.type='button';
    btn.className='btn writing-focus-btn';
    btn.textContent='⛶ Focus Writing';
    btn.title='Hide writing tools and side panels';
    head?.appendChild(btn);

    const toolsBtn=document.createElement('button');
    toolsBtn.id='writingToolsToggle';
    toolsBtn.type='button';
    toolsBtn.className='btn writing-tools-btn';
    toolsBtn.textContent='⌃ Hide Tools';
    toolsBtn.title='Collapse / show formatting toolbar';
    toolbar.parentNode?.insertBefore(toolsBtn,toolbar);

    const savedFocus=localStorage.getItem('naskhah_writer_focus')==='1';
    const savedTools=localStorage.getItem('naskhah_writer_tools_hidden')==='1';
    if(savedFocus)layout.classList.add('writer-focus-mode');
    if(savedTools)layout.classList.add('writer-tools-hidden');
    sync();

    btn.onclick=()=>{layout.classList.toggle('writer-focus-mode');localStorage.setItem('naskhah_writer_focus',layout.classList.contains('writer-focus-mode')?'1':'0');sync()};
    toolsBtn.onclick=()=>{layout.classList.toggle('writer-tools-hidden');localStorage.setItem('naskhah_writer_tools_hidden',layout.classList.contains('writer-tools-hidden')?'1':'0');sync()};

    function sync(){
      const focus=layout.classList.contains('writer-focus-mode');
      const hidden=layout.classList.contains('writer-tools-hidden');
      btn.textContent=focus?'⊟ Exit Focus':'⛶ Focus Writing';
      toolsBtn.textContent=hidden?'⌄ Show Tools':'⌃ Hide Tools';
    }
  }

  const oldRender=renderProject;
  renderProject=function(tab){oldRender(tab);if(tab==='writing')setTimeout(enhanceFocus,0)};

  const css=document.createElement('style');
  css.textContent=`
    .editor-head{align-items:center;gap:10px}
    .writing-focus-btn{margin-left:auto;white-space:nowrap;padding:8px 11px}
    .writing-tools-btn{margin:8px 12px 0 auto;display:block;padding:7px 10px;font-size:12px}
    .writer-tools-hidden .format-toolbar{display:none!important}
    .writer-tools-hidden .writing-tools-btn{margin-bottom:8px}

    .writer-focus-mode{grid-template-columns:minmax(0,1fr)!important}
    .writer-focus-mode .section-list,
    .writer-focus-mode .writer-stats{display:none!important}
    .writer-focus-mode .editor-card{height:calc(100vh - 150px)!important;min-height:620px}
    .writer-focus-mode .rich-editor{padding-left:max(44px,8vw)!important;padding-right:max(44px,8vw)!important}
    .writer-focus-mode .writing-tools-btn{margin-right:16px}

    .writer-focus-mode.writer-tools-hidden .editor-card{height:calc(100vh - 135px)!important}

    @media(max-width:900px){
      .writer-focus-mode .editor-card{height:calc(100vh - 125px)!important;min-height:520px}
      .writer-focus-mode .rich-editor{padding-left:28px!important;padding-right:28px!important}
    }
    @media(max-width:650px){
      .writing-focus-btn{padding:7px 9px;font-size:12px}
      .writer-focus-mode .editor-card{height:72vh!important;min-height:0}
      .writer-focus-mode .rich-editor{padding:20px!important}
    }
  `;
  document.head.appendChild(css);
})();