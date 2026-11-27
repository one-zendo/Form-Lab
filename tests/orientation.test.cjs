const test = require('node:test');
const assert = require('node:assert/strict');
const cases = require('./fixtures/duo-orientations.json');

global.window = global;
require('../foundation/geometry.js');
const { detect, geometryFor } = require('../foundation/orientation.js');

for (const { orientation, display, viewport, rotation } of cases) {
  test(orientation + ' identifies both calibrated viewports', () => {
    for (const [mode, size] of [['Native-sized', display], ['Safari-sized', viewport]]) {
      const detected = detect(FormDuoGeometry, ...size, rotation);
      assert.equal(detected.id, orientation);
      assert.equal(detected.mode, mode);
    }
  });
}

test('an unknown folded landscape angle leaves the exclusion side unresolved', () => {
  for (const width of [678, 594]) {
    const { id } = detect(FormDuoGeometry, width, 466);
    assert.equal(id, 'FL1 / FL2');
    assert.equal(geometryFor(FormDuoGeometry, id).side, null);
  }
});

test('unmatched viewports have no hardware geometry', () => {
  const { id, mode } = detect(FormDuoGeometry, 390, 844);
  assert.equal(mode, 'Unmatched');
  assert.equal(geometryFor(FormDuoGeometry, id), null);
});
