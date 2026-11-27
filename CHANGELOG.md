# FORM — Historical record

Documentation consolidation: active rules moved to DESIGN.md; superseded specifications removed from active tree, retained below for history only. Runtime unchanged.

## Historical foundation notes (not instructions)

# FORM Foundation 01 — authoritative runtime specification

Supersedes legacy UI layout instructions; retain DUO-HARDWARE-STANDARD.md for physical reference geometry only. Accepted physical test baseline: a44ea48c47ed477a2a33729e3b7fc58ce670ff98. All prior experiments remain in Git history. Active entry point index.html loads only foundation-01.css and foundation-01.js.

Reference full / Safari dimensions: FP 466×678 / 382×678 (right 84); FL1 678×466 / 594×466 (left 84); FL2 678×466 / 594×466 (right 84); UP 669×951 / 669×869 (top 82); UL 951×669 / 867×669 (right 84). These are calibrated targets, not measured physical guarantees. Match live layout viewport within 2 CSS px; folded landscape angle 90/270 distinguishes FL1/FL2, otherwise ambiguous. Native-sized browser is simulation. CSS fixed inset:0 sizes shell; never force reference dimensions or subtract exclusions twice. Raw visual viewport is diagnostic only.

Navigation right in FL1/FL2 and FP Native-sized; bottom otherwise. One adaptive grid; equal flexible cards, nominal minimum width 15rem and height 8rem; content scrolls when needed. Timer preview below cards, optional, minimum 48px. Shared spacing 4/8/12/16/24/32; 16 outer and card padding, 16 headline-to-content, 4 headline/tagline and nav items, 8 card internals, 12 component gaps. Safe areas take priority. Folded camera centers (418,48), (48,48), (630,418), radius 18.5 with provisional 4 clearance; local avoidance only. Unfolded camera unresolved.

Diagnostics read rendered geometry, raw layout and visual viewport, CSS probe and offsets; overlays do not size shell. Colors blue/purple cards, amber timer, green navigation; default on, toggle independently. Preserve existing diagnostic storage key and workout data. Minimal two-card test surface only; no actual countdown or workout functionality.

Acceptance pending: ten viewport cases, rotation including UP→UL without refresh, timer on/off, overflow, camera clearance, diagnostics, physical Duo Safari. Build 03 was reported good by the user; clean reset still requires regression testing. Native implementation not present.

Build 03 system retained byte-for-byte: 120 ms profile stabilization, reusable diagnostic overlays, safe-area-sensitive alignment, camera avoidance only for Native-sized folded profiles. Visible build identifier and manifest reset together.

Build 02: portrait viewport stacks cards in one column; landscape retains adaptive minimum-width grid. Device Posture API folded signal is reported when available; continuous does not prove physical unfolding, so calibrated viewport inference remains the fallback. Unknown profiles remain unknown. Posture is diagnostic only; CSS controls card layout. No physical hinge angle is exposed or fabricated.

Build 03 supersedes diagnostic-only posture: a folded Device Posture API or CSS media signal activates split cards. Segment axis takes precedence; otherwise UP/UL reference axis is used without claiming exact boundary. Folded cover profiles retain normal layout absent segments. Segment CSS uses reported boundaries; physical validation pending. No hinge angle is inferred.

Build 03 physical acceptance: user reported hinge detection confirmed on Duo, 2026-11-27; exact sensor source and boundary accuracy not independently verified.
Build 04: 240 ms transform-only card transitions after settled layout changes; reduced motion disables animation. Reported split geometry snaps to avoid crossing the fold. Existing layout and hardware rules unchanged. Physical motion and browser regression pending.

Build 04 physical acceptance: user reported adaptive motion working on Duo, 2026-11-27.
Build 05: diagnostic card count 1–4, default 2; normal portrait stacks, normal landscape uses up to two columns with existing 15rem minimum. Equal flexible rows, scroll when needed. Split vertical uses two columns; split horizontal uses two rows and two columns for 3–4 cards. A single card occupies one pane in split mode. Three cards leave an empty grid cell rather than spanning a fold. Card count is a temporary test control, not workout data. Physical validation pending.

Build 05 physical acceptance: user reported universal card system working on Duo, 2026-11-27.
Build 06: system safe-area insets separated from 16px design margin; Safari reference exclusions never subtracted twice. Segment origin refreshed after navigation and camera alignment; minimum 12px fold gap centered around reported boundary when smaller than design gap. Diagnostics report system insets, reference exclusion and camera overlap warnings (not proof of clearance). Existing camera calibration unchanged; unfolded camera and actual native safe areas unresolved. Physical and browser validation pending.

