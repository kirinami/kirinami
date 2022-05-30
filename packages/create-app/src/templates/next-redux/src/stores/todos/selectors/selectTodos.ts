import { State } from '@/hooks/useSelector';

const selectTodos = (state: State) => state.todos.todos;

export default selectTodos;
