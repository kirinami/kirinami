import { createContext, ReactNode, useCallback, useState } from 'react';

import { TodoFormData } from '@/components/Form/TodoForm/TodoForm';
import todosApi, { Todo } from '@/helpers/api/todosApi';

export type TodosContextValue = {
  loading: boolean,
  error?: string,
  todos: Todo[],
  createTodo: (formData: TodoFormData) => Promise<void>,
  updateTodo: (id: number, formData: Partial<TodoFormData>) => Promise<void>,
  removeTodo: (id: number) => Promise<void>,
};

export const TodosContext = createContext({} as TodosContextValue);

export type TodosProviderProps = {
  todos: Todo[],
  children: ReactNode,
};

export default function TodosProvider({ children, ...props }: TodosProviderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [todos, setTodos] = useState(props.todos);

  const createTodo = useCallback(async (formData: TodoFormData) => {
    setLoading(true);

    try {
      const todo = await todosApi.create(formData);

      setTodos((prevTodos) => [...prevTodos, todo]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Undefined error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTodo = useCallback(async (id, formData: Partial<TodoFormData>) => {
    setLoading(true);

    try {
      const todo = await todosApi.update(id, formData);

      setTodos((prevTodos) => prevTodos.map((prevTodo) => (prevTodo.id === todo.id ? { ...prevTodo, ...todo } : prevTodo)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Undefined error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTodo = useCallback(async (id) => {
    setLoading(true);

    try {
      await todosApi.remove(id);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Undefined error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TodosContext.Provider
      value={{
        loading,
        error,
        todos,
        createTodo,
        updateTodo,
        removeTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}
