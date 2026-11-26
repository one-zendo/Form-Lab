# FORM — Design System & Motion Tokens

**Source of truth:** FORM Lab's `DESIGN.md` and this token specification  
**Transfer target:** `one-zendo/Form-Lab`  
**Baseline reviewed:** 2026-11-25

This document records FORM Lab's approved visual principles, semantic design tokens, and motion rules. ONE is a visual reference only, not an implementation or token authority. Update this document and Lab's implementation together when approved values change. Do not invent parallel component styles or motion values.

## 1. Design principles

1. **Focus over decoration.** The interface supports the workout; it does not compete with it.
2. **Clarity over density.** Show essential information first; reveal advanced details contextually.
3. **Consistency over novelty.** Reuse shared tokens, components, iconography, and interaction patterns.
4. **Effortless logging.** Minimize taps during active training; preserve workout state and scroll position.
5. **Personal progress, privately.** No social feed, public leaderboard, or unnecessary engagement mechanics.
6. **Reliable by default.** Offline-capable workout flows, automatic saving, recovery after interruption, and no silent data loss.
7. **Accessible by default.** Minimum 44px touch targets, scalable type, visible focus, screen-reader labels, semantic non-color cues, and reduced-motion/transparency alternatives.
8. **Adaptive, not duplicated.** Share one component system and behavior across compact/folded, unfolded portrait, and unfolded landscape layouts. Adapt composition only when available space requires it.

## 2. Visual identity

- Product wordmark: **FORM**, uppercase, no terminal period.
- Tagline: **Train with focus, follow your progress.**
- Typeface: Inter variable, weights 400 / 600 / 700; use tabular numerals for timers, weights, and reps.
- Icons: official Lucide assets only; 24px default, 1.75px stroke, rounded caps and joins. Contextual sizes: Profile rows 20px, dock 22px, settings chevrons 18px, small action glyphs 18px. Keep accessible names on icon-only controls.
- Use spacious layouts, clear hierarchy, subtle separators, restrained translucent surfaces, and no decorative gradients or arbitrary shadows.

## 3. Foundation tokens

### Typography

| Token / role | Value |
|---|---:|
| Wordmark | 28px / 700 |
| Large title | 34px / 700 |
| Page title | 28px / 700 |
| Section heading | 22px / 650 |
| Headline / card title | 17px / 600 |
| Body | 17px / 400 |
| Supporting | 15px / 400 |
| Caption | 12px / 400 |
| Control | 14px |
| Dialog title | 18px / 600 |

Use the shared headline treatment for primary page titles. Scale type with accessibility settings; do not shrink touch targets to fit content.

### Spacing

Use a four-point spacing scale. Canonical values: **4, 8, 12, 16, 20, 24, 32, 40, 48px**.

### Geometry

| Token | Value |
|---|---:|
| Small radius | 8px |
| Control radius | 12px |
| Card radius | 20px |
| Dialog radius | 24px |
| Floating pill radius | 999px |
| Minimum touch target | 44px |
| Standard header row | 44px |
| Dialog max width | 360px |
| Primary dialog action height | 48px |

Content cards use 20px radius; controls and primary buttons use 12px; compact set inputs use 8px. Do not add component-specific radius values outside this scale without an approved exception.

## 4. Semantic color tokens

Themes: **Default** and **Graphite Lime**. Components consume semantic roles rather than hard-coded colors.

### Default / light

| Role | Value |
|---|---|
| Canvas | `#F2F2F7` |
| Surface / paper | `#FFFFFF` |
| Primary text | `#000000` |
| Secondary text | `#636366` |
| Primary action (web contrast) | `#0066CC` |
| Brand blue | `#0088FF` |
| Success (web contrast) | `#007A30` |
| Insight purple | `#B02FC2` |
| Danger (web contrast) | `#D51028` |
| Elevated surface | `#E5E5EA` |

### Graphite Lime / dark

| Role | Value |
|---|---|
| Canvas | `#17171F` |
| Surface / paper | `#24242E` |
| Elevated surface | `#30303C` |
| Primary text | `#F5F5F5` |
| Secondary text | `#A3A3A3` |
| Action / brand accent | `#B0FF00` |
| Danger | `#FF6961` |
| Rest timer | `#0088FF` |
| Success | `#30D158` |
| Warning | `#FFB340` |
| Insight | `#B69CFF` |

### Semantic exceptions and rules

