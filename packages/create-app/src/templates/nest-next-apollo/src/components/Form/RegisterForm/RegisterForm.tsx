import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/Common/Button/Button';
import Spinner from '@/components/Common/Spinner/Spinner';
import useAuth from '@/graphql/actions/useAuth';

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
  const { t } = useTranslation();

  const { register, registerLoading, registerError } = useAuth();

  const loading = registerLoading;
  const error = registerError;

  const form = useForm<RegisterFormData>({
    resolver: yupResolver(yup.object({
      firstName: yup.string()
        .required(t('forms.auth.validation.firstName.required'))
        .min(2, t('forms.auth.validation.firstName.min', { count: 2 })),
      lastName: yup.string()
        .required(t('forms.auth.validation.lastName.required'))
        .min(2, t('forms.auth.validation.lastName.min', { count: 2 })),
      email: yup.string()
        .required(t('forms.auth.validation.email.required'))
        .email(t('forms.auth.validation.email.email')),
      password: yup.string()
        .required(t('forms.auth.validation.password.required'))
        .min(8, t('forms.auth.validation.password.min', { count: 8 })),
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
        <input css={styles.input} type="text" placeholder={t('forms.auth.firstName')} autoFocus {...form.register('firstName')} />
        <small css={styles.error}>{formErrors.firstName?.message}</small>
      </div>
      <div css={styles.group}>
        <input css={styles.input} type="text" placeholder={t('forms.auth.lastName')} {...form.register('lastName')} />
        <small css={styles.error}>{formErrors.lastName?.message}</small>
      </div>
      <div css={styles.group}>
        <input css={styles.input} type="email" placeholder={t('forms.auth.email')} {...form.register('email')} />
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
