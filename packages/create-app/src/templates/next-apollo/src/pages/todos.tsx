import { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { gql, useMutation, useQuery } from '@apollo/client';
import immer from 'immer';

import Title from '@/components/Common/Title/Title';
import Badge from '@/components/Common/Badge/Badge';
import Button from '@/components/Common/Button/Button';
import Section from '@/components/Common/Section/Section';
import TodoList from '@/components/Common/TodoList/TodoList';
import PageLayout from '@/components/Layout/PageLayout/PageLayout';
import EditTodoModal from '@/components/Modal/TodoModal/EditTodoModal/EditTodoModal';
import RemoveTodoModal from '@/components/Modal/TodoModal/RemoveTodoModal/RemoveTodoModal';
import { TODO, Todo } from '@/graphql/fragments/Todo';
import { FIND_ALL_TODOS, FindAllTodosData, FindAllTodosVars } from '@/graphql/queries/todos/findAllTodos';
import { UPDATE_TODO, UpdateTodoData, UpdateTodoVars } from '@/graphql/mutations/todos/updateTodo';
import useAuth from '@/hooks/useAuth';
import useRouteChange from '@/hooks/useRouteChange';

export default function TodosPage() {
  const { t } = useTranslation();

  const { user, openLogin } = useAuth();

  const { data, refetch, subscribeToMore } = useQuery<FindAllTodosData, FindAllTodosVars>(FIND_ALL_TODOS, {
    skip: !user,
    variables: {
      my: true,
    },
  });
  const [updateTodo] = useMutation<UpdateTodoData, UpdateTodoVars>(UPDATE_TODO);

  const todos = useMemo(() => data?.findAllTodos.todos || [], [data?.findAllTodos.todos]);
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

  useEffect(() => {
    const onCreateTodoUnsubscribe = subscribeToMore<any>({
      document: gql`
        ${TODO}

        subscription OnCreateTodo {
          onCreateTodo {
            ...Todo
          }
        }
      `,
      updateQuery: (previousData, { subscriptionData }) => {
        if (!previousData || !subscriptionData.data) {
          return previousData;
        }

        return immer(previousData, (draft) => {
          const createdTodo = subscriptionData.data.onCreateTodo;

          if (!draft.findAllTodos.todos.some((todo) => todo.id === createdTodo.id)) {
            draft.findAllTodos.todos.unshift(createdTodo);
            draft.findAllTodos.total += 1;
          }
        });
      },
      onError: () => null,
    });

    const onUpdateTodoUnsubscribe = subscribeToMore<any>({
      document: gql`
        ${TODO}

        subscription OnUpdateTodo {
          onUpdateTodo {
            ...Todo
          }
        }
      `,
      updateQuery: (previousData, { subscriptionData }) => {
        if (!previousData || !subscriptionData.data) {
          return previousData;
        }

        return immer(previousData, (draft) => {
          const updatedTodo = subscriptionData.data.onUpdateTodo;

          const todoIndex = draft.findAllTodos.todos.findIndex((todo) => todo.id === updatedTodo.id);

          if (todoIndex !== -1) {
            draft.findAllTodos.todos[todoIndex] = subscriptionData.data.onUpdateTodo;
          }
        });
      },
      onError: () => null,
    });

    const onDeleteTodoUnsubscribe = subscribeToMore<any>({
      document: gql`
        ${TODO}

        subscription OnDeleteTodo {
          onDeleteTodo {
            ...Todo
          }
        }
      `,
      updateQuery: (previousData, { subscriptionData }) => {
        if (!previousData || !subscriptionData.data) {
          return previousData;
        }

        return immer(previousData, (draft) => {
          const deletedTodo = subscriptionData.data.onDeleteTodo;

          draft.findAllTodos.todos = draft.findAllTodos.todos.filter((todo) => todo.id !== deletedTodo.id);
        });
      },
      onError: () => null,
    });

    return () => {
      onCreateTodoUnsubscribe();
      onUpdateTodoUnsubscribe();
      onDeleteTodoUnsubscribe();
    };
  }, [user, subscribeToMore]);

  useRouteChange(refetch);

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
