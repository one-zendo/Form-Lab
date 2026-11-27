# FORM Lab agent instructions
Read docs/README.md and relevant canonical specifications before work. Use design/duo/*.svg directly for hardware previews; never replace with generic rectangles. Hardware, UI and diagnostics are independent. Do not invent calibration or silently resolve conflicts. ONE is visual reference only. Use shared semantic tokens, responsive components, accessibility and offline reliability. Preview requests do not authorize app changes. Verify changes and report untested behavior. Reference extracts are historical, not runnable modules or automatic implementation authority.

## Layout Lab restart

Build 001 uses one grayscale Home composition across Native-sized and Safari-sized viewports. Its CSS responds to usable width, dynamic viewport height and reported safe insets. Orientation detection and calibration remain diagnostic reference data. See docs/layout.md for the active rule and test scope. Build 94-specific compliance checks and design records apply to the archived app.

## Development records
Record user-confirmed device results, approved design decisions, calibration changes, stable milestones and unresolved issues in the relevant existing documentation as they occur. Verify documentation writes. Distinguish user reports from automated and exhaustive device testing. Documentation-only updates do not increment the application build number.

For each application build, keep the HTML form-build meta, visible build label, asset versions and version.json synchronized. Preserve Lab's five-second deployment polling; protect unsaved edits and active workouts before extending automatic reload to stateful pages.

Continue implementing agreed roadmap stages when the user requests progression; do not stop at proposals. Preserve preview-only requests as non-mutating and surface unresolved conflicts or device checks.

## Native-first page design (approved 2026-11-26)
Design and review each page for Native and Safari together across FP, FL1, FL2, UP and UL, including relevant hinge and application states. Native is the primary design target; Safari is the working web test environment. Share semantic tokens, components, content hierarchy and interaction logic; keep hardware exclusions and reference anchors independent of the shared adaptive composition. Do not constrain native designs to Safari's unavailable regions or assume native safe areas are zero. Retrieve approved hardware SVGs and calibration before previews. Record approval and unresolved measurements per page before advancing. Native previews are simulations until validated in SwiftUI on device; Safari viewport-size detection is not native runtime detection. Home is the first page to review. This policy does not authorize changes to existing calibrated geometry.

## Build 19 — design compliance gate
Official Lucide 0.456.0 SVGs and ISC license vendored from upstream; dock inline geometry matches these assets, with FORM stroke token 1.75 and existing 20px dock size preserved provisionally (20/22 conflict unresolved). No external runtime dependency. CI checks dock geometry, icon tokens, build metadata and JS syntax. New icons must be sourced from pinned official assets and added to compliance coverage. Before every commit review canonical design, layout, motion, accessibility and protected shell behavior; document exceptions and run relevant tests. Static checks do not replace visual/device review. CI is not confirmed a required branch protection gate.

## Proportional composition
Follow the mandatory proportional composition principle in docs/design.md. Audit actual component gaps, padding, alignment, available space and dock clearance for every page; use semantic spacing tokens and live measurements, preserve calibrated geometry, and document exceptions and unverified device behavior.
