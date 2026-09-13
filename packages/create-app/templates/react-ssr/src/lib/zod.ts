import { z } from 'zod';

const LOCALES: Record<string, typeof z.locales.en> = {
  en: z.locales.en,
  uk: z.locales.uk,
};

export function setLocale(language: string) {
  z.config((LOCALES[language] ?? z.locales.en)());
}

setLocale('en');

export { z };
