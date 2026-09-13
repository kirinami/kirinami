import { ReactNode } from 'react';

import { RenderCollector } from './RenderCollector';

export type PrefetchRenderOptions = {
  onCollect?: (renderCollector: RenderCollector) => Promise<void>;
};

export async function prefetchRender<T>(
  children: ReactNode,
  render: (children: ReactNode) => T | Promise<T>,
  { onCollect }: PrefetchRenderOptions = {},
) {
  const renderCollector = new RenderCollector();

  const process = async () => {
    const result = await render(children);

    await onCollect?.(renderCollector);

    if (renderCollector.hasPending()) {
      await renderCollector.runPending();

      return await process();
    }

    return result;
  };

  return process().finally(() => renderCollector.stop());
}
