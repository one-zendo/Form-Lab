# FORM — Product definition

Version 1.2 · Approved 2026-11-24

Train with focus, follow your progress.

## Product definition
FORM is a thoughtfully designed strength-training companion that helps people plan their workouts, train with focus, track their performance, and understand their progress over time.

It combines powerful workout tracking with a calm, intuitive interface that minimizes distractions and makes fitness a sustainable part of everyday life.

## Mission
Make strength training simpler, more intentional, and more rewarding through thoughtful design and meaningful insights.

## Vision
Become the most intuitive and trusted personal strength-training companion across the Apple ecosystem.

## Target audience
- Beginners who need structure and guidance.
- Regular gym-goers who want efficient workout tracking.
- Experienced lifters who value detailed performance insights.
- Fitness enthusiasts who appreciate simplicity and thoughtful design.

## Core product pillars
- Plan with purpose: Create personalized routines that fit individual goals, schedules and training preferences.
- Train with focus: Log workouts effortlessly without interrupting the training experience.
- Progress with clarity: Transform workout data into meaningful, understandable performance insights.
- Connect seamlessly: Deliver a cohesive experience across iPhone, Apple Watch and Apple Health.

## Core experience
Plan → Train → Track → Improve → Plan.

## Design values
- Simplicity: Powerful features without overwhelming interfaces.
- Focus: Minimal interaction during workouts.
- Personalization: Adapt to the individual, not the other way around.
- Meaningful data: Actionable insights instead of unnecessary statistics.
- Privacy: Respect users and their personal fitness data.
- Craftsmanship: Every interaction should feel intentional and refined.

## Product personality
Minimal, intelligent, focused, personal, calm, precise, empowering.

FORM should never feel noisy, intimidating, judgmental or unnecessarily complicated.

## Product philosophy
The best workout app is one that lets you concentrate on your workout, not the app.

Every feature we introduce should support that philosophy. FORM should complement the training experience rather than compete for the user's attention.

## Approved problem identification

| Problem | FORM's solution |
| --- | --- |
| Complicated user interfaces: crowded screens, confusing navigation and unnecessary controls. | Clean, intuitive interfaces with contextual controls. |
| Distracting social feeds: likes, followers and social comparisons distract from personal goals. | A private, personal training experience without a social feed. |
| Overwhelming statistics: too much data without meaningful context. | Clear, relevant insights with detailed statistics available when needed. |
| Too many taps: logging sets interrupts training. | Effortless set logging, intelligent defaults and contextual actions. |
| Intrusive subscription prompts: repeated paywalls and upgrade prompts disrupt the experience. | Transparent pricing and nonintrusive subscription management. |
| Unreliable data and synchronization: lost workouts, inconsistent records and synchronization failures undermine trust. | Offline-first storage, reliable synchronization and workout recovery. |

### Product commitments
Simplicity, focus, clarity, efficiency, transparency and reliability.

FORM should respect the user's time, attention, money and data.

Pricing and technical synchronization strategy remain to be defined.

## Approved competitive analysis
Preliminary qualitative assessment of published features, not hands-on testing.

| Competitor | Strengths | FORM opportunity |
| --- | --- | --- |
| Hevy | Logging, Apple Watch, Live Activities, exercise library; optional social features | Personal-first experience without a social network |
| Strong | Focused logging, practical tools, Watch support, history | Contextual interfaces, thoughtful motion, clear insights |
| Fitbod | Personalized workout generation and recovery insights | User control without mandatory automated coaching |
| JEFIT | Extensive exercise library, analytics and programs | Advanced capabilities without overwhelming interfaces |
| Apple Health (design benchmark) | Native hierarchy, recognizable components and integration | Apply its design philosophy to strength training |

Intended positioning: minimal interface and personal focus. Strong is a key competitor because simplicity is already part of its appeal. Removing social features alone is not sufficient differentiation. Competitor positioning is qualitative, not measured performance.

### Competitive strategy
- Apple-inspired progressive disclosure.
- No social feed.
- One-tap set completion when values are correct.
- Essential insights first; advanced details on demand.
- No upgrade interruptions during workouts.
- Offline-first storage, recovery and export capabilities.
- Thoughtful native Apple integration.

Avoid feature bloat, social engagement mechanics, excessive gamification, unnecessary AI and artificial complexity to justify subscriptions.

## Approved unique value proposition
**More training. Less distraction.**

FORM delivers a focused, beautifully designed strength-training experience that puts personal progress, effortless logging and reliable data first.

Validate usability and synchronization before claiming superiority over competitors.

## Requirements
# FORM — Product requirements and MVP
Version 1.0 · Approved 2026-11-24

## Navigation
Home | Workouts | Progress | Profile

## Functional requirements
- Home: Today's workout, quick start, resume active workout, weekly activity and recent workout summaries.
- Workouts: Create/manage routines, search exercise library, custom exercises, reorder/replace exercises, configure sets/reps/weight/rest, workout history.
- Active workout: One-tap set completion, previous performance, automatic/manual rest timers, warm-up/normal/drop/failure sets, optional RPE/RIR, pause/resume/finish, recovery and post-workout summary.
- Progress: Consistency, personal records, strength progression, volume, exercise performance history.
- Profile: Preferences, units, default workout settings, appearance, data management, privacy and support.
- Apple ecosystem: Apple Watch companion, HealthKit, Live Activities/Dynamic Island, rest notifications/haptics, widgets.
- Data: Offline-first storage, automatic saving, interrupted workout recovery, export/import and reliable device synchronization.

