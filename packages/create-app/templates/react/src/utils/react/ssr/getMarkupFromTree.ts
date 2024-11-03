import { createContext, createElement, ReactNode } from 'react';

import { renderHtml } from './renderHtml';
import { RenderPromises } from './RenderPromises';

const RenderPromisesContext = createContext(new RenderPromises());

export type GetMarkupFromTreeOptions = {
  onAfterRender?: (renderPromise: RenderPromises) => Promise<unknown> | unknown;
};

export async function getMarkupFromTree(tree: ReactNode, { onAfterRender }: GetMarkupFromTreeOptions = {}) {
  const renderPromises = new RenderPromises();

  const process = (): Promise<string> =>
    new Promise<string>((resolve) => {
      resolve(renderHtml(createElement(RenderPromisesContext.Provider, { value: renderPromises }, tree)));
    })
      .then(async (html) => {
        await onAfterRender?.(renderPromises);

        return html;
      })
      .then((html) => (renderPromises.hasPromises() ? renderPromises.consumeAndAwaitPromises().then(process) : html))
      .finally(() => renderPromises.stop());

  return process();
}
