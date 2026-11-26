# Navigation
Four destinations: Home, Workouts, Progress, Profile. Approved positioning: FP, FL1, FL2 and UL right rail; UP bottom dock; conventional narrow portrait bottom. Anchor to live viewport and safe areas; reserve clearance and validate proxy touch targets independently. With reliable segments, horizontal segments dock in right segment, vertical segments in lower segment. Floating translucent capsule with sliding selection, accessible labels and 44pt minimum targets. Preserve state across posture changes. Active workout is a persistent experience, not a fifth tab. Exact dock offsets and dimensions require source/device verification; do not copy old implementation.

## Build 8 prototype
Current navigation.md orientation mapping used provisionally (FP/FL1/FL2/UL rail, UP bottom), despite older engineering notes specifying FP/UL bottom. User confirmation required before freezing geometry. Book rail/laptop bottom; exact segment clearance not yet verified. 44px minimum targets, provisional 20px icons, accessible pressed state, placeholder page selection only. Pinch restrictions requested by user: viewport maximum-scale=1, user-scalable=no, touch-action and cancelable WebKit gesture handlers. Safari accessibility overrides may still permit zoom. No change to orientation/posture detection or update polling. Device verification pending.

Build 8 user feedback (2026-11-26): user reported “Yes, it’s working.” Record general device acceptance of navigation prototype; individual orientation positions, zoom suppression and precise dock measurements were not separately reported.

## Build 14 — approved FP Safari exception
FP Safari-sized viewport uses bottom floating dock; FP Native-sized target retains right rail. FL1/FL2/UL right, UP bottom; book right and laptop bottom override environment. Uses detected viewport size, not proof of native runtime. Unmatched/manual overrides do not simulate a different environment. Existing dock styling and motion unchanged. JS syntax checked; device validation pending.

Build 15: Lab-only fifth Diagnostics destination; public app remains four tabs. Compact labels provisionally 10 CSS px to fit five targets; verify accessibility and device fit.


Build 36: matching navigation-area glass, 20px headline filter, 65% tint and 24px feather mirrored at bottom or right according to existing dock mode. Independent noninteractive fixed material beneath dock; scroller extends behind bottom glass and retains final content padding. Right rail uses inline padding to preserve content clearance and existing headline anchors; side-by-side content does not horizontally scroll. Dock position, controls and detection logic unchanged. Reduced-transparency/unsupported filter retain previous reserved space. Physical Safari verification pending.
