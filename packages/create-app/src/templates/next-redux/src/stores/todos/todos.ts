import { createSlice } from '@reduxjs/toolkit';

import todosRetrieve from './actions/retrieve';
import todosAdd from './actions/add';
import todosUpdate from './actions/update';
import todosDelete from './actions/delete';
import Todo from './types/Todo';

type InitialState = {
  todos: Todo[],
};

const initialState: InitialState = {
  todos: [],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(todosRetrieve.fulfilled, (state, { payload }) => {
      state.todos = payload;
    });

    builder.addCase(todosAdd.fulfilled, (state, { payload }) => {
      state.todos.push(payload);
    });

    builder.addCase(todosUpdate.fulfilled, (state, { payload }) => {
      const todoIndex = state.todos.findIndex((todo) => todo.id === payload.id);
      if (todoIndex === -1) return;

      state.todos[todoIndex] = payload;
    });

    builder.addCase(todosDelete.fulfilled, (state, { payload }) => {
      state.todos = state.todos.filter((todo) => todo.id !== payload.id);
    });
  },
});

export default todosSlice;
