// Remove Google Sign-In from public login
(function(){
  function removeGoogle(){
    document.querySelector('#googleSignIn')?.remove();
    document.querySelectorAll('.auth-divider').forEach(el=>el.remove());
    localStorage.removeItem('naskhah_google_attempt');
  }
  document.addEventListener('DOMContentLoaded',removeGoogle);
  const obs=new MutationObserver(removeGoogle);obs.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(removeGoogle,0);
})();