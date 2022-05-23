import { createAsyncThunk } from '@reduxjs/toolkit';

import Todo from '@/types/Todo';
import http from '@/utils/http';

type Req = Pick<Todo, 'id'> & Partial<Pick<Todo, 'title' | 'completed'>>;

type Res = Todo;

const todosUpdate = createAsyncThunk<Res, Req>('todos/update', async ({ id, title, completed }) => {
  const { data: todo } = await http.patch<Res>(`/todos/${id}`, {
    title,
    completed,
  });

  return todo;
});

export default todosUpdate;
