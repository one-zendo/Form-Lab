# Duo hardware preview standard

Five design-only SVGs in `design/duo`. User-supplied iOS 27 Figma/Appetite UI reference: outer display 466×678 pt, camera diameter 37 pt (radius 18.5), hinge corners 8 pt, outer corners 59 pt. These are design references, not independently verified hardware measurements. FL1 master 678×466 with upper corners 59 and lower corners 8; FP rotates 90 degrees, FL2 180. UP/UL retain provisional symmetric 28pt display corners and no visible cutout. Chassis thickness is schematic. Black exclusions and blue viewport boundaries use recorded `DUO_REFERENCE.md` values; UP top 82 and UL right 84 remain inferred. Bottom 34pt gesture inset is shaded, not excluded. Clip UI to the actual display path. Never subtract browser-excluded strips twice. Hardware geometry remains independent of responsive UI. Render all templates at consistent physical scale.

## Current approved calibration

Use `docs/DUO-HARDWARE-STANDARD.md` as the single source of truth for orientation dimensions, exclusion directions, headline/content anchors, typography and diagnostics behavior.

- Simulated folded camera centers: FP (418,48), FL1 (48,48), FL2 (630,418), radius 18.5pt. These centers remain provisional calibration targets.
- FL1 native content aligns with the camera's left perimeter at X=29.5pt; its headline has an independent X=84pt anchor. In Safari, the left 84pt exclusion is already outside the layout viewport, so the CSS content inset is 0pt relative to that viewport (physical X=84pt).
- FP, FL2, UP and UL use the content anchors recorded in the approved standard. Do not infer one orientation's exclusion direction from another.
- Unfolded camera geometry, exact camera centers, inner hardware geometry and official source verification remain outstanding.
- Guides are diagnostics-only: they are hidden and cleared when diagnostics are disabled. They must not appear on ordinary app pages or intercept interaction.
- Diagnostic colors: orange camera perimeter, purple center axes/headline, green content boundaries, blue Safari exclusion boundary (dashed in native preview). Support native/Safari preview modes, compact collapsed controls, and avoid rotation snap or flash.

## Historical notes

Build 183: user confirmed FL1 horizontal guide alignment from screenshot; inferred master Y approximately 48pt (105px / 2.19px per pt). The earlier X=48 and camera positions were provisional and are superseded by the current approved calibration above. Existing local calibration remains preserved.

Build 184: folded preview guides extend across the physical display, with faded dashed projections in the excluded rail. Runtime center guides are solid and edge guides dashed; browser clipping prevents drawing into excluded regions. The earlier statement that guides could remain visible on normal app pages is superseded: current behavior is diagnostics-only.
