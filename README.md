# FORM Lab

FORM Lab is a static Safari prototype for the FORM strength-training experience on Duo. The current build includes adaptive navigation and diagnostics, demo routines and workout logging, local history, and private Hevy JSON import.

## Develop and verify

Start with [AGENTS.md](AGENTS.md), the [documentation index](docs/README.md), and the [Duo Hardware Standard](docs/DUO-HARDWARE-STANDARD.md). Serve the repository root with `python3 -m http.server 3000 --bind 127.0.0.1` and open `http://localhost:3000`. There is no compilation step.

Use Node 22 for the same checks as Shell quality:

```sh
for file in shell.js foundation/*.js; do node --check "$file" || exit 1; done
node --test tests/*.test.cjs
```

The Training browser integration workflow installs a pinned Playwright version as test tooling:

```sh
npm install --no-save --package-lock=false playwright@1.65.1
npx playwright install --with-deps chromium
node tests/browser/training.cjs
```

The browser suite starts its own temporary HTTP server. On a supported host with Playwright WebKit installed, run it with `FORM_BROWSER=webkit` to exercise the same flows in WebKit.

## Repository guide

- `index.html`, `shell.js`, and `shell.css` compose the application. `foundation/` contains the runtime, including geometry, posture, navigation, training, diagnostics, and the shared design tokens.
- `design/duo/` contains the approved hardware SVGs. `reference/` retains historical excerpts.
- `tests/` contains the active Node and browser suites. Historical design decisions live in `docs/`.

Training starts from sample or imported routines in Demo Mode. Existing routines can be edited, and workouts and preferences are stored on the browser origin. Routine creation, duplication and deletion, an exercise catalog and swapping, a scheduling calendar, and native SwiftUI are outside the current Lab implementation.

GitHub Pages publishes the repository root from `main`. Keep the HTML build metadata, About label, asset query versions and `version.json` synchronized. The Lab checks the version every five seconds while visible and waits for training initialization, unsaved edits, active sessions with unverified storage, and open dialogs before reloading. An already open page can still use local features during a network interruption. Offline launch and installation as a PWA have no dedicated manifest or service worker in this branch.

To roll back an application release, revert its source changes on `main` and publish the restored assets under a build number higher than the faulty release. That releases the fix to open tabs using the same update mechanism. Verify the published version and HTML before calling the rollback complete. Browser storage keys and export files require no changes.
