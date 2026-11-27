# FORM Foundation 01 — authoritative runtime specification

Supersedes legacy UI layout instructions; retain DUO-HARDWARE-STANDARD.md for physical reference geometry only. Previous runtime recoverable at 2f5b02557eda7ed649dd0ba5dcaf9cfe74de2259. Active entry point index.html loads only foundation-01.css and foundation-01.js.

Reference full / Safari dimensions: FP 466×678 / 382×678 (right 84); FL1 678×466 / 594×466 (left 84); FL2 678×466 / 594×466 (right 84); UP 669×951 / 669×869 (top 82); UL 951×669 / 867×669 (right 84). These are calibrated targets, not measured physical guarantees. Match live layout viewport within 2 CSS px; folded landscape angle 90/270 distinguishes FL1/FL2, otherwise ambiguous. Native-sized browser is simulation. CSS dynamic viewport sizes shell; never force reference dimensions or subtract exclusions twice. Raw visual viewport is diagnostic only.

Navigation right in FL1/FL2 and FP Native-sized; bottom otherwise. One adaptive grid; equal flexible cards, nominal minimum width 15rem and height 8rem; content scrolls when needed. Timer preview below cards, optional, minimum 48px. Shared spacing 4/8/12/16/24/32; 16 outer and card padding, 16 headline-to-content, 4 headline/tagline and nav items, 8 card internals, 12 component gaps. Safe areas take priority. Folded camera centers (418,48), (48,48), (630,418), radius 18.5 with provisional 4 clearance; local avoidance only. Unfolded camera unresolved.

Diagnostics read rendered geometry, raw layout and visual viewport, CSS probe and offsets; overlays do not size shell. Colors blue/purple cards, amber timer, green navigation; default on, toggle independently. Preserve existing diagnostic storage key and workout data. Home only; no actual countdown or workout functionality.

Acceptance pending: ten viewport cases, rotation including UP→UL without refresh, timer on/off, overflow, camera clearance, diagnostics, physical Duo Safari. Legacy tests and files are not active runtime and are not evidence of new build passing. Native implementation not present.
