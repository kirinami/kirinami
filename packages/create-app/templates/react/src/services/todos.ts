import type {
  CreateTodoData,
  CreateTodoParams,
  DeleteTodoData,
  DeleteTodoParams,
  GetTodosData,
  GetTodosParams,
  UpdateTodoData,
  UpdateTodoParams,
} from '@/api/todos/schema';

import { api } from './api';

export const todosApi = api
  .enhanceEndpoints({
    addTagTypes: ['Todo'],
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getTodos: build.query<GetTodosData, GetTodosParams>({
        query: (params) => ({
          method: 'GET',
          url: '/todos',
          params,
        }),
        providesTags: ['Todo'],
      }),
      createTodo: build.mutation<CreateTodoData, CreateTodoParams>({
        query: ({ ...body }) => ({
          method: 'POST',
          url: '/todos',
          body,
        }),
        invalidatesTags: ['Todo'],
      }),
      updateTodo: build.mutation<UpdateTodoData, UpdateTodoParams>({
        query: ({ id, ...body }) => ({
          method: 'PATCH',
          url: `/todos/${id}`,
          body,
        }),
        invalidatesTags: ['Todo'],
      }),
      deleteTodo: build.mutation<DeleteTodoData, DeleteTodoParams>({
        query: ({ id }) => ({
          method: 'DELETE',
          url: `/todos/${id}`,
        }),
        invalidatesTags: ['Todo'],
      }),
    }),
    overrideExisting: true,
  });

export const { useGetTodosQuery, useCreateTodoMutation, useUpdateTodoMutation, useDeleteTodoMutation } = todosApi;
