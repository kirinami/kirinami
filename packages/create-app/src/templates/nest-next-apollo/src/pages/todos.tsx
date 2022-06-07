import { useCallback, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client';

import Title from '@/components/Common/Title/Title';
import Badge from '@/components/Common/Badge/Badge';
import Button from '@/components/Common/Button/Button';
import Section from '@/components/Common/Section/Section';
import TodoList from '@/components/Common/TodoList/TodoList';
import PageLayout from '@/components/Layout/PageLayout/PageLayout';
import EditTodoModal from '@/components/Modal/TodoModal/EditTodoModal/EditTodoModal';
import RemoveTodoModal from '@/components/Modal/TodoModal/RemoveTodoModal/RemoveTodoModal';
import { Todo } from '@/graphql/fragments/Todo';
import { RETRIEVE_TODOS, RetrieveTodosData, RetrieveTodosVars } from '@/graphql/queries/todos/retrieveTodos';
import { UPDATE_TODO, UpdateTodoData, UpdateTodoVars } from '@/graphql/mutations/todos/updateTodo';
import useAuth from '@/hooks/useAuth';

export default function TodosPage() {
  const { t } = useTranslation();

  const { user, openLogin } = useAuth();

  const { data } = useQuery<RetrieveTodosData, RetrieveTodosVars>(RETRIEVE_TODOS, {
    skip: !user,
    variables: {
      my: true,
    },
  });
  const [updateTodo] = useMutation<UpdateTodoData, UpdateTodoVars>(UPDATE_TODO);

  const todos = useMemo(() => data?.retrieveTodos.todos || [], [data?.retrieveTodos.todos]);
  const completedTodos = useMemo(() => todos.filter((todo) => todo.completed), [todos]);

  const [editTodoModalOpen, setEditTodoModalOpen] = useState(false);
  const [editTodoModalTodo, setEditTodoModalTodo] = useState<Todo>();

  const [removeTodoModalOpen, setRemoveTodoModalOpen] = useState(false);
  const [removeTodoModalTodo, setRemoveTodoModalTodo] = useState<Todo>();

  const handleAdd = useCallback(() => {
    if (user) {
      setEditTodoModalOpen(true);
      setEditTodoModalTodo(undefined);
    } else {
      openLogin();
    }
  }, [user, openLogin]);

  const handleClick = useCallback((todo: Todo) => {
    updateTodo({
      variables: {
        id: todo.id,
        input: {
          completed: !todo.completed,
        },
      },
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
    <PageLayout>
      <Title
        actions={(
          <Button onClick={handleAdd}>{t('pages.todos.add_new')}</Button>
        )}
      >
        <Trans
          t={t}
          i18nKey="pages.todos.title"
          values={{ count: todos.length - completedTodos.length }}
          components={[<span />]}
        />
      </Title>

      {todos.length > 0 && (
        <Section title={t('common.all')}>
          <TodoList todos={todos} onClick={handleClick} onEdit={handleEdit} onRemove={handleRemove} />
        </Section>
      )}

      {completedTodos.length > 0 && (
        <Section
          title={(
            <>
              <span>{t('common.completed')}</span>
              <Badge variant="danger">{t('common.inactive')}</Badge>
            </>
          )}
        >
          <TodoList readonly todos={completedTodos} />
        </Section>
      )}

      <EditTodoModal open={editTodoModalOpen} todo={editTodoModalTodo} onClose={handleModalClose} />
      <RemoveTodoModal open={removeTodoModalOpen} todo={removeTodoModalTodo} onClose={handleModalClose} />
    </PageLayout>
  );
}
