export default function useTodos(): any {
  // const getTodosQueryResult = useQuery<TodosAllQuery>(TODOS_ALL_QUERY, {
  //   errorPolicy: 'ignore',
  // });
  //
  // const [createTodoMutation, createTodoMutationResult] = useMutation<TodosCreateMutation, TodosCreateInput>(TODOS_CREATE_MUTATION);
  // const [updateTodoMutation, updateTodoMutationResult] = useMutation<TodosUpdateMutation, TodosUpdateInput>(TODOS_UPDATE_MUTATION);
  // const [deleteTodoMutation, deleteTodoMutationResult] = useMutation<TodosDeleteMutation, TodosDeleteInput>(TODOS_DELETE_MUTATION);
  //
  // const loading = getTodosQueryResult.loading
  //   || createTodoMutationResult.loading
  //   || updateTodoMutationResult.loading
  //   || deleteTodoMutationResult.loading;
  //
  // const error = getTodosQueryResult.error
  //   || createTodoMutationResult.error
  //   || updateTodoMutationResult.error
  //   || deleteTodoMutationResult.error;
  //
  // const todos = useMemo(() => getTodosQueryResult.data?.todos || [], [getTodosQueryResult.data?.todos]);
  //
  // const createTodo = useCallback(async (todo: TodosCreateInput['todo']) => {
  //   const { data, errors } = await createTodoMutation({
  //     variables: {
  //       todo,
  //     },
  //     update(cache, { data }) {
  //       if (!data) return;
  //
  //       cache.modify({
  //         fields: {
  //           todosAll: (todosRefs: Reference[], { toReference }) => [...todosRefs, toReference(data.todo)],
  //         },
  //       });
  //     },
  //   });
  //
  //   if (errors?.length) {
  //     throw errors[0];
  //   }
  //
  //   return data?.todo;
  // }, [createTodoMutation]);
  //
  // const updateTodo = useCallback(async (id: TodosUpdateInput['id'], todo: TodosUpdateInput['todo']) => {
  //   const { data, errors } = await updateTodoMutation({
  //     variables: {
  //       id,
  //       todo,
  //     },
  //   });
  //
  //   if (errors?.length) {
  //     throw errors[0];
  //   }
  //
  //   return data?.todo;
  // }, [updateTodoMutation]);
  //
  // const deleteTodo = useCallback(async (id: TodosUpdateInput['id']) => {
  //   const { data, errors } = await deleteTodoMutation({
  //     variables: {
  //       id,
  //     },
  //     update(cache, { data }) {
  //       if (!data) return;
  //
  //       cache.modify({
  //         fields: {
  //           todosAll: (todosRefs: Reference[], { readField }) => todosRefs.filter((todoRef) => readField('id', todoRef) !== data.todo.id),
  //         },
  //       });
  //     },
  //   });
  //
  //   if (errors?.length) {
  //     throw errors[0];
  //   }
  //
  //   return data?.todo;
  // }, [deleteTodoMutation]);
  //
  // return { loading, error, todos, createTodo, updateTodo, deleteTodo };
}
