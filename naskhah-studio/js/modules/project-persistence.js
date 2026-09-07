/* Naskhah Studio — Phase 3 G1
 * Shared project persistence ownership.
 * Loaded after core cutover and before project shell / feature modules.
 */
(() => {
  'use strict';

  saveProject = async () => {
    const p = state.current;
    p.updated_at = new Date().toISOString();

    const { error } = await sb
      .from('nv1_projects')
      .update({
        title: p.title,
        target_words: p.target_words,
        deadline: p.deadline,
        status: p.status,
        content: p.content,
        outline: p.outline,
        checklist: p.checklist,
        goals: p.goals,
        updated_at: p.updated_at
      })
      .eq('id', p.id);

    if (error) throw error;

    const idx = state.projects.findIndex(x => x.id === p.id);
    if (idx >= 0) state.projects[idx] = p;
  };

  Object.defineProperty(window, 'NaskhahProjectPersistenceModule', {
    value: Object.freeze({ version: '3.0.0-g1' }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
