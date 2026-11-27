const { chromium, webkit } = require('playwright');
const assert = require('node:assert/strict');
const http = require('node:http');
const fs = require('node:fs');

const activeKey = 'form.training.demo.v1';
const historyKey = 'form.training.history.demo.v1';
const importKey = 'form.private.training.v1';
const fixture = {
  routines: [{ id: 'constructor', name: 'Private routine', duration: 30, exercises: [['Private exercise', 2, 8], ['Second exercise', 1, 5]] }],
  records: [],
};

function serve(req, res) {
  const path = new URL(req.url, 'http://localhost').pathname;
  if (path === '/fixture') {
    res.setHeader('Content-Type', 'text/html');
    return res.end('<!doctype html><title>Training integration</title>');
  }
  const file = path === '/' ? 'index.html' : path.slice(1);
  if (!/^[a-zA-Z0-9_.\/-]+$/.test(file) || file.includes('..') || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.statusCode = 404;
    return res.end();
  }
  const mime = { js: 'application/javascript', css: 'text/css', json: 'application/json' };
  res.setHeader('Content-Type', mime[file.split('.').at(-1)] || 'text/html');
  res.end(fs.readFileSync(file));
}

async function checkLock(context, url) {
  const a = await context.newPage(), b = await context.newPage();
  const source = fs.readFileSync('foundation/training.js', 'utf8').split("if(typeof document!=='undefined')")[0];
  for (const page of [a, b]) {
    await page.goto(url + '/fixture');
    await page.addScriptTag({ content: source });
  }
  await a.evaluate(() => {
    acquireTrainingLock(navigator.locks, () => { window.held = true; }, () => { window.held = false; });
  });
  await a.waitForFunction(() => window.held === true);
  const acquire = page => page.evaluate(() => new Promise(resolve =>
    acquireTrainingLock(navigator.locks, () => resolve(true), () => resolve(false))));
  assert.equal(await acquire(b), false);
  await a.evaluate(() => {
    const store = createTrainingStorage(localStorage, 'active', 'history');
    store.read('active', null, () => true);
    store.read('history', [], Array.isArray);
    store.write('active', { id: 'one' });
    store.finish({ id: 'one' }, [], 123);
  });
  await a.close();
  await b.waitForFunction(async () => !(await navigator.locks.query()).held.some(lock => lock.name === 'form.training.writer.v1'));
  assert.equal(await acquire(b), true);
  assert.equal(await b.evaluate(() => JSON.parse(localStorage.getItem('history'))[0].finished), 123);
  assert.equal(await b.evaluate(() => JSON.parse(localStorage.getItem('active'))), null);
  await b.close();
}

