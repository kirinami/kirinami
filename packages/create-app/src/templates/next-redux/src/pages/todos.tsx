import { useState } from 'react';

import Container from '@/components/container/Container';
import AddTodoModal from '@/containers/todos/AddTodoModal';
import TodosList from '@/containers/todos/TodosList';
import initServerSideProps from '@/helpers/initServerSideProps';
import useAction from '@/hooks/useAction';
import todosRetrieve from '@/stores/todos/actions/retrieve';
import todosAdd from '@/stores/todos/actions/add';
import todosUpdate from '@/stores/todos/actions/update';
import todosDelete from '@/stores/todos/actions/delete';
import useTodos from '@/stores/todos/selectors/useTodos';

export const getServerSideProps = initServerSideProps(({ reduxStore }) => async () => {
  await reduxStore.dispatch(todosRetrieve());

  return {
    props: {},
  };
});

export default function TodosPage() {
  const [addModalVisible, setAddModalVisible] = useState(false);

  const [addTodo, addTodoState] = useAction(todosAdd);
  const [updateTodo, updateTodoState] = useAction(todosUpdate);
  const [deleteTodo, deleteTodoState] = useAction(todosDelete);

  const todos = useTodos();

  const handleAddModalOpen = () => setAddModalVisible(true);

  const handleAddModalClose = () => setAddModalVisible(false);

  const handleTodoComplete = async (id: number, completed: boolean) => {
    await updateTodo({ id, completed }, id);
  };

  const handleRemoveTodo = async (id: number) => {
    await deleteTodo({ id }, id);
  };

  const handleSubmitTodo = async (title: string, completed: boolean) => {
    await addTodo({
      title,
      completed,
    });
  };

  return (
    <Container title="Todos" page="pages/todos.tsx">
      <AddTodoModal
        visible={addModalVisible}
        loading={addTodoState('loading')}
        onSubmit={handleSubmitTodo}
        onClose={handleAddModalClose}
      />

      <TodosList
        todos={todos}
        completeLoading={(id) => updateTodoState('loading', id) || deleteTodoState('loading', id)}
        onComplete={handleTodoComplete}
        onRemove={handleRemoveTodo}
        onAdd={handleAddModalOpen}
      />
    </Container>
  );
}
