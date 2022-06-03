import { useTranslation } from 'react-i18next';

import useAuth from '@/hooks/useAuth';

import styles from './Auth.styles';

export default function Auth() {
  const { t } = useTranslation();

  const { user, logout, openLogin, openRegister } = useAuth();

  return (
    <div css={styles.auth}>
      {user ? (
        <>
          <div><small>{user.firstName} {user.lastName}</small></div>
          <button css={styles.button} type="button" onClick={logout}>
            <small>{t('auth.logout')}</small>
          </button>
        </>
      ) : (
        <>
          <button css={styles.button} type="button" onClick={openLogin}>
            <small>{t('auth.login')}</small>
          </button>
          <button css={styles.button} type="button" onClick={openRegister}>
            <small>{t('auth.register')}</small>
          </button>
        </>
      )}
    </div>
  );
}
