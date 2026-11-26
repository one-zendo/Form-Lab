# Duo hardware calibration

Source: user measurements and prior FORM Lab design conversations, 2026-11-26. This record is not a verification of runtime code.

## Confirmed outer camera
- Circular cutout diameter: 37 pt (111 px at 3x). Do not substitute an estimated diameter.
- FL1 provisional center: (48, approximately 48) pt. Horizontal boundaries: 29.5 and 66.5 pt. Center coordinates require verification against current implementation.

## Display and Safari exclusions
| Orientation | Display (pt) | Safari exclusion (pt) | Drawable viewport (pt) |
|---|---|---|---|
| FP | 466 x 678 | right 84 | 382 x 678 |
| FL1 | 678 x 466 | left 84 | 594 x 466 |
| FL2 | 678 x 466 | right 84 | 594 x 466 |
| UP | 669 x 951 | top 82 | 669 x 869 |
| UL | 951 x 669 | right 84 | 867 x 669 |

Safari exclusions are recorded design values; verify against runtime. Native layout is independently calibrated. Do not infer inner camera geometry from the outer camera.

## Preview rules
Read this record and current implementation before rendering. Keep hardware, UI and diagnostics independent. Preserve physical scale, silver-gray chassis and asymmetric hinge silhouette. Orange camera boundaries must derive from actual camera geometry. Prior Build 192 conversation records FL1 native content anchor 29.5 pt; verify against code before use. Do not invent missing contours, offsets or camera coordinates. Disclose discrepancies and unverified values. This documentation does not change runtime behavior.
