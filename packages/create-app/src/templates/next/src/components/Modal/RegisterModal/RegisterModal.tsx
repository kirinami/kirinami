import { useCallback } from 'react';

import Modal from '@/components/Base/Modal/Modal';
import RegisterForm from '@/components/Form/RegisterForm/RegisterForm';
import useAuth from '@/hooks/useAuth';

import styles from './RegisterModal.styles';

export default function RegisterModal() {
  const { isOpenRegisterModal, setIsOpenRegisterModal } = useAuth();

  const handleRequestClose = useCallback(() => setIsOpenRegisterModal(false), []);

  return (
    <Modal isOpen={isOpenRegisterModal} onRequestClose={handleRequestClose}>
      <div css={styles.container}>
        <h3 css={styles.title}>Register</h3>
        <RegisterForm />
      </div>
    </Modal>
  );
}
