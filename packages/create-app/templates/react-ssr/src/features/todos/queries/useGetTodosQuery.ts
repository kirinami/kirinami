import { useTranslation } from 'react-i18next';
import { queryOptions, useQuery } from '@tanstack/react-query';

import { GetTodosData, GetTodosParams } from '@/features/todos/schemas/todoSchemas';

export function getTodosQueryOptions(language: string, params: GetTodosParams) {
  return queryOptions({
    queryKey: ['todos', params],
    queryFn: (): Promise<GetTodosData> =>
      fetch(`${import.meta.env.VITE_API_URL}/api/todos?${new URLSearchParams(params)}`, {
        method: 'GET',
        headers: {
          'Accept-Language': language,
        },
      }).then((response) => response.json()),
  });
}

export type UseGetTodosQueryOptions = Partial<
  Omit<ReturnType<typeof getTodosQueryOptions>, 'queryKey' | 'queryHash' | 'queryKeyHashFn' | 'queryFn'>
>;

export function useGetTodosQuery(params: GetTodosParams, options?: UseGetTodosQueryOptions) {
  const { i18n } = useTranslation();

  return useQuery({
    ...getTodosQueryOptions(i18n.language, params),
    ...options,
  });
}
