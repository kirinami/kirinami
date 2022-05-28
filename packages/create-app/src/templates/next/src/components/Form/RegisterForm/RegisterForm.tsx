import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/Base/Button/Button';
import Spinner from '@/components/Base/Spinner/Spinner';
import useAuth from '@/hooks/useAuth';

import styles from './RegisterForm.styles';

export type RegisterFormData = {
  firstName: string,
  lastName: string,
  email: string,
  password: string,
};

export type RegisterFormProps = {
  onAfterSubmit?: () => void,
};

export default function RegisterForm({ onAfterSubmit }: RegisterFormProps) {
  const { loading, error, register } = useAuth();

  const form = useForm<RegisterFormData>({
    resolver: yupResolver(yup.object({
      firstName: yup.string().required().min(2),
      lastName: yup.string().required().min(2),
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    })),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });
  const formErrors = form.formState.errors;

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      await register(formData.firstName, formData.lastName, formData.email, formData.password);

      onAfterSubmit?.();
    } catch (err) {
      //
    }
  });

  return (
    <form css={styles.form(loading)} noValidate onSubmit={handleSubmit}>
      <div css={styles.group}>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input css={styles.input} type="text" placeholder="First Name" autoFocus {...form.register('firstName')} />
        <small css={styles.error}>{formErrors.firstName?.message}</small>
      </div>
      <div css={styles.group}>
        <input css={styles.input} type="text" placeholder="Last Name" {...form.register('lastName')} />
        <small css={styles.error}>{formErrors.lastName?.message}</small>
      </div>
      <div css={styles.group}>
        <input css={styles.input} type="email" placeholder="Email" {...form.register('email')} />
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
