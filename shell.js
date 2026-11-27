(() => {
  const viewportProbe = document.querySelector('#viewport-probe');
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
    const rawVisual = visual && {
      width: visual.width, height: visual.height, scale: visual.scale,
      offsetLeft: visual.offsetLeft, offsetTop: visual.offsetTop,
    };
    const safe = getComputedStyle(safeProbe);
    const insets = [safe.paddingTop, safe.paddingRight, safe.paddingBottom, safe.paddingLeft];
    const projectedCamera = FormViewport.cameraBounds(geometry, mode);
    positionDockAndAvoidCamera(id, mode, projectedCamera);
    home.dispatchEvent(new CustomEvent('form:layout', {
      detail: {
        id, mode, geometry, posture, angle, camera: projectedCamera,
        layout: { width, height }, visual: rawVisual, probe: viewportProbe.getBoundingClientRect(),
        insets: insets.map(value => parseFloat(value) || 0),
      },
    }));
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(render);
  }

  const viewportChanged = schedule;

  for (const event of ['resize', 'orientationchange', 'pageshow']) {
    window.addEventListener(event, viewportChanged);
  }
  window.visualViewport?.addEventListener('resize', viewportChanged);
  window.visualViewport?.addEventListener('scroll', viewportChanged);
  screen.orientation?.addEventListener?.('change', viewportChanged);
  navigator.devicePosture?.addEventListener?.('change', schedule);
  FormPosture.listen(schedule);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) viewportChanged();
  });
  timerPreview.checked = false;
  timerPreview.addEventListener('change', () => {
    timerRegion.hidden = !timerPreview.checked;
    schedule();
  });
  const diagnostics = document.querySelector('#diagnostics');
  document.querySelector('#diagnostic-open').addEventListener('click', () => diagnostics.showModal());
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(schedule);
    const viewportObserver = new ResizeObserver(viewportChanged);
    viewportObserver.observe(viewportProbe);
    for (const edge of safeProbe.children) viewportObserver.observe(edge);
    observer.observe(home.querySelector('.headline-region'));
    observer.observe(timerRegion);
  }
  render();
})();