Build 06 physical acceptance: user reported safe-area build looking good on Duo, 2026-11-27.
Build 07: shared navigation placement resolver preserves FP Native right, FP Safari bottom, FL1/FL2 both right, UP/UL both bottom, ambiguous FL right and unknown bottom. Dock remains in its own grid track, 80px rail / 332px maximum bottom width, 44px minimum button height. Four selectable wireframe destinations preserve selection through rotation and posture changes; no actual page routing or workout functionality. Selection is session-only. Diagnostics report placement, dock size and selection. Physical and browser validation pending.

Build 07 physical acceptance: user reported navigation working on Duo, 2026-11-27.
Build 08: optional keyboard test field in Card 01, 16px input text, focus-aware visual viewport accommodation. A 100 CSS px height reduction at approximately unit zoom is an inference, not a keyboard API. During detected occlusion the shell fits the visible viewport, dock/timer temporarily hide, card scroll remains available, and focus is brought into view. On dismissal original layout returns. Test input is session-only. Layout-resizing or floating keyboards may not expose detectable occlusion; physical validation pending.

Build 08 physical review: FP Safari keyboard hides navigation and restores layout, but input overflowed Card 01 and diagnostic guides were offset. Build 09 is a corrective keyboard build, not final diagnostics acceptance. Intrinsic editing card height takes priority; guides use measured overlay origin, clip to visible card bounds and omit hidden elements. Safe-area guides use actual shell coordinates. Exact Safari overlay behavior and horizontal split editing require physical retest.

Build 10: user approved stable card geometry during keyboard editing. Snapshot resolved grid tracks before keyboard accommodation; retain rail width, hide dock/timer, clip and scroll cards to expose focused field, restore pre-edit scroll on dismissal. No persistence of test text. Rotation during editing retains captured tracks until dismissal; cross-orientation editing needs physical validation. Build 09 superseded as keyboard correction, foundation lock not yet reached.

Build 11: focus scroll waits 100ms after latest visual viewport change and smoothly targets 16 CSS px above visible editing boundary where possible. Reduced motion snaps; dismissal smoothly restores previous scroll. Physical timing and rotation pending.

Build 12: prefer browser focus scrolling; use visual viewport and next animation frame to check visibility, native scrollIntoView nearest only if obscured. Remove fixed delay and forced bottom positioning. Preserve editing tracks and restore previous scroll. Safari physical validation pending.

Build 13: user physically accepted Build 12 keyboard behavior. Diagnostics distinguish rendered shell from visual editing area, report hidden navigation/timer accurately, exclude hidden elements from camera overlap checks, update guides during card motion, and hide the indicator while typing. Overlay is noninteractive and paint-contained. No layout or keyboard logic changes. Final regression and physical verification pending.

Build 14: user accepted Build 13 diagnostics. FL1 only (both environments): remove 16 CSS px left design inset, retain system safe inset and localized camera avoidance. Other orientations and ambiguous FL fallback unchanged. Physical verification pending.

Build 15: restrict flush-left to FL1 Safari-sized. Apply margin from observed viewport and rotation before the 120ms committed orientation stabilization; retain system safe inset. Native FL1 and other profiles retain 16px design inset. Physical transition timing pending.

Build 16: user physically accepted Build 15. QA correction only: isolate classify from browser-dependent matchMedia initialization in Node tests; browser card layout assertion uses actual available grid width (two 240px tracks plus 12px gap), not outer viewport width. Runtime JS/CSS unchanged. Automated results pending; do not lock until verified.


## Historical hardware notes (not instructions)

# FORM — Duo Hardware Geometry Standard

User-approved design reference, 2026-11-26. Use this reference for all previews, diagnostics and future layout implementation. Values are design calibration targets, not independently verified hardware measurements.

| Orientation | Full screen (pt) | Safari excluded edge | Exclusion (pt) | Safari drawable (pt) | Headline X | Native headline center Y | Native content X | Safari content X |
|---|---|---|---|---|---|---|---|---|
| FP | 466 × 678 | Right | 84 | 382 × 678 | 16 | 48 | 16 | 16 |
| FL1 | 678 × 466 | Left | 84 | 594 × 466 | 84 | 48 | 29.5 | 84 |
| FL2 | 678 × 466 | Right | 84 | 594 × 466 | 16 | 48 | 16 | 16 |
| UP | 669 × 951 | Top | 82 | 669 × 869 | 16 | 48 | 16 | 16 |
| UL | 951 × 669 | Right | 84 | 867 × 669 | 16 | 48 | 16 | 16 |

