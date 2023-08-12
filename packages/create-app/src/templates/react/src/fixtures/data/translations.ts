const en = {
  hello: 'Hello',
  home: 'Home',
  not_found: 'Not Found',
  back_to_home: 'Back to Home',
};

const uk: typeof en = {
  hello: 'Привіт',
  home: 'Головна',
  not_found: 'Не знайдено',
  back_to_home: 'На головну',
};

export const translations: Record<string, typeof en> = {
  en,
  uk,
};
