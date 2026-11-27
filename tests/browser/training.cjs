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
  // Closing a page and observing query() does not guarantee the lock manager
  // has finished teardown. Retry the real nonblocking acquisition, bounded.
  const deadline = Date.now() + 10000;
  let acquired = false;
  do {
    acquired = await acquire(b);
    if (!acquired) await new Promise(resolve => setTimeout(resolve, 100));
  } while (!acquired && Date.now() < deadline);
  assert.equal(acquired, true, 'Writer lock must transfer after the original tab closes');
  assert.equal(await b.evaluate(() => JSON.parse(localStorage.getItem('history'))[0].finished), 123);
  assert.equal(await b.evaluate(() => JSON.parse(localStorage.getItem('active'))), null);
  await b.close();
}

async function checkWorkout(context, url) {
  const page = await context.newPage();
  const errors = [], artworkRequests = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => {
    if (/exercisedb|exercise-dataset|repdb/i.test(request.url())) artworkRequests.push(request.url());
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
  await page.waitForFunction(() => !!window.FormTraining);
  for (const name of ['Progress', 'Profile', 'Home', 'Workouts']) {
    await dock(name);
    await screen(name);
    assert.equal(await page.locator('#dock [aria-pressed=true]').getAttribute('data-page'), name);
  }
  await click('#routine-list [data-routine] >> nth=0');
  assert.ok(await page.locator('#routine-exercises .training-thumb svg').count());
  assert.equal(await page.locator('[data-performance-range="12W"]').getAttribute('aria-pressed'),'true');
  await click('[data-performance-range="1Y"]');
  assert.equal(await page.locator('[data-performance-range="1Y"]').getAttribute('aria-pressed'),'true');
  const chart=page.locator('#routine-chart svg');
  if(await chart.getAttribute('role')==='slider'){
    await chart.press('Home');
    assert.equal(await chart.getAttribute('aria-valuenow'),'1');
    await chart.press('End');
    assert.equal(await chart.getAttribute('aria-valuenow'),await chart.getAttribute('aria-valuemax'));
    const bounds=await chart.boundingBox();
    await page.mouse.click(bounds.x+2,bounds.y+bounds.height/2);
    assert.equal(await chart.getAttribute('aria-valuenow'),'1');
  }
  await click('[data-performance-range="4W"]');
  if(await page.locator('#performance-prev').isEnabled()){
    const period=await page.locator('#performance-period').innerText();
    await click('#performance-prev');
    assert.notEqual(await page.locator('#performance-period').innerText(),period);
    await click('#performance-next');
    assert.equal(await page.locator('#performance-period').innerText(),period);
  }
  await click('[data-performance-range="12W"]');
  await click('#routine-start');
  assert.ok(await page.locator('#workout-exercises .training-thumb svg').count());
  assert.equal(await page.locator('#workout-exercises details:not([open])').count(),0);
  await page.locator('#workout-exercises [data-exercise="1"] summary').click();
  await page.waitForFunction(()=>JSON.parse(localStorage.getItem('form.training.demo.v1')).exercises[1].collapsed===true);
  assert.equal(await page.locator('#workout-exercises [data-exercise="1"] details').getAttribute('open'),null);

  await click('#workout-exercises [data-complete] >> nth=0');
  assert.match(await page.locator('#workout-sets').innerText(), /^1 of /);
  await page.locator('#workout-exercises [data-exercise="0"] [data-tool="note"]').click();
  await page.locator('[data-exercise-note="0"]').fill('Test workout note');
  assert.equal((await storage(activeKey)).exercises[0].note,'Test workout note');

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
  const failures = [];
  const check = (actual, expected, message) => {
    if (actual !== expected) failures.push({ message, actual, expected });
  };
  await dock('Progress');
  check(await page.locator('#progress-summary strong').first().innerText(), '1', 'Progress includes the just-finished private workout');
  await openLab();
  const other = {
    ...fixture,
    routines: [{ ...fixture.routines[0], name: 'Other dataset', exercises: [['Other exercise', 1, 4]] }],
  };
  await upload(other);
  await page.getByText('Imported 1 routines', { exact: false }).waitFor();
  await dock('Progress');
  check(await page.locator('#progress-summary strong').first().innerText(), '0', 'Progress excludes history from another dataset');
  await dock('Workouts');
  await click('[data-routine=constructor]');
  check(await page.locator('#routine-exercises summary strong').first().innerText(), 'Other exercise', 'Reused ID does not inherit edited exercises');
  check(await page.locator('#routine-history summary').count(), 0, 'Reused ID does not inherit prior history');
  await page.reload();
  await page.waitForFunction(() => !!window.FormTraining);
  await openLab();
  await upload(fixture);
  await page.getByText('Imported 1 routines', { exact: false }).waitFor();
  await dock('Workouts');
  await click('[data-routine=constructor]');
  await click('#routine-edit');
  check(await page.locator('[data-edit="0:0:rest"]').inputValue(), '45', 'Reimport restores the original exercise modifications');
  await click('#routine-edit');
  check(await page.locator('#routine-history summary').count(), 1, 'Reimport recovers the original dataset history');
  await dock('Progress');
  check(await page.locator('#progress-summary strong').first().innerText(), '1', 'Reimport recovers the original Progress after reload');
  assert.deepEqual(failures, []);
  assert.deepEqual(artworkRequests, []);
  assert.deepEqual(errors, []);
}

async function checkLegacyRecovery(context, url) {
  const page = await context.newPage();
  await page.route('**/*', route => route.request().url().startsWith(url) ? route.continue() : route.abort());
  const legacyOverridesKey = 'form.training.routines.demo.v1';
  const legacyHistory = {
    id: 'unscoped', routineId: fixture.routines[0].id, name: 'Old workout', started: 1000, finished: 2000,
    exercises: [{ name: 'Old exercise', sets: [{ reps: 19, done: true }] }],
  };
  const legacyOverrides = { [fixture.routines[0].id]: legacyHistory.exercises };
  await page.addInitScript(({ fixture, legacyHistory, legacyOverrides, legacyOverridesKey, importKey, historyKey }) => {
    if (sessionStorage.getItem('legacy-fixture')) return;
    sessionStorage.setItem('legacy-fixture', 'true');
    localStorage.setItem('form.demo-mode.v1', 'true');
    localStorage.setItem(importKey, JSON.stringify(fixture));
    localStorage.setItem(historyKey, JSON.stringify([legacyHistory]));
    localStorage.setItem(legacyOverridesKey, JSON.stringify(legacyOverrides));
  }, { fixture, legacyHistory, legacyOverrides, legacyOverridesKey, importKey, historyKey });
  page.on('dialog', dialog => dialog.accept());
  await page.goto(url);
  await page.waitForFunction(() => !!window.FormTraining);
  const storage = key => page.evaluate(key => JSON.parse(localStorage.getItem(key)), key);
  const click = selector => page.locator(selector).click();
  const openLab = async () => {
    await click('#dock [data-page=Profile]');
    await click('[data-setting-page="Developer settings"]');
  };
  const upload = data => page.locator('input[type=file]').setInputFiles({
    name: 'training.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(data)),
  });

  await click('#dock [data-page=Workouts]');
  await click('[data-routine=constructor]');
  assert.equal(await page.locator('#routine-exercises summary strong').first().innerText(), 'Private exercise');
  assert.equal(await page.locator('#routine-history summary').count(), 0);
  await openLab();
  const replacement = { ...fixture, routines: [{ ...fixture.routines[0], name: 'Replacement' }] };
  await page.evaluate(key => {
    const original = Storage.prototype.setItem;
    window.restoreStorage = () => { Storage.prototype.setItem = original; };
    Storage.prototype.setItem = function (name, value) {
      if (name === key) throw new DOMException('Test quota rejection', 'QuotaExceededError');
      return original.call(this, name, value);
    };
  }, importKey);
  await upload(replacement);
  await page.getByRole('status').filter({ hasText: 'Could not save private training data' }).waitFor();
  assert.deepEqual(await storage(importKey), fixture);
  await page.evaluate(() => window.restoreStorage());
  await upload(replacement);
  await page.getByRole('status').filter({ hasText: 'Imported 1 routines' }).waitFor();
  assert.equal((await storage(importKey)).archivedDatasets[0].routines[0].name, fixture.routines[0].name);
  assert.deepEqual(await storage(legacyOverridesKey), legacyOverrides);
  assert.deepEqual(await storage(historyKey), [legacyHistory]);
  await page.reload();
  await page.waitForFunction(() => !!window.FormTraining);
  await openLab();
  await upload(fixture);
  await page.getByRole('status').filter({ hasText: 'Imported 1 routines' }).waitFor();
  assert.equal((await storage(importKey)).datasetId, 'private:legacy');
  assert.deepEqual(await storage(legacyOverridesKey), legacyOverrides);
  assert.deepEqual(await storage(historyKey), [legacyHistory]);
  await page.close();
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

async function checkTrainingPresentation(context, url) {
  const page = await context.newPage();
  await page.route('**/*', route => route.request().url().startsWith(url) ? route.continue() : route.abort());
  await page.addInitScript(() => {
    localStorage.setItem('form.demo-mode.v1', 'true');
    localStorage.setItem('form.appearance', 'graphite-lime');
    Object.defineProperty(screen.orientation, 'angle', { get: () => window.testRotation });
  });
  const capture = async name => {
    const directory = process.env.FORM_UI_EVIDENCE_DIR;
    if (directory) await page.screenshot({ path: directory + '/' + name + '.png', animations: 'disabled' });
  };
  const cases = [
    ['FP', 0, 'flex', [382, 678], [466, 678]],
    ['FL1', 90, 'grid', [594, 466], [678, 466]],
    ['FL2', 270, 'grid', [594, 466], [678, 466]],
    ['UP', 0, 'flex', [669, 869], [669, 951]],
    ['UL', 270, 'grid', [867, 669], [951, 669]],
  ];
  const failures = [];
  const check = (actual, expected, message) => {
    if (actual !== expected) failures.push({ message, actual, expected });
  };
  const resize = async (orientation, angle, [width, height], mode) => {
    await page.setViewportSize({ width, height });
    await page.evaluate(angle => {
      window.testRotation = angle;
      dispatchEvent(new Event('orientationchange'));
    }, angle);
    await page.waitForFunction(([orientation, mode]) =>
      document.body.dataset.orientation === orientation && document.body.dataset.viewportMode === mode,
    [orientation, mode]);
  };
  const dock = name => page.locator('#dock [data-page="' + name + '"]').click();
  await page.goto(url);
  await page.waitForFunction(() => !!window.FormTraining);
  for (const [orientation, angle, display, safari, native] of cases) {
    for (const [mode, size] of [['Safari-sized', safari], ['Native-sized', native]]) {
      await resize(orientation, angle, size, mode);
      await dock('Workouts');
      await page.locator('#routine-list [data-routine]').first().click();
      const layout = await page.locator('[data-screen=Routine]').evaluate(section => {
        const [overview, list, action] = ['.training-overview', '.training-list', '.training-action']
          .map(selector => section.querySelector(selector).getBoundingClientRect());
        return {
          display: getComputedStyle(section).display,
          columns: overview.right <= list.left && overview.top === list.top,
          actionFits: action.top >= 0 && action.bottom <= innerHeight,
          scrollOwner: getComputedStyle(section.querySelector('.training-list')).overflowY,
        };
      });
      check(layout.display, display, orientation + ' ' + mode + ' Routine display');
      check(layout.columns, display === 'grid', orientation + ' ' + mode + ' Routine column bounds');
      if (display === 'grid') {
        check(layout.actionFits, true, orientation + ' ' + mode + ' visible Start action');
        check(layout.scrollOwner, 'auto', orientation + ' ' + mode + ' independent exercise scrolling');
      }
      if (orientation === 'FL1' && mode === 'Safari-sized') await capture('landscape-routine');
    }
  }
  await resize('FL1', 90, [594, 466], 'Safari-sized');
  await page.locator('#routine-start').click();
  for (const [orientation, angle, , safari, native] of cases) {
    for (const [mode, size] of [['Safari-sized', safari], ['Native-sized', native]]) {
      await resize(orientation, angle, size, mode);
      const measured = await page.evaluate(() => {
        const h=document.querySelector('.headline').getBoundingClientRect(), f=document.querySelector('#workout-finish').getBoundingClientRect();
        return {center:Math.round(h.top+h.height/2),signature:getComputedStyle(document.querySelector('.signature')).display,finishAligned:Math.abs((f.top+f.height/2)-(h.top+h.height/2))<=1,padding:parseFloat(getComputedStyle(document.querySelector('.content')).paddingTop)};
      });
      check(measured.center,48,orientation+' '+mode+' workout headline local center');
      check(measured.signature==='none',true,orientation+' '+mode+' workout signature visibility');
      check(measured.finishAligned,true,orientation+' '+mode+' Finish alignment');
      if(orientation==='UP')check(measured.padding,78,orientation+' '+mode+' workout content clearance');
    }
  }
  await resize('FL1',90,[594,466],'Safari-sized');
  const choice = page.locator('[data-choice="0"]');
  await choice.focus();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  check(await choice.evaluate(button => document.activeElement === button), true, 'Keyboard returns to selected exercise');
  check(await choice.evaluate(button => getComputedStyle(button).outlineStyle), 'solid', 'Selected exercise has keyboard focus indicator');
  await resize('FP', 0, [382, 678], 'Safari-sized');
  const finish = page.locator('#workout-finish');
  const palette = () => finish.evaluate(el => {
    const style = getComputedStyle(el);
    return style.backgroundColor + ' / ' + style.color;
  });
  check(await palette(), 'rgb(245, 245, 245) / rgb(28, 28, 30)', 'Graphite Lime Finish palette');
  await capture('graphite-lime-finish');
  await page.locator('#appearance').evaluate(select => {
    select.value = 'light';
    select.dispatchEvent(new Event('change'));
  });
  check(await palette(), 'rgb(28, 28, 30) / rgb(255, 255, 255)', 'Light Finish palette');
  const completion = page.locator('[data-complete="0:0"]');
  await completion.focus();
  await completion.press('Enter');
  check(await completion.getAttribute('aria-pressed'), 'true', 'Keyboard completes set');
  check(await completion.evaluate(button => button === document.activeElement), true, 'Completion retains keyboard focus');
  await capture('set-completion-focus');
  await completion.press('Space');
  check(await completion.getAttribute('aria-pressed'), 'false', 'Space toggles completed set');
  check(await completion.evaluate(button => button === document.activeElement), true, 'Toggling retains keyboard focus');
  assert.deepEqual(failures, []);
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
    const legacyContext = await browser.newContext();
    legacyContext.setDefaultTimeout(8000);
    await checkLegacyRecovery(legacyContext, url);
    await legacyContext.close();
    await checkWorkout(context, url);
    await checkDuoLayout(context, url);
    const presentationContext = await browser.newContext();
    presentationContext.setDefaultTimeout(8000);
    await checkTrainingPresentation(presentationContext, url);
    await presentationContext.close();
    console.log('Browser lock, navigation, dataset isolation, legacy recovery, Progress, workout lifecycle and Duo viewport checks passed');
  } finally {
    await browser?.close();
    server.close();
  }
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
