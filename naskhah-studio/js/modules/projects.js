/* Naskhah Studio — Phase 3 Batch B2
 * Project creation/open lifecycle runtime ownership.
 */
(() => {
  'use strict';

  openCreate = () => {
    modal(`<h2>Projek Baharu</h2><label>Tajuk<input id="cpTitle" placeholder="Tajuk penulisan"></label><label>Jenis<select id="cpType">${Object.entries(templates).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></label><label>Target perkataan<input id="cpTarget" type="number" value="10000"></label><label>Deadline projek<input id="cpDeadline" type="date"></label><label>Bahasa<select id="cpLang"><option>Malay</option><option>English</option></select></label><div class="actions"><button class="btn" onclick="closeModal()">Batal</button><button class="btn primary" id="cpSave">Cipta Projek</button></div>`);
    $('#cpType').onchange = (e) => $('#cpTarget').value = templates[e.target.value].target;
    $('#cpSave').onclick = createProject;
  };

  createProject = async () => {
    const type = $('#cpType').value;
    const title = $('#cpTitle').value.trim();
    if (!title) return toast('Masukkan tajuk.', true);

    const t = templates[type];
    const target = Number($('#cpTarget').value || t.target);
    const content = Object.fromEntries(t.sections.map(s=>[s,'']));
    const outline = t.sections
      .filter(s=>!['Keywords','References'].includes(s))
      .map((s,i)=>({
        id:crypto.randomUUID(),
        title:s,
        notes:'',
        target_words:Math.round(target/Math.max(1,t.sections.length)),
        status:'not_started',
        children:[],
        order:i
      }));
    const checklist = t.phases.map(([name,items],i)=>({
      id:crypto.randomUUID(),
      name,
      order:i,
      items:items.map(x=>({id:crypto.randomUUID(),text:x,done:false}))
    }));
    const goals = {
      daily:500,
      weekly:3000,
      section_deadlines:Object.fromEntries(t.sections.map(s=>[s,{due_date:'',reminder_days:7,target_words:0}])),
      notes:[],
      references:[],
      versions:[],
      submission:{},
      journal:{},
      revisions:[]
    };

    const u = (await sb.auth.getUser()).data.user;
    const {data,error} = await sb.from('nv1_projects').insert({
      user_id:u.id,
      title,
      project_type:type,
      target_words:target,
      deadline:$('#cpDeadline').value||null,
      language:$('#cpLang').value,
      status:'draft',
      content,
      outline,
      checklist,
      goals
    }).select().single();

    if (error) return toast(error.message,true);
    closeModal();
    state.projects.unshift(data);
    openProject(data.id);
  };

  normalizeProject = (p) => {
    const t = templates[p.project_type];
    if (!t) return;
    p.content = p.content || {};
    const next = {};
    t.sections.forEach(s=>next[s]=p.content[s]??'');
    Object.keys(p.content).forEach(s=>{if(!(s in next))next[s]=p.content[s]});
    p.content = next;
    p.goals = p.goals || {};
    p.goals.section_deadlines = p.goals.section_deadlines || {};
    Object.keys(p.content).forEach(s=>p.goals.section_deadlines[s]=p.goals.section_deadlines[s]||{due_date:'',reminder_days:7,target_words:0});
    p.goals.notes = p.goals.notes || [];
    p.goals.references = p.goals.references || [];
    p.goals.versions = p.goals.versions || [];
    p.goals.submission = p.goals.submission || {};
    p.goals.journal = p.goals.journal || {};
    p.goals.revisions = p.goals.revisions || [];
  };

  openProject = (id) => {
    state.current = state.projects.find(p=>String(p.id)===String(id));
    if (!state.current) return;
    normalizeProject(state.current);
    renderProject('overview');
  };

  Object.defineProperty(window, 'NaskhahProjectsModule', {
    value: Object.freeze({ version: '3.0.0-b2' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
