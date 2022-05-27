import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/Base/Button/Button';

import styles from './RegisterForm.styles';

const schema = yup.object({
  firstName: yup.string().required().min(2),
  lastName: yup.string().required().min(2),
  email: yup.string().required().email(),
  password: yup.string().required().min(8),
});

export default function RegisterForm() {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });
  const formErrors = form.formState.errors;

  const handleSubmit = form.handleSubmit((formData) => {
    console.log(formData);
  });

  return (
    <form css={styles.form} noValidate onSubmit={handleSubmit}>
      <div css={styles.group}>
        <input css={styles.input} type="text" placeholder="First Name" {...form.register('firstName')} />
        <small css={styles.inputError}>{formErrors.firstName?.message}</small>
      </div>
      <div css={styles.group}>
        <input css={styles.input} type="text" placeholder="Last Name" {...form.register('lastName')} />
        <small css={styles.inputError}>{formErrors.lastName?.message}</small>
      </div>
      <div css={styles.group}>
        <input css={styles.input} type="email" placeholder="Email" {...form.register('email')} />
        <small css={styles.inputError}>{formErrors.email?.message}</small>
      </div>
      <div css={styles.group}>
        <input css={styles.input} type="password" placeholder="Password" {...form.register('password')} />
        <small css={styles.inputError}>{formErrors.password?.message}</small>
      </div>
      <div css={styles.actions}>
        <Button type="submit">Submit</Button>
        {/* <small css={styles.actionsMessage}>serverError.message</small> */}
      </div>
    </form>
  );
}
