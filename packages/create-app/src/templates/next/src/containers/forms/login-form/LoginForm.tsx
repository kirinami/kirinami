import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/button/Button';

import styles from './LoginForm.styles';

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
});

export default function LoginForm() {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <form css={styles.form} noValidate onSubmit={handleSubmit}>
      <input css={styles.input} type="email" {...form.register('email')} />
      <input css={styles.input} type="password" {...form.register('password')} />
      <div css={styles.actions}>
        <Button type="submit">Submit</Button>
        <div css={styles.actionsMessage}>
          {Object.entries(form.formState.errors).map(([key, error]) => <small key={key}>{error.message}</small>)}
        </div>
      </div>
    </form>
  );
}
