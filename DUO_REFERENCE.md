# Duo hardware and viewport reference

Build 166 device screenshots. CSS pixels; hardware silhouette schematic only, corner radii unverified. FP hinge left, curved edge right. FL1 hinge bottom, curved edge top, camera left. FL2 hinge top, curved edge bottom, camera right. UP and UL pending.

| Orientation | Rotation | Oriented screen | Layout / visual viewport | Offset | Safe T/R/B/L | Safe dimensions | Hinge / segments | Excluded strip |
|---|---|---|---|---|---|---|---|---|
| FP | 0° | 466 × 678 | 382 × 678 | 0 / 0 | 0 / 0 / 34 / 0 | 382 × 644 | flat / 1x1 | right 84 |
| FL2 | 270° | 678 × 466 | 594 × 466 | 0 / 0 | 0 / 0 / 34 / 0 | 594 × 432 | flat / 1x1 | right 84 |

Both screenshots report screen.width × screen.height as 466 × 678 and island side unknown. Excluded strip is inferred from screen minus viewport and visible screenshot, not CSS safe-area inset. FL1 measurements pending. Do not alter app layout until user authorizes implementation.
