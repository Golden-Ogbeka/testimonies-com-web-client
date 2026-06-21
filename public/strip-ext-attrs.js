(function() {
  var elements = document.querySelectorAll('[bis_skin_checked]');
  for (var i = 0; i < elements.length; i++) {
    elements[i].removeAttribute('bis_skin_checked');
  }
  new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'bis_skin_checked') {
        mutation.target.removeAttribute('bis_skin_checked');
      }
    });
  }).observe(document.documentElement, { attributes: true, subtree: true });
})();
