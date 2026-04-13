import { ReactNode } from 'react';
import { dir } from 'i18next';

export type DocumentProps = {
  assets: { style: string };
  language: string;
  children: ReactNode;
};

export function Document({ assets, language, children }: DocumentProps) {
  return (
    <html lang={language} dir={dir(language)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {assets.style && <link rel="stylesheet" href={assets.style} />}
      </head>
      <body>{children}</body>
    </html>
  );
}
