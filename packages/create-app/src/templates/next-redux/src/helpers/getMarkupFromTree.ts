import { createContext, createElement, ReactElement, ReactNode, useContext } from 'react';

import { isServer } from '@/utils/ssr';

class RenderPromises {
  promises = [] as { key: string; exec: () => Promise<unknown>; status: string }[];

  getPending() {
    return this.promises.filter((promise) => promise.status !== 'done');
  }

  hasPending() {
    return !!this.getPending().length;
  }

  awaitPending() {
    const promises = this.getPending();

    return Promise.all(
      promises.map((promise) => {
        return promise.exec().finally(() => {
          promise.status = 'done';
        });
      })
    );
  }

  get(key: string) {
    return this.promises.find((action) => action.key === key);
  }

  isDone(key: string) {
    const promise = this.get(key);

    return promise ? promise.status !== 'done' : isServer;
  }

  register(key: string, exec: () => Promise<unknown>) {
    if (isServer && !this.promises.some((action) => action.key === key)) {
      this.promises.push({
        key,
        exec,
        status: 'pending',
      });
    }
  }

  reset() {
    this.promises = [];
  }
}

const renderPromisesContext = createContext(new RenderPromises());

export function useRenderPromises() {
  return useContext(renderPromisesContext);
}

export function getMarkupFromTree({
  tree,
  renderFunction,
}: {
  tree: ReactNode;
  renderFunction: (tree: ReactElement) => string | Promise<string>;
}): Promise<string> {
  const renderPromises = new RenderPromises();

  function process(): Promise<string> {
    return new Promise<string>((resolve) => {
      resolve(renderFunction(createElement(renderPromisesContext.Provider, { value: renderPromises }, tree)));
    })
      .then((html) => (renderPromises.hasPending() ? renderPromises.awaitPending().then(process) : html))
      .finally(() => renderPromises.reset());
  }

  return Promise.resolve().then(process);
}
