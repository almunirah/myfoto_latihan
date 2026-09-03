// V1.5 — Normalize journal article writing-zone order for old and new projects
const ARTICLE_ORDER=['Abstract','Keywords','Introduction','Literature Review','Methodology','Results and Discussion','Conclusion','Acknowledgement','References'];
function normalizeArticleProject(p){
  if(!p||p.project_type!=='article')return p;
  const src=p.content||{};
  const mergedRD=(src['Results and Discussion']??'') || [src['Results']||'',src['Discussion']||''].filter(Boolean).join('<p></p>');
  const next={};
  ARTICLE_ORDER.forEach(k=>{
    if(k==='Results and Discussion')next[k]=mergedRD;
    else next[k]=src[k]??'';
  });
  // Preserve any extra custom sections after the standard structure.
  Object.keys(src).forEach(k=>{if(!ARTICLE_ORDER.includes(k)&&!['Results','Discussion'].includes(k))next[k]=src[k]});
  p.content=next;
  const byTitle=new Map((p.outline||[]).map(x=>[x.title,x]));
  p.outline=ARTICLE_ORDER.filter(k=>!['Keywords','References'].includes(k)).map((title,i)=>byTitle.get(title)||({id:crypto.randomUUID(),title,notes:'',target_words:Math.round((p.target_words||8000)/7),status:'not_started',children:[],order:i}));
  p.outline.forEach((x,i)=>x.order=i);
  return p;
}
const _v15LoadProjects=loadProjects;
loadProjects=async function(){await _v15LoadProjects();state.projects.forEach(normalizeArticleProject)};
const _v15OpenProject=openProject;
openProject=function(id){const p=state.projects.find(x=>x.id===id);if(p)normalizeArticleProject(p);return _v15OpenProject(id)};
const _v15WritingView=writingView;
writingView=function(p){normalizeArticleProject(p);return _v15WritingView(p)};
const _v15SaveProject=saveProject;
saveProject=async function(){if(state.current)normalizeArticleProject(state.current);return _v15SaveProject()};
