import { Writable } from 'node:stream';

import { ReactNode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

export async function renderToHtml(children: ReactNode) {
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
      onAllReady: () => {
        pipeableStream.pipe(writable);
      },
      onError: (err) => {
        writable.destroy(err as Error);
      },
    });
  });
}
