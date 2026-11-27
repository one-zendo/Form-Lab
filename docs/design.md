# Design
FORM — Train with focus, follow your progress. Apple-inspired, calm, focused, private, progressive disclosure. Inter; wordmark 28/700, large title 34/700, page 28/700, section 22/650, headline 17/600, body 17/400, supporting 15/400, caption 12/400; tabular numerals for workout values. Official Lucide only, 1.75 stroke; default 24, Profile 20, chevron 18, action 18; dock 20 or 22 unresolved. Spacing 4/8/12/16/20/24/32/40/48; radii 8 small, 12 control, 20 card, 24 dialog, full pill. Minimum target 44; dialog max 360, primary action 48. Default canvas #F2F2F7, paper #FFFFFF, ink #000000, muted #636366, action #0066CC, brand #0088FF, danger #D51028, insight #B02FC2, elevated #E5E5EA. Graphite Lime canvas #17171F, paper #24242E, elevated #30303C, ink #F5F5F5, muted #A3A3A3, action #B0FF00, danger #FF6961. White on light action, graphite on lime. Rest timer blue #0088FF; completion roles differ by theme and context; reconcile historical exceptions before implementation. WCAG AA, scalable type, focus and non-color cues. Buttons Title Case; headings sentence case. Shared components, no arbitrary local tokens. Preserve detailed approved component decisions in archive/design-history.md; reconcile before rebuilding. Exercise cards use the local Lucide placeholder only; external artwork is disabled. No fake workout data.

## Component and artwork references
# FORM universal components

Build 173. Use form-page, form-grid, form-stack, form-card for layout; form-button for filled primary actions, form-secondary for raised secondary actions, form-icon for square icon buttons, form-input for fields, form-section-heading for section titles, form-numeric for tabular figures. Use native semantic elements and accessible names. Existing workout button/input selectors share the same declarations and remain for compatibility. New variants are opt-in; do not change existing controls or add arbitrary colors, spacing or motion. Existing headlines.css and FormUI.icon/dayIndicator remain authoritative implementation for current headings and icons. Dialogs, menus, timer and additional component migrations remain future work. DESIGN_SYSTEM.md defines intended standards; current runtime values are preserved where different (body type, icon defaults, dialog sizing, motion aliases). No global motion changes.

## Interaction surfaces (174)
Use native dialog.form-dialog for new centered dialogs; add form-sheet for bottom-aligned sheet geometry. form-menu provides grid spacing; form-selection supports aria-pressed/current and existing color-motion tokens. Existing five dialogs carry form-dialog-legacy to preserve their exact sizing, borders and backdrop until individually migrated. Page navigation menu shares form-menu. Native showModal/close and existing handlers unchanged. No custom sheet animation or focus trap introduced.

## Build 175 audit
Shared focus-visible outline now covers universal input fields. Existing modal dimensions and motion aliases retained pending browser validation. Lab viewport outline shares diagnostic border tokens, fixed to viewport, non-interactive, hidden in diagnostic mode to avoid duplicate outlines. Native modal top layer can cover/dim it; no layout reservation.

# Exercise artwork integration

Build 82: user approved removing all external exercise artwork integrations. Keep the local Lucide workout icon in existing thumbnail slots. No external exercise catalog, image requests, provider mappings or artwork audit. Future artwork requires explicit approval and verified rights.

# FORM — Mandatory design system rules

Applies to every new or modified page, component, dialog, sheet, and interaction.

1. FORM's global semantic design and measurement tokens are the source of truth. Use shared tokens for colors, typography, spacing, padding, radii, dimensions, icons, elevation, touch targets and motion. Do not duplicate hardcoded values in components; define or extend semantic tokens centrally when necessary.
2. Requests to copy or reference One mean adapt its visual composition, hierarchy, layout and interaction patterns to FORM's own tokens and independent implementation. Never import One's styling or measurements wholesale.
3. Components must adapt to available content space, folded/unfolded screens and orientations. Prefer content-driven sizing, shared responsive tokens and flexible layouts.
4. Preserve the approved Build 78 Duo navigation geometry and current viewport, gesture and update behavior. Do not modify these protected foundations as a side effect of page work. Existing dock geometry is a documented exception to generic measurement rules.
5. Before committing, inspect new/modified styles for hardcoded design values, check token references, validate JavaScript syntax, and verify that protected shell behavior is unchanged. Report any exceptions and any device tests not performed.
6. Treat literal zero, percentages, intrinsic sizing keywords, structural grid fractions, and necessary device-specific geometry as layout mechanics rather than arbitrary design values. Document intentional exceptions.

Baseline: Build 83 adaptive measurement system. Read the current source before implementing changes.

