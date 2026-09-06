/* Naskhah Studio — Phase 3 Batch C
 * Writer/editor runtime ownership.
 */
(() => {
  'use strict';

  writingView = (p) => {
    const secs = Object.keys(p.content);
    const sec = state.activeSection && secs.includes(state.activeSection) ? state.activeSection : secs[0];
    state.activeSection = sec;
    return `<div id="writerLayout" class="writer-layout ${state.focus?'focus-mode':''} ${state.toolsHidden?'tools-hidden':''}"><aside class="section-list">${secs.map(s=>`<button data-section="${esc(s)}" class="${s===sec?'active':''}">${esc(s)}<small>${countWords(p.content[s])} words</small></button>`).join('')}</aside><section class="editor-card"><div class="editor-head"><div><h2 id="sectionTitle">${esc(sec)}</h2><small id="saveState">Autosave aktif</small></div><div class="editor-actions"><button class="btn small" id="undoBtn">↶ Undo</button><button class="btn small" id="redoBtn">↷ Redo</button><button class="btn small" id="toolsToggle">${state.toolsHidden?'Show Tools':'Hide Tools'}</button><button class="btn small" id="focusToggle">${state.focus?'Exit Focus':'Focus Writing'}</button><button class="btn primary small" id="manualSave">💾 SIMPAN / SAVE</button></div></div><div class="format-toolbar"><select id="fontFamily"><option>Times New Roman</option><option>Arial</option><option>Calibri</option><option>Georgia</option><option>Garamond</option></select><select id="fontSize"><option value="2">10</option><option value="3" selected>12</option><option value="4">14</option><option value="5">18</option></select><select id="lineHeight"><option value="1.0">1.0</option><option value="1.15">1.15</option><option value="1.5" selected>1.5</option><option value="2">2.0</option></select><button data-cmd="bold"><b>B</b></button><button data-cmd="italic"><i>I</i></button><button data-cmd="underline"><u>U</u></button><button data-cmd="justifyLeft">Left</button><button data-cmd="justifyCenter">Center</button><button data-cmd="justifyRight">Right</button><button data-cmd="justifyFull">Justify</button><button id="insertTable">▦ Table</button><button id="insertImage">🖼 Image</button><input id="imageFile" class="hidden" type="file" accept="image/png,image/jpeg,image/webp,image/gif"></div><div id="editor" class="rich-editor" contenteditable="true" spellcheck="true" data-placeholder="Mula menulis di sini...">${p.content[sec]||''}</div></section><aside class="writer-stats"><h3>Statistik</h3><div class="metric"><b id="sectionWords">${countWords(p.content[sec])}</b><span>Section words</span></div><div class="metric"><b id="totalWords">${projectWords(p)}</b><span>Total words</span></div><div class="metric"><b id="readingTime">${Math.max(1,Math.ceil(projectWords(p)/220))} min</b><span>Reading time</span></div></aside></div>`;
  };

  bindWriter = (p) => {
    let sec = state.activeSection;
    const ed = $('#editor');
    let timer;

    const sync = () => {
      p.content[sec] = ed.innerHTML;
      $('#sectionWords').textContent = countWords(ed.innerHTML);
      $('#totalWords').textContent = projectWords(p);
      $('#readingTime').textContent = Math.max(1,Math.ceil(projectWords(p)/220)) + ' min';
    };

    const manual = async () => {
      sync();
      $('#manualSave').disabled = true;
      $('#manualSave').textContent = 'Menyimpan...';
      try {
        await saveProject();
        $('#saveState').textContent = 'Disimpan secara manual';
        $('#manualSave').textContent = '✓ DISIMPAN';
        setTimeout(() => {
          $('#manualSave').textContent = '💾 SIMPAN / SAVE';
          $('#manualSave').disabled = false;
        }, 1000);
        toast(sec + ' disimpan.');
      } catch (e) {
        $('#manualSave').disabled = false;
        $('#manualSave').textContent = '💾 SIMPAN / SAVE';
        toast(e.message,true);
      }
    };

    $$('[data-section]').forEach(b => b.onclick = async () => {
      sync();
      clearTimeout(timer);
      try { await saveProject(); } catch {}
      state.activeSection = b.dataset.section;
      renderProject('writing');
    });

    ed.oninput = () => {
      sync();
      $('#saveState').textContent = 'Menyimpan...';
      clearTimeout(timer);
      timer = setTimeout(async () => {
        try {
          await saveProject();
          $('#saveState').textContent = 'Tersimpan di cloud';
        } catch (e) {
          $('#saveState').textContent = 'Gagal autosave';
        }
      }, 700);
    };

    $('#manualSave').onclick = manual;
    $('#undoBtn').onclick = () => { ed.focus(); document.execCommand('undo'); };
    $('#redoBtn').onclick = () => { ed.focus(); document.execCommand('redo'); };
    $('#focusToggle').onclick = () => {
      state.focus = !state.focus;
      $('#writerLayout').classList.toggle('focus-mode', state.focus);
      $('#focusToggle').textContent = state.focus ? 'Exit Focus' : 'Focus Writing';
    };
    $('#toolsToggle').onclick = () => {
      state.toolsHidden = !state.toolsHidden;
      $('#writerLayout').classList.toggle('tools-hidden', state.toolsHidden);
      $('#toolsToggle').textContent = state.toolsHidden ? 'Show Tools' : 'Hide Tools';
    };
    $$('[data-cmd]').forEach(b => b.onclick = () => { ed.focus(); document.execCommand(b.dataset.cmd); });
    $('#fontFamily').onchange = e => { ed.focus(); document.execCommand('fontName', false, e.target.value); };
    $('#fontSize').onchange = e => { ed.focus(); document.execCommand('fontSize', false, e.target.value); };
    $('#lineHeight').onchange = e => { ed.style.lineHeight = e.target.value; };
    $('#insertTable').onclick = () => openTableDialog(ed);
    $('#insertImage').onclick = () => $('#imageFile').click();
    $('#imageFile').onchange = () => uploadImage(p, ed, $('#imageFile').files?.[0]);
    ed.onkeydown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        manual();
      }
    };
    hydrateImages(ed);
  };

  openTableDialog = (ed) => {
    modal(`<h2>Insert Table</h2><div class="grid2"><label>Rows<input id="tblRows" type="number" min="1" max="30" value="3"></label><label>Columns<input id="tblCols" type="number" min="1" max="12" value="3"></label></div><label>Caption<input id="tblCaption" placeholder="Table 1: ..."></label><div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn primary" id="tblInsert">Insert</button></div>`);
    $('#tblInsert').onclick = () => {
      const rows = Math.min(30,Math.max(1,Number($('#tblRows').value||3)));
      const cols = Math.min(12,Math.max(1,Number($('#tblCols').value||3)));
      const cap = $('#tblCaption').value.trim();
      let html = cap ? `<p><strong>${esc(cap)}</strong></p>` : '';
      html += '<table class="manuscript-table"><tbody>';
      for (let r=0;r<rows;r++) {
        html += '<tr>';
        for (let c=0;c<cols;c++) html += r===0 ? '<th>Heading</th>' : '<td>Data</td>';
        html += '</tr>';
      }
      html += '</tbody></table><p><br></p>';
      ed.focus();
      document.execCommand('insertHTML',false,html);
      ed.dispatchEvent(new Event('input',{bubbles:true}));
      closeModal();
    };
  };

  uploadImage = async (p, ed, file) => {
    if (!file) return;
    if (file.size > 10*1024*1024) return toast('Maksimum gambar 10MB.', true);
    try {
      const u = (await sb.auth.getUser()).data.user;
      const path = `${u.id}/${p.id}/${crypto.randomUUID()}.${(file.name.split('.').pop()||'png').toLowerCase()}`;
      const {error} = await sb.storage.from('naskhah-media').upload(path,file,{contentType:file.type,upsert:false});
      if (error) throw error;
      const {data} = await sb.storage.from('naskhah-media').createSignedUrl(path,3600);
      const cap = prompt('Caption gambar/graf (optional):') || '';
      ed.focus();
      document.execCommand('insertHTML',false,`<figure class="manuscript-figure"><img data-naskhah-path="${esc(path)}" src="${esc(data.signedUrl)}" alt="${esc(cap||file.name)}">${cap?`<figcaption>${esc(cap)}</figcaption>`:''}</figure><p><br></p>`);
      ed.dispatchEvent(new Event('input',{bubbles:true}));
      toast('Gambar dimasukkan.');
    } catch (e) {
      toast(e.message || 'Upload gagal.', true);
    }
  };

  hydrateImages = async (ed) => {
    for (const img of ed.querySelectorAll('img[data-naskhah-path]')) {
      const {data} = await sb.storage.from('naskhah-media').createSignedUrl(img.dataset.naskhahPath,3600);
      if (data?.signedUrl) img.src = data.signedUrl;
    }
  };

  Object.defineProperty(window, 'NaskhahWriterModule', {
    value: Object.freeze({ version: '3.0.0-c1' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
