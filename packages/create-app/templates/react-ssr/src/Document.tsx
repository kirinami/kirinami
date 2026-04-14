import { ReactNode } from 'react';
import { dir } from 'i18next';

import { setLocale as setDayjsLocale } from '@/utils/lib/dayjs';
import { setLocale as setZodLocale } from '@/utils/lib/zod';

export type DocumentProps = {
  language: string;
  assets: { style?: string };
  children: ReactNode;
};

export function Document({ language, assets, children }: DocumentProps) {
  setDayjsLocale(language);
  setZodLocale(language);

  return (
    <html lang={language} dir={dir(language)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        {!!assets.style && <link rel="stylesheet" href={assets.style} />}
        <link rel="alternate" hrefLang="en" href={`${import.meta.env.VITE_BASE_URL}/en`} />
        <link rel="alternate" hrefLang="uk" href={`${import.meta.env.VITE_BASE_URL}/uk`} />
        <link rel="canonical" href={import.meta.env.VITE_BASE_URL} />
      </head>
      <body>{children}</body>
    </html>
  );
}
