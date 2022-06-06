import { useTranslation } from 'react-i18next';

import Modal from '@/components/Common/Modal/Modal';
import RegisterForm from '@/components/Form/RegisterForm/RegisterForm';
import useAuth from '@/graphql/actions/useAuth';

import styles from './RegisterModal.styles';

export default function RegisterModal() {
  const { t } = useTranslation();

  const { isRegisterOpen, closeRegister } = useAuth();

  return (
    <Modal isOpen={isRegisterOpen} onRequestClose={closeRegister}>
      <div css={styles.content}>
        <h3 css={styles.heading}>{t('modals.login.title')}</h3>
        <RegisterForm onAfterSubmit={closeRegister} />
      </div>
    </Modal>
  );
}
