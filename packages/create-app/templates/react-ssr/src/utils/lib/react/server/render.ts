import { createContext, createElement, ReactNode } from 'react';

import { RenderPromises } from './RenderPromises';

const RenderPromisesContext = createContext(new RenderPromises());

export type RenderOptions<T> = {
  onRender: (children: ReactNode) => Promise<T>;
  onCollect?: (renderPromises: RenderPromises) => void;
};

export function render<T>(children: ReactNode, { onRender, onCollect }: RenderOptions<T>) {
  const renderPromises = new RenderPromises();

  const element = createElement(RenderPromisesContext.Provider, { value: renderPromises }, children);

  const process = async () => {
    const result = await onRender(element);

    onCollect?.(renderPromises);

    if (renderPromises.hasPromises()) {
      await renderPromises.consumeAndAwaitPromises();

      return await process();
    }

    return result;
  };

  return process();
}