# ONE UI alignment
Reference: one-zendo/One@e4a038bc5556f53e6ea25ca9953d5c7750675471, src/index.js, src/styles.css, src/browser.js.txt. Adapted routine list selection marker, 76px card hierarchy, shared routine detail/edit header, collapsible exercise cards, compact set rows, inline picker. Lab retains its data and layout engine. Rest remains seconds, set type and replacement controls are retained; active workout picker remains modal. No claim of pixel parity; device testing required.

## Build 4 — Stage 2 foundation
Implemented foundation/tokens.css and migrated temporary shell styling to shared tokens. Native-first design, Safari-only current device testing; native/PWA runtime detection deferred. Inter uses system fallback until font assets are approved. Dock icon size and completion color conflicts remain unresolved and intentionally not implemented. Graphite Lime tokens available but no theme switch yet. Motion values defined, no rotation animation or posture behavior changes. Temporary shell width 420px remains a diagnostic-only structural exception. Browser verification pending.

## Build 9 — component playground
Shared card, stack, grid, primary/secondary buttons, numeric inputs, selection, native dialog/sheet, expandable details and deadline-based sample timer. Test-only inputs and timer are ephemeral and may reset on deployment reload; no workout records created. Swipe/drag, production timer persistence, sheet animation and full hinge-safe modal positioning deferred. Backdrop and focus outline are provisional structural visual values. Existing shell/navigation/posture code unchanged. JS parsed; device testing pending.

## Build 10 — approved measurement refinements
Retain existing baseline. Add optional 56 CSS px workout action height (timer playground demonstrates it), 150ms immediate button feedback, 480 CSS px maximum dialog width on flat UP/UL; compact and partially folded postures retain 360 maximum. Expanded width is a new design choice within user-approved adaptive sizing, not a measured device calibration. Centralize focus and backdrop tokens. Exact hinge-safe modal placement remains pending. Browser/device verification required.

## Build 19 — design compliance gate
Official Lucide 0.456.0 SVGs and ISC license vendored from upstream; dock inline geometry matches these assets, with FORM stroke token 1.75 and existing 20px dock size preserved provisionally (20/22 conflict unresolved). No external runtime dependency. CI checks dock geometry, icon tokens, build metadata and JS syntax. New icons must be sourced from pinned official assets and added to compliance coverage. Before every commit review canonical design, layout, motion, accessibility and protected shell behavior; document exceptions and run relevant tests. Static checks do not replace visual/device review. CI is not confirmed a required branch protection gate.

## Build 20 — Workouts icon
User approved official Lucide biceps-flexed replacing dumbbell. Existing dock sizing, stroke and behavior unchanged. Compliance test updated; prior vendor asset retained for future use.


## Proportional composition (approved 2026-11-26)
Every interface must use deliberate proportional relationships, consistent alignment and shared spacing tokens. Measure actual rendered distances between adjacent components, internal padding, card dimensions, and clearance to fixed navigation; distinguish measured bounds from target tokens. Equivalent relationships use equal spacing, not arbitrary offsets. Distribute remaining drawable space according to approved page proportions (Home equal cards), preserving minimum content size, safe areas, accessibility and hardware calibration. Avoid double-reserving visual glass regions; material overlays are independent from layout. Validate across all five orientations and environments before claiming visual approval; use live DOM diagnostics in Safari and native measurements when implemented. No uniform scaling or forced equal spacing between semantically different groups.


## Build 39 — Liquid Glass-inspired material hierarchy
Web: scroll edges use directional canvas tint gradients, existing 20px blur and 24px feather. Floating dock uses a distinct 16px/1.65 backdrop filter, translucent fill, directional specular gradient, inset rim and subtle depth, with translucent selected and pressed states. Light and Graphite Lime tokens and reduced-transparency fallback provided. All geometry and content spacing remain unchanged; effects are CSS simulations, not real optical refraction, native dynamic lighting or glass morphing. Provisional visual values require device testing.
Native: prefer system NavigationStack/toolbars and TabView for platform Liquid Glass; use safeAreaBar(edge:alignment:spacing:content:) and scrollEdgeEffectStyle(_:for:) for custom scroll-edge treatments. Where custom Duo dock geometry is necessary, use glassEffect(_:in:) with Capsule and GlassEffectContainer for grouped glass controls; use interactive glass/button styles where appropriate. Preserve approved orientation and proportional layout rather than assume standard TabView matches calibration. Avoid layering custom CSS-like backgrounds over system materials. Respect system accessibility preferences. No native implementation or compile verification yet.
References: https://developer.apple.com/documentation/technologyoverviews/adopting-liquid-glass and https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views .


