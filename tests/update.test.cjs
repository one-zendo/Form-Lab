const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync('foundation/update.js', 'utf8');

test('updates wait for training initialization, unsaved changes and dialogs', async () => {
  const replacements = [];
  const window = { addEventListener() {} };
  let tick;
  let dialog = false;
  const document = {
    hidden: false,
    baseURI: 'https://example.test/Lab/',
    addEventListener() {},
    querySelector(selector) {
      return selector === 'dialog[open]' ? dialog : { content: '91' };
    },
  };
  const location = {
    href: 'https://example.test/Lab/?keep=yes#section',
    replace(url) { replacements.push(url); },
  };
  vm.runInNewContext(source, {
    URL, document, window, location,
    setInterval(callback, interval) {
      assert.equal(interval, 5000);
      tick = callback;
    },
    async fetch(url, options) {
      assert.equal(url.pathname, '/Lab/version.json');
      assert.ok(url.searchParams.has('_'));
      assert.equal(options.cache, 'no-store');
      return { ok: true, async json() { return { build: 92 }; } };
    },
  });
  await new Promise(setImmediate);
  assert.deepEqual(replacements, []);
  window.FormTraining = { blocksReload: () => true };
  await tick();
  assert.deepEqual(replacements, []);
  window.FormTraining = { blocksReload: () => false };
  dialog = true;
  await tick();
  assert.deepEqual(replacements, []);
  dialog = false;
  await tick();
  await tick();
  assert.deepEqual(replacements, ['https://example.test/Lab/?keep=yes&build=92#section']);
});
