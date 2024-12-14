import { Writable } from 'node:stream';

import { ReactNode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

export type RenderHtmlOptions = {
  bootstrapModules?: string[];
};

export async function renderHtml(children: ReactNode, { bootstrapModules }: RenderHtmlOptions) {
  return new Promise<string>((resolve, reject) => {
    let html = '';

    const writable = new Writable({
      write(chunk, _encoding, next) {
        html += chunk.toString();
        next();
      },
      final(next) {
        resolve(html);
        next();
      },
      destroy(err) {
        if (err) reject(err);
      },
    });

    const pipeableStream = renderToPipeableStream(children, {
      bootstrapModules,
      onAllReady: () => {
        pipeableStream.pipe(writable);
      },
      onError: (err) => {
        writable.destroy(err as Error);
      },
    });
  });
}