Native previews reclaim the Safari exclusion area; actual native safe areas require verification. UP Safari headline center Y is provisionally 130 physical pt (82 + 48). UL headline calibration remains provisional. Do not infer exclusion direction from another orientation.

## Hardware and layout
- Silver-gray chassis, no black border or bezel, asymmetric folded silhouette, circular camera (never pill). FP hinge left, curved right; FL1 hinge bottom, curved top, camera top left; FL2 hinge top, curved bottom, camera bottom right.
- Simulated camera centers FP (418,48), FL1 (48,48), FL2 (630,418), radius 18.5 pt; unfolded camera geometry unverified.
- FL1 native content aligns with LEFT camera perimeter (48 − 18.5 = 29.5 pt), not center or right edge. Greeting and cards share anchor. Safari content hits left exclusion boundary at 84 pt. Headline independent at X84, Y48.
- FL2 content starts at 16 pt; native date/cards/nav expand into reclaimed right area. Avoid camera. Folded landscape navigation right, portrait navigation bottom. Preserve existing adaptive navigation behavior elsewhere.
- Headline shared across primary pages: 28 pt, weight 700, 44 pt container, blue signature 3 × 32 pt, gap 10.5 pt. Fixed orientation-specific anchors; tagline relative to wordmark. Date aligned with content right edge subject to camera clearance.
- Landscape cards responsive 40:60 with 12 pt gap; no hardcoded card widths. Keep hardware geometry separate from responsive UI.
- Diagnostics: orange camera perimeter, purple center axes/headline, green content boundaries, blue Safari exclusion boundary (dashed in native). Toggle guides and native/Safari preview. Compact collapsed control. Avoid rotation snap or flash.

This document records design decisions only; it does not claim runtime implementation or device verification. Update this reference when user approves a calibration change.

## ChatGPT inline preview standard v1.0
Use the five canonical SVGs in design/duo for all Duo previews. Default to compact intelligent inline previews, not generated images. Preserve physical scale across orientations; never resize one orientation independently. Hardware is fixed, responsive UI is clipped to screen-clip, and diagnostics are optional independent overlays. Use native and Safari modes separately; never subtract Safari exclusions twice. No generic phone or tablet frames. UP fold vertical, UL fold horizontal. Preserve FORM design and motion tokens. Do not invent missing geometry or calibration; disclose approximations. This standard supersedes all earlier preview appearance rules. Folded corner radii 8 pt hinge / 59 pt outer, unfolded 28 pt provisional; camera centers and inner geometry remain provisional. Chassis stroke is schematic. Default SVGs show clean native display; enable Safari exclusion and diagnostic groups only when requested.

## Device-reported rotation calibration (Build 3)
User observed FL1 = 90 degrees, FL2 = 270 degrees; landscape angles 90/270 and portrait angles 0/180. Use angle only after viewport classification establishes folded landscape. Unavailable angle retains ambiguity; inverted portrait is not a new calibrated hardware orientation. Browser/device verification of updated implementation pending.

## Build 16 — approved FP headline refinement
FP Native and Safari target: leading signature X16 pt, signature top Y16 pt, center Y32 pt, signature height32 pt; headline moves up16 pt independently of content flow. Other orientations retain prior anchors. Build label follows shared headline, derived from build metadata. User approved visual proposal; device validation pending. Native is a reference target, not a verified SwiftUI layout.

Build 17: user reverted FP center to Y48, signature top32, X16, aligned with camera center. Supersedes Build16 FP Y32. Tagline FP visual top moved up6 CSS px without moving cards; exact 8pt glyph gap requires device verification. Diagnostics simplified to icon-free settings rows and switches, separate Measurements/Calibration/Device information views. Native reference selector only inside Measurements. Experimental headline offsets ±24 CSS px, 0.5 increments, saved per detected orientation and viewport mode; manual/unmatched calibration disabled. Native runtime not implemented. No physical geometry changes.

## Build 81 — calibration resolver corrections
The web calibration resolver now keeps headline anchors independent from Safari drawable exclusions. FL1 headline X remains 84 in both modes; native content X is 29.5 and Safari content X is 84. UP Safari headline center Y is 130 (82 pt top exclusion + 48 pt offset), while content center remains 48. Unmatched viewport mode uses a generic 16 pt X / 48 pt center fallback and is reported unverified. Added orientation regression tests for these targets. Browser/device geometry remains reference-calibrated, not independently measured.

## Build 17
Initial functional web tracker: routines, exercise library/custom exercises, sets, active workout resume, rest timer, history, progress totals and records, local persistence/export. Retains approved layout runtime with test-only controls removed. No native integration, advanced set types, unit switching or import yet. QA and physical validation pending.
