import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { setLocale as setDayjsLocale } from '@/utils/lib/dayjs';
import { setLocale as setZodLocale } from '@/utils/lib/zod';

export type DocumentProps = {
  assets: { style?: string };
  children: ReactNode;
};

export function Document({ assets, children }: DocumentProps) {
  const { i18n } = useTranslation();

  setDayjsLocale(i18n.language);
  setZodLocale(i18n.language);

  return (
    <html lang={i18n.language} dir={i18n.dir()}>
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