## Roadmap
### MVP 1 — Web preview
Four-tab navigation, responsive iPhone and Duo layouts, exercise library, routine builder, active workout engine, set logging/rest timers, history, basic progress insights, persistent local storage, light/dark appearance.
### MVP 2 — Native Apple experience
Native SwiftUI application, Apple Watch companion, HealthKit, Live Activities, widgets/haptics, reliable device synchronization, native accessibility, TestFlight beta.
### Version 1.0 — Public release
Advanced progress insights, backup/recovery, import/export, performance optimization, comprehensive testing, transparent monetization, App Store release.

## Non-functional requirements
- Performance: Responsive interactions and smooth animations.
- Reliability: No silent loss of workout records.
- Accessibility: VoiceOver, scalable text, sufficient contrast.
- Privacy: Personal data private by default.
- Usability: Minimal interactions during training.
- Maintainability: Modular, reusable, documented code.
- Visual consistency: One design system using official Lucide icons.
- Offline: Core workout features work without internet.

## Outside initial scope
Social feeds/followers, public leaderboards, AI-generated coaching, nutrition/calorie tracking, advertising, competitive challenges, exercise video marketplace. Social feeds conflict with product philosophy.

## Web MVP acceptance criteria
Users can independently create a routine, add/configure exercises, start a workout, log sets/use rest timers, recover after interruption, finish/save, review history and understand training progress. All eight steps must work reliably without placeholder functionality or fabricated workout data.

## Constraints
Web-first development using existing Cloudflare infrastructure. Native Apple integrations require separate native implementation and cannot be fully validated in the web preview.

## Mandatory Duo adaptive layout requirement (2026-11-24)
Design, wireframe, prototype and test distinct compact/folded, unfolded portrait and unfolded landscape configurations for all relevant screens. Apple specifications: outer 1398×2034 pixels (5.4 inch), inner 1878×2670 pixels (7.6 inch), both up to 120Hz; source https://www.apple.com/ca/iphone-duo/specs/. Provisional 3× logical canvases: 466×678, 626×890, 890×626 respectively; measure actual viewport, safe areas and scaling on device before finalizing breakpoints. Adapt to available window dimensions including multitasking, not device name alone. Preserve workout state, completed sets, rest timer, unsaved edits, selection, navigation, equivalent scroll location and appearance across folding and rotation. Require no clipping or inaccessible controls; test on actual hardware before declaring compatibility. Specific screen arrangements remain design proposals pending wireframe approval.

## Mandatory cross-layout change parity
Maintain one shared application core, workout data model, business logic, reusable components and design tokens across folded/compact, unfolded portrait and unfolded landscape. Every applicable feature, design update, interaction improvement and bug fix must propagate across all three configurations. Layout-specific composition and sizing may differ to suit available space; avoid duplicated implementations and divergent functionality. Review and test all three configurations for every applicable change before marking it complete, including state continuity during folding and rotation. Document any necessary layout-specific exception explicitly.

## UX
# FORM — UX architecture
Version 1.0 · Approved 2026-11-24

## Information architecture
- Home: Today, quick start, active session, activity and recent summaries.
- Workouts: Routines, exercises, history, scheduling.
- Progress: Overview, strength, volume, records, consistency.
- Profile: Preferences, integrations, data, privacy, support.

## Core journeys
- Routine: Workouts → Create Routine → Name → Add exercises → Configure sets/reps/rest → Save.
- Workout: Start from Home or Workouts → Review exercise and previous performance → Adjust values if needed → Complete set in one tap → Automatic rest if enabled → Continue → Finish/save → Summary.
- Progress: Open Progress → Essential insights → Select metric/exercise → Detailed history.

## Active workout
Dedicated experience rather than a primary tab. Show duration, completed sets, exercise details, set values, completion controls and rest timer. Allow minimizing, navigating elsewhere and returning without losing the session.

## Responsive architecture
Compact: single-column content and bottom tabs. Expanded: adaptive multi-column content rather than stretched interfaces. Detailed layouts and breakpoints to be defined later.

## Interaction principles
- Predictable, consistent navigation.
- Inline editing whenever practical.
- Smooth exercise swapping preserving compatible settings.
- One-tap completion when values are correct.
- Progressive disclosure of advanced controls.
- Confirmation or undo for destructive actions.
- Active sessions accessible from any primary tab.
- Helpful empty states without fabricated data.
- Clear errors and recovery options.
- Purposeful, smooth motion respecting reduced-motion settings.

## Application states
Design relevant screens for empty, loading, success, error, offline, syncing, recovery and permissions states.

Conceptual layouts are not final visual designs.

## Mandatory Duo adaptive layout requirement (2026-11-24)
Design, wireframe, prototype and test distinct compact/folded, unfolded portrait and unfolded landscape configurations for all relevant screens. Apple specifications: outer 1398×2034 pixels (5.4 inch), inner 1878×2670 pixels (7.6 inch), both up to 120Hz; source https://www.apple.com/ca/iphone-duo/specs/. Provisional 3× logical canvases: 466×678, 626×890, 890×626 respectively; measure actual viewport, safe areas and scaling on device before finalizing breakpoints. Adapt to available window dimensions including multitasking, not device name alone. Preserve workout state, completed sets, rest timer, unsaved edits, selection, navigation, equivalent scroll location and appearance across folding and rotation. Require no clipping or inaccessible controls; test on actual hardware before declaring compatibility. Specific screen arrangements remain design proposals pending wireframe approval.

## Mandatory cross-layout change parity
Maintain one shared application core, workout data model, business logic, reusable components and design tokens across folded/compact, unfolded portrait and unfolded landscape. Every applicable feature, design update, interaction improvement and bug fix must propagate across all three configurations. Layout-specific composition and sizing may differ to suit available space; avoid duplicated implementations and divergent functionality. Review and test all three configurations for every applicable change before marking it complete, including state continuity during folding and rotation. Document any necessary layout-specific exception explicitly.
