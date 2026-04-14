import { useTranslation } from 'react-i18next';
import { mutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { UpdateTodoData, UpdateTodoParams } from '@/schemas/todoSchemas';

export function updateTodoMutationOptions(language: string) {
  return mutationOptions({
    mutationFn: ({ id, ...body }: UpdateTodoParams): Promise<UpdateTodoData> =>
      fetch(`${import.meta.env.VITE_API_URL}/api/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': language,
        },
        body: JSON.stringify(body),
      }).then((response) => response.json()),
  });
}

export type UseUpdateTodoMutationOptions = Partial<
  Omit<ReturnType<typeof updateTodoMutationOptions>, 'mutationKey' | 'mutationFn'>
>;

export function useUpdateTodoMutation(options?: UseUpdateTodoMutationOptions) {
  const { i18n } = useTranslation();

  const queryClient = useQueryClient();

  return useMutation({
    ...updateTodoMutationOptions(i18n.language),
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      options?.onSuccess?.(data, variables, onMutateResult, context);

      void queryClient.invalidateQueries({
        queryKey: ['todos'],
      });
    },
  });
}
