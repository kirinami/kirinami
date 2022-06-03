import { useCallback, useMemo } from 'react';
import { Reference, useMutation, useQuery } from '@apollo/client';

import useIsReady from '@/hooks/useIsReady';

import { TODOS_ALL_QUERY, TodosAllQuery } from '../queries/todos/todosAll';
import { TODOS_CREATE_MUTATION, TodosCreateInput, TodosCreateMutation } from '../mutations/todos/todosCreate';
import { TODOS_UPDATE_MUTATION, TodosUpdateInput, TodosUpdateMutation } from '../mutations/todos/todosUpdate';
import { TODOS_DELETE_MUTATION, TodosDeleteInput, TodosDeleteMutation } from '../mutations/todos/todosDelete';

export default function useTodos() {
  const isReady = useIsReady();

  const todosQueryResult = useQuery<TodosAllQuery>(TODOS_ALL_QUERY, {
    errorPolicy: 'ignore',
  });

  const [createTodoMutation, createTodoMutationResult] = useMutation<TodosCreateMutation, TodosCreateInput>(
    TODOS_CREATE_MUTATION,
  );
  const [updateTodoMutation, updateTodoMutationResult] = useMutation<TodosUpdateMutation, TodosUpdateInput>(
    TODOS_UPDATE_MUTATION,
  );
  const [deleteTodoMutation, deleteTodoMutationResult] = useMutation<TodosDeleteMutation, TodosDeleteInput>(
    TODOS_DELETE_MUTATION,
  );

  const todos = useMemo(() => todosQueryResult.data?.todos || [], [todosQueryResult.data?.todos]);

  const createTodo = useCallback(async (todo: TodosCreateInput['todo']) => {
    const { data, errors } = await createTodoMutation({
      variables: {
        todo,
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

    if (errors?.length) {
      throw errors[0];
    }

    return data?.todo;
  }, [createTodoMutation]);

  const updateTodo = useCallback(async (id: TodosUpdateInput['id'], todo: TodosUpdateInput['todo']) => {
    const { data, errors } = await updateTodoMutation({
      variables: {
        id,
        todo,
      },
    });

    if (errors?.length) {
      throw errors[0];
    }

    return data?.todo;
  }, [updateTodoMutation]);

  const deleteTodo = useCallback(async (id: TodosUpdateInput['id']) => {
    const { data, errors } = await deleteTodoMutation({
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

    if (errors?.length) {
      throw errors[0];
    }

    return data?.todo;
  }, [deleteTodoMutation]);

  return useMemo(() => ({
    todos,
    todosLoading: isReady && todosQueryResult.loading,
    todosError: todosQueryResult.error,

    createTodo,
    createTodoLoading: isReady && createTodoMutationResult.loading,
    createTodoError: createTodoMutationResult.error,

    updateTodo,
    updateTodoLoading: isReady && updateTodoMutationResult.loading,
    updateTodoError: updateTodoMutationResult.error,

    deleteTodo,
    deleteTodoLoading: isReady && deleteTodoMutationResult.loading,
    deleteTodoError: deleteTodoMutationResult.error,
  }), [
    isReady,

    todos,
    todosQueryResult.loading,
    todosQueryResult.error,

    createTodo,
    createTodoMutationResult.loading,
    createTodoMutationResult.error,

    deleteTodo,
    deleteTodoMutationResult.loading,
    deleteTodoMutationResult.error,

    updateTodo,
    updateTodoMutationResult.loading,
    updateTodoMutationResult.error,
  ]);
}
