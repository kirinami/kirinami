import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Reference } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { omit } from 'lodash';
import * as yup from 'yup';

import Button from '@/components/Common/Button/Button';
import Spinner from '@/components/Common/Spinner/Spinner';
import { FindAllTodosQuery, Todo, useCreateTodoMutation, useUpdateTodoMutation } from '@/graphql/schema';
import useAuth from '@/hooks/useAuth';

import styles from './TodoForm.styles';

export type TodoFormData = {
  id?: number;
  title: string;
  completed: boolean;
};

export type TodoFormProps = {
  todo?: FindAllTodosQuery['findAllTodos']['todos'][0];
  onAfterSubmit?: () => void;
};

export default function TodoForm({ todo, onAfterSubmit }: TodoFormProps) {
  const { t } = useTranslation();

  const { user } = useAuth();

  const [createTodo, { loading: createLoading, error: createError }] = useCreateTodoMutation();
  const [updateTodo, { loading: updateLoading, error: updateError }] = useUpdateTodoMutation();

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  const form = useForm<TodoFormData>({
    resolver: yupResolver(
      yup.object({
        title: yup
          .string()
          .required(t('forms.todo.validation.title.required'))
          .min(2, t('forms.todo.validation.title.min', { count: 2 })),
        completed: yup.boolean().required(t('forms.todo.validation.completed.required')),
      })
    ),
    defaultValues: {
      title: todo?.title || '',
      completed: todo?.completed || false,
    },
  });
  const formErrors = form.formState.errors;

  const handleSubmit = form.handleSubmit(async (formData) => {
    if (!user) return;

    try {
      if (todo?.id) {
        await updateTodo({
          variables: {
            id: todo.id,
            input: {
              ...omit(formData, 'user'),
              userId: user.id,
            },
          },
        });
      } else {
        await createTodo({
          variables: {
            input: {
              ...omit(formData, 'user'),
              userId: user.id,
            },
          },
          update(cache, { data }) {
            if (!data) return;

            cache.modify({
              fields: {
                findAllTodos: (ref, { toReference, readField }) => {
                  if (ref.todos.some((todo: Reference) => readField('id', todo) === data.createTodo.id)) {
                    return ref;
                  }

                  return {
                    ...ref,
                    todos: [toReference(data.createTodo), ...ref.todos],
                    total: ref.total + 1,
                  };
                },
              },
            });
          },
        });
      }

      onAfterSubmit?.();
    } catch (err) {
      //
    }
  });

  return (
    <form css={styles.form(loading)} noValidate onSubmit={handleSubmit}>
      <div css={styles.group}>
        <input css={styles.input} type="text" placeholder={t('forms.todo.title')} autoFocus {...form.register('title')} />
        <small css={styles.error}>{formErrors.title?.message}</small>
      </div>
      <div css={styles.group}>
        <label css={styles.checkbox}>
          <input type="checkbox" {...form.register('completed')} />
          <span>{t('common.completed')}</span>
        </label>
        <small css={styles.error}>{formErrors.completed?.message}</small>
      </div>
      <div css={styles.actions}>
        <Button css={styles.actionsButton} type="submit">
          {loading && <Spinner variant="light" size={16} />}
          <span>{t('common.submit')}</span>
        </Button>
        <small css={styles.actionsMessage}>{error?.message}</small>
      </div>
    </form>
  );
}
