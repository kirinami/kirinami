import { translations } from '@/fixtures/data';
import { Endpoint } from '@/utils/http';

export const endpoints: Endpoint[] = [
  {
    url: '/api/translations/:language',
    method: 'GET',
    handler: ({ params: { language } }) => {
      return Object.entries(translations[language] || {}).map(([key, value], i) => ({
        id: i + 1,
        language,
        key,
        value,
      }));
    },
  },
];
