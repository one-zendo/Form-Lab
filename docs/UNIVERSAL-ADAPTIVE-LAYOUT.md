# FORM — Universal Adaptive Layout

Approved design direction, 2026-11-27. Supersedes independent orientation/environment interface compositions in the restart handoff. Updated for Layout Lab Build 002.

## Architecture
- Retain detection of FP, FL1, FL2, UP, UL and Native/Safari environment. Preserve canonical hardware geometry and calibration.
- Resolve live usable viewport, origin, system safe areas and localized obstructions before layout. Never subtract browser exclusions twice. UI components do not know about dead strips or orientation-specific offsets.
- One shared adaptive layout system driven by available width, height and local safe bounds, not orientation labels. Native and web may use separate platform implementations with shared design rules.
- Shared headline, typography, padding, content-driven cards, responsive columns, navigation centered within its safe region, stationary navigation and one content scroll owner.

## Adaptive navigation

| Profile | Native-sized | Safari-sized |
|---|---|---|
| FP | Right rail | Bottom dock |
| FL1 | Right rail | Right rail |
| FL2 | Right rail | Right rail |
| UP | Bottom dock | Bottom dock |
| UL | Bottom dock | Bottom dock |

Use one navigation component with horizontal and vertical arrangements. Reserve its grid track before sizing the content columns. Center the rail vertically or the bottom dock horizontally within its available safe region. The headline and dock remain stationary while the content region scrolls. An ambiguous FL1 / FL2 match uses the shared right rail. Unmatched viewports use the bottom dock.

## Safari reference calibration (pt)
| Orientation | Full | Excluded | Drawable |
|---|---|---|---|
| FP | 466×678 | right 84 | 382×678 |
| FL1 | 678×466 | left 84 | 594×466 |
| FL2 | 678×466 | right 84 | 594×466 |
| UP | 669×951 | top 82 | 669×869 |
| UL | 951×669 | right 84 | 867×669 |
FL1 and FL2 share identical drawable dimensions and relative layout; only physical origin differs. Reference targets, not independent physical measurements.

## Localized camera avoidance

Project the recorded obstruction into the drawable viewport before evaluating the headline, content and navigation regions. If an obstruction intersects a region, keep the larger clear interval along the region’s layout axis. For the rail, center the dock in the remaining vertical interval. Apply the adjustment only to the intersected region and retain the existing content alignment in clear regions. Safari uses its existing drawable viewport dimensions with the recorded exclusion applied only when translating the camera’s physical origin.

Build 002 previews use the recorded folded camera centers and 18.5 pt radius, with a provisional 4 CSS px clearance around the camera bounds. The native safe areas, exact camera clearance, unfolded camera geometry and physical Safari viewport behavior still require device measurement. An ambiguous folded-landscape match leaves the camera position unresolved.

## Restart
Archive and verify recoverability of prior application; preserve history, data, hardware, diagnostics and functional modules. Replace redundant runtime layout rules with grayscale Home wireframe first. Same repository, main, Pages URL. No storage clearing or workout functionality changes during layout lab. Test all ten reference configurations and live viewport behavior, distinguish browser simulation from physical/native verification. Approve screens sequentially. Preserve canonical hardware previews and independent diagnostics. See DUO-HARDWARE-STANDARD.md and LAYOUT-LAB-HANDOFF.md for retained calibration and restart constraints.
