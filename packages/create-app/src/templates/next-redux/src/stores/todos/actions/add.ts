import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '@/utils/request';

import Todo from '../types/Todo';

type Req = Pick<Todo, 'title' | 'completed'>;

type Res = Todo;

const todosAdd = createAsyncThunk<Res, Req>('todos/add', async ({ title, completed }) => {
  const todo = await request<Res>('POST', '/todos', {
    title,
    completed,
  });

  return todo;
});

export default todosAdd;
