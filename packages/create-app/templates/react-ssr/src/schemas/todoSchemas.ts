import { FastifySchema } from 'fastify';
import { z } from 'zod';

export const todoSchema = z.object({
  id: z.number(),
  title: z.string().min(1).max(280),
  completed: z.boolean(),
  createdAt: z.number(),
});

export type TodoSchema = z.output<typeof todoSchema>;

export const getTodosSchema = {
  querystring: z.object({
    search: z.string().optional(),
    sort: z.enum(['asc', 'desc']).optional(),
  }),
  response: {
    '2xx': z.array(todoSchema),
  },
} satisfies FastifySchema;

export type GetTodosSchema = typeof getTodosSchema;
export type GetTodosParams = z.output<GetTodosSchema['querystring']>;
export type GetTodosData = z.output<GetTodosSchema['response']['2xx']>;

export const createTodoSchema = {
  body: z.object({
    title: z.string().min(1).max(280),
    completed: z.boolean(),
  }),
  response: {
    '2xx': todoSchema,
  },
} satisfies FastifySchema;

export type CreateTodoSchema = typeof createTodoSchema;
export type CreateTodoParams = z.output<CreateTodoSchema['body']>;
export type CreateTodoData = z.output<CreateTodoSchema['response']['2xx']>;

export const updateTodoSchema = {
  params: z.object({
    id: z.union([z.number(), z.string()]).transform((value) => Number(value)),
  }),
  body: createTodoSchema.body.partial(),
  response: {
    '2xx': todoSchema,
  },
} satisfies FastifySchema;

export type UpdateTodoSchema = typeof updateTodoSchema;
export type UpdateTodoParams = z.output<UpdateTodoSchema['params']> & z.output<UpdateTodoSchema['body']>;
export type UpdateTodoData = z.output<UpdateTodoSchema['response']['2xx']>;

export const deleteTodoSchema = {
  params: z.object({
    id: z.union([z.number(), z.string()]).transform((value) => Number(value)),
  }),
  response: {
    '2xx': todoSchema,
  },
} satisfies FastifySchema;

export type DeleteTodoSchema = typeof deleteTodoSchema;
export type DeleteTodoParams = z.output<DeleteTodoSchema['params']>;
export type DeleteTodoData = z.output<DeleteTodoSchema['response']['2xx']>;
