(() => {
  const overlay = document.querySelector('#diagnostic-overlay');
  const master = document.querySelector('#guides');
  const labels = document.querySelector('#guide-labels');
  const guideInputs = [...document.querySelectorAll('[data-guide]')];
  const inputs = [master, labels, ...guideInputs];
  const guides = new Map(guideInputs.map(input => [input.dataset.guide, input]));
  const status = document.querySelector('#storage-status');
  const storageKey = 'form.diagnostics.v1';
  const inputKey = input => input.id || input.dataset.guide;
  const home = document.querySelector('#home');
  const readout = document.querySelector('#readout');
  const measurements = readout.closest('details');
  const headline = home.querySelector('.headline');
  const tagline = home.querySelector('.tagline');
  const content = home.querySelector('.content');
  const timer = home.querySelector('.timer-placeholder');
  const cards = [...content.querySelectorAll('.form-card')];
  const dock = document.querySelector('#dock');
  let pending = false;
  let sample;
  let lastReadout = '';
  const names = {
    FP: 'Folded Portrait',
    FL1: 'Folded Landscape 1',
    FL2: 'Folded Landscape 2',
    UP: 'Unfolded Portrait',
    UL: 'Unfolded Landscape',
  };
  const fmt = number => Number(number.toFixed(1));
  const size = ({ width, height }) => fmt(width) + ' × ' + fmt(height) + ' px';
  const xy = (x, y) => fmt(x) + ', ' + fmt(y) + ' px';

  function updateReadout(viewport) {
    const { id, mode, geometry, posture, angle, camera, layout, visual, probe, insets } = sample;
    const nav = dock.getBoundingClientRect();
    const safari = mode === 'Safari-sized';
    const drawable = geometry && [
      geometry.w - (safari && geometry.side !== 'top' ? geometry.excluded : 0),
      geometry.h - (safari && geometry.side === 'top' ? geometry.excluded : 0),
    ];
    const rows = [
      ['Orientation', id],
      ['Detected environment', mode],
      ['Physical display reference', geometry ? geometry.w + ' × ' + geometry.h + ' pt' : 'Unresolved'],
      ['Drawable reference for detected environment', drawable ? drawable.join(' × ') + ' pt' : 'Unresolved'],
      ['Calibrated headline center Y (physical reference)', geometry ? (id === 'UP' && safari ? '130 pt' : '48 pt') : 'Unresolved'],
      ['Recorded Safari exclusion', geometry ? (geometry.side ?? 'Left or right') + ' · ' + geometry.excluded + ' pt' : 'Unresolved'],
      ['Recorded camera center (physical reference)', geometry?.camera ? geometry.camera.join(', ') + ' pt' : 'Unresolved'],
      ['Projected camera boundaries (left / top / right / bottom)', camera
        ? [camera.left, camera.top, camera.right, camera.bottom].map(fmt).join(' / ') + ' px' : 'Unresolved'],
      ['Raw layout viewport', size(layout)],
      ['Raw visual viewport', visual ? size(visual) : 'Unavailable'],
      ['Visual viewport offsets (left, top)', visual ? xy(visual.offsetLeft, visual.offsetTop) : 'Unavailable'],
      ['Visual viewport scale', visual ? fmt(visual.scale) : 'Unavailable'],
      ['CSS viewport probe (100vw × 100dvh)', size(probe)],
      ['Resolved usable viewport', size(viewport)],
      ['Resolved viewport origin (left, top)', xy(viewport.left, viewport.top)],
      ['Safe insets (top / right / bottom / left)', insets.map(value => fmt(value) + 'px').join(' / ')],
      ['Content pane', size(content.getBoundingClientRect())],
      ...cards.map((card, index) => ['Card ' + (index + 1), size(card.getBoundingClientRect())]),
      ['Timer', timer.parentElement.hidden ? 'Hidden' : 'Visible · ' + size(timer.getBoundingClientRect())],
      ['Navigation position', (home.dataset.dock === 'right' ? 'Right rail' : 'Bottom dock') +
        ' · ' + xy(nav.left, nav.top) + ' · ' + size(nav)],
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

  function addOrientationIndicator(layer, viewport) {
    const { id, mode, insets } = sample;
    const indicator = document.createElement('div');
    indicator.className = 'orientation-indicator';
    const title = document.createElement('strong');
    title.textContent = names[id] ? id + ' — ' + names[id] : 'Unknown';
    const dimensions = document.createElement('div');
    dimensions.textContent = mode + ' · ' + size(viewport);
    indicator.append(title, dimensions);
    layer.append(indicator);

    const [safeTop, safeRight, safeBottom, safeLeft] = insets;
    const margin = parseFloat(getComputedStyle(indicator).getPropertyValue('--space-4'));
    const { width, height } = indicator.getBoundingClientRect();
    const right = Math.max(0, viewport.width - safeRight - width - margin);
    const left = Math.min(right, safeLeft + margin);
    const top = Math.min(safeTop + margin, Math.max(0, viewport.height - height));
    const cardArea = content.getBoundingClientRect();
    const cardBottom = Math.max(top, Math.min(cardArea.bottom - viewport.top,
      viewport.height - safeBottom) - height - margin);
    const avoid = [...headline.children, tagline, dock, timer, ...content.querySelectorAll('h2, p, ul')]
      .map(element => element.getBoundingClientRect());
    const places = [[(left + right) / 2, top], [right, cardBottom], [left, cardBottom]];
    const overlap = ([x, y]) => avoid.reduce((total, rect) => total +
      Math.max(0, Math.min(viewport.left + x + width, rect.right) - Math.max(viewport.left + x, rect.left)) *
      Math.max(0, Math.min(viewport.top + y + height, rect.bottom) - Math.max(viewport.top + y, rect.top)), 0);
    const [x, y] = places.reduce((best, place) => overlap(place) < overlap(best) ? place : best);
    indicator.style.left = x + 'px';
    indicator.style.top = y + 'px';
  }

  function readPreferences() {
    return JSON.parse(localStorage.getItem(storageKey) || '{}') || {};
  }

  function syncControls() {
    for (const input of inputs) {
      if (input !== master) input.disabled = !master.checked;
    }
  }

  try {
    const preferences = readPreferences();
    for (const input of inputs) {
      if (inputKey(input) in preferences) input.checked = Boolean(preferences[inputKey(input)]);
    }
    status.textContent = 'Settings apply on this device';
  } catch {
    status.textContent = 'Stored settings unavailable';
  }
  syncControls();

  for (const input of inputs) {
    input.addEventListener('change', () => {
      syncControls();
      try {
        const preferences = { ...readPreferences(), [inputKey(input)]: input.checked };
        localStorage.setItem(storageKey, JSON.stringify(preferences));
        status.textContent = 'Preferences saved on this device';
      } catch {
        status.textContent = 'Storage unavailable. Settings apply for this session.';
      }
      schedule();
    });
  }

  function draw() {
    pending = false;
    if (!sample) return;
    const viewport = home.getBoundingClientRect();
    if (measurements.open) updateReadout(viewport);
    if (!master.checked) {
      overlay.replaceChildren();
      return;
    }

    const { camera, insets: [top, right, bottom, left] } = sample;
    const { width, height } = viewport;
    const origin = overlay.getBoundingClientRect();
    const layer = document.createElement('div');
    layer.className = 'guide-layer';
    Object.assign(layer.style, {
      left: viewport.left - origin.left + 'px',
      top: viewport.top - origin.top + 'px',
      width: width + 'px',
      height: height + 'px',
    });
    const enabled = name => guides.get(name).checked;

    function box(x, y, w, h, color, kind = '') {
      if (w <= 0 || h <= 0) return;
      const element = document.createElement('div');
      element.className = 'guide ' + kind;
      Object.assign(element.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
      element.style.setProperty('--guide-color', 'var(--diag-' + color + ')');
      layer.append(element);
    }

    function label(x, y, text, color) {
      if (!labels.checked) return;
      const element = document.createElement('span');
      element.className = 'guide-label';
      element.style.left = Math.max(0, Math.min(width - 105, x)) + 'px';
      element.style.top = Math.max(0, Math.min(height - 16, y)) + 'px';
      element.style.color = 'var(--diag-' + color + ')';
      element.textContent = text;
      layer.append(element);
    }

    function axes(x, y, color) {
      if (x >= 0 && x <= width) {
        box(x, 0, 1, height, color, 'axis');
        label(x + 2, 4, 'X ' + fmt(x), color);
      }
      if (y >= 0 && y <= height) {
        box(0, y, width, 1, color, 'axis');
        label(4, y + 2, 'Y ' + fmt(y), color);
      }
    }

    function measure(element, name, color, clip) {
      const rect = element.getBoundingClientRect();
      const x = Math.max(rect.left, viewport.left, clip?.left ?? viewport.left) - viewport.left;
      const y = Math.max(rect.top, viewport.top, clip?.top ?? viewport.top) - viewport.top;
      const w = Math.min(rect.right, viewport.right, clip?.right ?? viewport.right) - viewport.left - x;
      const h = Math.min(rect.bottom, viewport.bottom, clip?.bottom ?? viewport.bottom) - viewport.top - y;
      if (w > 0 && h > 0) {
        box(x, y, w, h, color, 'measured');
        layer.lastElementChild.dataset.measurement = name;
        label(x + 3, y + 3, name + ' ' + fmt(rect.width) + '×' + fmt(rect.height), color);
      }
      return rect;
    }

    if (enabled('Grid')) box(0, 0, width, height, 'viewport', 'grid');
    if (enabled('Viewport')) {
      box(0, 0, width, height, 'viewport', 'viewport');
      label(width - 110, height - 18, fmt(width) + '×' + fmt(height) + ' px', 'viewport');
    }
    if (enabled('Safe areas')) {
      box(0, 0, width, top, 'safe', 'safe');
      box(width - right, 0, right, height, 'safe', 'safe');
      box(0, height - bottom, width, bottom, 'safe', 'safe');
      box(0, 0, left, height, 'safe', 'safe');
    }
    if (enabled('Headline')) {
      const rect = measure(headline, 'Headline', 'headline');
      axes(rect.x - viewport.left, rect.y - viewport.top + rect.height / 2, 'headline');
    }
    if (enabled('Content')) {
      const clip = measure(content, 'Content', 'content');
      measure(tagline, 'Tagline', 'content');
      if (!timer.parentElement.hidden) measure(timer, 'Timer', 'content');
      const [first, second] = cards.map((card, i) => measure(card, 'Card ' + (i + 1), 'content', clip));
      const sideBySide = second.left >= first.right;
      const gap = sideBySide ? second.left - first.right : second.top - first.bottom;
      const gapY = sideBySide ? first.top : first.bottom;
      if (gapY >= clip.top && gapY < clip.bottom) {
        label((sideBySide ? first.right : first.left) - viewport.left, gapY - viewport.top, 'Card gap ' + fmt(gap) + ' px', 'content');
      }
      const nav = measure(dock, 'Navigation', 'content');
      const right = home.dataset.dock === 'right';
      const dockGap = right ? nav.left - clip.right : nav.top - clip.bottom;
      label((right ? clip.right : nav.left) - viewport.left, (right ? nav.top : clip.bottom) - viewport.top,
        'Dock gap ' + fmt(dockGap) + ' px', 'content');
    }

    if (enabled('Camera') && camera) {
      const { left, top, right, bottom } = camera;
      axes(left - viewport.left, top - viewport.top, 'camera');
      axes(right - viewport.left, bottom - viewport.top, 'camera');
      box(left - viewport.left, top - viewport.top, right - left, bottom - top, 'camera', 'camera');
    }
    overlay.replaceChildren(layer);
    addOrientationIndicator(layer, viewport);
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(draw);
  }

  home.addEventListener('form:layout', event => {
    sample = event.detail;
    schedule();
  });
  measurements.addEventListener('toggle', schedule);
  content.addEventListener('scroll', schedule, { passive: true });
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(schedule);
    for (const element of [home, content, dock, timer, ...cards]) observer.observe(element);
  }
  schedule();
})();
