/* Naskhah Studio — Phase 3 Batch D2
 * Overview, deadlines and submission tracking runtime ownership.
 */
(() => {
  'use strict';

  const legacyBindTab = bindTab;

  overviewView = (p) => {
    const w = projectWords(p);
    const pct = projectPct(p);
    return `<div class="stats"><div class="stat words"><b>${w.toLocaleString()}</b><span>Jumlah Perkataan</span></div><div class="stat progress-card"><b>${pct}%</b><span>% Kemajuan</span></div><div class="stat sections"><b>${Object.keys(p.content).length}</b><span>Jumlah Bahagian</span></div><div class="stat deadline"><b>${esc(p.deadline||'—')}</b><span>Tarikh Deadline</span></div></div><div class="grid2"><div class="card"><h2>Writing Health</h2>${Object.entries(p.content).filter(([k])=>!['Keywords','References'].includes(k)).map(([k,v])=>{const n=countWords(v),s=n===0?'Belum mula':n<100?'Draft awal':'Sedang ditulis';return `<div class="health"><span>${esc(k)}</span><b>${n} words</b><em>${s}</em></div>`}).join('')}</div><div class="card"><h2>Writing Goals</h2><label>Target Harian<input id="goalDaily" type="number" value="${Number(p.goals.daily||500)}"></label><label>Target Mingguan<input id="goalWeekly" type="number" value="${Number(p.goals.weekly||3000)}"></label><label>Project Deadline<input id="projectDeadline" type="date" value="${esc(p.deadline||'')}"></label><button class="btn primary" id="saveGoals" style="margin-top:14px">Simpan Goal</button></div></div>${deadlinesView(p)}${specialSubmissionView(p)}`;
  };

  deadlinesView = (p) => `<div class="card"><div class="card-head"><div><h2>${p.project_type==='thesis'?'Thesis Chapter Deadlines':'Section Deadlines'}</h2><p class="muted">Due date, reminder 1–30 hari dan target perkataan setiap bahagian.</p></div></div><div class="deadline-table">${Object.keys(p.content).map((s,i)=>{const d=p.goals.section_deadlines[s]||{};return `<div class="deadline-row" data-dsec="${esc(s)}"><div class="deadline-section"><i>${i+1}</i><b>${esc(s)}</b></div><label>Due Date<input class="d-date" type="date" value="${esc(d.due_date||'')}"></label><label>Reminder<select class="d-rem">${reminderOptions(d.reminder_days)}</select></label><label>Word Target<input class="d-target" type="number" min="0" value="${Number(d.target_words||0)}"></label></div>`}).join('')}</div><div class="actions"><button class="btn primary" id="saveDeadlines">Simpan Deadlines</button></div></div>`;

  specialSubmissionView = (p) => {
    const s = p.goals.submission || {};
    const j = p.goals.journal || {};
    if (p.project_type === 'article') {
      return `<div class="card"><h2>Article Submission & Tracking</h2><div class="submission-grid"><div><h3>Submission kepada Supervisor</h3><label>Tarikh<input id="supDate" type="date" value="${esc(s.supervisor_date||'')}"></label><label>Reminder<select id="supRem">${reminderOptions(s.supervisor_reminder)}</select></label><label>Tarikh Feedback<input id="supFeedback" type="date" value="${esc(s.feedback_date||'')}"></label><label>Status Supervisor<select id="supStatus"><option>Belum dihantar</option><option>Submitted</option><option>Feedback Received</option><option>Revision Required</option><option>Approved</option></select></label></div><div><h3>Journal Profile</h3><label>Journal Name<input id="journalName" value="${esc(j.name||'')}"></label><label>Publisher / URL<input id="journalPublisher" value="${esc(j.publisher||'')}"></label><label>Submission Date<input id="journalDate" type="date" value="${esc(j.submission_date||'')}"></label><label>Reminder<select id="journalRem">${reminderOptions(j.reminder_days)}</select></label><label>Status Artikel<select id="articleStatus"><option>Draft</option><option>Supervisor Review</option><option>Ready for Submission</option><option>Submitted</option><option>Under Review</option><option>Minor Revision</option><option>Major Revision</option><option>Accepted</option><option>Published</option><option>Rejected</option></select></label></div></div><h3 style="margin-top:22px">Revision Tracker</h3><div id="revisionList">${p.goals.revisions.map((r,i)=>`<div class="health"><span><b>${esc(r.title||'Revision')}</b><br><small class="muted">${esc(r.notes||'')}</small></span><b>${esc(r.status||'Open')}</b><button class="btn small danger" data-delrev="${i}">Delete</button></div>`).join('')||'<p class="muted">Belum ada revision.</p>'}</div><div class="actions"><button class="btn" id="addRevision">+ Add Revision</button><button class="btn primary" id="saveSubmission">Simpan Tracking</button></div></div>`;
    }
    if (p.project_type === 'thesis') {
      return `<div class="card"><h2>Thesis Submission Tracking</h2><div class="submission-grid"><div><h3>Submission kepada Supervisor</h3><label>Tarikh<input id="supDate" type="date" value="${esc(s.supervisor_date||'')}"></label><label>Reminder<select id="supRem">${reminderOptions(s.supervisor_reminder)}</select></label><label>Status<select id="supStatus"><option>Belum dihantar</option><option>Submitted</option><option>Feedback Received</option><option>Revision Required</option><option>Approved</option></select></label></div><div><h3>Final Thesis Submission</h3><label>Tarikh<input id="finalDate" type="date" value="${esc(s.final_date||'')}"></label><label>Reminder<select id="finalRem">${reminderOptions(s.final_reminder)}</select></label><label>Status<select id="finalStatus"><option>Draft</option><option>Supervisor Review</option><option>Ready for Submission</option><option>Submitted</option><option>Corrections Required</option><option>Completed</option></select></label></div></div><div class="actions"><button class="btn primary" id="saveSubmission">Simpan Submission Tracking</button></div></div>`;
    }
    return '';
  };

  const bindOverview = (p) => {
    const s = p.goals.submission || {};
    const j = p.goals.journal || {};

    if ($('#supStatus')) $('#supStatus').value = s.supervisor_status || 'Belum dihantar';
    if ($('#finalStatus')) $('#finalStatus').value = s.final_status || 'Draft';
    if ($('#articleStatus')) $('#articleStatus').value = j.status || 'Draft';

    $('#saveGoals').onclick = async () => {
      p.goals.daily = Number($('#goalDaily').value || 0);
      p.goals.weekly = Number($('#goalWeekly').value || 0);
      p.deadline = $('#projectDeadline').value || null;
      try { await saveProject(); toast('Writing goal disimpan.'); }
      catch (e) { toast(e.message, true); }
    };

    $('#saveDeadlines').onclick = async () => {
      $$('[data-dsec]').forEach(r => {
        p.goals.section_deadlines[r.dataset.dsec] = {
          due_date: r.querySelector('.d-date').value,
          reminder_days: Number(r.querySelector('.d-rem').value),
          target_words: Number(r.querySelector('.d-target').value || 0)
        };
      });
      try { await saveProject(); toast('Deadlines disimpan.'); }
      catch (e) { toast(e.message, true); }
    };

    if ($('#saveSubmission')) $('#saveSubmission').onclick = async () => {
      p.goals.submission = {
        ...p.goals.submission,
        supervisor_date: $('#supDate')?.value || '',
        supervisor_reminder: Number($('#supRem')?.value || 7),
        supervisor_status: $('#supStatus')?.value || '',
        feedback_date: $('#supFeedback')?.value || '',
        final_date: $('#finalDate')?.value || '',
        final_reminder: Number($('#finalRem')?.value || 7),
        final_status: $('#finalStatus')?.value || ''
      };
      if (p.project_type === 'article') {
        p.goals.journal = {
          name: $('#journalName').value.trim(),
          publisher: $('#journalPublisher').value.trim(),
          submission_date: $('#journalDate').value,
          reminder_days: Number($('#journalRem').value || 7),
          status: $('#articleStatus').value
        };
      }
      try { await saveProject(); toast('Submission tracking disimpan.'); }
      catch (e) { toast(e.message, true); }
    };

    if ($('#addRevision')) $('#addRevision').onclick = () => {
      modal(`<h2>Add Revision</h2><label>Tajuk<input id="revTitle"></label><label>Notes<textarea id="revNotes" rows="4"></textarea></label><label>Status<select id="revStatus"><option>Open</option><option>In Progress</option><option>Completed</option></select></label><div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn primary" id="saveRev">Add</button></div>`);
      $('#saveRev').onclick = async () => {
        p.goals.revisions.push({
          title: $('#revTitle').value.trim() || 'Revision',
          notes: $('#revNotes').value.trim(),
          status: $('#revStatus').value,
          at: new Date().toISOString()
        });
        await saveProject();
        closeModal();
        renderProject('overview');
      };
    };

    $$('[data-delrev]').forEach(b => b.onclick = async () => {
      p.goals.revisions.splice(Number(b.dataset.delrev), 1);
      await saveProject();
      renderProject('overview');
    });
  };

  bindTab = (tab) => {
    if (tab === 'overview') return bindOverview(state.current);
    return legacyBindTab(tab);
  };

  Object.defineProperty(window, 'NaskhahOverviewTrackingModule', {
    value: Object.freeze({ version: '3.0.0-d2' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
