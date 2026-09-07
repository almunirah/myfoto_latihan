/* Naskhah Studio — Phase 4A BM + English Language Check
 * Local, privacy-preserving writing assistance. No manuscript text leaves the browser.
 */
(() => {
  'use strict';

  const bmCommon = new Set(['yang','dan','untuk','dengan','dalam','adalah','ini','itu','pada','daripada','kepada','oleh','sebagai','atau','tidak','akan','telah','boleh','juga','kajian','penulisan']);
  const enCommon = new Set(['the','and','for','with','in','is','this','that','on','from','to','by','as','or','not','will','has','can','also','study','writing']);

  const simpleRules = {
    bm: [
      {pattern:/\bianya\b/gi,replacement:'ia',message:'Gunakan “ia” untuk bentuk yang lebih standard.',category:'Bahasa Melayu'},
      {pattern:/\bdiantara\b/gi,replacement:'di antara',message:'“di antara” ditulis terpisah apabila menunjukkan tempat/kedudukan.',category:'Bahasa Melayu'},
      {pattern:/\bdimana\b/gi,replacement:'di mana',message:'“di mana” ditulis terpisah.',category:'Bahasa Melayu'},
      {pattern:/\bwalaubagaimanapun\b/gi,replacement:'walau bagaimanapun',message:'Frasa ini lazimnya ditulis terpisah.',category:'Bahasa Melayu'},
      {pattern:/\bsamada\b/gi,replacement:'sama ada',message:'“sama ada” ditulis sebagai dua perkataan.',category:'Bahasa Melayu'},
      {pattern:/\bkeretapi\b/gi,replacement:'kereta api',message:'Ejaan baku ialah “kereta api”.',category:'Bahasa Melayu'},
      {pattern:/\bmerbahaya\b/gi,replacement:'berbahaya',message:'Bentuk baku ialah “berbahaya”.',category:'Bahasa Melayu'},
      {pattern:/\bperabut\b/gi,replacement:'perabot',message:'Ejaan baku ialah “perabot”.',category:'Bahasa Melayu'}
    ],
    en: [
      {pattern:/\balot\b/gi,replacement:'a lot',message:'Use “a lot” as two words.',category:'English'},
      {pattern:/\brecieve\b/gi,replacement:'receive',message:'Correct spelling: “receive”.',category:'English'},
      {pattern:/\bdefinately\b/gi,replacement:'definitely',message:'Correct spelling: “definitely”.',category:'English'},
      {pattern:/\bseperate\b/gi,replacement:'separate',message:'Correct spelling: “separate”.',category:'English'},
      {pattern:/\boccured\b/gi,replacement:'occurred',message:'Correct spelling: “occurred”.',category:'English'},
      {pattern:/\bwich\b/gi,replacement:'which',message:'Correct spelling: “which”.',category:'English'},
      {pattern:/\bteh\b/gi,replacement:'the',message:'Possible typo: “the”.',category:'English'},
      {pattern:/\bdependant\b/gi,replacement:'dependent',message:'For the adjective, use “dependent”.',category:'English'}
    ]
  };

  const words = text => String(text||'').toLowerCase().match(/[a-zA-ZÀ-ÿ]+/g) || [];

  function detectLanguage(text) {
    let bm = 0, en = 0;
    words(text).forEach(w => { if (bmCommon.has(w)) bm++; if (enCommon.has(w)) en++; });
    if (bm >= 2 && en >= 2) return 'mixed';
    if (bm > en) return 'bm';
    if (en > bm) return 'en';
    return 'unknown';
  }

  function collectRuleIssues(text, lang) {
    const issues = [];
    const rules = lang === 'bm' ? simpleRules.bm : lang === 'en' ? simpleRules.en : [...simpleRules.bm,...simpleRules.en];
    rules.forEach(rule => {
      rule.pattern.lastIndex = 0;
      let m;
      while ((m = rule.pattern.exec(text)) && issues.length < 60) {
        issues.push({
          id: crypto.randomUUID(),
          category: rule.category,
          message: rule.message,
          original: m[0],
          replacement: rule.replacement,
          index: m.index
        });
        if (!m[0].length) rule.pattern.lastIndex++;
      }
    });
    return issues;
  }

  function check(text, requested='auto') {
    text = String(text||'');
    const detected = detectLanguage(text);
    const lang = requested === 'auto' ? (detected === 'bm' ? 'bm' : detected === 'en' ? 'en' : 'both') : requested;
    const issues = collectRuleIssues(text, lang);

    const repeated = /\b([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ'-]*)\s+\1\b/gi;
    let m;
    while ((m = repeated.exec(text)) && issues.length < 60) {
      issues.push({id:crypto.randomUUID(),category:'Pengulangan / Repetition',message:'Perkataan yang sama muncul dua kali berturut-turut.',original:m[0],replacement:m[1],index:m.index});
    }

    const doubleSpace = / {2,}/g;
    while ((m = doubleSpace.exec(text)) && issues.length < 60) {
      issues.push({id:crypto.randomUUID(),category:'Spacing',message:'Terdapat ruang berganda.',original:m[0],replacement:' ',index:m.index});
    }

    const beforePunct = /\s+([,.;!?])/g;
    while ((m = beforePunct.exec(text)) && issues.length < 60) {
      issues.push({id:crypto.randomUUID(),category:'Tanda baca / Punctuation',message:'Buang ruang sebelum tanda baca.',original:m[0],replacement:m[1],index:m.index});
    }

    const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
    sentences.forEach(sentence => {
      const wc = words(sentence).length;
      if (wc > 35 && issues.length < 60) {
        issues.push({id:crypto.randomUUID(),category:'Gaya / Style',message:`Ayat ini agak panjang (${wc} perkataan). Pertimbangkan untuk pecahkan kepada dua ayat.`,original:sentence.slice(0,120)+(sentence.length>120?'…':''),replacement:null,index:text.indexOf(sentence)});
      }
    });

    if (detected === 'mixed') {
      issues.unshift({id:crypto.randomUUID(),category:'Bahasa bercampur / Mixed language',message:'Bahagian ini mengandungi petunjuk Bahasa Melayu dan English. Pastikan percampuran bahasa memang disengajakan.',original:'BM + English',replacement:null,index:0});
    }

    issues.sort((a,b)=>a.index-b.index);
    return {detected, issues};
  }

  function replaceFirstTextNode(root, original, replacement) {
    if (!root || !original || replacement == null) return false;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const needle = String(original);
    let node;
    while ((node = walker.nextNode())) {
      const idx = node.nodeValue.toLowerCase().indexOf(needle.toLowerCase());
      if (idx >= 0) {
        node.nodeValue = node.nodeValue.slice(0,idx) + replacement + node.nodeValue.slice(idx+needle.length);
        return true;
      }
    }
    return false;
  }

  function issueHtml(issue, i) {
    const replacement = issue.replacement == null ? '' : `<div style="margin-top:6px"><small class="muted">Cadangan / Suggestion</small><div><b>${esc(issue.replacement)}</b></div></div>`;
    const apply = issue.replacement == null ? '' : `<button class="btn small primary" data-lang-apply="${i}">Apply</button>`;
    return `<div style="padding:10px 0;border-bottom:1px solid #e5e7eb"><div class="type-pill" style="display:inline-block;margin-bottom:6px">${esc(issue.category)}</div><div style="font-size:13px">${esc(issue.message)}</div><div style="margin-top:6px"><small class="muted">Dikesan / Found</small><div>${esc(issue.original)}</div></div>${replacement}<div class="actions" style="margin-top:8px">${apply}<button class="btn small" data-lang-ignore="${i}">Ignore</button></div></div>`;
  }

  const oldWritingView = writingView;
  writingView = (p) => {
    let html = oldWritingView(p);
    html = html.replace('<button id="insertTable">▦ Table</button>', '<button id="languageCheck">✓ Semak Bahasa</button><button id="insertTable">▦ Table</button>');
    html = html.replace('</aside></div>', '<div id="languagePanel" style="margin-top:16px;border-top:1px solid #e5e7eb;padding-top:14px"><h3 style="margin:0 0 8px">Semak Bahasa</h3><select id="languageMode" style="width:100%;margin-bottom:8px"><option value="auto">Auto BM + English</option><option value="bm">Bahasa Melayu</option><option value="en">English</option><option value="both">BM + English</option></select><div id="languageSummary" class="muted" style="font-size:12px">Tekan “Semak Bahasa” untuk semakan bahagian semasa.</div><div id="languageIssues"></div></div></aside></div>');
    return html;
  };

  const oldBindWriter = bindWriter;
  bindWriter = (p) => {
    oldBindWriter(p);
    const ed = $('#editor');
    const checkBtn = $('#languageCheck');
    const mode = $('#languageMode');
    const summary = $('#languageSummary');
    const list = $('#languageIssues');
    if (!ed || !checkBtn || !mode || !summary || !list) return;

    let current = [];

    const runCheck = () => {
      const text = ed.innerText || '';
      if (!text.trim()) {
        current = [];
        summary.textContent = 'Tiada teks untuk disemak.';
        list.innerHTML = '';
        return;
      }
      const result = check(text, mode.value);
      current = result.issues;
      const langLabel = result.detected === 'bm' ? 'Bahasa Melayu' : result.detected === 'en' ? 'English' : result.detected === 'mixed' ? 'BM + English' : 'Tidak pasti';
      summary.textContent = `${current.length} isu/cadangan · Bahasa dikesan: ${langLabel}`;
      list.innerHTML = current.length ? current.map(issueHtml).join('') : '<div style="padding:12px 0"><b>✓ Tiada isu asas dikesan.</b></div>';

      $$('[data-lang-apply]').forEach(btn => btn.onclick = () => {
        const issue = current[Number(btn.dataset.langApply)];
        if (!issue) return;
        const changed = replaceFirstTextNode(ed, issue.original, issue.replacement);
        if (changed) {
          ed.dispatchEvent(new Event('input',{bubbles:true}));
          toast('Cadangan digunakan.');
          runCheck();
        } else {
          toast('Teks telah berubah. Jalankan semakan semula.', true);
        }
      });
      $$('[data-lang-ignore]').forEach(btn => btn.onclick = () => {
        current.splice(Number(btn.dataset.langIgnore),1);
        summary.textContent = `${current.length} isu/cadangan masih dipaparkan.`;
        list.innerHTML = current.length ? current.map(issueHtml).join('') : '<div style="padding:12px 0"><b>✓ Semua cadangan telah disemak.</b></div>';
        $$('[data-lang-apply]').forEach(b => b.onclick = runCheck);
        $$('[data-lang-ignore]').forEach(b => b.onclick = runCheck);
      });
    };

    checkBtn.onclick = runCheck;
    mode.onchange = runCheck;
  };

  Object.defineProperty(window, 'NaskhahLanguageCheckModule', {
    value: Object.freeze({ version:'4.0.0-a1', check, detectLanguage }),
    writable:false,
    configurable:false,
    enumerable:true
  });
})();
