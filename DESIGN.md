# FORM — Design standard
Status: approved web foundation behavior through Build 15; Build 16 QA pending. This is the sole active design specification. Native-sized browser previews are not native implementations.

## Hardware reference
| Profile | Full display (pt) | Safari drawable (pt) | Safari exclusion |
|---|---|---|---|
| FP | 466 × 678 | 382 × 678 | right 84 |
| FL1 | 678 × 466 | 594 × 466 | left 84 |
| FL2 | 678 × 466 | 594 × 466 | right 84 |
| UP | 669 × 951 | 669 × 869 | top 82 |
| UL | 951 × 669 | 867 × 669 | right 84 |

These are reference calibration targets, not independently measured guarantees. Use canonical SVGs in design/duo. Silver-gray chassis, no black bezel, circular camera. FP hinge left/curve right; FL1 hinge bottom/curve top; FL2 hinge top/curve bottom; UP vertical fold; UL horizontal fold. Folded hinge corner radius 8 pt, outer 59 pt; unfolded 28 pt provisional. Folded camera centers FP (418,48), FL1 (48,48), FL2 (630,418), radius 18.5 pt; unfolded camera unknown. Native safe areas unverified. Never invent geometry.

## Responsive layout
Use actual available viewport, fixed inset shell, CSS-first adaptive grid. Match reference viewport within 2 CSS px; folded landscape angle 90 = FL1, 270 = FL2, otherwise ambiguous. Unknown stays unknown. Never subtract Safari exclusions twice. System safe insets separate from design margin. Standard outer/card padding 16 CSS px; ONLY FL1 Safari left design margin zero, retaining system inset. Apply this exception immediately from observed profile, not delayed committed orientation. Native FL1 retains 16px design margin. Camera avoidance localized to affected components in Native-sized folded profiles; provisional 4px clearance. No legacy fixed headline or content anchors override these rules.

Spacing tokens 4/8/12/16/24/32: headline/tagline and nav items 4; card internals 8; component gaps 12; headline-content and card padding 16; section 24; major group 32. CSS px are not guaranteed physical pt. Cards absorb available space; scroll when insufficient. Normal portrait stacks; landscape uses up to two equal columns when available content width permits two 15rem tracks plus gap. Minimum card height 8rem. Optional timer below cards, minimum 48px, one gap; hidden reclaims space.

## Posture and motion
Use reported Device Posture API or CSS folded signal; segment axis takes priority, otherwise UP vertical/UL horizontal reference axis. Continuous does not prove physical unfolding. No fabricated hinge angle or exact boundary. Normal folded cover layout absent segments. Vertical split two columns; horizontal split two rows, two columns for 3–4 cards; one card stays in one pane; three leave empty cell. Reported segment boundary respected, gap at least 12px centered around boundary when smaller. Transform-only card motion 240ms; reduced motion disables animation; reported split snaps to avoid crossing fold. Profile stabilization 120ms for committed profile/diagnostics; hide guides during transition. Do not delay FL1 Safari margin.

## Navigation
One reusable dock, own grid track. FP Native right, FP Safari bottom; FL1/FL2 both right; UP/UL both bottom; ambiguous FL right; unknown bottom. Rail 80px, bottom max 332px, buttons min 44px. Preserve selected destination across rotation. Home / Workouts / Progress / Profile. Navigation routes to actual application views; selection is session-only.

## Keyboard
Prefer browser-native focus scrolling. Detect focused editable field plus visual viewport height loss >=100 CSS px at near-unit zoom; heuristic only. Preserve resolved card tracks and rail width, hide dock/timer, clip and scroll content; next animation frame checks visibility, scrollIntoView nearest only when obscured. Restore pre-edit scroll on dismissal; reduced motion respected. No fixed delay or forced target. Floating/layout-resizing keyboards and rotation during editing remain unverified.

## Visual identity
Apple-inspired restrained surfaces, clear hierarchy, spacious layout, Lucide icons where appropriate. FORM wordmark, tagline “Train with focus, follow your progress”. Current wireframe headline 28px bold, card title 17px. Initial functional styling is provisional; final screen typography, surfaces and production colors require approval; do not revive legacy anchors or 40:60 card ratios. Test colors: blue/purple cards, amber timer, green navigation.

## Diagnostics and previews
Independent noninteractive paint-contained overlay, measured local origin, clip to visible geometry; omit hidden elements from guides and camera checks. Orange camera, purple headline/axes, blue viewport, green content/card alignment, gray unavailable/safe regions. Report physical reference, actual layout and visual viewport, offsets, CSS probe, rendered shell, visible editing area, safe insets, exclusions, card/timer/nav measurements, rotation/posture and camera warnings. Guides default on, measurements collapsed; hide indicator while editing, update guides during motion. Preserve form.diagnostics.v1 and all workout data.
For complete Duo previews use one reusable interactive SVG, fixed hardware, clipped responsive UI, independent diagnostics. Orientation FP/FL1/FL2/UP/UL, Native/Safari, guides toggle default on, expandable measurements default collapsed. Maintain physical scale. Disclose schematic vs verified implementation and unknown measurements.

## Verification
User accepted hinge, motion, adaptive cards, safe areas, navigation, keyboard, diagnostics and FL1 Safari behavior on Duo. Exact sensor source, native calibration, cross-orientation keyboard behavior and automated regression results are not established. Do not declare foundation locked until checks pass.
