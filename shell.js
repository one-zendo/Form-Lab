(() => {
  const readout = document.querySelector('#readout');
  const home = document.querySelector('#home');
  const safeProbe = document.querySelector('#safe-probe');
  const dockRegion = home.querySelector('.dock-region');
  const timerRegion = home.querySelector('.timer-region');
  const timerPreview = document.querySelector('#timer-preview');
  const regions = [...home.querySelectorAll('.headline-clearance, .tagline-region, .timer-region, .content'), dockRegion];

  function positionDockAndAvoidCamera(id, mode, camera) {
    const side = FormViewport.dockSide(id, mode);
    if (home.dataset.dock !== side) home.dataset.dock = side;
    const margin = parseFloat(getComputedStyle(home).getPropertyValue('--camera-clearance'));
    for (const region of regions) {
      const vertical = region === dockRegion && side === 'right';
      const [start, end] = region.hidden ? [0, 0] :
        FormViewport.clearance(region.getBoundingClientRect(), camera, vertical, margin);
      for (const [property, inset] of [['--avoid-start', start], ['--avoid-end', end]]) {
        const value = inset + 'px';
        if (region.style.getPropertyValue(property) !== value) region.style.setProperty(property, value);
      }
    }
  }
  let pending = false;
  let settleTimer;
  let lastLayout = '';
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
    const bounds = FormViewport.visibleBounds(visual, width, height);
    const safe = getComputedStyle(safeProbe);
    const insets = [safe.paddingTop, safe.paddingRight, safe.paddingBottom, safe.paddingLeft];
    const layoutSignature = JSON.stringify([id, mode, bounds, insets, width, height]);
    const projectedCamera = FormViewport.cameraBounds(geometry, mode);
    if (layoutSignature !== lastLayout) {
      lastLayout = layoutSignature;
      for (const edge of ['left', 'top', 'width', 'height']) {
        const property = '--viewport-' + edge;
        if (bounds) {
          const value = bounds[edge] + 'px';
          if (home.style.getPropertyValue(property) !== value) home.style.setProperty(property, value);
        } else {
          home.style.removeProperty(property);
        }
      }
    }
    positionDockAndAvoidCamera(id, mode, projectedCamera);
    home.dispatchEvent(new CustomEvent('form:layout', {
      detail: { camera: projectedCamera, insets: insets.map(value => parseFloat(value) || 0) },
    }));
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
      ['Navigation placement', home.dataset.dock === 'right' ? 'Right rail' : 'Bottom dock'],
      ['Layout viewport', width + ' × ' + height + ' CSS px'],
      ['Visual viewport', visual ? Math.round(visual.width) + ' × ' + Math.round(visual.height) + ' CSS px' : 'Unavailable'],
      ['Safe insets (top / right / bottom / left)', insets.join(' / ')],
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

  function viewportChanged() {
    schedule();
    // A rotation can deliver its final dimensions or insets after its last event.
    clearTimeout(settleTimer);
    settleTimer = setTimeout(schedule, 180);
  }

  for (const event of ['resize', 'orientationchange', 'pageshow']) {
    window.addEventListener(event, viewportChanged);
  }
  window.visualViewport?.addEventListener('resize', viewportChanged);
  window.visualViewport?.addEventListener('scroll', viewportChanged);
  screen.orientation?.addEventListener?.('change', viewportChanged);
  navigator.devicePosture?.addEventListener?.('change', schedule);
  FormPosture.listen(schedule);
  document.addEventListener('visibilitychange', schedule);
  timerPreview.checked = false;
  timerPreview.addEventListener('change', () => {
    timerRegion.hidden = !timerPreview.checked;
    schedule();
  });
  const diagnostics = document.querySelector('#diagnostics');
  document.querySelector('#diagnostic-open').addEventListener('click', () => diagnostics.showModal());
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(schedule);
    for (const edge of safeProbe.children) observer.observe(edge);
    observer.observe(home.querySelector('.headline-region'));
    observer.observe(timerRegion);
  }
  render();
})();
