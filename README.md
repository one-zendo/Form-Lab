# FORM Lab

FORM Lab is a static Safari prototype for the FORM strength-training experience on Duo. Build 82 contains adaptive navigation and diagnostics, demo routines and workout logging, local history, and private Hevy JSON import.

## Develop and verify

Start with [AGENTS.md](AGENTS.md), the [documentation index](docs/README.md), and the [Duo Hardware Standard](docs/DUO-HARDWARE-STANDARD.md). Serve the repository root with `python3 -m http.server 3000` and open `http://localhost:3000`. There is no compilation step.

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

Training currently starts from sample or imported routines in Demo Mode. Routine authoring, a production training data model, and native SwiftUI are future work. The Lab checks `version.json` every five seconds while visible and preserves unsaved edits and sessions whose storage could not be verified.
