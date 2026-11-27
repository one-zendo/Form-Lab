const { chromium, webkit } = require('playwright');
const assert = require('node:assert/strict');
const profiles = require('../fixtures/duo-orientations.json');
const browserName = process.env.FORM_BROWSER || 'chromium';
const url = process.env.FORM_URL || 'http://localhost:3000/';
const placement = {
  FP: ['right', 'bottom'],
  FL1: ['right', 'right'],
  FL2: ['right', 'right'],
  UP: ['bottom', 'bottom'],
  UL: ['bottom', 'bottom'],
};
const cameras = { FP: [418, 48], FL1: [48, 48], FL2: [630, 418] };

function closeTo(actual, expected, label) {
  assert.ok(Math.abs(actual - expected) < 0.1, label + ': ' + actual + ' vs ' + expected);
}

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
  assert.equal(await page.locator('meta[name=form-build]').getAttribute('content'), '004');
  assert.equal(await page.locator('h1').textContent(), 'FORM');
  assert.equal(await page.locator('body').getAttribute('data-orientation'), orientation);
  assert.equal(await page.locator('body').getAttribute('data-viewport-mode'), mode);
  assert.equal(await page.locator('#dock [aria-current=page]').textContent(), 'Home');
  assert.equal(await page.locator('#dock button:disabled').count(), 3);

  const native = mode === 'Native-sized';
  const side = placement[orientation][native ? 0 : 1];
  const vertical = side === 'right';
  assert.equal(await page.locator('#home').getAttribute('data-dock'), side);

  for (const insets of [[0, 0, 0, 0], safeInsets, [24, 22, 34, 28]]) {
    const [top, right, bottom, left] = insets;
    await page.evaluate(async insets => {
      ['top', 'right', 'bottom', 'left'].forEach((edge, index) => {
        document.documentElement.style.setProperty('--safe-' + edge, insets[index] + 'px');
      });
      // Allow ResizeObserver and its scheduled layout pass to apply updated safe bounds.
      for (let i = 0; i < 3; i++) await new Promise(requestAnimationFrame);
    }, insets);
    const layout = await page.evaluate(() => {
      const rect = selector => document.querySelector(selector).getBoundingClientRect().toJSON();
      const cards = [...document.querySelectorAll('.form-card')];
      return {
        pageWidth: document.documentElement.scrollWidth,
        header: rect('#home .headline'),
        content: rect('.content'),
        tagline: rect('.tagline'),
        dockRegion: rect('.dock-region'),
        nav: rect('#dock'),
        items: [...document.querySelector('#dock').children].map(el => el.getBoundingClientRect().toJSON()),
        headerItems: [rect('#home h1'), rect('#diagnostic-open')],
        cards: cards.map(el => el.getBoundingClientRect().toJSON()),
        padding: cards.map(card => getComputedStyle(card).padding),
      };
    });
    const [first, second] = layout.cards;
    const { nav, dockRegion, content, header, tagline } = layout;
    const leftEdge = left + 16;
    const rightEdge = width - right - 16;
    const topEdge = top + 16;
    const bottomEdge = height - bottom - 16;
    assert.equal(layout.pageWidth, width);
    closeTo(header.top, topEdge, 'headline top');
    closeTo(content.left, leftEdge, 'content left');
    closeTo(content.right, vertical ? dockRegion.left - 16 : rightEdge, 'content right');
    closeTo(dockRegion.right, rightEdge, 'dock region right');
    closeTo(dockRegion.bottom, bottomEdge, 'dock region bottom');
    assert.ok(tagline.left >= first.left && tagline.right <= second.right);
    closeTo(first.height, second.height, 'equal card heights');
    closeTo(second.bottom, content.bottom, 'cards use full content height');
    assert.ok(first.height >= 128 && first.width >= 240);
    closeTo(second.right, content.right, 'cards use full clear width');
    assert.deepEqual(layout.padding, ['16px', '16px']);
    assert.ok(first.top > header.bottom);

    if (vertical) {
      closeTo(dockRegion.top, topEdge, 'rail top');
      closeTo(nav.right, rightEdge, 'rail right');
      closeTo(layout.items[0].left, layout.items[3].left, 'rail item column');
      assert.ok(layout.items[0].bottom < layout.items[3].top);
      assert.ok(Math.max(first.right, second.right) < nav.left);
    } else {
      closeTo(dockRegion.left, leftEdge, 'bottom dock left edge');
      closeTo(content.bottom, dockRegion.top - Math.min(16, height * 0.03), 'bottom dock reserved space');
      closeTo((nav.left + nav.right) / 2, (leftEdge + rightEdge) / 2, 'bottom dock center');
      closeTo(layout.items[0].top, layout.items[3].top, 'bottom dock item row');
      assert.ok(layout.items[0].right < layout.items[3].left);
      assert.ok(Math.max(first.bottom, second.bottom) < nav.top);
    }

    if (content.width < 492) {
      closeTo(first.width, content.width, 'one-column card width');
      closeTo(second.top - first.bottom, 12, 'vertical card gap');
    } else {
      closeTo(first.top, second.top, 'two-column card alignment');
      closeTo(second.left - first.right, 12, 'horizontal card gap');
      assert.ok(Math.abs(first.width - second.width) < 1);
    }

    let railTop = dockRegion.top;
    let railBottom = dockRegion.bottom;
    const camera = cameras[orientation];
    if (camera) {
      const [physicalX, y] = camera;
      const x = physicalX - (!native && orientation === 'FL1' ? 84 : 0);
      const clearance = 22.5;
      for (const box of [header, ...layout.headerItems, ...layout.cards, tagline, nav]) {
        assert.ok(box.right <= x - clearance + 0.1 || box.left >= x + clearance - 0.1 ||
          box.bottom <= y - clearance + 0.1 || box.top >= y + clearance - 0.1,
        orientation + ' ' + mode + ' component overlaps the camera clearance');
      }
      if (native && dockRegion.left < x + clearance && dockRegion.right > x - clearance) {
        if (orientation === 'FP') railTop = Math.max(railTop, y + clearance);
        if (orientation === 'FL2') railBottom = Math.min(railBottom, y - clearance);
      }
    }
    if (vertical) closeTo((nav.top + nav.bottom) / 2, (railTop + railBottom) / 2, 'rail center');
  }

  async function setTimer(visible) {
    await page.getByRole('button', { name: 'Diagnostics' }).click();
    await page.locator('#timer-preview').setChecked(visible);
    await page.getByRole('button', { name: 'Done' }).click();
  }

  const before = await page.locator('.content').boundingBox();
  const chrome = await page.locator('#home .headline, .tagline, #dock').evaluateAll(
    elements => elements.map(element => element.getBoundingClientRect().toJSON()));
  await setTimer(true);
  const timer = await page.locator('.timer-placeholder').boundingBox();
  const during = await page.locator('.content').boundingBox();
  assert.ok(timer.height >= 48);
  assert.ok(timer.y + timer.height < during.y);
  assert.deepEqual(await page.locator('#home .headline, .tagline, #dock').evaluateAll(
    elements => elements.map(element => element.getBoundingClientRect().toJSON())), chrome);
  closeTo(before.height - during.height, during.y - before.y, 'timer reservation');
  await page.locator('[data-measurement="Timer"]').waitFor();
  const cardsDuringTimer = await page.locator('.form-card').evaluateAll(elements =>
    elements.map(el => el.getBoundingClientRect().toJSON()));
  closeTo(cardsDuringTimer[0].height, cardsDuringTimer[1].height, 'equal card heights with timer');
  const minimumHeight = cardsDuringTimer[0].top === cardsDuringTimer[1].top ? 128 : 2 * 128 + 12;
  closeTo(cardsDuringTimer[1].bottom, during.y + Math.max(during.height, minimumHeight),
    'cards fill remaining space and retain their minimum height');
  await setTimer(false);
  await page.locator('[data-measurement="Timer"]').waitFor({ state: 'detached' });
  assert.deepEqual(await page.locator('.content').boundingBox(), before);

  const dockBeforeScroll = await page.locator('#dock').boundingBox();
  const scroll = await page.locator('.content').evaluate(content => {
    const tail = document.createElement('div');
    tail.style.height = '1000px';
    content.append(tail);
    content.scrollTop = content.scrollHeight;
    return { inner: content.scrollTop, window: window.scrollY };
  });
  assert.ok(scroll.inner > 0);
  assert.equal(scroll.window, 0);
  assert.deepEqual(await page.locator('#dock').boundingBox(), dockBeforeScroll);
  await page.locator('.content').evaluate(content => {
    content.lastElementChild.remove();
    content.scrollTop = 0;
  });
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

