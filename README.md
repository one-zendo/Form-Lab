# FORM Lab

FORM strength-training companion prototype and design system.

## iPhone Duo full-screen test

The `duo-pwa-fullscreen-test` branch adds a lightweight responsive PWA test surface:

- `index.html` — edge-to-edge dashboard, safe-area padding and live viewport diagnostics
- `manifest.webmanifest` — standalone app launch configuration
- `sw.js` — basic offline shell cache
- `icon.svg` — app icon

### Preview

After this branch is merged and GitHub Pages is configured to publish the repository root, open the published site in Safari on iPhone Duo.

For a Home Screen test:
1. Open the published URL in Safari.
2. Tap Share → Add to Home Screen.
3. Enable **Open as Web App** if the option appears.
4. Add it, then launch FORM from its Home Screen icon.
5. Check the live viewport, layout mode and display mode diagnostics while folding, unfolding and rotating.

The page uses `viewport-fit=cover`, dynamic viewport sizing, safe-area environment variables, and responsive layouts. iOS keeps system status indicators; standalone mode removes Safari's browser chrome, not the operating-system status bar.

The dashboard contains illustrative values only. It is a layout/PWA test, not the production workout tracker. Validate actual viewport dimensions and safe areas on the target hardware before treating the provisional layout thresholds as final.

## Design references

See [DESIGN.md](./DESIGN.md), [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md), [PRODUCT.md](./PRODUCT.md), [UX.md](./UX.md), and [WIREFRAMES.md](./WIREFRAMES.md).
