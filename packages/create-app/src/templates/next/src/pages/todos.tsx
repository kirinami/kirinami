import { useState } from 'react';

import Layout from '@/containers/layout/Layout';
import AddTodoModal from '@/containers/todos/AddTodoModal';
import TodosList from '@/containers/todos/TodosList';
import { Todo } from '@/types/todos';
import http from '@/utils/http';

export const getServerSideProps = async () => {
  const { data: todos } = await http.get<Todo[]>('/todos');

  return {
    props: {
      todos,
    },
  };
};

export type TodosPageProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];

export default function TodosPage(props: TodosPageProps) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addModalLoading, setAddModalLoading] = useState(false);

  const [todosLoading, setTodosLoading] = useState<number[]>([]);
  const [todos, setTodos] = useState(props.todos);

  const handleAddModalOpen = () => setAddModalVisible(true);

  const handleAddModalClose = () => setAddModalVisible(false);

  const handleTodoComplete = async (id: number, completed: boolean) => {
    setTodosLoading((prevTodosLoading) => [...prevTodosLoading, id]);
    await http.patch(`/todos/${id}`, {
      completed,
    });
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));
    setTodosLoading((prevTodosLoading) => prevTodosLoading.filter((prevTodoLoading) => prevTodoLoading !== id));
  };

  const handleRemoveTodo = async (id: number) => {
    setTodosLoading((prevTodosLoading) => [...prevTodosLoading, id]);
    await http.delete(`/todos/${id}`);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setTodosLoading((prevTodosLoading) => prevTodosLoading.filter((prevTodoLoading) => prevTodoLoading !== id));
  };

  const handleSubmitTodo = async (title: string, completed: boolean) => {
    setAddModalLoading(true);
    const { data: todo } = await http.post<Todo>('/todos', {
      title,
      completed,
    });
    setTodos((prevTodos) => [...prevTodos, todo]);
    setAddModalLoading(false);
  };

  return (
    <Layout title="Todos" page="pages/todos.tsx">
      <AddTodoModal
        visible={addModalVisible}
        loading={addModalLoading}
        onSubmit={handleSubmitTodo}
        onClose={handleAddModalClose}
      />

      <TodosList
        todos={todos}
        completeLoading={(id) => todosLoading.includes(id)}
        onComplete={handleTodoComplete}
        onRemove={handleRemoveTodo}
        onAdd={handleAddModalOpen}
      />
    </Layout>
  );
}