- Primary action and selected navigation use the theme's action accent. Filled lime actions use graphite foreground `#17171F`; light blue actions use white foreground.
- Rest timer blue remains independent of theme action color.
- Completion, recovery, warning, destructive, and insight states retain their own semantic roles. Never use the action accent as a substitute for every status.
- Use WCAG AA contrast targets (4.5:1 for normal text). The existing small white-on-blue timer text is a documented contrast exception to re-evaluate; do not propagate that exception to new components.
- Native Apple implementations should use dynamic semantic system colors where appropriate rather than fixed web hex values.

## 5. Motion system

Motion is restrained, purposeful, and reversible. Prefer short transitions that communicate state changes without distracting from training. Preserve state, scroll position, and timer deadlines throughout transitions.

### Canonical motion tokens

These values are transferred from the source stylesheet. Use the named tokens instead of introducing local durations.

| Token | Duration | Intended use |
|---|---:|---|
| `--motion-fast` | 180ms | Fast feedback / short state changes |
| `--motion-tab` | 220ms | Tab and selection transitions |
| `--motion-glide` | 230ms | Gliding movement |
| `--motion-swipe` | 260ms | Swipe feedback |
| `--motion-collapse` | 280ms | Collapse and glyph morph |
| `--motion-back` | 280ms | Back transition |
| `--motion-edit` | 300ms | Inline editing |
| `--motion-standard` | 320ms | Standard content transition |
| `--motion-sheet` | 350ms | Sheet / inline expansion |
| `--motion-settle` | 550ms | Settling emphasis |
| `--motion-celebrate` | 650ms | Completion celebration; use sparingly |
| `--motion-drop` | 200ms | Drop / release interaction |

### Interaction timing guidance

| Interaction | Approved range |
|---|---:|
| Button feedback | 100–150ms |
| Selection | 180–250ms |
| Inline expansion | 250–350ms |
| Exercise swaps / screen transitions | 300–400ms |
| Partner content transition | 320ms |
| Partner glyph morph | 280ms |

The guidance ranges describe perceived interaction classes; the named tokens above are the implementation source of truth. Choose the closest shared token rather than creating a new duration.

### Easing tokens

- `--motion-gesture-ease: cubic-bezier(.2,.8,.2,1)`
- `--motion-system-ease: cubic-bezier(.4,0,.2,1)`
- `--motion-ease: cubic-bezier(.2,.75,.2,1)`
- `--motion-spring: cubic-bezier(.2,.8,.25,1.15)`

Use spring-like easing only for appropriate small interactions. Avoid exaggerated bounce or overshoot. Partner transitions use a restrained 28px content travel, stationary chrome, and reversible swipe feedback.

### Motion behavior requirements

- Keep persistent navigation and other fixed chrome stationary during page transitions.
- Translate only the content region when a transition calls for directional movement.
- Preserve scroll position, selected exercise, completed sets, unsaved edits, active workout state, and rest-timer deadline.
- Transitions must be interruptible and reversible without duplicated handlers or stale animation state.
- Avoid stacking simultaneous page and component animations.
- Do not animate layout in ways that clip content or reduce target size.
- Under `prefers-reduced-motion: reduce`, remove nonessential transitions, transforms, pulses, and celebrations; state changes must remain clear without motion.
- Under `prefers-reduced-transparency: reduce`, replace blurred/translucent floating surfaces with opaque theme surfaces.

## 6. Shared component standards

- Floating navigation: four destinations — Home, Workouts, Progress, Profile; translucent rounded dock, sliding selection indicator, safe-area aware.
- Floating workout timer: pill geometry shared with navigation; countdown uses tabular numerals; preserve its deadline across navigation, folding, and rotation.
- Exercise cards: contextual expansion/editing, one-tap set completion, previous performance where available, and accessible focus states.
- Dialogs: shared dimensions, spacing, radius, backdrop, focus handling, and reduced-motion behavior. Avoid unnecessary modal interruption.
- Primary actions: filled semantic action color. Secondary actions: outlined or quiet.
- Use official Lucide icons; do not redraw, approximate, or substitute emoji for interface icons.

## 7. Responsive and cross-layout governance

Treat compact/folded, unfolded portrait, and unfolded landscape as three configurations of one product. Maintain a shared data model, business logic, components, tokens, and interaction behavior. Layout-specific composition may differ.

Every applicable UI change must be reviewed in all three configurations and both themes. Preserve workout state, rest timer, drafts, selection, navigation, scroll position, and appearance across folding and rotation. Do not claim device compatibility until tested on actual hardware.

## 8. Implementation checklist

