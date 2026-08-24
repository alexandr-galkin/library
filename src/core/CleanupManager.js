/**
 * Owns teardown callbacks for a game/component lifecycle.
 */
export class CleanupManager {
  constructor() {
    this.cleanups = new Set();
    this.cleaned = false;
  }

  /** @param {Function} cleanup @returns {Function} */
  add(cleanup) {
    if (typeof cleanup !== 'function') throw new TypeError('Cleanup must be a function');
    if (this.cleaned) {
      cleanup();
      return cleanup;
    }
    this.cleanups.add(cleanup);
    return cleanup;
  }

  /** @param {EventTarget} target @param {string} event @param {Function} handler */
  listen(target, event, handler, options) {
    target.addEventListener(event, handler, options);
    return this.add(() => target.removeEventListener(event, handler, options));
  }

  /** Run every cleanup exactly once. */
  cleanup() {
    if (this.cleaned) return;
    this.cleaned = true;
    for (const cleanup of this.cleanups) {
      try { cleanup(); } catch (error) { console.error('Cleanup failed:', error); }
    }
    this.cleanups.clear();
  }
}
