# FORM Lab agent instructions
Read docs/README.md and relevant canonical specifications before work. Use design/duo/*.svg directly for hardware previews; never replace with generic rectangles. Hardware, UI and diagnostics are independent. Do not invent calibration or silently resolve conflicts. ONE is visual reference only. Use shared semantic tokens, responsive components, accessibility and offline reliability. Preview requests do not authorize app changes. Verify changes and report untested behavior. Reference extracts are historical, not runnable modules or automatic implementation authority.

## Development records
Record user-confirmed device results, approved design decisions, calibration changes, stable milestones and unresolved issues in the relevant existing documentation as they occur. Verify documentation writes. Distinguish user reports from automated and exhaustive device testing. Documentation-only updates do not increment the application build number.

For each application build, keep the HTML form-build meta, visible build label, asset versions and version.json synchronized. Preserve Lab's five-second deployment polling; protect unsaved edits and active workouts before extending automatic reload to stateful pages.

Continue implementing agreed roadmap stages when the user requests progression; do not stop at proposals. Preserve preview-only requests as non-mutating and surface unresolved conflicts or device checks.

## Native-first page design (approved 2026-11-26)
Design and review each page for Native and Safari together across FP, FL1, FL2, UP and UL, including relevant hinge and application states. Native is the primary design target; Safari is the working web test environment. Share semantic tokens, components, content hierarchy and interaction logic; keep environment-specific layout anchors, exclusions and navigation rules independent. Do not constrain native designs to Safari's unavailable regions or assume native safe areas are zero. Retrieve approved hardware SVGs and calibration before previews. Record approval and unresolved measurements per page before advancing. Native previews are simulations until validated in SwiftUI on device; Safari viewport-size detection is not native runtime detection. Home is the first page to review. This policy does not authorize changes to existing calibrated geometry.
