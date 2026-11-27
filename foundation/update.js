/* Layout Lab has an independent build sequence. */
(() => {
  const current = Number(document.querySelector('meta[name="form-build"]').content);
  let checking = false;

  async function check() {
    if (checking || document.hidden) return;
    checking = true;
    try {
      const url = new URL('version.json', document.baseURI);
      url.searchParams.set('_', Date.now());
      const response = await fetch(url, { cache: 'no-store' });
      if (!response.ok) return;
      const { series, build } = await response.json();
      if (series !== 'layout-lab' || !Number.isSafeInteger(build) || build <= current ||
          document.hidden || document.querySelector('dialog[open]')) return;

      const next = new URL(location.href);
      if (next.searchParams.get('build') === String(build)) return;
      next.searchParams.set('build', String(build));
      location.replace(next.href);
    } catch {
      // Retry on the next tick if offline or Pages is still publishing.
    } finally {
      checking = false;
    }
  }

  setInterval(check, 5000);
})();
