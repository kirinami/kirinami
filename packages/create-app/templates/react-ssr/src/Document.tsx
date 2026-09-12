import { ReactNode } from 'react';
import { dir } from 'i18next';

import { setLocale as setDayjsLocale } from '@/lib/dayjs';
import { setLocale as setZodLocale } from '@/lib/zod';

export type DocumentProps = {
  language: string;
  assets?: {
    fonts?: string[];
    styles?: string[];
  };
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
        {assets?.fonts?.map((href) => (
          <link key={href} rel="preload" as="font" type="font/ttf" href={href} crossOrigin="anonymous" />
        ))}
        {assets?.styles?.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        <link rel="alternate" hrefLang="en" href={`${import.meta.env.VITE_BASE_URL}/en`} />
        <link rel="alternate" hrefLang="uk" href={`${import.meta.env.VITE_BASE_URL}/uk`} />
        <link rel="canonical" href={import.meta.env.VITE_BASE_URL} />
      </head>
      <body>{children}</body>
    </html>
  );
}
