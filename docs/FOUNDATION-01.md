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
