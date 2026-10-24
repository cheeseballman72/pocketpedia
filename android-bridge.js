// Replaces Electron's preload.js: provides window.e2k for the web code, using Capacitor on Android
// (and plain browser fallbacks, so the app also runs in a desktop browser for testing).
(() => {
  const cap = window.Capacitor || {};
  const plug = (n) => (cap.Plugins && cap.Plugins[n]) || null;
  const html = document.documentElement;
  html.dataset.platform = 'android';
  const fonts = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: 'fonts/fonts.css' });
  document.head.append(fonts);

  // Settings the desktop app kept in its main process.
  const KEY = 'e2k.main';
  const DEFAULTS = { showSplash: true, windowMode: 'default', hardwareAcceleration: true, autoUpdate: false };
  const read = () => { try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') }; } catch { return { ...DEFAULTS }; } };
  const write = (s) => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {} return s; };

  const APP_PAGE = 'app.html';
  // Skip the startup screen straight away if the person turned it off.
  if (html.dataset.page === 'splash' && !read().showSplash) location.replace(APP_PAGE + location.hash);

  let offline = false;
  try { offline = JSON.parse(localStorage.getItem('e2k.offlineMode') || 'false') === true; } catch {}

  const openExternal = async (url) => {
    if (!/^https?:\/\//i.test(url)) return;
    const B = plug('Browser');
    if (B) { try { await B.open({ url }); return; } catch {} }
    window.open(url, '_blank', 'noopener');
  };

  // No offline library on Android (yet): the page sees an empty library and online mode only.
  const libState = { open: null, packs: [], current: null, download: null, missing: null };
  const none = () => Promise.resolve(null);
  const library = {
    info: none, find: none, titles: () => Promise.resolve([]), random: none, daily: none,
    state: () => Promise.resolve(libState), catalog: () => Promise.reject(new Error('unavailable')),
    space: none, download: none, pause: none, cancel: none, remove: none, chooseDir: none, cancelMove: none, openDir: none,
    onUpdate() {}, onConfirmQuit() {}, quit() {},
  };

  window.e2k = {
    platform: 'android',
    systemLocale: navigator.language || '',
    setMenu() {}, onMenu() {},
    win: (cmd) => { if (cmd === 'close') { const A = plug('App'); if (A) A.exitApp(); } },
    openExternal,
    onMaximized() {}, onFullscreen() {},
    splashDone: () => location.replace(APP_PAGE),
    appInfo: () => Promise.resolve({ version: '0.5.0-beta', windows: 'Android' }),
    net: {
      offline: () => offline,
      setOffline: (on) => { offline = !!on; try { localStorage.setItem('e2k.offlineMode', JSON.stringify(offline)); } catch {} },
    },
    library,
    update: { state: () => Promise.resolve({ state: 'none' }), check: () => Promise.resolve({ state: 'none' }), install() {}, onChange() {} },
    printPreview: () => Promise.resolve(window.print && window.print()),
    print: { render: () => Promise.resolve(null), print: () => Promise.resolve(), save: () => Promise.resolve() },
    settings: {
      get: () => Promise.resolve(read()),
      set: (patch = {}) => Promise.resolve(write(patch.reset ? { ...DEFAULTS } : { ...read(), ...patch })),
    },
  };

  // The phone's Back button goes back one page in the app, then leaves the app from the Home screen.
  const App = plug('App');
  if (App && App.addListener) {
    App.addListener('backButton', () => {
      const dlg = document.querySelector('.overlay .dialog, .overlay');
      const esc = () => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      if (dlg) { esc(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); return; }
      const back = document.querySelector('[data-cmd="back"]');
      if (back && !back.disabled) back.click(); else App.exitApp();
    });
  }
})();