- [ ] Components consume semantic tokens; no arbitrary one-off palette or radius values.
- [ ] Typography uses Inter and the shared hierarchy.
- [ ] Lucide icons use approved sizes and 1.75px stroke.
- [ ] Touch targets are at least 44px.
- [ ] Motion uses the shared named durations and easing tokens.
- [ ] Reduced-motion and reduced-transparency modes are verified.
- [ ] Timers, drafts, scroll, and workout state survive transitions.
- [ ] Compact, unfolded portrait, and unfolded landscape are reviewed.
- [ ] Both Default and Graphite Lime themes are reviewed.
- [ ] Browser regression checks pass; device validation is reported separately.

## Source notes

The source repository's `DESIGN.md` remains authoritative for detailed component decisions and subsequent refinements. This file is the Lab transfer baseline, not permission to diverge from the source. Where a future source revision conflicts with this document, reconcile and update Lab to match the latest approved source.


## Build 115 implementation reconciliation

Build 115 preserves the approved Build 114 runtime appearance. Existing intermediate spacing values (10, 14, 18, 22px) are named `--space-2-5`, `--space-3-5`, `--space-4-5`, `--space-5-5` respectively; `--type-dialog-title` is 18px. These are compatibility exceptions, not new visual values. The current runtime palette, typography and motion differ from parts of the historical specification above; do not normalize those differences without visual approval. The navigation shell and calibrated Duo rules are unchanged.


## Approved exercise artwork — RepDB Standard

Use RepDB Standard sculptural 3D exercise illustrations with orange target-muscle highlights and transparent backgrounds. Use static thumbnails in exercise lists, routine builder and active workout; show looping demonstrations in exercise details and expanded cards on demand. Support start/peak stills and optional female artwork when licensed. Keep internal exercise IDs independent of provider asset IDs. Use shared image components across all layouts, with accessible labels, lazy loading, reduced-motion support and neutral missing-artwork fallbacks. Preserve calibrated navigation and layout geometry. Premium assets must not be imported, hotlinked or redistributed until the appropriate license and hosting rights are confirmed. No premium assets are included by this specification.

## Build 178 runtime reconciliation
The deployed Lab is authoritative for approved existing appearance: standard 320ms, selection/color 260ms (legacy exception), general easing cubic-bezier(.2,.8,.2,1), spring cubic-bezier(.2,.8,.2,1.15). Earlier canonical table remains a proposed vocabulary for new interactions, not evidence of implemented tokens. Hinge 320ms, unfold 460ms, retarget window 500ms, natural rotation and reduced-motion guard remain unchanged. Existing dialog widths 320/340/360 and exercise picker 560 are intentional compatibility variants; calendar 32px targets are an outstanding accessibility exception, not a new standard. Routine row minimum 76px. Layout classifier thresholds .62/530/760 are heuristics, not physical dimensions. CSS media/container thresholds remain literal because custom properties cannot be used in those conditions. Diagnostic border, artwork dimensions, stroke widths, safe area arithmetic and gesture thresholds are intentional fixed values. Do not treat every numeric literal as a design token. Existing legacy cascade and theme-specific exceptions require browser verification before removal.

## Build 185 headline geometry
Shared 44px headline row; default viewport-relative center 48px, top = center − half row height (26px default). FP uses saved master FL1 X; FL1 and FL2 use saved master Y (FL2 mirrored from bottom). UP/UL inherit 48px. Main top padding respects reported safe top; no double subtraction of excluded rail. Manual calibration overrides preserved. Home date and signature centered in row. Navigation unchanged. Actual device alignment pending.

## Build 186 native-first FL1
Native physical headline inset 84px, content inset 16px; Safari adapter subtracts excluded 84px and clamps to zero, respecting reported safe left. Independent tokens, 2:3 dashboard tracks. Diagnostic preview switch uses simulated physical SVG, not native rendering. Other orientations and navigation unchanged. Native drawable area remains unverified.

Build 187: early CSS FL1 inset adapter for compact landscape using remembered landscape side; synchronous rotation handler updates side before layout reads. Initial unknown side defaults left until angle is reported. No rotation animation added; device verification pending.

Build 188: persistent diagnostic toggle for blue viewport outline on app and diagnostic pages; diagnostic grid and camera guides remain independent. Removed FL1-only signature justification overrides so shared 24px leading slot centers the 3px signature at 10.5px, consistent across orientations. Preview wordmark uses 24px slot. Device verification pending.

Build 189: compact landscape shares zero Safari leading inset and 13.5px Home signature slot (3px stroke + 10.5px gap), independent of late rotation angle. FL2 now shares FL1 leading alignment intentionally; native targets, right rail and hinge animation logic unchanged. Removed competing FL1 angle-based selectors. Device verification pending.
