import { useCallback, useMemo, useState } from 'react';

import Badge from '@/components/Base/Badge/Badge';
import Button from '@/components/Base/Button/Button';
import Search from '@/components/Common/Search/Search';
import TodoList from '@/components/Common/TodoList/TodoList';
import EditTodoModal from '@/components/Modal/TodoModal/EditTodoModal/EditTodoModal';
import RemoveTodoModal from '@/components/Modal/TodoModal/RemoveTodoModal/RemoveTodoModal';
import PageLayout from '@/components/Layout/PageLayout/PageLayout';
import { Todo } from '@/helpers/api/todosApi';
import useTodos from '@/hooks/useTodos';

import styles from './HomePage.styles';

export default function HomePage() {
  const [editTodoModalOpen, setEditTodoModalOpen] = useState(false);
  const [editTodoModalTodo, setEditTodoModalTodo] = useState<Todo>();

  const [removeTodoModalOpen, setRemoveTodoModalOpen] = useState(false);
  const [removeTodoModalTodo, setRemoveTodoModalTodo] = useState<Todo>();

  const { todos, updateTodo } = useTodos();

  const holdTodos = todos; // useMemo(() => todos.filter((todo) => !todo.completed), [todos]);
  const completedTodos = useMemo(() => todos.filter((todo) => todo.completed), [todos]);

  const handleAdd = useCallback(() => {
    setEditTodoModalOpen(true);
    setEditTodoModalTodo(undefined);
  }, []);

  const handleChange = useCallback(async (changedTodo: Todo) => {
    await updateTodo(changedTodo.id, {
      completed: changedTodo.completed,
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
        <div css={styles.header}>
          <Search />
          <div css={styles.auth}>
            <button type="button">
              <small>Login</small>
            </button>
            {' | '}
            <button type="button">
              <small>Register</small>
            </button>
          </div>
        </div>

        <div css={styles.title}>
          <h1 css={styles.heading}>You’ve got <span>7 task</span> today</h1>
          <Button onClick={handleAdd}>Add New</Button>
        </div>

        <div css={styles.section}>
          <h3 css={styles.sectionTitle}>On Hold</h3>
          <TodoList todos={holdTodos} onChange={handleChange} onEdit={handleEdit} onRemove={handleRemove} />
        </div>

        <div css={styles.section}>
          <h3 css={styles.sectionTitle}>
            <span>Completed</span>
            <Badge variant="danger">Inactive</Badge>
          </h3>
          <TodoList readonly todos={completedTodos} />
        </div>
      </PageLayout>

      <EditTodoModal open={editTodoModalOpen} todo={editTodoModalTodo} onClose={handleModalClose} />
      <RemoveTodoModal open={removeTodoModalOpen} todo={removeTodoModalTodo} onClose={handleModalClose} />
    </>
  );
}
