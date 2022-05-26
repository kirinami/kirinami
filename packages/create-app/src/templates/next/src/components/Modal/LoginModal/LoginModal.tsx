import { useCallback, useState } from 'react';

import Modal from '@/components/Base/Modal/Modal';
import LoginForm from '@/components/Form/LoginForm/LoginForm';

import styles from './LoginModal.styles';

export default function LoginModal() {
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
