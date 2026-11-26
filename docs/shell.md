# Stage 1 shell
Uses live CSS viewport and safe-area padding, never subtracts Safari exclusion again. Automatic classification matches recorded full/Safari dimensions within 2 CSS px (heuristic, not physical measurement). FL1 and FL2 have identical dimensions; automatic distinction remains unresolved until device rotation mapping is calibrated. Manual override is provided. Unknown dimensions remain unknown. Posture API availability is reported; no synthetic hinge angle or animation. Ordinary resize is coalesced per frame. Folding motion tokens remain documented for future UI transitions; no moving UI exists yet. Device tests and deployment verification pending.

Build 2: visible build label, versioned assets, ordered deferred scripts, resize/orientation/visibility events and one-second visible-page diagnostic refresh. Build numbering restarts for the clean Lab.

## Device-reported rotation calibration (Build 3)
User observed FL1 = 90 degrees, FL2 = 270 degrees; landscape angles 90/270 and portrait angles 0/180. Use angle only after viewport classification establishes folded landscape. Unavailable angle retains ambiguity; inverted portrait is not a new calibrated hardware orientation. Browser/device verification of updated implementation pending.

## Stable milestone — Build 3, 2026-11-26
User reported the updated orientation detection working perfectly on Duo after testing Build 3. Source checkpoint: f7c83758bdce1015bff6188eb53dd751f5ff69ab. This confirms user-reported operation of the updated rotation detection, not exhaustive safe-area, hinge, browser or automated test certification. Preserve this baseline when implementing Stage 2.

## Build 5 — automatic Lab updates
Poll deployed version.json every five seconds while visible, bypass cache, reload only for a higher integer build, preserve URL parameters and retry on network failure. Check on return to foreground or online. Lab-only behavior; before adding editable or active workout state, gate reload on safe state or persist drafts. Safari may suspend background polling. Initial adoption requires loading Build 5 once. Deployment/device verification pending.
