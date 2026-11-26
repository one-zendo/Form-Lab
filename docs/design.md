# Design
FORM — Train with focus, follow your progress. Apple-inspired, calm, focused, private, progressive disclosure. Inter; wordmark 28/700, large title 34/700, page 28/700, section 22/650, headline 17/600, body 17/400, supporting 15/400, caption 12/400; tabular numerals for workout values. Official Lucide only, 1.75 stroke; default 24, Profile 20, chevron 18, action 18; dock 20 or 22 unresolved. Spacing 4/8/12/16/20/24/32/40/48; radii 8 small, 12 control, 20 card, 24 dialog, full pill. Minimum target 44; dialog max 360, primary action 48. Default canvas #F2F2F7, paper #FFFFFF, ink #000000, muted #636366, action #0066CC, brand #0088FF, danger #D51028, insight #B02FC2, elevated #E5E5EA. Graphite Lime canvas #17171F, paper #24242E, elevated #30303C, ink #F5F5F5, muted #A3A3A3, action #B0FF00, danger #FF6961. White on light action, graphite on lime. Rest timer blue #0088FF; completion roles differ by theme and context; reconcile historical exceptions before implementation. WCAG AA, scalable type, focus and non-color cues. Buttons Title Case; headings sentence case. Shared components, no arbitrary local tokens. Preserve detailed approved component decisions in archive/design-history.md; reconcile before rebuilding. Artwork RepDB Standard only with verified license. No fake workout data.

## Component and artwork references
# FORM universal components

Build 173. Use form-page, form-grid, form-stack, form-card for layout; form-button for filled primary actions, form-secondary for raised secondary actions, form-icon for square icon buttons, form-input for fields, form-section-heading for section titles, form-numeric for tabular figures. Use native semantic elements and accessible names. Existing workout button/input selectors share the same declarations and remain for compatibility. New variants are opt-in; do not change existing controls or add arbitrary colors, spacing or motion. Existing headlines.css and FormUI.icon/dayIndicator remain authoritative implementation for current headings and icons. Dialogs, menus, timer and additional component migrations remain future work. DESIGN_SYSTEM.md defines intended standards; current runtime values are preserved where different (body type, icon defaults, dialog sizing, motion aliases). No global motion changes.

## Interaction surfaces (174)
Use native dialog.form-dialog for new centered dialogs; add form-sheet for bottom-aligned sheet geometry. form-menu provides grid spacing; form-selection supports aria-pressed/current and existing color-motion tokens. Existing five dialogs carry form-dialog-legacy to preserve their exact sizing, borders and backdrop until individually migrated. Page navigation menu shares form-menu. Native showModal/close and existing handlers unchanged. No custom sheet animation or focus trap introduced.

## Build 175 audit
Shared focus-visible outline now covers universal input fields. Existing modal dimensions and motion aliases retained pending browser validation. Lab viewport outline shares diagnostic border tokens, fixed to viewport, non-interactive, hidden in diagnostic mode to avoid duplicate outlines. Native modal top layer can cover/dim it; no layout reservation.

# Exercise artwork integration

RepDB Standard is the approved provider. No paid assets, preview assets, or vendor dataset are included. RepDB supplies downloadable files rather than a hosted API (https://repdb.co/). Confirm the commercial license and serving arrangement before importing.

FORM's immutable exerciseId is independent of RepDB's ID. Existing name-only records remain compatible and show the existing exercise icon. Do not infer identity by matching names. A future catalog importer maps FORM IDs to licensed asset paths explicitly. Example synthetic manifest entry: { "exerciseId": "form-example", "male": { "start": "stills/example.webp", "peak": "stills/example-peak.webp", "animation": "animations/example.webp" } }. Optional female entries use the same structure. Call FormArtwork.configure(entries, approvedBaseURL) then FormArtwork.mount(container, exercise, options). Use animation only on demand; reduced motion selects a still. Missing and failed images retain the fallback. No network request occurs before configuration. The current routine-detail markup exposes the component slot; actual catalog selection and mounting lifecycle are future work. Do not commit vendor files to this public repository.

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
