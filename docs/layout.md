# Layout

## Layout Lab Build 005 — viewport recovery and timer order

The physical Duo report confirmed a live UP → UL discrepancy of 867 × 587 CSS px that cleared after refresh. The new sampler checks for late viewport changes and exposes the raw values in Diagnostics. The [recovery notes](UNIVERSAL-ADAPTIVE-LAYOUT.md#build-005-viewport-recovery) describe the software failure mode and the device evidence still needed.

Chromium and WebKit passed all ten calibrated configurations and live transitions. Regressions simulate a late short-height correction and a late top-offset reset, check the live orientation indicator, and verify the 48 CSS px timer below the card scrollport, stationary headline and navigation, space reclamation, minimum card sizes, scrolling, and storage preservation. The browser runs use simulated viewports. Physical Duo Safari and native SwiftUI validation of Build 005 remain open.

## Layout Lab Build 004 — two-dimensional layout and timer

The two Home cards share the full remaining content area. The optional 3 rem timer preview reserves space before the cards and releases it when hidden. Run it from Diagnostics. The headline, tagline and dock stay in place while cards scroll. The [Universal Adaptive Layout](UNIVERSAL-ADAPTIVE-LAYOUT.md) records the provisional dimensions, minimum sizes and diagnostic coordinate fix.

The browser matrix checks all ten calibrated configurations with zero, fixture and asymmetric safe insets. It also checks split viewport updates, late settling, live guide alignment, equal tracks, timer space reclamation, accessible card scrolling and preserved storage. Physical Duo Safari and SwiftUI validation remain open.

## Layout Lab Build 003 — live rotation stability

On physical Duo, the user reported that the dock disappeared on a live UP → UL rotation and returned after reopening in UL. Build 002 tied the dock to the bottom of a `100dvh` shell. Its visual-viewport resize handler scheduled a render, but visual dimensions were used only in diagnostics. The failure was reproduced by delivering the UL visual viewport before the layout viewport updated. The shell remained 869 CSS px tall and the dock occupied y=805–853 while the viewport ended at y=669. The exact event sequence and safe insets on physical Duo still require a device trace.

Build 003 sizes and positions the shared shell from the intersection of the unzoomed visual viewport and the layout viewport. CSS viewport units supply the fallback. The existing layout-viewport classifier still selects the calibrated orientation and dock arrangement. The shell applies safe insets and camera clearance to the current bounds. Viewport events are coalesced on animation frames, with one trailing sample 180 ms after the latest resize or rotation notification. Independent safe-area edge sensors catch changes even when inset totals are unchanged, and identical geometry samples skip layout writes. The observer watches those sensor inputs instead of observing the grid affected by its writes.


Chromium and Playwright WebKit passed the ten settled viewport regressions and no-refresh sequences in both sizing modes. The sequences repeat UP ↔ UL, exercise all directed orientation pairs, vary the order of viewport updates, and check dock bounds during intermediate and settled sizes. They also cover a late sample without a final viewport event and an inset moving from top to bottom without changing its total. These are browser simulations.

## Layout Lab Build 002

The shell reserves the navigation region before resolving card columns. A right rail uses a shared grid column and a bottom dock uses a shared grid row. The layout keeps the headline and dock outside the content scroll container. The projected folded camera can trim the safe interval of an affected region without shifting the other regions. See the [Universal Adaptive Layout](UNIVERSAL-ADAPTIVE-LAYOUT.md) for placement and outstanding measurements.


Chromium and Playwright WebKit passed all ten calibrated cases with zero, fixture and asymmetric test insets. The suite checked dock placement and centering, camera clearance, content alignment, stationary navigation during scrolling, and retention of sample training data.

## Layout Lab Build 001

Home uses one content-width grid. Cards stack until the available content width can fit two 15 rem tracks and a 12 px gap. Tracks share remaining width, and card height follows content. The header, cards and dock share the same 16 px page inset, plus any reported safe area. Dynamic viewport height sizes the shell and sets the available scroll space. At very short heights, the document becomes the scroll container.

The approved physical geometry, Safari exclusions and historical anchors remain in their existing reference data. Layout uses browser-reported safe insets, and Safari viewport exclusions are already represented by the drawable browser dimensions. Native-sized previews are browser simulations. Physical Duo Safari, the native runtime and actual safe-inset values remain unverified, including how the native viewport reports clearance around the folded camera.

Chromium and Playwright WebKit passed all ten calibrated viewport cases with the fixture insets and with zero insets. The checks cover card arrangement, header and dock clearance, resizing, diagnostics and retention of sample training data.

The previous runtime and its tests are recoverable from `archive/form-build-94`. See [restart handoff](LAYOUT-LAB-HANDOFF.md) for the historical migration context.

## Build 94 — UP Safari-sized Home

Home uses the approved Start Workout control with a quarter-width play accent in UP Safari-sized. The control sits inside the existing workout card and uses its existing navigation to Workouts.

The Node suite and Playwright Chromium and WebKit integration passed. Both browser runs checked the control and workout calibration across all ten viewport configurations. A Chromium comparison with Build 93 matched the measured Home card, dock, headline, and content bounds and the Active Workout anchors across the matrix.

### Existing Active Workout safe-inset overlap

The reported 8 px overlap with the safe inset predates Build 94. The Active Workout layout and safe-inset rules are unchanged. The 8 px observation still needs confirmation on physical Duo Safari.

## Orientation profiles — Build 93

FP, FL1, FL2, UP and UL each own their application layout. Edit the orientation's declarations in `foundation/layout.css` for composition, tracks, card dimensions, spacing, alignment and scrolling. Scope environment-specific values to that same profile with `data-viewport-mode="Native-sized"` or `data-viewport-mode="Safari-sized"`. The matching entries in `foundation/layout.js` select navigation, the rest-timer presentation and calibration mapping for each environment. The component CSS supplies shared defaults and consumes the selected profile's values.

Unknown viewport sizes use the existing stacked or wide fallback. Ambiguous FL1 / FL2 angles use the wide fallback with the existing conservative folded geometry. Posture and segments remain visible in diagnostics, with no automatic book/laptop switch for application composition. The older builds below record that superseded behavior.

Automated coverage exercises all ten orientation and viewport-mode combinations in Chromium and Playwright WebKit. A live FL1 edit checks isolation of card tracks, spacing, content alignment and Safari-only padding. A Chromium comparison with Build 92 found no differences in the measured bounds or overflow across seven screens in all ten cases. Physical Duo Safari and SwiftUI remain unverified.

## Reference calibration and build history

Use live drawable viewport, safe areas and posture/segments; never uniformly scale UI. Recorded Safari exclusions: FP right 84, FL1 left 84, FL2 right 84, UP top 82, UL right 84 pt; verify on device. Native independent. Shared 44pt headline row, reference center 48pt; historical Build 185 maps FP to master FL1 X, FL1/FL2 to master Y (FL2 mirrored), UP/UL default 48. Build 186 native FL1 headline inset 84 and content inset 16; Safari subtracts excluded rail and clamps to zero. Build 189 compact landscape zero Safari leading inset. Prior conversation records native FL1 card anchor 29.5; conflicts with older 16, unresolved pending source/device verification. Landscape dashboard 40:60 tracks; use intrinsic sizes and independent scroll regions. Preserve state on rotation; no transient layout snap. Breakpoints are heuristics, not hardware values.

## Build 6 — calibration screen
Shared headline and content anchors from canonical hardware geometry. FL1 Safari local X0 for both, native targets X84/29.5; no second viewport exclusion. Other orientations use recorded X16, local center Y48. Landscape 2:3 grid after gap; portrait stacks. Purple/green outlines are CSS element guides, not full diagnostic system. No native simulator or camera overlay yet; manual override does not emulate a physical viewport. Unmatched sizes use generic fallback. No rotation animation. Device validation pending.

Build 6 user feedback (2026-11-26): user reported “You nailed it” after the calibration screen was delivered. Record positive user acceptance of the layout screen; individual orientation measurements, auto-update and transition tests were not explicitly reported. Green outline denotes content boundary; purple denotes headline boundary.

## Build 7 — posture response
User reported Hinge = Book when partially folded. Existing detection therefore works for book posture on their Safari device. Added book two-column and laptop stacked sample layouts, with posture-specific labels. Book uses viewport segment boundary when exposed, otherwise approximate equal tracks; not a calibrated hinge gap or full segment-safe layout. Laptop detection and layout not yet device confirmed. No new motion or rotation changes.

Build 7 user confirmed hinge response working; precise segment clearance and laptop testing remain unverified.

## Native-first page design (approved 2026-11-26)
Design and review each page for Native and Safari together across FP, FL1, FL2, UP and UL, including relevant hinge and application states. Native is the primary design target; Safari is the working web test environment. Share semantic tokens, components, content hierarchy and interaction logic; keep environment-specific layout anchors, exclusions and navigation rules independent. Do not constrain native designs to Safari's unavailable regions or assume native safe areas are zero. Retrieve approved hardware SVGs and calibration before previews. Record approval and unresolved measurements per page before advancing. Native previews are simulations until validated in SwiftUI on device; Safari viewport-size detection is not native runtime detection. Home is the first page to review. This policy does not authorize changes to existing calibrated geometry.

## Build 16 — approved FP headline refinement
FP Native and Safari target: leading signature X16 pt, signature top Y16 pt, center Y32 pt, signature height32 pt; headline moves up16 pt independently of content flow. Other orientations retain prior anchors. Build label follows shared headline, derived from build metadata. User approved visual proposal; device validation pending. Native is a reference target, not a verified SwiftUI layout.

Build 17: user reverted FP center to Y48, signature top32, X16, aligned with camera center. Supersedes Build16 FP Y32. Tagline FP visual top moved up6 CSS px without moving cards; exact 8pt glyph gap requires device verification. Diagnostics simplified to icon-free settings rows and switches, separate Measurements/Calibration/Device information views. Native reference selector only inside Measurements. Experimental headline offsets ±24 CSS px, 0.5 increments, saved per detected orientation and viewport mode; manual/unmatched calibration disabled. Native runtime not implemented. No physical geometry changes.

Build 18: user approved single-page Diagnostics. Removed Measurements and Calibration UI, unloaded experimental offset engine and restored fixed approved layout tokens (FP center Y48). Old local offsets are ignored. Live device information is inline; automatic orientation only. Guide preferences retained, subordinate switches disabled while master is off. Native reference selector removed; measurement labels remain on overlay. Device testing pending.

Build 21: Home headline remains in normal document scroll flow (existing relative calibration retained); local weekday and date at trailing edge, hidden on other pages. ONE Home source reference: src/index.js, adapted blue ready-to-train card and training streak weekday layout to FORM tokens, preserving 40:60 landscape grid and navigation. No fabricated training data; scheduling and streak calculations await workout engine. Date uses browser locale and local time. Device scroll, camera clearance and date fit pending verification.

Build 22: user approved fixed camera-aligned headline, bold weekday and regular secondary date, and stationary two-card Home without recent workouts. Shared shell now uses viewport-height flex layout with independent content scrolling only when needed; headline remains outside scrolling region. Home build label hidden for clean date composition; other pages retain it. Existing calibrated anchors and dock rules unchanged. Diagnostic overlay listens to content scrolling. Weekday markers capped at existing 40pt spacing token to avoid oversized circles on unfolded displays. Physical fit and scroll behavior pending device testing.

Build 24: Home dashboard cards resized to a balanced 176px minimum-height baseline with responsive 45:55 landscape weighting, compact week indicators and improved internal spacing. Removed Personal best / 18 weeks row entirely. Streak uses standalone orange Lucide trophy; weekday markers remain neutral until backed by actual/demo workout records. No fabricated streak or completion history. Ready-to-train card retains primary blue emphasis. Device fit and responsive behavior require physical Duo validation.

Build 25: restored the visible Build label on Home beside FORM. Kept the date right-aligned; build label remains subtle metadata and does not replace the date. Added regression test preventing Home build label from being hidden.


## Build 26 — Home foundation cleanup
Consolidated Home component styling into one authoritative block in foundation/pages.css. Preserved shell.css, geometry.js, orientation.js, posture.js, layout.js, navigation.js and calibration.js unchanged. Restored personalized Home greeting, responsive workout/streak cards, orange completed-day states and date headline/build metadata. Added isolated local-only Demo Mode with a deterministic rolling 365-day sample dataset, six sample routines and completed workout history. Demo mode is opt-in and persists in localStorage; turning it off restores real-data empty states. Sample records are generated in memory and never written into real user data. Native runtime remains unimplemented; browser preview is Safari only. Device verification pending.


## Build 27 — Shared fixed headline and compact date
Reduced Home date typography to 14 pt weekday and 10 pt calendar date. The shared headline remains a non-scrolling flex item outside the single content scroller, so page headlines remain stationary across Home, Workouts, Progress, Profile and Diagnostics. The weekday/date block is centered in the headline's fixed height and right-aligned. Removed duplicate Demo Mode script includes and duplicate Demo Mode setting row discovered in the current HTML. Hardware geometry, orientation, calibration and navigation sources were not modified. The requested blue alignment lines remain a design/diagnostic visualization and are not permanently rendered in the app.


## Build 28 — single scroll owner
Locked html and body to the viewport with overflow hidden and overscroll containment. Constrained #shell to the dynamic viewport and retained its existing orientation-aware navigation clearance. The calibrated shell remains a fixed-height flex column: the headline is a non-shrinking fixed-height row, while .content is the sole vertical scroll container with a zero flex basis and min-height:0. Preserved the existing calibrated headline offset, date sizing, safe-area and Duo geometry tokens. Added regression coverage for root scroll locking and the single internal scroll owner. Real Safari rubber-band/visual-viewport behavior and Duo hardware still require device validation.


## Build 29 — Headline glass fade
Added an 18px translucent backdrop-blur fade immediately below the shared headline using a pointer-events-none ::after layer. The strip overlays the top edge of the scrolling content, allowing content to soften as it passes underneath. It does not participate in layout and does not change the calibrated headline height, headline position, content scroll ownership, safe areas, navigation, or device geometry. Includes a CSS fallback for browsers without backdrop-filter and a regression test for the effect.


## Build 30 — Correct frosted headline boundary
Removed the narrow blur strip extending below the headline. The frosted glass now belongs to the full shared headline bar itself, with a translucent canvas surface and 18px backdrop blur/saturation. A subtle 1px bottom separator defines the bar's lower boundary. The effect ends at that line; no blur layer extends into page content. Headline dimensions, fixed scrolling architecture, orientation offsets, and navigation are unchanged. Includes a CSS fallback when backdrop-filter is unavailable.


## Build 31 — Content scrolls behind frosted headline
Corrected the frosted-header implementation: the content scroller now overlaps the headline's layout slot by exactly the headline height, while equivalent top padding preserves the original initial content position. As the content scrolls, cards and text pass underneath the stationary headline and its translucent 20px backdrop blur, making the blur visibly functional. Headline remains above content with z-index 30; its bottom separator defines the edge. Preserved the single-scroll-container model, headline height, calibrated offset, date typography, device geometry and navigation. Automated CSS regression test covers the overlap and backdrop filter. Safari visual verification on physical Duo remains required.

Build 32: user screenshot confirms Build 31 glass not visibly working. Replaced conflicting glass rules with separate absolute full-width material layer from drawable top to calibrated headline bottom, independent transparent foreground, and full-height scroll pane with initial top padding. Removed isolation from headline and obsolete blur tests; retained existing geometry and dock. Tint and blur chosen provisionally for Safari visual testing. Physical compositor behavior unverified.


### Build 32 — user-approved headline material
User confirmed the visible glass effect in a folded-landscape device screenshot and expressed approval. Retain the independent headline material layer, translucent 35% canvas tint, 10px backdrop blur, saturation 1.4, stationary foreground and subtle bottom separator as the shared web headline material baseline. This is a Liquid Glass-inspired web treatment, not native Apple Liquid Glass. Other orientations and dark appearance still require visual validation. Documentation-only approval; no application build increment.


## Build 33 — FORM Glass refinement
User approved progressive glass edge, removal of separator and matching dock material. Retained Build 32 independent material geometry, 35% headline tint and 10px/1.4 filter; feather final 12 CSS px using a mask (progressive opacity, not variable blur radius). Dock uses same filter, 64% light/72% dark tint and inset highlight without changing navigation geometry or scroll clearance. No additional scroll overlap behind dock was introduced; its visible blur depends on underlying content. Reduced-transparency and unsupported-filter fallbacks provided. Material values provisional until physical Safari review. No geometry or navigation logic changes.


Build 34: user screenshot shows readable History text overlapping headline in Build 33. The existing material already begins at drawable top, so extending upward is impossible without moving geometry. Instead extend the material 24 CSS px toward incoming scrolling content, with a 24px feather entirely below the calibrated headline row. Keep original full blur and tint over the headline, and retain headline position, content initial padding, dock and hardware geometry. No-filter and reduced-transparency fallbacks retain original bar height. Provisional visual tuning; physical Safari validation pending.


Build 35: approved stronger headline frosting (20px blur, 65% tint in both themes) with existing 24px feather and lead. Separate headline filter token preserves dock material. Content initial padding includes glass lead so section headings start beyond material at rest; scrolling remains underneath. Headline signature, geometry, navigation, typography and separator-free treatment unchanged. Physical Safari visual and fit validation pending.


Build 37: user requested equal Home dashboard occupancy of remaining drawable content area. Home alone expands to full available content width and height after tagline/greeting and existing glass/navigation clearances. FP/UP stack equal flexible rows; FL1/FL2/UL use equal flexible columns via calibrated landscape flag; book uses two columns and laptop stacks. Existing card minimum heights protect content, with scrolling fallback if intrinsic content exceeds available space. Equal sizing supersedes previous 45:55 weighting for Home only. No changes to headline, glass, navigation, orientation or geometry sources. Physical fit pending Safari review.


Build 38: user approved equal Home cards and a 12pt card-to-dock gap. Home uses live dock bounding-box clearance rather than cumulative glass reserve; preserves 12px card gap and uses 12px tagline-to-greeting and greeting-to-dashboard gaps. Card internal padding remains 16px. Added Home-only live diagnostics for headline/tagline/greeting/card/dock distances and card insets under existing Content and cards setting. Headline glass clearance retained, nav geometry unchanged. Equal tracks may grow to fit intrinsic content on compact layouts. Device validation required; CSS px measurements are not independently verified physical points.


Build 44: user screenshot of Build 43 shows bottom streak card fading despite stationary Home layout. Home scroll-edge material is transparent by default; enable only in bottom-dock mode when live dashboard bounds intersect the dock's vertical region and the content pane has actual scroll overflow. Re-evaluate on scroll, resize, page/orientation/posture changes and ResizeObserver. Rail Home does not use surrounding edge frosting because it has no horizontal content scroll. Other pages retain prior scroll-edge material; dock capsule and selection lens remain unchanged. No changes to geometry, card clearance, weather or navigation gestures. Reduced-motion removes opacity transition. Physical Safari review pending.


Build 45: user requests removal of all headline blur effects. Shared headline backing is now solid canvas with no backdrop filter, gradient tint or feather mask; retains existing height and initial content clearance so scrolling text cannot overlap foreground headline. Atmosphere artwork remains independent above backing. Navigation materials, dimensions, gestures and Home sizing unchanged. Visual device verification pending.


Build 50: portrait training layout refinement (FP/UP, including Safari and native-sized reference): combine back/edit and minimize/finish into compact shared toolbars, full available width, tighter overview spacing, flexible independent exercise scroll, pinned action and measured dock reserve, narrow set grid and compact timer controls. Outer scrolling fallback for insufficient height. Landscape split and existing geometry untouched except shared toolbar compaction. No user screenshot identifying exact defect; changes target source-observed excessive vertical controls and constrained exercise space. Physical portrait verification pending.

## Build 88 — UP active workout
User screenshot of Build 87 reported the signature still visible and excess top space. UP active workout hides the signature in both viewport modes. Safari-sized UP maps physical headline center 130 pt to drawable center 48 CSS px (82 pt excluded above viewport); content and material follow the local anchor. Other screens and orientations retain existing calibration. Device confirmation remains outstanding.

## Build 90 — Workout CSS consolidation
One workout drawable headline center controls headline, material and content clearance. UP Safari-sized retains the calibrated local center; other layouts retain their existing headline targets. Content begins at the center plus half the headline height plus the existing 8-point spacing token in all workout orientations. Removed obsolete volume, live-dot, old time-row and conflicting exercise visibility rules. Atmosphere scheduling is suspended during workouts and resumes on exit. Physical device verification remains outstanding.

## Build 91 — FL1 Safari workout left inset
User Build 90 landscape screenshot shows an estimated physical headline X168 pt, consistent with the 84 pt Safari exclusion plus an erroneous 84 pt local margin. In matched FL1 Safari-sized active workouts, map the existing physical X84 headline/content anchors to drawable X0; retain native and all other orientation anchors, right timer rail and hardware geometry. Screenshot classification is inferred; confirm orientation, viewport dimensions and physical alignment on device after release. Browser regression measures local X for both headline and content across ten matched viewport cases.
