import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyInstance } from 'fastify';

import { DEFAULT_LANGUAGE } from '@/helpers/createI18n';

import { getTranslationSchema } from './schema';

const en = {
  loading: 'Loading...',
  hello: 'Hello',
  home: 'Home',
  not_found: 'Not Found',
  back_to_home: 'Back to Home',
};

const uk: typeof en = {
  loading: 'Завантаження...',
  hello: 'Привіт',
  home: 'Головна',
  not_found: 'Не знайдено',
  back_to_home: 'На головну',
};

export const translationsStorage: Record<string, typeof en> = {
  en,
  uk,
};

export async function translations(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  app.get('/:language', { schema: getTranslationSchema }, async ({ params }) => {
    const hasLanguage = params.language in translationsStorage;
    const translationsData = hasLanguage ? translationsStorage[params.language] : translationsStorage[DEFAULT_LANGUAGE];

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return Object.entries(translationsData).map(([key, value], i) => ({
      id: i + 1,
      language: hasLanguage ? params.language : DEFAULT_LANGUAGE,
      key,
      value,
    }));
  });
}
