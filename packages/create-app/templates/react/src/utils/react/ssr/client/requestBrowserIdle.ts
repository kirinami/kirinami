const DEFAULT_FRAME_TIME = 16;

export function requestBrowserIdle(handler: () => void) {
  if (!window.requestIdleCallback) {
    window.setTimeout(handler, DEFAULT_FRAME_TIME);

    return;
  }

  window.requestIdleCallback(handler);
}
