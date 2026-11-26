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

## Build 161 — FL Home sizing
- User screenshots of both FL rotations on Build 159 showed personal-best footer outside the card and unused bottom space.
- Removed legacy 46px bottom reserve for FL Home only; use 12px clearance plus safe bottom inset once. Allow vertical scroll as a fallback for constrained height or larger text.
- Use intrinsic minimum dashboard/section rows and nonshrinking footer, compact weekly spacing, equal-height stretched cards. Preserve 40:60 columns.
- Source comparison confirms CSS outside FL Home rules and tokens unchanged, including calibrated rail and rotation offsets. App logic unchanged except build number; syntax and new source assertion passed. Actual browser geometry and both device rotations still require verification; full regression suite not rerun.

## Build 162 — FL1 edge-to-edge
- FL1 is right-dominant resolved horizontal safe-area inset; left-dominant is FL2; equal/near-equal is unknown and retains baseline. No guessed angle mapping.
- FL1 Home only: 6px inner left margin, top max(12px,safe top), bottom 8px plus safe inset. Existing horizontal reserve, 40:60 columns and rail calibration unchanged. Diagnostics reports island side.
- All baseline CSS preserved byte-for-byte; JS syntax and five isolated classifier cases passed. Actual Safari safe-area asymmetry, physical geometry, native CI and live deployment unverified. If Safari reports equal insets, optimization intentionally does not activate; inspect diagnostics before adjusting.

## Build 163 — safe-area visualization
Developer settings toggle shows black bars for all four CSS env safe-area insets. Fixed noninteractive overlay, off by default, session-only. Diagnostics reports resolved top/right/bottom/left values. Does not change content or rail geometry. Zero inset produces no bar; browser-excluded screen regions cannot be painted by the app. JS syntax checked; physical device and deployment unverified.

## Build 164 — diagnostics toggle
Added direct Diagnostics button beside headline build label and Close diagnostics on diagnostic page. Both use shared persisted state setter; existing developer checkbox remains. Navigation and safe-area overlay unchanged. JS syntax verified; headline fit and device behavior not tested.

## Build 165 — automatic diagnostic bars
Diagnostics automatically enables existing four-edge safe-area overlay via render state. Closing diagnostics clears manual overlay state; optional developer toggle remains for normal mode. CSS env values adapt to orientation/posture; diagnostics adds rotation angle. Bars represent reported safe-area insets, not a measured touch exclusion map; zero insets and browser-excluded regions cannot be visualized by this method. No layout changes. JS syntax checked; device and deployment unverified.

## Build 166 — isolated viewport lab
Previous diagnostics used calibrated main and nav, so content dimensions were not raw viewport dimensions. Overlay was after startup scripts, risking null lookup when diagnostics persisted. Move overlay and independent measurement section before scripts; hide main/nav during diagnostics, retain normal geometry, use direct env insets, blue viewport border and 20px grid. Report zero insets explicitly, visual offset and safe dimensions. No guessed hardware exclusion. JS syntax verified; device behavior and deployment unverified.

## Build 167 — measured Duo geometry
DUO_REFERENCE.md supplies five measured viewport signatures. Match within 8 CSS px and measured angle; unknown retains existing fallback. FL1=90 left, FL2=270 right; safe insets alone cannot distinguish. Remove obsolete FL1 right-side Home override. Both measured FL layouts use 12px viewport-relative edges, 48px rail and 12px gap, center rail above bottom safe inset; no subtraction of 84px excluded system strip. Existing calibration mode and unmeasured layout fallbacks retained. FP/UP/UL geometry and hinge motion unchanged. JS syntax and seven isolated classifier cases passed; no browser/device or deployment verification.

## Build 168 — adaptive viewport contract
Remove exact measured signatures and tolerance from runtime. Existing broad compact breakpoints and screen ratio heuristic retained (not hardware identification); rotation labels FL1/FL2; both UL rotations supported. Landscape shell uses layout category, shared spacing, live four safe insets, flexible card tracks. Reuse existing overlay for inset reading instead of allocating probe each layout. No physical strip subtraction. Preserve calibration fallback and hinge motion. DUO_REFERENCE.md is regression reference only. JS syntax and ten isolated classifier cases passed; regression test added, full suite/browser/deployment not verified.

## Build 169 — shared layout foundation
Remove old fixed production landscape offsets; retain developer calibration and explicit column rail. Add opt-in .form-page, .form-stack, .form-grid, .form-card with shared tokens and intrinsic responsive tracks. Existing Home and hinge rules remain unchanged. New primitives are not yet migrated into existing pages. Hardware SVG assets and device verification remain pending. JS syntax checked; regression definitions added, full suite not run.

## Build 170 — layout integration
Apply form-page to Home, Workouts and generic pages, form-grid to Home dashboard, form-card to streak and standard workout cards. Shared primitives use :where() specificity and precede specialized rules; container query containment stays Home-only. Consolidate default Home grid track and landscape page inset. Preserve hinge segment calculations, navigation and motion source. Calibration Home inset now zero as in production; developer main calibration retained. JS syntax checked; source regression definitions updated. Browser and physical device verification pending.

## Build 171 — design hardware and layout audit
Five standalone schematic SVGs and measured/reference fixtures added. Runtime CSS unchanged; JS only build number. Audit: screen ratio and compact thresholds remain heuristics, overlapping Home hinge rules remain; no changes pending device verification. Correct malformed escaped adaptive-layout test regex. Ten fixture classifier checks passed, JS syntax passed; full Node suite and device rendering not verified. Hardware camera/radii illustrative, not measured.

## Build 172 — adaptive layout audit
25 existing regression definitions passed in an adapted JavaScript harness (not native Node). Two remaining definitions checked separately. Removed redundant production FL Home padding override; shared shell and existing FL Home clearance both resolve to space-3 plus safe bottom. No hinge, motion, navigation or classifier changes. Device/browser rendering and CI remain unverified. Retain heuristic classification and specialized hinge rules pending device evidence; no speculative cleanup.

## Build 173 — universal component foundation
Share existing workout button and input declarations with low-specificity universal classes, integrate primary actions and fields, add opt-in secondary/icon/heading/numeric variants. Existing layout, hinge, motion and theme rules unchanged. Document component contract and discrepancies between design spec and runtime. JS syntax checked; source regression added. Dialog/menu migration and physical verification pending.

## Build 174 — interaction component foundation
Add opt-in dialog, sheet, menu and selection primitives; classify five existing dialogs as legacy to avoid altering geometry or backdrop. Share page menu grid. No lifecycle, hinge, navigation or motion policy changes. JS syntax checked; regression definition added. New sheet and selection variants not yet used in runtime; device testing pending.
