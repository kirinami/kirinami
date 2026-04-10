import { z } from 'zod';
import en from 'zod/v4/locales/en.js';
import uk from 'zod/v4/locales/uk.js';

export function setLocale(language: string) {
  if (language === 'en') z.config(en());
  if (language === 'uk') z.config(uk());
}

setLocale('en');

export { z };
