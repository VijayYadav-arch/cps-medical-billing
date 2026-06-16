import '@testing-library/jest-dom/vitest';

// jsdom does not implement Element.prototype.scrollIntoView; several islands
// call it after rendering results (e.g. ROICalculator scrolls results into
// view via requestAnimationFrame). Stub it so the rAF callback never throws.
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}
