import { mutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { UpdateTodoData, UpdateTodoParams } from '@/schemas/todoSchemas';
import { AppStore, useAppStore } from '@/stores/useAppStore';
import { usePick } from '@/utils/lib/zustand';

export function updateTodoMutationOptions({ fetcher }: Pick<AppStore, 'fetcher'>) {
  return mutationOptions({
    mutationFn: ({ id, ...body }: UpdateTodoParams): Promise<UpdateTodoData> =>
      fetcher(`/api/todos/${id}`, {
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

  const appStore = useAppStore(usePick(['fetcher']));

  return useMutation({
    ...updateTodoMutationOptions(appStore),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      void queryClient.invalidateQueries({
        queryKey: ['todos'],
      });
    },
  });
}
