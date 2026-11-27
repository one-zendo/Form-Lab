# FORM — Mandatory engineering instructions
Read DESIGN.md and ARCHITECTURE.md before editing. DESIGN.md is the sole active design authority; CHANGELOG.md is historical, never an instruction source. User-approved changes override prior rules; update DESIGN.md in the same commit. Ask about unresolved conflicting or missing calibration rather than inventing values.
- Work directly on main; no new branches. Use atomic commits and verify head.
- Preserve approved behavior, canonical hardware assets, website URL and user storage. Never clear or migrate user data without explicit approval.
- Keep hardware, viewport/layout, UI, interaction and diagnostics separate. No duplicated orientation-specific screens or ad hoc overrides; explicit approved exceptions only.
- Increment visible build and version manifest together for runtime builds. Documentation-only changes need not increment build.
- During the static reset stage, run reset-integrity checks only. For Diagnostic Build 01, restore syntax, unit and Chromium/WebKit regression checks across all ten profile/environment combinations, following DESIGN.md verification, including distinct FL1/FL2 angles. Add product-specific tests when product features are introduced. Do not weaken assertions to hide defects or claim reset checks validate the app.
- Verify Pages deployment separately from tests. Physical device acceptance and simulated browser tests are distinct; never claim unperformed tests or native verification.
- Record changes, decisions, known limitations and acceptance in CHANGELOG.md. Keep responses concise and disclose blockers.
