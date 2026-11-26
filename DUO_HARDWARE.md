# Duo hardware preview standard

Canonical schematic SVGs: `design/duo/FP.svg`, `FL1.svg`, `FL2.svg`, `UP.svg`, `UL.svg`. Silver-gray chassis, thin black bezel, circular camera, asymmetric folded shell. FL1 is the base folded landscape drawing; FL2 rotates 180 degrees; FP rotates 90 degrees. Hinge bottom/top/left respectively. Display units match reference dimensions in DUO_REFERENCE.md; render at equal scale. Corner radii, chassis thickness and camera coordinates are illustrative, not measured; unfolded camera placement provisional. These are design-only assets, never loaded by the app. Compose UI separately inside display bounds, with camera over UI and safe areas from actual runtime. Do not subtract browser-excluded strips again. Native full display access remains unverified.

Fixtures in tests/fixtures/duo-orientations.json are regression data, not runtime breakpoints. See DUO_REFERENCE.md for measurement provenance.
