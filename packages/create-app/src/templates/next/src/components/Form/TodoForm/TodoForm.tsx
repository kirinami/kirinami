import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/Base/Button/Button';
import Spinner from '@/components/Base/Spinner/Spinner';
import { Todo } from '@/helpers/api/todosApi';
import useTodos from '@/hooks/useTodos';

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
  const { loading, error, createTodo, updateTodo } = useTodos();

  const form = useForm<TodoFormData>({
    resolver: yupResolver(yup.object().shape({
      title: yup.string().required().min(2),
      completed: yup.boolean().required(),
    })),
    defaultValues: {
      title: todo?.title || '',
      completed: todo?.completed || false,
    },
  });
  const formErrors = form.formState.errors;

  const handleSubmit = form.handleSubmit(async (formData) => {
    if (todo) {
      await updateTodo(todo.id, formData);
    } else {
      await createTodo(formData);
    }

    onAfterSubmit?.();
  });

  return (
    <form css={styles.form(loading)} noValidate onSubmit={handleSubmit}>
      <div css={styles.group}>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input css={styles.input} type="text" placeholder="Title" autoFocus {...form.register('title')} />
        <small css={styles.error}>{formErrors.title?.message}</small>
      </div>
      <div css={styles.group}>
        <label css={styles.checkbox}>
          <input type="checkbox" {...form.register('completed')} />
          <span>Completed</span>
        </label>
        <small css={styles.error}>{formErrors.completed?.message}</small>
      </div>
      <div css={styles.actions}>
        <Button css={styles.actionsButton} type="submit">
          {loading && (<Spinner variant="light" size={16} />)}
          <span>Submit</span>
        </Button>
        <small css={styles.actionsMessage}>{error}</small>
      </div>
    </form>
  );
}
