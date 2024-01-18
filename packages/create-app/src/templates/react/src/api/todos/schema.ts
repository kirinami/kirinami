import { FastifySchema } from 'fastify';
import { FromSchema, JSONSchema } from 'json-schema-to-ts';

export const todoSchema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    title: { type: 'string', minLength: 1, maxLength: 280 },
    completed: { type: 'boolean' },
    createdAt: { type: 'number' },
  },
  required: ['id', 'title', 'completed', 'createdAt'],
  additionalProperties: false,
} as const satisfies JSONSchema;

export type TodoSchema = FromSchema<typeof todoSchema>;

export const getTodosSchema = {
  querystring: {
    type: 'object',
    properties: {
      search: { type: 'string' },
      sort: {
        type: 'string',
        enum: ['asc', 'desc'],
      },
    },
    required: [],
    additionalProperties: false,
  } as const satisfies JSONSchema,
  response: {
    200: {
      type: 'array',
      items: todoSchema,
      additionalProperties: false,
    } as const satisfies JSONSchema,
  },
} as const satisfies FastifySchema;

export type GetTodosParams = FromSchema<(typeof getTodosSchema)['querystring']>;
export type GetTodosData = FromSchema<(typeof getTodosSchema)['response']['200']>;

export const createTodoSchema = {
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 280 },
      completed: { type: 'boolean' },
    },
    required: ['title', 'completed'],
    additionalProperties: false,
  } as const satisfies JSONSchema,
  response: {
    200: todoSchema,
  },
} as const satisfies FastifySchema;

export type CreateTodoParams = FromSchema<(typeof createTodoSchema)['body']>;
export type CreateTodoData = FromSchema<(typeof createTodoSchema)['response']['200']>;

export const updateTodoSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
    additionalProperties: false,
  } as const satisfies JSONSchema,
  body: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1, maxLength: 280 },
      completed: { type: 'boolean' },
    },
    required: [],
    additionalProperties: false,
  } as const satisfies JSONSchema,
  response: {
    200: todoSchema,
  },
} as const satisfies FastifySchema;

export type UpdateTodoParams = FromSchema<(typeof updateTodoSchema)['params']> &
  FromSchema<(typeof updateTodoSchema)['body']>;
export type UpdateTodoData = FromSchema<(typeof updateTodoSchema)['response']['200']>;

export const deleteTodoSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'number' },
    },
    required: ['id'],
    additionalProperties: false,
  } as const satisfies JSONSchema,
  response: {
    200: todoSchema,
  },
} as const satisfies FastifySchema;

export type DeleteTodoParams = FromSchema<(typeof deleteTodoSchema)['params']>;
export type DeleteTodoData = FromSchema<(typeof deleteTodoSchema)['response']['200']>;
