import { useState } from 'react';

import Section from '@/components/section/Section';
import AddTodoModal from '@/containers/todos/AddTodoModal';
import TodosList from '@/containers/todos/TodosList';
import { Todo } from '@/types/todos';
import delay from '@/utils/delay';

export type TodosPageProps = Awaited<ReturnType<typeof getServerSideProps>>['props'];

export const getServerSideProps = async () => {
  await delay(500);

  const todos: Todo[] = [
    { id: 1, title: 'Todo 1', completed: false },
    { id: 2, title: 'Todo 2', completed: true },
    { id: 3, title: 'Todo 3', completed: false },
  ];

  return {
    props: {
      todos,
    },
  };
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
    await delay();
    setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));
    setTodosLoading((prevTodosLoading) => prevTodosLoading.filter((prevTodoLoading) => prevTodoLoading !== id));
  };

  const handleRemoveTodo = async (id: number) => {
    setTodosLoading((prevTodosLoading) => [...prevTodosLoading, id]);
    await delay();
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setTodosLoading((prevTodosLoading) => prevTodosLoading.filter((prevTodoLoading) => prevTodoLoading !== id));
  };

  const handleSubmitTodo = async (title: string, completed: boolean) => {
    setAddModalLoading(true);
    await delay();
    setTodos((prevTodos) => [...prevTodos, {
      id: Math.round(Math.random() * 1000000),
      title,
      completed,
    }]);
    setAddModalLoading(false);
  };

  return (
    <Section title="Todos" page="pages/todos.tsx">
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
    </Section>
  );
}
