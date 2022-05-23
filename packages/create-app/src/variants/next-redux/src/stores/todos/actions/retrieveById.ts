import { createAsyncThunk } from '@reduxjs/toolkit';

import Todo from '@/types/Todo';
import http from '@/utils/http';

type Req = Pick<Todo, 'id'>;

type Res = Todo;

const todosRetrieveById = createAsyncThunk<Res, Req>('todos/retrieveById', async ({ id }) => {
  const { data: todo } = await http.get<Res>(`/todos/${id}`);

  return todo;
});

export default todosRetrieveById;
