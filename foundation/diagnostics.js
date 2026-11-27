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
  const content = document.querySelector('.content');
  const cards = [...content.querySelectorAll('.form-card')];
  const dock = document.querySelector('#dock');
  let pending = false;

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

    const width = innerWidth;
    const height = innerHeight;
    const visual = window.visualViewport;
    const { orientation, viewportMode } = document.body.dataset;
    const geometry = FormDuoGeometry[orientation];
    const probe = getComputedStyle(document.querySelector('#safe-probe'));
    const [top, right, bottom, left] = ['Top', 'Right', 'Bottom', 'Left'].map(
      edge => parseFloat(probe['padding' + edge]) || 0
    );
    const nodes = [];
    const enabled = name => guides.get(name).checked;
    const fmt = number => Number(number.toFixed(1));

    function box(x, y, w, h, color, kind = '') {
      if (w <= 0 || h <= 0) return;
      const element = document.createElement('div');
      element.className = 'guide ' + kind;
      Object.assign(element.style, { left: x + 'px', top: y + 'px', width: w + 'px', height: h + 'px' });
      element.style.setProperty('--guide-color', 'var(--diag-' + color + ')');
      nodes.push(element);
    }

    function label(x, y, text, color) {
      if (!labels.checked) return;
      const element = document.createElement('span');
      element.className = 'guide-label';
      element.style.left = Math.max(0, Math.min(width - 105, x)) + 'px';
      element.style.top = Math.max(0, Math.min(height - 16, y)) + 'px';
      element.style.color = 'var(--diag-' + color + ')';
      element.textContent = text;
      nodes.push(element);
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
      const y = Math.max(rect.top, clip?.top ?? 0);
      const end = Math.min(rect.bottom, clip?.bottom ?? height);
      if (end <= y) return rect;
      box(rect.x, y, rect.width, end - y, color);
      label(rect.x + 3, y + 3, name + ' ' + fmt(rect.width) + '×' + fmt(rect.height), color);
      return rect;
    }

    if (enabled('Grid')) box(0, 0, width, height, 'viewport', 'grid');
    if (enabled('Viewport')) {
      const w = visual?.width ?? width;
      const h = visual?.height ?? height;
      box(visual?.offsetLeft ?? 0, visual?.offsetTop ?? 0, w, h, 'viewport', 'viewport');
      label(width - 110, height - 18, fmt(w) + '×' + fmt(h) + ' px', 'viewport');
    }
    if (enabled('Safe areas')) {
      box(0, 0, width, top, 'safe', 'safe');
      box(width - right, 0, right, height, 'safe', 'safe');
      box(0, height - bottom, width, bottom, 'safe', 'safe');
      box(0, 0, left, height, 'safe', 'safe');
    }
    if (enabled('Headline')) {
      const rect = measure(document.querySelector('#home .headline'), 'Headline', 'headline');
      axes(rect.x, rect.y + rect.height / 2, 'headline');
    }
    if (enabled('Content')) {
      const clip = measure(content, 'Content', 'content');
      measure(content.querySelector('.tagline'), 'Tagline', 'content', clip);
      const [first, second] = cards.map((card, i) => measure(card, 'Card ' + (i + 1), 'content', clip));
      const sideBySide = second.left >= first.right;
      const gap = sideBySide ? second.left - first.right : second.top - first.bottom;
      const gapY = sideBySide ? first.top : first.bottom;
      if (gapY >= clip.top && gapY < clip.bottom) {
        label(sideBySide ? first.right : first.left, gapY, 'Card gap ' + fmt(gap) + ' px', 'content');
      }
      const nav = measure(dock, 'Navigation', 'content');
      const right = document.querySelector('#home').dataset.dock === 'right';
      const dockGap = right ? nav.left - clip.right : nav.top - clip.bottom;
      label(right ? clip.right : nav.left, right ? nav.top : clip.bottom,
        'Dock gap ' + fmt(dockGap) + ' px', 'content');
    }

    const camera = FormViewport.cameraBounds(geometry, viewportMode);
    if (enabled('Camera') && camera) {
      const { left, top, right, bottom } = camera;
      axes(left, top, 'camera');
      axes(right, bottom, 'camera');
      box(left, top, right - left, bottom - top, 'camera', 'camera');
    }
    overlay.replaceChildren(...nodes);
  }

  function schedule() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(draw);
  }

  for (const event of ['resize', 'scroll', 'orientationchange', 'pageshow']) {
    window.addEventListener(event, schedule, { passive: true });
  }
  window.visualViewport?.addEventListener('resize', schedule);
  window.visualViewport?.addEventListener('scroll', schedule);
  content.addEventListener('scroll', schedule, { passive: true });
  new MutationObserver(schedule).observe(document.body, {
    attributes: true, attributeFilter: ['data-orientation', 'data-viewport-mode'],
  });
  if (window.ResizeObserver) {
    const observer = new ResizeObserver(schedule);
    for (const element of [content, dock, ...cards]) observer.observe(element);
  }
  schedule();
})();
