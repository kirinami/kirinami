export const translations: Record<string, () => Promise<typeof import('./en').en>> = {
  en: () => import('./en').then((module) => module.en),
  uk: () => import('./uk').then((module) => module.uk),
};
