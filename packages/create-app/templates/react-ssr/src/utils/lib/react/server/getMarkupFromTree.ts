import { createContext, createElement, ReactNode } from 'react';

import { RenderPromises } from './RenderPromises';
import { renderToString, RenderToStringResult } from './renderToString';

const RenderPromisesContext = createContext(new RenderPromises());

export type GetMarkupFromTreeOptions = {
  onAfterRender?: (renderPromise: RenderPromises) => Promise<unknown>;
};

export async function getMarkupFromTree(tree: ReactNode, { onAfterRender }: GetMarkupFromTreeOptions = {}) {
  const renderPromises = new RenderPromises();

  const process = (): Promise<RenderToStringResult> =>
    new Promise<RenderToStringResult>((resolve) => {
      resolve(renderToString(createElement(RenderPromisesContext.Provider, { value: renderPromises }, tree)));
    })
      .then(async (result) => {
        await onAfterRender?.(renderPromises);

        return result;
      })
      .then((result) =>
        renderPromises.hasPromises() ? renderPromises.consumeAndAwaitPromises().then(process) : result,
      )
      .finally(() => renderPromises.stop());

  return process();
}
