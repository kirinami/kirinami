import { useState } from 'react';
import { Reference, useMutation } from '@apollo/client';

import Container from '@/components/container/Container';
import AddTodoModal from '@/containers/todos/AddTodoModal';
import TodosList from '@/containers/todos/TodosList';
import initServerSideProps from '@/helpers/initServerSideProps';
import { GET_TODOS } from '@/stores/todos/queries/get';
import { CREATE_TODO, CreateTodoData, CreateTodoVars } from '@/stores/todos/mutations/create';
import { UPDATE_TODO, UpdateTodoData, UpdateTodoVars } from '@/stores/todos/mutations/update';
import { DELETE_TODO, DeleteTodoData, DeleteTodoVars } from '@/stores/todos/mutations/delete';
import useTodos from '@/stores/todos/selectors/useTodos';

export const getServerSideProps = initServerSideProps(({ apolloClient }) => async () => {
  await apolloClient.query({
    query: GET_TODOS,
  });

  return {
    props: {},
  };
});

export default function TodosPage() {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [todosLoading, setTodosLoading] = useState<number[]>([]);

  const { todos } = useTodos();

  const [createTodo, createTodoState] = useMutation<CreateTodoData, CreateTodoVars>(CREATE_TODO);
  const [updateTodo] = useMutation<UpdateTodoData, UpdateTodoVars>(UPDATE_TODO);
  const [deleteTodo] = useMutation<DeleteTodoData, DeleteTodoVars>(DELETE_TODO);

  const handleAddModalOpen = () => setAddModalVisible(true);

  const handleAddModalClose = () => setAddModalVisible(false);

  const handleTodoComplete = async (id: number, completed: boolean) => {
    setTodosLoading((prevTodosLoading) => [...prevTodosLoading, id]);
    await updateTodo({
      variables: {
        id,
        todo: {
          completed,
        },
      },
    });
    setTodosLoading((prevTodosLoading) => prevTodosLoading.filter((prevTodoLoading) => prevTodoLoading !== id));
  };

  const handleRemoveTodo = async (id: number) => {
    setTodosLoading((prevTodosLoading) => [...prevTodosLoading, id]);
    await deleteTodo({
      variables: {
        id,
      },
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          fields: {
            todosAll: (todosRefs: Reference[], { readField }) => todosRefs.filter((todoRef) => readField('id', todoRef) !== data.todo.id),
          },
        });
      },
    });
    setTodosLoading((prevTodosLoading) => prevTodosLoading.filter((prevTodoLoading) => prevTodoLoading !== id));
  };

  const handleSubmitTodo = async (title: string, completed: boolean) => {
    await createTodo({
      variables: {
        todo: {
          title,
          completed,
        },
      },
      update(cache, { data }) {
        if (!data) return;

        cache.modify({
          fields: {
            todosAll: (todosRefs: Reference[], { toReference }) => [...todosRefs, toReference(data.todo)],
          },
        });
      },
    });
  };

  return (
    <Container title="Todos" page="pages/todos.tsx">
      <AddTodoModal
        visible={addModalVisible}
        loading={createTodoState.loading}
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
    </Container>
  );
}
