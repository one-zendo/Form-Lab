# FORM Lab architecture
Diagnostic Build 17: index.html shared semantic components; hardware.js raw detection; layout.js explicit orientation profiles; style.css shared styling and anchored controls; app.js interactions; diagnostics.js observational overlay. No storage writes or workout engine. Unknown viewport uses explicit uncalibrated stacked fallback. Native-sized is browser simulation. Tests cover basic interactions and ten profiles; physical calibration and expanded regression coverage pending.
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
