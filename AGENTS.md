# FORM Lab agent instructions
Read docs/README.md and relevant canonical specifications before work. Use design/duo/*.svg directly for hardware previews; never replace with generic rectangles. Hardware, UI and diagnostics are independent. Do not invent calibration or silently resolve conflicts. ONE is visual reference only. Use shared semantic tokens, responsive components, accessibility and offline reliability. Preview requests do not authorize app changes. Verify changes and report untested behavior. Reference extracts are historical, not runnable modules or automatic implementation authority.

## Development records
Record user-confirmed device results, approved design decisions, calibration changes, stable milestones and unresolved issues in the relevant existing documentation as they occur. Verify documentation writes. Distinguish user reports from automated and exhaustive device testing. Documentation-only updates do not increment the application build number.

For each application build, keep the HTML form-build meta, visible build label, asset versions and version.json synchronized. Preserve Lab's five-second deployment polling; protect unsaved edits and active workouts before extending automatic reload to stateful pages.
