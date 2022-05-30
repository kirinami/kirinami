import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '@/utils/request';

import Todo from '../types/Todo';

type Req = Pick<Todo, 'id'> & Partial<Pick<Todo, 'title' | 'completed'>>;

type Res = Todo;

const todosUpdate = createAsyncThunk<Res, Req>('todos/update', async ({ id, title, completed }) => {
  const todo = await request<Res>('PATCH', `/todos/${id}`, {
    title,
    completed,
  });

  return todo;
});

export default todosUpdate;
