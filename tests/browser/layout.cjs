const { chromium, webkit } = require('playwright');
const assert = require('node:assert/strict');
const profiles = require('../fixtures/duo-orientations.json');
const browserName = process.env.FORM_BROWSER || 'chromium';
const url = process.env.FORM_URL || 'http://localhost:3000/';
const storage = {
  'form.training.demo.v1': '{"active":{"id":"keep"}}',
  'form.training.history.demo.v1': '[{"id":"history"}]',
  'form.private.training.v1': '{"routines":[{"id":"private"}]}',
  'form.diagnostics.v1': '{"guides":true,"futurePreference":"keep"}',
};

async function checkProfile(browser, { orientation, rotation, safeInsets }, mode, [width, height]) {
  const page = await browser.newPage({ viewport: { width, height }, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', response => {
    if (response.status() >= 400) errors.push(response.status() + ' ' + response.url());
  });
  await page.addInitScript(({ rotation, storage }) => {
    Object.defineProperty(screen, 'orientation', {
      value: Object.assign(new EventTarget(), { angle: rotation }),
    });
    if (!localStorage.getItem('form.training.demo.v1')) {
      for (const [key, value] of Object.entries(storage)) localStorage.setItem(key, value);
    }
  }, { rotation, storage });

  assert.ok((await page.goto(url)).ok());
  assert.equal(await page.locator('meta[name=form-build]').getAttribute('content'), '001');
  assert.equal(await page.locator('h1').textContent(), 'FORM');
  assert.equal(await page.locator('body').getAttribute('data-orientation'), orientation);
  assert.equal(await page.locator('body').getAttribute('data-viewport-mode'), mode);
  assert.equal(await page.locator('#dock [aria-current=page]').textContent(), 'Home');
  assert.equal(await page.locator('#dock button:disabled').count(), 3);

  for (const insets of [[0, 0, 0, 0], safeInsets]) {
    const [top, right, bottom, left] = insets;
    const layout = await page.evaluate(insets => {
      ['top', 'right', 'bottom', 'left'].forEach((edge, index) => {
        document.documentElement.style.setProperty('--safe-' + edge, insets[index] + 'px');
      });
      const rect = element => element.getBoundingClientRect().toJSON();
      const cards = [...document.querySelectorAll('.form-card')];
      return {
        pageWidth: document.documentElement.scrollWidth,
        header: rect(document.querySelector('#home .headline')),
        content: rect(document.querySelector('.content')),
        nav: rect(document.querySelector('#dock')),
        cards: cards.map(rect),
        padding: cards.map(card => getComputedStyle(card).padding),
      };
    }, insets);
    const [first, second] = layout.cards;
    assert.equal(layout.cards.length, 2);
    assert.equal(layout.pageWidth, width);
    assert.equal(layout.header.top, top + 16);
    assert.equal(layout.nav.bottom, height - bottom - 16);
    for (const region of [layout.header, layout.content, layout.nav]) {
      assert.equal(region.left, left + 16);
      assert.equal(region.right, width - right - 16);
    }
    assert.equal(first.left, layout.content.left);
    assert.equal(second.right, layout.content.right);
    assert.deepEqual(layout.padding, ['16px', '16px']);
    assert.ok(first.top > layout.header.bottom);
    assert.ok(Math.max(first.bottom, second.bottom) < layout.nav.top);
    if (layout.content.width < 492) {
      assert.equal(first.width, layout.content.width);
      assert.equal(second.top - first.bottom, 12);
    } else {
      assert.equal(first.top, second.top);
      assert.equal(second.left - first.right, 12);
      assert.ok(Math.abs(first.width - second.width) < 1);
    }
  }

  await page.locator('#diagnostic-overlay .viewport').waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Diagnostics' }).click();
  await page.getByText('Device measurements').click();
  assert.match(await page.locator('#readout').innerText(), /Safe insets/);
  const readStorage = () => page.evaluate(keys => Object.fromEntries(keys.map(
    key => [key, localStorage.getItem(key)]
  )), Object.keys(storage));
  assert.deepEqual(await readStorage(), storage);
  await page.locator('#guide-labels').uncheck();
  await page.getByRole('button', { name: 'Done' }).click();
  await page.reload();
  assert.deepEqual(await readStorage(), {
    ...storage,
    'form.diagnostics.v1': '{"guides":true,"futurePreference":"keep","guide-labels":false}',
  });
  assert.deepEqual(errors, []);
  await page.close();
  console.log(browserName + ' ' + orientation + ' ' + mode + ' ' + width + '×' + height + ' passed');
}

async function main() {
  const engine = { chromium, webkit }[browserName];
  assert.ok(engine, 'FORM_BROWSER must be chromium or webkit');
  const browser = await engine.launch({ executablePath: process.env.FORM_BROWSER_EXECUTABLE || undefined });
  try {
    for (const profile of profiles) {
      await checkProfile(browser, profile, 'Native-sized', profile.display);
      await checkProfile(browser, profile, 'Safari-sized', profile.viewport);
    }
    const page = await browser.newPage({ viewport: { width: 800, height: 600 } });
    await page.goto(url);
    const cardTops = () => page.locator('.form-card').evaluateAll(cards =>
      cards.map(card => card.getBoundingClientRect().top));
    let [first, second] = await cardTops();
    assert.equal(first, second);
    await page.setViewportSize({ width: 320, height: 250 });
    [first, second] = await cardTops();
    assert.ok(second > first);
    await page.locator('#dock a').scrollIntoViewIfNeeded();
    assert.ok(await page.evaluate(() => window.scrollY > 0));
    await page.close();
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
