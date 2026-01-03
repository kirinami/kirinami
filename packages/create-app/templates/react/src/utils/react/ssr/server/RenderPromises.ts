export class RenderPromises {
  private queryPromises = new Map<string, () => Promise<unknown>>();

  private queryInfo = new Map<string, { seen: boolean }>();

  private stopped = false;

  stop() {
    if (this.stopped) {
      return;
    }

    this.queryPromises.clear();
    this.queryInfo.clear();
    this.stopped = true;
  }

  addQueryPromise(key: string, exec: () => Promise<unknown>) {
    if (this.stopped) {
      return;
    }

    const info = this.queryInfo.get(key);

    if (info?.seen) {
      return;
    }

    this.queryPromises.set(key, exec);
    this.queryInfo.set(key, {
      seen: false,
    });
  }

  hasPromises() {
    return this.queryPromises.size > 0;
  }

  consumeAndAwaitPromises() {
    const promises: Promise<unknown>[] = [];

    this.queryPromises.forEach((exec, key) => {
      this.queryInfo.set(key, {
        seen: true,
      });

      promises.push(exec());
    });
    this.queryPromises.clear();

    return Promise.all(promises);
  }
}
