# Duo hardware and viewport reference

Build 166 device screenshots. CSS pixels; hardware silhouette schematic only, corner radii unverified. FP hinge left, curved edge right. FL1 hinge bottom, curved edge top, camera left. FL2 hinge top, curved edge bottom, camera right. UP pending; UL measured at 270°.

| Orientation | Rotation | Oriented screen | Layout / visual viewport | Offset | Safe T/R/B/L | Safe dimensions | Hinge / segments | Excluded strip |
|---|---|---|---|---|---|---|---|---|
| FP | 0° | 466 × 678 | 382 × 678 | 0 / 0 | 0 / 0 / 34 / 0 | 382 × 644 | flat / 1x1 | right 84 |
| FL1 | 90° | 678 × 466 | 594 × 466 | 0 / 0 | 0 / 0 / 34 / 0 | 594 × 432 | flat / 1x1 | left 84 |
| FL2 | 270° | 678 × 466 | 594 × 466 | 0 / 0 | 0 / 0 / 34 / 0 | 594 × 432 | flat / 1x1 | right 84 |
| UL | 270° | 951 × 669 (reference) | 867 × 669 | 0 / 0 | 0 / 0 / 34 / 0 | 867 × 635 | flat / 1x1 | right 84 (inferred) |

All four screenshots report screen.width × screen.height as 466 × 678 and island side unknown. Excluded strip is inferred from screen minus viewport and visible screenshot, not CSS safe-area inset. FL1 screenshot confirms 90° with left excluded strip; FL2 confirms 270° with right excluded strip. UP measurements pending. UL reports outer screen dimensions 466 × 678 despite unfolded viewport; oriented inner screen size 951 × 669 is prior reference, not independently reported by this screenshot. Bottom 34 is drawable gesture inset, not proven untappable. Do not alter app layout until user authorizes implementation.
