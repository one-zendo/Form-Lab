# FORM Lab changelog
## Reset stage
Retired Build 08 runtime and obsolete tests. Previous changelog and source remain at 464abb0ff44695d39c834a46918160a439d6e26f. Preserved design authority, hardware assets and user storage. Static reset page only; diagnostic implementation and physical acceptance pending. Quality workflow temporarily checks reset integrity, not app behavior.

## Documentation cleanup
Clarified diagnostic versus future product scope and stage-specific testing. Retained hardware references, approved layout ownership, visual tokens, navigation, timer, zoom and diagnostics policies. No runtime changes.

## Diagnostic Build 01
Initial single-page diagnostic runtime, sample controls, deadline timer, anchored navigation, explicit profiles, raw posture reporting and observational overlay. Unknown viewport fallback is uncalibrated. No storage writes. Automated checks queued; physical zoom, camera, native and hinge calibration pending. Test coverage is initial, not full acceptance.

## Diagnostic Build 02
Approved arrangement-preserving hinge rule. UP horizontal content separation with provisional midpoint when compatible segment data is unavailable; explicit diagnostic posture simulation. UL remains stacked until a side-by-side arrangement is approved. Timer/navigation unchanged. Added unit and browser assertions; physical posture and spacing unverified.

## Diagnostic Build 03
Enabled arrangement-preserving posture adjustment in all five current stacked profiles, both viewport environments. Unknown profiles remain uncalibrated. Added all-profile posture assertions. Provisional midpoint and minimum 12 CSS px additional spacing are diagnostic design choices, not measured hinge geometry. Future side-by-side layouts are specified but not implemented. Physical validation pending.

## Diagnostic Build 04
Three-second foreground deployment polling, versioned assets, matching HTML verification and guarded reload. Changed editable fields defer automatic reload until manual refresh; no user storage writes. Browser timing and deployment remain unverified.

## Diagnostic Build 05
Added side-by-side test pair and adaptive dimensions and gaps for both pairs across all profiles. Preserves shared padding, anchored controls and existing interaction state. Provisional minimum sizes and gaps; binary posture transitions, not continuous angle tracking. Added regression assertions; deployment and physical verification pending.

## Diagnostic Build 06
Four functional pages: Home, Workouts, Profile, Diagnostic. Global master and individual overlay toggles, posture simulation and measurements moved to Diagnostic. Timer remains visible globally for testing; session state retained across page navigation. Home card pairs adjust only while visible. No new persistent storage. Exact physical hinge alignment remains unresolved. Tests updated; verification pending.

## Diagnostic Build 07
Removed automatic midpoint fallback; matching segment axis and local fit required. Constant stacked pair target height prevents indirect displacement of cards 03/04. Flat side-by-side tracks use equal fractions. Explicit simulation retains labeled midpoint. Physical hinge guides fixed to viewport. Regression assertions revised for local-fit behavior; verification pending.

## Diagnostic Build 08
Added independent orange camera center-axis guides, default on under master guides. Uses existing camera reference and Safari offset; unknown camera omitted, offscreen axes clipped. No layout changes. Verification pending.

## Diagnostic Build 09
Navigation timer visibility toggle, default visible, countdown continues hidden. Release timer-only scroll clearance; bottom dock maximum 360px. Regression added; verification pending.
