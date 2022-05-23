import { createAsyncThunk } from '@reduxjs/toolkit';

import Todo from '@/types/Todo';
import http from '@/utils/http';

type Req = Pick<Todo, 'title' | 'completed'>;

type Res = Todo;

const todosAdd = createAsyncThunk<Res, Req>('todos/add', async ({ title, completed }) => {
  const { data: todo } = await http.post<Res>('/todos', {
    title,
    completed,
  });

  return todo;
});

export default todosAdd;
