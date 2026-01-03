import { queryOptions, useQuery } from '@tanstack/react-query';

import { GetTodosData, GetTodosParams } from '@/schemas/todoSchemas';
import { AppStore, useAppStore } from '@/stores/useAppStore';
import { usePick } from '@/utils/lib/zustand';

export function getTodosQueryOptions({ fetcher }: Pick<AppStore, 'fetcher'>, params: GetTodosParams) {
  return queryOptions({
    queryKey: ['todos', params],
    queryFn: (): Promise<GetTodosData> =>
      fetcher(`/api/todos?${new URLSearchParams(params)}`).then((response) => response.json()),
  });
}

export type UseGetTodosQueryOptions = Partial<
  Omit<ReturnType<typeof getTodosQueryOptions>, 'queryKey' | 'queryHash' | 'queryKeyHashFn' | 'queryFn'>
>;

export function useGetTodosQuery(params: GetTodosParams, options?: UseGetTodosQueryOptions) {
  const appStore = useAppStore(usePick(['fetcher']));

  return useQuery({
    ...getTodosQueryOptions(appStore, params),
    ...options,
  });
}
