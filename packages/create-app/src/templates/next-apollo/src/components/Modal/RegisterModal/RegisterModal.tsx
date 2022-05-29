import Modal from '@/components/Base/Modal/Modal';
import RegisterForm from '@/components/Form/RegisterForm/RegisterForm';
import useAuth from '@/hooks/useAuth';

import styles from './RegisterModal.styles';

export default function RegisterModal() {
  const { isRegisterOpen, closeRegister } = useAuth();

  return (
    <Modal isOpen={isRegisterOpen} onRequestClose={closeRegister}>
      <div css={styles.content}>
        <h3 css={styles.heading}>Register</h3>
        <RegisterForm onAfterSubmit={closeRegister} />
      </div>
    </Modal>
  );
}
