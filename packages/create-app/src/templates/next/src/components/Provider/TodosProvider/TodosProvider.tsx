import { createContext, ReactNode, useCallback, useEffect, useState } from 'react';

import { TodoFormData } from '@/components/Form/TodoForm/TodoForm';
import todosApi, { Todo } from '@/helpers/api/todosApi';
import useAuth from '@/hooks/useAuth';

export type TodosContextValue = {
  loading: boolean,
  error?: string,
  todos: Todo[],
  resetTodos: () => void,
  getTodos: () => void,
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
  const { eventEmitter } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [todos, setTodos] = useState(props.todos);

  const resetTodos = useCallback(() => setTodos([]), []);

  const getTodos = useCallback(async () => {
    console.log('getTodos');

    setLoading(true);
    setError('');

    try {
      const todos = await todosApi.getAll();

      setTodos(todos);
    } catch (err) {
      const error = new Error(err instanceof Error ? err.message : 'Undefined error occurred');
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTodo = useCallback(async (formData: TodoFormData) => {
    setLoading(true);
    setError('');

    try {
      const todo = await todosApi.create(formData);

      setTodos((prevTodos) => [...prevTodos, todo]);
    } catch (err) {
      const error = new Error(err instanceof Error ? err.message : 'Undefined error occurred');
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateTodo = useCallback(async (id, formData: Partial<TodoFormData>) => {
    setLoading(true);
    setError('');

    try {
      const todo = await todosApi.update(id, formData);

      setTodos((prevTodos) => prevTodos.map((prevTodo) => (prevTodo.id === todo.id ? { ...prevTodo, ...todo } : prevTodo)));
    } catch (err) {
      const error = new Error(err instanceof Error ? err.message : 'Undefined error occurred');
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeTodo = useCallback(async (id) => {
    setLoading(true);
    setError('');

    try {
      await todosApi.remove(id);

      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (err) {
      const error = new Error(err instanceof Error ? err.message : 'Undefined error occurred');
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loginSubscription = eventEmitter.subscribe('login', getTodos);
    const logoutSubscription = eventEmitter.subscribe('logout', resetTodos);

    return () => {
      loginSubscription();
      logoutSubscription();
    };
  }, [eventEmitter, getTodos, resetTodos]);

  return (
    <TodosContext.Provider
      value={{
        loading,
        error,
        todos,
        resetTodos,
        getTodos,
        createTodo,
        updateTodo,
        removeTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
}
