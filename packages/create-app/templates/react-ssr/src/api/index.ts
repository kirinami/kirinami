import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { todosPlugin } from './todos';

export async function apiPlugin(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  await app.register(todosPlugin, { prefix: '/todos' });
}
