import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/Base/Button/Button';
import Spinner from '@/components/Base/Spinner/Spinner';
import useAuth from '@/hooks/useAuth';

import styles from './LoginForm.styles';

export type LoginFormData = {
  email: string,
  password: string,
};

export type LoginFormProps = {
  onAfterSubmit?: () => void,
};

export default function LoginForm({ onAfterSubmit }: LoginFormProps) {
  const { loading, error, login } = useAuth();

  const form = useForm<LoginFormData>({
    resolver: yupResolver(yup.object({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    })),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const formErrors = form.formState.errors;

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      await login(formData.email, formData.password);

      onAfterSubmit?.();
    } catch (err) {
      //
    }
  });

  return (
    <form css={styles.form(loading)} noValidate onSubmit={handleSubmit}>
      <div css={styles.group}>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input css={styles.input} type="email" placeholder="Email" autoFocus {...form.register('email')} />
        <small css={styles.error}>{formErrors.email?.message}</small>
      </div>
      <div css={styles.group}>
        <input css={styles.input} type="password" placeholder="Password" {...form.register('password')} />
        <small css={styles.error}>{formErrors.password?.message}</small>
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
