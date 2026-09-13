export class RenderCollector {
  private isStopped = false;

  private pendingTasks = new Map<string, () => Promise<unknown>>();
  private resolvedKeys = new Set<string>();

  add(key: string, run: () => Promise<unknown>) {
    if (this.isStopped || this.resolvedKeys.has(key)) {
      return;
    }

    this.pendingTasks.set(key, run);
  }

  hasPending() {
    return this.pendingTasks.size > 0;
  }

  runPending() {
    const promises: Promise<unknown>[] = [];

    this.pendingTasks.forEach((task, key) => {
      this.resolvedKeys.add(key);

      promises.push(task());
    });
    this.pendingTasks.clear();

    return Promise.all(promises);
  }

  stop() {
    if (this.isStopped) {
      return;
    }

    this.isStopped = true;

    this.pendingTasks.clear();
    this.resolvedKeys.clear();
  }
}
