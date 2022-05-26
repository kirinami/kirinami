import { useCallback, useState } from 'react';

import Modal from '@/components/modal/Modal';
import LoginForm from '@/containers/forms/login-form/LoginForm';

import styles from './LoginFormModal.styles';

export default function LoginFormModal() {
  const [isOpen, setIsOpen] = useState(true);

  const handleRequestClose = useCallback(() => setIsOpen(false), []);

  return (
    <Modal isOpen={isOpen} onRequestClose={handleRequestClose}>
      <div css={styles.container}>
        <h3 css={styles.title}>Login:</h3>
        <LoginForm />
      </div>
    </Modal>
  );
}
