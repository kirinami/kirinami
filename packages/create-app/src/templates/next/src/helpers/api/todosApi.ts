import request from '@/utils/request';

export type Todo = {
  id: number,
  title: string,
  completed: boolean,
};

export type CreateTodo = Omit<Todo, 'id'>;

export type UpdateTodo = Partial<Omit<Todo, 'id'>>;

const todosApi = {
  getAll: () => request<Todo[]>('GET', '/todos'),
  getOne: (id: number) => request<Todo>('GET', `/todos/${id}`),
  create: (payload: CreateTodo) => request<Todo>('POST', '/todos', payload),
  update: (id: number, payload: UpdateTodo) => request<Todo>('PATCH', `/todos/${id}`, payload),
  remove: (id: number) => request<Todo>('DELETE', `/todos/${id}`),
};

export default todosApi;
