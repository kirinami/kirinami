import type * as Document from 'next/document';

declare module 'next/document' {
  import type { IncomingMessage } from 'http';

  export declare type DocumentContext = Document.DocumentContext & {
    req: IncomingMessage,
  };
}
