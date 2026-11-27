/* Resolve live viewport bounds and project calibrated obstructions. */
window.FormViewport = (() => {
  function dockSide(id, mode) {
    const foldedLandscape = ['FL1', 'FL2', 'FL1 / FL2'].includes(id);
    return foldedLandscape || (id === 'FP' && mode === 'Native-sized') ? 'right' : 'bottom';
  }

  function cameraBounds(geometry, mode) {
    if (!geometry?.camera) return null;
    const [cx, cy] = geometry.camera;
    const safari = mode === 'Safari-sized';
    const x = cx - (safari && geometry.side === 'left' ? geometry.excluded : 0);
    const y = cy - (safari && geometry.side === 'top' ? geometry.excluded : 0);
    const radius = 18.5;
    return { left: x - radius, right: x + radius, top: y - radius, bottom: y + radius };
  }

  function clearance(region, camera, vertical, margin) {
    if (!camera) return [0, 0];
    const left = camera.left - margin;
    const right = camera.right + margin;
    const top = camera.top - margin;
    const bottom = camera.bottom + margin;
    if (region.left >= right || region.right <= left || region.top >= bottom || region.bottom <= top) {
      return [0, 0];
    }

    const start = vertical ? region.top : region.left;
    const end = vertical ? region.bottom : region.right;
    const blockedStart = Math.max(start, vertical ? top : left);
    const blockedEnd = Math.min(end, vertical ? bottom : right);
    return blockedStart - start >= end - blockedEnd
      ? [0, end - blockedStart]
      : [blockedEnd - start, 0];
  }

  function visibleBounds(visual, layoutWidth, layoutHeight) {
    // Pinch zoom changes the viewing window; leave the page layout at its normal scale.
    if (!visual || Math.abs(visual.scale - 1) > .01) return null;
    const left = Math.max(0, visual.offsetLeft);
    const top = Math.max(0, visual.offsetTop);
    const right = Math.min(layoutWidth, visual.offsetLeft + visual.width);
    const bottom = Math.min(layoutHeight, visual.offsetTop + visual.height);
    if (!(right > left && bottom > top)) return null;
    return { left, top, width: right - left, height: bottom - top };
  }

  return { dockSide, cameraBounds, clearance, visibleBounds };
})();
