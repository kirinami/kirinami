import { useMemo } from 'react';
import { useQuery } from '@apollo/client';

import { GET_TODOS, GetTodosData, GetTodosVars } from '../queries/get';

export default function useTodos() {
  const { loading, data, error } = useQuery<GetTodosData, GetTodosVars>(GET_TODOS);

  return useMemo(() => ({ loading, todos: data?.todos || [], error }), [loading, data?.todos, error]);
}
