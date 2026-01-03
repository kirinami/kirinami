import { mutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';

import { UpdateTodoParams } from '@/schemas/todoSchemas';
import { AppStoreState, useAppStore } from '@/stores/useAppStore';

export function updateTodoMutationOptions({ fetch }: Pick<AppStoreState, 'fetch'>) {
  return mutationOptions({
    mutationFn: ({ id, ...body }: UpdateTodoParams) =>
      fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }).then((response) => response.json()),
  });
}

export type UseUpdateTodoMutationOptions = Partial<
  Omit<ReturnType<typeof updateTodoMutationOptions>, 'mutationKey' | 'mutationFn'>
>;

export function useUpdateTodoMutation(options?: UseUpdateTodoMutationOptions) {
  const queryClient = useQueryClient();

  const appState = useAppStore(useShallow(({ fetch }) => ({ fetch })));

  return useMutation({
    ...updateTodoMutationOptions(appState),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      void queryClient.invalidateQueries({
        queryKey: ['todos'],
      });
    },
  });
}
