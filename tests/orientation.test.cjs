const test = require('node:test');
const assert = require('node:assert/strict');

global.window = global;
require('../foundation/geometry.js');
const { detect, geometryFor } = require('../foundation/orientation.js');
const { resolve } = require('../foundation/layout.js');

const cases = [
  ['FP', 0, 'rail', 'bottom'],
  ['FL1', 90, 'rail', 'rail'],
  ['FL2', 270, 'rail', 'rail'],
  ['UP', 0, 'bottom', 'bottom'],
  ['UL', 270, 'rail', 'rail'],
];

for (const [id, angle, nativeNav, safariNav] of cases) {
  test(id + ' selects its own profile at both reference sizes', () => {
    const geometry = FormDuoGeometry[id];
    for (const [mode, nav] of [['Native-sized', nativeNav], ['Safari-sized', safariNav]]) {
      const safari = mode === 'Safari-sized';
      const width = geometry.w - (safari && geometry.side !== 'top' ? geometry.excluded : 0);
      const height = geometry.h - (safari && geometry.side === 'top' ? geometry.excluded : 0);
      const result = detect(FormDuoGeometry, width, height, angle);
      assert.equal(result.id, id);
      assert.equal(result.mode, mode);
      const layout = resolve(geometry, result.id, result.mode, width, height);
      assert.equal(layout.layout, id);
      assert.equal(layout.nav, nav);
      assert.equal(layout.matched, true);
      assert.equal(layout.headline, geometry.headline);
      assert.equal(layout.content, id === 'FL1' && safari ? 84 : geometry.content);
      assert.equal(layout.center, id === 'UP' && safari ? 130 : 48);
    }
  });
}

test('folded landscape without a recognized angle keeps the ambiguous geometry and fallback layout', () => {
  for (const width of [678, 594]) {
    const { id, mode } = detect(FormDuoGeometry, width, 466);
    assert.equal(id, 'FL1 / FL2');
    const geometry = geometryFor(FormDuoGeometry, id);
    assert.deepEqual([geometry.w, geometry.h, geometry.side, geometry.excluded], [678, 466, null, 84]);
    const layout = resolve(geometry, id, mode, width, 466);
    assert.equal(layout.layout, 'fallback-wide');
    assert.equal(layout.nav, 'rail');
    assert.equal(layout.headline, 84);
    assert.equal(layout.content, 84);
    assert.equal(layout.matched, true);
  }
});

test('unmatched viewports use generic composition and anchors', () => {
  for (const [width, height, expected] of [[390, 844, 'fallback-stacked'], [800, 450, 'fallback-wide']]) {
    const { id, mode } = detect(FormDuoGeometry, width, height);
    assert.equal(id, 'Unknown');
    assert.equal(mode, 'Unmatched');
    assert.equal(geometryFor(FormDuoGeometry, id), null);
    const layout = resolve(null, id, mode, width, height);
    assert.equal(layout.layout, expected);
    assert.equal(layout.nav, 'bottom');
    assert.deepEqual([layout.headline, layout.content, layout.center, layout.matched], [16, 16, 48, false]);
  }
});
