// Undo/Redo + explicit Save per writing section for all project types
(function(){
  function enhanceWritingSave(){
    const p=state.current,ed=document.querySelector('#editor'),head=document.querySelector('.editor-head'),toolbar=document.querySelector('.format-toolbar');
    if(!p||!ed||!head||document.querySelector('#manualSectionSave'))return;

    let activeSection=document.querySelector('.section-list button.active')?.dataset.section||Object.keys(p.content||{})[0];
    const actions=document.createElement('div');actions.className='writer-save-actions';actions.innerHTML=`<button type="button" id="writerUndo" class="btn" title="Undo">↶ Undo</button><button type="button" id="writerRedo" class="btn" title="Redo">↷ Redo</button><button type="button" id="manualSectionSave" class="btn primary" title="Save current section">💾 SIMPAN / SAVE</button>`;head.appendChild(actions);

    const undoBtn=actions.querySelector('#writerUndo'),redoBtn=actions.querySelector('#writerRedo'),saveBtn=actions.querySelector('#manualSectionSave');
    undoBtn.onclick=()=>{ed.focus();document.execCommand('undo',false,null);ed.dispatchEvent(new Event('input',{bubbles:true}))};
    redoBtn.onclick=()=>{ed.focus();document.execCommand('redo',false,null);ed.dispatchEvent(new Event('input',{bubbles:true}))};

    async function saveCurrent(){
      activeSection=document.querySelector('.section-list button.active')?.dataset.section||activeSection;
      if(activeSection)p.content[activeSection]=ed.innerHTML;
      saveBtn.disabled=true;saveBtn.textContent='Menyimpan...';
      const before=new Date();
      try{
        await saveProject();
        const stateEl=document.querySelector('#saveState');if(stateEl)stateEl.textContent='Disimpan secara manual';
        saveBtn.textContent='✓ DISIMPAN';
        toast(`${activeSection||'Bahagian'} berjaya disimpan ke cloud.`);
        setTimeout(()=>{saveBtn.textContent='💾 SIMPAN / SAVE';saveBtn.disabled=false},1300);
      }catch(e){saveBtn.textContent='💾 SIMPAN / SAVE';saveBtn.disabled=false;toast(e.message||'Gagal menyimpan.',true)}
    }
    saveBtn.onclick=saveCurrent;

    document.querySelectorAll('.section-list button[data-section]').forEach(btn=>{
      btn.addEventListener('click',()=>{activeSection=btn.dataset.section;const stateEl=document.querySelector('#saveState');if(stateEl)stateEl.textContent='Autosave aktif'});
    });

    // Keyboard shortcuts
    ed.addEventListener('keydown',e=>{
      const mod=e.ctrlKey||e.metaKey;
      if(mod&&e.key.toLowerCase()==='s'){e.preventDefault();saveCurrent()}
      if(mod&&e.key.toLowerCase()==='z'&&!e.shiftKey){/* native/contenteditable undo handled by browser */}
      if(mod&&((e.key.toLowerCase()==='y')||(e.key.toLowerCase()==='z'&&e.shiftKey))){/* native redo handled by browser */}
    });
  }

  const oldRender=renderProject;
  renderProject=function(tab){oldRender(tab);if(tab==='writing')setTimeout(enhanceWritingSave,0)};

  const css=document.createElement('style');css.textContent=`.writer-save-actions{display:flex;gap:7px;align-items:center;margin-left:auto;flex-wrap:wrap}.writer-save-actions .btn{padding:8px 10px;font-size:12px;white-space:nowrap}.writer-save-actions .primary{font-weight:800}.editor-head{flex-wrap:wrap}@media(max-width:700px){.writer-save-actions{width:100%;margin-left:0}.writer-save-actions .btn{flex:1 1 auto}}`;document.head.appendChild(css);
})();