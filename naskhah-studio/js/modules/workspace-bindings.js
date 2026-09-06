/* Naskhah Studio — Phase 3 Batch D3
 * Workspace tab interaction ownership for Outline, Checklist, Notes,
 * References and Export.
 */
(() => {
  'use strict';

  const previousBindTab = bindTab;

  const bindOutline = (p) => {
    $('#addOutline').onclick = async () => {
      p.outline = p.outline || [];
      p.outline.push({
        id: crypto.randomUUID(),
        title: 'Bab / Bahagian Baharu',
        notes: '',
        target_words: 1000,
        status: 'not_started',
        children: [],
        order: p.outline.length
      });
      await saveProject();
      renderProject('outline');
    };

    $$('.outline-row').forEach(row => {
      const i = Number(row.dataset.oi);
      const item = p.outline[i];
      row.querySelector('.ol-status').value = item.status || 'not_started';
      row.querySelector('.ol-title').onchange = async e => { item.title = e.target.value; await saveProject(); };
      row.querySelector('.ol-notes').onchange = async e => { item.notes = e.target.value; await saveProject(); };
      row.querySelector('.ol-target').onchange = async e => { item.target_words = Number(e.target.value || 0); await saveProject(); };
      row.querySelector('.ol-status').onchange = async e => { item.status = e.target.value; await saveProject(); };
      row.querySelector('.del-outline').onclick = async () => {
        p.outline.splice(i, 1);
        await saveProject();
        renderProject('outline');
      };
    });
  };

  const bindChecklist = (p) => {
    $$('[data-check]').forEach(control => control.onchange = async () => {
      const [pi, ii] = control.dataset.check.split(':').map(Number);
      p.checklist[pi].items[ii].done = control.checked;
      await saveProject();
      renderProject('checklist');
    });

    $$('.add-check').forEach(button => button.onclick = () => {
      const value = prompt('Item checklist baharu');
      if (!value) return;
      p.checklist[Number(button.dataset.pi)].items.push({ id: crypto.randomUUID(), text: value, done: false });
      saveProject().then(() => renderProject('checklist'));
    });
  };

  const bindNotes = (p) => {
    $('#addNote').onclick = () => {
      p.goals.notes.push({ title: '', body: '' });
      renderProject('notes');
    };

    $$('.note-card').forEach(card => {
      const i = Number(card.dataset.ni);
      card.querySelector('.save-note').onclick = async () => {
        p.goals.notes[i] = {
          title: card.querySelector('.note-title').value.trim(),
          body: card.querySelector('.note-body').value
        };
        await saveProject();
        toast('Research note disimpan.');
      };
      card.querySelector('.del-note').onclick = async () => {
        p.goals.notes.splice(i, 1);
        await saveProject();
        renderProject('notes');
      };
    });
  };

  const bindReferences = (p) => {
    $('#addRef').onclick = () => {
      p.goals.references.push({ title: '', style: 'APA 7', text: '' });
      renderProject('references');
    };

    $$('.reference-card').forEach(card => {
      const i = Number(card.dataset.ri);
      const ref = p.goals.references[i];
      card.querySelector('.ref-style').value = ref.style || 'APA 7';
      card.querySelector('.save-ref').onclick = async () => {
        p.goals.references[i] = {
          title: card.querySelector('.ref-title').value.trim(),
          style: card.querySelector('.ref-style').value,
          text: card.querySelector('.ref-text').value
        };
        await saveProject();
        toast('Reference disimpan.');
      };
      card.querySelector('.del-ref').onclick = async () => {
        p.goals.references.splice(i, 1);
        await saveProject();
        renderProject('references');
      };
    });

    $$('[data-copyref]').forEach(button => button.onclick = async () => {
      const ref = p.goals.references[Number(button.dataset.copyref)];
      await navigator.clipboard.writeText(ref.text || ref.title || '');
      toast('Citation disalin.');
    });
  };

  const bindExport = (p) => {
    $('#exportTxt').onclick = () => downloadBlob(slug(p.title) + '.txt', new Blob([manuscriptText(p)], { type: 'text/plain' }));
    $('#printPdf').onclick = () => printManuscript(p);
    $('#exportDocx').onclick = async () => {
      const file = await makeDocx(p);
      downloadBlob(slug(p.title) + '.docx', file);
    };
    $('#shareCloud').onclick = async () => {
      const file = await makeDocx(p);
      const shared = new File([file], slug(p.title) + '.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      if (navigator.canShare?.({ files: [shared] })) {
        await navigator.share({ title: p.title, text: 'Naskhah Studio manuscript', files: [shared] });
      } else {
        downloadBlob(shared.name, file);
        toast('Share sheet tidak disokong. Fail telah dimuat turun.');
      }
    };
  };

  bindTab = (tab) => {
    const p = state.current;
    if (tab === 'outline') return bindOutline(p);
    if (tab === 'checklist') return bindChecklist(p);
    if (tab === 'notes') return bindNotes(p);
    if (tab === 'references') return bindReferences(p);
    if (tab === 'export') return bindExport(p);
    return previousBindTab(tab);
  };

  Object.defineProperty(window, 'NaskhahWorkspaceBindingsModule', {
    value: Object.freeze({ version: '3.0.0-d3' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
