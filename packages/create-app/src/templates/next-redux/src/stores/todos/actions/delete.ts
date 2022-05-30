import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '@/utils/request';

import Todo from '../types/Todo';

type Req = Pick<Todo, 'id'>;

type Res = Req;

const todosDelete = createAsyncThunk<Res, Req>('todos/delete', async ({ id }) => {
  const todo = await request<Res>('DELETE', `/todos/${id}`);

  return todo;
});

export default todosDelete;
