/* eslint-disable @typescript-eslint/no-throw-literal */

type UsePromise<T> = Promise<T> & {
  status: string;
  reason: unknown;
  value: T;
};

export function use<T>(promise: UsePromise<T>): T {
  if (promise.status === 'fulfilled') {
    return promise.value;
  }

  if (promise.status === 'rejected') {
    throw promise.reason;
  }

  if (promise.status === 'pending') {
    throw promise;
  }

  promise.status = 'pending';
  promise.then(
    (result) => {
      promise.status = 'fulfilled';
      promise.value = result;
    },
    (reason) => {
      promise.status = 'rejected';
      promise.reason = reason;
    },
  );

  throw promise;
}
