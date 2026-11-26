# FORM Lab — Engineering notes

## Stable baseline: Build 159
User reported the app working fine after Build 159. This is device feedback, not exhaustive automated or device-matrix certification.
Source checkpoint: 0fc7b37a1a5fd5b8763c714865bc2aa7dff24af5
Branch: checkpoint/build-159-device-confirmed

## Adaptive layout contract
- FP: stacked cards, weekly streak, bottom dock.
- FL: side-by-side cards (40:60 workout/streak), weekly streak, calibrated right rail. Preserve both rotation calibrations and camera/status-area clearance.
- UP: stacked cards, monthly calendar, bottom dock.
- UL: side-by-side cards, monthly calendar, bottom dock.
- Calendar visibility follows layout mode, not content width alone.
- Use shared sizing tokens; keep date markers square with equal width and height.
- Preserve stationary headlines/navigation and viewport-filling landscape dashboards. Check for clipping, safe-area clearance and six-week months.

## Physical hinge and motion
- Use Device Posture and Viewport Segments APIs when available. Book posture uses left/right segments; laptop posture uses top/bottom segments.
- Align cards using actual segment boundaries and dashboard origin, not assumed equal halves.
- Animate physical posture changes only; ordinary rotation remains native and animation-free.
- Folding token 320 ms; unfolding token 460 ms; respect reduced motion.
- Retarget through resize bursts; avoid gray flashes, snapping and competing animations.
- APIs report discrete posture/segments, not continuous hinge angle.

## Interaction and visual identity
- Suppress native WebKit tap highlight; preserve keyboard focus indicators.
- Completed training: orange #FF9500, white check. Completed recovery: blue #0088FF, white moon. Upcoming recovery neutral.
- Preserve shared header typography, date baselines, theme tokens and existing navigation geometry.

## Update and persistence contract
- Source commit is not proof of live deployment. Check published version separately when possible.
- Poll version.json every 30 seconds and on return/focus; use cache-busting and versioned assets.
- Build 159 replaces unconditional active-session/draft reload blocking with save and readback verification.
- Block reload for unreadable storage, failed verification or open dialogs; report the specific reason.
- Older builds retain the old guard and may need the active session finished before upgrading.
- Preserve demo and real storage isolation. Independent rest-timer restoration is not implemented.
- Never delete installed web app or clear storage as a routine update fix.

## Regression checklist before release
- Test FP, both FL orientations, UP, UL, and both supported physical hinge arrangements.
- Verify no navigation drift, camera clipping, rotation animation, gray tap flash or oval dates.
- Test month navigation, six-week months, light/dark themes, reduced motion.
- Test update with active real/demo session and draft, save failure, unreadable storage and open dialog.
- Verify persisted data after reload, not merely successful save.
- Verify JS syntax, run regression suite, check deployment and record actual device results.
- Do not claim unperformed tests. Build 159 had syntax verification and general positive user feedback; full CI/device matrix and independent timer recovery remain unverified.

## Build 160 — conservative consolidation
- Merged duplicate bottom dock root tokens, retaining effective 56px height, 22px icon, 54×40px capsule, 4px padding and offset; preserved calibration.
- Grouped folding/unfolding tokens, preserving 320/460ms and easing curves.
- Named reusable completion check markup; compared all 16 boolean indicator combinations with baseline, identical output.
- App logic identical to Build 159 except build number; CSS outside targeted token blocks identical after whitespace normalization. Corrected stale initial diagnostic build label.
- All 10 local scripts parsed; 21 regression assertions passed in an adapted V8 harness using in-memory filesystem/storage and VM substitutes. Native Node CI and browser/device tests not executed here.
- Deferred broader cascade and component restructuring until visual regression coverage exists. No changes to persistence or hinge algorithms.
