import { queryOptions, useQuery } from '@tanstack/react-query';

import { GetTodosData, GetTodosParams } from '@/api/todos/schema';
import { AppStoreState, useAppStore } from '@/stores/useAppStore';

export function getTodosQueryOptions({ fetch }: AppStoreState, params: GetTodosParams) {
  return queryOptions<GetTodosData>({
    queryKey: ['todos'],
    queryFn: () => fetch(`/api/todos?${new URLSearchParams(params)}`).then((response) => response.json()),
  });
}

export type UseGetTodosQueryOptions = Partial<
  Omit<ReturnType<typeof getTodosQueryOptions>, 'queryKey' | 'queryHash' | 'queryKeyHashFn' | 'queryFn'>
>;

export function useGetTodosQuery(params: GetTodosParams, options?: UseGetTodosQueryOptions) {
  const appState = useAppStore();

  return useQuery({
    ...getTodosQueryOptions(appState, params),
    ...options,
  });
}
