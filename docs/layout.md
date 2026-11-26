# Layout
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
