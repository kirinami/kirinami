import { createSelector } from 'reselect';

import useSelector from '@/hooks/useSelector';

import { selectTodos } from './useTodos';

export const selectTodoById = createSelector([selectTodos, (_, id: number) => id], (todos, id) => todos.find(todo => todo.id === id),
);

export default function useTodoById(id: number) {
  return useSelector(state => selectTodoById(state, id));
}
