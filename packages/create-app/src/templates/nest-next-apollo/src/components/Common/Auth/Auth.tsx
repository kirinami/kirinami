import { useTranslation } from 'react-i18next';

import useAuth from '@/graphql/actions/useAuth';

import styles from './Auth.styles';

export default function Auth() {
  const { t } = useTranslation();

  const { user, logout, openLogin, openRegister } = useAuth();

  return (
    <div css={styles.auth}>
      {user ? (
        <>
          <div>{user.firstName} {user.lastName}</div>
          <button css={styles.button} type="button" onClick={logout}>{t('auth.logout')}</button>
        </>
      ) : (
        <>
          <button css={styles.button} type="button" onClick={openLogin}>{t('auth.login')}</button>
          <button css={styles.button} type="button" onClick={openRegister}>{t('auth.register')}</button>
        </>
      )}
    </div>
  );
}
