// Phone-only behavior that sits on top of the desktop code. Loaded after library-ui.js, before app.js.
(() => {
  // The offline library needs Kiwix downloads and file access, which aren't built for Android yet.
  if (window.E2KLibrary) {
    window.E2KLibrary.open = (api) => api.dialog('PocketPedia', 'The offline library isn’t available on Android yet',
      ['Articles and pictures load live from Wikipedia while you’re online.'], [['OK', null, true]]);
  }

  // Each page's side rail (contents, related articles) opens from a button instead of taking half the screen.
  const view = document.getElementById('view');
  function addToggles() {
    view.querySelectorAll('.page:not([data-rt])').forEach((pg) => {
      pg.dataset.rt = '1';
      const b = document.createElement('button');
      b.className = 'rail-toggle'; b.setAttribute('aria-label', 'Contents and related'); b.textContent = '\u2630';
      b.addEventListener('click', (e) => { e.stopPropagation(); pg.classList.add('rail-open'); });
      pg.append(b);
      pg.addEventListener('click', (e) => {
        if (!pg.classList.contains('rail-open')) return;
        const inRail = e.target.closest('.rail') && e.target.closest('.lnk, a, button');
        setTimeout(() => pg.classList.remove('rail-open'), inRail ? 60 : 0);
      });
    });
  }
  if (view) { new MutationObserver(addToggles).observe(view, { childList: true, subtree: true }); addToggles(); }
})();
