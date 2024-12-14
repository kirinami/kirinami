import { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import { FastifyInstance } from 'fastify';

import { createTodoSchema, deleteTodoSchema, getTodosSchema, TodoSchema, updateTodoSchema } from './schema';

const todosStorage: TodoSchema[] = [
  { id: 1, title: 'Todo 1', completed: true, createdAt: 1702705200000 },
  { id: 2, title: 'Todo 2', completed: true, createdAt: 1704878000000 },
  { id: 3, title: 'Todo 3', completed: true, createdAt: 1708964400000 },
  { id: 4, title: 'Todo 4', completed: true, createdAt: 1710050800000 },
];

export async function todos(fastify: FastifyInstance) {
  const app = fastify.withTypeProvider<JsonSchemaToTsProvider>();

  app.get('/', { schema: getTodosSchema }, ({ headers, query }) => {
    if (query.search) {
      return todosStorage.filter((todo) => todo.title.toLowerCase().includes(query.search!.toLowerCase()));
    }

    if (query.sort) {
      return todosStorage
        .slice()
        .sort((a, b) => (query.sort === 'asc' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt));
    }

    return todosStorage;
  });

  app.post('/', { schema: createTodoSchema }, ({ body }) => {
    const todo = { ...body, id: Date.now(), createdAt: Date.now() } as TodoSchema;

    todosStorage.push(todo);

    return todo;
  });

  app.patch('/:id', { schema: updateTodoSchema }, ({ params, body }) => {
    const todoIndex = todosStorage.findIndex((todo) => todo.id === +params.id);

    if (todoIndex === -1) {
      throw new Error('Todo Not Found');
    }

    todosStorage[todoIndex] = { ...todosStorage[todoIndex], ...body };

    return todosStorage[todoIndex];
  });

  app.delete('/:id', { schema: deleteTodoSchema }, ({ params }) => {
    const todoIndex = todosStorage.findIndex((todo) => todo.id === +params.id);

    if (todoIndex === -1) {
      throw new Error('Todo Not Found');
    }

    const todo = todosStorage[todoIndex];

    todosStorage.splice(todoIndex, 1);

    return todo;
  });
}
