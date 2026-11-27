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
