import { FastifySchema } from 'fastify';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export const translationSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    language: { type: 'string' },
    key: { type: 'string', minLength: 1, maxLength: 255 },
    value: { type: 'string' },
  },
  required: ['id', 'language', 'key', 'value'],
  additionalProperties: false,
} as const satisfies JSONSchema;

export type TranslationSchema = FromSchema<typeof translationSchema>;

export const getTranslationSchema = {
  params: {
    type: 'object',
    properties: {
      language: { type: 'string' },
    },
    required: ['language'],
    additionalProperties: false,
  } as const satisfies JSONSchema,
  response: {
    200: {
      type: 'array',
      items: translationSchema,
      additionalProperties: false,
    } as const satisfies JSONSchema,
  },
} as const satisfies FastifySchema;

export type GetTranslationsParams = FromSchema<(typeof getTranslationSchema)['params']>;
export type GetTranslationsData = FromSchema<(typeof getTranslationSchema)['response']['200']>;