async function checkLiveRotation(browser, mode, dimensionKey) {
  const byId = Object.fromEntries(profiles.map(profile => [profile.orientation, profile]));
  const size = profile => {
    const [width, height] = profile[dimensionKey];
    return { width, height };
  };
  const page = await browser.newPage({ viewport: size(byId.UP), isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript((initial) => {
    localStorage.setItem('form.diagnostics.v1', '{"guides":true}');
    Object.defineProperty(screen, 'orientation', {
      value: Object.assign(new EventTarget(), { angle: 0 }),
    });
    Object.defineProperty(window, 'visualViewport', {
      value: Object.assign(new EventTarget(), initial, { offsetLeft: 0, offsetTop: 0, scale: 1 }),
    });
  }, size(byId.UP));
  assert.ok((await page.goto(url)).ok());
  await page.evaluate(() => { window.rotationSession = 'same document'; });

  async function verifyVisible() {
    const box = await page.evaluate(() => {
      const nav = document.querySelector('#dock').getBoundingClientRect();
      const { width, height, offsetLeft, offsetTop } = visualViewport;
      return {
        width: nav.width, height: nav.height,
        left: nav.left - offsetLeft, top: nav.top - offsetTop,
        right: offsetLeft + width - nav.right, bottom: offsetTop + height - nav.bottom,
      };
    });
    assert.ok(box.width > 0 && box.height > 0);
    for (const edge of ['left', 'top', 'right', 'bottom']) {
      assert.ok(box[edge] >= -.1, mode + ' dock outside visual viewport at ' + edge + ': ' + JSON.stringify(box));
    }
  }

  async function phase(visual, angle, offsets = [0, 0]) {
    await page.evaluate(async ({ visual, angle, offsets }) => {
      screen.orientation.angle = angle;
      Object.assign(visualViewport, visual, { offsetLeft: offsets[0], offsetTop: offsets[1] });
      dispatchEvent(new Event('orientationchange'));
      visualViewport.dispatchEvent(new Event('resize'));
      await new Promise(requestAnimationFrame);
    }, { visual, angle, offsets });
    await verifyVisible();
    await verifyGuides();
  }

  async function verifyGuides() {
    await page.waitForFunction(() => {
      const pairs = [['#home', '.guide.viewport'], ['#home .headline', '[data-measurement="Headline"]'],
        ['.content', '[data-measurement="Content"]'], ['#dock', '[data-measurement="Navigation"]']];
      return pairs.every(([target, guide]) => {
        const a = document.querySelector(target).getBoundingClientRect();
        const b = document.querySelector(guide)?.getBoundingClientRect();
        return b && ['x', 'y', 'width', 'height'].every(key => Math.abs(a[key] - b[key]) < .1);
      });
    });
  }

  await verifyVisible();
  // Begin in UP, repeat the reported transition, then visit every directed pair.
  const transitions = [
    'UL', 'UP', 'UL', 'UP',
    'UL', 'UP', 'FP', 'UP', 'FL1', 'UP', 'FL2', 'UL', 'FP', 'UL',
    'FL1', 'UL', 'FL2', 'FP', 'FL1', 'FP', 'FL2', 'FL1', 'FL2', 'UP',
  ];
  for (const [step, id] of transitions.entries()) {
    const target = byId[id];
    const dimensions = size(target);
    // Rotate through a partial viewport with still-stale layout dimensions and a shifted visual origin.
    await phase({ width: dimensions.width - 24, height: Math.min(dimensions.height, 430) },
      target.rotation, [10, 8]);
    if (step % 2 === 0) {
      await phase(dimensions, target.rotation);
      await page.setViewportSize(dimensions);
    } else {
      await page.setViewportSize(dimensions);
      await verifyVisible();
      await phase(dimensions, target.rotation);
    }
    await page.locator('body[data-orientation="' + id + '"][data-viewport-mode="' + mode + '"]').waitFor({ state: 'attached' });
    const dockSide = placement[id][dimensionKey === 'display' ? 0 : 1];
    await page.locator('#home[data-dock="' + dockSide + '"]').waitFor();
    await verifyVisible();
    const bounds = await page.locator('#home').boundingBox();
    closeTo(bounds.width, dimensions.width, 'settled shell width');
    closeTo(bounds.height, dimensions.height, 'settled shell height');
    await verifyGuides();
  }

  // An offset-only visual scroll has no resize. A following silent viewport
  // change exercises the final sample after the last rotation event.
  await page.evaluate(() => {
    Object.assign(visualViewport, { height: innerHeight - 60, offsetTop: 15 });
    visualViewport.dispatchEvent(new Event('scroll'));
  });
  await page.waitForFunction(() => document.querySelector('#home').getBoundingClientRect().top === 15);
  await verifyVisible();
  await phase({ width: 669, height: 400 }, 0);
  await page.evaluate(() => { visualViewport.height = innerHeight; });
  await page.waitForFunction(() => Math.abs(document.querySelector('#home').getBoundingClientRect().height - innerHeight) < .1);

  await verifyGuides();

  // Move the same inset from top to bottom without any viewport event.
  await page.evaluate(() => document.documentElement.style.setProperty('--safe-top', '34px'));
  await page.waitForFunction(() => document.querySelector('#readout').textContent.includes('34px / 0px / 0px / 0px'));
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--safe-top', '0px');
    document.documentElement.style.setProperty('--safe-bottom', '34px');
  });
  await page.waitForFunction(() => document.querySelector('#readout').textContent.includes('0px / 0px / 34px / 0px'));
  const dock = await page.locator('#dock').boundingBox();
  closeTo(dock.y + dock.height, size(byId.UP).height - 50, 'late safe-area update');
  await verifyVisible();
  assert.equal(await page.evaluate(() => window.rotationSession), 'same document');
  assert.deepEqual(errors, []);
  await page.close();
  console.log(browserName + ' ' + mode + ' live rotations passed');
}

