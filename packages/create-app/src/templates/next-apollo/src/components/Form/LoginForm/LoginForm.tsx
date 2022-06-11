import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/Common/Button/Button';
import Spinner from '@/components/Common/Spinner/Spinner';
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
  const { t } = useTranslation();

  const { login, loginLoading, loginError } = useAuth();

  const loading = loginLoading;
  const error = loginError;

  const form = useForm<LoginFormData>({
    resolver: yupResolver(yup.object({
      email: yup.string()
        .required(t('forms.auth.validation.email.required'))
        .email(t('forms.auth.validation.email.email')),
      password: yup.string()
        .required(t('forms.auth.validation.password.required'))
        .min(8, t('forms.auth.validation.password.min', {
          count: 8,
        })),
    })),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const formErrors = form.formState.errors;

  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      await login(formData);

      onAfterSubmit?.();
    } catch (err) {
      //
    }
  });

  return (
    <form css={styles.form(loading)} noValidate onSubmit={handleSubmit}>
      <div css={styles.group}>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <input css={styles.input} type="email" placeholder={t('forms.auth.email')} autoFocus {...form.register('email')} />
        <small css={styles.error}>{formErrors.email?.message}</small>
      </div>
      <div css={styles.group}>
        <input css={styles.input} type="password" placeholder={t('forms.auth.password')} {...form.register('password')} />
        <small css={styles.error}>{formErrors.password?.message}</small>
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
