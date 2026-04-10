import { ReactNode } from 'react';
import { dir } from 'i18next';

export type DocumentProps = {
  language: string;
  children: ReactNode;
};

export function Document({ language, children }: DocumentProps) {
  return (
    <html lang={language} dir={dir(language)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
