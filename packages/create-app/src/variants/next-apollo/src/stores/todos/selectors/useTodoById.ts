import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { GET_TODO_BY_ID, GetTodoByIdData, GetTodoByIdVars } from '../queries/getById';

export default function useTodoById(id: number) {
  const { loading, data, error } = useQuery<GetTodoByIdData, GetTodoByIdVars>(GET_TODO_BY_ID, {
    variables: {
      id,
    },
  });

  return useMemo(() => ({ loading, todo: data?.todo, error }), [loading, data?.todo, error]);
}
