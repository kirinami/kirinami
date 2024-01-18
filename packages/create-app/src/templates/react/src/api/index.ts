import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyInstance } from 'fastify';

import { todos } from './todos';
import { translations } from './translations';

export async function api(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  await app.register(translations, { prefix: '/translations' });
  await app.register(todos, { prefix: '/todos' });
}
