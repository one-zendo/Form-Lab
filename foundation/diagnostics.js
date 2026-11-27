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
  const content = home.querySelector('.content');
  const timer = home.querySelector('.timer-placeholder');
  const cards = [...content.querySelectorAll('.form-card')];
  const dock = document.querySelector('#dock');
  let pending = false;
  let sample;

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
    if (!master.checked) {
      overlay.replaceChildren();
      return;
    }

    if (!sample) return;
    const { camera, insets: [top, right, bottom, left] } = sample;
    const viewport = home.getBoundingClientRect();
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
    const fmt = number => Number(number.toFixed(1));

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
      const rect = measure(document.querySelector('#home .headline'), 'Headline', 'headline');
      axes(rect.x - viewport.left, rect.y - viewport.top + rect.height / 2, 'headline');
    }
    if (enabled('Content')) {
      const clip = measure(content, 'Content', 'content');
      measure(home.querySelector('.tagline'), 'Tagline', 'content');
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
  content.addEventListener('scroll', schedule, { passive: true });
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(schedule);
    for (const element of [home, content, dock, timer, ...cards]) observer.observe(element);
  }
  schedule();
})();
