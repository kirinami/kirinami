import { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Button from '@/components/Common/Button/Button';
import useAuth from '@/hooks/useAuth';

import styles from './AuthForm.styles';

type Mode = 'login' | 'register';

export default function AuthForm() {
  const { t } = useTranslation();

  const { login, loginLoading, loginError, register, registerLoading, registerError } = useAuth();

  const [mode, setMode] = useState<Mode>('login');

  const handleMode = useCallback((mode: Mode) => () => setMode(mode), []);

  const loginSchema = useMemo(
    () =>
      yup.object({
        email: yup.string().email().required(t('auth_form.validation.required')),
        password: yup
          .string()
          .min(6, t('auth_form.validation.min', { count: 6 }))
          .required(t('auth_form.validation.required')),
      }),
    [t]
  );

  const loginForm = useForm<yup.InferType<typeof loginSchema>>({
    resolver: yupResolver(loginSchema),
  });

  const loginFormErrors = loginForm.formState.errors;

  const handleLoginFormSubmit = loginForm.handleSubmit((formData) => login(formData));

  const registerSchema = useMemo(
    () =>
      yup.object({
        firstName: yup
          .string()
          .min(2, t('auth_form.validation.min', { count: 2 }))
          .required(t('auth_form.validation.required')),
        lastName: yup
          .string()
          .min(2, t('auth_form.validation.min', { count: 2 }))
          .required(t('auth_form.validation.required')),
        email: yup.string().email(t('auth_form.validation.email')).required(t('auth_form.validation.required')),
        password: yup
          .string()
          .min(6, t('auth_form.validation.min', { count: 6 }))
          .required(t('auth_form.validation.required')),
      }),
    [t]
  );

  const registerForm = useForm<yup.InferType<typeof registerSchema>>({
    resolver: yupResolver(registerSchema),
  });

  const registerFormErrors = registerForm.formState.errors;

  const handleRegisterFormSubmit = registerForm.handleSubmit((formData) => register(formData));

  return (
    <div css={styles.authForm}>
      <div css={styles.tabs}>
        <button css={styles.tabsButton(mode === 'login')} type="button" onClick={handleMode('login')}>
          {t('auth_form.login')}
        </button>
        <button css={styles.tabsButton(mode === 'register')} type="button" onClick={handleMode('register')}>
          {t('auth_form.register')}
        </button>
      </div>

      {mode === 'login' && (
        <form css={styles.form} onSubmit={handleLoginFormSubmit}>
          <div css={styles.formField}>
            <input
              css={styles.formInput}
              {...loginForm.register('email')}
              type="email"
              placeholder={t('auth_form.fields.email')}
            />
            <small css={styles.formError}>{loginFormErrors.email?.message}</small>
          </div>
          <div css={styles.formField}>
            <input
              css={styles.formInput}
              {...loginForm.register('password')}
              type="password"
              placeholder={t('auth_form.fields.password')}
            />
            <small css={styles.formError}>{loginFormErrors.password?.message}</small>
          </div>
          {loginError?.message && <small css={styles.formError}>{t(loginError.message.toLowerCase())}</small>}
          <Button type="submit" loading={loginLoading}>
            {t('auth_form.fields.submit')}
          </Button>
        </form>
      )}

      {mode === 'register' && (
        <form css={styles.form} onSubmit={handleRegisterFormSubmit}>
          <div css={styles.formField}>
            <input
              css={styles.formInput}
              {...registerForm.register('firstName')}
              type="text"
              placeholder={t('auth_form.fields.firstName')}
            />
            <small css={styles.formError}>{registerFormErrors.firstName?.message}</small>
          </div>
          <div css={styles.formField}>
            <input
              css={styles.formInput}
              {...registerForm.register('lastName')}
              type="text"
              placeholder={t('auth_form.fields.lastName')}
            />
            <small css={styles.formError}>{registerFormErrors.lastName?.message}</small>
          </div>
          <div css={styles.formField}>
            <input
              css={styles.formInput}
              {...registerForm.register('email')}
              type="email"
              placeholder={t('auth_form.fields.email')}
            />
            <small css={styles.formError}>{registerFormErrors.email?.message}</small>
          </div>
          <div css={styles.formField}>
            <input
              css={styles.formInput}
              {...registerForm.register('password')}
              type="password"
              placeholder={t('auth_form.fields.password')}
            />
            <small css={styles.formError}>{registerFormErrors.password?.message}</small>
          </div>
          {registerError?.message && <small css={styles.formError}>{t(registerError.message.toLowerCase())}</small>}
          <Button type="submit" loading={registerLoading}>
            {t('auth_form.fields.submit')}
          </Button>
        </form>
      )}
    </div>
  );
}
