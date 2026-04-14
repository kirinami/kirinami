import { createContext, createElement, ReactNode } from 'react';

import { RenderPromises } from './RenderPromises';

const RenderPromisesContext = createContext(new RenderPromises());

export type PrefetchRenderOptions = {
  onCollect?: (renderPromises: RenderPromises) => Promise<void>;
};

export async function prefetchRender<T>(
  children: ReactNode,
  render: (children: ReactNode) => T | Promise<T>,
  { onCollect }: PrefetchRenderOptions,
) {
  const renderPromises = new RenderPromises();

  const element = createElement(RenderPromisesContext.Provider, { value: renderPromises }, children);

  const process = async () => {
    const result = await render(element);

    await onCollect?.(renderPromises);

    if (renderPromises.hasPromises()) {
      await renderPromises.consumeAndAwaitPromises();

      return await process();
    }

    return result;
  };

  return process().finally(() => renderPromises.stop());
}
