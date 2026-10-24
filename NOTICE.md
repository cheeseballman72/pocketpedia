# Notice

PocketPedia is an Android port of **Encyclopedia 2000** by Scott Burton
(https://github.com/sburton0/encyclopedia-2000), used under the GNU General Public License v3.0 or later (see `LICENSE`).
This port is released under the same license, and its complete source is this repository.

Changes from the original:
- The Electron shell (`main.js`, `preload.js`, `updater.js`, `library.js`, `zim-reader.js`, Print Preview) is replaced by
  `www/android-bridge.js`, which provides the same `window.e2k` interface using Capacitor.
- A phone layout (`www/mobile.css`, `www/mobile.js`, `www/splash-mobile.css`).
- The splash page is now `www/index.html` and the main window is `www/app.html`.
- The offline library (Kiwix downloads) and automatic updates are not included.
- Renamed to PocketPedia with a new icon. The original's name and "Book in Bloom" icon are reserved by its author
  (see the original `TRADEMARKS.md`) and are not used here.

Article text comes from Wikipedia under CC BY-SA 4.0; pictures come from Wikimedia Commons under their own licenses.
This app is not affiliated with the Wikimedia Foundation or with the original Encyclopedia 2000 project.
