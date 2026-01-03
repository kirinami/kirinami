import { Writable } from 'node:stream';

import type { ReactNode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';

export type RenderToStringOptions = {
  timeout?: number;
};

export type RenderToStringResult = {
  error: unknown;
  html: string;
};

export async function renderToString(
  children: ReactNode,
  { timeout = 10000 }: RenderToStringOptions = {},
): Promise<RenderToStringResult> {
  let error: unknown;

  const html = await new Promise<string>((resolve, reject) => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const chunks: Buffer[] = [];

    const stream = new Writable({
      write(chunk: string | Buffer, _encoding, next) {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));

        next();
      },
      final(next) {
        clearTimeout(timeoutId);
        timeoutId = undefined;

        resolve(Buffer.concat(chunks).toString('utf8'));

        next();
      },
    });

    const { pipe, abort } = renderToPipeableStream(children, {
      onAllReady() {
        pipe(stream);
      },
      onShellError(error) {
        clearTimeout(timeoutId);
        timeoutId = undefined;

        reject(error instanceof Error ? error : new Error(String(error)));
      },
      onError(e) {
        error = e;
      },
    });

    timeoutId = setTimeout(() => abort(), timeout);
  });

  return {
    error,
    html,
  };
}
