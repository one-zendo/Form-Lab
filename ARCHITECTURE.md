# FORM Lab architecture
Diagnostic Build 10: index.html shared semantic components; hardware.js raw detection; layout.js explicit orientation profiles; style.css shared styling and anchored controls; app.js interactions; diagnostics.js observational overlay. No storage writes or workout engine. Unknown viewport uses explicit uncalibrated stacked fallback. Native-sized is browser simulation. Tests cover basic interactions and ten profiles; physical calibration and expanded regression coverage pending.
Global posture adjustment is implemented in layout.js for both card arrangements across the five diagnostic layouts; diagnostic simulation is explicitly labeled. No physical hinge boundary is inferred from midpoint.
update.js checks deployed versions independently of layout; app.js supplies reload safety guard.
Four page panels share navigation and timer; app.js switches visible panel before refreshing layout; diagnostic controls are session-global. Home owns card-pair tests. Other pages use simple stacked test content.
Automatic hinge adjustment requires matching reported segments and sufficient local space; simulation alone permits midpoint. Stacked pair maintains constant target total height.
Timer visibility independent of countdown and destination state.

Diagnostics coalesces frame requests, uses bounded transition settling rather than recursive animation polling, and isolates overlay exceptions from navigation.