async function main() {
  const engine = { chromium, webkit }[browserName];
  assert.ok(engine, 'FORM_BROWSER must be chromium or webkit');
  const browser = await engine.launch({ executablePath: process.env.FORM_BROWSER_EXECUTABLE || undefined });
  try {
    await checkLiveRotation(browser, 'Native-sized', 'display');
    await checkLiveRotation(browser, 'Safari-sized', 'viewport');
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
    await page.waitForFunction(() => document.querySelector('#home').getBoundingClientRect().width === 320);
    [first, second] = await cardTops();
    assert.ok(second > first);
    const shortLayout = await page.locator('.content').evaluate(content => {
      const cards = [...content.querySelectorAll('.form-card')];
      content.scrollTop = content.scrollHeight;
      return {
        heights: cards.map(card => card.getBoundingClientRect().height),
        scroll: content.scrollTop,
        lastBottom: cards.at(-1).getBoundingClientRect().bottom,
        contentBottom: content.getBoundingClientRect().bottom,
      };
    });
    assert.ok(shortLayout.heights.every(height => height >= 128));
    assert.ok(shortLayout.scroll > 0);
    closeTo(shortLayout.lastBottom, shortLayout.contentBottom, 'last card reachable by scrolling');
    const dock = await page.locator('#dock').boundingBox();
    assert.ok(dock.y + dock.height <= 250);
    assert.equal(await page.evaluate(() => window.scrollY), 0);
    await page.setViewportSize({ width: 466, height: 678 });
    await page.locator('#home[data-dock="right"]').waitFor();
    await page.setViewportSize({ width: 382, height: 678 });
    await page.locator('#home[data-dock="bottom"]').waitFor();
    assert.equal(await page.locator('#diagnostic-open').evaluate(el => el.getBoundingClientRect().right), 366);
    await page.close();
  } finally {
    await browser.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
