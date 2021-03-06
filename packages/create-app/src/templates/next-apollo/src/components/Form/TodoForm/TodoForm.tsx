import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/Common/Button/Button';
import Spinner from '@/components/Common/Spinner/Spinner';
import useTodos from '@/stores/actions/useTodos';
import { Todo } from '@/stores/fragments/Todo';

import styles from './TodoForm.styles';

export type TodoFormData = {
  id?: number,
  title: string,
  completed: boolean,
};

export type TodoFormProps = {
  todo?: Todo,
  onAfterSubmit?: () => void,
};

export default function TodoForm({ todo, onAfterSubmit }: TodoFormProps) {
  const { t } = useTranslation();

  const { createTodo, createTodoLoading, createTodoError, updateTodo, updateTodoLoading, updateTodoError } = useTodos();

  const loading = createTodoLoading || updateTodoLoading;
  const error = createTodoError || updateTodoError;

  const form = useForm<TodoFormData>({
    resolver: yupResolver(yup.object({
      title: yup.string()
        .required(t('forms.todo.validation.title.required'))
        .min(2, t('forms.todo.validation.title.min', { count: 2 })),
      completed: yup.boolean()
        .required(t('forms.todo.validation.completed.required')),
    })),
    defaultValues: {
      title: todo?.title || '',
      completed: todo?.completed || false,
    },
  });
  const formErrors = form.formState.errors;

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      if (todo) {
        await updateTodo(todo.id, formData);
      } else {
        await createTodo(formData);
      }

      onAfterSubmit?.();
    } catch (err) {
      //
    }
  });

  return (
    <form css={styles.form(loading)} noValidate onSubmit={handleSubmit}>
      <div css={styles.group}>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
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
          {loading && (<Spinner variant="light" size={16} />)}
          <span>{t('common.submit')}</span>
        </Button>
        <small css={styles.actionsMessage}>{error?.message}</small>
      </div>
    </form>
  );
}
