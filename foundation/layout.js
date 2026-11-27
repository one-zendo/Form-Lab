/* Layout selection is separate from hardware detection and component behavior. */
(function (root) {
  const drawableCenter = 48;
  const profiles = {
    FP: {
      'Native-sized': { nav: 'rail' },
      'Safari-sized': { nav: 'bottom' },
    },
    FL1: {
      'Native-sized': { nav: 'rail', rest: 'vertical', sampleLabels: ['40%', '60%'] },
      'Safari-sized': { nav: 'rail', rest: 'vertical', sampleLabels: ['40%', '60%'], contentAtHeadline: true },
    },
    FL2: {
      'Native-sized': { nav: 'rail', rest: 'vertical', sampleLabels: ['40%', '60%'] },
      'Safari-sized': { nav: 'rail', rest: 'vertical', sampleLabels: ['40%', '60%'] },
    },
    UP: {
      'Native-sized': { nav: 'bottom' },
      'Safari-sized': { nav: 'bottom', headlineAboveDrawableAnchor: true },
    },
    UL: {
      'Native-sized': { nav: 'rail', rest: 'vertical', sampleLabels: ['40%', '60%'] },
      'Safari-sized': { nav: 'rail', rest: 'vertical', sampleLabels: ['40%', '60%'] },
    },
  };

  function resolve(geometry, id, mode, width = 0, height = 0) {
    const profile = geometry && profiles[id]?.[mode];
    const ambiguous = geometry && id === 'FL1 / FL2' && mode !== 'Unmatched';
    const matched = Boolean(profile || ambiguous);
    const wideFallback = !profile && (ambiguous || width > height);
    return {
      layout: profile ? id : wideFallback ? 'fallback-wide' : 'fallback-stacked',
      nav: profile?.nav ?? (ambiguous ? 'rail' : 'bottom'),
      rest: profile ? (profile.rest ?? 'horizontal') : wideFallback ? 'vertical' : 'horizontal',
      sampleLabels: profile?.sampleLabels ?? (ambiguous ? ['40%', '60%'] : ['First', 'Second']),
      headline: matched ? geometry.headline : 16,
      content: matched ? (profile?.contentAtHeadline ? geometry.headline : geometry.content) : 16,
      center: profile?.headlineAboveDrawableAnchor ? drawableCenter + geometry.excluded : drawableCenter,
      matched,
    };
  }

  function apply(geometry, id, mode, width, height) {
    const layout = resolve(geometry, id, mode, width, height);
    const state = document.body.dataset;
    if (state.layout !== layout.layout) state.layout = layout.layout;
    if (state.nav !== layout.nav) state.nav = layout.nav;
    if (state.restLayout !== layout.rest) state.restLayout = layout.rest;
    const calibration = document.querySelector('#calibration');
    for (const key of ['headline', 'content', 'center']) {
      calibration.style.setProperty('--calibrated-' + key, layout[key] + 'px');
    }
    calibration.style.setProperty('--drawable-headline-center', drawableCenter + 'px');
    calibration.dataset.guides = String(document.querySelector('#guides').checked);
    const status = layout.matched ? 'Matched reference calibration target' : 'Unmatched viewport: generic fallback';
    document.querySelector('#layout-status').textContent = status + ' · ' + mode +
      ' · headline X ' + layout.headline + ' / content X ' + layout.content +
      ' / headline center Y ' + layout.center + ' px';
    return layout;
  }

  root.FormLayout = { resolve, apply };
  if (typeof module !== 'undefined') module.exports = { resolve };
})(typeof window === 'undefined' ? globalThis : window);
