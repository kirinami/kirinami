import { createAsyncThunk } from '@reduxjs/toolkit';

import request from '@/utils/request';

import Todo from '../types/Todo';

type Req = void;

type Res = Todo[];

const todosRetrieve = createAsyncThunk<Res, Req>('todos/retrieve', async () => {
  console.log('request');
  const todos = await request<Res>('GET', '/todos');

  return todos;
});

export default todosRetrieve;
