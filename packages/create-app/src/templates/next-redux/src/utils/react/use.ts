export function use<T>(p: Promise<T>): T {
  const promise = p as Promise<T> & {
    status?: 'pending' | 'fulfilled' | 'rejected';
    value: T;
    reason: Error;
  };

  if (promise.status === 'fulfilled') {
    return promise.value;
  }

  if (promise.status === 'rejected') {
    throw promise.reason;
  }

  if (promise.status !== 'pending') {
    promise.status = 'pending';
    promise.then(
      (result) => {
        promise.status = 'fulfilled';
        promise.value = result;
      },
      (reason) => {
        promise.status = 'rejected';
        promise.reason = reason;
      }
    );
  }

  throw promise as unknown as Error;
}
