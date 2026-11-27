# FORM Layout Lab

Build 004 is the grayscale Home wireframe for FORM on Duo. GitHub Pages publishes the root of `main`. [Open Layout Lab](https://one-zendo.github.io/Form-Lab/)

Home uses one adaptive grid with 16 px insets and card padding. Equal card tracks fill the available width and height after safe areas, the headline, navigation and the optional timer. The headline and navigation stay stationary as cards scroll when space is tight. Open Diagnostics and select **Show timer preview** to test the optional region. See the [placement rules](docs/UNIVERSAL-ADAPTIVE-LAYOUT.md#adaptive-navigation). Only Home is active in this build.

Open Diagnostics to view live measurements and hardware references. The orientation labels indicate matches to calibrated viewport sizes. Native-sized browser previews are simulations because the repository has no SwiftUI target. The [Duo Hardware Standard](docs/DUO-HARDWARE-STANDARD.md) records the calibrated values.

## Archive

The complete former application, including its source, assets and tests, is recoverable from `archive/form-build-94` at commit `f61cd026a2a12a45ba6c2cd5a781b28b3a92865c`. Extract the archived tree into a separate directory with `git archive archive/form-build-94`. [Browse the archive](https://github.com/one-zendo/Form-Lab/tree/archive/form-build-94)

Workout data remains on the existing Pages origin. Layout Lab only accesses the diagnostics preference key and only saves it when a setting changes. Open Build 94 tabs stay on their existing build until manually refreshed. Layout Lab polls its own version series every five seconds.

## Develop and verify

Serve the root in one terminal.

```sh
python3 -m http.server 3000 --bind 127.0.0.1
```

Run the static checks and the ten calibrated viewport cases and live rotation sequences in Chromium and WebKit.

```sh
node --test tests/*.test.cjs
npm install --no-save --package-lock=false playwright@1.57.0
npx playwright install --with-deps chromium webkit
node tests/browser/layout.cjs
FORM_BROWSER=webkit node tests/browser/layout.cjs
```
