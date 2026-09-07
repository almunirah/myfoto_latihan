/* Naskhah Studio — Phase 4B AI Smart Language Review
 * Bahasa Melayu and English are reviewed separately via authenticated Supabase Edge Function.
 */
(() => {
  'use strict';

  const escapeHtml = value => esc(String(value ?? ''));

  function replaceFirstTextNode(root, original, replacement) {
    if (!root || !original || replacement == null) return false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const idx = node.nodeValue.indexOf(original);
      if (idx >= 0) {
        node.nodeValue = node.nodeValue.slice(0, idx) + replacement + node.nodeValue.slice(idx + original.length);
        return true;
      }
    }
    return false;
  }

  const languageLabel = lang => lang === 'bm' ? 'Bahasa Melayu' : 'English';

  function issueHtml(issue, i, lang) {
    const explanationLabel = lang === 'bm' ? 'Sebab' : 'Explanation';
    const foundLabel = lang === 'bm' ? 'Teks asal' : 'Original';
    const suggestionLabel = lang === 'bm' ? 'Cadangan' : 'Suggestion';
    return `<div class="ai-language-issue" style="padding:12px 0;border-bottom:1px solid #e5e7eb">
      <div class="type-pill" style="display:inline-block;margin-bottom:7px">${escapeHtml(issue.category || 'Language')}</div>
      <div style="font-size:13px"><b>${escapeHtml(foundLabel)}</b><div style="margin-top:3px">${escapeHtml(issue.original)}</div></div>
      <div style="font-size:13px;margin-top:8px"><b>${escapeHtml(suggestionLabel)}</b><div style="margin-top:3px">${escapeHtml(issue.suggestion)}</div></div>
      <div style="font-size:12px;margin-top:8px" class="muted"><b>${escapeHtml(explanationLabel)}:</b> ${escapeHtml(issue.explanation)}</div>
      <div class="actions" style="margin-top:9px"><button class="btn small primary" data-ai-lang-apply="${i}">Apply</button><button class="btn small" data-ai-lang-ignore="${i}">Ignore</button></div>
    </div>`;
  }

  const oldWritingView = writingView;
  writingView = (p) => {
    let html = oldWritingView(p);
    html = html.replace('<button id="languageCheck">✓ Semak Bahasa</button>', '<button id="languageCheckBM">✦ Semak BM</button><button id="languageCheckEN">✦ Check English</button>');
    html = html.replace(/<div id="languagePanel"[\s\S]*?<\/div><\/aside><\/div>/, `<div id="languagePanel" style="margin-top:16px;border-top:1px solid #e5e7eb;padding-top:14px">
      <h3 style="margin:0 0 6px">AI Smart Language Review</h3>
      <div id="languageSummary" class="muted" style="font-size:12px">Pilih semakan Bahasa Melayu atau English. Kedua-dua bahasa disemak secara berasingan.</div>
      <div id="languageIssues"></div>
    </div></aside></div>`);
    return html;
  };

  const oldBindWriter = bindWriter;
  bindWriter = (p) => {
    oldBindWriter(p);
    const ed = $('#editor');
    const bmBtn = $('#languageCheckBM');
    const enBtn = $('#languageCheckEN');
    const summary = $('#languageSummary');
    const list = $('#languageIssues');
    if (!ed || !bmBtn || !enBtn || !summary || !list) return;

    let current = [];
    let currentLang = 'bm';
    let busy = false;

    const renderIssues = () => {
      summary.textContent = current.length
        ? `${current.length} isu/cadangan · ${languageLabel(currentLang)}`
        : `✓ Tiada isu ketara dikesan · ${languageLabel(currentLang)}`;
      list.innerHTML = current.length ? current.map((issue, i) => issueHtml(issue, i, currentLang)).join('') : '';

      $$('[data-ai-lang-apply]').forEach(btn => btn.onclick = () => {
        const issue = current[Number(btn.dataset.aiLangApply)];
        if (!issue) return;
        if (!replaceFirstTextNode(ed, issue.original, issue.suggestion)) {
          return toast(currentLang === 'bm' ? 'Teks asal telah berubah. Jalankan semakan semula.' : 'The original text has changed. Run the review again.', true);
        }
        ed.dispatchEvent(new Event('input', { bubbles:true }));
        current.splice(Number(btn.dataset.aiLangApply), 1);
        renderIssues();
        toast(currentLang === 'bm' ? 'Cadangan digunakan.' : 'Suggestion applied.');
      });

      $$('[data-ai-lang-ignore]').forEach(btn => btn.onclick = () => {
        current.splice(Number(btn.dataset.aiLangIgnore), 1);
        renderIssues();
      });
    };

    const runAIReview = async (lang) => {
      if (busy) return;
      const text = (ed.innerText || '').trim();
      if (!text) return toast(lang === 'bm' ? 'Tiada teks untuk disemak.' : 'There is no text to review.', true);

      busy = true;
      currentLang = lang;
      current = [];
      bmBtn.disabled = true;
      enBtn.disabled = true;
      list.innerHTML = '';
      summary.textContent = lang === 'bm' ? 'AI sedang menyemak Bahasa Melayu…' : 'AI is reviewing the English text…';

      try {
        const { data, error } = await sb.functions.invoke('naskhah-ai-assistant', {
          body: {
            action: 'language_review',
            language: lang,
            text,
            project_type: p.project_type || '',
            section: state.activeSection || ''
          }
        });
        if (error) throw error;
        if (!data || data.error) throw new Error(data?.error || 'Language review failed.');
        if (data.language !== lang) throw new Error('Language review response mismatch.');
        current = Array.isArray(data.issues) ? data.issues.filter(i => i && i.original && i.suggestion && i.original !== i.suggestion).slice(0, 50) : [];
        renderIssues();
      } catch (e) {
        summary.textContent = lang === 'bm' ? 'Semakan AI gagal.' : 'AI review failed.';
        toast(e.message || 'AI language review failed.', true);
      } finally {
        busy = false;
        bmBtn.disabled = false;
        enBtn.disabled = false;
      }
    };

    bmBtn.onclick = () => runAIReview('bm');
    enBtn.onclick = () => runAIReview('en');
  };

  Object.defineProperty(window, 'NaskhahLanguageCheckModule', {
    value: Object.freeze({ version:'4.1.0-ai-separate' }),
    writable:false,
    configurable:false,
    enumerable:true
  });
})();
