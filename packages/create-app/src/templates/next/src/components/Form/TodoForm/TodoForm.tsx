import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/Base/Button/Button';
import { Todo } from '@/helpers/api/todosApi';

import Spinner from '../../Base/Spinner/Spinner';

import styles from './TodoForm.styles';

export type TodoFormData = {
  id?: number,
  title: string,
  completed: boolean,
};

export type TodoFormProps = {
  loading: boolean,
  todo?: Todo,
  onSubmit: (formData: TodoFormData) => void,
};

export default function TodoForm({ loading, todo, onSubmit }: TodoFormProps) {
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

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form css={styles.form} noValidate onSubmit={handleSubmit}>
      <div css={styles.group}>
        <input css={styles.input} type="text" placeholder="Title" disabled={loading} {...form.register('title')} />
        <small css={styles.error}>{formErrors.title?.message}</small>
      </div>
      <div css={styles.group}>
        <label css={styles.checkbox}>
          <input type="checkbox" disabled={loading} {...form.register('completed')} />
          <span>Completed</span>
        </label>
        <small css={styles.error}>{formErrors.completed?.message}</small>
      </div>
      <div css={styles.actions}>
        <Button css={styles.actionsButton} type="submit" disabled={loading}>
          {loading && (<Spinner variant="light" size={16} />)}
          <span>Submit</span>
        </Button>
        {/* <small css={styles.actionsMessage}>serverError.message</small> */}
      </div>
    </form>
  );
}
