import { translations } from '@/fixtures/data';
import { Endpoint } from '@/utils/http';

export const endpoints: Endpoint[] = [
  {
    url: '/api/translations/:language',
    method: 'GET',
    handler: ({ params: { language } }) => {
      if (!/\w{2}/.test(language)) {
        return {};
      }

      return Object.entries(translations[language] || {}).map(([key, value], i) => ({
        id: i + 1,
        language,
        key,
        value,
      }));
    },
  },
];
