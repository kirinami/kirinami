import { createAsyncThunk } from '@reduxjs/toolkit';

import Todo from '@/types/Todo';
import http from '@/utils/http';

type Req = Pick<Todo, 'id'>;

type Res = Req;

const todosDelete = createAsyncThunk<Res, Req>('todos/delete', async ({ id }) => {
  const { data: todo } = await http.delete<Res>(`/todos/${id}`);

  return todo;
});

export default todosDelete;
