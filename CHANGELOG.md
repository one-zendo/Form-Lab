# FORM Lab changelog
## Reset stage
Retired Build 08 runtime and obsolete tests. Previous changelog and source remain at 464abb0ff44695d39c834a46918160a439d6e26f. Preserved design authority, hardware assets and user storage. Static reset page only; diagnostic implementation and physical acceptance pending. Quality workflow temporarily checks reset integrity, not app behavior.

## Documentation cleanup
Clarified diagnostic versus future product scope and stage-specific testing. Retained hardware references, approved layout ownership, visual tokens, navigation, timer, zoom and diagnostics policies. No runtime changes.

## Diagnostic Build 01
Initial single-page diagnostic runtime, sample controls, deadline timer, anchored navigation, explicit profiles, raw posture reporting and observational overlay. Unknown viewport fallback is uncalibrated. No storage writes. Automated checks queued; physical zoom, camera, native and hinge calibration pending. Test coverage is initial, not full acceptance.

## Diagnostic Build 02
Approved arrangement-preserving hinge rule. UP horizontal content separation with provisional midpoint when compatible segment data is unavailable; explicit diagnostic posture simulation. UL remains stacked until a side-by-side arrangement is approved. Timer/navigation unchanged. Added unit and browser assertions; physical posture and spacing unverified.

## Diagnostic Build 03
Enabled arrangement-preserving posture adjustment in all five current stacked profiles, both viewport environments. Unknown profiles remain uncalibrated. Added all-profile posture assertions. Provisional midpoint and minimum 12 CSS px additional spacing are diagnostic design choices, not measured hinge geometry. Future side-by-side layouts are specified but not implemented. Physical validation pending.

## Diagnostic Build 04
Three-second foreground deployment polling, versioned assets, matching HTML verification and guarded reload. Changed editable fields defer automatic reload until manual refresh; no user storage writes. Browser timing and deployment remain unverified.

## Diagnostic Build 05
Added side-by-side test pair and adaptive dimensions and gaps for both pairs across all profiles. Preserves shared padding, anchored controls and existing interaction state. Provisional minimum sizes and gaps; binary posture transitions, not continuous angle tracking. Added regression assertions; deployment and physical verification pending.

## Diagnostic Build 06
Four functional pages: Home, Workouts, Profile, Diagnostic. Global master and individual overlay toggles, posture simulation and measurements moved to Diagnostic. Timer remains visible globally for testing; session state retained across page navigation. Home card pairs adjust only while visible. No new persistent storage. Exact physical hinge alignment remains unresolved. Tests updated; verification pending.

## Diagnostic Build 07
Removed automatic midpoint fallback; matching segment axis and local fit required. Constant stacked pair target height prevents indirect displacement of cards 03/04. Flat side-by-side tracks use equal fractions. Explicit simulation retains labeled midpoint. Physical hinge guides fixed to viewport. Regression assertions revised for local-fit behavior; verification pending.

## Diagnostic Build 08
Added independent orange camera center-axis guides, default on under master guides. Uses existing camera reference and Safari offset; unknown camera omitted, offscreen axes clipped. No layout changes. Verification pending.

## Diagnostic Build 09
Navigation timer visibility toggle, default visible, countdown continues hidden. Release timer-only scroll clearance; bottom dock maximum 360px. Regression added; verification pending.

## Diagnostic Build 10
Stability mitigation for reported blank screen: bounded diagnostic redraws, asynchronous navigation geometry notification, error isolation, repeated tab-switch regression, Ubuntu 24.04 CI runner. Physical cause unconfirmed; verification pending.

## Diagnostic Build 11
Approved Apple × ChatGPT visual standard; monochrome icon-only destination capsule, separate circular timer control, neutral background and fine card outlines. Existing orientation anchors retained. No backdrop blur during stability testing. Physical fit and stability pending.

## Build 12
Recovered ONE-derived Home card arrangement from Build 94. Personalized local-time greeting, no tagline, neutral two-card dashboard, session profile name editing, timer toggle contrast and countdown ring. Diagnostic pairs relocated. No storage writes, no workout engine. Home hinge response, animated content resizing, physical validation pending.

## Build 13 — blank screen fix
Confirmed source defect: navigation selected every data-page element, including the shell after first navigation, and hid the entire app on switching destination. Restrict visibility changes to direct page panels. Browser tests previously failed on ambiguous selectors; scope them to actual panels and assert shell visibility and exactly one visible panel on repeated navigation. Physical confirmation pending.

## Build 14
Shared monochrome floating timer, separate circular countdown ring, animated scroll viewport clearance and timer visibility. Preserve countdown, orientation anchors and navigation. Browser tests extended for actual viewport resizing; physical fit and CI pending.

## Build 15
Replace navigation, timer, set-check and expansion glyphs with upstream Lucide 0.456.0 SVGs. No external runtime dependency. Verification pending.

## Build 16
Approved screenshot-inspired shared radius tokens: cards/grouped settings 24, regular buttons 16, small controls 12, pop-outs 32. Capsules, circular controls, hardware and spatial placement unchanged. Existing component surfaces retain their colors and spacing; new grouped settings and dark appearance are not introduced in this radius-only change. Physical verification pending.

