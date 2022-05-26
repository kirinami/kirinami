import { useState } from 'react';

import PageLayout from '@/components/Layout/PageLayout/PageLayout';
import TodosList from '@/components/Common/TodosList';
import AddTodoModal from '@/components/Common/AddTodoModal';
import todosApi, { Todo } from '@/helpers/api/todosApi';

export type TodosPageProps = {
  todos: Todo[],
};

export default function TodosPage(props: TodosPageProps) {
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [addModalLoading, setAddModalLoading] = useState(false);

  const [todosLoading, setTodosLoading] = useState<number[]>([]);
  const [todos, setTodos] = useState(props.todos);

  const handleAddModalOpen = () => setAddModalVisible(true);

  const handleAddModalClose = () => setAddModalVisible(false);

  const handleTodoComplete = async (id: number, completed: boolean) => {
    setTodosLoading((prevTodosLoading) => [...prevTodosLoading, id]);
    await todosApi.update(id, {
      completed,
    });
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));
    setTodosLoading((prevTodosLoading) => prevTodosLoading.filter((prevTodoLoading) => prevTodoLoading !== id));
  };

  const handleRemoveTodo = async (id: number) => {
    setTodosLoading((prevTodosLoading) => [...prevTodosLoading, id]);
    await todosApi.remove(id);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setTodosLoading((prevTodosLoading) => prevTodosLoading.filter((prevTodoLoading) => prevTodoLoading !== id));
  };

  const handleSubmitTodo = async (title: string, completed: boolean) => {
    setAddModalLoading(true);
    const todo = await todosApi.create({
      title,
      completed,
    });
    setTodos((prevTodos) => [...prevTodos, todo]);
    setAddModalLoading(false);
  };

  return (
    <PageLayout title="Todos" page="pages/todos.tsx">
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
    </PageLayout>
  );
}
