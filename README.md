# FORM Lab

Current baseline: Build 118 — refactored application and QA checks. Build 113 is preserved on checkpoint/build-113.

FORM Lab owns its implementation and tokens. ONE is a visual reference only.

- DESIGN.md: approved design and layout rules
- DESIGN_SYSTEM.md: shared token specification
- PRODUCT.md, REQUIREMENTS.md, UX.md: product and experience requirements
- index.html: application entry point
- styles/app.css: shared stylesheet and calibrated geometry
- core/app.js: application logic
- version.json: update manifest (increment alongside HTML and JS build markers)
- tests/regression.test.mjs: Node.js regression checks; run with `node --test tests/regression.test.mjs`.

Physical Duo and browser interaction testing are still required; source checks alone do not establish device compatibility.

Preview: https://one-zendo.github.io/Form-Lab/
