# FORM — Universal Adaptive Layout

Approved design direction, 2026-11-27. Supersedes independent orientation/environment interface compositions in the restart handoff. Updated for Layout Lab Build 005.

## Architecture
- Retain detection of FP, FL1, FL2, UP, UL and Native/Safari environment. Preserve canonical hardware geometry and calibration.
- Resolve live usable viewport, origin, system safe areas and localized obstructions before layout. Never subtract browser exclusions twice. UI components do not know about dead strips or orientation-specific offsets.
- One shared adaptive layout system driven by available width, height and local safe bounds, not orientation labels. Native and web may use separate platform implementations with shared design rules.
- Shared headline, typography, padding, content-driven cards, responsive columns, navigation centered within its safe region, stationary navigation and one content scroll owner.

## Resolution order

1. Classify the physical display from the layout viewport and resolve the usable viewport from the unzoomed visual and layout viewport intersection. Use CSS viewport units as the fallback.
2. Apply system safe insets, then resolve calibrated camera clearance locally for the affected regions.
3. Measure the stationary headline and tagline.
4. Reserve the existing navigation rail or dock.
5. Reserve the optional timer in the column shared with the cards.
6. Give the remaining space to the adaptive content grid.

## Adaptive cards and timer

Home cards use a 15 rem minimum width and an 8 rem minimum height as shared layout tokens. The grid fits as many columns as the usable width allows, with a 12 px gap and equal flexible tracks on both axes. The two Home cards therefore share spare height as stacked rows or share spare width in one full-height row. Intrinsic content can grow the tracks when required. Card padding and the baseline page inset remain 16 px. The content pane scrolls when its tracks exceed the available width or height, with the headline, tagline, navigation and timer outside that pane.

The shared visual and document order is headline and tagline, adaptive cards, optional timer, then bottom navigation where applicable. A right rail spans the rows independently. The timer stays below the card scrollport and remains visible as overflowing cards scroll.

The optional timer is a reusable region with a provisional 3 rem minimum height and 8 px padding. **Show timer preview** in Diagnostics toggles a static placeholder for the current page session. Showing it reserves its intrinsic height plus one shell row gap. Hiding it removes the track and its gap immediately, and the cards reclaim that space. Navigation sits in its own track and retains the same placement and centering when the timer toggles.

## Diagnostic coordinates and rotation

Build 003 sized the shell from the intersection of the visual and layout viewports. Its diagnostics independently mixed that shell's client rectangles with the raw visual viewport for the blue outline and the layout viewport for the grid and safe areas. During a split UP → UL update, those inputs could describe different frames or origins. A Safari-sized UP → UL reproduction gave Build 003 a shifted visual origin of (10, 8) CSS px before the layout viewport updated. The usable width was 659 CSS px, while the guide drew the raw 867 CSS px width. The physical Duo event order remains unmeasured.

The shell publishes the current projected camera and safe insets after each shell update. Guides anchor to the rendered usable viewport and express every measured client rectangle in that viewport's local coordinates. Guides clip at the usable viewport and card guides clip at both axes of the content scrollport. The viewport outline uses the rendered dimensions. The Safari exclusion enters only when translating a calibrated hardware reference into drawable coordinates. Diagnostics remain a fixed, non-interactive overlay outside the app grid.

## Build 005 viewport recovery

The user reported that a physical Duo running Safari showed UP correctly, then resolved UL to 867 × 587 CSS px after a live rotation. An 82 px region remained below the app. Refreshing in UL restored 867 × 669 CSS px.

The orientation classifier uses the raw layout viewport. The shell uses the intersection of the raw visual rectangle and layout viewport. Safe insets affect padding inside that shell, so they cannot explain a measured shell height of 587 by themselves. UP's recorded 82 pt exclusion is used for calibration and is never subtracted from the live shell. The matching magnitude does not identify the source of the device discrepancy.

Build 004 accepted the latest intersection and stopped examining the viewport after its one 180 ms retry. Tests simulate a short visual height at zero offset and, separately, a full-height visual sample with a stale top offset. Both can yield 867 × 587 from the same 867 × 669 layout viewport, and Build 004's sampling can miss a later update with no notification. The report alone does not establish which metrics or events Safari supplied. The stale-offset case reproduces the height, while the short-height case reproduces the gap below the app.

Build 005 samples on animation frames after resize, orientation, visual viewport, page restoration and visibility events, and retries every 120 ms for up to three seconds after the last signal. An independent CSS viewport probe and the existing safe-inset sensors wake the sampler when their values change. Each pass reads the current rectangle and insets. A late short-to-full update or offset reset then resizes the same document. A smaller live visual rectangle is honored while the browser continues to report it. If Safari persistently reports a smaller rectangle with no subsequent change, the app has no reliable basis for enlarging it.

The overlay identifies the detected orientation and sizing environment and shows the resolved dimensions. The indicator is clipped to the usable viewport and positioned to avoid controls and text. The readout distinguishes calibrated physical references and projected camera bounds from the raw layout and visual viewports, offsets, CSS probe, usable viewport, safe areas, and measured component bounds.

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

Project the recorded obstruction into the drawable viewport before evaluating the headline, tagline, navigation, timer and content regions. If an obstruction intersects a region, keep the larger clear interval along the region’s layout axis. For the rail, center the dock in the remaining vertical interval. Apply the adjustment only to the intersected region and retain the existing content alignment in clear regions. Safari uses its existing drawable viewport dimensions with the recorded exclusion applied only when translating the camera’s physical origin.

Build 002 previews use the recorded folded camera centers and 18.5 pt radius, with a provisional 4 CSS px clearance around the camera bounds. The native safe areas, exact camera clearance, unfolded camera geometry and physical Safari viewport behavior still require device measurement. An ambiguous folded-landscape match leaves the camera position unresolved.

## Restart
Archive and verify recoverability of prior application; preserve history, data, hardware, diagnostics and functional modules. Replace redundant runtime layout rules with grayscale Home wireframe first. Same repository, main, Pages URL. No storage clearing or workout functionality changes during layout lab. Test all ten reference configurations and live viewport behavior, distinguish browser simulation from physical/native verification. Approve screens sequentially. Preserve canonical hardware previews and independent diagnostics. See DUO-HARDWARE-STANDARD.md and LAYOUT-LAB-HANDOFF.md for retained calibration and restart constraints.

## Universal spacing standard — Build 006 design notes

Agreed design direction, pending implementation and physical validation. Applies to every FORM page, including Home, Workouts, Progress, Profile, Routine Builder and Active Workout, across all orientations and environments. Shared semantic tokens, not page-specific overrides. Use native points and corresponding web CSS pixel design tokens; do not imply physical equivalence.

- Scale: 4, 8, 12, 16, 24, 32.
- Outer margin and card padding: 16.
- Headline to tagline: 4; headline region to content: 16.
- Card title to content: 8; navigation item gap: 4.
- Universal component gap: 12 between cards, cards and timer, timer and bottom navigation, cards and navigation when timer is absent, and content/timer column and right navigation rail. This supersedes the earlier proposed 16 navigation clearance and adaptive shell row gaps for these relationships.
- Major section separation: 24; 32 reserved for major group separation on spacious screens where appropriate.
- When timer hides, reclaim its height and one extra gap; retain one 12 gap between adjacent content and navigation. Cards absorb available space, not gaps.
- Safe areas, localized camera avoidance, accessibility and minimum content sizes take priority. Preserve hardware calibration and provisional camera clearance. Scroll when needed.

These notes specify future spacing behavior, not current Build 005 implementation. Validate on physical Duo before finalizing.