## Build 42 — FORM Atmosphere
Profile > Themes > Weather themes: Soft Sculptural + Ambient Light (default style), Ambient Light, Orbital, Off. Independent Home-only canvas weather layer behind stationary headline, no change to calibrated anchors or normal card/dock spacing. Weather themes require explicit live location opt-in each session or diagnostic preview. Open-Meteo coordinates rounded to two decimals, held in memory only; provider attribution in menu. Current conditions and sunrise/sunset used for day phase, refresh on Home/visibility and 15-minute interval. Diagnostics > Atmosphere testing exposes Home cycle button, five conditions and time override. Preview is explicitly labelled and overrides live weather; no network needed. Preview control reserves temporary content space only while enabled. No claim of native WeatherKit integration, actual 3D geometry, low-power detection or live browser verification. Native target WeatherKit with permission and system accessibility/power preferences.


Build 43: user requested original Atmosphere concept shown in screenshot as additional selectable weather theme. Soft Weather (Original) retains translucent overlapping circular clouds, diffuse gray-blue glow, drifting sun with rotating rays, rain streaks, snow particles and moon/stars. Extends decorative fade behind tagline/greeting without changing layout or existing three styles. Same live source, diagnostics, time phase, preference persistence, reduced-motion and visibility behavior. Original preview adapted proportionally to available canvas; pixel parity and physical device rendering not verified.


Build 45 overrides prior headline glass treatment: plain opaque canvas behind all stationary headlines, no headline backdrop blur or feather. Weather artwork retains its own artistic gradients; navigation Liquid Glass remains separate. Preserve calibrated anchors and spacing.


Build 46: Build 45 screenshot confirms crisp streak card but gray halo around original weather sun. Remove diffuse glow from Soft Weather (Original) scenes; retain animated objects and particles. Other weather styles retain intentional ambient lighting but use same-hue zero-alpha gradient endpoints instead of transparent black. Adjust original celestial vertical anchor to reduce top clipping. No layout, headline backing or navigation changes. Device rendering pending.


Build 47: user selected original Soft Weather as sole permanent weather artwork, at 80% of Build 46 object scale. Remove other theme renderers and theme menu; Profile > Preferences has persistent Weather animation master switch, default on, separate explicit location permission button. Migrate prior diagnostic settings and Off state from v1. Persist enabled state and successful local-weather opt-in in v2 localStorage; reacquire coordinates with browser permission on later sessions, never persist coordinates. Off stops animation and requests; preview remains separately controlled in Diagnostics and only displays when enabled. No gray halo; unchanged normal headline/dashboard geometry, navigation, and reduced-motion support. Browser permission/storage behavior and physical fit pending verification.


Build 49: extend original Soft Weather at 80% to every app page through the existing shared decorative layer, including Diagnostics and training screens. Keep one continuous scene across navigation, persistent master switch, no halo, stationary headlines and unchanged ordinary layout. Diagnostic cycle control available across pages with temporary clearance; live fetch throttled to 15 minutes across page switches, except retry after failure. Premium label in preferences; Lab-only access without billing. Physical contrast, compact headline fit, Safari performance and native behavior unverified.

## Build 86 — Routine performance
User approved 12-week default, 1/4/12-week and trailing 365-day windows, period navigation, metric selection, direct chart scrubbing and period session count/average/best. Windows use local calendar dates with inclusive boundaries; previous-week comparison is the latest comparable session in the preceding Monday–Sunday week. Existing dataset isolation and history retained. Chart uses existing 125 CSS px plot and semantic control tokens; SVG coordinates and stroke/opacity are chart mechanics. Compact portrait uses independently scrolling overview and exercise list with existing fixed action/dock clearance. Physical fit, native implementation, haptics and spring transition remain unverified/not implemented. No hardware geometry changes.

## Build 87 — Active workout efficiency
User approved live duration, completed-set volume and set count, previous matching exercise performance, editable rest seconds and notes in expanded cards. Notes persist with session/history; rest changes apply to unfinished sets only. Previous values use the most recent matching detailed session within the active dataset; missing details are not fabricated. Preserves calibrated headline anchors and existing rest rail, artwork and storage. Excess headline whitespace requires device measurement; physical layout and native behavior remain unverified.

## Build 89 — Focused active workout
Approved compact headline with duration and Finish, no live volume readout, compact set/exercise progress, no weather artwork, expandable rest/note fields, and all exercises expanded by default. Individual collapsed state persists in the active session. Landscape retains exercise selection rail and allows all exercise cards in the scrolling list. Uses existing calibrated anchors and semantic spacing; exact physical fit remains pending. Volume calculations for history remain unchanged.

## Build 92 — Navigation motion
User reported jerky dock swiping. Preserve the approved dock geometry and existing navigation axes. Relative finger tracking avoids a pointer-down jump; interpolated tab tint follows fractional lens position. A frame-driven damped spring settles on release with bounded velocity; new gestures interrupt it. Reduced-motion setting snaps selection without settling animation. Browser tests cover horizontal/vertical tracking, release selection and keyboard operation. Actual touch smoothness on Duo remains to be confirmed.
