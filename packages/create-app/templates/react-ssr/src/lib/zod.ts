import { z } from 'zod';

export function setLocale(language: string) {
  if (language === 'en') z.config(z.locales.en());
  if (language === 'uk') z.config(z.locales.uk());

  return language;
}

setLocale('en');

export { z };
