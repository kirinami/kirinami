import useAuth from '@/hooks/useAuth';

import styles from './Auth.styles';

export default function Auth() {
  const { user, logout, openLogin, openRegister } = useAuth();

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
          <button css={styles.button} type="button" onClick={openLogin}>
            <small>Login</small>
          </button>
          <small>{' | '}</small>
          <button css={styles.button} type="button" onClick={openRegister}>
            <small>Register</small>
          </button>
        </>
      )}
    </div>
  );
}
