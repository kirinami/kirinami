import useAuth from '@/hooks/useAuth';

import styles from './Auth.styles';

export default function Auth() {
  const { user, logout, openLoginModal, openRegisterModal } = useAuth();

  return (
    <div css={styles.auth}>
      {user ? (
        <>
          <div><small>{user.firstName} {user.lastName}</small></div>
          <button css={styles.button} type="button" onClick={logout}>
            <small>Logout</small>
          </button>
        </>
      ) : (
        <>
          <button css={styles.button} type="button" onClick={openLoginModal}>
            <small>Login</small>
          </button>
          <small>{' | '}</small>
          <button css={styles.button} type="button" onClick={openRegisterModal}>
            <small>Register</small>
          </button>
        </>
      )}
    </div>
  );
}
