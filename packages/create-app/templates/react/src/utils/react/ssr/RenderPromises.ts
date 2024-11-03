export class RenderPromises {
  private queryPromises = new Map<string, () => Promise<unknown>>();

  private queryInfo = new Map<string, { seen: boolean }>();

  private stopped = false;

  public stop() {
    if (!this.stopped) {
      this.queryPromises.clear();
      this.queryInfo.clear();
      this.stopped = true;
    }
  }

  public addQueryPromise(key: string, exec: () => Promise<unknown>, finish?: () => void) {
    if (!this.stopped) {
      const info = this.queryInfo.get(key);

      if (!info?.seen) {
        this.queryPromises.set(key, exec);
        this.queryInfo.set(key, {
          seen: false,
        });

        return null;
      }
    }

    return finish ? finish() : null;
  }

  public hasPromises() {
    return this.queryPromises.size > 0;
  }

  public consumeAndAwaitPromises() {
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