async function checkWorkout(context, url) {
  const page = await context.newPage();
  const errors = [], artworkSearches = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (new URL(request.url()).hostname === 'oss.exercisedb.dev') artworkSearches.push(request.url());
  });
  await page.route('**/*', route => route.request().url().startsWith(url) ? route.continue() : route.abort());
  await page.addInitScript(() => localStorage.setItem('form.demo-mode.v1', 'true'));
  let acceptDialog = true;
  page.on('dialog', dialog => acceptDialog ? dialog.accept() : dialog.dismiss());
  const click = selector => page.locator(selector).click();
  const dock = name => click('#dock [data-page="' + name + '"]');
  const screen = name => page.locator('[data-screen="' + name + '"]').waitFor({ state: 'visible' });
  const openLab = async () => {
    await dock('Profile');
    await page.locator('[data-setting-page="Developer settings"]').click();
    await screen('Developer settings');
  };
  const storage = key => page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  const upload = data => page.locator('input[type=file]').setInputFiles({
      name: 'training.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)),
    });

  await page.goto(url);
  await page.waitForFunction(() => !!window.FormTraining && !!window.FormExerciseLibrary);
  for (const name of ['Progress', 'Profile', 'Home', 'Workouts']) {
    await dock(name);
    await screen(name);
    assert.equal(await page.locator('#dock [aria-pressed=true]').getAttribute('data-page'), name);
  }
  await click('#routine-list [data-routine] >> nth=0');
  await click('#routine-start');
  await click('#workout-exercises [data-complete] >> nth=0');
  assert.equal((await storage(activeKey)).exercises[0].sets[0].done, true);
  await page.reload();
  await page.waitForFunction(() => !!window.FormTraining?.sessionName());
  await dock('Workouts');
  await click('#resume-workout');
  await click('#workout-finish');
  assert.equal(await storage(activeKey), null);
  assert.equal((await storage(historyKey)).length, 1);

  await openLab();
  await upload(fixture);
  await page.getByRole('status').filter({ hasText: 'Imported 1 routines' }).waitFor();
  assert.deepEqual((await storage(importKey)).routines, fixture.routines);
  const searchCount = artworkSearches.length;
  assert.ok(searchCount > 0, 'sample artwork should exercise the network request monitor');

  await dock('Workouts');
  await click('[data-routine=constructor]');
  await click('#routine-edit');
  await page.locator('[data-edit="0:0:rest"]').fill('45');
  await dock('Home');
  await dock('Workouts');
  await click('[data-routine=constructor]');
  assert.equal(await page.locator('[data-edit="0:0:rest"]').inputValue(), '45');
  await click('#routine-edit');
  await click('#routine-start');
  await screen('Workout');

  const weight = page.locator('[data-log="0:0:weight"]');
  await weight.fill('30');
  await weight.press('Delete');
  assert.equal(await page.locator('#workout-exercises [data-delete="0"]').isHidden(), true);
  await weight.fill('30');
  await click('[data-add-set="0"]');
  assert.equal((await storage(activeKey)).exercises[0].sets.length, 3);
  await click('[data-choice="1"]');
  await page.locator('[data-choice="1"]').press('Delete');
  await click('#workout-choices [data-delete="1"]');
  assert.equal((await storage(activeKey)).exercises.length, 1);

  await click('[data-complete="0:0"]');
  const started = await storage(activeKey);
  assert.equal(started.exercises[0].sets[0].weight, 30);
  assert.equal(started.exercises[0].sets[0].done, true);
  assert.equal(started.restTotal, 45000);
  assert.ok(started.restEnd > started.started);
  await click('#rest-pause');
  const paused = (await storage(activeKey)).restPaused;
  assert.ok(paused > 0 && paused <= 45000);
  await click('#rest-plus');
  assert.equal((await storage(activeKey)).restPaused, paused + 15000);
  await click('#rest-minus');
  assert.equal((await storage(activeKey)).restPaused, paused);

  await click('#diagnostic-open');
  await screen('Diagnostics');
  await openLab();
  await upload({ ...fixture, routines: [{ ...fixture.routines[0], id: 'replacement' }] });
  await page.getByRole('status').filter({ hasText: 'Finish your active workout or edits first' }).waitFor();
  assert.deepEqual((await storage(importKey)).routines, fixture.routines);
  await page.reload();
  await page.waitForFunction(() => window.FormTraining?.sessionName() === 'Private routine');
  await dock('Workouts');
  await click('#resume-workout');
  assert.equal((await storage(activeKey)).restPaused, paused);
  await click('#rest-pause');
  assert.equal((await storage(activeKey)).restPaused, null);
  await click('#rest-skip');
  assert.equal((await storage(activeKey)).restEnd, 0);

  acceptDialog = false;
  await click('#workout-finish');
  assert.equal((await storage(activeKey)).id, started.id);
  acceptDialog = true;
  await click('#workout-finish');
  await screen('Workouts');
  assert.equal(await storage(activeKey), null);
  const history = await storage(historyKey);
  assert.equal(history.length, 2);
  assert.equal(history[1].id, started.id);
  assert.equal(history[1].exercises[0].sets[0].done, true);
  assert.equal(artworkSearches.length, searchCount);
  assert.deepEqual(errors, []);
}

async function checkDuoLayout(context, url) {
  const page = await context.newPage();
  await page.route('**/*', route => route.request().url().startsWith(url) ? route.continue() : route.abort());
  await page.addInitScript(() => {
    Object.defineProperty(screen.orientation, 'angle', { get: () => window.testRotation });
  });
  await page.goto(url);
  const cases = [
    ['FP', 382, 678, 0, 'bottom'],
    ['FL1', 594, 466, 90, 'rail'],
    ['FL2', 594, 466, 270, 'rail'],
    ['FL1 / FL2', 594, 466, 0, 'rail'],
    ['UP', 669, 869, 0, 'bottom'],
    ['UL', 867, 669, 270, 'rail'],
  ];
  for (const [orientation, width, height, rotation, nav] of cases) {
    await page.setViewportSize({ width, height });
    await page.evaluate(rotation => {
      window.testRotation = rotation;
      dispatchEvent(new Event('orientationchange'));
    }, rotation);
    await page.waitForFunction(orientation => document.body.dataset.orientation === orientation, orientation);
    assert.equal(await page.locator('body').getAttribute('data-viewport-mode'), 'Safari-sized');
    assert.equal(await page.locator('body').getAttribute('data-nav'), nav, orientation);
    const dock = await page.locator('#dock').boundingBox();
    assert.ok(dock && dock.x >= 0 && dock.y >= 0 &&
      dock.x + dock.width <= width && dock.y + dock.height <= height, orientation);
    if (orientation === 'FL1 / FL2') {
      assert.equal(await page.locator('#calibration').getAttribute('data-landscape'), 'true');
    }
  }
  await page.close();
}

async function main() {
  const server = http.createServer(serve);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const url = 'http://127.0.0.1:' + server.address().port;
  const browserType = process.env.FORM_BROWSER === 'webkit' ? webkit : chromium;
  let browser;
  try {
    browser = await browserType.launch({ executablePath: process.env.FORM_BROWSER_EXECUTABLE });
    const context = await browser.newContext();
    context.setDefaultTimeout(8000);
    await checkLock(context, url);
    await checkWorkout(context, url);
    await checkDuoLayout(context, url);
    console.log('Browser lock, navigation, import, draft, exercise management, rest recovery, workout completion and Duo viewport checks passed');
  } finally {
    await browser?.close();
    server.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
