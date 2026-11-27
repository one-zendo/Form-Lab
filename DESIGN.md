# FORM — Design standard
Status: restart foundation specification; implementation and physical acceptance pending. This is the sole active design authority for the restart. Build 08 remains the existing runtime until replaced. Native-sized browser previews are not native implementations.

## Hardware reference
| Profile | Full display (pt) | Safari drawable (pt) | Safari exclusion |
|---|---|---|---|
| FP | 466 × 678 | 382 × 678 | right 84 |
| FL1 | 678 × 466 | 594 × 466 | left 84 |
| FL2 | 678 × 466 | 594 × 466 | right 84 |
| UP | 669 × 951 | 669 × 869 | top 82 |
| UL | 951 × 669 | 867 × 669 | right 84 |

These are reference calibration targets, not independently measured guarantees. Use canonical SVGs in design/duo. Silver-gray chassis, no black bezel, circular camera. FP hinge left/curve right; FL1 hinge bottom/curve top; FL2 hinge top/curve bottom; UP vertical fold; UL horizontal fold. Folded hinge corner radius 8 pt, outer 59 pt; unfolded 28 pt provisional. Folded camera centers FP (418,48), FL1 (48,48), FL2 (630,418), radius 18.5 pt; unfolded camera unknown. Native safe areas unverified. Never invent geometry.


## Independent layout architecture
Start from scratch with a minimal wireframe: headline, two simple test cards, navigation and diagnostics. No workout features in the initial foundation. Preserve previous runtime in Git history and preserve all user storage.
- Each screen owns its layout independently: Home, Workouts, Progress, Profile, and future screens such as Routine and Active Workout.
- Each screen owns five orientation layouts (FP, FL1, FL2, UP, UL), each sharing its arrangement between Native and Safari, with environment-specific viewport and safe-area calibration.
- One shared UI and component model across orientations and environments. Changes to a component's content, color, typography, icons, visual styling and functionality propagate to every instance of that component. Headline and pop-outs are shared layout components across screens; other components may share appearance and behavior, but not spatial layout rules. Hardware/viewport detection, raw posture signals, diagnostics and application data may be shared without imposing layout decisions.
- Remove all global automatic layout adaptation: no global card grid, sizing, stretching, column switching, spacing, scrolling, navigation placement or hinge composition rules. No cross-screen layout inheritance, generic portrait/landscape composition, or corrective CSS overrides of shared layout rules.
- Each screen/orientation explicitly owns its card arrangement, sizing, alignment, spacing, scrolling, navigation placement and hinge response. Changing placement or arrangement in one orientation must propagate to both Native and Safari of that orientation, adapting dimensions to their available viewport, but must not affect other orientations or screens; shared component appearance, content and functionality must still propagate everywhere.
- Initial normal-state wireframes use two stacked full-width test cards in all five orientations. Card heights and final spacing are provisional; do not force equal-height stretching globally. Home UP stays stacked regardless of hinge signal. Other hinge compositions require individual approval; the illustrated UL split is provisional, not a global rule.
- Retain raw hinge and viewport segment detection. Diagnostics distinguish detected posture from actual rendered composition. Never fabricate hinge angle or exact boundary.

## Viewport and calibration
Use actual drawable viewport; never subtract Safari exclusions twice. Keep system safe insets distinct from design margins. Match reference viewport within 2 CSS px; folded landscape angle 90 = FL1, 270 = FL2, otherwise ambiguous. Unknown stays unknown. Preserve the approved FL1 Safari zero left design margin while retaining system inset; Native FL1 reference margin 16px. Apply these as explicit local layout settings, not global screen composition. Camera avoidance is local; previous 4px clearance is provisional. CSS px are not guaranteed physical pt.

## Navigation and motion
Navigation destinations: Home, Workouts, Progress, Profile. Preserve selected destination across rotation. Navigation state may be shared; each layout owns its dock geometry and placement. Prior placement references for local wireframes: FP Native right, FP Safari bottom; FL1/FL2 right; UP/UL bottom. Prior 80px rail, 332px maximum bottom dock and 44px minimum controls are reference values, not global layout rules. Keep navigation anchored while content scrolls. Motion is local, transform-only where appropriate, respects reduced motion and avoids crossing reported segment boundaries. No global motion-driven layout changes.

## Visual identity
Apple-inspired restrained surfaces, clear hierarchy, spacious layout, Lucide icons where appropriate. FORM wordmark, tagline “Train with focus, follow your progress”. Home headline includes current build number. Test cards blue and purple. Headline 28px and card title 17px are prior wireframe references; final typography and production colors require approval. Spacing tokens 4/8/12/16/24/32 are available values, not inherited layout settings. Pop-outs share their own component styling.

