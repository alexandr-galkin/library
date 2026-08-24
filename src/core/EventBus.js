/**
 * Small synchronous event bus used to keep game modules decoupled.
 */
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /** @param {string} event @param {Function} handler @returns {Function} */
  on(event, handler) {
    if (typeof handler !== 'function') throw new TypeError('Event handler must be a function');
    const handlers = this.listeners.get(event) ?? new Set();
    handlers.add(handler);
    this.listeners.set(event, handlers);
    return () => this.off(event, handler);
  }

  /** @param {string} event @param {Function} handler */
  off(event, handler) {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    handlers.delete(handler);
    if (!handlers.size) this.listeners.delete(event);
  }

  /** @param {string} event @param {*} payload */
  emit(event, payload) {
    for (const handler of this.listeners.get(event) ?? []) handler(payload);
  }

  /** Remove all subscriptions. */
  clear() {
    this.listeners.clear();
  }
}
