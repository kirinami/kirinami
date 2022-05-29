import Modal from '@/components/Base/Modal/Modal';
import RegisterForm from '@/components/Form/RegisterForm/RegisterForm';
import useAuth from '@/hooks/useAuth';

import styles from './RegisterModal.styles';

export default function RegisterModal() {
  const { isOpenRegisterModal, closeRegisterModal } = useAuth();

  return (
    <Modal isOpen={isOpenRegisterModal} onRequestClose={closeRegisterModal}>
      <div css={styles.content}>
        <h3 css={styles.heading}>Register</h3>
        <RegisterForm onAfterSubmit={closeRegisterModal} />
      </div>
    </Modal>
  );
}