## Diagnostics and previews
Independent noninteractive paint-contained overlay, measured local origin, clip to visible geometry; omit hidden elements from guides and camera checks. Orange camera, purple headline/axes, blue viewport, green content/card alignment, gray unavailable/safe regions. Report physical reference, actual layout and visual viewport, offsets, CSS probe, rendered shell, visible editing area, safe insets, exclusions, card/timer/nav measurements, rotation/posture and camera warnings. Guides default on, measurements collapsed; hide indicator while editing, update guides during motion. Preserve form.diagnostics.v1 and all workout data.
For complete Duo previews use one reusable interactive SVG, fixed hardware, clipped responsive UI, independent diagnostics. Orientation FP/FL1/FL2/UP/UL, Native/Safari, guides toggle default on, expandable measurements default collapsed. Maintain physical scale. Disclose schematic vs verified implementation and unknown measurements.


## Verification
First verify simple cards, navigation, diagnostics and isolation across all ten orientation/environment combinations for each screen. Test posture, rotation, scrolling, safe areas and camera avoidance; changing a single spatial layout must leave all other spatial layouts unchanged; changing shared component styling or content must propagate across orientations and environments. Verify keyboard behavior when editable controls are introduced. Prior device acceptance does not establish restart acceptance. Native calibration, unfolded camera geometry and exact sensor source remain unverified. Do not declare foundation locked until automated and physical checks pass.

## Replace, never override
Permanent layout changes replace the existing local placement definition. Delete superseded declarations, conditions, fallback arrangements and corrective overrides for that placement; do not layer new rules over obsolete ones. Maintain one authoritative placement definition per screen/orientation and explicitly approved posture state. Permanent placement must not be overridden by hinge signals. Preserve shared UI components, functionality, hardware detection, diagnostics and user data. Retain previous implementations only in Git history. Verify no conflicting active definitions remain.

## Engineering principles and layer boundaries
Maintain one authoritative definition for each shared component and each local orientation layout. No hidden automation: rearrangement, stretching and movement require an explicit local design. Remove unused styles, variables, functions and obsolete conditions as part of every change. Rotation and posture changes must preserve selected screen, workout state and user input.
Separate five responsibilities:
- Hardware: report orientation, drawable viewport, safe areas and raw hinge/posture signals; never dictate card placement.
- Layout: own spatial placement independently per screen and orientation.
- Components: share appearance, content, typography, colors, icons and controls across orientations; no global spatial adaptation.
- Functionality: share interactions, application logic and persistent data independently of layout.
- Diagnostics: observe and report actual geometry and signals; overlays must never alter layout, dimensions, scrolling or interaction.
## Development discipline
Preview and approve spatial arrangements before implementation. Establish and physically test the minimal wireframe before adding workout features. Verify all five orientations in both Native-sized and Safari-sized configurations, including isolation of local placement and propagation of shared component changes. Automated browser checks do not substitute for physical Duo or native validation. Remove superseded code in every build; verify that no conflicting definitions remain. Record approved decisions and known limitations, preserve data and Git history, work directly on main, and verify deployment separately from source changes.

## Native and Safari relationship
Five independent orientation arrangements per screen, not ten. Native and Safari share the same orientation-specific composition and placement intent. A placement change requested in Safari also applies to Native of that orientation (and vice versa), with dimensions adapting locally to actual drawable viewport, safe areas and calibrated exclusions. Environment-specific calibration and existing navigation placement references remain distinct; no global adaptive grid or automatic column switching. Test both environments for each orientation. Other orientations and screens retain their placement. This section supersedes any earlier wording implying separate Native and Safari card arrangements.

## Shared orientation alignment (approved)
Navigation placement and outer content margins are shared across screens within each orientation, respecting environment-specific viewport and safe-area calibration and approved navigation references. Navigation remains anchored across screen changes and scrolling. Headline alignment follows the shared orientation content boundary. Card internal padding belongs to the shared component; inter-card gaps, card dimensions and arrangements belong to each screen and orientation. Native and Safari share composition intent with local viewport adaptation. These ownership rules supersede earlier statements assigning navigation placement and outer margins independently to every screen. Shared alignment must not introduce global automatic card arrangement or stretching.

## Navigation visibility (approved)
Main navigation placement is shared across main screens within each orientation and environment. Secondary screens may hide the main dock and use their own back or task controls while retaining shared orientation margins and headline alignment. Visibility is owned by the screen; main dock placement is not. Exact secondary-screen controls require screen-specific design.
