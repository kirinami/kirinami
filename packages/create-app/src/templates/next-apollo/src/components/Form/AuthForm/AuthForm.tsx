import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { Button } from '@/components/Common/Button';
import { useLogin } from '@/hooks/auth/useLogin';
import { useRegister } from '@/hooks/auth/useRegister';

import { styles } from './AuthForm.styles';

const schema = yup.object({
  email: yup.string().required('auth_form.validation.required').email('auth_form.validation.email'),
  password: yup.string().required('auth_form.validation.required').min(6, 'auth_form.validation.min'),
});

type FormData = yup.InferType<typeof schema>;

type Mode = 'login' | 'register';

export function AuthForm() {
  const { t } = useTranslation();

  const { loading: loginLoading, error: loginError, login } = useLogin();
  const { loading: registerLoading, error: registerError, register } = useRegister();

  const [mode, setMode] = useState<Mode>('login');

  const handleMode = useCallback((mode: Mode) => () => setMode(mode), []);

  const loginForm = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const loginFormErrors = loginForm.formState.errors;

  const handleLoginFormSubmit = loginForm.handleSubmit((formData) => login(formData));

  const registerForm = useForm<FormData>({
    resolver: yupResolver(schema),
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
