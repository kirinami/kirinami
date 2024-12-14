import { ReactNode } from 'react';

export type DocumentProps = {
  language: string;
  children: ReactNode
}

export function Document({ language, children }: DocumentProps) {
  return (
    <html lang={language}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {import.meta.env.SSR && <script id="inject-styles" />}
        {import.meta.env.SSR && <script id="inject-scripts" />}
      </head>
      <body>
        {children}

        {import.meta.env.SSR && <script id="inject-hydration" />}
      </body>
    </html>
  );
}
