import { createAsyncThunk } from '@reduxjs/toolkit';

import Todo from '@/types/Todo';
import http from '@/utils/http';

type Req = void;

type Res = Todo[];

const todosRetrieve = createAsyncThunk<Res, Req>('todos/retrieve', async () => {
  const { data: todos } = await http.get<Res>('/todos');

  return todos;
});

export default todosRetrieve;
