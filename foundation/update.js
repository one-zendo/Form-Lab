/* Poll the deployed version without reloading unsaved training state. */
(() => {
  const current = Number(document.querySelector('meta[name="form-build"]')?.content);
  let busy = false;
  let reloading = false;

  async function check() {
    if (busy || reloading || document.hidden || !Number.isSafeInteger(current)) return;
    busy = true;
    try {
      const url = new URL('version.json', document.baseURI);
      url.searchParams.set('_', Date.now());
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) return;
      const { build } = await response.json();
      if (!Number.isSafeInteger(build) || build <= current || document.hidden) return;
      const training = window.FormTraining;
      if (!training || training.blocksReload() || document.querySelector('dialog[open]')) return;

      const next = new URL(location.href);
      if (next.searchParams.get('build') === String(build)) return;
      next.searchParams.set('build', String(build));
      reloading = true;
      location.replace(next.href);
    } catch {
      // Offline or deployment in progress. Try again on the next tick.
    } finally {
      busy = false;
    }
  }

  setInterval(check, 5000);
  document.addEventListener('visibilitychange', check);
  window.addEventListener('online', check);
  check();
})();
