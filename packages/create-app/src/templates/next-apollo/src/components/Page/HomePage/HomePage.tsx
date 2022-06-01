import { useCallback, useMemo, useState } from 'react';

import Badge from '@/components/Common/Badge/Badge';
import Button from '@/components/Common/Button/Button';
import TodoList from '@/components/Common/TodoList/TodoList';
import PageLayout from '@/components/Layout/PageLayout/PageLayout';
import EditTodoModal from '@/components/Modal/TodoModal/EditTodoModal/EditTodoModal';
import RemoveTodoModal from '@/components/Modal/TodoModal/RemoveTodoModal/RemoveTodoModal';
import useAuth from '@/hooks/useAuth';
import useTodos from '@/hooks/useTodos';
import { Todo } from '@/stores/todos/fragments/Todo';

import Spinner from '../../Common/Spinner/Spinner';

import styles from './HomePage.styles';

export default function HomePage() {
  const [editTodoModalOpen, setEditTodoModalOpen] = useState(false);
  const [editTodoModalTodo, setEditTodoModalTodo] = useState<Todo>();

  const [removeTodoModalOpen, setRemoveTodoModalOpen] = useState(false);
  const [removeTodoModalTodo, setRemoveTodoModalTodo] = useState<Todo>();

  const { user, openLogin } = useAuth();
  const { loading, todos, updateTodo } = useTodos();

  const holdTodos = todos;
  const completedTodos = useMemo(() => todos.filter((todo) => todo.completed), [todos]);

  const handleAdd = useCallback(() => {
    if (user) {
      setEditTodoModalOpen(true);
      setEditTodoModalTodo(undefined);
    } else {
      openLogin();
    }
  }, [user, openLogin]);

  const handleClick = useCallback((todo: Todo) => {
    updateTodo(todo.id, {
      completed: !todo.completed,
    });
  }, [updateTodo]);

  const handleEdit = useCallback((todo: Todo) => {
    setEditTodoModalOpen(true);
    setEditTodoModalTodo(todo);
  }, []);

  const handleRemove = useCallback((todo: Todo) => {
    setRemoveTodoModalOpen(true);
    setRemoveTodoModalTodo(todo);
  }, []);

  const handleModalClose = useCallback(() => {
    setEditTodoModalOpen(false);
    setRemoveTodoModalOpen(false);
  }, []);

  return (
    <>
      <PageLayout>
        <div css={styles.title}>
          <h1 css={styles.heading}>You’ve got <span>{holdTodos.length} task</span> today</h1>
          <Button onClick={handleAdd}>Add New</Button>
        </div>

        {holdTodos.length > 0 && (
          <div css={styles.section}>
            <h3 css={styles.sectionTitle}>On Hold</h3>
            <TodoList todos={holdTodos} onClick={handleClick} onEdit={handleEdit} onRemove={handleRemove} />
          </div>
        )}

        {completedTodos.length > 0 && (
          <div css={styles.section}>
            <h3 css={styles.sectionTitle}>
              <span>Completed</span>
              <Badge variant="danger">Inactive</Badge>
            </h3>
            <TodoList readonly todos={completedTodos} />
          </div>
        )}

        {loading && (
          <div css={styles.spinner}>
            <Spinner size={32} />
          </div>
        )}
      </PageLayout>

      <EditTodoModal open={editTodoModalOpen} todo={editTodoModalTodo} onClose={handleModalClose} />
      <RemoveTodoModal open={removeTodoModalOpen} todo={removeTodoModalTodo} onClose={handleModalClose} />
    </>
  );
}
