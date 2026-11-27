(() => {
  const readout = document.querySelector('#readout');
  let pending = false;
  let lastReadout = '';

  function render() {
    pending = false;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const angle = screen.orientation?.angle ??
      (typeof window.orientation === 'number' ? (window.orientation % 360 + 360) % 360 : undefined);
    const { id, mode } = FormOrientation.detect(FormDuoGeometry, width, height, angle);
    const geometry = FormOrientation.geometryFor(FormDuoGeometry, id);
    const posture = FormPosture.read();
    const state = document.body.dataset;
    if (state.orientation !== id) state.orientation = id;
    if (state.viewportMode !== mode) state.viewportMode = mode;

    const visual = window.visualViewport;
    const safe = getComputedStyle(document.querySelector('#safe-probe'));
    const camera = geometry?.camera;
    const headlineCenter = geometry ? (id === 'UP' && mode === 'Safari-sized' ? 130 : 48) : null;
    const safari = mode === 'Safari-sized';
    const drawable = geometry
      ? (geometry.w - (safari && geometry.side !== 'top' ? geometry.excluded : 0)) + ' × ' +
        (geometry.h - (safari && geometry.side === 'top' ? geometry.excluded : 0)) + ' pt'
      : 'Unresolved';
    const rows = [
      ['Environment', 'Layout Lab web preview'],
      ['Orientation', id],
      ['Detection', 'Automatic · ' + mode],
      ['Layout viewport', width + ' × ' + height + ' CSS px'],
      ['Visual viewport', visual ? Math.round(visual.width) + ' × ' + Math.round(visual.height) + ' CSS px' : 'Unavailable'],
      ['Safe insets (top / right / bottom / left)', [safe.paddingTop, safe.paddingRight, safe.paddingBottom, safe.paddingLeft].join(' / ')],
      ['Physical target', geometry ? geometry.w + ' × ' + geometry.h + ' pt' : 'Unresolved'],
      ['Drawable target', drawable],
      ['Recorded Safari exclusion', geometry ? (geometry.side ?? 'Left or right') + ' · ' + geometry.excluded + ' pt' : 'Unresolved'],
      ['Calibrated headline center Y (physical)', headlineCenter === null ? 'Unresolved' : headlineCenter + ' pt'],
      ['Recorded camera center (physical)', camera ? camera.join(', ') + ' pt' : 'Unresolved'],
      ['Posture API', posture.type],
      ['Segments', posture.columns + ' × ' + posture.rows],
      ['Hinge', posture.type === 'unknown' ? 'Unknown' : posture.mode],
      ['Rotation angle', angle ?? 'Unavailable'],
    ];
    const signature = JSON.stringify(rows);
    if (signature === lastReadout) return;
    lastReadout = signature;
    readout.replaceChildren(...rows.map(([key, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = key;
      description.textContent = value;
      row.append(term, description);
      return row;
    }));
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(render);
  }

  for (const event of ['resize', 'orientationchange', 'pageshow']) window.addEventListener(event, schedule);
  window.visualViewport?.addEventListener('resize', schedule);
  screen.orientation?.addEventListener?.('change', schedule);
  navigator.devicePosture?.addEventListener?.('change', schedule);
  FormPosture.listen(schedule);
  document.addEventListener('visibilitychange', schedule);
  const diagnostics = document.querySelector('#diagnostics');
  document.querySelector('#diagnostic-open').addEventListener('click', () => diagnostics.showModal());
  render();
})();
