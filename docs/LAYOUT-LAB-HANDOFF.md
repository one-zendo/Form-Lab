# FORM Layout Lab — restart handoff
Recorded 2026-11-27 before the restart. The active Build 001 layout and its verification scope are described in [layout.md](layout.md#layout-lab-build-001).

## Preserve
Previous application snapshot: f61cd026a2a12a45ba6c2cd5a781b28b3a92865c (Build 94 plus UP Home CSS correction). Preserve complete Git history, source, tests, assets, calibration and user data. Existing layout history: docs/layout.md at that snapshot. Archive and verify before replacing runtime. Same repository, main only, same Pages URL https://one-zendo.github.io/Form-Lab/. No new branches. Temporary fix/up-home-spacing branch removal remains pending.

## New scope
Layout Lab Build 001: hardware, calibration, diagnostics and grayscale wireframes only. No workout engine, timers, storage changes, integrations or demo data. Start with Home; approve each screen across all ten profiles before proceeding to Workouts, Routine, Active Workout, Progress, Profile. Keep prior app recoverable. Do not clear browser storage.

## Hardware and layout
Use existing canonical hardware geometry, not redraws or guesses. Silver-gray chassis, circular camera, asymmetric folded silhouette. FP 466x678 hinge left; FL1 678x466 hinge bottom camera top left; FL2 678x466 hinge top camera bottom right; UP 669x951 vertical fold; UL 951x669 horizontal fold. Recorded Safari exclusions FP right84, FL1 left84, FL2 right84, UP top82, UL right84 pt; reference only pending physical verification. Native independent. Five independent orientations x two environments. Native-first design; Safari working test environment, Native-sized browser preview not SwiftUI. Use live viewport and safe areas, never subtract exclusion twice or uniformly scale UI. Preserve posture diagnostics; ambiguous orientations use conservative fallback. Separate hardware, calibration, layout, components and diagnostics. Universal Preview Engine: orientation/environment selectors, diagnostics on, measurements collapsed; consistent physical scale. Orange camera, purple headline/axes, blue viewport, green content/cards, gray exclusions.

## Wireframes
Home: fixed headline FORM, date, tagline/greeting, workout and streak placeholders, navigation Home/Workouts/Progress/Profile. Grayscale, simple labeled boxes; no final visual styling. Each profile owns composition, sizing, spacing, alignment, navigation and scrolling. Content-sized cards by default proposed for restart; equal expansion only when deliberately approved. Single primary content scroll owner; stationary headline and navigation; overflow scrolls rather than clips. Keep calibration independent of content. Existing references: 44pt headline row, FP center48, 16pt side inset where applicable, 16px card padding, 12px card gap and dock clearance. Reconcile with authoritative source before use. Last documented headline treatment solid (Build45); do not revive obsolete blur rules. Later visual design: Apple-inspired, restrained colors, Lucide icons, smooth motion, tagline "Train with focus, follow your progress".

## Lessons and testing
Build93 established independent profiles and automated ten-case Chromium/WebKit coverage; Build94 tested CTA without changing measured bounds. Avoid generic portrait/landscape coupling, shared width caps (420px caused UP mismatch), forced empty card expansion, cumulative overrides, duplicate scroll owners, double safe-area offsets. Keep one authoritative rule per responsibility. Test all ten profiles and state preservation; separate browser checks from physical device validation. Sequential builds, main only, verify deployment and published assets. Preserve previous functional modules for later reuse: routines, exercise library, active workout, rest timer, progress, profile, offline persistence, isolated demo data, future HealthKit/Watch.

## Open issues
UP Home upper gap cause unresolved; latest CSS correction committed but regression and Pages deployment unconfirmed. Native FL1 content anchor 16 vs 29.5 conflict; do not invent resolution. Existing 8px Active Workout safe-inset overlap needs physical confirmation. Native SwiftUI and all ten physical profiles not fully verified. No archive directory or replacement application has been created yet.

## Next action
Use Codex to inspect complete tree and canonical geometry/calibration, archive old app and verify recoverability, then implement Build001 on main with same Pages URL. Review hardware and calibration before Home wireframe. No functionality until layout approval.
