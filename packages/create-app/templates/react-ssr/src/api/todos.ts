import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import {
  createTodoSchema,
  deleteTodoSchema,
  getTodosSchema,
  TodoSchema,
  updateTodoSchema,
} from '@/schemas/todoSchemas';

const todosStorage: TodoSchema[] = [
  { id: 1, title: 'Todo 1', completed: true, createdAt: 1702705200000 },
  { id: 2, title: 'Todo 2', completed: true, createdAt: 1704878000000 },
  { id: 3, title: 'Todo 3', completed: true, createdAt: 1708964400000 },
  { id: 4, title: 'Todo 4', completed: true, createdAt: 1710050800000 },
];

export async function todosPlugin(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get('/', { schema: getTodosSchema }, ({ headers, query }) => {
    if (query.search) {
      const search = query.search.toLowerCase();

      return todosStorage.filter((todo) => todo.title.toLowerCase().includes(search));
    }

    if (query.sort) {
      return todosStorage
        .slice()
        .sort((a, b) => (query.sort === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt));
    }

    const language = headers['accept-language'] ?? 'unknown';

    return todosStorage.map((todo) => ({
      ...todo,
      title: `${todo.title} (${language})`,
    }));
  });

  app.post('/', { schema: createTodoSchema }, ({ body }) => {
    const todo = { ...body, id: Date.now(), createdAt: Date.now() } satisfies TodoSchema;

    todosStorage.push(todo);

    return todo;
  });

  app.patch('/:id', { schema: updateTodoSchema }, ({ params, body }) => {
    const todoIndex = todosStorage.findIndex((todo) => todo.id === params.id);

    if (todoIndex === -1) {
      throw new Error('Todo Not Found');
    }

    todosStorage[todoIndex] = { ...todosStorage[todoIndex], ...body };

    return todosStorage[todoIndex];
  });

  app.delete('/:id', { schema: deleteTodoSchema }, ({ params }) => {
    const todoIndex = todosStorage.findIndex((todo) => todo.id === params.id);

    if (todoIndex === -1) {
      throw new Error('Todo Not Found');
    }

    const todo = todosStorage[todoIndex];

    todosStorage.splice(todoIndex, 1);

    return todo;
  });
}
