/* Naskhah Studio — Phase 3 Batch D1
 * Secondary project workspace view ownership.
 */
(() => {
  'use strict';

  outlineView = (p) => `<div class="card"><div class="card-head"><h2>Pengurus Rangka</h2><button class="btn primary" id="addOutline">+ Tambah Bab / Bahagian</button></div>${(p.outline||[]).map((o,i)=>`<div class="outline-row" data-oi="${i}"><div>☰</div><div><input class="ol-title" value="${esc(o.title)}"><textarea class="ol-notes" placeholder="Nota rangka...">${esc(o.notes||'')}</textarea></div><div><input class="ol-target" type="number" value="${Number(o.target_words||0)}"><select class="ol-status"><option value="not_started">Not Started</option><option value="drafting">Drafting</option><option value="review">Review</option><option value="complete">Complete</option></select><button class="btn small danger del-outline" style="margin-top:8px">Delete</button></div></div>`).join('')}</div>`;

  checklistView = (p) => {
    const items = (p.checklist||[]).flatMap(x=>x.items);
    const done = items.filter(x=>x.done).length;
    const pct = Math.round(done/Math.max(1,items.length)*100);
    return `<div class="card"><div class="card-head"><div><h2>Senarai Semak Fasa</h2><p class="muted">${done}/${items.length} selesai · ${pct}%</p></div><div class="progress" style="width:220px"><i style="width:${pct}%"></i></div></div><div class="phases">${(p.checklist||[]).map((ph,pi)=>`<section class="phase"><h3>Fasa ${pi+1}: ${esc(ph.name)}</h3>${ph.items.map((it,ii)=>`<label class="check"><input type="checkbox" data-check="${pi}:${ii}" ${it.done?'checked':''}><span>${esc(it.text)}</span></label>`).join('')}<button class="link add-check" data-pi="${pi}">+ Tambah item</button></section>`).join('')}</div></div>`;
  };

  notesView = (p) => `<div class="card"><div class="card-head"><div><h2>Research Notes</h2><p class="muted">Simpan tajuk note dan kandungan yang berkaitan dengan projek.</p></div><button class="btn primary" id="addNote">+ Tambah Note</button></div><div id="notesList">${p.goals.notes.map((n,i)=>`<div class="note-card" data-ni="${i}"><input class="note-title" placeholder="Tajuk" value="${esc(n.title||'')}"><textarea class="note-body" rows="5" placeholder="Notes...">${esc(n.body||'')}</textarea><div class="actions"><button class="btn small danger del-note">Delete</button><button class="btn small primary save-note">Save</button></div></div>`).join('')||'<p class="muted">Belum ada research note.</p>'}</div></div>`;

  referencesView = (p) => `<div class="card"><div class="card-head"><div><h2>References</h2><p class="muted">Simpan rujukan dan format citation untuk digunakan semula dalam manuskrip.</p></div><button class="btn primary" id="addRef">+ Tambah Reference</button></div>${p.goals.references.map((r,i)=>`<div class="reference-card" data-ri="${i}"><div class="reference-meta"><input class="ref-title" placeholder="Tajuk / Author" value="${esc(r.title||'')}"><select class="ref-style"><option>APA 7</option><option>Harvard</option><option>MLA</option><option>Chicago</option><option>IEEE</option></select></div><textarea class="ref-text" rows="4" placeholder="Formatted reference / DOI / URL">${esc(r.text||'')}</textarea><div class="actions"><button class="btn small" data-copyref="${i}">Copy Citation</button><button class="btn small danger del-ref">Delete</button><button class="btn small primary save-ref">Save</button></div></div>`).join('')||'<p class="muted">Belum ada reference.</p>'}</div>`;

  exportView = (p) => `<div class="grid2"><div class="card"><h2>Export Manuskrip</h2><p class="muted">Gabungkan semua bahagian manuskrip mengikut struktur projek.</p><div class="actions" style="justify-content:flex-start"><button class="btn primary" id="exportDocx">Download Word / DOCX</button><button class="btn" id="exportTxt">TXT</button><button class="btn" id="printPdf">Print / Save PDF</button><button class="btn" id="shareCloud">Share / Save to Cloud</button></div></div><div class="card"><h2>Ringkasan</h2><div class="profile-row"><span>Jumlah perkataan</span><b>${projectWords(p).toLocaleString()}</b></div><div class="profile-row"><span>Jumlah bahagian</span><b>${Object.keys(p.content).length}</b></div><div class="profile-row"><span>Project</span><b>${esc(templates[p.project_type]?.label)}</b></div></div></div>`;

  Object.defineProperty(window, 'NaskhahWorkspaceViewsModule', {
    value: Object.freeze({ version: '3.0.0-d1' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
