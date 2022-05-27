import { useCallback } from 'react';

import Modal from '@/components/Base/Modal/Modal';
import LoginForm from '@/components/Form/LoginForm/LoginForm';
import useAuth from '@/hooks/useAuth';

import styles from './LoginModal.styles';

export default function LoginModal() {
  const { isOpenLoginModal, setIsOpenLoginModal } = useAuth();

  const handleRequestClose = useCallback(() => setIsOpenLoginModal(false), []);

  return (
    <Modal isOpen={isOpenLoginModal} onRequestClose={handleRequestClose}>
      <div css={styles.container}>
        <h3 css={styles.title}>Login</h3>
        <LoginForm />
      </div>
    </Modal>
  );
}
