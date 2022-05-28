import Modal from '@/components/Base/Modal/Modal';
import LoginForm from '@/components/Form/LoginForm/LoginForm';
import useAuth from '@/hooks/useAuth';

import styles from './LoginModal.styles';

export default function LoginModal() {
  const { isOpenLoginModal, closeLoginModal } = useAuth();

  return (
    <Modal isOpen={isOpenLoginModal} onRequestClose={closeLoginModal}>
      <div css={styles.content}>
        <h3 css={styles.heading}>Login</h3>
        <LoginForm onAfterSubmit={closeLoginModal} />
      </div>
    </Modal>
  );
}
