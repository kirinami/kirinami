import useSelector, { State } from '@/hooks/useSelector';

export const selectTodos = (state: State) => state.todos.todos;

export default function useTodos() {
  return useSelector(selectTodos);
}