## Build 17
Move timer toggle into shared navigation capsule in all profiles. Preserve independent countdown and visibility state, black active styling and blue ring. Ring sized to 42 CSS px to fit shared control. Floating timer bar and navigation anchors unchanged. Physical and automated verification pending.

## Build 18
Shared sticky page header with opaque background and content separation. Physical safe-area and scroll verification pending.

## Build 19
- Home-only edge-to-edge dashboard; equal flexible cards fill available space and resize with timer visibility. Existing orientation arrangements and minimum card sizes retained. Other screens, hardware and storage unchanged.
- Automated browser and physical acceptance pending.

## Build 20
- Shared sticky headline frosted glass on all four pages; preserve geometry, alignment, navigation, card layout and storage. Opaque fallback for unsupported browsers. Browser and physical acceptance pending.

## Build 21
- Shared headline glass extends to viewport top; sticky text retains calibrated top inset. Reduce surface opacity to 58%, blur to 12px and separator contrast. Preserve cards, navigation, timer and hardware. Browser and physical acceptance pending.

## Build 22
- Reduce shared headline glass background opacity from 58% to 15% on all pages. Keep 12px blur, text opacity, fallback and layout unchanged. Browser and physical acceptance pending.

## Build 23
- Refine shared headline glass using 15% opacity, 6px blur and 100% saturation, based on user screenshot. Preserve separator, text opacity, fallback and all layout geometry. Screenshot-derived tokens are approximate; browser and physical acceptance pending.

## Build 24
- Fix exposed top strip by moving scroll top padding into the actual sticky header and applying glass directly to the full-width header at top:0. Preserve headline text alignment and 15% opacity/6px blur. Master diagnostic guides default off, with individual categories retained. Browser and physical acceptance pending.

## Build 25
- Home-only cohesive layout: explicit full width, zero horizontal design margin, 8px card and content gaps, 12px headline gap, consistent 24px titles. Retain 16px card padding, 24px radius, 13px secondary text, flexible equal card allocation, safe insets, existing navigation and timer clearance. Exact 12px visual navigation clearance remains pending measurement. Browser and physical acceptance pending.

## Build 26
- Home 8px card margins, right-aligned date, blue history-driven streak and day detail, routine summary; expanded monochrome liquid timer with shared capsule token and 15-second controls; local private JSON importer, read-only history and routines. Navigation transitions refined. Hardware unchanged. Real data not committed. Browser/physical acceptance pending; workout engine, exact duration estimates and muscle metadata not implemented.

## Build 27
- Studio and Graphite Lime themes, latter default; persistent Profile appearance selector; monochrome streaks and theme-colored timer. No personal training data changes. Browser and physical validation pending.

## Build 28
Private paste importer for JSON and copied fenced batches. No personal data committed. Browser and physical testing pending.

## Build 29
Studio Dark added; Studio renamed Studio Light without changing stored preference. Graphite default unchanged. Theme-aware browser tint metadata and canvas background. Syntax checked; browser, deployment and physical verification pending.

## Build 30
Pure black Safari tint requested for every theme. No layout changes. Physical tint and deployment pending verification.

## Build 31
Studio follows system appearance automatically; two theme choices. Existing preferences remain compatible. No layout or storage migration. Syntax checked; deployment and physical verification pending.

## Build 32
Replace forced-black Safari tint with one theme-aware resolver used at startup, selection and system changes. Remove superseded active documentation rules. No layout or data changes. Resolver logic tested; deployment and physical tint pending.

## Build 33
Studio Dark timer text and icons remain white across the liquid boundary. Studio Light and Graphite Lime unchanged. Physical and deployment verification pending.

## Build 34
Added Obsidian Red as third selectable theme. Existing themes and data preserved. Resolver checks passed; physical appearance and deployment pending.

## Build 35
Timer gradient backdrop blur: 14px blur, 40px fade above timer, reserved scroll padding and theme-aware gradient. Sharp timer foreground, hidden timer releases reserve and hides glass. Static source checks passed; browser and physical verification pending.

## Build 36
Home reserves timer space in the actual content viewport instead of scroll padding, allows dashboard flex shrink and intrinsic card minimums, and excludes Home from timer glass. Other pages retain Build 35 glass. Source checks passed; browser and physical tests pending.

## Build 37
Navigation glass: 20px dock blur, 55% theme surface, 14px directional gradient with 40px fade, independent of timer. Home retains fixed dashboard clearance. Source checks passed; browser, deployment and physical verification pending.

## Build 38
Added Little Weather headline, SVG animations, permission-based Open-Meteo integration and forecast. JS syntax checks passed. Live API, browser rendering and deployment unverified.

## Build 39
Enlarged Home weather art (FP 48, FL1/FL2 56, UP/UL 64 CSS px), temperature and condition text. Replaced old sizing values. No behavior or hardware changes. Source checks passed; browser and physical fit pending.
