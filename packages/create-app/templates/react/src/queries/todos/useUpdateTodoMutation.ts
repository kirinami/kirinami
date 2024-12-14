import { DefaultError, useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';

import { UpdateTodoData, UpdateTodoParams } from '@/api/todos/schema';
import { AppStoreState, useAppStore } from '@/stores/useAppStore';

export function updateTodoMutationOptions({
  fetch,
}: AppStoreState): UseMutationOptions<UpdateTodoData, DefaultError, UpdateTodoParams> {
  return {
    mutationFn: ({ id, ...body }) =>
      fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((response) => response.json()),
  };
}

export type UseUpdateTodoMutationOptions = Partial<
  Omit<ReturnType<typeof updateTodoMutationOptions>, 'mutationKey' | 'mutationFn'>
>;

export function useUpdateTodoMutation(options?: UseUpdateTodoMutationOptions) {
  const queryClient = useQueryClient();

  const appState = useAppStore();

  return useMutation({
    ...updateTodoMutationOptions(appState),
    ...options,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      });

      options?.onSuccess?.(data, variables, context);
    },
  });
}
