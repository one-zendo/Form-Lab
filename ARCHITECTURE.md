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

Explicit timer toggles temporarily enable Home viewport-bottom or other pages’ scroll-padding transitions, plus timer opacity/translation; tab navigation cancels the resize transition before changing destination. Countdown remains independent. Other pages scroll behind a pointer-transparent gradient backdrop layer; Home does not.

Local Lucide SVGs for interface icons; diagnostic and countdown graphics remain custom.

Home alone uses zero horizontal scroll-container design padding, full-width flexible dashboard, 8px card gap and 24px card titles; header internal alignment and other page layouts are unchanged.

Shared sticky headline uses backdrop filtering on the actual header with opaque fallback.

The actual header starts at viewport top and owns calibrated padding. App diagnostic master guides default off; individual categories remain selected.

Build 26 adds history.js, an explicit local JSON import with read-only workout and routine views; local date/streak calculation; shared timer liquid layer using blend inversion and a single animation loop. Hardware unchanged.

Build 27: shared appearance tokens in style.css, Profile radio selection in app.js, independent local appearance key, liquid overlay clipped to matching fill. No hardware/layout changes.

Build 28 extends the private importer with paste input and atomic batch merge.

Appearance resolver in the head script owns effective theme, Safari theme-color and color-scheme for startup, selection and live system changes. Studio follows system appearance; Graphite remains independent. Safari tint follows the effective canvas; app.js invokes the same resolver and persists only the user's theme choice.

Studio Dark uses white foreground for both timer layers through the shared theme tokens.

Build 34 extends the shared appearance resolver and tokens with Obsidian Red. System appearance events affect Studio only.

Build 35 adds a shared timer-glass sibling between scroll content and timer. It inherits theme and safe geometry, with no additional layout calculations or event listeners.

Build 37 adds a navigation glass sibling below the timer and dock, using existing rail and safe-area tokens. Home keeps reserved viewport boundaries. Other pages extend the scroll viewport to the safe edge with equivalent navigation and timer padding. No new event listeners.

Build 38 isolates weather in src/weather.js, independent of training, timer, layout and storage. Weather dialog participates in update guard.

Build 40 uses a shared SVG weather-orbit group and CSS-only figure-eight motion; no extra JS animation loop or weather API changes.

FP headline grid is local to Home. Build 42 removes Home overflow observation and edge glass; Home uses fixed viewport bounds, non-scrollable overflow and flexible card tracks with local container-relative sizing.

Build 48 defines shared semantic surface/row/outline/popup tokens in style.css; existing Profile groups opt into settings semantics in index.html. All existing HTML dialogs share the translucent popup style with opaque fallback. No new state or event handlers.

Build 52 renders semantic greeting/name spans in the existing headline. Profile name form merges only the explicit name field into existing local preferences; no migration or training data changes.

Build 53 uses one CSS corner-shape token under feature detection, with explicit round capsule exceptions and unchanged border-radius fallback. No scripting, hardware, state or layout changes.
