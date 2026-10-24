# PocketPedia (Android port of Encyclopedia 2000)

The original desktop app's web code, wrapped in an Android app with Capacitor, plus a phone layout.
See `NOTICE.md` for credits, changes and the license (GPL-3.0-or-later).

## Build the APK without a computer setup: GitHub Actions
1. Create a new GitHub repository and upload **everything in this folder** (keep the `.github` folder).
2. Open the repository's **Actions** tab, choose **Build APK**, and tap **Run workflow**.
3. When it finishes, open the run and download the **PocketPedia-debug-apk** artifact. Unzip it and install `app-debug.apk`
   (Android will ask you to allow installing from your browser or Files app).

## Build locally (Node 20+, JDK 17, Android Studio or the Android SDK)
```
npm install
npx cap add android
npm run android:icons     # makes the launcher icons from assets/
npx cap sync android
npm run android:apk       # android/app/build/outputs/apk/debug/app-debug.apk
```
`npx cap open android` opens the project in Android Studio instead.

## Try it in a desktop browser first
`npm run serve`, then open http://localhost:8080 and use your browser's phone-size view.

## Before you share it
- Change `appId` in `capacitor.config.json` (`com.example.pocketpedia`) to your own.
- A debug APK is fine for your own phone. For the Play Store you need a signed release build.
