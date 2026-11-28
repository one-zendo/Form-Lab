# FORM Lab architecture
Diagnostic Build 26: index.html shared semantic components; hardware.js raw detection; layout.js explicit orientation profiles; style.css shared styling and anchored controls; app.js interactions; diagnostics.js observational overlay. No storage writes or workout engine. Unknown viewport uses explicit uncalibrated stacked fallback. Native-sized is browser simulation. Tests cover basic interactions and ten profiles; physical calibration and expanded regression coverage pending.
Global posture adjustment is implemented in layout.js for both card arrangements across the five diagnostic layouts; diagnostic simulation is explicitly labeled. No physical hinge boundary is inferred from midpoint.
update.js checks deployed versions independently of layout; app.js supplies reload safety guard.
Four page panels share navigation and timer; app.js switches visible panel before refreshing layout; diagnostic controls are session-global. Diagnostic owns card-pair tests; Home has independent dashboard composition. Other pages use simple stacked test content.
Automatic hinge adjustment requires matching reported segments and sufficient local space; simulation alone permits midpoint. Stacked pair maintains constant target total height.
Timer visibility independent of countdown and destination state.

Diagnostics coalesces frame requests, uses bounded transition settling rather than recursive animation polling, and isolates overlay exceptions from navigation.

Navigation groups four destinations in a shared capsule and includes the independent timer toggle inside the same capsule.

Navigation visibility changes are restricted to direct page panels in #scroll; the shell's data-page is state metadata, never a visibility target.

Timer visibility animates the actual scroll viewport bottom and timer opacity/translation; inert hidden transition prevents interaction, countdown remains independent.

Local Lucide SVGs for interface icons; diagnostic and countdown graphics remain custom.

Home alone uses zero horizontal scroll-container design padding, full-width flexible dashboard, 8px card gap and 24px card titles; header internal alignment and other page layouts are unchanged.

Shared sticky headline uses backdrop filtering on the actual header with opaque fallback.

The actual header starts at viewport top and owns calibrated padding. App diagnostic master guides default off; individual categories remain selected.

Build 26 adds history.js, an explicit local JSON import with read-only workout and routine views; local date/streak calculation; shared timer liquid layer using blend inversion and a single animation loop. Hardware unchanged.

Build 27: shared appearance tokens in style.css, Profile radio selection in app.js, independent local appearance key, liquid overlay clipped to matching fill. No hardware/layout changes.

Build 28 extends the private importer with paste input and atomic batch merge.

Build 29 adds Studio Dark via shared appearance tokens and validated persistent selection; synchronizes Safari theme-color and color-scheme metadata at boot and theme changes, without altering layout.

Build 30 fixes browser theme-color to #000000 at boot and on theme selection; canvas tokens remain independent.
