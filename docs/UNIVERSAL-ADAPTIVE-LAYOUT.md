# FORM — Universal Adaptive Layout

Approved design direction, 2026-11-27. Supersedes independent orientation/environment interface compositions in the restart handoff. Documentation only; no runtime changes.

## Architecture
- Retain detection of FP, FL1, FL2, UP, UL and Native/Safari environment. Preserve canonical hardware geometry and calibration.
- Resolve live usable viewport, origin, system safe areas and localized obstructions before layout. Never subtract browser exclusions twice. UI components do not know about dead strips or orientation-specific offsets.
- One shared adaptive layout system driven by available width, height and local safe bounds, not orientation labels. Native and web may use separate platform implementations with shared design rules.
- Shared headline, typography, padding, content-driven cards, responsive columns, bottom-centered navigation within safe available region, stationary navigation and one content scroll owner. Exact breakpoints and navigation dimensions not finalized.

## Safari reference calibration (pt)
| Orientation | Full | Excluded | Drawable |
|---|---|---|---|
| FP | 466×678 | right 84 | 382×678 |
| FL1 | 678×466 | left 84 | 594×466 |
| FL2 | 678×466 | right 84 | 594×466 |
| UP | 669×951 | top 82 | 669×869 |
| UL | 951×669 | right 84 | 867×669 |
FL1 and FL2 share identical drawable dimensions and relative layout; only physical origin differs. Reference targets, not independent physical measurements.

## Native localized camera avoidance
Use one generic obstruction-aware rule: calculate safe bounds for each component region; adjust only components that would intersect an obstruction, reclaim remaining space. Do not exclude a whole Safari strip in Native. FP camera top right: header avoids right; FL1 camera top left: header avoids left; FL2 camera bottom right: navigation avoids right. Cards use full available width when clear of obstructions. Provisional camera centers FP (418,48), FL1 (48,48), FL2 (630,418), radius 18.5 pt per hardware standard. Exact clearance, unfolded camera geometry and actual native safe areas unverified. Do not treat full physical dimensions as confirmed usable native viewport. Resolve prior anchor conflicts through verification, not guesses.

## Restart
Archive and verify recoverability of prior application; preserve history, data, hardware, diagnostics and functional modules. Replace redundant runtime layout rules with grayscale Home wireframe first. Same repository, main, Pages URL. No storage clearing or workout functionality changes during layout lab. Test all ten reference configurations and live viewport behavior, distinguish browser simulation from physical/native verification. Approve screens sequentially. Preserve canonical hardware previews and independent diagnostics. See DUO-HARDWARE-STANDARD.md and LAYOUT-LAB-HANDOFF.md for retained calibration and restart constraints.
