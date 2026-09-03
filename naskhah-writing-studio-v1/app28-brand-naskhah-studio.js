// Brand refresh: Naskhah Studio
(function(){
  function applyBrand(){
    document.title='Naskhah Studio';
    document.querySelectorAll('.brand span').forEach(el=>{el.textContent='Naskhah Studio'});
    const hero=document.querySelector('.hero');
    if(hero){
      const p=hero.querySelector('p');
      if(p)p.textContent='Workspace penulisan untuk artikel jurnal, tesis, buku dan eBook — dari idea hingga siap diterbitkan.';
    }
    document.querySelectorAll('h1,h2,p,span').forEach(el=>{
      if(el.childElementCount===0){
        el.textContent=el.textContent.replace(/Naskhah Writing Studio/g,'Naskhah Studio');
      }
    });
  }
  document.addEventListener('DOMContentLoaded',applyBrand);
  setTimeout(applyBrand,0);
})();